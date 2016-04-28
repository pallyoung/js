(function() {
	var consts = {
		isReady: false //文档是否就绪
	};
	var vari = {
		readyList: [],
		bodyChindrenLength: 0,
		$: window.$,
		ajaxTimeout: 60000,
		ajaxonerror: function() {},
		ajaxonsuccess: function() {},
		touchspan: 100, //超过该事件即被判定为longtouch 不触发事件
		originEventsType: {
			touch: ["touchmove", "touchstart", "touchend", "touchcancel"],
			mouse: ["mousemove", "mousedown", "mouseup", "mouseout"]
		}

	};
	var completed = function() {
		document.removeEventListener("DOMContentLoaded", completed, false);
		window.removeEventListener("load", completed, false);
		consts.isReady = true;
		var readyList = vari.readyList;
		for (var i = 0, l = readyList.length; i < l; i++) {
			readyList[i].call(this);
		}
	};
	var checkDomReady = (function() {
		document.addEventListener("DOMContentLoaded", completed, false);
		window.addEventListener("load", completed, false);
	})();

	var querySelector = function(selectors, isALl) {

	};
	var FormData = function() {
		if (window.FormData) {
			FormData = window.FormData;
		} else {
			FormData = function() {
				this.data = [];
			};
			FormData.prototype.append = function(key, value) {
				this.data.push(encodeURI(key) + "=" + encodeURI(value));
			}
		}
		return new FormData();
	};
	var events = ["touch", "longtouch", "dbltouch", "touchstart", "touchend", "touchmove"];
	/*获取小数位数
	 *getDecimal start*/
	var getDecimal = function(num) {
		if (!num || isNaN(num)) {
			throw new Error("参数错误");
		}
		num = num.toString();
		if (num.indexOf(".") == -1) {
			return 0;
		} else {
			return num.length - num.indexOf(".") - 1;
		}
	};
	/*getDecimal end*/
	/*移除小数点
	 *removePoint start*/
	var removePoint = function(num) {
			if (!num) {
				throw new Error("参数错误");
			} else {
				return num.toString().replace(/(?:^0?\.)|(?:\.)/, "");
			}
		}
		/*removePoint end*/
		/*	opt={
				url:url,
				data:data,
				timeout:timeout,
				success:success,
				error:error,
				async:async,
				headers:headers
			}*/
	var ajax = function(opt) {
		var xhr = new XMLHttpRequest();
		var opts = opt;
		if (Lab.typeOf(opts.data) == "Object") {
			var sendData = new FormData();
			for (var i in opts.data) {
				sendData.append(i, opts.data[i]);
			}
			opts.data = sendData.data ? sendData.data.join("&") : sendData;
		}
		opts.success = opts.success || vari.ajaxonsuccess;
		opts.error = opts.error || vari.ajaxonerror;
		xhr.timeout = opts.timeout || vari.ajaxTimeout;
		xhr.ontimeout = function() {
			opts.error();
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					opts.success(xhr);
				} else {
					opts.error(xhr);
				}
			}
		};
		xhr.open(opts.method || "get", opts.url || "", opt.async || true);
		if (opts.headers) {
			for (var i in opts.headers) {
				xhr.setRequestHeader(i, opts.headers[i]);
			}
		}
		xhr.send(opts.data);

	};
	var wheel = {
		ready: function(fun) {
			if (consts.isReady) {
				fun();
			} else {
				vari.readyList.push(fun);
			}
		},
		noConflict: function() {
			if (window.$ === Lab) {
				window.$ = vari._$;
			}
			return Lab;
		},
		querySelector: function(selectors) {
			if (document.querySelector) {
				wheel.qs = document.querySelector;
				return document.querySelector(selectors);
			} else {
				wheel.qs = querySelector;
				return querySelector(selectors);
			}

		},
		querySelectorAll: function(selectors) {
			if (document.querySelectorAll) {
				wheel.qsa = document.querySelectorAll;
				return document.querySelectorAll(selectors);
			} else {
				wheel.qsa = querySelector;
				return querySelector(selectors, "all");
			}
		},
		loadjs: function(url) {
			var script = "<script type='text/javascript' src='" + url + "'+></script>";
			wheel.ready(function() {
				document.body.innerHTML += script;
			});
		},
		add: function(num1, num2) {
			if (arguments.length < 2) {
				throw new Error("参数错误");
			}
			var decimal1 = getDecimal(num1);
			var decimal2 = getDecimal(num2);
			var times = Math.max(decimal2, decimal1);
			var times1 = Math.max(1, Math.pow(10, decimal2 - decimal1));
			var times2 = Math.max(1, Math.pow(10, decimal1 - decimal2));
			var total = parseInt(removePoint(num1)) * times1 + parseInt(removePoint(num2)) * times2;
			return total / Math.pow(10, times);

		},
		mul: function(num1, num2) {
			if (arguments.length < 2) {
				throw new Error("参数错误");
			}
			var decimal1 = getDecimal(num1);
			var decimal2 = getDecimal(num2);
			var times = Math.pow(10, decimal1) * Math.pow(10, decimal2);
			var total = parseInt(removePoint(num1)) * parseInt(removePoint(num2));
			return total / times;
		},
		devide: function(num1, num2) {
			if (arguments.length < 2) {
				throw new Error("参数错误");
			}
			var decimal1 = getDecimal(num1);
			var decimal2 = getDecimal(num2);
			var times1 = Math.max(1, Math.pow(10, decimal2 - decimal1));
			var times2 = Math.max(1, Math.pow(10, decimal1 - decimal2));
			var total = parseInt(removePoint(num1)) * times1 / parseInt(removePoint(num2)) / times2;
			return total;

		},
		minus: function(num1, num2) {
			if (arguments.length < 2) {
				throw new Error("参数错误");
			}
			var decimal1 = getDecimal(num1);
			var decimal2 = getDecimal(num2);
			var times = Math.max(decimal2, decimal1);
			var times1 = Math.max(1, Math.pow(10, decimal2 - decimal1));
			var times2 = Math.max(1, Math.pow(10, decimal1 - decimal2));
			var total = parseInt(removePoint(num1)) * times1 - parseInt(removePoint(num2)) * times2;
			return total / Math.pow(10, times);
		},
		setAjaxtimeout: function(time) {
			vari.ajaxTimeout = time;
		},
		getAjaxtimeout: function() {
			return vari.ajaxTimeout;
		},
		setAjaxonerror: function(callback) {
			vari.ajaxonerror = callback;
		},
		setAjaxonsuccess: function(callback) {
			vari.ajaxonsuccess = callback;
		},
		getAjaxonerror: function(callback) {
			return vari.ajaxonerror;
		},
		getAjaxonsuccess: function(callback) {
			return vari.ajaxonsuccess;
		},
		post: function(url, data, sync) {
			ajax({
				url: url,
				data: data,
				sync: sync
			});
		},
		get: function(url, sync) {
			ajax({
				url: url,
				sync: sync
			});
		},
		ajax: function(param) {
			ajax(param);
		},
		JSONParse: function(json) {
			if (Lab.typeOf(json == "String")) {
				try {
					return JSON.parse(json);
				} catch (e) {
					throw new Error("JSON格式错误");
				}
			} else {
				return json;
			}
		},
		typeOf: function(obj) {
			var type = Object.prototype.toString.call(obj);
			return type.slice(8, -1);
		},
		queryString: function(key) {
			var search = location.search;
			var match = "[\\?&]" + wd + "=([^&]+)(?:&|\\b)";
			var reg = new RegExp(match);
			if (reg.test(search)) {
				return RegExp.$1;
			}

		},


	};
	if(typeof window.define==="function"&&define.amd){
		define(function(){
			return wheel;
		});
	}else{
		window.$ = wheel;
	}	
})()