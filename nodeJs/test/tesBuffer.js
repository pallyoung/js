var Buffer=require("buffer").Buffer;
var b1=new Buffer(10);
var b2=new Buffer(10);
b1.write("helloworld");
b2.write("helloworld");
console.log(b2);
console.log(b1);
console.log(b2==b1);
console.log(b2.toString());
console.log(b1.toString());
console.log(b2.toString()===b1.toString());
console.log(b2[0]===String("h").charCodeAt(0));
console.log(b2[0]===104);
console.log(b2.slice(2,4));

