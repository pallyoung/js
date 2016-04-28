

if (/MSIE\s8\.\d/.test(navigator.userAgent)) {

// 为String对象添加trim方法
    String.prototype.trim=function() {

    	var ltrimS=/^\s+/g;
    	var rtrimS=/\s+$/g;
    	var temp="";
    	temp=this.replace(ltrimS,'');
    	temp=temp.replace(rtrimS,'');
    	return temp;

    }
// 为数组添加indexof方法
	Array.prototype.indexOf = function(na) {
		var length = this.length;
		for (var i = 0; i < length; i++) {
			if (this[i] === na) {
				return i;
			}
		}
		return -1;
	}
//为数组添加forEach方法
Array.prototype.forEach=function(f,o){
	var length=this.length;
	var obj;
	var array=this;
	if(o){
        obj=o;
	}else{
		obj=window;
	}
	for(var i=0;i<length;i++){
		f.apply(o,[array[i],i,array]);
	}
}
}