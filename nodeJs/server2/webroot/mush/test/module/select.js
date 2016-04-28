/*
*选择框
*/
define(function () {
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
		this.createList();
		this.wrapper.addEventListener("click",function(e){
			e.stopPropagation();
			var target=e.target;
			var roll=target.getAttribute("data-roll");
			if(roll=="dst"){
				e.currentTarget.children[1].style.display="block";
			}else if(roll=="option"){
				e.currentTarget.children[0].innerHTML=target.getAttribute("data-value");
				e.currentTarget.children[1].style.display="none";
			}
		},false);
		(function(self){
			document.body.addEventListener("click",function(){
				self.children[1].style.display="none";
			},false)
		})(this);
	}
	Select.prototype={
		createList:function(){
			var html="<ul class='select_list'>";
			var list=this.list,l=list.length;
			for(var i=0;i<l;i++){
				html+="<li data-roll='option' data-value='"+list[i]+"'>"+list[i]+"</li>";
			}
			html+="</ul>";
			this.wrapper.innerHTML+=html;
			return html;
		}
	}
	return {
		createSelect:function(dom,list){
			return new Select(dom,list);
		}
	}
})