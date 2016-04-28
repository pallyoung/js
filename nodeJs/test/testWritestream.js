var WriteStream = require('fs').WriteStream;
var fs = require('fs')
_writeStream = new WriteStream("test.png");
// _writeStream.write("hee", function() {
// 	console.log("nihao");
// })
//_writeStream.end();
fs.writeFile('message.txt', 'Hello Node', function(err) {
	if (err) throw err;
	console.log('It\'s saved!');
});
// _writeStream = fs.createWriteStream("hello.txt");
// _writeStream.write("hello world", function() {
// })
// _writeStream.end();

//如果没有文件均会新建文件

_readStream = fs.createReadStream("kk.png");
// _readStream.on('data', function(chunk) {
// 	fs.appendFile("test.txt", chunk);
// 	console.log(chunk);
// });
_readStream.pipe(_writeStream);
_readStream.on('end', function() {
	//_readStream.end();
	_writeStream.end();
});
_readStream.read();
if(!fs.existsSync("data")){
	fs.mkdirSync("data");
}
fs.writeFile('data/message.txt', 'Hello Node', function(err) {
	if (err) throw err;
	console.log('It\'s saved!');
});