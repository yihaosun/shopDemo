var url = window.location.search;
var loc = url.substring(url.indexOf('=')+1, url.indexOf('&'));
var loc1 = url.substring(url.lastIndexOf('=')+1, url.length);
var condition1="WHERE";
if(loc1!=""){
    condition1+=" S.USERID="+loc1;
}else{
    condition1+=" S.USERID IS NULL";
}
function goodsDetail(args) {
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
goodsDetail.prototype.init = function(args) {
	this.renderTo = $("." + args.renderTo);

	// 数据源
	this.dataSource = args.dataSource;
//	this.loc=args.loc;
	// 客户端发送到后台的参数
	// 根据传入的数据源获取数据
	this.getDataByDataSource();

}


goodsDetail.prototype.getDataByDataSource = function() {
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
goodsDetail.prototype.build = function() {
	var t = this;
	var odiv=$("<h2 class='nav_content_name'>"+t.dataSource[0].GOODSNAME.substring(0,10)+"...</h2>").appendTo(this.renderTo);
$(".pro_info_title").text(t.dataSource[0].GOODSNAME);
$(".tm-price").text(t.dataSource[0].price);
$(".tm-count").text(t.dataSource[0].stock);
$(".tm-count1").text(t.dataSource[0].suggestNum);
$("	<img class='showImg' src='upload/"+t.dataSource[0].imgUrl+"'>").appendTo($(".pro_content_img"));
$(".step_all_li").text(t.dataSource[0].GOODSNAME);
// $(" <span>"+t.dataSource.rows[0].price+"元</span>").appendTo($(".step_all_li"));
// $("#total_price").text("总价:"+t.dataSource.rows[0].price+"元");
// $.each(t.dataSource[i].goodsImgList,function(){
// 	$( "<img class='gridImg' src='upload/" + this.dataSource[i].goodsImgList+ "' >").appendTo($(".pro_content_img"));
// 	$( "<img class='goodsDetaisImg' style='width: 100%' src='upload/" + this.fileName + "' >").appendTo($(".goodsDetais"));
// });
	for(var i=0;i<t.dataSource.length;i++) {
        $("<img class='gridImg' src='upload/" + this.dataSource[i].goodsImgList + "'>").appendTo($(".pro_content_img"));
        $( "<img class='goodsDetaisImg' style='width: 100%' src='upload/" + this.dataSource[i].goodsImgList + "' >").appendTo($(".goodsDetais"));
    }
this.eventBind();
};
goodsDetail.prototype.eventBind=function(){
    $(".gridImg").hover(function(){
        $(".gridImg").css("border","2px solid gray");
        var url1=$(this).attr("src");
        $(".showImg").attr("src",url1);
        $(this).css("border","2px solid orange");
    });
$(".buyNow").click(function(){
     $.post('/innerShop', {
         name:$(".pro_info_title").text(),
         price:$(".tm-price").text(),
         imgUrl:$(".showImg").attr("src").substring($(".showImg").attr("src").indexOf("/")+1),
         goodsId:loc,
         userId:loc1,
         amount:1,
     },
    function(row){
        if(row=="true"){
            location.href="/shopCar?id="+loc+"&&userId="+loc1+"";
           // alert("添加成功")
        }else{
            alert(row);
        }
    });
//	$.post("turnTo.action",{
//		goodsName:$(".nav_content_name").text(),
//		goodsPrice:$(".step_all_li span").text()
//	},function(){
//		location.href="jsp/shopCar.jsp?id="+loc;
//	})

})

};
