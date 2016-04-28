/*loading.js*/
/*loading框*/
(function(){
	var createLoadingBox=function(){
		var html=[];
		html.push("<div style='width:100%;height:100%;position:absolute;z-index:999;top:0;left:0;background-color:rgba(10,10,10,0.4);text-align:center;display:none'>");
		html.push("<img src='../img/loading.gif' style='position:absolute;top:45%;'>");
		html.push("</div>");
		document.body.innerHTML+=html.join("");
		return document.body.lastChild;
	}
	var loadingBox=createLoadingBox();
	var loading={
		show:function(){
			loadingBox.style.display="block";
		},
		hide:function(){
			loadingBox.style.display="none";
		}
	}
	var factory=function(){
		var exports=loading;
		return exports;
	}
	define(factory);
})()