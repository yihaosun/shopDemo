$(function(){
	var header_search_bar=$(".header_search_bar");
	var header_search_text=$(".header_search_text");
	
	header_search_bar.click(function(){
		location.href=encodeURI("jsp/searchResult.jsp?content="+header_search_text.val());
	
	});
	$("body").keyup(function(event) {// 键盘按下事件
		// 如果按下的按键编号是13表示按下的是回车
		if (event.keyCode== 13&&header_search_text.val()!=""){
			location.href=encodeURI("jsp/searchResult.jsp?content="+header_search_text.val());
			
			}
	});
	var num=0;
	$(".bottom_span").eq(0).addClass("bottom_span_show");
	
	$(".left").click(function(){
		var now=parseInt($(".list").css("marginLeft"));
		 num--;
	    if(num<0){
	    	num=4;
	    }
	    
	    $(".list").css("marginLeft",""+-1226*num+"px");
	    $(".bottom_span").removeClass("bottom_span_show");
	    $(".bottom_span").eq(num).addClass("bottom_span_show");
	})
	$(".right").click(function(){
		var now=parseInt($(".list").css("marginLeft"));
		 num++;
	    if(num>4){
	    	num=0;
	    }
	    
	    $(".list").css("marginLeft",""+-1226*num+"px");
	    $(".bottom_span").removeClass("bottom_span_show");
	    $(".bottom_span").eq(num).addClass("bottom_span_show");
	   
	})
	$(".bottom_span").click(function(){
		  $(".bottom_span").removeClass("bottom_span_show");
		  $(this).addClass("bottom_span_show");
		  $(".list").css("marginLeft",""+-1226*$(this).index()+"px");
		  num=$(this).index();
		})
		
		//�ֲ�ͼ
		var timer=null;
		timer=setInterval(function() {
			 $(".bottom_span").removeClass("bottom_span_show");
			 $(".bottom_span").eq(num).addClass("bottom_span_show");
			$(".list").animate({
				marginLeft : "" + num * -1226 + "px"
			}, 1000);
			num++;
			if(num==5){
				num=0;
				 $(".list").css("marginLeft","0px");
			}
		}, 2000);
		
	$(".left").mouseover(function(){
		clearInterval(timer);   
	})
	$(".left").mouseout(function(){
		timer=setInterval(function() {
			 $(".bottom_span").removeClass("bottom_span_show");
			 $(".bottom_span").eq(num).addClass("bottom_span_show");
			$(".list").animate({
				marginLeft : "" + num * -1226 + "px"
			}, 1000);
			num++;
			if(num==5){
				num=0;
				 $(".list").css("marginLeft",""+-1226*num+"px");
			}
		}, 2000);
	})
	$(".right").mouseout(function(){
		timer=setInterval(function() {
			 $(".bottom_span").removeClass("bottom_span_show");
			 $(".bottom_span").eq(num).addClass("bottom_span_show");
			$(".list").animate({
				marginLeft : "" + num * -1226 + "px"
			}, 1000);
			num++;
			if(num==5){
				num=0;
				 $(".list").css("marginLeft",""+-1226*num+"px");
			}
		}, 2000);
	})
	$(".right").mouseover(function(){
		clearInterval(timer);   
	})
	$(".list").mouseover(function(){

		clearInterval(timer);   
	})
$(".bottom_span").mouseover(function(){
		clearInterval(timer);   
	})
	$(".bottom_span").mouseout(function(){
		timer=setInterval(function() {
			 $(".bottom_span").removeClass("bottom_span_show");
			 $(".bottom_span").eq(num).addClass("bottom_span_show");
			$(".list").animate({
				marginLeft : "" + num * -1226 + "px"
			}, 1000);
			num++;
			if(num==5){
				num=0;
				 $(".list").css("marginLeft",""+-1226*num+"px");
			}
		}, 2000);
	})
	$(".list").mouseout(function(){

		timer=setInterval(function() {
			 $(".bottom_span").removeClass("bottom_span_show");
			 $(".bottom_span").eq(num).addClass("bottom_span_show");

			$(".list").animate({
				marginLeft : "" + num * -1226 + "px"
			}, 1000);
			num++;
			if(num==5){
				num=0;
				 $(".list").css("marginLeft",""+-1226*num+"px");
			}
		}, 2000);
	});
	$.post("/",function(res){
		if(res=="undefined"){
            $(".info_span").text("");
		}else{
        $(".info_span").text(res);
            $(".info").remove();
            $("	<a class='info' link href=#>我的订单</a>").appendTo($(".top_info"));
            $("	<a class='info' link href=#>消息通知</a>").appendTo($(".top_info"));
		}
	});
    $.post("/userId",function(res){
        if(res=="undefined"){
            $(".userId").text("");
        }else{
            $(".userId").text(res);
        }
    });
    var userId=$(".userId").text();
    if(userId==""){
        userId=8;
	}
    $.post("/getShopCarTotal",{
		userId:userId},
		function(res){
			$(".numResult").text(res.length);
        // if(res==""){
        //     $(".userId").text("");
        // }else{
        //     $(".userId").text(res);
        // }
    });
});
