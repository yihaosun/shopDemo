function tip(args) {
	try {
		if (!args.renderTo)
			throw "renderTo元素不存在，请检查ID是否存在"
	} catch (e) {
		alert("提示失败的原因" + e);
	}
	this.init(args);
}
tip.prototype.init = function(args) {
	this.renderTo = $("#"+args.renderTo);
};
tip.prototype.build = function(args) {
	this.renderTo.addClass("tip hidden");
	this.renderTo.html("");
	 var span1 = $("<span class='wrap_i'></span>").appendTo(this.renderTo);
	  $("<i class='fa fa-check' aria-hidden='true'></i>").appendTo(span1);
	  var span2 = $("<span class='tip_word'></span>").appendTo(this.renderTo);
	  $("<strong>保存成功！</strong>").appendTo(span2);
	
}

tip.prototype.eventBind = function() {
};

tip.prototype.show = function(args) {
	var t = this;
	this.build();
	//淡入准备：先取消display隐藏样式hidden，使用opacity隐藏
    this.renderTo.removeClass("hidden").css("opacity",0);
//	this.diaLogMask.removeClass("hidden").css("opacity",0);
//	//淡入准备
//	//如果是IE10以下版本
	if(util.isLTIE10()){
		//使用animate
		t.renderTo.animate({
			opacity:1
		},500)
	}else{
		//使用css3实现动画
		this.renderTo.css("transition","all 100ms");
			t.renderTo.css({
				opacity:1,
                top:61+"px"
			})
	
	}
//	this.eventBind();
};
//隐藏弹出层
tip.prototype.hide=function(){
	var t=this;
	if(util.isLTIE10(0)){
		//使用animate实现动画
				t.renderTo.animate({
			opacity:0
		},300)
		//动画结束后隐藏元素
		setTimeout(function(){
			t.renderTo.addClass("hidden");
		},250);
	}else{
		//先实现渐变
		t.renderTo.css({
			opacity:0,
			top:29+"px"

		});
		//动画结束后隐藏元素
		setTimeout(function(){
			t.renderTo.addClass("hidden");

		},250)
	}
}

