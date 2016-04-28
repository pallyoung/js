require(["base", "zeptodefine"], function(ihandy, $) {
  ihandy.ready(function() {
    var submitFeedback,
        currentUser,
        form;
    
    submitFeedback = function() {
      var _data,
          _params,
          _config;
      
      _data = {
        userName: currentUser.userName,
        opinionContext: $.trim(form.opinionContext.value)
      };
      
      /* check if input is empty */
      if (ihandy.IsNull(_data.opinionContext)) {
        ihandy.alert({msg: "请填写反馈意见内容再提交。"});
        return;
      };
      
      _config = {
        success: function(result) {
          result = ihandy.parseJSON(result);
          if (result.responseBody.errCode == 'B01005000') {
            // OK
            ihandy.alert({msg: result.errMsg});
            // other operations
          } else {
            // Wrong
            ihandy.alert({msg: result.errMsg});
            // other operations            
          };
        }
      };
      
      _params = ihandy.ajaxRequestParam(or.transCode.I01005, _data, _config);
      
      ihandy.ajax(_params);
    };
    
    /* control logic */
    currentUser = ihandy.getCurrentUser();
    
    form = document.querySelector('#feedback form');
    
    /* listen for submit */
    form.submit.addEventListener('click', submitFeedback, false);
    
  });
});