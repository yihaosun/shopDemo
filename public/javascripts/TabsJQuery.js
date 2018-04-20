function tab(args) {
	try {
		if (!args.renderTo)
			throw "renderTo元素不存在，请检查ID是否存在";
		if (!args.dataSource)
			throw "缺失必要参数";
	} catch (e) {
		alert("下拉列表初始化失败，原因：" + e);
		return;
	}

	this.init(args);

}

tab.prototype.init = function(args) {

	this.renderTo = $("#" + args.renderTo);
	this.dataSource = args.dataSource;
	this.onClick = args.onClick;
	this.mapping = args.mapping ? args.mapping : {
		key : "key",
		value : "value"
	}

	this.getDataByDatasource();
}

tab.prototype.getDataByDatasource = function() {

	var t = this;
	if (typeof this.dataSource == "string") {
		$.ajax({
			type : "POST",
			url : this.dataSource,
			success : function(res) {
				t.dataSource = res;
				// 生成元素
				t.build();
			}
		});
	} else {
		this.build();
	}
}

tab.prototype.build = function() {

	this.renderTo.addClass("tab");

	this.ullist = $("<ul class='ullist clearfloat'></ul>").appendTo(
			this.renderTo);
	/*this.contentWrap = $("<div class='contentWrap'></div>").appendTo(
			this.renderTo);*/
	var t = this;
	this.tabTitleHoverBG = $("<div class='tabTitleHoverBG hidden'></div>")
			.appendTo(this.renderTo);
	this.tabSelectedBG = $("<div class='tabSelectedBG'></div>").appendTo(
			this.renderTo);
	$(this.dataSource).each(
			function() {
				$(
						"<li class='tabTitle' key='" + this[t.mapping.key]
								+ "' value='" + this[t.mapping.value] + "'>"
								+ this[t.mapping.value] + "</li>").appendTo(
						t.ullist);
				/*$(
						"<div class='contItem' key='" + this[t.mapping.key]
								+ "' value='" + this[t.mapping.value] + "'>"
								+ this[t.mapping.value] + " ></div>").appendTo(
						t.contentWrap);*/
			});
	this.eventBind();

}

tab.prototype.eventBind = function() {

	var t = this;
	/*
	 * t.renderTo.click(function() { $(t.ullist).toggleClass("change"); });
	 */
	this.renderTo.hover(function() {
		t.tabTitleHoverBG.removeClass("hidden");
	}, function() {
		t.tabTitleHoverBG.addClass("hidden");
	});

	$("li", t.ullist).click(function() {
		var flag = $(this).attr("key");
		util.cookie.set("lastTab", flag);
		t.select(this);
		 //回调
		 if(flag=="002"){
			$(".Rate").css("display","block");
			$(".goodsDetais").css("display","none");
			$(".service").css("display","none");
		 }
		 if(flag=="001"){
				$(".Rate").css("display","none");
				$(".goodsDetais").css("display","block");
				$(".service").css("display","none");
			 }
		 if(flag=="003"){
				$(".Rate").css("display","none");
				$(".goodsDetais").css("display","none");
				$(".service").css("display","block");
			 }
		 
	}).mouseenter(function() {
		if (util.isLTIE10())
			t.tabTitleHoverBG.animate({
				left : $(this).index() * 6.85 + "em"
			});
		else
			t.tabTitleHoverBG.css("left", $(this).index() * 6.85 + "em");

	});
	var lastMenu = util.cookie.get("lastTab");
	if (lastMenu != null && lastMenu != null) {
		this.select($("li[key='" + lastMenu + "']", this.ullist));
	} else {
		this.select($("li:eq(0)", this.ullist));
		this.select($("goodsDetails", this.ullist));
	}

}
tab.prototype.select = function(li) {
	$("li", this.ullist).removeClass("selectItem");
	$("div", this.contentWrap).removeClass("contItemActive");
	$(li).addClass("selectItem");
	if (util.isLTIE10()) {
		this.tabSelectedBG.animate({
			left : $(li).index() * 6.85 + "em"
		});
		li=$(li).index();
	} else {
		this.tabSelectedBG.css("left", $(li).index() * 6.85 + "em");
		li=$(li).index();
	}

	this.onClick(li);

}
