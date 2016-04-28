/*
 *公共方法
 */
define(["popup", "select","log"], function() {
	var exports = {};
	var op = Object.prototype,
		tostring = op.toString,
		hasOwn = op.hasOwnProperty,
		ap = Array.prototype,
		apsp = ap.splice;

	var isReady, readyList = [];

	function noop() {}

	function IsNull(str) {
		if ('' + str == "NAN" || '' + str == "NaN" || str == undefined || str == null || (str instanceof Array && str.length == 0) || str == "undefined" || str == "null" || str === "" || str == "{}") {
			return true;
		}
		if (typeof(str) == "object" && Object.prototype.toString.call(str).toLowerCase() == "[object object]") {
			try {
				var str1 = JSON.stringify(str);
				if (str1 == "{}") {
					return true;
				}
			} catch (e) {}
		}
		return false;
	}

	function isUndefined(value) {
		return typeof value === 'undefined';
	}

	function isDefined(value) {
		return typeof value !== 'undefined';
	}

	function isFunction(value) {
		return tostring.call(value) === '[object Function]';
	}

	function isArray(value) {
		return tostring.call(value) === '[object Array]';
	}

	function isObject(value) {
		return typeof value === "object";
	}

	function isString(value) {
		return typeof value === "string";
	}

	function hasTouch() {
		return document.hasOwnProperty("ontouchstart") ? true : false;
	}

	function extend(dst, source) {
		for (var o in source) {
			if (source.hasOwnProperty(o)) {
				dst[o] = source[o];
			}
		}
		return dst;
	}
	 /***** 判断是否为json对象 *******
	    * @param obj: 对象（可以是jq取到对象）
	    * @return isjson: 是否是json对象 true/false
	    */
	function IsJsonF(obj) {
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		return isjson;
	}
	function chuliJsonComm(obj1, obj2) {
		if (IsJsonF(obj1)) {
			for (var x in obj1) {
				if (!IsNull(obj1[x])) {
					obj2[x] = obj1[x];
				} else {
					if (obj1[x] == null) {
						obj2[x] = "";
					}
				}
			}
		}
	}

	function copy(source){
		try{
			return JSON.parse(JSON.stringify(source));
		}catch(e){
			console.log("the first argument is not an object");
		}
	}
	/*
	 *@prama string
	 */
	function setStyle(styles) {
		var stylesheet = document.createElement("style");
		stylesheet.innerHTML = styles;
		document.head.appendChild(stylesheet);
	}

	function _doReady() {
		while(readyList.length!==0){
			readyList.shift().call(null);
		}
	}

	function _completed() {
		isReady = true;
		_doReady();
		document.removeEventListener("DOMContentLoaded", _completed, false);
		window.removeEventListener("load", _completed, false);
	}

	function _checkReady() {
		if (document.readyState === "complete") {
			isReady = true;
			_doReady();
		} else {
			document.addEventListener("DOMContentLoaded", _completed, false);
			window.addEventListener("load", _completed, false);
		}
	}


	function ready(fun) {
		if (!isFunction(fun)) {
			return;
		}
		if (isReady) {
			fun.call(null);
		} else {
			readyList.push(fun);
		}
	}

	function mul(arg1, arg2) {
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	}
	function disableTouch(e){
		var target=e.target;
		var timeinterval=500;
		var layer=document.createElement("div");
		var box=target.getBoundingClientRect();
		var left=box.left,
			top=box.top,
			width=box.width,
			height=box.height;
		layer.style.cssText="position:fixed;opacity:1;left:"+left+"px;top:"+top+"px;width:"+width+"px;height:"+height+"px";
		document.body.appendChild(layer);
		setTimeout(function(){
			document.body.removeChild(layer);
		},timeinterval);

	}

	var evts = hasTouch() ? {
		touchstart: "touchstart",
		touchend: "touchend",
		touchmove: "touchmove"
	} : {
		touchstart: "mousedown",
		touchend: "mouseup",
		touchmove: "mousemove"
	};

	_checkReady();
	extend(exports, {
		isArray: isArray,
		isUndefined: isUndefined,
		isDefined: isDefined,
		isObject: isObject,
		isString: isString,
		ready: ready,
		hasTouch: hasTouch,
		evts: evts,
		setStyle: setStyle,
		IsNull: IsNull,
		chuliJsonComm: chuliJsonComm,
		mul:mul,
		copy:copy
	})
	for (var i = 0; i < arguments.length; i++) {
		extend(exports, arguments[i]);
	}
	ready(function(){
		document.body.addEventListener(evts["touchstart"],disableTouch,false);
	})
	return exports;
})