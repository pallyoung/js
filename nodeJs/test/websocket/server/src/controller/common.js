(function () {
	// body...
	var url=require("url");
	var queryString=require("querystring");
	var http=require("http");
	var path=require("path");
	var util=require("util");
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
    		response.write("hello"+request.getParameter("name")+"!");
    		response.end();
		 },
		 "chat":function(request,response){
		 	
		 },
		"gettime":function(request,response){
			response.writeHead(200, {
         		'Content-Type': 'text/event-stream'

     		});
    		response.write("");
    		response.end();
		 }
	}

})()