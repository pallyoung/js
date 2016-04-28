/*
*页面一些个性化的设置模块
*/

define(["require","base"],function(require,base){
	var keyboardHeight=0,activeInput;
	var or=window.or;

	var exports={};
	var phoneScale=parseInt(window.screen.height) / window.innerHeight;
	function preventOverlay(h){
		if(activeInput==null){
			return;
		}
		var target=activeInput,height=target.offsetHeight,top=require("base").getOffsetTop(target);
		var overlayh=(require("base").isNumber(h)&&h>100)||480;
		var bottom=window.innerHeight-top-height;
		if(bottom<overlayh){
			require("base").slideUp(document.querySelector("#"+or.activePage+" .wrapper"),overlayh-bottom);
		}
		activeInput.focus();

	}
	function afterPrevent(){
		if(activeInput!=null){
			activeInput.blur();
		}
		activeInput=null;
		document.querySelector("#"+or.activePage+" .wrapper").style.top="4em";

	}
	/*
	*防止页面被遮挡
	*/
	function preventKeyboardOverlay(){
		document.body.addEventListener("focusin",function(e){
			var target=e.target;
			if((target.tagName=="INPUT"&&(target.type=="text"||target.type=="password"))||target.tagName=="TEXTAREA"){
				activeInput=target;
			}
			/*if(keyboardHeight<100&&require("base").getKeyboardHeight){
				keyboardHeight=require("base").getKeyboardHeight();
			}*/
			preventOverlay(keyboardHeight/phoneScale);
		},false);
		// document.body.addEventListener("focusout",function(e){
		// 	if(activeInput!==null){
		// 		activeInput=null;
		// 	}
		// 	afterPrevent();
		// },false);
	}
	return exports={
		preventKeyboardOverlay:preventKeyboardOverlay,
		afterPrevent:afterPrevent,
		preventOverlay:preventOverlay
	}
})