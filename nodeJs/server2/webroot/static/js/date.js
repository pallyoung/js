(function(){
	var redirctParamMap=null;
	$(document).ready(function(){
		$("#nextPage").click(nextPage);
		
		redirctParamMap = window.redirctParam;
		if(redirctParamMap.get("ac")) {
			document.getElementById("adultCount").value = redirctParamMap.get("ac");
		}
		if(redirctParamMap.get("cc")) {
			document.getElementById("childCount").value = redirctParamMap.get("cc");
		}
		
		$(".op").bind('click',function(){
			if(this.value==='-'){
				$(this).next()[0].value = $(this).next()[0].value===""?0:(parseInt($(this).next()[0].value)-1<0?0:parseInt($(this).next()[0].value)-1);
			}else if(this.value==="+") {
				$(this).prev()[0].value = $(this).prev()[0].value===""?0:parseInt($(this).prev()[0].value)+1;
			}
			if(parseInt(document.getElementById('adultCount').value) + parseInt(document.getElementById('childCount').value)>0){
				$('.warming').text("");
			}
		});

		$(".backbutton").click(function(){
			var param = new Map();
			param.put('id',redirctParamMap.get("hotelId"));
			wx.url.pre("details.html",param);
		});
	});

	function nextPage(e) {
		var selectedDate = new Date();
		selectedDate.setFullYear(window.selectedYear, window.selectedMonth, window.selectedDay);
		var ac = document.getElementById("adultCount").value?parseInt(document.getElementById("adultCount").value):0;
		var cc = document.getElementById("childCount").value?parseInt(document.getElementById("childCount").value):0;
		if(ac+cc === 0){
			$('.warming').text("请选择出行人员");
			return;
		}
		var param = new Map();
		param.put("ac", ac);
		param.put("cc", cc);
		param.put("hotelId", redirctParamMap.get("hotelId"));
		param.put("sd", selectedDate.format("yyyy-MM-dd"));
		if(redirctParamMap.get("orderNum")){
			param.put('orderNum',redirctParamMap.get("orderNum"));
		}
		wx.url.next("infofill.html",param);
	}
	
	/*日期控件*/
	 function Calendar (dom) {
	 	var today=new Date();
	 	this.wrapper=dom;        
       this.aMonths=['1','2','3','4','5','6','7','8','9','10','11','12'];//月份
       this.aMonthCounter=[31,28,31,30,31,30,31,31,30,31,30,31];//每月天数
       this.holiday={
       	"1":{"1":"元旦"},
       	"4":{"5":"清明"},
       	"5":{"1":"劳动节"},
       	"6":{"1":"儿童节"},
       	"8":{"1":"建军节"},
       	"9":{"10":"教师节"},
       	"10":{"1":"国庆节"}
       };//法定假日
       this.setDate(today);
      /**
      *存储信息
      *格式  {
				"2015":{
					"2":{
						"1":"3599元起"
					}
				}
      }
      */
       this.msg={};     
       
   }
   Calendar.prototype = {
       //确定平闰年
       ifLeap:function(year){
           if(year%4===0&&year%100!==0||year%400===0){
           	return 1;
       	}
           return 0;
       },
       //
       setDate:function(date){
       	this.year=date.getFullYear();
      	 	this.month=date.getMonth();
      		this.date=date.getDate();
       	this.day=date.getDay();
       },
       setYear:function(year){
           this.year=year;
           var aMonthCounters=[[31,28,31,30,31,30,31,31,30,31,30,31],[31,29,31,30,31,30,31,31,30,31,30,31]]//每月天数
           this.aMonthCounter=aMonthCounters[this.ifLeap(year)];

       },
      showMonth:function(year, month, date){
    	  if(arguments.length===3){
    		  this.year = year;
    		  this.month = month;
    		  this.date = date;
    	  }
      	var sTempString="";
      	var today=new Date();
      	var iWeek=new Date(this.year,this.month).getDay();
      	var msg="";
      	var holiday="";
      	for(var i=0;i<iWeek;i++){
           sTempString+='<span></span>';
       }
       for(var i=0;i<this.aMonthCounter[this.month];i++){
       	sTempString+='<span>';
       	try{
       		holiday=this.holiday[(this.mouth+1).toString(10)][(i+1).toString(10)];
       		if(holiday!==undefined){
       			sTempString+=holiday;
       		}
       	}catch(e){
       			(today.getFullYear()==this.year&&
       			(today.getMonth()==this.month)&&
       			((today.getDate()==(i+1)&&(sTempString+="今天"))|| (today.getDate()==(i)&&(sTempString+="明天")) ))
       			||(sTempString+=(i+1));
       	}
           try{
           	msg=this.msg[this.year.toString(10)][this.month.toString(10)][(i+1).toString(10)];
           	sTempString+='<sub class="datemsg">'+msg+'</sub>';
           }catch(e){

           }
           sTempString+='</span>';            
       }
       iWeek=7-iWeek==7?0:7-iWeek;
       for(var i=0;i<iWeek;i++){
           sTempString+='<span></span>';
       }
       this.wrapper.innerHTML=sTempString;
       $("#calendar>span").click(function(){
    	   $("#calendar>span").each(function(){
    		   $(this).css("background-color","white");
    	   });
    	   $(this).css("background-color","rgb(255,66,0)");
      		var date = this.innerHTML;
      		if(date==""){
      			retunr ;
      		}
      		var dateStrArr = ['今天','明天',"元旦","清明","劳动节","儿童节","建军节","建军节","教师节","国庆节"];
      		var dateArr = [(new Date()).getDay()+1+"",(new Date()).getDay()+2+"","1","5","1","1","1","10","1"];
      		if($.inArray(date, dateStrArr) === -1){
      			window.selectedDay = date;
      		}else {
      			window.selectedDay = dateArr[$.inArray(date, dateStrArr)]; 
      		}
      	});
      },
      nextMonth:function(){
      	this.month=this.month+1>11?(this.year++&&0):this.month+1;
      	this.showMonth();
      },
      preMonth:function(){
      	this.month=this.month-1<0?(this.year--&&11):this.month-1;
      	this.showMonth();
      }
   };
   window.onload=function(){
   	var wrapper=document.getElementsByClassName("datepicker")[0].getElementsByTagName("p")[1];
   	var nextMonth=document.getElementsByClassName("datepicker")[0].getElementsByTagName("header")[0].children[2];
   	var preMonth=document.getElementsByClassName("datepicker")[0].getElementsByTagName("header")[0].children[0];
   	var calendarTitle=document.getElementsByClassName("datepicker")[0].getElementsByTagName("header")[0].children[1];
   	calendar=new Calendar(wrapper);
   	calendar.showMonth();
   	calendarTitle.innerHTML=calendar.year+"年"+(calendar.month+1)+"月";
	window.selectedYear = calendar.year;
	window.selectedMonth = calendar.month+1;
	window.selectedDay = (new Date()).getDay();
   	nextMonth.addEventListener("click",function(){
   		calendar.nextMonth();
   		calendarTitle.innerHTML=calendar.year+"年"+(calendar.month+1)+"月";
   		window.selectedYear = calendar.year;
   		window.selectedMonth = calendar.month+1;
   	},false);
   	preMonth.addEventListener("click",function(){
   		calendar.preMonth();
   		calendarTitle.innerHTML=calendar.year+"年"+(calendar.month+1)+"月";
   		window.selectedYear = calendar.year;
   		window.selectedMonth = calendar.month+1;
   	},false);
   };
})();