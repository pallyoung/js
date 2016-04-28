define(["base","jquery"],function(ihandy,$){
	var exports={};
	
	var IdentityCheck=function(){
		img :"";
		imgdata:"";
	};

	
	IdentityCheck.prototype= {
		init : function(){
			$("#companyDispatchPhone").text(or.currentUser.companyDispatchPhone);
			$("#serviceCompanyName").text(or.currentUser.serviceCompanyName);
			$("#driverName").text(or.currentUser.driverName);
			$("#driverPhone").text(or.currentUser.driverPhone);
		},
		imgDisplay : function(data){
			exports.IdentityCheck.imgdata = data;
			exports.IdentityCheck.img.attr("src",exports.IdentityCheck.imgdata);
		},
		activation : function(){
			if(ihandy.IsNull(exports.IdentityCheck.imgdata)){
				//提示用户设置图片
				ihandy.alert({msg:"请设置个人图像",heading:"提示"});
			}
			var _config = {
				success : function(result){
					result = ihandy.parseJSON(result);
					if(ihandy.IsNull(result) ||
					   ihandy.IsNull(result.responseBody)){
						    ihandy.alert({msg:"系统异常，激活失败！",heading:"提示"});
					}else{
						switch (result.responseBody.errCode){
							case "B01002000":
								ihandy.alert({msg:result.responseBody.errMsg,heading:"提示",callback:function(){
									//激活成功  如果当前登录用户的密码为初始密码，则强制跳转到密码修改页面 让用户修改密码 否则跳转到登录页面
									if(1 == or.currentUser.needModifyPassword){
										or.redirectParams = {"fromflow":"login"};
										or.redirect("updatepassword");
									}else{
										or.redirect("login");
									}
								}});
								break;
							case "B01002001":
								ihandy.alert({msg:result.responseBody.errMsg,heading:"提示"});
								break;
						}
						if(!ihandy.IsNull(result.responseBody.errMsg)){
							ihandy.alert({msg:result.responseBody.errMsg,heading:"提示"});
						}
					}
				}
			};
			var param = {
				userName : or.currentUser.userName,//用户名
				userPic : exports.IdentityCheck.imgdata//用户图片内容
			};
			var _params = ihandy.ajaxRequestParam(or.transCode.I01002, param, _config);
			ihandy.ajax(_params);
		}

	};

	ihandy.ready(function(){
		exports.IdentityCheck = new IdentityCheck();
		//加载页面信息
		exports.IdentityCheck .init();
		document.querySelector("#activation").addEventListener(ihandy.evts.touchstart,exports.IdentityCheck.activation);
		exports.IdentityCheck.img = $(".img_border");
		document.querySelector("#localupload").addEventListener(ihandy.evts.touchstart,function(){ora.initLocalPic()});
		document.querySelector("#phonePhotograph").addEventListener(ihandy.evts.touchstart,function(){ora.photograph()});
	});

	return exports;
});