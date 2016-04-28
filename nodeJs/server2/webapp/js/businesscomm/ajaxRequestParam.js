/*
 *ajax请求参数
 */
define(["require"],function() {
	var exports = {};

	function ajaxRequestParam(transCode, responseBody, _config) {
		var base = require("base");
		var param = {
			url: or.ajaxURL,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			type: "post",
			data: {
				"responseNo": (or.clientId || (or.clientId = base.getSN())+Date.now()), //请求唯一编号 用于定位日志
				"transCode": "", //请求接口号
				"userName": responseBody.userName || (or.currentUser&&or.currentUser.userName)||require("base").getCurrentUser().userName, //登录用户帐号
				"responseBody": {
					//请求报文主体
				}, //请求参数
				"channelCode": or.channelCode[0], //业务渠道 "OR_ANDROID" -- 为android app版
				"clientId": or.clientId || (or.clientId = base.getSN()) //设备号
			},
			dataType: "text/plain",
			timeout: "60000",
			success: function() {},
			error: function() {}
		}
		param.data.transCode = transCode;
		param.data.responseBody = responseBody;
		base.extend(param, _config);
		return param;
	}
	exports = {
		ajaxRequestParam: ajaxRequestParam
	}
	return exports;
});