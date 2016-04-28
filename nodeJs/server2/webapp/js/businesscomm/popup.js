/*
*弹出框控件
*/
define(function(){
	var noop=function(){

	};
	var addStylesheet=function(){
		var stylesheet=document.createElement("style");
		var rules=[];
		rules.push("\.myself_popup{position:fixed;width:100%;height:100%;top:0;left:0;display:none;z-index:999999}");
		rules.push("\.myself_popup_bg{width:100%;height:100%;position:fixed;background-color:black;opacity:0.5;top:0;left:0}");
		rules.push("\.myself_popup_container{position:fixed;top:30%;left:50%;margin-left:-220px;padding:0;font-size:2\.8rem;color:rgb(70,70,70);width:440px;background:rgb(254,254,254);border-radius:10px}");
		rules.push("\.myself_popup_heading{padding-left:1em;height:2em;line-height:2em;border-bottom:solid 1px rgb(220,220,220);}");
		rules.push("\.myself_popup_msg{min-height:2em;width:100%;line-height:2em;border-bottom:solid 1px rgb(220,220,220);text-align:center}");
		rules.push("\.myself_popup_button{font-size:0;text-align:center}");
		rules.push("\.myself_popup_button a{height:3em;line-height:3em;display:inline-block;width:219px;color:rgb(242,109,4);font-size:2.8rem;text-align:center;}");
		rules.push("\.myself_popup_button a:nth-child(2){border-left:solid 1px rgb(220,220,220);}");
		stylesheet.innerHTML=rules.join("\n\r");
		document.head.appendChild(stylesheet);
	}
	var popup = {
		body: document.createElement("div"), //主体
		heading:document.createElement("div"), //标题
		msgBox: document.createElement("div"), //消息框
		buttonBox: document.createElement("div"), //按钮框
		OKButton: document.createElement("a"), //确定按钮
		cancelButton: document.createElement("a"), //取消按钮
		callback: noop,
		cancelOrOk: function(event) {
			var target = event.target;
			if (target.className.toLowerCase().indexOf("overlaycancel") !== -1) {
				this.hide();
				this.callback(false);

			} else /*if (target.className.toLowerCase().indexOf("overlayok") !== -1)*/ {
				this.hide();
				this.callback(true);

			}

		}, //按钮事件
		/*
		*@prama Object(option)
		*{
			msg:"",//
			heading:"警告"//如果不指定heading则不显示标题
			OKButton:"确定",
			cancelButton:"取消",
			callback:function(){}

		}
		*/
		alert: function(option) {
			option=option||{
				msg:"",//
				heading:"警告",//如果不指定heading则不显示标题
				OKButton:"确定",
				callback:noop,
			}
			this.heading.style.display=option.heading?((this.heading.innerHTML=option.heading)&&"block"):"none";
			this.cancelButton.style.display="none";
			this.OKButton.style.display="inline-block";
			this.OKButton.innerHTML = option.OKButton||"确定";
			this.msgBox.innerHTML = option.msg;
			this.body.style.display = "block";
			this.callback=option.callback||noop;
		},
		confirm: function(option) {
			option=option||{
				msg:"",//
				heading:"警告",//如果不指定heading则不显示标题
				OKButton:"确定",
				cancelButton:"取消",
				callback:noop,
			}
			this.heading.style.display=option.heading?((this.heading.innerHTML=option.heading)&&"block"):"none";
			this.cancelButton.style.display="inline-block";
			this.OKButton.style.display="inline-block";
			this.msgBox.innerHTML = option.msg;
			this.OKButton.innerHTML = option.OKButton||"确定";
			this.cancelButton.innerHTML = option.cancelButton||"取消";
			this.body.style.display = "block";
			this.callback=option.callback||noop;


		},
		prompt: function(option) {
			this.buttonBox.innerHTML = "";
			this.body.children[1].style.height = "3em";
			this.msgBox.innerHTML = msg;
			this.body.style.display = "block";

		},
		hide: function() {
			this.body.style.display = "none";
		},
		init: function() {
				this.body.className="myself_popup";
				this.body.innerHTML = "<div class='myself_popup_bg'></div>"; //背景层
				this.body.innerHTML += "<div class='myself_popup_container'></div>"; //内容层
				this.heading.className = "myself_popup_heading";
				this.msgBox.className = "myself_popup_msg";
				this.buttonBox.className = "myself_popup_button";
				this.OKButton.className = "overlayok";
				this.cancelButton.className = "overlaycancel";
				this.body.children[1].appendChild(this.heading);
				this.body.children[1].appendChild(this.msgBox);
				this.body.children[1].appendChild(this.buttonBox);
				this.buttonBox.appendChild(this.OKButton);
				this.buttonBox.appendChild(this.cancelButton);
				this.buttonBox.addEventListener("click", function(event) {
					popup.cancelOrOk(event)
				}, false);
				if(document.body){
					document.body.appendChild(this.body);
				}else{
					window.addEventListener("load",function(){
						document.body.appendChild(popup.body);
					},false)
				}
				
		}
	} 
	addStylesheet();
	popup.init();
	return{
		alert:function(option){
			popup.alert(option);
		},
		confirm:function(option){
			popup.confirm(option);
		}
	}
});