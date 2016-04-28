"use strict"
require(["base"], function(ihandy) {
  /**
  * @controller my-message
  * @author     zhaowei@ihandy.cn
  */
  
  ihandy.ready(function() {
    var messageHtml = '',
        messageWrap,
        ajaxData,
        ajaxConfig;
    
    messageWrap = document.querySelector("#mymessage ul.list-message");
    
    ajaxData = {
      userName: or.currentUser.userName
    };
    ajaxConfig = {
      "success": function(result) {      
      result = JSON.parse(result);
      var messages = result.responseBody.message;
      for (var i in messages) {
        var message = messages[i];
        messageHtml += '<li>';
        messageHtml += '<div class="message-header">';
        //messageHtml += '<span class="message-from message-from-1">官方</span>';
        messageHtml += '<span class="message-title">';
        messageHtml += message.messageTitle;
        messageHtml += '</span>';
        messageHtml += '<span class="message-time">';
        messageHtml += message.messageTime;
        messageHtml += '</span>';
        messageHtml += '</div>';
        messageHtml += '<div class="message-body">';
        messageHtml += '<p>';
        messageHtml += message.messageContent;
        messageHtml += '</p>';
        messageHtml += '</div>';
        messageHtml += '</li>';
      };
      messageWrap.innerHTML = messageHtml;
    }    
  };
    
    ihandy.ajax(ihandy.ajaxRequestParam(or.transCode.I01004, ajaxData, ajaxConfig));
  });
});