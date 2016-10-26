/*!
betajs-shims - v0.0.7 - 2016-10-17
Copyright (c) Oliver Friedmann
Apache-2.0 Software License.
*/
(function() {
	if (this.Map !== undefined)
		return;

	this.Map = function() {
		this.clear();
	};

	this.Map.prototype.set = function(key, value) {
		if (key in this.__data)
			this.__data[key].value = value;
		else {
			var obj = {
				key : key,
				value : value,
				prev : this.__last,
				next : null
			};
			this.__data[key] = obj;
			if (this.__last)
				this.__last.next = obj;
			else
				this.__first = obj;
			this.__last = obj;
			this.size++;
		}
		return this;
	};

	this.Map.prototype.get = function(key) {
		return key in this.__data ? this.__data[key].value : undefined;
	};

	this.Map.prototype.has = function(key) {
		return key in this.__data;
	};

	this.Map.prototype['delete'] = function(key) {
		var obj = this.__data[key];
		if (obj) {
			delete this.__data[key];
			this.size--;
			if (obj.prev)
				obj.prev.next = obj.next;
			else
				this.__first = obj.next;
			if (obj.next)
				obj.next.prev = obj.prev;
			else
				this.__last = obj.prev;
		}
		return this;
	};

	this.Map.prototype.clear = function() {
		this.__data = {};
		this.__first = null;
		this.__last = null;
		this.size = 0;
		return this;
	};

	this.Map.prototype.keys = function() {
		return {
			current : this.__first,
			next : function() {
				var current = this.current;
				if (!current)
					return {
						done : true
					};
				this.current = current.next;
				return {
					done : false,
					value : current.key
				};
			}
		};
	};

	this.Map.prototype.values = function() {
		return {
			current : this.__first,
			next : function() {
				var current = this.current;
				if (!current)
					return {
						done : true
					};
				this.current = current.next;
				return {
					done : false,
					value : current.value
				};
			}
		};
	};

	this.Map.prototype.entries = function() {
		return {
			current : this.__first,
			next : function() {
				var current = this.current;
				if (!current)
					return {
						done : true
					};
				this.current = current.next;
				return {
					done : false,
					value : [ current.key, current.value ]
				};
			}
		};
	};

	this.Map.prototype.forEach = function(callback, context) {
		var current = this.__first;
		while (current) {
			callback.call(context, current.value, current.key, this);
			current = current.next;
		}
		return this;
	};

}).call((function () {
	try {
		return window;
	} catch (e) {
		try {
			return global;
		} catch (e) {
			return self;
		}
	}
}).call(this));

(function() {
	if (!this)
		return;
	this.preventDefault = this.preventDefault || function () {
		this.returnValue = false;
	};
	this.stopPropagation = this.stopPropagation || function () {
		this.cancelBubble=true;
	};	
}).call((function () {
	try {
		return Event.prototype;
	} catch (e) {
		return null;
	}
}).call(this));

(function() {
	if (!this)
		return;
	var eventMap = {
		"DOMContentLoaded": {
			"event": "onreadystatechange",
			"wrapper": function (wrapper) {
				return function (e) {
					if (document.readyState=="complete")
						wrapper(e);
				};
			}
		}
	};
	this.addEventListener = this.addEventListener || function (type, listener, useCapture) {
		var self = this;
		var wrapper = function (e) {
			e.target = e.srcElement || self;
	        e.currentTarget = self;
	        if (typeof listener.handleEvent != 'undefined')
	            listener.handleEvent(e);
	        else
	            listener.call(self,e);
        };
        if (eventMap[type])
        	wrapper = eventMap[type].wrapper(wrapper);
        this.attachEvent("on" + (eventMap[type] ? eventMap[type].event : type), wrapper);
        this.__eventlisteners = this.__eventlisteners || {};
        this.__eventlisteners[type] = this.__eventlisteners[type] || [];
        this.__eventlisteners[type].push({listener:listener, wrapper:wrapper});
	};
	this.removeEventListener = this.removeEventListener || function (type, listener, useCapture) {
		if (this.__eventlisteners && this.__eventlisteners[type]) {
			for (var i = 0; i < this.__eventlisteners[type].length; ++i) {
				if (this.__eventlisteners[type][i].listener === listener) {
		            this.detachEvent("on" + (eventMap[type] ? eventMap[type].event : type), this.__eventlisteners[type][i].wrapper);
		            this.__eventlisteners[type].splice(i, 1);
		            return;
				}
			}
		}
	};
	this.dispatchEvent = this.dispatchEvent || function (eventObject) {
		return this.fireEvent("on" + eventObject.type, eventObject);
	};
}).call((function () {
	try {
		return Element.prototype;
	} catch (e) {
		return null;
	}
}).call(this));
	
(function() {
	if (!this)
		return;
	this.addEventListener = this.addEventListener || Element.prototype.addEventListener;
	this.removeEventListener = this.removeEventListener || Element.prototype.removeEventListener;
	this.dispatchEvent = this.dispatchEvent || Element.prototype.dispatchEvent;
}).call((function () {
	try {
		return HTMLDocument.prototype;
	} catch (e) {
		return null;
	}
}).call(this));

(function() {
	if (!this)
		return;
	this.addEventListener = this.addEventListener || Element.prototype.addEventListener;
	this.removeEventListener = this.removeEventListener || Element.prototype.removeEventListener;
	this.dispatchEvent = this.dispatchEvent || Element.prototype.dispatchEvent;
}).call((function () {
	try {
		return Window.prototype;
	} catch (e) {
		return null;
	}
}).call(this));
