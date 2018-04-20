//表格组件
function Grid(args) {
	try {
		if (!args.renderTo)
			throw "renderTo元素不存在，请检查ID是否存在";
		if (args.onRowClick && !$.isFunction(args.onRowClick))
			throw "onRowClick属性必须是方法,现在是" + typeof args.onRowClick;
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

// 初始化表格参数
Grid.prototype.init = function(args) {
	this.renderTo = $("#" + args.renderTo);
	// 数据源
	this.dataSource = args.dataSource;
	this.columns = args.columns;
	// 客户端发送到后台的参数
	if (args.postData) {
		if (args.postData.pageNum == null)
			args.postData.pageNum = 1;
		if (args.postData.pageSize == null)
			args.postData.pageSize = 10;
	} else {
		args.postData = {
			pageNum : 1,
			pageSize : 10
		};
	}
	this.postData = args.postData;
	// 表格行点击
	this.onRowClick = args.onRowClick === undefined ? function() {
	} : args.onRowClick;
	// 组件加载完成回调
	this.onComplete = args.onComplete === undefined ? function() {
	} : args.onComplete;
	// 缓存参数
	this.renderTo.data("args", args);
	// 根据传入的数据源获取数据
	this.getDataByDataSource();
};

// 表格重载
Grid.prototype.reload = function(pageNum, pageSize) {
	var args = this.renderTo.data("args");
	if (pageNum)
		args.postData.pageNum = pageNum;
	if (pageSize)
		args.postData.pageSize = pageSize;
	// 重新生成表格，再次传入修改后的初始化参数
	this.init(args);
};

// 根据数据类型，判断是否发起ajax请求
Grid.prototype.getDataByDataSource = function() {
	var t = this;
	if (typeof this.dataSource == "string") {
		$.post(this.dataSource, this.postData, function(res) {
			t.dataSource = res;
			if (t.dataSource.rows == null) {
				alert("表格生成失败，原因：表格JSON必须包含rows属性。");
				return;
			}
			// 生成元素
			t.build();
		});
	} else
		// 生成元素
		this.build();
	// 如果数据源是字符串，默认是url地址

};

// 生成元素
Grid.prototype.build = function() {
	var t = this;
	// 情况所有元素
	this.renderTo.html("");
	// 生成TABLE元素
	var table = $("<table class='grid' cellspacing='0' cellpadding='0'>").appendTo(this.renderTo);
	var thead = $("<thead></thead>").appendTo(table);
	var thead_tr = $("<tr></tr>").appendTo(thead);
	// 表格中显示的列数
	var numOfCol = 0;
	// 遍历列计算表格中显示的列数
	$(this.columns).each(function() {
		// 仅仅计算不隐藏的列数量
		if (!this.hide)
			numOfCol++;
	});
	// 生成表头
	$(this.columns).each(function() {
		var th = $("<th class='gridCell'></th>").text(this.name).appendTo(thead_tr);
		// 如果该列有hide属性表示希望该字段被隐藏?隐藏该列：设置列的宽度
		this.hide ? th.addClass("hidden") : th.css("width", (100 / numOfCol + "%"));
	});
	var tbody = $("<tbody></tbody>").appendTo(table);
	// 遍历数据源生成表格主体
	$(this.dataSource.rows).each(function(i, row) {
		// 生成每一行
		var tr = $("<tr class='gridRow'></tr>").appendTo(tbody);
		// 遍历列，在每一行中生成每一列
		$(t.columns).each(function(j, column) {
			// 单元格新内容
			var oldText;
			var newText = oldText = row[column.alias];
			// 如果字段拥有formatter属性，同时该属性是一个方法
			if (column.formatter && $.isFunction(column.formatter))
				newText = column.formatter(newText);
			if (column.originalValueFormatter && $.isFunction(column.originalValueFormatter))
				oldText = column.originalValueFormatter(oldText);
			var td = $("<td class='gridCell' alias='" + column.alias + "' originalValue='" + oldText + "'></td>").html(newText).appendTo(tr);
			// 如果该列需要隐藏
			if (this.hide)
				td.addClass("hidden");
			// 如果该列需要被对齐
			if (this.align)
				td.addClass("align" + this.align);
		});
	});
	// 生成表格分页栏
	var pager = $("<div class='pager'></div>").appendTo(this.renderTo);
	var pagerLine = $("<table class='pagerLine' cellpadding='0' cellspacing='0'></table>").appendTo(pager);
	var arrHTML = [];
	arrHTML.push("<tr><td style='width: 10em;'>共<span class='total'>" + this.dataSource.total + "</span>项，每页显示</td>");
	arrHTML.push("<td style='width: 6em;'><div class='ddlPageSize'></div></td><td>项</td>");
	arrHTML.push("<td style='width: 5em;'><input type='button' class='btnPrev pagerBtn' value='上一页' /></td>");
	arrHTML.push("<td style='width: 4em;text-align: center;'><span class='lblCurrentPage'>" + this.postData.pageNum + "</span>");// 当前第几页
	arrHTML.push("/<span class='lblTotalPage'>" + Math.ceil(this.dataSource.total / this.postData.pageSize) + "</span></td>");// 总共多少页
	arrHTML.push("<td style='width: 5em;text-align: center;'><input type='button' class='btnNext pagerBtn' value='下一页' /></td></tr>");
	pagerLine.html(arrHTML.join(""));
	this.eventBind();
};

// 注册事件
Grid.prototype.eventBind = function() {
	var t = this;
	var grid = this.renderTo;
	
	new DropDownList({
		renderTo : grid.attr("id") + " .ddlPageSize",
		dataSource : [ {
			key : "10",
			value : "10"
		}, {
			key : "20",
			value : "20"
		}, {
			key : "30",
			value : "30"
		} ],
		direction : "up",
		defaultSelected : this.postData.pageSize,
		offset : -.4,
		// 修改下拉列表选中项时
		onClick : function(obj) {
			// 重新加载表格
			t.reload(1, obj.key);
		}
	});
	// 上一页
	$(".btnPrev", grid).click(function() {
		// 获取分页栏显示的当前页码所在元素
		var cp = $(".lblCurrentPage", grid);
		// 获取该元素内的页码文字
		var page = +cp.text();
		// 如果当前页码<1就给当前页码赋值为1，否则页码的值是当前页码-1
		page = (page - 1) < 1 ? 1 : page - 1;
		// 将新页码填进元素
		cp.text(page);
		// 重新加载表格
		t.reload(page, $(".ddlItemSelected", grid).attr("key"));
	});
	// 下一页
	$(".btnNext", grid).click(function() {
		// 获取分页栏显示的当前页码所在元素
		var cp = $(".lblCurrentPage", grid);
		// 获取该元素内的页码文字
		var page = +cp.text();
		// 获取最大页码
		var maxPage = +$(".lblTotalPage", grid).text();
		// 新页码是当前页码+1
		var newPage = Math.min(maxPage, page + 1);
		// 将新页码填进元素
		cp.text(newPage);
		// 重新加载表格
		t.reload(newPage, $(".ddlItemSelected", grid).attr("key"));
	});
	// 表格行点击
	$(".gridRow", grid).click(function() {
		if ($(this).hasClass("gridSelected"))
			$(this).removeClass("gridSelected");
		else {
			// 移除表格其他行的选中
			$(".gridRow", grid).removeClass("gridSelected");
			// 给当前点击的这行加上选中效果
			$(this).addClass("gridSelected");
		}
		// 回调传入的行点击事件
		t.onRowClick(this);
	});
	//表格行滑动
//	$(".gridRow", grid).mouseover(function() {
//		// 回调传入的行滑动事件
////		t.onMouse(this);
//		if ($(this).hasClass("gridSelected"))
//			$(this).removeClass("gridSelected");
//		else {
//			// 移除表格其他行的选中
//			$(".gridRow", grid).removeClass("gridSelected");
//			// 给当前点击的这行加上选中效果
//			$(this).addClass("gridSelected");
//		}
//	 
//	});
	this.onComplete();
};