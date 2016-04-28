(function(){
	var AudioPlayer=function(src){
		var self=this;
		this.audio=document.createElement("audio");
		this.loaded=true;
		this.onload=[];
		this.audio.autoplay="autoplay";
		this.audio.src=src;
		this.audio.innerHTML="<source src='"+src+"' type='audio/mpeg' />"
		this.play=function(){
			if(this.loaded){
				this.audio.play();
			}else{
				this.onload.push(function(){
					self.play();
				});
			}			
		}
		this.pause=function(){
			if(this.loaded){
				this.audio.pause();
			}			
		}
		this.toggle=function(){
			if(this.audio.paused){
				this.play();
				return "打开";
			}else{
				this.pause();
				return "关闭";
			}
		}
		this.audio.onloadeddata=function(){
			self.loaded=true;
			for(var i=0;i<self.onload.length;i++){
				self.onload[i].call(null);
			}
			self.onload.length=0;
		}
		this.audio.src=src;
	}

	var hasTouch = document.hasOwnProperty("ontouchstart") ? true : false;
	var evts=hasTouch?["touchstart","touchend","touchmove"]:["mousedown","mouseup","mousemove"];
	var PicPlayer=function(pics){
		var self=this;
		this.pics=pics||[];
		this.wrapper=document.createElement("div");
		this.wrapper.className="my_pic_player";
		this.imgs=[];
		this.createPics();
		if(document.body){
			document.body.appendChild(this.wrapper);
		}else{
			window.addEventListener("load",function(){
				document.body.appendChild(self.wrapper);
			},false);
		}
		this.wrapper.addEventListener(evts[0],PicPlayer.startMove,false);
		this.wrapper.addEventListener(evts[1],PicPlayer.endMove,false);
	}
	PicPlayer.setStyle=function(){
		var style=document.createElement("style");
		var rules=[];
		rules.push(".my_pic_player{position:absolute;top:0;left:0;width:100%;height:100%;font-size:0;overflow:hidden}");
		rules.push(".my_pic_player li{position:absolute;width:100%;height:100%;text-align:center;background-size:100% 100%;-webkit-transition:top linear 0.5s;}");
		rules.push(".my_pic_player p{width:100%;height:100%; –webkit-user-select:none;background-size:100% 100%;}");
		style.innerHTML=rules.join("\r\n");
		document.head.appendChild(style);
	}
	PicPlayer.startpoint=0;
	PicPlayer.endpoint=0;
	PicPlayer.index=0;
	PicPlayer.imgs=[];
	PicPlayer.height=0;
	PicPlayer.width=0;
	PicPlayer.nextIndex=0;
	PicPlayer.time0=0;
	PicPlayer.time1=0;
	PicPlayer.getPoint=function(e){
		var touch=hasTouch?(e.targetTouches[0]):e;
		return touch.clientY;
	}
	PicPlayer.startMove=function(e){
		var target=e.target;
		var wrapper=e.currentTarget;
		PicPlayer.startpoint=PicPlayer.getPoint(e);
		PicPlayer.index=parseInt(target.getAttribute("index"));
		PicPlayer.imgs=wrapper.children;
		PicPlayer.height=wrapper.clientHeight;
		PicPlayer.width=wrapper.clientWidth;
		target.style.zIndex="10";
		wrapper.addEventListener(evts[2],PicPlayer.move,false);
		PicPlayer.time0=e.timeStamp;
	}
	PicPlayer.move=function(e){
		e.preventDefault();
		e.stopPropagation();
		if(e.timeStamp-PicPlayer.time0<500){
			return;
		}
		PicPlayer.time0=e.timeStamp;
		var target=e.target;
		var wrapper=e.currentTarget;
		var s=0;
		var n=0;
		PicPlayer.endpoint=PicPlayer.getPoint(e);		
		//向下
		s=PicPlayer.endpoint-PicPlayer.startpoint;
		if(s>0){
			n=(PicPlayer.index==0?(PicPlayer.imgs.length-1):(PicPlayer.index-1));
			PicPlayer.imgs[n].style.zIndex="99";
			PicPlayer.imgs[n].style.top=(s-PicPlayer.height)+"px";
			
		}else{
			n=(PicPlayer.index==(PicPlayer.imgs.length-1)?0:(PicPlayer.index+1));
			PicPlayer.imgs[n].style.zIndex="99";
			PicPlayer.imgs[n].style.top=(PicPlayer.height+s)+"px";
		}
		PicPlayer.imgs[PicPlayer.index].style.top=s*0.03+"px";
		PicPlayer.imgs[PicPlayer.index].children[0].style.width=PicPlayer.width-Math.abs(s)*0.06+"px";
	}
	PicPlayer.getPretIndex=function(index){
		var preIndex=(PicPlayer.nextIndex=(PicPlayer.index==0?(PicPlayer.imgs.length-1):(PicPlayer.index-1)));
		return preIndex;
	}
	PicPlayer.getNextIndex=function(index){
		var nextIndex=(PicPlayer.nextIndex=(PicPlayer.index==(PicPlayer.imgs.length-1)?0:(PicPlayer.index+1)));
		return nextIndex();
	}
	PicPlayer.animate=function(s,cb){
		var n=0;

		if(s>0){
			PicPlayer.nextIndex==null&&PicPlayer.getPretIndex();
			PicPlayer.imgs[PicPlayer.nextIndex].style.zIndex="99";
			PicPlayer.imgs[PicPlayer.nextIndex].style.top=(s-PicPlayer.height)+"px";
		}else{
			PicPlayer.nextIndex==null&&PicPlayer.getNextIndex();
			PicPlayer.nextIndex;
			PicPlayer.imgs[PicPlayer.nextIndex].style.zIndex="99";
			PicPlayer.imgs[PicPlayer.nextIndex].style.top=(PicPlayer.height+s)+"px";
		}
		PicPlayer.imgs[PicPlayer.index].style.top=s*0.03+"px";
		//PicPlayer.imgs[PicPlayer.index].children[0].style.height=PicPlayer.height-Math.abs(s)*0.03+"px";
		PicPlayer.imgs[PicPlayer.index].children[0].style.width=PicPlayer.width-Math.abs(s)*0.06+"px";
		if((Math.abs(s)/PicPlayer.height)>0.05){
				s=s+(Math.abs(s)/s)*PicPlayer.height*0.2;
				if(Math.abs(s)>=PicPlayer.height){
					setTimeout(function(){
						PicPlayer.imgs[PicPlayer.index].style.top="0";
						PicPlayer.imgs[PicPlayer.index].style.zIndex="0";
						PicPlayer.imgs[PicPlayer.index].children[0].style.height="100%";
						PicPlayer.imgs[PicPlayer.index].children[0].style.width="100%";
						PicPlayer.imgs[(PicPlayer.index==(PicPlayer.imgs.length-1)?0:(PicPlayer.index+1))].style.zIndex="0";
						PicPlayer.imgs[(PicPlayer.index==0?(PicPlayer.imgs.length-1):(PicPlayer.index-1))].style.zIndex="0";
						PicPlayer.imgs[(PicPlayer.index==(PicPlayer.imgs.length-1)?0:(PicPlayer.index+1))].style.top="0";
						PicPlayer.imgs[(PicPlayer.index==0?(PicPlayer.imgs.length-1):(PicPlayer.index-1))].style.top="0";
						PicPlayer.imgs[PicPlayer.nextIndex].style.zIndex="10";
						cb();
					},500);
					return;
				}
			}else{				
				if(s/s-(Math.abs(s)/s)*PicPlayer.height*0.2<0){
					setTimeout(function(){
						PicPlayer.imgs[PicPlayer.index].style.top="0";
						PicPlayer.imgs[PicPlayer.index].style.zIndex="10";
						PicPlayer.imgs[PicPlayer.index].children[0].style.height="100%";
						PicPlayer.imgs[PicPlayer.index].children[0].style.width="100%";
						PicPlayer.imgs[(PicPlayer.index==(PicPlayer.imgs.length-1)?0:(PicPlayer.index+1))].style.zIndex="0";
						PicPlayer.imgs[(PicPlayer.index==0?(PicPlayer.imgs.length-1):(PicPlayer.index-1))].style.zIndex="0";
						PicPlayer.imgs[(PicPlayer.index==(PicPlayer.imgs.length-1)?0:(PicPlayer.index+1))].style.top="0";
						PicPlayer.imgs[(PicPlayer.index==0?(PicPlayer.imgs.length-1):(PicPlayer.index-1))].style.top="0";
						cb();
					},500);
					return;
				}else{
					s=s-(Math.abs(s)/s)*PicPlayer.height*0.2;
				}
		}
		if(s!==s){
			return ;
		};
		setTimeout(function(){
			PicPlayer.animate(s,cb);
		},500)
		
		
	}
	PicPlayer.init=function(index){
		PicPlayer.imgs[PicPlayer.getPreIndex()].style.top=-PicPlayer.height+"px";
		PicPlayer.imgs[PicPlayer.getNextIndex()].style.top=PicPlayer.height+"px";
	}
	PicPlayer.endMove=function(e){
		var wrapper=e.currentTarget;
		var s=PicPlayer.endpoint-PicPlayer.startpoint;
		wrapper.removeEventListener(evts[2],PicPlayer.move,false);
		var cb=function(){
			PicPlayer.init(PicPlayer.nextIndex);
			PicPlayer.startpoint=0;
			PicPlayer.endpoint=0;
			PicPlayer.index=0;
			PicPlayer.imgs=[];
			PicPlayer.height=0;
			PicPlayer.width=0;
			PicPlayer.nextIndex=null;

		}
		PicPlayer.animate(s,cb);
		
	}

	PicPlayer.prototype={
		createPics:function(){
			for(var i=this.pics.length-1;i>=0;i--){
				this.wrapper.innerHTML+=('<li><p index="'+(this.pics.length-1-i)+'" style="background-image:url(\''+this.pics[i]+'\')"></p></li>');
			}
			this.imgs=this.wrapper.children;
		},
	}
	var imgs=["images/pic1.jpg","images/pic2.jpg","images/pic3.jpg","images/pic4.jpg","images/pic5.jpg"];
	PicPlayer.setStyle();
	picplayer=new PicPlayer(imgs);
	var audio=new AudioPlayer("/static/js/mp3test.mp3");
	var playerButton;
	console.log(audio.audio.canPlayType("audio/mp3"))
	window.addEventListener("load",function(){
		document.body.appendChild(audio.audio);
		playerButton=document.getElementsByClassName("playerButton")[0];
		playerButton.addEventListener("click",function(){
			playerButton.innerHTML=audio.toggle();
			setTimeout(function(){
				playerButton.innerHTML="";
			},1000);
		},false);
		audio.play();
	},false);	
})()