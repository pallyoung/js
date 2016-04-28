/*
 *js与安卓交互的层
 */
define(["require","base"],function(require,base) {
	
	var ajaxQueue={
		
	};
	var androidBridge={
		
	};
	var exports={
	};
	var ora={
		getSN:function(){
			return "123456789012345";//for test
		},
		ajax:function(data){
			console.log("ajax done");
			ajaxback(data);
		},
		getKeyboardHeight:function(){
			return 500;
		},
		takePhoto:function(fname,cb){
			console.log("takePhoto done");
			androidCaller({
				interfaceNo:"N00000005",
				interfaceContent:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAlUlEQVR42o2RSQrDMAxFc5KCD5MTBgw5ioejeFMoybYhyaLdqPpFKp9AaAwPeXgSQu5E5EvO%2BaZE5a6IxRH37rjYKyukI6WUDe%2FwvOKTBSalhIQFHuTBH7Baa9gj4siJA%2BSHwgJHbmeC%2FKLso8i8%2F1ZGz1w5Xuw5Qg42Hjmj1rrD%2B835LEHvd58z%2F2CwH5tNnO0c3PkAGud706ytt0YAAAAASUVORK5CYII%3D"
			});
		},
		uploadZip:function(onderno){
			console.log("uploadZip done");
			androidCaller({
				interfaceNo:"N00000006",
				interfaceContent:{"errCode":"04004000","errMsg":"成功"}
			});
		},
		photograph:function(){
			console.log("photograph done");
		},
		callPhone:function(){
			console.log("callPhone done");
		}

	};


	if(window.ora){
		ora=window.ora;
	}
	function ajaxback(data) {
		//参数不对直接走异常
		try{
			if(typeof data==="string"){			
				data=JSON.parse(data);			
			}
			var transCode=data.transCode;
			if(ajaxQueue[transCode]){
				ajaxQueue[transCode].success.call(null,data);
				delete ajaxQueue[transCode];
			}else{
				console.log("transCode为"+transCode+",没有回调函数");	
			}
		}catch(e){
			require("base").alert({
				msg:"系统异常",//
				heading:"警告",//如果不指定heading则不显示标题
				OKButton:"确定",
			});
			console.log("ajax响应参数异常"+JSON.stringify(data));
		}
	}
	function androidAjax(source) {
		source = source || {
			url: "",
			contentType: "",
			type: "",
			data: {
				"requestNo": "13c099d99b7418511", //请求唯一编号 用于定位日志
				"transCode": "01001", //请求接口号
				"userName": "zhangsan", //登录用户帐号 
				"responseBody": {
				}, //请求参数
				"channelCode": "OR_ANDROID", //业务渠道 "OR_ANDROID" -- 为android app版
				"clientId": "862633027874143" //设备号
			},
			dataType: "",
			timeout: "",
			success:function(){},
			error:function(){}
		};
		try{
			var transCode=source.data.transCode;
			ajaxQueue[transCode]={
				success:source.success||function(){},
				error:source.error||function(){}
			}
			ora.ajax(JSON.stringify(source));
		}catch(e){
			console.log("ajax请求参数异常"+source);
		}
	}
	//获取软键盘高度
	function getKeyboardHeight (){
		return ora.getKeyboardHeight();
	}

	//获取设备号
	function getSN(){
		return	ora.getSN();
	}
	function takePhoto(fname){
		ora.takePhoto(fname);
	}
	function photograph(){
		ora.photograph();
	}
	function uploadZip(onderno){
		ora.uploadZip(onderno);
	}

	function callPhone(number){
		ora.callPhone(number);
	}

	//安卓调用接口
	function androidCaller(data){
		try{
			if(typeof data==="string"){			
				data=JSON.parse(data);			
			}
			if(androidBridge[data.interfaceNo]){
				androidBridge[data.interfaceNo].call(null,data.interfaceContent);
			}
		}catch(e){
			console.log(e);
		}
	}
	window.ajaxback=ajaxback;
	window.nativeback=androidCaller;
	androidBridge={
		"N00000001":function(h){//拍照/浏览本地图片 回调给前端
			require("identity-authentication").IdentityCheck.imgDisplay(h);
		},
		"N00000003":function(h){//软键盘弹出 并返回软键盘的高度
			require("individuation").preventOverlay();
		},
		"N00000004":function(h){//软键盘收回 并返回软键盘的高度
			require("individuation").afterPrevent();
		},
		"N00000005":function(value){//车况检查 拍照回调
			require("my-authentication").takePhotoCb(value);
		},
		"N00000006":function(value){//照片zip包上传回调
			require("my-authentication").uploadZipCb(value);
		}
	}
	exports={
		ajax:androidAjax,
		getKeyboardHeight:getKeyboardHeight,
		getSN:getSN,
		takePhoto:takePhoto,
		photograph:photograph,
		callPhone:callPhone,
		uploadZip:uploadZip
	}
	return exports;

});