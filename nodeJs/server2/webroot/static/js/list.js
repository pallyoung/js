wx.list = function(){
	$(function() {
		initLoad();
	});
	function initLoad(){
		var requestParam = {
			transCode:"OPEN0001",
			requestTime:1111,
			sessionToken:"",
			body:JSON.stringify({pageNo:1,pageSize:20,order:"1"})
		};
		wx.ajax(wx.url.AJAX_LOAD, requestParam,draw,function() {},true);
	}
	function draw(data) {
		var dom = "";
		if(data.rows.length>0){
			var rows = data.rows;
			var img,des='';
			for(var i=0;i<rows.length;i++){
				if(rows[i].images.length>0){
					if(window.devMode) {
						img = "/getImage?id=" + rows[i].images[0].id;
					}else {
						img = rows[i].images[0].diskPath;
					}
					des = rows[i].images[0].descrip?rows[i].images[0].descrip:"暂无";
				}else {
					img = "/static/images/none.jpg";
					des = "暂无";
				}
				dom += "<li class='place' value='" + rows[i].id + "'><div><img src='" + img + "' alt='" + des + "'></div><div><h4>" + rows[i].name + "</h4><p><span>" + rows[i].jiage + "</span><span>" + rows[i].shoujia + "</span></p></div></li>";
			}
			$("#list").html(dom);
			$(".place").click(function() {
				location.href="details.html?id=" + this.value;
			});
		}
	}
	
	/*搜索框弹出层*/
	function seachMsg(wrapper,msg){
		this.wrapper=wrapper;
		this.msg=msg||{};
		this.wrapper.style.height=document.body.clientHeight-document.body.children[0].clientHeight-document.body.children[1].clientHeight+"px";
		this.background=document.createElement("div");
		this.background.style.cssText="width:100%;position:absolute;top:0;left:0;background:rgba(0,0,0,0.5);z-index:1;height:100%;";
		this.layer=document.createElement("div");
		this.layer.style.cssText="position:absolute;width:640px;left:0;top;z-index:99;";
		this.layer.innerHTML="<div style='display:inline-block;width:50%;font-size:2rem;background:white;height:28rem;overflow:auto;vertical-align:middle;'></div>"+
							"<div style='display:inline-block;width:50%;background:rgb(245,245,245);font-size:2rem;height:28rem;overflow:auto;vertical-align:middle;'></div>"
		this.wrapper.appendChild(this.layer);
		this.wrapper.appendChild(this.background);
		this.selected=function(){};
		(function(self){
			self.layer.addEventListener("click",function(e){
				self.select(e.target);
				e.stopPropagation();
			},false)
		})(this)
		
	}
	seachMsg.prototype={
		init:function(){
			this.countryMap("tg");
			this.islandMap("tg");
			this.hide();
		},
		countryMap:function(key){
			var keys=Object.keys(this.msg);
			var html="";
			for(var i=keys.length-1;i>=0;i--){
				html+=this.createRow(this.msg[keys[i]].countryname,"country",keys[i],key===keys[i]);
			}
			this.layer.children[0].innerHTML=html;
		},
		islandMap:function(key){
			var islands=this.msg[key].island;
			var country=this.msg[key].countryname;
			var html="";
			for(var i=islands.length-1;i>=0;i--){
				html+=this.createRow(islands[i],"island",country+"&&"+islands[i]);
			}
			this.layer.children[1].innerHTML=html;

		},
		createRow:function(value,type,data,isSelected){
			var s="<p style='line-height:4rem;height:4rem;font-size:2rem;text-indent:2em;";
			if(isSelected){
				s+="color:rgb(253,66,0);background:rgb(245,245,245);";	
			}
			s+="' data-type='"+type;
			s+="' data-source='"+data;
			s+="'>"+value+"</p>";
			return s;

		},
		show:function(){
			this.wrapper.style.display="block";
			//this.layer.style.display="block";
			//this.background.style.display="block";
			document.body.style.overflow="hidden";
		},
		hide:function(){
			this.wrapper.style.display="none";
			//this.layer.style.display="none";
			//this.background.style.display="none";
			document.body.style.overflow="auto";
		},
		select:function(target){
			var dataType=target.getAttribute("data-type");
			var data=target.getAttribute("data-source");
			if(dataType=="country"&&data!=null){
				this.countryMap(data);
				this.islandMap(data);
			}else if(dataType=="island"&&data!=null){
				this.hide();
				data=data.split("\&\&");
				this.selected(data[0],data[1]);
			}
		},
	}
	window.addEventListener("load",function(){
		var msgs={
			"tg":{
				countryname:"泰国",
				island:["普吉岛","甲米岛","苏梅岛","PP岛","大象岛","龟岛","沙美岛","道岛","希美兰岛","帕岸岛"]
			},
			"rb":{
				countryname:"日本",
				island:["北海道","冲绳"]
			},
			"mlxy":{
				countryname:"马来西亚",
				island:["兰卡威","军舰岛","苏梅岛","美人鱼岛"],
			},
			"yn":{
				countryname:"印尼",
				island:["巴厘岛","龙目岛"]
			},
			"fyb":{
				countryname:"菲律宾",
				island:["长滩岛","薄荷岛"]
			},
			"wl":{
				countryname:"文莱",
				island:["沙巴岛"]
			},
			"hg":{
				countryname:"韩国",
				island:["济州岛"]
			},
			"medf":{
				countryname:"马尔代夫",
				island:["香格里拉岛","玛娜法鲁岛","班度士岛","白金岛","梦幻岛","安娜塔拉岛","拉古娜岛","四季岛","绚丽岛","希拉蒙岛","希尔顿岛","港丽","满月岛","泰姬魅力岛","瓦宾法鲁岛","美露丽芙岛","卡尼岛","W岛（宁静岛）","马累岛","椰子岛","天堂岛","拉古娜岛","康杜玛岛","太阳岛","蔚蓝沙岛等"]
			},
			"fj":{
				countryname:"斐济",
				island:["斐济岛"]
			},
			"pr":{
				countryname:"帕劳",
				island:["帕劳群岛"]
			},
			"mg":{
				countryname:"美国",
				island:["夏威夷","关岛","佛罗里达"]
			},
			"fghwzmd":{
				countryname:"法国海外殖民地",
				island:["大溪地"]
			},
			"jlbh":{
				countryname:"加勒比海",
				island:["巴哈马","圣托马斯岛","牙买加","圣"]
			},
			"xwy":{
				countryname:"夏威夷",
				island:["夏威夷大岛","毛伊岛","欧胡岛","考艾岛"]
			},
			"xl":{
				countryname:"希腊",
				island:["圣托里尼岛","克里特岛","优卑亚岛","莱斯博斯岛","罗德岛"]
			},
			"fg":{
				countryname:"法国",
				island:["普罗旺斯","科西嘉岛","巴黎","法国阿尔卑斯山"]
			},
			"xby":{
				countryname:"西班牙",
				island:["太阳海岸","巴塞罗那","安达卢西亚","布拉瓦海岸","里斯本","阿尔加维"]
			},
			"ydl":{
				countryname:"意大利",
				island:["西西里岛","撒丁岛","科莫湖"]
			},

		}
		seachmsg=new seachMsg(document.getElementsByClassName("seachcontent")[0],msgs);
		seachmsg.init();
		var seach_button=document.querySelector(".seach p");
		var contry_result=document.querySelectorAll(".seach p span input")[0];
		var result=document.querySelectorAll(".seach p span input")[1];
		seach_button.addEventListener("click",function(e){
			seachmsg.show();
			e.stopPropagation();
		},false);
		window.addEventListener("click",function(e){
			seachmsg.hide();			
		},false);
		seachmsg.selected=function(country,island){
			result.value=island;
			contry_result.value=country;
		}
	},false);
};
