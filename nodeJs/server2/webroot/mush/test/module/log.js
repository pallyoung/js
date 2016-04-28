/*
*日志文件，重新定义console函数
*/
define(function(){

	var externalLog={
		i:function(){

		},
		e:function(){

		}
	}
	if(!!window.jslog){
		externalLog=window.jslog;
	}
	var debug = {
		console: window.console,
		initConsole: function() {
			window.console = {
				log: function(msg) {
					debug.console.log(msg);
					externalLog.i(msg);
				},
				warn:function(msg){
					debug.console.warn(msg);
				},
				error: function(msg) {
					debug.console.error(msg);
					externalLog.e(msg);
				},
				dir: function(msg) {
					debug.console.dir(msg);
				},
				info: function(msg) {
					debug.console.info(msg);
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
		init: function(style) {
			this.initConsole();
		}
	}
	return {
		log:console.log,
		error:console.error
	}
});