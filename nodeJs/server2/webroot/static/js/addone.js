(function(){
	var redirctParamMap=null;
	var customer = {id:""};
	var isEdit = false;
	$(function(){
		redirctParamMap = window.redirctParam;
		customer.orderNum = redirctParamMap.get("orderNum");
		initBinding();
		if(redirctParamMap.get("customerId")!==undefined && redirctParamMap.get("customerId")!=="") {
			customer.id = redirctParamMap.get("customerId");
			isEdit = true;
			$(".header h1")[0].innerHTML = "编辑旅客";
		}
		initEdit();
	});
	
	function initEdit() {
		if(isEdit){
			var param = {
				transCode:"OPEN0006",
				requestTime:(new Date()).getTime(),
				sessionToken:"",
				body:JSON.stringify({customerId:redirctParamMap.get("customerId")})
			};
			wx.ajax(wx.url.AJAX_LOAD,param,function(data){
				if(data) {
					document.getElementById("fullName").value = data.fullName;
					document.getElementById("firstName").value = data.firstName;
					document.getElementById("lastName").value = data.lastName;
					document.getElementById("idType").innerHTML = cardTypeMap.get(data.idType);
					document.getElementById("idNum").value = data.idNum;
					document.getElementById("nation").innerHTML = data.nation;
					document.getElementById("sex").innerHTML = (data.sex+"")==="0"?"男":"女";
					document.getElementById("birthday").innerHTML = new Date(data.birthday).format("yyyy-MM-dd");
					document.getElementById("phone").value = data.phone;
				}else {
					alert("客户信息不存在或已被删除");
				}
			},function(){
			},true);
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
			wx.url.pre("choice.html",param);
		});
		$(".complete").click(function(){
			complete();
		}); 
	}
	
	function complete() {
		if(validate()){
			var param = {
				transCode:"OPEN0005",
				requestTime:(new Date()).getTime(),
				sessionToken:"",
				body:JSON.stringify(customer)
			};
			wx.ajax(wx.url.AJAX_LOAD,param,function(data){
				if(data.msg==="Success") {
					var param = new Map();
					param.put("orderNum",redirctParamMap.get("orderNum"));
					param.put("ac",redirctParamMap.get("ac"));
					param.put("cc",redirctParamMap.get("cc"));
					param.put("sd",redirctParamMap.get("sd"));
					param.put("hotelId",redirctParamMap.get("hotelId"));
					wx.url.next("choice.html",param);
				}else if(data.msg==="OrderNotExisted") {
					alert("订单不存在或已失效");
				}else if(data.msg==="OrderAddedThisCustomer") {
					alert("您已添加过此用户信息");
				}
			},function(){
			},true);
		}
	}
	
	function validate() {
		var re = /^[\u4e00-\u9fa5]{2,16}$/;//中文2-16个汉字
		var value = document.getElementById("fullName").value;
		if(!re.test(value)) {
			alert("中文姓名格式不正确");
			document.getElementById("fullName").focus();
			return false;
		}
		customer.fullName = value;
		re=/^[a-zA-Z]{2,24}$/; //只输入字母的正则
		value = document.getElementById("lastName").value;
		if(!re.test(value)){
			alert("姓（英文）格式不正确");
			document.getElementById("lastName").focus();
			return false;
		}
		customer.lastName = value;
		value = document.getElementById("firstName").value;
		if(!re.test(value)){
			alert("名（英文）格式不正确");
			document.getElementById("firstName").focus();
			return false;
		}
		customer.firstName = value;
		customer.idType = cardTypeMap.get(document.getElementById("idType").innerHTML);
		value = document.getElementById("idNum").value;
		if(customer.idType==="1") {
			re = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if(!re.test(value)) {
				alert("身份证号码格式不正确");
				return false;
			}
		}else if(customer.idType==="2") {
			re = /(P\d{7})|(G\d{8})/;
			if(!re.test(value)) {
				alert("护照格式不正确");
				return false;
			}
		}else if(customer.idType==="3") {
			//军官证暂不知道怎么校验
			if(value==="") {
				alert("军官证格式不正确");
				return false;
			}
		}else {
			return false;
		}
		customer.idNum = value;
		value = document.getElementById("nation").innerHTML;
		if(value==="") {
			alert("请选择您的国籍");
			return false;
		}
		customer.nation = value;
		value = document.getElementById("sex").innerHTML;
		if(value==="") {
			alert("请选择您的性别");
			return false;
		}
		customer.sex = value=="男"?"0":"1";
		value = document.getElementById("birthday").innerHTML;
		if(value==="") {
			alert("请选择您的出生日期");
			return false;
		}
		customer.birthday = new Date(value).format("yyyy-MM-dd");;
		value = document.getElementById("phone").value;
		re = /^1\d{10}$/;
		if(!re.test(value)) {
			alert("手机号码格式不正确");
			return false;
		}
		customer.phone = value;
		return true;
	}

	window.addEventListener("load", function() {
		var arrow = document.getElementsByClassName("arrow")[0];
		var cardtype = document.getElementsByClassName("cardtype")[0];
		var type = cardtype.previousElementSibling;
		type.addEventListener("click", function(e) {
			cardtype.style.display = "block";
			e.stopPropagation();
		}, false);
		arrow.addEventListener("click", function(e) {
			cardtype.style.display = "block";
			e.stopPropagation();
		}, false);
		cardtype.addEventListener("click", function(e) {
			var target = e.target;
			type.innerHTML = target.innerHTML;
			cardtype.style.display = "none";
		}, false);
		document.body.addEventListener("click", function(e) {
			cardtype.style.display = "none";
		}, false);
		var arrow1 = document.getElementsByClassName("arrow")[1];
		var cardtype1 = document.getElementsByClassName("cardtype")[1];
		var type1 = cardtype1.previousElementSibling;
		type1.addEventListener("click", function(e) {
			cardtype1.style.display = "block";
			e.stopPropagation();
		}, false);
		arrow1.addEventListener("click", function(e) {
			cardtype1.style.display = "block";
			e.stopPropagation();
		}, false);
		cardtype1.addEventListener("click", function(e) {
			var target = e.target;
			type1.innerHTML = target.innerHTML;
			cardtype1.style.display = "none";
		}, false);
		document.body.addEventListener("click", function(e) {
			cardtype1.style.display = "none";
		}, false);
		var arrow2 = document.getElementsByClassName("arrow")[2];
		var cardtype2 = document.getElementsByClassName("cardtype")[2];
		var type2 = cardtype2.previousElementSibling;
		type2.addEventListener("click", function(e) {
			cardtype2.style.display = "block";
			e.stopPropagation();
		}, false);
		arrow2.addEventListener("click", function(e) {
			cardtype2.style.display = "block";
			e.stopPropagation();
		}, false);
		cardtype2.addEventListener("click", function(e) {
			var target = e.target;
			type2.innerHTML = target.innerHTML;
			cardtype2.style.display = "none";
		}, false);
		document.body.addEventListener("click", function(e) {
			cardtype2.style.display = "none";
		}, false);


		/*日期控件*/
		function Calendar(dom) {
			var today = new Date();
			this.wrapper = dom;
			this.aMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']; //月份
			this.aMonthCounter = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //每月天数
			this.holiday = {"1":{"1":"元旦"},"4":{"5":"清明"},"5":{"1":"劳动节"},"6":{"1":"儿童节"},"8":{"1":"建军节"},"9":{"10":"教师节"},"10":{"1":"国庆节"}}; //法定假日
			this.setDate(today);
			this.msg = {};
			var self=this;
			this.wrapper.addEventListener("click",function(e){
				e.stopPropagation();
				document.getElementsByClassName("datepicker")[0].previousElementSibling.innerHTML=self.year+"-"+(self.month+1)+"-"+e.target.innerHTML;
				document.getElementsByClassName("datepicker")[0].style.display="none";
			},false);

		}
		Calendar.prototype = {
			//确定平闰年
			ifLeap: function(year) {
				if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
					return 1;
				}
				return 0;
			},
			//
			setDate: function(date) {
				this.year = date.getFullYear();
				this.month = date.getMonth();
				this.date = date.getDate();
				this.day = date.getDay();
			},
			setYear: function(year) {
				this.year = year;
				var aMonthCounters = [[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]]; //每月天数
				this.aMonthCounter = aMonthCounters[this.ifLeap(year)];
			},
			showMonth: function() {
				var sTempString = "";
				var iWeek = new Date(this.year, this.month).getDay();
				var msg = "";
				var holiday = "";
				for (var i = 0; i < iWeek; i++) {
					sTempString += '<span></span>';
				}
				for (var i = 0; i < this.aMonthCounter[this.month]; i++) {
					sTempString += '<span>';
					try {
						holiday = this.holiday[(this.mouth + 1).toString(10)][(i + 1).toString(10)];
						if (holiday !== undefined) {
							sTempString += holiday;
						}
					} catch (e) {
						(sTempString += (i + 1));
					}
					try {
						msg = this.msg[this.year.toString(10)][this.month.toString(10)][(i + 1).toString(10)];
						sTempString += '<sub class="datemsg">' + msg + '</sub>';
					} catch (e) {

					}
					sTempString += '</span>';
				}
				iWeek = 7 - iWeek == 7 ? 0 : 7 - iWeek;
				for (var i = 0; i < iWeek; i++) {
					sTempString += '<span></span>';
				}
				this.wrapper.innerHTML = sTempString;
			},
			nextMonth: function() {
				this.month = this.month + 1 > 11 ? (this.year++ && 0) : this.month + 1;
				this.showMonth();
			},
			preMonth: function() {
				this.month = this.month - 1 < 0 ? (this.year-- && 11) : this.month - 1;
				this.showMonth();
			}
		};
		var wrapper=document.getElementsByClassName("datepicker")[0].getElementsByTagName("p")[1];
	   	var nextMonth=document.getElementsByClassName("datepicker")[0].getElementsByTagName("header")[0].children[2];
	   	var preMonth=document.getElementsByClassName("datepicker")[0].getElementsByTagName("header")[0].children[0];
	   	var calendarTitle=document.getElementsByClassName("datepicker")[0].getElementsByTagName("header")[0].children[1];
	   	calendar=new Calendar(wrapper);
	   	calendar.showMonth();
	   	calendarTitle.innerHTML=calendar.year+"年"+(calendar.month+1)+"月";
	   	nextMonth.addEventListener("click",function(e){
	   		e.stopPropagation();
	   		calendar.nextMonth();
	   		calendarTitle.innerHTML=calendar.year+"年"+(calendar.month+1)+"月";
	   		window.selectedYear = calendar.year;
	   		window.selectedMonth = calendar.month+1;
	   	},false);
	   	preMonth.addEventListener("click",function(e){
	   		e.stopPropagation();
	   		calendar.preMonth();
	   		calendarTitle.innerHTML=calendar.year+"年"+(calendar.month+1)+"月";
	   		window.selectedYear = calendar.year;
	   		window.selectedMonth = calendar.month+1;
	   	},false);
	   	document.body.addEventListener("click",function(){
	   		document.getElementsByClassName("datepicker")[0].style.display="none";
	   	},false);
		document.getElementsByClassName("datepicker")[0].previousElementSibling.addEventListener("click",function(e){
			e.stopPropagation();
			document.getElementsByClassName("datepicker")[0].style.display="block";
		},false);
		document.getElementsByClassName("datepicker")[0].nextElementSibling.addEventListener("click",function(e){
			e.stopPropagation();
			document.getElementsByClassName("datepicker")[0].style.display="block";
		},false);

	}, false);
})();
