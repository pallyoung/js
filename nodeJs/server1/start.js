
path=require('path');
var s2server=require(path.resolve("../s2"));
s2server.loadConfig("config.js");
s2server.listen();