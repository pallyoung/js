(function(){
	/**
	 * param为Map格式
	 */
	wx.url.pre = function(preUrl,param) {
		if(arguments.length>0){
			if(preUrl.indexOf("?")===-1){
				preUrl += "?";
			}
			param.each(function(key, value, index){
				preUrl = preUrl + "&" + key + "=" + value;
			});
		}
		location.href = preUrl;
	};
	wx.url.next = function(url, param) {
		if(arguments.length>1){
			if(url.indexOf("?")===-1){
				url += "?";
				param.each(function(key, value, index){
					url = url + key + "=" + value + "&";
				});
				url = url.substring(0,url.length-1);
			}else {
				param.each(function(key, value, index){
					url = url + "&" + key + "=" + value;
				});
			}
			
		}
		location.href = url;
	};
	var redirctParamMap = new Map();
	$(function(){
		initParam();
		window.redirctParam = redirctParamMap;
	});

	/**
	 * 初始化跳转参数
	 */
	function initParam() {
		var param=[];
		param = location.search.slice(1).split("&");
		for(var i=0;i<param.length;i++){
			redirctParamMap.put(param[i].split('=')[0],param[i].split('=')[1]);
		}
	}
})();