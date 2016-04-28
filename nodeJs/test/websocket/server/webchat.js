
path=require('path');
ws=require("ws").Server;
var s2server=require(path.resolve("s2"));
s2server.setWebConfig("config.js");
s2server.setControllers("router_config");
s2server.listen();


var wsserver= new ws({server: s2server.server});

var rooms={};
wsserver.on('connection',function(ws){
  console.log('new connection founded successfully');
  ws.on('message',function(data){
    data=JSON.parse(data).data;   
    if(data.eventName=="connect"){
    	console.log('join'+data.room);
    	if(!rooms[data.room]){
    		rooms[data.room]=[];
    	}
    	rooms[data.room].push(ws);
    	console.log(rooms[data.room].length);
    	for(var i =0;i<rooms[data.room].length;i++){
    		rooms[data.room][i].send(JSON.stringify({
    			"eventName":"sys_message",
    			"message":data.name +" joins room "+data.room,
                "name":data.name
    		}));
    	}
    }else{
    	for(var i =0;i<rooms[data.room].length;i++){
    		rooms[data.room][i].send(JSON.stringify({
    			"eventName":"message",
    			"message":data.message,
                "name":data.name
    		}));
    	}
    }
  });
  ws.on('close',function(){
    for(var o in rooms){
    	for(var i =0;i<rooms[o].length;i++){
    		if(ws==rooms[o][i]){
    			rooms[o].splice(i,1);
    			return;
    		}
    	}
    }
  });
})