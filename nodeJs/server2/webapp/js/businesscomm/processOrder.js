/**
* @module   processOrder
* @desc     component for order submit, consists of popup form and ajax post
* @exports  (Function)
* @author   zhaowei@ihandy.cn
* @usage    processOrder(orderNo, submitType, ajaxSuccess, postSubmit)
*/
define(["base"], function(ihandy){
  var OrderProcesser = function (orderNo, submitType, ajaxSuccess, postSubmit) {
    /**
    * @constructor  OrderProcesser
    * @param        orderNo     (String)
    * @param        submitType  (String)    ENUM {"receive", "refuse", "cancel", "close"}
    * @param        ajaxSuccess (Function)  async callback function for ajax submit
    * @param        postSubmit  (Function)  sync callback function after submit
    */
    
    this.transCode = or.transCode.I03002;
    this.orderNo = orderNo;
    this.userName = or.currentUser.userName;
    this.submitType = submitType;
    this.ajaxSuccess = ajaxSuccess || function() {};
    this.postSubmit = postSubmit || function() {};
  }
  
  OrderProcesser.prototype.submit = function (args) {
    var data = {},
        config = {},
        params = {};
    
    data.userName = this.userName;
    data.orderNo = this.orderNo;
    data.option = this.submitType;
    
    config.success = this.ajaxSuccess;
    
    switch (this.submitType) {
      case "receive":
        data.promiseArrivalsTime = args.promiseArrivalsTime;
        break;
      case "refuse":
        data.refuseGrounds = args.refuseGrounds;
        break;
      case "cancel":
        data.cancelParty = args.cancelParty;
        data.cancelReason = args.cancelReason;
        break;
      case "close":
        data.orderStatus = args.orderStatus;
        data.closeReason = args.closeReason;
        break;
    }
    
    params = ihandy.ajaxRequestParam(this.transCode, data, config);
    ihandy.ajax(params);
  }
  
  OrderProcesser.prototype.receive = function () {
    /**
    * @method   receive
    * @param    promiseArrivalsTime (String Enum):
    *           1 -- 15分钟内
    *           2 -- 30分钟内
    *           3 -- 45分钟内
    *           4 -- 1个小时内
    *           5 -- 1小时30分钟内
    *           6 -- 2小时内
    *           7 -- 2小时以上
    */

    //  popup the time selecting dialog
    var popupHtml = '',
        args = {},
        that = this,
        checkConfirm;

    popupHtml += '<select name="promiseArrivalsTime">';
    popupHtml += '<option value="1">15分钟内</option>';
    popupHtml += '<option value="2">30分钟内</option>';
    popupHtml += '<option value="3">45分钟内</option>';
    popupHtml += '<option value="4">1个小时内</option>';
    popupHtml += '<option value="5">1小时30分钟内</option>';
    popupHtml += '<option value="6">2小时内</option>';
    popupHtml += '<option value="7">2小时以上</option>';
    popupHtml += '</select>';

    checkConfirm = function(choice) {
      var select = document.querySelector('select[name=promiseArrivalsTime]');
      args.promiseArrivalsTime = select.value;
      if (choice) {
        //  process operation
        that.submit(args);
        that.postSubmit();
      }
    }

    ihandy.confirm({
      msg:popupHtml,
      heading:"承诺到达时间",
      OKButton:"提交",
      cancelButton:"取消",
      callback: checkConfirm
    });
  }
    
  OrderProcesser.prototype.refuse = function () {
    /**
    * @method refuse
    * @param  refuseGrounds (String)  拒单理由
    */
  
    var popupHtml = '',
        args = {},
        that = this,
        checkConfirm;
    
    popupHtml += '<textarea autofocus rows=4 name="refuseGrounds"></textarea>';

    checkConfirm = function(choice) {
      var textarea = document.querySelector('textarea[name=refuseGrounds]');
      var refuseGrounds = textarea.value;
      if (choice) {
        //  process operation
        that.submit(args);
        that.postSubmit();
      }
    }

    ihandy.confirm({
      msg:popupHtml,
      heading:"请输入拒绝理由",
      OKButton:"提交",
      cancelButton:"取消",
      callback: checkConfirm
    });
  }
    
  OrderProcesser.prototype.cancel = function () {
    /**
    * @method cancel
    * @param  cancelParty   (String)  取消方
    * @param  cancelReason  (String)  取消原因
    */

    var checkConfirm,
        args = {},
        that = this,
        popupHtml = '';
    
    //  popup the cancel reason input dialog
    popupHtml += '<p>';
    popupHtml += '<label for="cancelParty">取消方</label>';
    popupHtml += '<select name="cancelParty">';
    popupHtml += '<option value="1">司机取消</option>';
    popupHtml += '<option value="2">车主取消</option>';
    popupHtml += '</select>';
    popupHtml += '</p>';
    popupHtml += '<p>';
    popupHtml += '<textarea autofocus rows=4 name="cancelReason" placeholder="请简单描述取消原因（必填）"></textarea>';
    popupHtml += '</p>';

    checkConfirm = function (choice) {
      args.cancelParty = document.querySelector('select[name=cancelParty]').value;
      args.cancelReason = document.querySelector('textarea[name=cancelReason]').value;

      if (choice) {
        if (ihandy.IsNull(args.cancelReason)) {
          //  please write the fucking reason !!!
          that.cancel();
        } else {
          //  process operation
          that.submit(args);
          that.postSubmit();
        }
      }
    }

    ihandy.confirm({
      msg:popupHtml,
      heading:"请输入取消原因",
      OKButton:"提交",
      cancelButton:"取消",
      callback: checkConfirm
    });
  }
    
  OrderProcesser.prototype.close = function (orderStatus, closeReason) {
    /**
    * @method close
    * @param  orderStatus (String)  订单状态
    * @param  closeReason (String)  关闭原因
    */

    var popupHtml = '',
        args = {},
        that = this,
        checkConfirm;

    popupHtml += '<p>';
    popupHtml += '<label for="orderStatus">完成状态</label>';
    popupHtml += '<select name="orderStatus">';
    popupHtml += '<option value="1">已完成</option>';
    popupHtml += '<option value="2">未完成</option>';
    popupHtml += '</select>';
    popupHtml += '</p>';
    popupHtml += '<p>';
    popupHtml += '<label for="orderStatus">关闭原因</label>';
    popupHtml += '<select name="closeReason">';
    popupHtml += '<option value="关闭原因1">关闭原因1</option>';
    popupHtml += '<option value="关闭原因2">关闭原因2</option>';
    popupHtml += '</select>';
    popupHtml += '</p>';

    checkConfirm = function(choice) {
      args.orderStatus = document.querySelector('select[name=orderStatus]').value;
      args.closeReason = document.querySelector('select[name=closeReason]').value;

      if (choice) {
        //  process operation
        that.submit(args);
        that.postSubmit();
      }
    }

    ihandy.confirm({
      msg:popupHtml,
      heading:"请选择订单完成状态",
      OKButton:"提交",
      cancelButton:"取消",
      callback: checkConfirm
    });
  };
  
  var exports = function (orderNo, submitType, ajaxSuccess, postSubmit) {
    var processer = new OrderProcesser(orderNo, submitType, ajaxSuccess, postSubmit);
    switch (submitType) {
      case "receive":
        processer.receive();
        break;
      case "refuse":
        processer.refuse();
        break;
      case "cancel":
        processer.cancel();
        break;
      case "close":
        processer.close();
        break;
    }
  }
  return exports;
});