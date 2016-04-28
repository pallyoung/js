define(["base", "zeptodefine", "time", "processOrder"], function (ihandy, $, time, processOrder) {
  /**
  * @controller my-task
  * @author     zhaowei@ihandy.cn
  */
  
  var loadOrders,     //  loadOrders method
      Pagination,     //  Pagination class
      user,           //  current user name
      cacheOrders,
      page;           //  mytask page dom object
  
  page = document.querySelector("#mytask");
  user = or.currentUser.userName;
  
  loadOrders = function (currentPage, perPage, userName, orderType, orderNo) {
    /**
    * @method loadOrders
    * @param  userName    (String)
    * @param  orderType   (String)  ENUM {'not', 'doing', 'over'}
    * @param  orderNo     (String)
    * @param  currentPage (Int)
    * @param  perPage     (Int)
    * @desc   get order(s) data via ajax and append to the DOM
    */
    
    var _data,
        _params,
        _config;
    
    _data = {
      userName: userName,
      orderType: orderType,
      orderNo: orderNo
    }
    
    _config = {
      success: function (result) {
        var orders,
            order,
            i,
            htmlWrap,
            htmlWrapClass,
            htmlStr = '',
            promiseArrivalsTimeValue = [
              '15分钟内', 
              '30分钟内', 
              '45分钟内', 
              '1个小时内', 
              '1小时30分钟内', 
              '2小时内'
            ];
            
        result = JSON.parse(result);
        result = result.responseBody;
        if (result.errCode === 'B03001000') {
          orders = result.orderList;
          
          for (i in orders) {
            if (orders.hasOwnProperty(i)) {
              order = orders[i];
              
              //  cache orders
              or.cacheOrders.set(order.orderNo, order);
              
              htmlStr += '<section class="';
              htmlStr += ('order'+order.orderNo);
              htmlStr += ' info_box';
              htmlStr += order.receiveType === '2' ? ' grab' : '';
              htmlStr += '">';
              htmlStr += '<p class="info_title">';
              htmlStr += '<span class="order_number">';
              htmlStr += order.orderNo;
              htmlStr += '</span>';
              htmlStr += '<span class="fr">';
              htmlStr += order.orderStatus;     // to be converted into string {0：未接单，1：拒单，2：实施，3：完成，4：关闭，5：取消，6：失效}
              htmlStr += '</span>';
              htmlStr += '</p>';
              htmlStr += '<div class="info_main">';
              htmlStr += '<p class="service_type service_type_';
              htmlStr += order.serviceContent; // to be calculated as a number
              htmlStr += '"></p>';
              htmlStr += '<section>';
              htmlStr += '<p>';
              htmlStr += '<span class="location">救援地址：</span>';
              htmlStr += '<span>';
              htmlStr += order.helpAddress;
              htmlStr += '</span>';
              htmlStr += '</p>';
              htmlStr += '<p>';
              htmlStr += '<span>距&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离：</span>';
              htmlStr += '<span class="distance">';
              htmlStr += '正在计算';
              htmlStr += '</span>';
              htmlStr += '</p>';
              htmlStr += '<p>';
              htmlStr += '<span>客户来源：</span>';
              htmlStr += '<span>';
              htmlStr += order.customerFrom;
              htmlStr += '</span>';
              htmlStr += '</p>';
              htmlStr += '<p>';
              htmlStr += '<span>服务内容：</span>';
              htmlStr += '<span>';
              htmlStr += order.serviceContent;
              htmlStr += '</span>';
              htmlStr += '</p>';
              htmlStr += '</section>';
              htmlStr += '<a href="javascript:void" class="arrow" ';
              htmlStr += 'data-order="';
              htmlStr += order.orderNo;
              htmlStr += '"></a>';
              htmlStr += '</div>';
              
              // addinfo
              if (orderType === 'doing') {
                
                htmlStr += '<p class="addinfo">';
                htmlStr += '<span class="time">';
                htmlStr += promiseArrivalsTimeValue[order.promiseArrivalsTime - 1];
                htmlStr += '</span>';
                htmlStr += '</p>';
                
              } else if (orderType === 'over') {
                
                var temp = order.closeReason||order.cancelReason||order.refuseGrounds;
                if (temp) {
                  htmlStr += '<p class="addinfo">';
                  htmlStr += temp;
                  htmlStr += '</p>';
                }
                
              }
                              
              htmlStr += '<p class="button_group">';
              // buttons
              switch (orderType) {
                case 'not':
                  htmlStr += '<span data-initial-time="';
                  htmlStr += order.surplusTime;
                  htmlStr += '" class="countdown time">';
                  htmlStr += '</span>';
                  htmlStr += '<a data-order="';
                  htmlStr += order.orderNo;
                  htmlStr += '" data-operation="receive" href="javascript:void">接单</a>';
                  htmlStr += '<a data-order="';
                  htmlStr += order.orderNo;
                  htmlStr += '" data-operation="refuse" href="javascript:void">拒单</a>';                  
                  break;
                  
                case 'doing':
                  htmlStr += '<a data-order="';
                  htmlStr += order.orderNo;
                  htmlStr += '" data-operation="contact" data-phone="';
                  htmlStr += order.carPhone;
                  htmlStr += '" href="javascript:void">联系车主</a>';
                  htmlStr += '<a data-order="';
                  htmlStr += order.orderNo;
                  htmlStr += '" data-operation="cancel" data-phone="';
                  htmlStr += order.carPhone;
                  htmlStr += '" href="javascript:void">取消救援</a>';                   
                  htmlStr += '<a data-order="';
                  htmlStr += order.orderNo;
                  htmlStr += '" data-operation="close" href="javascript:void">关闭订单</a>';
                  break;
                  
                case 'over':
                  htmlStr += '<a href="javascript:void" data-target="lottery">抽奖</a>';
                  htmlStr += '<a href="javascript:void">评价</a>';
              }
              htmlStr += '</p>';
              htmlStr += '</section>';
            }
          }
          
          switch (orderType) {
            case 'not':
              htmlWrapClass = 'not';
              break;
            case 'doing':
              htmlWrapClass = 'have';
              break;
            case 'over':
              htmlWrapClass = 'finished';
          }
          
          htmlWrap = $('section.' + htmlWrapClass); // create a jQuery/Zepto object
          htmlWrap.html(htmlStr); // update DOM
          
          //  calculate distance and show
          (function(){
            var i,
                addr,
                position;
            
              position = or.currentPosition.get();
              addr = new BMap.Point(position.lng, position.lat);
              
              for (i in orders) {
                if (orders.hasOwnProperty(i)) {
                  (function(){
                    var order,
                        orderNo,
                        distanceELement;
                    
                    order = orders[i];
                    orderNo = order.orderNo;
                    distanceElement = page.querySelector('.order'+orderNo+' .distance');
                    or.getDistance(or.BDMap, orderNo, addr, order.helpAddress, function(data){
                      console.log(distanceELement);
                      distanceElement.innerHTML = data[orderNo];
                    });
                  })();
                }
              }
          })();
          
          // fire countdown
          if (orderType === 'not') {
            (function () {
              var counters,
                  counter,
                  initial;
              
              counters = page.querySelectorAll('.countdown');
              for (var i = 0, l = counters.length; i < l; i++) {
                counter = counters[i];
                initial = counter.getAttribute('data-initial-time');
                time.countDown(initial, 1, counter, 1);
              }
            })();
          }
          
        } else {
          ihandy.alert({msg: result.errMsg});
        }
      }
    }
        
    _params = ihandy.ajaxRequestParam(or.transCode.I03001, _data, _config);
    
    ihandy.ajax(_params);
  }
  
  /*************************************SPLIT LINE**************************************/
  
  Pagination = function (cur, per, total, load) {
    /**
    * @constructor   Pagination
    * @param    cur       (Int)   current page No
    * @param    per       (Int)   items per page
    * @param    total     (Int)   total items
    * @param    load      (Func)  _proto_ function (currentPage, perPage, ...) {}
    */
    
    this.totalPages = Math.ceil(total / per);
    this.currentPage = cur;
    this.perPage = per;
    this.nextPage = function () {
      if (this.currentPage === this.totalPages) {
        ihandy.alert({msg: "已经是最后一页了"});
      } else {
        this.currentPage += 1;
        load(this.currentPage, this.perPage);
      }
    }
  }
    
  /*************************************SPLIT LINE**************************************/  
  
  page.addEventListener(ihandy.evts.touchstart, function(e) {
    /**
    * add event handler for buttons and tabs via delegation
    */
    var buttons = page.querySelectorAll(".button_group a");
    var tabs = page.querySelectorAll(".select_button");
    var arrows = page.querySelectorAll(".arrow");
    var target = e.target;
    
    for (var i in tabs) {
      //  start loop: seeking for a tab to check if the click happened on it
      
      if (target === tabs[i]) {
        var status = target.getAttribute("data-status");
        switch (status) {
          case 'have':
            status = 'doing';
            break;
          case 'not':
            status = 'not';
            break;
          case 'finished':
            status = 'over';
        }
        loadOrders(1, 10, user, status); // load the orders(task) of matched status
        break;  //  quit the loop
      }
    }
    
    for (var i in arrows) {
      if (target === arrows[i]) {
        var orderNo = target.getAttribute("data-order");
        or.activeOrder = or.cacheOrders.get(orderNo);
        or.redirect('map');
        break;
      }
    }

    for (var i in buttons) {
      //  start loop: seeking for a button to check if the click happened on it
      
      if (target === buttons[i]) {
        //  target button found
        e.preventDefault();
        
        var operation = target.getAttribute("data-operation"),
            orderNo = target.getAttribute("data-order");
        
        var ajaxCB = function(result) {
          result = JSON.parse(result);
        };
        
        switch (operation) {
          case 'receive':
            processOrder(orderNo, operation, ajaxCB);
            break;
            
          case 'refuse':
            //  put the whole block into a immediately invoked function to avoid variable pollution
            (function(){
            processOrder(orderNo, operation, ajaxCB);
            })();

            break;
            
          case 'cancel':
            //  put the whole block into a immediately invoked function to avoid variable pollution
            (function(){
              
              var postSubmit = function() {
                  //  redirect to finished tab
                  tabs[2].checked = true;

                  //  load/refresh html for the tab
                  loadOrders(1, 10, user, 'over');              
              }
              
              var phone = target.getAttribute('data-phone');
              //  wrap the cancel operations into a callback function, as we have to remind before that
              
              
              var process = function () {
                  processOrder(orderNo, operation, ajaxCB, postSubmit)              
              }
              
              //  preCancel
              ihandy.alert({
                msg:"在取消前是否先致电客户" + phone + '？',
                heading:"请确认",
                OKButton:"确定",
                callback: process
              });

            })();
            break;
            
          case 'close':
            //  put the whole block into a immediately invoked function to avoid variable pollution
            (function(){
              //  popup the close reason input dialog
              var postSubmit = function () {
                //  redirect to finished tab
                //loading.show();
                tabs[2].checked = true;

                //  load/refresh html for the tab
                loadOrders(1, 10, user, 'over');              
              }
              processOrder(orderNo, operation, ajaxCB, postSubmit)
            })();
        }
        
        break;  //  quit the loop
      }
    }
  }, false);
  
  /*************************************SPLIT LINE**************************************/
  
  var init = function () {
    console.log('my task page init');
    loadOrders(1,10,user,'not');
  }
    
  exports = {
    init: init
  }
  
  return exports;
});