var util = {
	// 判断当前浏览器的版本是否小于IE10
	isLTIE10 : function() {
		var us = window.navigator.userAgent;
		return us.indexOf("MSIE 8.0") > -1 || us.indexOf("MSIE 9.0") > -1;
	},
	cookie : {
		set : function(key, value) {
			var Days = 7;
			var date = new Date();
			date.setTime(date.getTime() + Days * 24 * 60 * 60 * 1000);
			document.cookie = key + "=" + escape(value) + ";expires=" + date.toGMTString();
		},
		get : function(key) {
			var arr, reg = new RegExp("(^|)" + key + "=([^;]*)(;|$)");
			// 把匹配项提取到数组中
			if (arr = document.cookie.match(reg)) {
				return unescape(arr[2]);
			}
		}
	},
	// 字符串验证 validate("AAAA","e");
	validate : function(str, type) {
		var strReg = "";
		// 规则
		var rules = {
			c : "\u4E00-\u9Fa5",
			e : "A-Za-z",
			n : "0-9",
			m : "-",
			_ : "_",
			p : ".",
			b : "，。？！（）“~",
			q:"[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+"
		}
		// 遍历对象，根据传入的要求拼接正则表达式，如传入e就会拼接A-Za-z，如传入en就会拼接A-Za-z0-9
		for ( var rule in rules)
			// 如果当前的规则在传入的type形参中存在
			if (type.indexOf(rule) > -1)
				strReg += rules[rule];
		// 创建正则表达式
		var regExp = new RegExp(eval("/^[" + strReg + "]*$/"));
		// 返回正则的验证结果
		return regExp.test(str);
	}
};
