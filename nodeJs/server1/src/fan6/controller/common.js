(function () {
	// body...
	var url=require("url");
	var queryString=require("querystring");
	var http=require("http");
	var path=require("path");
	var util=require("util");
	var proxy=require("../../../../proxy");
	exports.controller={
		"sayhello":function(request,response){
			response.writeHead(200, {
         		'Content-Type': 'text/plain;charset=UTF-8',

     		});
    		response.write("hello,"+request.queryString("name")+"!!!");
    		response.end();
		},
		"saysorry":function(request,response){
			response.writeHead(200, {
         		'Content-Type': 'text/plain;charset=UTF-8',

     		});
    		response.write("i miss you,"+request.getParameter("name")+"!");
    		response.end();
		 },
		"ajaxproxy":function(request,response){
			var wd=request.queryString("wd");
			var opt={
				protocol:"http:",
				host:"www.baidu.com",
				method:"GET"
			};
			var cont="wd:"+wd;
			proxy.request(opt,cont,function(res){
				var data="";
				res.on("data",function(chunk){
					data+=chunk;
				});
				res.on("end",function(chunk){
					response.writeHead(200, {
         			'Content-Type': 'text/plain;charset=UTF-8',
     				});
    				response.write(data);
    				response.end();
				});
			});

		},
		"gettime":function(request,response){
			response.writeHead(200, {
         		'Content-Type': 'text/event-stream'

     		});
    		response.write("i miss you");
    		response.end();
		 }
	}

})()