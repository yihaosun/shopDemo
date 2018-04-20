function showImg(imgFileName) {
    imgFileName = imgFileName.replace(/[\[\] ]/g, "");
    var newimgFileName = imgFileName.replace(/[\[\] ]/g, "");
    var img = $("<img class='goodsImg'/>").attr("src",
        "upload/" + newimgFileName).attr("key", imgFileName).prependTo(
        ".headerPic");
    // $(".headerPic").css("background","url(upload/"+newimgFileName+")");

}
$(function() {
    $("#btnAdd").click(
        function() {
            $("form").html("");
            $(".goodsImg").remove();
            var file = $('<input type="file" name="file" class="hidden">')
                .appendTo("form");
            file.click();
            file.change(function() {
                if (file.val() != "") {
                    $("form").submit();
                }
            })

        });
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
    // 登录按钮的点击事件
    $("#btnRegister").click(function() {
        btnRegister_onClick();

    });
    if (util.isLTIE10()) {
        $(".placeholder").css("display", "block");
    }

    $("input[type='text'],input[type='password']").focus(function() {// 获取焦点
        // 隐藏当前文本框上面的错误提示
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
});
// 检查文本框内的文字是否符合要求，如果文本框内为空就显示红色提示文字
function checkTxt(txtObj) {
    txtObj = $(txtObj);
    // 文本框是否出现错误
    var isHasError = false;
    // 获取文本框内的文字
    var textStr = txtObj.val();
    // 获取错误信息
    var errMsg = (function() {
        // 获得label中的文字
        var l = txtObj.prev().text();
        // 如果文本框内的文字为空
        if ($.trim(textStr) == "") {
            isHasError = true;
            return "请输入" + l;
        }
        // 如果输入的文字的长度小于指定的长度
        if ($.trim(textStr).length < txtObj.attr("minlen")) {
            isHasError = true;
            return "至少输入" + txtObj.attr("minlen") + "个字符";
        }
        //如果文本格式不符合正则的要求
        if (!util.validate(textStr, txtObj.attr("validate"))) {
            isHasError = true;
            return "请勿输入非法字符";
        }
        // 获取密码和确认密码文本框的值
        var p1 = $("#txtPassword").val(), p2 = $("#txtPasswordAgin").val();
        // 如果当前文本框是确认密码框&&密码框内容长度>0&&密码框没有出现错误&&密码框内容！=确认密码框内容
        if (txtObj.attr("id") == "txtPasswordAgin" && p1.length > 0
            && !$("#txtPassword").hasClass("txtError") && p1 != p2) {
            isHasError = true;
            return "密码不一致";
        }
    })();
    // 如果文本框内的文字为空？显示错误提示信息：隐藏错误提示信息
    return isHasError ? showErrorTip(txtObj, errMsg) : hideErrorTip(txtObj);
}

// 隐藏错误的提示消息
function hideErrorTip(txtObj) {
    txtObj = $(txtObj);
    txtObj.removeClass("txtError");
    // 获取文本框后面红色的错误提示元素errTips
    var errTipsObj = txtObj.next();
    // 如果当前浏览器是IE8/IE9
    if (util.isLTIE10())
    // 从左往右淡出
        errTipsObj.animate({
            opacity : 0,
            right : "0em",

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
    txtObj.addClass("txtError");
    // 获取文本框后面红色的错误提示元素errTips
    var errTipsObj = txtObj.next();
    // 设置错误提示文字
    errTipsObj.text(errMsg);
    // 如果当前浏览器是IE8/IE9
    if (util.isLTIE10())
    // 从右往左淡入
        errTipsObj.animate({
            opacity : 1,
            right : "3em",
        });
    else
    // 使用CSS3实现显示动画
        errTipsObj.addClass("showErrorTips");
    // 如果出错返回1用于统计错误数量
    return 1;
}
// 登录按钮的点击事件
function btnRegister_onClick() {
    var btnRegister = $("#btnRegister");
    if (btnRegister.hasClass("btnError") || btnRegister.hasClass("btnSuccess")
        || btnRegister.hasClass("btnDisable")) {
        return;// 退出整个方法
    }
    // 错误的统计
    var errCount = 0;
    // var imgNum = $(".goodsImg").length;
    // if (imgNum <= 0) {
    //     btnRegister.html("记得添加图片");
    //     return;
    // }
    // if (imgNum > 0) {
    //     btnRegister.html("注册");
    // }
    $("input[type='text'],input[type='password']").each(function() {
        // 如果当前文本框出错就累加错误数量
        errCount += checkTxt(this);
    });
    // 如果页面存在错误
    if (errCount > 0) {
        return;// 退出整个方法
    }
    // 按钮点击以后立即禁用，防止用户短时间快速的反复的点击
    btnRegister.addClass("btnDisable");
    btnRegister.html("正在注册,请稍后");
    $.post("/register", {
        email : $("#txtName").val(),
        nickName : $("#nickName").val(),
        pwd : $("#txtPassword").val(),
        realName:$("#name").val()
       // userpt : $(".goodsImg").attr("key"),
    }, function(res) {
        // 服务器响应后解锁按钮
        btnRegister.removeClass("btnDisable");
        // 如果登录成功
        if (res == "true") {
            btnRegister.addClass("btnSuccess");
            btnRegister.html("注册成功，请稍后……");
            setTimeout(function() {
                // 页面跳转
                location.href = "/login";
            }, 1000);
        } else {
            btnRegister.addClass("btnError");
            btnRegister.html("注册失败，原因：" + res);
            setTimeout(function() {
                btnRegister.removeClass("btnError")
                // btnRegister.html("立即注册");
                // $("#txtName").val("");
                // $("#txtPassword").val("");
            }, 1500);
        }
    });

}
