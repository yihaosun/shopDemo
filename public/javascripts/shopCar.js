 var url = window.location.search;
   var loc = url.substring(url.lastIndexOf('=')+1, url.length);
//    $.post("getGoodsById.action",{
//    	id:loc
//    },function(){
//    	
//    })
function shopCar(args) {
	try {
		
		
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
shopCar.prototype.init = function(args) {
	
	
	// 数据源
	this.dataSource = args.dataSource;
//	this.loc=args.loc;
	// 客户端发送到后台的参数
	// 根据传入的数据源获取数据
	this.getDataByDataSource();

};
shopCar.prototype.getDataByDataSource = function() {
	var t = this;
	if (typeof this.dataSource == "string") {
		$.post(this.dataSource,{id:loc},function(res) {
			t.dataSource = res;
			// 生成元素
			t.build();
		});
	} else
		// 生成元素
		this.build();
	// 如果数据源是字符串，默认是url地址

}
shopCar.prototype.build = function() {
	var t = this;
	$(".name").text(t.dataSource[0].GOODSNAME);
	
this.eventBind();
}
shopCar.prototype.eventBind=function(){
	
	
};
