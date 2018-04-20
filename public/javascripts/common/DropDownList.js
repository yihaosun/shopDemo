//下拉列表组件
function DropDownList(args) {
	try {
		if (!args.renderTo)
			throw "renderTo元素不存在，请检查ID是否存在";
		if (args.onClick && !$.isFunction(args.onClick))
			throw "onClick属性必须是方法,现在是" + typeof args.onClick;
		if (args.onComplete && !$.isFunction(args.onComplete))
			throw "onComplete属性必须是方法，现在是" + typeof args.onComplete;
		if (args.preloadItem && !$.isArray(args.preloadItem))
			throw "preloadItem属性必须是数组，现在是" + typeof args.preloadItem;
		if (!args.dataSource)
			throw "缺失必要参数";
	} catch (e) {
		alert("下拉列表初始化失败，原因：" + e);
		return;
	}
	// 初始化下拉列表参数
	this.init(args);
};

// 初始化下拉列表参数
DropDownList.prototype.init = function(args) {
	this.renderTo = $("#" + args.renderTo);
	// 数据源
	this.dataSource = args.dataSource;
	// 下拉列表项点击回调
	this.onClick = args.onClick === undefined ? function() {
	} : args.onClick;
	// 组件加载完成回调
	this.onComplete = args.onComplete === undefined ? function() {
	} : args.onComplete;
	// 映射关系
	this.mapping = args.mapping ? args.mapping : {
		key : "key",
		value : "value"
	};
	// 预加载项
	this.preloadItem = args.preloadItem;
	// 默认选中项
	this.defaultSelected = args.defaultSelected;
	// 弹出方向
	this.direction = args.direction == "up" ? "up" : "bottom";
	// 滑出菜单的偏移量
	this.offset = args.offset === undefined ? 0 : args.offset;
	// 将当前下拉列表对象保存到div上
	this.renderTo.data("this", this);
	// 根据传入的数据源获取数据
	this.getDataByDataSource();
};

// 根据传入的数据源获取数据
DropDownList.prototype.getDataByDataSource = function() {
	var t = this;
	// 如果数据源是数组
	if ($.isArray(this.dataSource))
		// 生成元素
		this.build();
	// 如果数据源是字符串，默认是url地址
	else if (typeof this.dataSource == "string") {
		$.ajax({
			type : "POST",
			url : this.dataSource,
			// 只有数据库返回数据时，这个回调的success才会执行
			success : function(res) {
				t.dataSource = res;
				// 生成元素
				t.build();
			}
		});
	}
};

// 生成元素
DropDownList.prototype.build = function() {
	this.renderTo.addClass("ddl");
	this.ddlTxt = $("<div class='ddlTxt' unselectable='on'></div>").appendTo(this.renderTo);
	this.ddlArrow = $("<div class='ddlArrow'></div>").appendTo(this.renderTo);
	this.ddlList = $("<ul class='ddlList hidden'></ul>").appendTo(this.renderTo);
	// 合并预加载项的数据到数据源
	if (this.preloadItem)
		this.dataSource = this.preloadItem.concat(this.dataSource);
	// 遍历数据源生成列表项
	var t = this;
	$(this.dataSource).each(function() {
		$("<li class='ddlItem' key='" + this[t.mapping.key] + "'>" + this[t.mapping.value] + "</li>").appendTo(t.ddlList);
	});
	// 设置默认选中项
	this.select($("li" + (this.defaultSelected ? "[key='" + this.defaultSelected + "']" : ":eq(0)"), this.ddlList));
	// 注册事件
	this.eventBind();
};

// 注册事件
DropDownList.prototype.eventBind = function() {
	var t = this;
	// 显示或隐藏下拉列表
	t.renderTo.click(function(event) {
		// 如果下拉列表是隐藏状态？显示：隐藏
		t.ddlList.hasClass("hidden") ? t.show() : t.hide();
		// 展开当前下拉列表时， 应该收起页面上其他的下拉列表
		$(".ddl").not(t.renderTo).each(function() {
			$(this).data("this").hide();
		});
		// 阻止事件冒泡，防止触发上层body的点击事件又把列表收起来了
		event.stopPropagation();
	});
	// 列表项点击
	$("li", t.ddlList).click(function() {
		// 设置下拉列表选中项
		t.select(this);
		// 回调
		t.onClick({
			key : $(this).attr("key"),
			value : $(this).text()
		});
	});
	// 点击页面其他地方收起当前的下拉列表
	$("body").click(function() {
		t.hide();
	});
	// 组件加载完成
	this.onComplete(this);
};

// 显示下拉列表
DropDownList.prototype.show = function() {
	var t = this;
	var ddlList = this.ddlList;
	// 把下拉列表向上移动并显示出来
	ddlList.css(t.direction, .8+ t.offset + "em").removeClass("hidden");
	// 如果当前浏览器小于IE10
	if (util.isLTIE10()) {
		ddlList.css("opacity", 0);
		var style = {
			opacity : 1
		};
		style[t.direction] = 1.9 + t.offset + "em";
		ddlList.animate(style, 300);
	} else {
		setTimeout(function() {
			ddlList.css(t.direction, 1.9 + t.offset + "em").css("opacity", 1);
		}, 1);
	}
};

// 隐藏下拉列表
DropDownList.prototype.hide = function() {
	var t = this;
	var ddlList = this.ddlList;
	if (util.isLTIE10()) {
		var style = {
			opacity:0
		     
		};
		style[t.direction] = 0.8+ t.offset + "em";
		ddlList.animate(style, 300);
	} else {
		ddlList.css(t.direction, 0.8 + t.offset + "em").css("opacity", 0);
	}
	setTimeout(function() {
		ddlList.addClass("hidden");
	}, 250);
};

// 设置下拉列表选中项
DropDownList.prototype.select = function(li) {
	// 清空所有li元素的选中样式
	$("li", this.ddlList).removeClass("ddlItemSelected");
	// 给当前点击的li元素添加选中样式
	$(li).addClass("ddlItemSelected");
	// 设置文本框中显示的文字
	this.ddlTxt.text($(li).text());
};
