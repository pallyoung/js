/**
* @lib  time  utilities
* @author zhaowei@ihandy.cn
*/
define(function () {
  var time = {};
  time.countDown = function(initial, step, wrapper, format) {
    /**
    * @method   countDown
    * @param    initial   (Int)     seconds for counting down
    * @param    step      (Int)     seconds for duration of counting
    * @param    wrapper   (Object HTMLElement)  the time wrapper HTMLElement
    * @param    format    (Int)     Enum  {1, 2, 3} 1 for x时x分x秒, 2 for xx:xx:xx, 3 for xxx秒
    * @usage    HTML: <span id="countdown"></span> JS: var wrapper = document.querySelector('#countdown'); time.countDown(2434, 1, wrapper, 1)
    */
    var start,
        MS_IN_SEC = 1000,
        SEC_IN_MIN = 60,
        SEC_IN_HOUR = 3600,
        MIN_IN_HOUR = 60;
    
    start = Date.parse(new Date());
    
    var counter = setInterval(function () {
      var current, remain, remainHours, remainMinutes, remainSeconds, passed, remainStr;
      // calculate remaining time
      current = Date.parse(new Date());
      passed = (current - start) / MS_IN_SEC;
      remain = initial - passed;
      remainStr = '';
      
      remainHours = Math.floor(remain / SEC_IN_HOUR);
      remainMinutes = Math.floor((remain % SEC_IN_HOUR) / SEC_IN_MIN);
      remainSeconds = remain % SEC_IN_MIN;
      
      // check counting over
      if (remain > 0) {

        // formating
        switch (format) {
          case 1:
            remainStr += remainHours ? (remainHours + '时') : '';
            remainStr += remainMinutes ? (remainMinutes + '分') : '';
            remainStr += remainSeconds ? (remainSeconds + '秒') : '';
            break;
            
          case 2:
            remainStr += (remainHours + ':' + remainMinutes + ':' + remainSeconds);
            break;
          
          case 3:
            remainStr += (remain + '秒');
        }        
        
      } else {
      
        //  stop counter
        clearInterval(counter);
        
        //  formating
        switch (format) {
          case 1:
            remainStr = '0秒';
            break;
            
          case 2:
            remainStr = '0:0:0';
            break;
            
          case 3:
            remainStr = '0';
        }
        
      }
            
      // output count down
      wrapper.innerHTML = remainStr;
    }, step * MS_IN_SEC);
  }
  return time;
});