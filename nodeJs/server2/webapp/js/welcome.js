define(["base"],function($){
	var height,width;
	var hasTouch=$.hasTouch();
	var evts=$.evts;
	var PicPlayer=function(pics){
		this.pics=pics||[];
		this.wrapper=document.createElement("div");
		this.wrapper.className="pic_player";
		this.wrapper.innerHTML+="<ul class='pic_list'></ul><p class='icon'></p><p class='enter'><a href='javascript:void' data-target='login'>点击进入</a></p>";
		this.piclist=this.wrapper.children[0];
		this.icons=this.wrapper.children[1];
		this.enter=this.wrapper.children[2];
		this.active=0;
		this.init();
		document.querySelector("#welcome").appendChild(this.wrapper);
	};
	PicPlayer.startpoint=0;
	PicPlayer.endpoint=0;
	PicPlayer.ticks=0;
	PicPlayer.player=null;
	PicPlayer.getPoint=function(e){
		var touch=hasTouch?(e.targetTouches[0]):e;
		return touch.clientX;
	}
	PicPlayer.setTranstionTime=function(dom,time){
		dom.style.transtionDuration=time;
	}

	PicPlayer.calcTranstionTime=function(dom,time){
		dom.style.transtionDuration=time;
	}	
	PicPlayer.startMove=function(e){
		var target=e.target;
		var wrapper=e.currentTarget;
		PicPlayer.startpoint=PicPlayer.getPoint(e);
		PicPlayer.ticks=e.timeStamp;
		wrapper.addEventListener(evts["touchmove"],PicPlayer.move,false);
	}
	PicPlayer.move=function(e){
		var wrapper=e.currentTarget;
		if(e.timeStamp-PicPlayer.ticks>100){
			PicPlayer.endpoint=PicPlayer.getPoint(e);
			if(PicPlayer.endpoint-PicPlayer.startpoint>0){
				PicPlayer.player.pre();
			}else if(PicPlayer.endpoint-PicPlayer.startpoint<0){
				PicPlayer.player.next();
			}
			PicPlayer.startpoint=0;
			PicPlayer.endpoint=0;
			PicPlayer.ticks=0;
			PicPlayer.player=null;
			wrapper.removeEventListener(evts["touchmove"],PicPlayer.move,false);
		}		
	}
	PicPlayer.prototype= {
		init:function(){
			this.createIcons();
			this.createPicList();
			this.showPic(0);
			this.setIconActive(0);
			var self=this;
			this.piclist.addEventListener(evts["touchstart"],function(e){
				PicPlayer.startMove(e);
				PicPlayer.player=self;
			},false);
		},
		createIcons:function(){
			var l=this.pics.length;
			var p=this.icons;
			for(var i=0;i<l;i++){
				p.innerHTML+="<span>·</span>"
			}
		},
		createPicList:function(){
			var pic=this.pics;
			var l=pic.length;
			var piclist=this.piclist;
			piclist.style.width=(l*width)+"px";
			for(var i=0;i<l;i++){
				piclist.innerHTML+="<li style=\"background-image:url('"+pic[i]+"')\"></li>"
			}
		},
		next:function(){
			if(this.active==this.pics.length-1){
				return
			}else{
				var newActive=this.active+1
				this.setIconActive(newActive);
				this.showPic(newActive);
			}
		},
		pre:function(){
			if(this.active==0){
				return
			}else{
				var newActive=this.active-1;
				this.setIconActive(newActive);
				this.showPic(newActive);
			}
		},
		showPic:function(i){
			if($.isDefined(i)&&$.isDefined(this.piclist.children[i])){
				var piclist=this.piclist;
				piclist.style.left=(-i*width)+"px";
			}
		},
		setIconActive:function(i){
			if($.isDefined(i)&&$.isDefined(this.icons.children[i])){
				var icons=this.icons.children;
				icons[this.active].className="";
				icons[i].className="active";
				this.active=i;
				if(this.active==this.pics.length-1){
					this.enter.style.display="block";
				}else{
					this.enter.style.display="none";
				}		
			}
		}

	};
	$.ready(function(){
		height=document.body.clientHeight;
		width=document.body.clientWidth;
		PicPlayer.styles=[".pic_player{width:100%;height:100%;overflow:hidden;position:relative}",
						".pic_list{height:100%;position:absolute;font-size:0;transition:left 1s linear 0;-webkit-transition:left 1s linear 0}",
						".pic_list li{height:100%;display:inline-block;width:"+width+"px;background-size:100% 100%}",
						".icon{position:absolute;width:100%;height:1em;font-size:13rem;line-height:1em;text-align:center;color:white;bottom:2%}",
						".icon span{margin-right:0.03em;}",
						".icon span.active{color:rgb(252,47,0)}",
						".enter{position:absolute;z-index:999;font-size:2.8rem;color:white;line-height:2em;padding:0 0.5em;border:solid 1px white;border-radius:10px;bottom:1.5em;right:1.5em}"];
		$.setStyle(PicPlayer.styles.join("\r\n"));
		var player=new PicPlayer(["../img/welcome1.jpg","../img/welcome2.jpg","../img/welcome3.jpg"]);
	});
});