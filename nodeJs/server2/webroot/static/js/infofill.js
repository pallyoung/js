(function(){
	var redirctParamMap=null;
	var trip = null;
	var adultCount = 0,childCount = 0;
	var selectedAdult = 0, selectedChild = 0;
	$(document).ready(function(){
		$("#nextPage").click(nextPage);
		redirctParamMap = window.redirctParam;
		init();
		$(".userinfo").click(function(){
			var param = new Map();
			param.put("orderNum",window.orderNum);
			param.put("ac",redirctParamMap.get("ac"));
			param.put("cc",redirctParamMap.get("cc"));
			param.put("sd",redirctParamMap.get("sd"));
			param.put("hotelId",redirctParamMap.get("hotelId"));
			wx.url.next('choice.html',param);
		});
		$(".backbutton").click(function(){
			if(confirm("订单还差一步就完成了，确认返回？")) {
				var param = new Map();
				param.put('hotelId',redirctParamMap.get("hotelId"));
				wx.url.pre("date.html",param);
			}
		});
		if(!window.orderNum) {
			//生成订单号并创建订单
			window.orderNum =(new Date()).format("yyyyMMddhh") + Math.uuid("16");
			var requestParam = {
				transCode:"OPEN0003",
				requestTime:(new Date()).getTime(),
				sessionToken:"",
				body:JSON.stringify({openId:window.openId,orderNum:window.orderNum,hotelId:redirctParamMap.get("hotelId"),tripDate:redirctParamMap.get("sd")})
			};
			wx.ajax(wx.url.AJAX_LOAD,requestParam,function(data){
				if(data.msg=="Success") {
					alert("创建订单成功");
				}else if(data.msg=="TripNotExists") {
					alert("TripNotExists");
				}
			},function(){
				
			},false);
		}else {
			var param = {
				transCode:"OPEN0004",
				requestTime:(new Date()).getTime(),
				sessionToken:"",
				body:JSON.stringify({orderNum:window.orderNum})
			};
			wx.ajax(wx.url.AJAX_LOAD, param, function(data) {
				if(data.msg){
					alert("订单不存在");
				}else {
					var idx=0;
					for(var i=0;i<data.customers.length;i++) {
						if(data.customers[i].type+""==="1"){
							$(".users .adult")[idx].innerHTML = data.customers[i].fullName;
							selectedAdult++;
							idx++;
						}
					}
					idx=0;
					for(var i=0;i<data.customers.length;i++) {
						if(data.customers[i].type+""==="0"){
							$(".users .child")[idx].innerHTML = data.customers[i].fullName;
							selectedChild++;
							idx++;
						}
					}
				}
			},function(){
				alert("出错");
			},true);
		}
	});
	function nextPage() {
		if(validate()) {
			var body = {
				orderNum:window.orderNum,
				orderName:document.getElementById("orderName").value,
				orderPhone:document.getElementById("orderPhone").value,
				orderEmail:document.getElementById("orderEmail").value,
				openId:window.openId,
				memo:document.getElementById("orderMemo").value
			};
			var requestParam = {
				transCode:"OPEN0007",
				requestTime:(new Date()).getTime(),
				sessionToken:"",
				body:JSON.stringify(body)
			};
			wx.ajax(wx.url.AJAX_LOAD, requestParam,function(data){
				if(data.msg==="Success") {
					wx.url.next("pay.html");
				}
			},function() {},false);
		}
	}
	function validate() {
		if(adultCount+childCount!==selectedAdult + selectedChild) {
			alert("请录入完整的出行旅客信息");
			return false;
		}
		var reg = /^([\u4e00-\u9fa5·•㵟]{1,24})$|^([a-zA-Z·•㵟]{3}[a-zA-Z·•㵟]*)$/;
		if(!reg.test(document.getElementById("orderName").value)) {
			alert("姓名格式有误");
			return false;
		}
		reg = /^1\d{10}$/;
		if(!reg.test(document.getElementById("orderPhone").value)) {
			alert("手机格式有误");
			return false;
		}
		reg = /^w+((-w+)|(.w+))*@[a-za-z0-9]+((.|-)[a-za-z0-9]+)*.[a-za-z0-9]+$/;
		if(!reg.test(document.getElementById("orderEmail").value)) {
			alert("邮箱格式有误");
			return false;
		}
		return true;
	}
	
	function init() {
		var idx = 1;
		adultCount = parseInt(redirctParamMap.get('ac'));
		childCount = parseInt(redirctParamMap.get('cc'));
		for(var i=0;i<adultCount;i++) {
			$(".users").append("<li class='adult'>成人</li>");
			idx++;
		}
		idx=1;
		for(var i=0;i<childCount;i++) {
			$(".users").append("<li class='child'>儿童</li>");
			idx++;
		}
		document.getElementById("tripDate").innerHTML=redirctParamMap.get('sd');
		document.getElementById("adultCount").innerHTML=adultCount;
		document.getElementById("childCount").innerHTML=childCount;
		if(redirctParamMap.get('orderNum')) {
			window.orderNum = redirctParamMap.get('orderNum');
		}
		var requestParam = {
			transCode:"OPEN0002",
			requestTime:(new Date()).getTime(),
			sessionToken:"",
			body:JSON.stringify({id:redirctParamMap.get('hotelId')})
		};
		wx.ajax(wx.url.AJAX_LOAD, requestParam,function(data){
			trip = data;
			document.getElementById("totalPrice").innerHTML = trip.minPrice*adultCount + trip.childPrice*childCount;
		},function() {},false);
	}
})();