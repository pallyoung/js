/*my-authentication.js*/
define(["base"], function(ihandy) {
	//验证
	var currentUser = ihandy.currentUser;

	var authenticationBTN, iptCheckAuth, contactBTN, okBTN, addoneBTN, photoArea;
	var evts = ihandy.evts;

	var checkContentSelectBox, checkResultSelectBox, photoname;
	var or = window.or;
	or.activeOrder = or.activeOrder || {};
	or.activeOrder.orderNo = or.activeOrder.orderNo || "dsdasdas";

	/*检查内容上传用*/
	var checkContentsList = [];

	/*检查内容选择*/
	var checkContents = [{
		checkContent: "油表状况",
		checkResult: ["1%", "5%", "10%", "15%", "20%", "25%"]
	}, {
		checkContent: "玻璃状况",
		checkResult: ["完好", "破碎"]
	}];
	/*照片模板*/
	var photoTemplates = [{
		key: "油表状况",
		length: "6"
	}, {
		key: "玻璃状况",
		length: "5"
	}];

	function wrapperCheckContents(checkContent, checkResult) {
		return {
			checkContent: checkContent,
			checkResult: checkResult,
		}
	}

	function getCheckContentsArray() {
		var checkContentsArray = [];
		checkContents.forEach(function(value) {
			checkContentsArray.push(value.checkContent);
		})
		return checkContentsArray;
	}

	function getCheckResultArray(checkContent) {
		var checkResult;
		checkContents.forEach(function(value) {
			if (value.checkContent === checkContent) {
				checkResult = value.checkResult;
				return;
			}
		});
		return checkResult;
	}

	function addone() {
		checkContentsList.push(wrapperCheckContents(checkContentSelectBox.selectedContent, checkResultSelectBox.selectedContent));
		checkContentSelectBox.setList(ihandy.removeItem(checkContentSelectBox.list, checkContentSelectBox.selectedContent));
		checkResultSelectBox.setList(getCheckResultArray(checkContentSelectBox.selectedContent));
	}

	function authentication(code) {
		if (!code) {
			ihandy.alert({
				msg: "请输入验证码"
			});
			return;
		}
		var param = ihandy.ajaxRequestParam(or.transCode.I03003, {
			orderNo: or.activeOrder.orderNo,
			userName: "" + code
		}, {
			success: authenticationCb
		});
		ihandy.ajax(param);
	}

	function authenticationCb(data) {
		data = ihandy.parseJSON(data);
		try {
			if (data.requestBody.errCode == "B03003000") {
				ihandy.alert({
					msg: data.requestBody.errMsg
				});
			} else if (data.requestBody.errCode == "B03003001") {
				ihandy.alert({
					msg: data.requestBody.errMsg
				});
			} else {
				ihandy.alert({
					msg: "系统异常"
				});
			}
		} catch (e) {
			ihandy.alert({
				msg: "系统异常"
			});
		}
	}

	function callByNumber() {
		ihandy.callPhoto("13555005505");
	}

	function takePhoto(e) {
		var target = e.target;
		var fname = target.getAttribute("data-fname");
		if (fname !== null) {
			photoname = fname;
			console.log(photoname);
			ihandy.takePhoto(fname);
		}

	}

	function takePhotoCb(data) {
			document.querySelector("[data-fname='" + photoname + "']").style.backgroundImage = "url(" + data + ")";
		}
		/*照片上传*/
	function uploadZip() {
		var orderNo=or.activeOrder.orderNo
		if (!validate()) {
			return;
		}
		console.log(orderNo + "照片上传开始");
		ihandy.uploadZip(orderNo);

	}

	function uploadZipCb(data) {
		data = ihandy.parseJSON(data);
		try {
			if (data.errCode == "B04004000") {
				authenticationConfirm();
			} else {
				ihandy.alert({
					msg: data.errMsg
				});
			}
		} catch (e) {
			ihandy.alert({
				msg: "系统异常"
			});
		}

	}

	function validate() {
		return true;
	}

	function authenticationConfirm() {
		var param;

		param = ihandy.ajaxRequestParam(or.transCode.I04003, {
			userName: currentUser.userName,
			orderNo: or.activeOrder.orderNo,
			checkContentsList: checkContentsList
		}, {
			success: authenticationConfirmCb
		});
		ihandy.ajax(param);
	}

	function authenticationConfirmCb(data) {
		data = ihandy.parseJSON(data);
		try {
			if (data.requestBody.errCode == "B03003000") {
				ihandy.alert({
					msg: data.requestBody.errMsg
				});
			} else if (data.requestBody.errCode == "B03003001") {
				ihandy.alert({
					msg: data.requestBody.errMsg
				});
			} else {
				ihandy.alert({
					msg: "系统异常"
				});
			}
		} catch (e) {
			ihandy.alert({
				msg: "系统异常"
			});
		}

	}

	function loadCameraArea() {
		var length, html = ["<p>"];
		for (var i = photoTemplates.length - 1; i >= 0; i--) {
			if (checkContentSelectBox.selectedContent === photoTemplates[i].key) {
				length = photoTemplates[i].length;
				for (var l = 0; l < length; l++) {
					html.push("<span data-fname='" + or.activeOrder.orderNo + "/" + checkContentSelectBox.selectedContent + "/" + l + "'></span>");
					if ((l + 1) % 3 === 0 && l !== length - 1) {
						html.push("</p><p>");
					} else if (l === length - 1) {
						html.push("</p>");
					}
				}
				photoArea.innerHTML = html.join("");
				return;
			}
		}

	}
	ihandy.ready(function() {

		authenticationBTN = document.getElementById("btn-check-auth");
		iptCheckAuth = document.getElementById("ipt-check-auth");
		contactBTN = document.getElementById("authentication_contact");
		okBTN = document.querySelector("#authentication .ok_button");
		addoneBTN = document.querySelector("#authentication_addone");

		photoArea = document.querySelector("#authentication .camera_area");

		authenticationBTN.addEventListener(evts.touchstart, function() {
			authentication(iptCheckAuth.value);
		}, false);

		contactBTN.addEventListener(evts.touchstart, callByNumber, false);

		okBTN.addEventListener(evts.touchstart, uploadZip, false);

		addoneBTN.addEventListener(evts.touchstart, addone, false);

		photoArea.addEventListener(evts.touchstart, takePhoto, false)

	})

	function init() {
		var select = document.querySelectorAll("#authentication .select");

		if (checkContentSelectBox !== undefined) {
			checkContentSelectBox.setList(getCheckContentsArray());
		} else {
			checkContentSelectBox = ihandy.createSelect(select[0], getCheckContentsArray());
		}

		if (checkResultSelectBox !== undefined) {
			checkResultSelectBox.setList(getCheckResultArray(value));
		} else {
			checkResultSelectBox = ihandy.createSelect(select[1], getCheckResultArray(checkContentSelectBox.selectedContent));
			checkContentSelectBox.on("change", function(value) {
				checkResultSelectBox.setList(getCheckResultArray(value));
				loadCameraArea();
			});
		}

	}

	return {
		init: init,
		takePhotoCb: takePhotoCb,
		uploadZipCb: uploadZipCb
	}
})