(function() {
	// body...
	/*param:option{
		node:node,//滚动节点，dom对象
		x:false,//是否横向滚动
		y:false,//是否纵向滚动
		style:{
			x:css,
			y:css	
		},//滚动条样式
	}*/
	var events = ["scroll", "scrollEnd", "scrollStart", "end", "start"];
	var errorCode = [{
		code: 1,
		msg: "节点不存在"
	}];
	var eventType = {
		touch: ["touchmove", "touchstart", "touchend", "touchcancel"],
		mouse: ["mousemove", "mousedown", "mouseup", "mouseout"],
	}
	var constant = {
		length: 20
	}
	var animation = function() {
		this.timeout = null;
		this.clear = null;
	}
	animation.prototype = {
		dos: function(callBack, timeout) {
			var that = this,
				fun = function() {
					try {
						callBack();
					} catch (e) {

					}
					that.timeout = null;
				};
			if (timeout) {
				this.timeout = setTimeout(fun, timeout);
				this.clear = function() {
					clearTimeout(this.timeout);
					this.timeout = null;
				}
			} else {
				this.timeout = requestAnimationFrame(fun);
				this.clear = function() {
					cancelAnimationFrame(this.timeout);
					this.timeout = null;
				}
			}


		}
	}

	var getScrollBar = function(direction, css) {
		var scrollBar = {
			x: "<div style=\"width:100%;position:absolute;bottom:0;\">" +
				"<p style=\"border-radius:5px;height:5px;background-color:rgba(0,0,0,0.3);min-width:10px;max-width:100%;" + css + "\"></p>" +
				"</div>",
			y: "<div style=\"height:100%;position:absolute;right:0;top:0\">" +
				"<p style=\"border-radius:5px;width:5px;background-color:rgba(0,0,0,0.3);min-height:10px;max-height:100%;" + css + "\"></p>" +
				"</div>"
		}
		var fragment = document.createElement("div");
		fragment.innerHTML = scrollBar[direction];
		return fragment.children[0];

	};
	var getPoint = function(event) {
		if (document.hasOwnProperty("ontouchstart")) {
			getPoint = function(event) {
				return {
					x: event.touches[0].pageX,
					y: event.touches[0].pageY
				}
			};
			return {
				x: event.touches[0].pageX,
				y: event.touches[0].pageY
			}

		} else {
			getPoint = function(event) {
				return {
					x: event.pageX,
					y: event.pageY
				}
			};
			return {
				x: event.pageX,
				y: event.pageY
			}

		}


	}
	var getDirection = function(p0, p1) {
		if (Math.abs(p1.x - p0.x) > Math.abs(p1.y - p0.y)) {
			return "x";
		} else if (Math.abs(p1.x - p0.x) <= Math.abs(p1.y - p0.y)) {
			return "y";
		}

	}
	var getPermission = function(event) {
		if ((event.type == "touchstart" && event.touches.length == 1) || (event.type == "mousedown" && event.button == 0)) {
			return true;
		}
	}
	var bindScroll = function(event) {
		var permission = getPermission(event);
		var that = this;
		var scrolling = function(event) {
			event.stopPropagation();
			event.preventDefault();
			if (that.animation.timeout == null) {
				if (that.direction !== null) {
					that.animation.dos(function() {
						//that.startPoint = that.endPoint;
						that.endPoint = getPoint(event);
						that.step = -that.endPoint[that.direction] + that.startPoint[that.direction];
						that.startPoint = that.endPoint;
						doScroll.call(that);
					});
				} else {
					that.animation.dos(function() {
						that.endPoint = getPoint(event);
						that.direction = getDirection(that.endPoint, that.startPoint);
					}, 30);
				}

			}
		}
		var doScroll = function() {
			var key = "scrollLeft";
			var tl = "left";
			var destination = this.step;
			var cb = this.scroll;
			if (this.direction == "y") {
				key = "scrollTop";
				tl = "top";
			}
			try {
				destination = this.node[key] + destination;
				if (this.scrollHeight[this.direction] < destination) {
					destination = this.scrollHeight[this.direction];
					cb = this.end;
				} else if (destination < 0) {
					destination = 0;
					cb = this.start;
				}
				this.node[key] = destination;
				this["scroll" + this.direction.toUpperCase()].style[tl] = this.node[key] * (1 + this.scale[this.direction]) + "px";
				for (var i = 0; i < cb.length; i++) {
					cb[i]();
				}
			} catch (e) {}

		}
		var scrollAuto = function() {
			var step = -1 * this.step / Math.abs(this.step);
			var that = this;
			if (((this.step + step) / this.step <= 0) || (this.step == 0)) {
				this.startPoint = null;
				this.endPoint = null;
				this.direction = null;
				return;
			} else {
				this.step += step;
			}
			doScroll.call(this);
			requestAnimationFrame(function() {
				scrollAuto.call(that);
			});
		}
		var removeScroll = function(event) {
			that.node.removeEventListener(that.type[0], scrolling, false);
			that.node.removeEventListener(that.type[2], removeScroll, false);
			that.node.removeEventListener(that.type[3], removeScroll, false);
			that.startPoint = that.endPoint;
			that.endPoint = getPoint(event);
			that.step = that.startPoint[that.direction] - that.endPoint[that.direction];
			that.animation.clear();
			scrollAuto.call(that);
		}
		if (permission) {
			this.startPoint = getPoint(event);
			this.node.addEventListener(this.type[0], scrolling, false);
			this.node.addEventListener(this.type[2], removeScroll, false);
			this.node.addEventListener(this.type[3], removeScroll, false);
		}
	}



	var scroll = function(option) {
		var that = this;
		this.animation = new animation();
		this.node = option.node;
		this.scale = {};
		this.scrollX = null;
		this.scrollY = null;
		this.isEnd = {
			x: false,
			y: false
		};
		this.direction = null;
		option.style = option.style || {
			x: "",
			y: ""
		};
		this.scrollHeight = {
			x: this.node.scrollWidth - this.node.offsetWidth,
			y: this.node.scrollHeight - this.node.offsetHeight
		}
		if (option.x) {
			option.style.x += "width:" + this.getLength("x") + "px;";
			this.scrollX = getScrollBar("x", option.style.x);
			this.node.appendChild(this.scrollX);
			this.node.style.overflowX = "hidden";
		}
		if (option.y) {
			option.style.y += "height:" + this.getLength("y") + "px;";
			this.scrollY = getScrollBar("y", option.style.y);
			this.node.appendChild(this.scrollY);
			this.node.style.overflowY = "hidden";
		}
		this.startPoint = null;
		this.endPoint = null;
		this.step = 0;
		this.node.style.position = "relative";
		this.type = document.hasOwnProperty("ontouchstart") ? eventType.touch : eventType.mouse;
		this.node.addEventListener(this.type[1], function(event) {
			bindScroll.call(that, event)
		}, false);
		for (var i = 0; i < events.length; i++) {
			this[events[i]] = [];
		}


	};
	scroll.prototype = {
		getLength: function(direction) {
			if (!direction) {
				return;
			}
			var scrollHeight = this.scrollHeight[direction];
			var offsetHeight = direction === "y" ? this.node.offsetHeight : this.node.offsetWidth;
			if (offsetHeight - scrollHeight > constant.length) {
				this.scale[direction] = 1;
				return offsetHeight - scrollHeight;
			} else {
				this.scale[direction] = (offsetHeight - constant.length) / scrollHeight;
				return constant.length
			}


		},
		getStep: function() {
			this.step = -this.endPoint[this.direction] + this.startPoint[this.direction];
			return this.step;
		},
		addEventListener: function(type, callBack) {
			if (this[type]) {
				this[type].push(callBack);
			}

		},
		removeEventListener: function(type, callBack) {
			if (this[type]) {
				for (var i = 0; i < this[type].length; i++) {
					if (this[type][i].toString().replace(/\s+/g, "") == callBack.toString().replace(/\s+/g, "")) {
						this[type].splice(i, 1);
					}
				}
			}
		}

	}
	window.iscroll = function(option) {
		return new scroll(option)
	};
})()