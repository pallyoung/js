window.openId = "xdjadjadjadoaajodjaod";
var wx = {};
wx.pop = {};
wx.url = {};
wx.url.AJAX_LOAD = "/doSubmit.do";
wx.pop.loading = function(msg, title) {
	if (arguments.length === 0) {
		title = "提示";
		msg = "加载中，请稍候...";
	} else if (arguments.length === 1) {
		msg = "提示";
	}
	$(".loadingTitle").text(title);
	$(".loadingContent").text(msg);
	$("#boxDiv").show();
	$("#loadingTip").show();
};
wx.pop.hide = function() {
	$("#boxDiv").hide();
	$("#loadingTip").hide();
};
wx.ajax = function(url, data, success, error, showLoading) {
	$.ajax({
		async : true,
		cache : false,
		type : "POST",
		url : url,
		contentType : "application/json",
		dataType : "JSON",
		data : JSON.stringify(data),
		beforeSend : function() {
			if (showLoading !== false) {
				wx.pop.loading();
			}
		},
		complete : function() {
			wx.pop.hide();
		},
		success : function(data) {
			if (success) {
				success(JSON.parse(data.body));
			}
		},
		error : function(a, b, c) {
			console.log(JSON.stringify(a));
			console.log(JSON.stringify(b));
			console.log(JSON.stringify(c));
			if (error) {
				error(a, b, c);
			}
		}
	});
};

/**
 * 
 * 常用扩展 =============================================================
 * 
 */
Array.prototype.remove = function(s) {
	for ( var i = 0; i < this.length; i++) {
		if (s == this[i])
			this.splice(i, 1);
	}
};
/**
 * 日期format, add by wangjun
 */
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	};

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}

	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};
/**
 * Simple Map
 * 
 * 
 * var m = new Map(); m.put('key','value'); ... var s = "";
 * m.each(function(key,value,index){ s += index+":"+ key+"="+value+"/n"; });
 * alert(s);
 */
function Map() {
	/** 存放键的数组(遍历用到) */
	this.keys = new Array();
	/** 存放数据 */
	this.data = new Object();

	/**
	 * 放入一个键值对
	 * 
	 * @param {String}
	 *            key
	 * @param {Object}
	 *            value
	 */
	this.put = function(key, value) {
		if (this.data[key] == null) {
			this.keys.push(key);
		}
		this.data[key] = value;
	};

	/**
	 * 获取某键对应的值
	 * 
	 * @param {String}
	 *            key
	 * @return {Object} value
	 */
	this.get = function(key) {
		return this.data[key];
	};

	/**
	 * 删除一个键值对
	 * 
	 * @param {String}
	 *            key
	 */
	this.remove = function(key) {
		this.keys.remove(key);
		this.data[key] = null;
	};

	/**
	 * 遍历Map,执行处理函数
	 * 
	 * @param {Function}
	 *            回调函数 function(key,value,index){..}
	 */
	this.each = function(fn) {
		if (typeof fn != 'function') {
			return;
		}
		var len = this.keys.length;
		for ( var i = 0; i < len; i++) {
			var k = this.keys[i];
			fn(k, this.data[k], i);
		}
	};

	/**
	 * 获取键值数组(类似Java的entrySet())
	 * 
	 * @return 键值对象{key,value}的数组
	 */
	this.entrys = function() {
		var len = this.keys.length;
		var entrys = new Array(len);
		for ( var i = 0; i < len; i++) {
			entrys[i] = {
				key : this.keys[i],
				value : this.data[i]
			};
		}
		return entrys;
	};

	/**
	 * 判断Map是否为空
	 */
	this.isEmpty = function() {
		return this.keys.length == 0;
	};

	/**
	 * 获取键值对数量
	 */
	this.size = function() {
		return this.keys.length;
	};

	/**
	 * 重写toString
	 */
	this.toString = function() {
		var s = "{";
		for ( var i = 0; i < this.keys.length; i++, s += ',') {
			var k = this.keys[i];
			s += k + "=" + this.data[k];
		}
		s += "}";
		return s;
	};
}
