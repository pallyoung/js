(function(){
	var redirctParamMap=null;
	var adultCount = 0,childCount = 0;
	var selectedAdult = 0,selectedChild=0;
	var orderNum=null;
	$(function(){
		redirctParamMap = window.redirctParam;
		orderNum = redirctParamMap.get("orderNum");
		init();
		initLoading();
		initBinding();
	});
	
	function init() {
		adultCount = parseFloat(redirctParamMap.get("ac"));
		childCount = parseFloat(redirctParamMap.get("cc"));
		$(".baseinfo p")[0].children[0].innerHTML = adultCount;
		$(".baseinfo p")[0].children[1].innerHTML = childCount;
	}
	function initLoading() {
		var param = {
			transCode:"OPEN0004",
			requestTime:(new Date()).getTime(),
			sessionToken:"",
			body:JSON.stringify({orderNum:orderNum})
		};
		wx.ajax(wx.url.AJAX_LOAD, param, function(o) {
			if(o.msg){
				alert("订单不存在");
			}else {
				showSelectedCustomer(o.customers);
			}
		},function(){
			alert("出错");
		},true);
		function showSelectedCustomer(customers) {
			for(var i=0;i<customers.length;i++){
				if(customers[i].type+""==="0"){
					selectedChild++;
				}else if(customers[i].type+""==="1") {
					selectedAdult++;
				}
				var idType = cardTypeMap.get(customers[i].idType);
				$(".users").append("<li value='" + customers[i].id + "'><img src='images/test.png' class='icon'><div class='usersinfo'><p>" + customers[i].fullName + "&emsp;" + customers[i].firstName + " " + customers[i].lastName + "</p><p>" + idType + "&nbsp;" + customers[i].idNum + "</p></div><img src='images/icon_edit.gif' class='icon'></li>");
			}
			$(".baseinfo p")[1].children[0].innerHTML = selectedAdult;
			$(".baseinfo p")[1].children[1].innerHTML = selectedChild;
			$(".users li").click(function(){
				var customerId = this.value;
				var param = new Map();
				param.put('hotelId',redirctParamMap.get("hotelId"));
				param.put('ac',redirctParamMap.get("ac"));
				param.put('cc',redirctParamMap.get("cc"));
				param.put('sd',redirctParamMap.get("sd"));
				param.put('orderNum',redirctParamMap.get("orderNum"));
				param.put('customerId',customerId);
				wx.url.next("addone.html",param);
			});
		}
	}
	function initBinding() {
		$(".backbutton").click(function(){
			var param = new Map();
			param.put('hotelId',redirctParamMap.get("hotelId"));
			param.put('ac',redirctParamMap.get("ac"));
			param.put('cc',redirctParamMap.get("cc"));
			param.put('sd',redirctParamMap.get("sd"));
			param.put('orderNum',redirctParamMap.get("orderNum"));
			wx.url.pre("infofill.html",param);
		});
		$(".header span").click(function(){
			if(selectedAdult+selectedChild===adultCount+childCount) {
				var param = new Map();
				param.put('hotelId',redirctParamMap.get("hotelId"));
				param.put('ac',redirctParamMap.get("ac"));
				param.put('cc',redirctParamMap.get("cc"));
				param.put('sd',redirctParamMap.get("sd"));
				param.put('orderNum',redirctParamMap.get("orderNum"));
				wx.url.pre("infofill.html",param);
			}else{
				alert("您所选择的成人、儿童数量不符");
			}
		});
		$(".userinfo p").click(function(){
			var param = new Map();
			param.put('hotelId',redirctParamMap.get("hotelId"));
			param.put('ac',redirctParamMap.get("ac"));
			param.put('cc',redirctParamMap.get("cc"));
			param.put('sd',redirctParamMap.get("sd"));
			param.put('orderNum',redirctParamMap.get("orderNum"));
			wx.url.next("addone.html",param);
		});
	} 
})();