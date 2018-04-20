
function goodsPhone(args) {
	try {
		if (!args.renderTo)
			throw "找不到要放置数据的对象";
		if (!args.dataSource)
			throw "数据错误";
	} catch (e) {
		alert("错误" + e);
		return;
	}
	// 执行初始化
	this.init(args);
}
// 初始化
goodsPhone.prototype.init = function(args) {
	this.renderTo = $("#" + args.renderTo);
	this.dataSource = args.dataSource;
	this.mapping = args.mapping;
	this.onClick=args.onClick;
	// 从客户端发送到后台的参数
	if (args.postData) {
		if (args.postData.pageNum == null)
			args.postData.pageNum = 1;
		if (args.postData.pageSize == null)
			args.postData.pageSize = 30;

	} else {
		args.postData = {
			pageNum : 1,
			pageSize : 10,
			condition:condition
		};
	}
	this.postData = args.postData;
	// 将原来的数据保存起来
	this.renderTo.data("args", args);
	// ���Ԫ��
	this.getDataByDatasource();
};
// 表格重构
goodsPhone.prototype.reload = function(pageNum, pageSize) {
	var args = this.renderTo.data("args");
	args.postData.pageNum = pageNum;
	args.postData.pageSize =pageSize;
	args.postData.condition =condition;
	// 重新生成表格，再次传入修改后的初始化参数
	this.init(args);

}
// 获取数据源
goodsPhone.prototype.getDataByDatasource = function() {
	var t = this;
	this.renderTo.html("");
	if (typeof this.dataSource == "string") {
		$.post(this.dataSource,this.postData,function(res) {
			t.dataSource = res;
			// 生成元素
			t.build();
		});
	} else
		// 生成元素
		this.build();
	// 如果数据源是字符串，默认是url地址

};
//
goodsPhone.prototype.build = function() {
	this.renderTo.className = "content";
	this.listUl = $("<ul class='listUl'></ul>").appendTo(this.renderTo);
	var t = this;
	$(this.dataSource).each(
			function(i,row) {
				//只取前面的十个数据
				if(i<=9){
			var listLi = $("<li class='listLi' id='"+t.dataSource[i].id+"'></li>").appendTo(t.listUl);
			var img_wrap = $("<div class='img_wrap'></div>").appendTo(
						listLi);
				$("<img src='upload/" +t.dataSource[i].imgUrl + "'>").appendTo(
						img_wrap);
				$(
						"<span class='span_title'>" + t.dataSource[i].GOODSNAME.substring(0,10)
								+ "...</span>").appendTo(listLi);
				$(
						"<span class='span_shopName'>"
								+t.dataSource[i].shopName.substring(0,10)  + "</span>")
						.appendTo(listLi);
				$(
						"<span class='span_price'>￥" + t.dataSource[i].price
								+ "</span>").appendTo(listLi);
 //$("<span class='span_stock>"+this[t.mapping.stock]+"</span>").appendTo(listLi);
			$("<span class='span_stock'>月成交<span>"+ t.dataSource[i].stock + "笔</span></span>").appendTo(listLi);
                };
			})
	this.eventBind();
	}
// 注册事件
goodsPhone.prototype.eventBind = function() {
	var t = this;
	var grid = this.renderTo;
	// 引用组件了
	new DropDownList({
		renderTo : grid.attr("id") + " .ddlPageSize",
		dataSource : [ {
			key : "10",
			value : "10"
		}, {
			key : "20",
			value : "20"
		} ],
		direction : "up",
		defaultSelected : this.postData.pageSize,
		offset : -.4,
		// 修改下拉列表选中项时
		onClick : function(obj) {
			// 重新加载表格
			t.reload(1, obj.key,condition);
		}
	});
	// 点击下一页的事件
	$(".lastLi", grid).click(function() {
		var page = $(".nowPage").text();
		var maxPage = $(".allPage").text().substring(1);
		var minPage = parseInt(page) + 1;
		if (minPage > parseInt(maxPage)) {
			minPage = maxPage;
		}
		$(".nowPage").text(minPage);

		t.reload(minPage, $(".ddlItemSelected", grid).attr("key"),condition);
	});
	// 点击上一页的事件
	$(".backLi", grid).click(function() {
		var page = $(".nowPage").text();
		var maxPage = $(".allPage").text().substring(1);
		var minPage = parseInt(page) - 1;
		if (minPage <= 0) {
			minPage = 1;
		}
		$(".nowPage").text(minPage);
		t.reload(minPage, $(".ddlItemSelected", grid).attr("key"),condition);
	});
	$(".listLi").click(function() {
		// 回调传入的行点击事件
		t.onClick(this);
	});
};





