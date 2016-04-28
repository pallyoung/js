"use strict";
define(["base","jquery", "time","processOrder"],function(ihandy,$ ,time,processOrder){
	var exports={init:init},ordermap,tasktype,page;
	/**
	 * 初始化地图 和地图悬浮层内容
	 */
	function initmap(){
		page = document.querySelector("#map");
		var service_details0 = $("#map .service_details").eq(0);
		var service_details1 = $("#map .service_details").eq(1);
		var service_details2 = $("#map .service_details").eq(2);

		var toolbar0 = $("#map .toolbar").eq(0);
		var toolbar1 = $("#map .toolbar").eq(1);
		var toolbar2 = $("#map .toolbar").eq(2);

		var heading = $("#map .heading");

		if("graborder" == tasktype){
			heading.text("我要抢单");
			service_details0.attr('class','service_details');
			service_details1.attr('class','service_details dp_none');
			service_details2.attr('class','service_details dp_none');
			//让时间开始倒计时
			var counter = page.querySelector('.toolbar').querySelectorAll('.time');
			var initial = 10000;
			time.countDown(initial, 1, counter, 1);
			toolbar0.attr('class','toolbar');
			toolbar1.attr('class','toolbar dp_none');
			toolbar2.attr('class','toolbar dp_none');

			//初始化页面值
			service_details0.find("span").eq(0).text(or.activeOrder.helpAddress);
			service_details0.find("span").eq(1).text(or.activeOrder.carLocation);

		}else if("pieorder" == tasktype){
			heading.text("我要接单");
			service_details0.attr('class','service_details dp_none');
			service_details1.attr('class','service_details');
			service_details2.attr('class','service_details dp_none');
			//让时间开始倒计时
			var counter = page.querySelector('.toolbar').querySelectorAll('.time');
			var initial = 10000;
			time.countDown(initial, 1, counter, 1);
			toolbar0.attr('class','toolbar dp_none');
			toolbar1.attr('class','toolbar');
			toolbar2.attr('class','toolbar dp_none');

			//初始化页面值
			service_details1.find("span").eq(0).text(forecastMoney);
			var remarktemp = null;
			if(!ihandy.IsNull(or.activeOrder.remark)){
				remarktemp = or.activeOrder.remark.split("&&");
			}
			service_details1.find("span").eq(1).text(remarktemp[0]);
			service_details1.find("span").eq(2).text(remarktemp[1]);
			service_details1.find("span").eq(3).text(or.activeOrder.helpAddress);
			service_details1.find("span").eq(4).text(or.activeOrder.carLocation);
		}else{
			heading.text("在途中");
			service_details0.attr('class','service_details dp_none');
			service_details1.attr('class','service_details dp_none');
			service_details2.attr('class','service_details');
			toolbar0.attr('class','toolbar dp_none');
			toolbar1.attr('class','toolbar dp_none');
			toolbar2.attr('class','toolbar');

			service_details2.find("span").eq(0).text(or.activeOrder.carName);
			service_details2.find("span").eq(1).text(or.activeOrder.carPhone);
			service_details2.find("span").eq(2).text(or.activeOrder.helpAddress);
			service_details2.find("span").eq(3).text(or.activeOrder.carType);
			service_details2.find("span").eq(4).text(or.activeOrder.customerFrom);

			//联系车主
			page.querySelector(".phone").addEventListener(ihandy.evts.touchstart,function(){
				ora.callPhone(or.activeOrder.carPhone);
			});
		}

		$("#map .service_content span").text("紧急拖车");
		console.log("aaaaaaaaa");
		//ihandy.loadScript("http://api.map.baidu.com/api?v=2.0&ak=hHkcrBHgQhIdavQp4KV5cGyP",function(){
		//	ihandy.loadScript("http://developer.baidu.com/map/jsdemo/demo/convertor.js",function(){
				console.log("dddddddddd");
				try {
					//测试获取两点之前的距离
					ordermap = new BMap.Map("ordermap");
					ordermap.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
					var positionobj = {};
					//if(!!ora && !!ora.getCurrentPosition){
					//	positionobj =  JSON.parse(ora.getCurrentPosition());
					//	initbmap(positionobj);
					//}else{
/*					ora.getCurrentPosition(ordermap,function(position,lng,lat) {
						positionobj.lng = lng;
						positionobj.lat = lat;
						initbmap(positionobj);
					});*/
          
          or.bdgetCurrentPosition(ordermap,function(position,lng,lat) {
						positionobj.lng = lng;
						positionobj.lat = lat;
						initbmap(positionobj);
					});
					//}

				} catch (e) {
					console.log(e.message);
				}
		//	});
		//});

		function initbmap(position){
			var start = new BMap.Point(position.lng,position.lat);
			var end = "张江路紫薇路";
			or.getDistance(ordermap,"11111",start,end,function(data){
				//加距离标签
				var opts = {
					position : start,    // 指定文本标注所在的地理位置
					offset   : new BMap.Size(30, -30)    //设置文本偏移量
				};
				var label = new BMap.Label("距离"+data["11111"], opts);  // 创建文本标注对象
				label.setStyle({
					color : "white",
					fontSize : "20px",
					height : "2em",
					lineHeight : "2em",
					fontFamily:"微软雅黑",
					backgroundColor:"rgba(0,0,0,0.8)",
					borderRadius:"5px",
					border:"none",
					padding:"0 0.5em"
				});
				ordermap.addOverlay(label);
			});
		}
	}
	
	var MyMap=function(){

	};


	MyMap.prototype= {
		/**
		 * 车已到达接口
		 */
		carArrivals : function(){
			var _config = {
				success : function(result){
					result = ihandy.parseJSON(result);
					if(ihandy.IsNull(result) ||
						ihandy.IsNull(result.responseBody) ||
						ihandy.IsNull(result.responseBody.errMsg)){
						ihandy.alert({msg:"系统异常，接口调用失败！",heading:"提示"});
					}else{
						or.redirect("authentication");//如果车已到达 直接进入到任务列表页面
					}
				}
			};
			var param = {
				userName : or.currentUser.userName,//用户名
				orderNo : or.activeOrder.orderNo//订单号
			};
			var _params = ihandy.ajaxRequestParam(or.transCode.I04002, param, _config);
			ihandy.ajax(_params);
		}
	};

	ihandy.ready(function(){
		page = document.querySelector("#map");
		exports.myMap = new MyMap();
		//给页面按钮绑定事件
		page.querySelector("#carArrivals").addEventListener(ihandy.evts.touchstart,function(){
			exports.myMap.carArrivals();
		});
		page.querySelector("#grabOrderAll").addEventListener(ihandy.evts.touchstart,function(){
			or.redirect("mytask");//跳转到 任务列表页面
		});
		page.querySelector("#grabOrder").addEventListener(ihandy.evts.touchstart,function(){
			processOrder(or.activeOrder.orderNo, "receive", function(){
				console.log("receive order~~~");
			});
		});
		page.querySelector("#receiveOrderAll").addEventListener(ihandy.evts.touchstart,function(){
			or.redirect("mytask");//跳转到 任务列表页面
		});
		page.querySelector("#receiveOrder").addEventListener(ihandy.evts.touchstart,function(){
			processOrder(or.activeOrder.orderNo, "receive", function(){
				console.log("receive order~~~");
			});
		});
		page.querySelector("#refuseOrder").addEventListener(ihandy.evts.touchstart,function(){
			processOrder(or.activeOrder.orderNo, "refuse", function(){
				console.log("refuse order~~~");
			});
		});
	});

	function init(){
		/**
		 * 初始化地图 和地图悬浮层内容
		 */
		tasktype = '';//or.maptasktype;
		initmap();
	}


	return exports;
});