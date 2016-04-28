"use strict"

require(["base"], function(ihandy) {
  /**
  * @controller logout
  * @author     zhaowei@ihandy.cn
  */
  var currentUser,
      logout;
  
  logout = function() {
    var _userinfo;
    _userinfo = {
      "userName" : '',
      "freeLogin" : '',
      "passWord" : '',
      "status" : 1,
      "helpCompany" : '',
      "carType" : '',
      "carNo" : '',
      "serviceContent" : '',
      "userCar": '',
      "userServiceContent": '',
      "catType": '',
      "catList" : '',
      "companyDispatchPhone" : '',
      "serviceCompanyName" : '',
      "driverName" : '',
      "driverPhone" : '',
      "userStatus" : '',
      "userPic" : ''
    };
    currentUser = ihandy.createUser(_userinfo);
    currentUser.save();
    or.redirect('login');
  };
  
  logout();
  ihandy.reportPosition.stop();
});