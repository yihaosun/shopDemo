function Dialog(args) {
	try {
		if (!args.renderTo)
			throw "renderTo元素不存在，请检查ID是否存在"
	} catch (e) {
		alert("弹出层失败的原因" + e);
	}
	this.init(args);
}
Dialog.prototype.init = function(args) {
	this.renderTo = $("#" + args.renderTo);
};
Dialog.prototype.build = function(args) {
	this.renderTo.addClass("diaLog hidden");
	this.renderTo.html("");
	this.textBar = $("<div class='textBar'></div>").appendTo(this.renderTo);
	this.closeBar = $("<div class='closeBar'>╳</div>").appendTo(this.renderTo);
	if(this.confirm){
		this.content=$("<div class='content'></div>").appendTo(this.renderTo);
		this.container=$("<div class='container'></div>").appendTo(this.content);
		this.icon=$("<i class='fa fa-trash-o'></i>").appendTo(this.container);
		this.contextText=$("<div class='contextText'></div>").html(this.text).appendTo(this.container);
		this.btnBar=$("<div class='btnBar'></div>").appendTo(this.content);
		this.btnYes=$("<button id='btnYes'>确认</button>").appendTo(this.btnBar);
		this.bthNo=$("<button id='bthNo'>取消</button>").appendTo(this.btnBar);
	}else{
	 this.iframe = $("<iframe id='dialogIframe' src='' style='border: none'></iframe>").appendTo(this.renderTo);
	}
	if (!this.renderTo.next().hasClass("diaLogMask")) {
		this.diaLogMask = $("<div class='diaLogMask'></div").insertAfter(
				this.renderTo);
	}
}

Dialog.prototype.eventBind = function() {
	var t=this;
	this.closeBar.click(function(){
		t.hide();
	})
	if(this.confirm){
		$("button",this.btnBar).click(function(){
			t.hide();
			if($(this).attr("id")=="btnYes"){
				t.onClickYes();
			}
			
		})
		
	}
};

Dialog.prototype.show = function(args) {
	this.title=args.title;
	this.text=args.text;
	this.confirm=args.confirm;
	this.onClickYes=args.onClickYes;
	var t = this;
	this.build();
	this.renderTo.removeAttr("style").css({
		width : args.width + "em",
	   margin:"-"+args.height/2+"em 0 0 -"+args.width/2+"em" 
	});
	if(this.confirm){
		
	}else{

		this.iframe.height(args.height + "em").attr("src", args.url);
	}
	this.textBar.text(args.title);
	//淡入准备：先取消display隐藏样式hidden，使用opacity隐藏
	this.renderTo.removeClass("hidden").css("opacity",0);
	this.diaLogMask.removeClass("hidden").css("opacity",0);
	//淡入准备
	//如果是IE10以下版本
	if(util.isLTIE10()){
		//使用animate
		t.diaLogMask.animate({
			opacity:.5
		},500);
		t.renderTo.animate({
			opacity:1
		},500)
	}else{
		//使用css3实现动画
		this.renderTo.css("transition","all 100ms");
		this.diaLogMask.css("transition","all 100ms");
		setTimeout(function(){
			t.renderTo.css({
				opacity:1,
				transform:"scale(1,1)"
			});
			t.diaLogMask.css({
				opacity:0.5
			})
		},200)
	}
	this.eventBind();
};
//隐藏弹出层
Dialog.prototype.hide=function(){
	var t=this;
	if(util.isLTIE10(0)){
		//使用animate实现动画
		t.diaLogMask.animate({
			opacity:0
		},300)
		t.renderTo.animate({
			opacity:0
		},300)
		//动画结束后隐藏元素
		setTimeout(function(){
			t.renderTo.addClass("hidden");
			t.diaLogMask.addClass("hidden");
		},250);
	}else{
		//先实现渐变
		t.diaLogMask.css("opacity",0);
		t.renderTo.css({
			opacity:0,
			transform:"scale(.5,.5)"
		});
		//动画结束后隐藏元素
		setTimeout(function(){
			t.renderTo.addClass("hidden");
			t.diaLogMask.addClass("hidden");
		},250)
	}
}

