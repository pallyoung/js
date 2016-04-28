define(["base","jquery"],function(ihandy,$){
	var exports={init:init},page;
	
	var CustomerReviews=function(){
		this.attitude = 5;
		this.rescueSpeed = 5;
		this.serviceQuality = 5;
		this.appraisalLevel = "good";
	};


	CustomerReviews.prototype= {
		init : function(){
			$("#customerreviews .orderinfo p:nth-of-type(1) span").eq(3).text(or.activeOrder.orderFrom);
			$("#customerreviews .orderinfo p:nth-of-type(2) span").eq(3).text(or.activeOrder.helpAddress);
			$("#customerreviews .orderinfo p:nth-of-type(3) span").eq(3).text(or.activeOrder.carLocation);
			$("#customerreviews .orderinfo p:nth-of-type(4) span").eq(3).text(or.activeOrder.serviceContent);
			page = document.querySelector("#customerreviews");
		},
		reviews : function (type,num) {
			for(var j = 0 ; j < 5 ; j++ ){
				if("attitude" == type){
					this.attitude = num;
					if(j < num){
						$("#customerreviews #attitude"+(j+1)).attr("src","../img/customer_reviews/star.png");
					}else{
						$("#customerreviews #attitude"+(j+1)).attr("src","../img/customer_reviews/star_off.png");
					}
				}else if("rescueSpeed" == type){
					this.rescueSpeed = num;
					if(j < num){
						$("#customerreviews #rescueSpeed"+(j+1)).attr("src","../img/customer_reviews/star.png");
					}else{
						$("#customerreviews #rescueSpeed"+(j+1)).attr("src","../img/customer_reviews/star_off.png");
					}
				}else if("serviceQuality" == type){
					this.serviceQuality = num;
					if(j < num){
						$("#customerreviews #serviceQuality"+(j+1)).attr("src","../img/customer_reviews/star.png");
					}else{
						$("#customerreviews #serviceQuality"+(j+1)).attr("src","../img/customer_reviews/star_off.png");
					}
				}
				$("#customerreviews #serviceIntegration").text(this.attitude+this.rescueSpeed+this.serviceQuality);
			}
		},
		submitCustomerReviews : function(){
			var _config = {
				success : function(result){
					result = ihandy.parseJSON(result);
					if(ihandy.IsNull(result) ||
					   ihandy.IsNull(result.responseBody) ||
					   ihandy.IsNull(result.responseBody.errMsg)){
						    ihandy.alert({msg:"系统异常，激活失败！",heading:"提示"});
					}else{
						if(!ihandy.IsNull(result.responseBody.errMsg)){
							ihandy.alert({msg:result.responseBody.errMsg,heading:"提示"});
						}
					}
				}
			};
			var param = {
				userName : or.currentUser.userName,//用户名
				orderNo : or.activeOrder.orderNo,//用户图片内容
				appraisalLevel : this.appraisalLevel,
				remark :$("#customerreviews #remark").val(),
				attitude : this.attitude,
				rescueSpeed : this.rescueSpeed,
				serviceQuality : this.serviceQuality
			};
			var _params = ihandy.ajaxRequestParam(or.transCode.I01002, param, _config);
			ihandy.ajax(_params);
		}
	};

	ihandy.ready(function(){
		exports.customerReviews = new CustomerReviews();
		//加载页面信息
		exports.customerReviews.init();
		var good = $("#customerreviews #good");
		var general = $("#customerreviews #general");
		var difference = $("#customerreviews #difference");
		page.querySelector("#good").addEventListener(ihandy.evts.touchstart,function(){
			good.attr("class","border border_color_or br_5");
			general.attr("class","border border_color_220 br_5");
			difference.attr("class","border border_color_220 br_5");
			exports.customerReviews.appraisalLevel = "good";
		});
		page.querySelector("#general").addEventListener(ihandy.evts.touchstart,function(){
			good.attr("class","border border_color_220 br_5");
			general.attr("class","border border_color_or br_5");
			difference.attr("class","border border_color_220 br_5");
			exports.customerReviews.appraisalLevel = "general";
		});
		page.querySelector("#difference").addEventListener(ihandy.evts.touchstart,function(){
			good.attr("class","border border_color_220 br_5");
			general.attr("class","border border_color_220 br_5");
			difference.attr("class","border border_color_or br_5");
			exports.customerReviews.appraisalLevel = "difference";
		});
		page.querySelector("#attitude1").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("attitude",1);
		});
		page.querySelector("#attitude2").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("attitude",2);
		});
		page.querySelector("#attitude3").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("attitude",3);
		});
		page.querySelector("#attitude4").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("attitude",4);
		});
		page.querySelector("#attitude5").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("attitude",5);
		});
		page.querySelector("#rescueSpeed1").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("rescueSpeed",1);
		});
		page.querySelector("#rescueSpeed2").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("rescueSpeed",2);
		});
		page.querySelector("#rescueSpeed3").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("rescueSpeed",3);
		});
		page.querySelector("#rescueSpeed4").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("rescueSpeed",4);
		});
		page.querySelector("#rescueSpeed5").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("rescueSpeed",5);
		});
		page.querySelector("#serviceQuality1").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("serviceQuality",1);
		});
		page.querySelector("#serviceQuality2").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("serviceQuality",2);
		});
		page.querySelector("#serviceQuality3").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("serviceQuality",3);
		});
		page.querySelector("#serviceQuality4").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("serviceQuality",4);
		});
		page.querySelector("#serviceQuality5").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.reviews("serviceQuality",5);
		});
		page.querySelector("#submitCustomerReviews").addEventListener(ihandy.evts.touchstart,function(){
			exports.customerReviews.submitCustomerReviews();
		});

	});

	function init(){
	}

	return exports;
});