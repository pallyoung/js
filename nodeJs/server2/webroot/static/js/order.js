(function(){
	var redirctParamMap=null;
	var trip = null;
	var adultCount = 0,childCount = 0;
	$(document).ready(function(){
		$("#nextPage").click(nextPage);
		redirctParamMap = window.redirctParam;
		init();
	});
	function nextPage() {
		
	}
	function init() {
		adultCount = redirctParamMap.get('ac');
		childCount = redirctParamMap.get('cc');
		document.getElementById("tripDate").innerHTML=redirctParamMap.get('sd');
		document.getElementById("adultCount").innerHTML=adultCount;
		document.getElementById("childCount").innerHTML=childCount;
		var requestParam = {
			transCode:"OPEN0002",
			requestTime:(new Date()).getTime(),
			sessionToken:"",
			body:JSON.stringify({id:redirctParamMap.get('id')})
		};
		wx.ajax(wx.url.AJAX_LOAD, requestParam,function(data){
			trip = data;
			document.getElementById("totalPrice").innerHTML = trip.minPrice*adultCount + trip.childPrice*childCount;
		},function() {},true);
	}
})();