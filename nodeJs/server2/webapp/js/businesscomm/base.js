/*
 *公共方法
 */
define(["popup", "select","log","androidbridge","businesscomm/desktopdebug","ajaxRequestParam","currentUser"], function() {
	var exports = {};
	var op = Object.prototype,
		tostring = op.toString,
		hasOwn = op.hasOwnProperty,
		ap = Array.prototype,
		apsp = ap.splice;

	var isReady, readyList = [];
	var activeInput=null;
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

	function isElement(value){
		return !!(value &&value.nodeName);
	}

	function isNumber(value){
		return typeof value === 'number';
	}

	function getRect(dom){
		return (isElement(dom)&&dom.getBoundingClientRect());
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
	    * @param obj: 对象{
				key:value
	   		 }
	    * @return  obj: 对象{
				value:key
	   		 }
	    */
	function reverseJSON(source){
		source=parseJSON(source);
		var dst={};
		for(var o in source){
			dst[source[o]]=o;
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

	function loadScript(src,cb){
		if(!isString(src)){
			throw new Error("不是有效的src");
		}
		cb=cb||function(){};
		var script=document.createElement("script");
		script.onload=function loadjs(){
			script.onload=null;
			script.onerror=null;
			script.ontimeout=null;
			cb.call();
		}
		script.onerror=function(){
			script.onload=null;
			script.onerror=null;
			script.ontimeout=null;
			console.log("loadScript:'"+src+"'falied");
		}
		script.ontimeout=function(){
			script.onload=null;
			script.onerror=null;
			script.ontimeout=null;
			console.log("loadScript"+src+"falied");
		}

		script.src=src;
		script.type="text/javascript";
		document.head.appendChild(script);
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
	function parseJSON(value){
		if(isString(value)){
			try{
				return	JSON.parse(value);
			}catch(e){
				console.log("JSON格式不合法");
			}
		}
		return value;
	}
	/*
	*比较两个值是否相等
	*/
	function equal(o1,o2){
		if (o1 === o2) return true;
		if (o1 === null || o2 === null) return false;
		if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
		var t1 = typeof o1,
			t2 = typeof o2,
			length, key, keySet;
		if (t1 == t2) {
			if (t1 == 'object') {
				if (isArray(o1)) {
					if (!isArray(o2)) return false;
					if ((length = o1.length) == o2.length) {
						for (key = 0; key < length; key++) {
							if (!equal(o1[key], o2[key])) return false;
						}
						return true;
					}
				} else if (isDate(o1)) {
					if (!isDate(o2)) return false;
					return equal(o1.getTime(), o2.getTime());
				} else if (isRegExp(o1) && isRegExp(o2)) {
					return o1.toString() == o2.toString();
				} else {
					keySet = {};
					for (key in o1) {
						if (!equal(o1[key], o2[key])) return false;
					}
					return true;
				}
			}
		}
		return false;
	}
	/*
	*给定一个值，删除其中的某一项
	*/
	function removeItem(source,item){
		if(isArray(source)){
			var dst=[];
			source.forEach(function(v,i,s){
				if(!equal(item,v)){
					dst.push(v);
				}
			});
			source=dst;
		}else if(isString(source)){
			source.replace(item,"");
		}else if(isObject(source)){
			for(var o in source){
				if(equal(item,source[o])){
					delete source[o];
				}
			}
		}
		return source;
	}

	function disableScale(){
		var phoneWidth = parseInt(window.screen.width);
		var phoneScale = phoneWidth / 640;

		var ua = navigator.userAgent;
			if (/Android (\d+\.\d+)/.test(ua)) {
			var version = parseFloat(RegExp.$1);
			// andriod 2.3
			if (version > 2.3) {
				document.head.innerHTML+=('<meta name="viewport" content="width=640, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
			// andriod 2.3以上
			} else {
				document.head.innerHTML+=('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
			}
			// 其他系统
		} else {
			document.head.innerHTML+=('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
		}
	}
	/*
	*将一个dom节点移动一定位置
	*/
	function move(dom,type,value){
		if(!isElement(dom)||!type||!value){
			return
		}
		if(type=="x"){
			dom.style.left=value+"px";
		}else if(type=="y"){
			dom.style.top=value+"px";
		}
	}
	/*
	*将dom节点向上拉一定值
	*/
	function slideUp(dom,value){
		if(!isElement(dom)||!isNumber(value)){
			return
		}
		move(dom,"y",-value);
	}
	/*
	*将dom节点向下拉一定值
	*/
	function slideDown(dom,type,value){
		if(!isElement(dom)||!isNumber(value)){
			return
		}
		move(dom,"y",value);
	}

	function getOffsetTop(target) {
       	if(!isElement(target)){
       		return
       	}
        var offsetTop =0;
        while (target.offsetParent) {
            offsetTop += target.offsetTop;
            target= target.offsetParent;
        }
        return offsetTop;
     }
     function getOffsetLeft(target) {
        if(!isElement(target)){
       		return
       	}
        var offsetLeft =0;
        while (target.offsetParent) {
            offsetLeft += target.offsetLeft;
            target= target.offsetParent;
        }
        return offsetLeft;
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
		isNumber:isNumber,
		isElement:isElement,
		ready: ready,
		hasTouch: hasTouch,
		evts: evts,
		setStyle: setStyle,
		IsNull: IsNull,
		chuliJsonComm: chuliJsonComm,
		mul:mul,
		copy:copy,
		slideUp:slideUp,
		slideDown:slideDown,
		getOffsetTop:getOffsetTop,
		getOffsetLeft:getOffsetTop,
		parseJSON:parseJSON,
		extend:extend,
		reverseJSON:reverseJSON,
		equal:equal,
		removeItem:removeItem,
		loadScript:loadScript
	})
	for (var i = 0; i < arguments.length; i++) {
		extend(exports, arguments[i]);
	}
	//disableScale();
/*	ready(function(){
		
	})*/
	return exports;
});