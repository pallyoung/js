define(["base", "time"], function (ihandy, time) {
  var showMap,
      page,
      order,
      makePage,
      countdown,
      showDistance,
      pageHtml = '';
  
  order = or.activeOrder;
  
  page = document.getElementById("pieorderinfo");
  
  makePage = function () {
    pageHtml += '<section class="pieorderinfo"><div class="infoarea">';
    pageHtml += '<header class="part_a';
    pageHtml += (order.receiveType === '2') ? ' grabs' : '';
    pageHtml += '">';
    pageHtml += '<span class="distance">';
    pageHtml += '正在计算';
    pageHtml += '</span>';
    pageHtml += '</header>';
    pageHtml += '<section class="part_b"><div class="content"><div class="fill">';
    pageHtml += '<div><div>';
    pageHtml += '<p class="">服务内容：';
    pageHtml += order.serviceContent; // Service Content
    pageHtml += '</p>';
    pageHtml += '<p class="location">救援地址：';
    pageHtml += order.helpAddress; // Help Address
    pageHtml += '</p>';
    pageHtml += '<p class="">';
    pageHtml += order.remark; // Supplement
    pageHtml += '</p>';
    pageHtml += '</div></div>';
    pageHtml += '</div></div>';
    pageHtml += '<p class="time">';
    pageHtml += order.surplusTime; // count down
    pageHtml += '</p>';
    pageHtml += '</section><footer class="part_c"></footer></div>';
    pageHtml += '<div class="buttonarea">';
    if (order.receiveType === '1') {
      pageHtml += '<a href="javascript:void(0)" class="button bg_or margin_right width_1 fts32">接单</a>';
      pageHtml += '<a href="javascript:void(0)" class="button bg_yellow width_1 fts32">拒单</a>';
    } else {
      pageHtml += '<a href="javascript:void(0)" class="button bg_or width_2 fts40">抢单</a>';
    }
    pageHtml += '</div>';
    pageHtml += '</section>';
    
    page.innerHTML = pageHtml;
  };
    
  countdown = function() {
    var counter = page.querySelector(".time");
    time.countDown(order.surplusTime, 1, counter, 1);
  };
  
  showMap = function () {
    var touchArea = page.querySelector(".part_c");
    var infoArea = page.querySelector(".infoarea");
    var buttonArea = page.querySelector(".buttonarea");
    
    var changeStyle = function() {
      infoArea.style.top = "-500px";
      buttonArea.style.display = "none";
    };
    
    touchArea.addEventListener(ihandy.evts.touchstart, function(e) {
      changeStyle();
      setTimeout(function(){or.redirect('map')}, 900);
    }, false);
  };
  
  showDistance = function(){
    var i,
        addr,
        position,
        distanceElement;

      position = or.currentPosition.get();
      addr = new BMap.Point(position.lng, position.lat);
      distanceElement = page.querySelector('.distance');
      or.getDistance(or.BDMap, order.orderNo, addr, order.helpAddress, function(data){
        distanceElement.innerHTML = data[order.orderNo];
      });
  };
  
  if (order) {
    makePage();
    countdown();
    showDistance();
    showMap();
  } else {
    or.redirect('mytask');
  }
  
});