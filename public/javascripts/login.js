$(function() {
	// 从cookie中获取用户名
	var userName = util.cookie.get("lastLoginName");
	// 如果能够获取到用户名
	if (userName != null && userName != "") {
		// 把焦点设置到密码框上
		$("#txtPassword").focus();
		// 隐藏占位符
		$(".placeholder:eq(0)").addClass("hidden");
	} else {
		// 把焦点设置在用户名上
		$("#txtName").focus();
	}
	// 验证码点击
	$("#pic").click(function(){
		loadImg();
	});
	// 登录按钮的点击事件
	$("#btnLogin").click(function() {
		btnLogin_onClick();
	});
	if (util.isLTIE10()) {
		$(".placeholder").css("display", "block");
	}
	// 文本框注册等各种事件
	$("input[type='text'],input[type='password']").focus(// 获得焦点
	function() {
		// 隐藏当前文本框上面的错误提示
		// $(".placeholder").css("display","none");
		hideErrorTip(this);// 传入当前触发事件的文本框
		
	}).blur(function() {// 失去焦点
		// 检查文本框内的文字是否符合要求
		checkTxt(this);// 传入当前触发事件的文本框
	}).keydown(function(event) {// 键盘按下事件
		// 如果按下的按键编号是13表示按下的是回车
		if (event.which == 13)
			btnLogin_onClick();
	}).keyup(function() {// 键盘抬起事件操作灰色占位符
		if ($(this).val() == "")
			// 显示灰色占位符
			$(this).next().next().removeClass("hidden");
		else
			// 隐藏灰色占位符
			$(this).next().next().addClass("hidden");
	});
	// 点击灰色占位符时，将焦点设置到下方的文本框中
	$(".placeholder").click(function() {
		$(this).prev().prev().focus();
	});
	// 检查文本框内的文字是否符合要求，如果文本框内为空就显示红色提示文字
	function checkTxt(txtObj) {
		txtObj = $(txtObj);
		// 错误的提示消息
		var errMsg = "请输入" + txtObj.attr("placeholder");
		// 如果文本框内的文字为空？显示错误提示信息：隐藏错误提示信息
		return txtObj.val() == "" ? showErrorTip(txtObj, errMsg)
				: hideErrorTip(txtObj);

	}

	// 隐藏错误的提示消息
	function hideErrorTip(txtObj) {
		txtObj = $(txtObj);
		txtObj.removeClass("erroBorder");
		// 获取文本框后面红色的错误提示元素errTips
		var errTipsObj = txtObj.next();
		// 如果当前浏览器是IE8/IE9
		if (util.isLTIE10())
			// 从左往右淡出
			errTipsObj.animate({
				opacity : 0,
				marginRight : "0.1em",
				
			});
		else
			// 使用CSS3实现显示动画
			errTipsObj.removeClass("showErrorTips");
		// 如果没错返回0
		return 0;
	}
	// 显示错误的提示消息
	function showErrorTip(txtObj, errMsg) {
		// 给当前的文本框加上红色的边框
		txtObj.addClass("erroBorder");
		// 获取文本框后面红色的错误提示元素errTips
		var errTipsObj = txtObj.next();
		// 设置错误提示文字
		errTipsObj.text(errMsg);
		// 如果当前浏览器是IE8/IE9
		if (util.isLTIE10())
			// 从右往左淡入
			errTipsObj.animate({
				opacity : 1,
				marginRight : "0.6em",
			});
		else
			// 使用CSS3实现显示动画
			errTipsObj.addClass("showErrorTips");
		// 如果出错返回1用于统计错误数量
		return 1;
	}
	// 验证码刷新
	function loadImg() {
    	$("#pic").attr("src", $("#pic").attr("basePath") + "?t=" + Date.now());
	}
	// 登录按钮的点击事件
	function btnLogin_onClick() {
		var btnLogin = $("#btnLogin");
		if (btnLogin.hasClass("btnError") || btnLogin.hasClass("btnSuccess")
				|| btnLogin.hasClass("btnDisable")) {
			return;// 退出整个方法
		}
		// 错误的统计
		var errCount = 0;
		// 遍历所有的输入框
		$("input[type='text'],input[type='password']").each(function() {
			// 当前的文本框出错就累加
			errCount += checkTxt(this);
			// 如果页面存在错误
			if (errCount > 0) {
				return;// 退出整个方法
			}
			// 按钮点击以后立即禁用，防止用户短时间快速的反复的点击

		});
        $.post("/login1", {
            email : $("#txtName").val(),
            pwd : $("#txtPassword").val(),
            code: $("#txtCode").val()
        }, function(res) {
        	// alert(res);
            // 服务器响应后解锁按钮
            btnLogin.removeClass("btnDisable");
            // // 如果登录成功
            if (res=="true") {
                btnLogin.addClass("btnSuccess");
                btnLogin.html("登录成功，请稍后……");
                setTimeout(function() {
                    // 页面跳转
                    location.href = "/";
                    //alert("成功")
                }, 1000);
            }else if(res=="true1"){
                btnLogin.addClass("btnSuccess");
                btnLogin.html("登录成功，请稍后……");
                setTimeout(function() {
                    // 页面跳转
                    location.href ="/frame";
                }, 1000);
            }
            else {
                btnLogin.addClass("btnError");
                btnLogin.html("登录失败，原因："+res );
                setTimeout(function() {
                    btnLogin.removeClass("btnError").html("登录");
                    // 验证码刷新
                   loadImg();
                }, 1500);
            }
        })
	}

});