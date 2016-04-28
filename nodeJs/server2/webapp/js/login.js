define(["base","jquerydefine", "individuation"],function(ihandy, $, indiv){
  /**
  * @controller   login
  * @author       zhaowei@ihandy.cn
  */
	ihandy.ready(function(){
		var form,
        submitLogin,
        currentUser,
        tmp_userinfo;
        
    form = document.querySelector('#login form');
    currentUser = ihandy.getCurrentUser();
    console.log(currentUser);    
    submitLogin = function(type) {
      var _data,
          _params,
          _config,
          _userinfo;

      _config = {
        success: function(result) {
          result = JSON.parse(result);
          if (ihandy.IsNull(result)) {
            console.log("result is null");
            ihandy.alert({msg: "系统错误！"});
            return;
          };
          result = result.responseBody;
          switch (result.errCode) {
            case 'B01001000':
            case 'B01001003'://未激活
              console.log('login success');
              
              var _userinfo = {
                "userName" : tmp_userinfo.userName,
                "freeLogin" : tmp_userinfo.freeLogin,
                "passWord" : tmp_userinfo.passWord,
                "status" : 1,
                "helpCompany" : result.helpCompany,
                //"carType" : result.carType,
                //"carNo" : result.carNo,
                "serviceContent" : result.serviceContent,
                "userCar": result.userCar,
                "userServiceContent": result.userServiceContent,
                "userCarType": result.userCarType,
                "carList" : result.carList,
                "companyDispatchPhone" : result.companyDispatchPhone,
                "serviceCompanyName" : result.serviceCompanyName,
                "driverName" : result.driverName,
                "driverPhone" :tmp_userinfo.userName,//登录的用户名就是司机的电话号码
                "userStatus" : result.userStatus,
                "userPic" : result.userPic,
                "needModifyPassword":result.needModifyPassword//强制修改密码标志 0：无限制，1：强制修改
              };

              currentUser = ihandy.createUser(_userinfo);
              currentUser.save();
              
              if("B01001003" == result.errCode){
                  or.redirect("identityauthentication");
              }else{
                  //如果当前登录用户的密码为初始密码，则强制跳转到密码修改页面 让用户修改密码
                  if(1 == _userinfo.needModifyPassword){
                      or.redirectParams = {"fromflow":"login"};
                      or.redirect("updatepassword");
                  }else{
                      or.daemon.checkNewOrder.start();
                      or.daemon.reportPosition.start();                    
                      or.redirect("mytask");
                  }
              }

              break;
            case 'B01001001':
              console.log('no such user');
              ihandy.alert({msg: "用户不存在，请检查用户名输入是否正确。"});
              break;
            case 'B01001002':
              console.log('wrong password');
              ihandy.alert({msg: "密码错误。"});
              break;
          }
        }
        // url: "../js/testdata/login.json",
        /* just for testing use */
        // type: 'get'
      };
      
      _data = {
        userName: type == 'freelogin' ? currentUser.userName : form.userName.value,
        passWord: type == 'freelogin' ? currentUser.passWord : form.passWord.value,
        type: type
      };
      
      /* check if input value exist */
      if (!(_data.userName && _data.passWord)) {
        ihandy.alert({msg: "请输入帐号和密码。"});
        return;
      };
      
      /* create a tmp userinfo object for ajax success callback */
      tmp_userinfo = {
        userName: type == 'freelogin' ? currentUser.userName : form.userName.value,
        passWord: type == 'freelogin' ? currentUser.passWord : form.passWord.value,
        freeLogin: type == 'freelogin' ? 'true' : form.freeLogin.checked + ''      
      };
      _params = ihandy.ajaxRequestParam(or.transCode.I01001, _data, _config);
      console.log(_params);
      ihandy.ajax(_params);
    };
    
    /* control logic */
    /* Check login status */
    if (!ihandy.IsNull(currentUser) && currentUser.freeLogin == 'true') {
      console.log(currentUser);
      submitLogin('freelogin');
      return;
    };
    
    /* listen for the autologin checkbox */
    form.freeLogin.addEventListener(ihandy.evts.touchstart, function() {
      $(form.freeLogin).toggleClass("checked");
    }, false);
    
    /* listen for login submit button */
    form.submit.addEventListener(ihandy.evts.touchstart, function() {
      submitLogin('login');
    }, false);

    /* listen for activation link */
    document.querySelector("#loginactivation").addEventListener(ihandy.evts.touchstart, function() {
      submitLogin('activation');
    }, false);

	});
});