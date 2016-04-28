  /**********************************************************/
  /*                                                        */
  /*                   test fs                              */
  /*                                                        */
  /**********************************************************/
  var fs = require("fs"),
  	util = require('util');
  var readDir = function(path) {
  		var files = fs.readdirSync(path);
  		files.forEach(function(file) {
  				file = path + '/' + file;
  				fs.stat(file, function(err, stat) {
  					if (stat && stat.isDirectory()) {
  						readDir(file);
  					} else {
  						util.log(file);
  					}
  				});
  			});
  }
  readDir("d:/book");