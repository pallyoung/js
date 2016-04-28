(function(){
	var redirctParamMap;
	$(document).ready(function(){
		$("#nextPage").click(nextPage);
		redirctParamMap = window.redirctParam;
		getDetail(redirctParamMap.get("id"));
	});
	
	function nextPage(e) {
		location.href = "date.html?hotelId=" + window.hotelId;
	}
	function getDetail(id) {
		window.hotelId = id;
		var requestParam = {
			transCode:"OPEN0002",
			requestTime:(new Date()).getTime(),
			sessionToken:"",
			body:JSON.stringify({id:id})
		};
		wx.ajax(wx.url.AJAX_LOAD, requestParam,draw,function() {},true);
	}
	function draw(data) {
		if(data.images.length>0) {
			if(window.devMode){
				document.getElementById("img").src="/getImage?id=" + data.images[0].id;
			}else {
				document.getElementById("img").src=data.images[0].diskPath;
			}
		}else {
			document.getElementById("img").src="/static/images/none.jpg";
		}
		document.getElementById("tripTitle").innerHTML=data.name;
		document.getElementById("price").innerHTML=data.jiage;
		document.getElementById("minPrice").innerHTML=data.shoujia;
		document.getElementById("xingchengjieshao").innerHTML=data.sheshi;
		document.getElementById("fuwu").innerHTML=data.fuwu;
	}
})();