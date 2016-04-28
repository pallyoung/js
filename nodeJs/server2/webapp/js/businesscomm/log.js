/*
*日志文件，重新定义console函数
*/
define(function(){
	var env="pro";
	var externalLog={
		i:function(){

		},
		e:function(){

		}
	}
	if(!!window.jslog){
		externalLog=window.jslog;
	}
	var getFnName=function(fun){
		var regexp=/function\s*(\w+)\s*\(\.*\)/;
			if(regexp.test(fun.toString())){
				return RegExp.$1;
			}
			if(env==="dev"){
				return fun.toString();
			}
			return "anonymous function";
	}
	var debug = {
		console: window.console,
		initConsole: function() {
			window.console = {
				log: function() {
					var caller=arguments.callee.caller;
					var name="";
					var msg;
					if(caller){
						name=getFnName(caller);
					}
					debug.console.log(new Date()+name+"---logstart");
					externalLog.i(new Date()+name+"---logstart");
					for(var i=0,l=arguments.length;i<l;i++){
						try{
							msg=arguments[i];
							debug.console.log(msg);
							msg=typeof msg=="string"?msg:JSON.stringify(msg);
						}catch(e){
						
						}
						externalLog.i(msg);
					}
					
					
					externalLog.i(new Date()+name+"---logend");
					debug.console.log(new Date()+name+"---logend");
					
				},
				warn:function(msg){
					debug.console.warn(new Date()+":"+msg);
				},
				error: function(msg) {
					try{
						msg=typeof msg=="string"?msg:JSON.stringify(msg);
					}catch(e){
						
					}
					externalLog.e(new Date()+":"+msg);
					debug.console.error(new Date()+":"+msg);
					
				},
				dir: function(msg) {
					debug.console.dir(msg);
				},
				info: function(msg) {
					debug.console.info(new Date()+":"+msg);
				},
				clear: function() {
					debug.console.clear();
				},
				time:function(msg){

				},
				timeEnd:function(msg){

				},
			};
			//对原生的console对象进行重写
		},
		init: function() {
			this.initConsole();
		}
	}
	debug.init();
	return {
		log:console.log,
		error:console.error
	}
});