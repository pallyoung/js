/*service-content.js*/
define(["base"],function(ihandy){
	/*
	*页面局部变量定义
	*/
	var or=window.or;//将全局变量局部化

	var currentUser=or.currentUser||
					ihandy.getCurrentUser()||
					ihandy.createUser({"userName":"张三",
										"carList":["沪C-1728374","沪C-1728375","沪C-1728376","沪C-1728377"],
										"serviceContent":["qx","kjtc","psqy","ghlt","psjy","kjqx","dpdd","jjjw","ss","ks"],
										 "userServiceContent":["qx","kjtc","psqy"]
									});

	var carSelect,saveButton,serviceList,serviceListParent,backButton;//dom节点

	var userServiceContent={},carSelectList,serviceSelectList;

	var evts=ihandy.evts;
	/*
	*key 前端自己定义的类型名 value 服务端定义的类型枚举值
	*/
	var serivceContentDict={
		"qx":"1",
		"kjtc":"2",
		"psqy":"3",
		"ghlt":"4",
		"psjy":"5",
		"kjqx":"6",
		"dpdd":"7",
		"jjjw":"8",
		"ss":"9",
		"ks":"10"
	}
	/*
	*页面局部变量定义END
	*/
	function back(){
		or.redirect(or.referrer);
	}
	function wrapServiceContent(serviceContent){
		var wrapedServiceContent={};
		var dict=ihandy.reverseJSON(serivceContentDict);
		for (var i = serviceContent.length - 1; i >= 0; i--) {
			wrapedServiceContent[dict[serviceContent[i].serviceId]]=serviceContent[i].serviceName;
		};
		return wrapedServiceContent;
	}
	function initServiceContentElements(serviceContent){
		var wrapedServiceContent=wrapServiceContent(serviceContent);
		var dict=serivceContentDict;
		console.log(wrapedServiceContent);
		var dataTypeNodes=document.querySelectorAll("#servicecontent [data-type]");
		for (var l =dataTypeNodes.length-1;l>=0;l--){
			dataTypeNodes[l].className="";
			dataTypeNodes[l].parentNode.style.display="none";
		}
		for(var i in wrapedServiceContent){
			if(wrapedServiceContent.hasOwnProperty(i)){
				var dataTypeNode=document.querySelector("#servicecontent [data-type='"+i+"']");
				if(dataTypeNode){
					dataTypeNode.setAttribute("data-value",dict[i]);
					dataTypeNode.parentNode.style.display="block";
				}
			}
			
		}
	}
	function initUserServiceContent(serviceContent){
		console.log("serviceContent:"+JSON.stringify(serviceContent));
		dict=ihandy.reverseJSON(serivceContentDict);
		var _userServiceContent={};
		
		for(var i in serviceContent){
			if(serviceContent.hasOwnProperty(i)){
				var dataTypeNode=document.querySelector("#servicecontent [data-type='"+dict[serviceContent[i]]+"']");
				if(dataTypeNode){
					dataTypeNode.className="checked";
					_userServiceContent[serviceContent[i]]=true;
				}
			}
			
		}
		return _userServiceContent;
		
	}
	function getSerivceContentByCar(carNo){
		var param=ihandy.ajaxRequestParam(or.transCode.I01008,{
			carNo:carNo
		},{
			success:getSerivceContentByCarCb
		});
		ihandy.ajax(param);
	}
	function getSerivceContentByCarCb (data) {
		
		data=ihandy.parseJSON(data);
		var responseBody=data.responseBody;
		if(!responseBody){
			console.log("responseBody为空");
			ihandy.alert({
				msg:"系统异常"
			})
		}else if(responseBody.errCode==="B01008000"){
			console.log("服务内容获取成功");
			serviceSelectList=responseBody.serviceList;
			userServiceContent={};
			initServiceContentElements(serviceSelectList);

		}else if(responseBody.errCode==="B01008001"){
			console.log("服务内容获取失败");
			ihandy.alert({
				msg:responseBody.errMsg||"服务内容提交失败"
			})
		}
	}
	/*
	*保存按钮点击事件
	*/
	function saveSerivceContent(){
		if(ihandy.isDefined(carSelectList.selectedContent)&&
			(!ihandy.IsNull(userServiceContent))
			){
			sendSerivceContent();
		}else{
			ihandy.alert({
				msg:"请选择"
			});
		}
	}
	/*
	*保存按钮点击事件END
	*/

	/*
	*服务内容ajax请求
	*/
	function sendSerivceContent(){
		var data={
			"userName":currentUser.userName,
			"userCar":carSelectList.selectedContent,
			"userServiceContent":Object.keys(userServiceContent)
		}
		console.log("服务内容ajax请求参数封装");
		var param=ihandy.ajaxRequestParam(or.transCode["I01006"],data,{
			success:sendSerivceContentCb
		});
		console.log("服务内容ajax请求参数封装成功，参数值为："+JSON.stringify(param)+",接下来开始ajax请求");
		ihandy.ajax(param);
		console.log("ajax请求结束，等待回调");

	}
	/*
	*服务内容ajax请求END
	*/

	/*
	*服务内容ajax请求回调
	*/
	function sendSerivceContentCb(data){
		if(ihandy.IsNull(data)){
			console.log("参数异常");
			return;
		}
		data=ihandy.parseJSON(data);
		var responseBody=data.responseBody;
		if(!responseBody){
			console.log("responseBody为空");
			ihandy.alert({
				msg:"系统异常"
			})
		}else if(responseBody.errCode==="B01006000"){
			console.log("服务内容提交成功");
			currentUser.userServiceContent=Object.keys(userServiceContent);
			currentUser.save();
			or.redirect("personalcenter");

		}else if(responseBody.errCode==="B01006001"){
			console.log("服务内容提交失败");
			ihandy.alert({
				msg:responseBody.errMsg||"服务内容提交失败"
			})
		}
	}
	/*
	*服务内容ajax请求回调END
	*/

	/*
	*服务内容点击事件
	*/
	function toggleServiceChecked(e){
		var target=e.target;
		var dataType=target.getAttribute("data-type");
		var dataValue=target.getAttribute("data-value");
		if(!ihandy.IsNull(dataType)){
			if(target.className=="checked"){
				target.className="";
				delete userServiceContent[dataValue];
			}else{
				target.className="checked";
				userServiceContent[dataValue]=true;
			}
		}
	}
	/*
	*服务内容点击事件END
	*/

	ihandy.ready(function(){
		carSelect=document.querySelector("#servicecontent .select");
		serviceList=document.querySelectorAll("#servicecontent .con_service ul li");	
		serviceListParent=document.querySelector("#servicecontent .con_service ul");
		backButton=document.querySelector("#servicecontent .arrow");
		carSelectList=ihandy.createSelect(carSelect,currentUser.carList);
		carSelectList.on("change",getSerivceContentByCar);
		carSelectList.selectedContent=currentUser.userCar;
		initServiceContentElements(currentUser.serviceContent);
		userServiceContent=initUserServiceContent(currentUser.userServiceContent);
		saveButton=document.querySelector("#servicecontent #savebutton");
		backButton.addEventListener(evts["touchstart"],back,false);
		saveButton.addEventListener(evts["touchstart"],saveSerivceContent,false);
		serviceListParent.addEventListener(evts["touchstart"],toggleServiceChecked,false);
		
	})
})