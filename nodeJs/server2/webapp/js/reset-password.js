"use strict"

require(["base"], function(ihandy) {
  /**
  * @controller   reset-password
  * @author       zhaowei@ihandy.cn
  */
  var submitBTN;
  ihandy.ready(function() {
    var form,
        question,
        button,
        queryQuestion,
        submitReset,
        userInfo;
    
    userInfo = ihandy.getCurrentUser();

    
    form = document.querySelector('#resetpassword form');
     submitBTN=form.submit;
     submitBTN.style.marginTop=(document.body.clientHeight-750)+"px";
    
    /* query security question via ajax */
    queryQuestion = function() {
      var _data,
          _params,
          _config;
      
      _data = {
        userName: form.userName.value,
        type: "securityQuestion"
      };
      
      /* check if userName input value exist */
      if (!_data.userName) {
        ihandy.alert({msg: "请填写用户名。"});
        return;
      };
      
      _params = ihandy.ajaxRequestParam(or.transCode.I01003, _data, _config);
      
      _config = {
        "success": function(result) {
          result = ihandy.parseJSON(result);
          if (result.responseBody.errCode == 'B01003000') {
            question = result.responseBody.securityQuestion;
            /* show security question */
            form.question.value = question;
          } else {
            ihandy.alert({msg: "无法获取安全问题，请检查用户名是否正确。"});
            return;
          };
        }
      };
      ihandy.ajax(_params);
    };
    
    /* submit reset via ajax */
    submitReset = function() {
      var _data,
          _params,
          _config;
      
      _data = {
        userName: form.userName.value,
        securityQuestion: question,
        answer: form.answer.value,
        type: 'reset'
      };
      
      /* check if input value exist */
      if (!_data.userName) {
        ihandy.alert({msg: "请填写用户名。"});
        return;
      }
      
      _params = ihandy.ajaxRequestParam(or.transCode.I01003, _data, _config);
      
      _config = {
        "success": function(result) {
          result = ihandy.parseJSON(result);
          if (result.responseBody.errCode == 'B01003000') {
            console.log('password reset successfully');
            ihandy.alert({msg: "密码已经成功重置。"});
          } else {
            ihandy.alert({msg: "密码重置失败，请检查安全问题的答案是否正确。"});
          };
        }
      };
      
      ihandy.ajax(_params);
    };
    
    /* control logic */
    
    /* listen for userName input form state change */
    form.userName.addEventListener("change", queryQuestion, false);
    
    /* listen for submit button */
    form.submit.addEventListener("click", submitReset, false);
  });
});