/**
* @module poll
* @author zhaowei@ihandy.cn
* @desc   一些轮询任务
*/
define(["base", "dateFormat"], function(ihandy) {
  var Poll,
      report,
      check;
      
  Poll = function (intervalTime, task) {
    var on,
        interval,
        intervalId;
    
    on = false;
    
    interval = function () {
      
      intervalId = setInterval(task, intervalTime);
      return intervalId;
    };
    
    this.start = function () {
      
      if (!on) {
        intervalId = interval();
        on = true;
      }
    };
    
    this.stop = function () {
      if (on) {
        clearInterval(intervalId);
        on = false;
      }
    };
  };
  
  report = function () {
    var submit;

    submit = function (position) {
      var data,
          config,
          params,
          user,
          date;
      
      user = or.currentUser.userName;
      
      date = (new Date()).format('Y-m-d H:i:s');

      data = {
        userName: user,
        carLocation: position,
        currentTime: date
      };

      config = {
        success: function () {
          // do sth
        }
      };
      
      params = ihandy.ajaxRequestParam(or.transCode.I04001, data, config);
      ihandy.ajax(params);    
    };
    
    or.bdgetCurrentPosition(or.BDMap, function (position, lng, lat) {
      // save position into localstorage
      or.currentPosition.set({lng:lng, lat:lat});
      
      position = {
        x: lng,
        y: lat
      };
      position = JSON.stringify(position);
      submit(position);
    });
  };
  
  check = function () {
    console.log('new order checking');
    var user,
        success,
        push;

    user = or.currentUser.userName;
    
    push = function (order) {
      or.activeOrder = order;
      or.redirect('pieorderinfo');
    };
    
    success = function (result) {
      var order;
      result = JSON.parse(result);
      result = result.responseBody;
      console.log(result);
      if (result.errCode === 'B03001000') {
        if (result.orderList.length > 0) {
          order = result.orderList[0];
          if (!or.cacheOrders.get(order.orderNo)) {
            or.cacheOrders.set(order.orderNo, order);
            push(order);
          } else {
            // stop polling
            console.log('no new order');
          }
        }
      } else {
        ihandy.alert({msg: "网络错误"})
      }
    };
    
    (function () {
      var data,
          config,
          params;

      data = {
        userName: user,
        orderType: 'not',
        recordNum: 1,
        currentPageNum: 1
      };
      config = {
        success: success
      };
      params = ihandy.ajaxRequestParam(or.transCode.I03001, data, config);
      ihandy.ajax(params);
    })();
    
  };
  
  reportPosition = new Poll(or.config.POLLING_INTERVAL, report);
  checkNewOrder = new Poll(or.config.POLLING_INTERVAL, check);
        
  var exports = {
    reportPosition: reportPosition,
    checkNewOrder: checkNewOrder
  };
  return exports;
});