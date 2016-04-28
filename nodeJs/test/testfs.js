var fs=require("fs");
fs.readFile("hello.tsxt",function (err,data) {
	console.log(err);
	console.log(data);
});