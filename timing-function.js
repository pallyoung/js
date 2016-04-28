//三次贝塞尔曲线作为运动时间函数
(function() {
	var cubicBezierFunction = {
		bt: function(points, t) {
			var b = 3 * points[0] * t * Math.pow(1 - t, 2) + 3 * points[1] * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
			return b;
		},
		tb: function(points, b) {
			var b0 = 0;
			var b1 = 0;
			for (var t = 0; t <= 1; t = t + 0.00001) {
				b1 = cubicBezierFunction.bt(points, t);
				if ((b0 <= b && b1 >= b) || (b1 <= b && b0 >= b)) {
					return t;
				} else {
					b0 = b1;
				}
			}
		}
	}
	var CubicBezier = function(points) {
		if (!(points instanceof Array) || points.length !== 4) {
			throw new Error("参数必须是一个长度为4的数组");
		}
		this.x = [points[0], points[2]];
		this.y = [points[1], points[3]];
	}
	CubicBezier.prototype = {
		constructor: CubicBezier,
		getY: function(x) {
			var a=Date.now();
			var t = cubicBezierFunction.tb(this.x, x);
			console.log(Date.now()-a);
			return cubicBezierFunction.bt(this.y, t);
		},
		getX: function(y) {
			var t = cubicBezierFunction.tb(this.y, y);
			return cubicBezierFunction.bt(this.x, t);
		},
	};
	window.cb = CubicBezier;
})()