function Menu(args) {
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
		alert("Menu组件初始化失败，原因：" + e);
		return;
	}
	this.init(args);
};

Menu.prototype.init = function(args) {
	this.renderTo = $("#" + args.renderTo);
	this.dataSource = args.dataSource;
	this.onClick = args.onClick === undefined ? function() {
	} : args.onClick;
	this.onComplete = args.onComplete === undefined ? function() {
	} : args.onComplete;
	this.build();
};

Menu.prototype.build = function() {
	var t = this;
	this.renderTo.addClass("menu");
	this.menuList = $("<ul class='menuList'></ul>").appendTo(this.renderTo);
	this.menuHoverBG = $("<div class='menuHoverBG hidden'></div>").appendTo(this.renderTo);
	this.menuSelectedBG = $("<div class='menuSelectedBG'></div>").appendTo(this.renderTo);
	$(this.dataSource).each(function() {
		var menuItem = $("<li class='menuItem'></li>").attr("url", this.url).text(this.name).appendTo(t.menuList);
		// 生成图标
	});
	this.eventBind();
};

Menu.prototype.eventBind = function() {
	var t = this;
	// 鼠标移入菜单区域时显示hover背景
	this.renderTo.hover(function() {
		// 鼠标进入菜单区域时显示背景色块
		t.menuHoverBG.removeClass("hidden");
	}, function() {
		// 鼠标移出菜单区域时隐藏背景色块
		t.menuHoverBG.addClass("hidden");
	});
	$(".menuItem", this.renderTo).click(function() {
		var url = $(this).attr("url");
		util.cookie.set("lastMenu", url);
		t.select(this);
	}).mouseenter(function() {// 鼠标进入菜单项
		if (util.isLTIE10())
			t.menuHoverBG.animate({
				top : $(this).index() * 2.3125 + "em"
			});
		else
			t.menuHoverBG.css("top", $(this).index() * 2.3125 + "em");
	});
	// 组件加载完成
	var lastMenu = util.cookie.get("lastMenu");
	if (lastMenu != null && lastMenu != null)
		this.select($("li[url='" + lastMenu + "']", this.menuList));
	else
		this.select($("li:eq(0)", this.menuList));
	this.onComplete(this);
};

Menu.prototype.select = function(li) {
	$(".menuSelected").removeClass("menuSelected");
	$(li).addClass("menuSelected");
	if (util.isLTIE10())
		this.menuSelectedBG.animate({
			top : $(li).index() * 2.3125 + "em"
		});
	else
		this.menuSelectedBG.css("top", $(li).index() * 2.3125 + "em");
	this.onClick(li);
};