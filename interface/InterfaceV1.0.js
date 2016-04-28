(function(){
	var Error={
		argumentsError:"unexpected arguments",
		unimplement:"this method is implemented"
	}
	var Interface=function(methods){
		var interface=function(){

		};
		if(typeof methods !=="array"){
			throw new Error(Error.argumentsError);
		}
		for(var i=0;i<methods.length;i++){
			if(typeof methods[i]==="string"){
				interface.prototype[methods[i]]=function(){
					throw new Error(Error.unimplement);
				}
			}else{
				throw new Error(Error.argumentsError);
			}
		}
		return interface;
	}
	Function.prototype.ensureIm
})()