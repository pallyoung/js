/*mission-complete.js*/
define(["base","loading"], function(ihandy,loading) {
	var evts = ihandy.evts;

	var or=window.or,currentuser = or.currentUser;


	var note, report, sign, showpicBTN,remark;


	var isVeriflied=false;
	/*
	 *获取笔记和车况内容
	 */
	function getNoteInfo() {
			var param = ihandy.ajaxRequestParam(or.transCode.I03006, {
				orderNo: or.activeOrder.orderNo,
				userName: currentuser.userName
			}, {
				success: noteReportInit
			});
			ihandy.ajax(param);
		}
		/*
		 *笔记和车况内容填充
		 */
	function noteReportInit(data) {
			data = ihandy.parseJSON(data);
			var requestBody = data.requestBody;
			try {
				if (requestBody.errCode == "B03006000") {
					var ni = note.getElementsByTagName("i");
					var ri = report.getElementsByTagName("i");
					ni[0].innerHTML = requestBody.ticketNo;
					ni[1].innerHTML = requestBody.travelMileage;
					ni[2].innerHTML = requestBody.materialsConsume;
					ni[3].innerHTML = requestBody.otherFee;
					ni[4].innerHTML = requestBody.discount;
					ni[5].innerHTML = requestBody.actualFee;
					ri[0].innerHTML = "";
					ri[1].innerHTML = ""
				} else if (requestBody.errCode == "B03006001") {
					ihandy.alert({
						msg: requestBody.errMsg
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
		/*
		 *点击查看照片
		 */
	function showPic() {

	}

	function getSignBoxHTML() {
			var html = [];
			html.push("<div style=\"text-align:center;font-size:2.5rem;color:rgb(40,40,40);padding-bottom:3em\">");
			html.push("<p style=\"text-align:left;padding-left:1em;line-height:3em\">请输入用户提供的验证码</p>");
			html.push("<input type=\"text\" id=\"missioncomplete_verificationCode\" style=\"font-size:2.5rem;height:2em;width:10em;border:solid 1px rgb(110,110,110);border-radius:20px/10px;padding:0 1em\" />");
			html.push("</div>");
			return html.join("");

		}
		/*
		 *弹出验证签收框
		 */

	function uploadRemark(){
		var param = ihandy.ajaxRequestParam(or.transCode.I03004, {
			userName: currentuser.userName,
			orderNo: or.activeOrder.orderNo,
			remark: remark.innerHTML

		}, {
			success: function(data) {
				try {
					loading.hide();
					data = ihandy.parseJSON(data);
					if (data.requestBody.errCode == "B03004000") {
						or.redirect("mytask");
					} else if (data.requestBody.errCode == "B03004001") {
						ihandy.alert({
							msg:data.requestBody.errMsg
						});
					}else{
						ihandy.alert({
							msg:"系统异常"
						});
					}
				}catch(e){
					ihandy.alert({
						msg:"系统异常"
					});
				}

			}
		});
		loading.show();
		ihandy.ajax(param);
	}		 
	function showSignBox() {
		if(true===isVeriflied){
			uploadRemark();
		}else{
			ihandy.confirm({
				msg: getSignBoxHTML(),
				callback: dosign
			});
		}
	}

	/*
	 *验证签收
	 */
	function dosign(issuccess) {
		var param;
		if (true == issuccess) {
			param = ihandy.ajaxRequestParam(or.transCode["I03005"], {
				userName: currentuser.userName,
				orderNo: or.activeOrder.orderNo,
				verificationCode: document.getElementById("missioncomplete_verificationCode").value

			}, {
				success: dosignCb
			})
		}
	}

	/*
	 *验证签收回调
	 */
	function dosignCb(data) {
		data = ihandy.parseJSON(data);
		try {
			if (data.requestBody.errCode == "B03005000") {
				isVeriflied=true;
				uploadRemark();
			} else if (data.requestBody.errCode == "B03005001") {
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
	ihandy.ready(function() {
		note = document.querySelector('#missioncomplete .part_a');

		report = document.getElementById('missioncomplete_report');

		sign = document.getElementById('missioncomplete_sign');
		remark=document.querySelector("#missioncomplete .edit");

		showpicBTN = document.getElementById('missioncomplete_polaroid');

		sign.addEventListener(evts.touchstart, showSignBox, false);

		showpicBTN.addEventListener(evts.touchstart, showPic, false);
	});

	function init() {
		isVeriflied=false;
		getNoteInfo();
	}
	var exports = {
		init: init
	}
	return exports;
})