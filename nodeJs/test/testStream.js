Stream=require('stream').Stream;
_stream=require('stream');
fs=require('fs');
var stream=new Stream();
var writeStream = new fs.WriteStream("stream.txt");
for(o in stream){
	fs.appendFile("stream.txt","stream."+o+"\r\n");
}
fs.appendFile("stream.txt","stream:"+JSON.stringify(stream));

for(o in _stream){
	fs.appendFile("stream.txt","stream."+o+"\r\n");
}
fs.appendFile("stream.txt","stream:"+JSON.stringify(_stream));