
function Rate(args) {
	try {
		if (!args.renderTo)
			throw "renderTo元素不存在，请检查ID是否存在";
		if (args.onClick && !$.isFunction(args.onClick))
			throw "onClick属性必须是方法,现在是" + typeof args.onClick;
		if (args.onComplete && !$.isFunction(args.onComplete))
			throw "onComplete属性必须是方法，现在是" + typeof args.onComplete;
		if (!args.dataSource)
			throw "缺失必要参数";
	} catch (e) {
		alert("下拉列表初始化失败，原因：" + e);
		return;
	}
	// 初始化下拉列表参数
	this.init(args);
}
Rate.prototype.init = function(args) {
	this.renderTo = $("#" + args.renderTo);
	// 数据源
	this.dataSource = args.dataSource;
    this.dataSource1 = args.dataSource1;
	this.mapping = args.mapping;
	// 客户端发送到后台的参数
	if (args.postData) {
		if (args.postData.pageNum == null)
			args.postData.pageNum = 1;
		if (args.postData.pageSize == null)
			args.postData.pageSize = 10;

	} else {
		args.postData = {
			pageNum : 1,
			pageSize : 10
		};
	}
	this.postData = args.postData;
	this.renderTo.data("args", args);
	// 根据传入的数据源获取数据
	this.getDataByDataSource();

}
//表格重构
Rate.prototype.reload = function(pageNum, pageSize) {
	var args = this.renderTo.data("args");
	args.postData.pageNum = pageNum;
	args.postData.pageSize = pageSize;
	// 重新生成表格，再次传入修改后的初始化参数
	this.init(args);

}
Rate.prototype.getDataByDataSource = function() {
	var t = this;
	if (typeof this.dataSource == "string") {
		$.post(this.dataSource, this.postData,function(res) {
			t.dataSource = res;
			// 生成元素
			t.build();
		});
        $.post(this.dataSource1, this.postData,function(res) {
            t.dataSource1 = res;
            // 生成元素
            t.build();
        });
	} else
		// 生成元素
		this.build();
	// 如果数据源是字符串，默认是url地址

}
Rate.prototype.build = function() {
	var t = this;
	this.renderTo.html("");
	this.renderTo.addClass("Rate");
	var top=$("<div class='top'></div>").appendTo(this.renderTo);
var top_score=$("<div class='top_score'></div>").appendTo(top);
var h=$("<h4>与描述相符</h4>").appendTo(top_score);
var word=$("<strong>4.9</strong>").appendTo(top_score);
var p=$("<p></p>").appendTo(top_score)
var span=$("<span class='span'><em></em></span>").appendTo(p);
var middle_score=$("<div class='middle_score'><span>大家都写到</span></div>").appendTo(top);
var rate1=$("<div class='rate1'></div>").appendTo(top);
var rete_span=$("<span class='rate_span'><a>物流快</a></span>").appendTo(rate1);
$("<span class='rate_span'><a>很便宜</a></span>").appendTo(rate1);
$("<span class='rate_span'><a>质量不错</a></span>").appendTo(rate1);
$("<span class='rate_span'><a>包装挺好的</a></span>").appendTo(rate1);
$("<span class='rate_span'><a>不好喝</a></span>").appendTo(rate1);
	var oul=$("<ul class='oul'></ul>").appendTo(this.renderTo);
    $(this.dataSource).each(
        function(i,row) {
            var oli=$("<li class='oli'></li>").appendTo(oul);
            var odiv=$("<div class='content'>"+t.dataSource[i].content+"</div>").appendTo(oli);
            var odiv1=$("<div class='content1'><img src=upload/"+t.dataSource[i].rateImg+"></div>").appendTo(oli);
            var odiv2=$("<div class='content2'>"+t.dataSource[i].createtime+"</div>").appendTo(oli);
            var odiv3=$("<div class='content3'></div>").appendTo(oli);
            var header=$("<div class='header'><img src=upload/"+t.dataSource[i].Userpt+" class='img1'></div>").appendTo(oli);
            var name=$("<div class='name'>"+t.dataSource[i].nickname+"</div>").appendTo(oli);
        })
			//生成分页栏
    var pager = $("<div class='pager'></div>").appendTo(this.renderTo);
    var pagerLine = $("<table class='pagerLine' cellpadding='0' cellspacing='0'></table>").appendTo(pager);
    var arrHTML = [];
    arrHTML.push("<tr><td style='width: 10em;'>共<span class='total'>" + this.dataSource1.length + "</span>项，每页显示</td>");
    arrHTML.push("<td style='width: 6em;'><div class='ddlPageSize'></div></td><td>项</td>");
    arrHTML.push("<td style='width: 5em;'><input type='button' class='btnPrev pagerBtn' value='上一页' /></td>");
    arrHTML.push("<td style='width: 4em;text-align: center;'><span class='lblCurrentPage'>" + this.postData.pageNum + "</span>");// 当前第几页
    arrHTML.push("/<span class='lblTotalPage'>" + Math.ceil(this.dataSource1.length / this.postData.pageSize) + "</span></td>");// 总共多少页
    arrHTML.push("<td style='width: 5em;text-align: center;'><input type='button' class='btnNext pagerBtn' value='下一页' /></td></tr>");
    pagerLine.html(arrHTML.join(""));
			this.eventBind();

};
//注册事件
Rate.prototype.eventBind = function() {
    var t = this;
    var grid = this.renderTo;
    new DropDownList({
        renderTo : grid.attr("id") + " .ddlPageSize",
        dataSource : [ {
            key : "10",
            value : "10"
        }, {
            key : "20",
            value : "20"
        }, {
            key : "30",
            value : "30"
        } ],
        direction : "up",
        defaultSelected : this.postData.pageSize,
        offset : -.4,
        // 修改下拉列表选中项时
        onClick : function(obj) {
            // 重新加载表格
            t.reload(1, obj.key);
        }
	});
	// 点击下一页的事件
	$(".lastLi", grid).click(function() {
		var page = $(".nowPage1").text();
		var maxPage = $(".allPage1").text().substring(1);
		var minPage = parseInt(page) + 1;
		if (minPage > parseInt(maxPage)) {
			minPage = maxPage;
		}
		$(".nowPage1").text(minPage);
		t.reload(minPage, $(".ddlItemSelected", grid).attr("key"));
	})
	// 点击上一页的事件
	$(".backLi", grid).click(function() {
		var page = $(".nowPage1").text();
		var maxPage = $(".allPage1").text().substring(1);
		var minPage = parseInt(page) - 1;
		if (minPage <= 0) {
			minPage = 1;
		}
		$(".nowPage1").text(minPage);
		t.reload(minPage, $(".ddlItemSelected", grid).attr("key"));
	})
}