$(function(){
	$(".cart_mini").hover(function(){
	   if($(".numResult").text()==0){
		   $(".cart_menu").css("display","block");
		   $(".cart_mini").css("backgroundColor","white");
		   $(".cart_mini").css("color","#ff6700");
		   $(".loading").text("购物车中还没有商品，赶紧选购吧！");
	   }else{
		   $(".cart_menu").css("display","block");
		   $(".cart_mini").css("backgroundColor","white");
		   $(".cart_mini").css("color","#ff6700");
		   $(".loading").text("当前购物车里有"+$(".numResult").text()+"件宝贝，赶紧去清空吧！");
	   }	

	},function(){
		  $(".cart_mini").css("backgroundColor","#f5f5f5");
		   $(".cart_mini").css("color","#b0b0b0");
		  $(".cart_menu").css("display","none");
		 
	});
	$(".text_i").click(function(){
		$(".top_img").animate({marginTop:"-120px"},1000);
	})
});