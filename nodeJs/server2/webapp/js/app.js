/*
 *app 级别的操作
 */
define(["base","individuation","poll"],function(ihandy,indiv,poll) {
	var or=window.or;
	var evts=ihandy.evts;
	function disableTouch(e) {
		var target = e.target;
		var type = target.getAttribute("touch-prevent");
		if (type == null || type !== "prevent") {
			return;
		}
		var timeinterval = 500;
		var layer = document.createElement("div");
		var box = target.getBoundingClientRect();
		var left = box.left,
			top = box.top,
			width = box.width,
			height = box.height;
		layer.style.cssText = "position:fixed;opacity:0;left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px";
		document.body.appendChild(layer);
		setTimeout(function() {
			document.body.removeChild(layer);
		}, timeinterval);

	}

	function locationHref(e) {
		var target = e.target;
		var type = target.getAttribute("data-target");
		if (type == null) {
			return;
		}
		or.redirect(type);
	}

	ihandy.ready(function(){
    	//indiv.preventKeyboardOverlay();
    	
		document.body.addEventListener(evts["touchstart"],function(e){
			locationHref(e);
			disableTouch(e);
		},false);
    
    try {
    //  instantiate Baidu map
    or.BDMap = new BMap.Map("allmap");
    or.BDMap.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
    or.BDMap.addControl(new BMap.NavigationControl());

    } catch (e) {
      console.log(e.message);
    }
    
    //  global daemon tasks, setup global reference to tasks
    or.daemon.reportPosition = poll.reportPosition;
    or.daemon.checkNewOrder = poll.checkNewOrder;
	})
})