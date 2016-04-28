/*
*选择框
*/
define(function () {
	function hasTouch() {
		return document.hasOwnProperty("ontouchstart") ? true : false;
	}
	var evts = hasTouch() ? {
		touchstart: "touchstart",
		touchend: "touchend",
		touchmove: "touchmove"
	} : {
		touchstart: "mousedown",
		touchend: "mouseup",
		touchmove: "mousemove"
	};
	function isArray(it) {
        return Object.prototype.toString.call(it) === '[object Array]';
    }
	function Select(dom,list){
		if(!dom||!list||!isArray(list)){
			throw new Error("参数错误");
		}
		this.wrapper=dom;
		this.list=list;
		this.wrapper.innerHTML='<p class="select_content" data-roll="dst">'+this.wrapper.innerHTML+'</p>';
		this.selectedContent="";
		this.createList();
		this.changeEventHandles=[];
		var self=this;
		this.wrapper.addEventListener(evts.touchstart,function(e){
			e.stopPropagation();
			var target=e.target;
			var roll=target.getAttribute("data-roll");
			var selectedContent=""
			if(roll=="dst"){
				e.currentTarget.children[1].style.display="block";
			}else if(roll=="option"){
				e.currentTarget.children[0].innerHTML=target.getAttribute("data-value");
				selectedContent=target.getAttribute("data-value");
				if(self.selectedContent!==selectedContent){
					self.selectedContent=selectedContent;
					Select.emit(self.changeEventHandles,selectedContent,self);
				}				
				e.currentTarget.children[1].style.display="none";
			}
		},false);
		(function(wrapper){
			document.body.addEventListener(evts.touchstart,function(){
				wrapper.children[1].style.display="none";
			},false)
		})(this.wrapper);
	}
	Select.emit=function(handles,data,context){
		context=context||null;
		handles.forEach(function(value){
			value.call(context,data);
		});
	}
	Select.prototype={
		on:function(type,handle){
			if(this[type+"EventHandles"]&&this[type+"EventHandles"].push){
				this[type+"EventHandles"].push(handle);
			}
		},
		remove:function(type,handle){
			if(this[type+"EventHandles"]&&this[type+"EventHandles"].push){
				this[type+"EventHandles"].forEach(function(value,i,arr){
					if(value===handle){
						arr.splice(i,1);
					}
				})
			}
		},
		setList:function(list){
			if(!list||!isArray(list)){
				throw new Error("参数错误");
			}
			this.list=list;
			this.createList();
		},
		createList:function(){
			var length=this.wrapper.children.length;
			var html="<ul class='select_list'>";
			var list=this.list,l=list.length;
			for(var i=0;i<l;i++){
				html+="<li data-roll='option' data-value='"+list[i]+"'>"+list[i]+"</li>";
			}
			html+="</ul>";
			if(length==1){
				this.wrapper.innerHTML+=html;
			}else{
				this.wrapper.children[1].outerHTML=html;
			}
			
			this.wrapper.children[0].innerHTML=list[0];
			this.selectedContent=list[0];
			return html;
		}
	}
	return {
		createSelect:function(dom,list){
			return new Select(dom,list);
		}
	}
})