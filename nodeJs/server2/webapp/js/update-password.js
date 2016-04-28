"use strict"
require(["base", "zeptodefine", "security-questions"], function(ihandy, $, questionList){
  /**
  * @controller update-password
  * @author     zhaowei@ihandy.cn
  */

	ihandy.ready(function() {
    var form,
        submitUpdate,
        changeValidFlag,
        checkLogin,
        checkPassword,
        checkConfirm,
        currentUser,
        fromflow = or.redirectParams,
        submitBTN;
        or.redirectParams = {}


    currentUser = ihandy.getCurrentUser();

    form = document.querySelector("#updatepassword form");
    submitBTN=document.querySelector("#updatepassword .button");
    submitBTN.style.marginTop=(document.body.clientHeight-775)+"px";
        
    changeValidFlag = function(el, flag) {
      /**
      * @method changeValidFlag
      * @param  el    string  for querySelector, it will be concated with sibling 'span'
      * @param  flag  string  it will be concated to be a zepto class string, currently supports 'true' or 'false'
      */
      var flagEl = $(document.querySelector(el + ' + span i'));
      flagEl.removeClass().addClass("icon icon-input-validator-" + flag);
    };
    
    checkLogin = function() {
      /**
      * @method checkLogin
      */
      var _data,
          _params,
          _config;
      
      _data = {
        userName: or.currentUser.userName,
        passWord: form.oldPassWord.value,
        type: 'login'
      };  
  
      _config = {
        success: function(result) {
            result = ihandy.parseJSON(result);
            var code = result.responseBody.errCode;
            var el = "#updatepassword input[name='oldPassWord']";
            var flag = (code == 'B01001000') ? 'true' : 'false';
            changeValidFlag(el, flag);
          }
      };

      _params = ihandy.ajaxRequestParam(or.transCode.I01001, _data, _config);

      ihandy.ajax(_params);
    };
    
    checkPassword = function () {
      /**
      * @method checkPassword
      */
      var _inputValue,
          _input,
          _pattern,
          _flag,
          _el;
      _input = form.passWord;
      _inputValue = _input.value;
      _pattern = /[0-9a-zA-Z]{6,12}/;
      _flag = _pattern.test(_inputValue) ? 'true' : 'false';
      _el = "input[name='passWord']";
      changeValidFlag(_el, _flag);
    };
    
    checkConfirm = function () {
      /**
      * @method checkConfirm
      */
      var _password,
          _confirm,
          _flag,
          _el;
      _password = form.passWord.value;
      _confirm = form.confirm.value;
      _flag = (_confirm == _password) ? 'true' : 'false';
      _el = "#updatepassword input[name='confirm']";
      changeValidFlag(_el, _flag);
    };
    
    submitUpdate = function(e){
      /**
      * @listener   submitUpdate
      * @usage      submit update password request via ajax
      */
      var _data,
          _params,
          _config,
          _securityQuestionStr;
      
      _securityQuestionStr = document.querySelector("#updatepassword p[data-roll='dst']").textContent;
      
      _data = {
        userName: or.currentUser.userName,
        oldPassWord: form.oldPassWord.value,
        passWord: form.passWord.value,
        securityQuestion: _securityQuestionStr,
        answer: form.answer.value,
        type: 'update'
      };
      
      _config = {
        success: function(result) {
            result = ihandy.parseJSON(result);
            console.log(result);
            if(ihandy.IsNull(result) || ihandy.IsNull(result.responseBody)){
                ihandy.alert({msg: "系统错误，修改密码失败！"});
                return;
            }else{
                if(!ihandy.IsNull(result.responseBody.errCode) && "B01003000" === result.responseBody.errCode){
                    ihandy.alert({msg:result.responseBody.errMsg,callback:function(){
                        if("login" === fromflow.fromflow){
                            or.redirect("login");//强制修改密码后 需要重新回到login页面 重新登录
                        }else{
                            or.redirect("personalcenter");//个人中心页面修改密码 回到个人中心
                        }
                    }});
                }else{
                    if(!ihandy.IsNull(result.responseBody.errCode)){
                        ihandy.alert({msg: result.responseBody.errMsg});
                    }
                }
            }
        }
      };
      
      _params = ihandy.ajaxRequestParam(or.transCode.I01003, _data, _config);
      
      ihandy.ajax(_params);
    };
    
    /* control logic */
    if (ihandy.IsNull(currentUser)) {
      or.redirect('login');
    };
    
    /* validate input data */
    form.addEventListener("change", function(e) {
      var _target = e.target;
      switch (_target)
      {
        case form.oldPassWord: 
          checkLogin();
          break;
        case form.passWord: 
          checkPassword();
          break;
        case form.confirm: 
          checkConfirm();
      };
    }, false);

    /* show security questions */
    ihandy.createSelect(document.getElementById("select-security-question"), questionList);    
    
    /* add listener for submit button */
    form.submit.addEventListener(ihandy.evts.touchstart, submitUpdate, false);
        
	});
});