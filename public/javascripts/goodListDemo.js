
function goodListDemo(args) {
	try {
		if (!args.renderTo)
			throw "指定对象没有找到";
		if (!args.dataSource)
			throw "数据没有找到";
	} catch (e) {
		alert("别的错误" + e);
		return;
	}
	// 执行初始化
	this.init(args);
}
// 初始化
goodListDemo.prototype.init = function(args) {
	this.renderTo = $("#" + args.renderTo);
	this.dataSource = args.dataSource;
	this.mapping = args.mapping;
	this.onClick=args.onClick;
	// 从客户端发送到后台的参数
	if (args.postData) {
		if (args.postData.pageNum == null)
			args.postData.pageNum = 1;
		if (args.postData.pageSize == null)
			args.postData.pageSize = 10;

	} else {
		args.postData = {
			pageNum : 1,
			pageSize : 10,
		};
	}
	// 将原来的数据保存起来
	this.renderTo.data("args", args);
	this.getDataByDatasource();
};
// 表格重构
goodListDemo.prototype.reload = function(pageNum, pageSize,condition) {
	var args = this.renderTo.data("args");
	args.postData.pageNum = pageNum;
	args.postData.pageSize =pageSize;
	// 重新生成表格，再次传入修改后的初始化参数
	this.init(args);

}
// 获取数据源
goodListDemo.prototype.getDataByDatasource = function() {
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
goodListDemo.prototype.build = function() {
	this.renderTo.className = "content";
	this.listUl = $("<ul class='listUl'></ul>").appendTo(this.renderTo);
	var t = this;
	for(var i=0;i<10;i++){
        var listLi = $("<li class='listLi' id='"+t.dataSource[i].ID+"'></li>").appendTo(t.listUl);
        var img_wrap = $("<div class='img_wrap'></div>").appendTo(
            listLi);
        $("<img src='upload/" +t.dataSource[i].IMGURL + "'>").appendTo(
            img_wrap);
        $(
            "<span class='span_title'>" + t.dataSource[i].NAME.substring(0,10)
            + "</span>").appendTo(listLi);
        $(
            "<span class='span_shopName'>"
            +t.dataSource[i].SHOPNAME.substring(0,7)  + "</span>")
            .appendTo(listLi);
        $(
            "<span class='span_price'>￥" + t.dataSource[i].PRICE
            + "</span>").appendTo(listLi);
        //$("<span class='span_stock>"+this[t.mapping.stock]+"</span>").appendTo(listLi);
        $("<span class='span_stock'>月成交<span>"+ t.dataSource[i].STOCK + "笔</span></span>").appendTo(listLi);
	}

			

		


	this.eventBind();
	}
// 注册事件
goodListDemo.prototype.eventBind = function() {
	var t = this;
	$(".listLi").click(function() {
		// 回调传入的行点击事件
		t.onClick(this);
	});
};





