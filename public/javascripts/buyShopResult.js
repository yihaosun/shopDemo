//表格组件
var count1=0;
var allMoney1=0;
var flag1=true;
function buyShopResult(args) {
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
buyShopResult.prototype.init = function(args) {
	this.renderTo = $("#" + args.renderTo);
	// 数据源
	this.dataSource = args.dataSource;
    this.dataSource1 = args.dataSource1;
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
buyShopResult.prototype.reload = function(pageNum, pageSize) {
	var args = this.renderTo.data("args");
	if (pageNum)
		args.postData.pageNum = pageNum;
	if (pageSize)
		args.postData.pageSize = pageSize;
	// 重新生成表格，再次传入修改后的初始化参数
	this.init(args);
};

// 根据数据类型，判断是否发起ajax请求
buyShopResult.prototype.getDataByDataSource = function() {
	var t = this;
	if (typeof this.dataSource == "string") {
		$.post(this.dataSource, this.postData, function(res) {
			t.dataSource = res;
			if (t.dataSource == null) {
				alert("表格生成失败，原因：表格JSON必须包含rows属性。");
				return;
			}

			// 生成元素
			t.build();
		});
        $.post(this.dataSource1, this.postData, function(res) {
            t.dataSource1 = res;
            if (t.dataSource1 == null) {
                alert("表格生成失败，原因：表格JSON必须包含rows属性。");
                return;
            }
            // 生成元素
            t.build();
        });
	} else{
        // 生成元素
        this.build();
        // 如果数据源是字符串，默认是url地址
    }
};

// 生成元素
buyShopResult.prototype.build = function() {
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
//		if(th.text()=="全选"){
//			$("<span class='choose'><i class='fa fa-check' aria-hidden='true'></i></span>").prependTo(th);
//		}
		// 如果该列有hide属性表示希望该字段被隐藏?隐藏该列：设置列的宽度
		this.hide ? th.addClass("hidden") : th.css("width", (100 / numOfCol + "%"));
	});
	var tbody = $("<tbody></tbody>").appendTo(table);
	
	// 遍历数据源生成表格主体
	$(this.dataSource).each(function(i, row) {
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
			if(column.alias=="amount"){
				var td = $("<td class='gridCell' alias='" + column.alias + "' originalValue='" + oldText + "'></td>").appendTo(tr);
				var cut=$("<span class='cut'>-</span>").appendTo(td);
				
			$("<span class='now'>"+newText+"</span>").appendTo(td);
			var add=$("<span class='add'>+</span>").appendTo(td);
				
			}else{
				var td = $("<td class='gridCell' alias='" + column.alias + "' originalValue='" + oldText + "'></td>").html(newText).appendTo(tr);
				if(column.alias=="do"){
				$("<span class='del'><i class='fa fa-times' aria-hidden='true'></i></span>").appendTo(td)
				}
				else if(column.alias=="choose"){
					$("<span class='choose1' ><i class='fa fa-check' aria-hidden='true'></i></span>").appendTo(td);
					}
				else if(column.alias=="total"){
				var price= tr.children(".gridCell").eq(3).text();
				  var num= tr.children(".gridCell").eq(4).children(".now").text();
				var total=price*num;
				tr.children(".gridCell").eq(5).text(total);
				tr.children(".gridCell").eq(5).css("color","#ff6700");
				}
			}
			// 如果该列需要隐藏
			if (this.hide)
				td.addClass("hidden");
			// 如果该列需要被对齐
			if (this.align)
				td.addClass("align" + this.align);
		});
		tr.children(".gridCell").eq(4).children(".cut").click(function(){
			var price= tr.children(".gridCell").eq(3).text();
			var count=tr.children(".gridCell").eq(4).children(".now").text();
			count--;
			if(count<=1){
				count=1;
			}
			var total=price*count;
			tr.children(".gridCell").eq(4).children(".now").text(count);
			tr.children(".gridCell").eq(5).text(total);
			
		});
			tr.children(".gridCell").eq(4).children(".add").click(function(){
				var price= tr.children(".gridCell").eq(3).text();
			var count=tr.children(".gridCell").eq(4).children(".now").text();
			count++;
			if(count>=5){
				count=5;
			}
			var total=price*count;
			tr.children(".gridCell").eq(4).children(".now").text(count);
			tr.children(".gridCell").eq(5).text(total);	
		})
		
			var flag=true;
			tr.children(".gridCell").eq(6).click(function(){
				var choose1=tr.children(".gridCell").eq(6).children(".choose1");
				if(flag){
					choose1.addClass("select_choose");
					$(".chooseGoodsNum").text($(".select_choose").length);
					if($(".chooseGoodsNum").text()>0){
						$(".arrow-a").css("display","none");
							$(".no-select-tip").css("display","none");
							$("#btn-primary").addClass("btn-primary_select");
					}else if($(".chooseGoodsNum").text()==0){
						$(".arrow-a").css("display","block");
						$(".no-select-tip").css("display","block");
						$("#btn-primary").removeClass("btn-primary_select")
				}
					$(".cut",$(this).prev().prev()).unbind();
					$(".add",$(this).prev().prev()).unbind();
					var allMoney=$(this).prev().text();
//			        $(this).prev().prev().children(".now").text();
//		         $(this).parent().children(".gridCell").eq(0).text();
		     $.post("updateShop.action",{
		    	 amount:$(this).prev().prev().children(".now").text(),
		    	 id:$(this).parent().children(".gridCell").eq(0).text()
		     },function(json){
		    	 if(json.isSuccess=="true"){
		    		 
		    	 }else{
		    		 alert(json.errMsg);
		    	 }
		     })
		 
					allMoney1+=Number(allMoney);
					$(".total-price1").text(allMoney1);
			     flag=false;
				}else{
					choose1.removeClass("select_choose");
					$(".chooseGoodsNum").text($(".select_choose").length);
					if($(".chooseGoodsNum").text()>0){
						$(".arrow-a").css("display","none");
							$(".no-select-tip").css("display","none");
							$("#btn-primary").addClass("btn-primary_select");
					}else if($(".chooseGoodsNum").text()==0){
						$(".arrow-a").css("display","block");
						$(".no-select-tip").css("display","block");
						$("#btn-primary").removeClass("btn-primary_select")
				}
					tr.children(".gridCell").eq(4).children(".cut").click(function(){
						var price= tr.children(".gridCell").eq(3).text()
						var count=tr.children(".gridCell").eq(4).children(".now").text();
						count--;
						if(count<=1){
							count=1;
						}
						var total=price*count;
						tr.children(".gridCell").eq(4).children(".now").text(count);
						tr.children(".gridCell").eq(5).text(total);
						
					});
						tr.children(".gridCell").eq(4).children(".add").click(function(){
							var price= tr.children(".gridCell").eq(3).text();
						var count=tr.children(".gridCell").eq(4).children(".now").text();
						count++;
						if(count>=5){
							count=5;
						}
						var total=price*count;
						tr.children(".gridCell").eq(4).children(".now").text(count);
						tr.children(".gridCell").eq(5).text(total);	
					})
			var	allMoney=$(this).prev().text();
			
					allMoney1-=Number(allMoney);
					$(".total-price1").text(allMoney1);
					  flag=true;
				}
				
			});

			
	});
	// 生成表格分页栏
	var pager = $("<div class='pager'></div>").appendTo(this.renderTo);
	var pagerLine = $("<table class='pagerLine' cellpadding='0' cellspacing='0'></table>").appendTo(pager);
	var arrHTML = [];
	arrHTML.push("<tr><td style='width: 10em;'>共<span class='total'>" + this.dataSource1.length + "</span>项，每页显示</td>");
	arrHTML.push("<td style='width: 6em;'><div class='ddlPageSize'></div></td><td>项</td>");
	arrHTML.push("<td style='width: 5em;'><input type='button' class='btnPrev pagerBtn' value='上一页' /></td>");
	arrHTML.push("<td style='width: 4em;text-align: center;'><span class='lblCurrentPage'>" + this.postData.pageNum + "</span>");// 当前第几页
	arrHTML.push("/<span class='lblTotalPage'>" + Math.ceil(this.dataSource1.length / this.postData.pageSize) + "</span></td>");// 总共多少页
	arrHTML.push("<td style='width: 5em;text-align: center;'><input type='button' class='btnNext pagerBtn' value='下一页' /></td></tr>");
	pagerLine.html(arrHTML.join(""));
	this.eventBind();
	
};

// 注册事件
buyShopResult.prototype.eventBind = function() {
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
//	var now=$(".now").text();
//	var price=$(".gridRow td").eq(3).text();
//	var total=now*price;
//	$(".gridRow td").eq(5).html(total)
//	$(".gridRow td").eq(5).css("color","#ff6700")
//	$(".cut").click(function(){
//		 now--;
//		 if(now<=1){
//			 now=1
//		 }
//		 var total=now*price;
//			$(".gridRow td").eq(5).html(total)
//		$(".now").html(now)
//		});
//	$(".add").click(function(){
//		 now++;
//		 if(now>=5){
//			 now=5
//		 }
//		 var total=now*price;
//			$(".gridRow td").eq(5).html(total)
//		$(".now").html(now)
//		});
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
	
			// 移除表格其他行的选中
			$(".gridRow", grid).removeClass("gridSelected");
			// 给当前点击的这行加上选中效果
			$(this).addClass("gridSelected");
		
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
	$(".del").click(function(){
		
				$(".dialog").css("display","block");
					$(".info").css("display","block");
	});
	$(".del1").click(function(){
		$(".dialog").css("display","none");
		$(".info").css("display","none");
	});
	$(".cancel").click(function(){
		$(".dialog").css("display","none");
		$(".info").css("display","none");
	});
	$(".correct").click(function(){
	var	 goodsId=$(".gridSelected>td[alias='ID']").attr("originalvalue");
		$.post("/delShopCar",{
			id:goodsId
		},function(res){
			if(res=="true"){
			}
		})
		$(".dialog").css("display","none");
		$(".info").css("display","none");
		t.reload();
		$(".total-price1").text("0");
	});
		$("#btn-primary").click(function(){
			if($(".total-price1").text()!=0){
				if($(".userName").text()==""){
					alert("抱歉请先登录再选购商品,不然选了也没用");
							location.href="jsp/login.jsp";
				}else{
				location.href="jsp/sureOrder.jsp";
					var str="";
					 $(".select_choose").each(function(){
						 str+=$(this).parent().parent().children(".gridCell").eq(0).text()+";";
						
					 });
					 location.href="jsp/sureOrder.jsp?str="+str;
					// alert($(".select_choose").parent().parent().eq(0).text());
			}
			}else{
				alert("您还没有选购商品");
			}
		})


	
	this.onComplete();
};