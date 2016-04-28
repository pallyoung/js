/*personal-center.js*/
define(["base"],function(ihandy){
	var userStatusType=["隐身","在线"];
	var currentUser=or.currentUser;

	var evts=ihandy.evts;
	var toggleUserStatusButton,onLineInfo;
	/*
	*parma (nubmer)userStatus: 0或1
	*/
	function toggleUserStatus(){
		var userStatus=1-currentUser.userStatus;
    if (userStatus == 1) {
      or.daemon.reportPosition.start();
    } else {
      or.daemon.reportPosition.stop();
    }
		sendUserStatusToServer(userStatus);
	}
	function toggleUserStatusSuccess(){
		currentUser.userStatus=1-currentUser.userStatus;
		if(currentUser.userStatus==1){
			onLineInfo.style.display="block";
		}else{
			onLineInfo.style.display="none";
		}

	}
	function toggleUserStatusError(){
		
	}

	function sendUserStatusToServerCb(data){
		data=ihandy.parseJSON(data);
		try{
			if(data.requestBody.errCode=="B01007000"){

			}else{
				toggleUserStatusError();
			}
		}catch(e){
			toggleUserStatusError();
		}
	}
	function sendUserStatusToServer(userStatus){
		/*
		*服务端参数 1为隐身，2为有空
		*/
		userStatus=1+userStatus;
		var parma=ihandy.ajaxRequestParam(or.transCode["I01007"],{
			userName:or.currentUser.userName,
			userStatus:""+userStatus
		},{success:sendUserStatusToServerCb});
		ihandy.ajax(parma);
	}
	ihandy.ready(function(){
		toggleUserStatusButton=document.querySelector("#toggleuserstatusbutton");
		onLineInfo=document.querySelector("#onlineinfo");
		toggleUserStatusButton.addEventListener(evts.touchstart,toggleUserStatus,false);
	});
})