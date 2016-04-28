/*
 *当前用户信息
 */
define(function() {
	var exports={};
	/*
	*prama:(object)userinfo
	*/
	var currentUser = function(userinfo) {
		this.userName="";//登录用户名
    this.freeLogin="";//是否为免登陆状态
    this.passWord="";//用户密码
		this.status = 1; //0为隐身，1为在线 默认在线
		this.helpCompany = "";
		this.carType = ""; //车辆类型
		this.carNo = ""; //车牌号 
		this.serviceContent = []; //可选服务内容
		this.userCar = "" //用户所属车辆
		this.userServiceContent = []; //用户所属车辆已选服务内容
		this.catType = ""; //用户所属车辆车辆类型
		this.catList = []; //可选车辆信息
		this.companyDispatchPhone = ""; //公司调度电话号码
		this.serviceCompanyName = ""; //服务商公司名称
		this.driverName = ""; //司机姓名
		this.driverPhone = ""; //司机手机号码
		this.userStatus = ""; //用户状态
		this.userPic = ""; //用户图片内容
		var keys=Object.keys(userinfo),key;
		for(var i= keys.length-1;i>=0 ;i--){
			key=keys[i]
			this[key]=userinfo[key];
		}
	}
	currentUser.prototype={
		save:function(userinfo){	
			if(userinfo){
				var keys=Object.keys(userinfo),key;
				for(var i= keys.length-1;i>=0 ;i--){
					key=keys[i]
					this[key]=userinfo[key];
				}
			}		
			localStorage[or.localStorageKey.currentUser]=this.stringify();
		},
		stringify:function(){
			var userinfo={};
			var keys=Object.keys(this),key;
			for(var i= keys.length-1;i>=0 ;i--){
				key=keys[i]
				userinfo[key]=this[key];
			}
			return JSON.stringify(userinfo);
		}
	}
	exports.createUser=function (userinfo) {
		if(or){
			or.currentUser=new currentUser(userinfo);
		}
		return or.currentUser;
	}
	exports.getCurrentUser=function () {
		try{
			var userinfo=localStorage[or.localStorageKey.currentUser];
			if(userinfo){
				userinfo=JSON.parse(userinfo);
				if(or){
					or.currentUser=new currentUser(userinfo);
				}
				return or.currentUser
			}
		}catch(e){
			console.log(Date.now()+"获取当前用户失败");
			return null;
		}
	}
	return exports;
})