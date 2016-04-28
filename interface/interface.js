//js接口实现
(function() {
	var Interface = function(name, methods) {
		if (arguments.length != 2) {
			throw new Error('必须输入两个参数,当前个数' + arguments.length);
		}

		this.name = name;
		this.methods = [];
		for (var i = 0, len = methods.length; i < len; i++) {
			if (typeof methods[i] !== 'string') {
				throw new Error('方法名参数必须为string');
			}
			this.methods.push(methods[i]);
		}
	};
	Interface.ensureImplements = function(object) {
		if (arguments.length < 2) {
			throw new Error('必须输入两个参数,当前个数' + arguments.length);
		}
		for (var i = 1, len = arguments.length; i < len; i++) {
			var interface = arguments[i];
			if (interface.constructor != Interface) {
				throw new Error("请实现接口");
			}

			for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
				var method = interface.methods[j];
				if (!object[method] || typeof object[method] !== 'function') {
					throw new Error("接口名:" + interface.name + "方法名：" + method + "没找到");
				}
			};
		}
	}
})()