function Observer() {
	this.listeners = {};
}
Observer.prototype = {
	constructor: Observer,
	sub: function(type, fn) {
		this.listeners[type] = this.listeners[type] || [];
		this.listeners[type].push(fn);
	},
	one: function(type, fn) {
		this.sub(type, function tmp(ev) {
			fn.call(this, ev);
			this.unbind(type, tmp);
		});
	},
	pub: function(type, ev) {
		if (this.listeners && this.listeners[type]) {
			for (var i = 0; i < this.listeners[type].length; i++) {
				this.listeners[type][i].call(this, ev);
			}
		}
	},
	unbind: function(type, fn) {
		if (this.listeners && this.listeners[type]) {
			if (typeof fn !== 'function') {
				delete this.listeners[type];
			} else {
				for (var i = 0; i < this.listeners[type].length; i++) {
					if (this.listeners[type][i] === fn) {
						this.listeners[type].splice(i--, 1);
					}
				}
			}
		}
	}
}



export const observer = new Observer();
