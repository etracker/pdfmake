'use strict';

function TraversalTracker() {
	this.events = {};
}

TraversalTracker.prototype.startTracking = function (event, callback) {
	var callbacks = this.events[event] || (this.events[event] = []);

	if (callbacks.indexOf(callback) < 0) {
		callbacks.push(callback);
	}
};

TraversalTracker.prototype.stopTracking = function (event, callback) {
	var callbacks = this.events[event];

	if (!callbacks) {
		return;
	}

	var index = callbacks.indexOf(callback);
	if (index >= 0) {
		callbacks.splice(index, 1);
	}
};

TraversalTracker.prototype.emit = function (event) {
	var args = Array.prototype.slice.call(arguments, 1);
	var callbacks = this.events[event];

	if (!callbacks) {
		return;
	}

	callbacks.forEach(function (callback) {
		callback.apply(this, args);
	});
};

TraversalTracker.prototype.auto = function (event, cb, innerBlock) {
	if(!Array.isArray(event)) {
		event = [event];
	}
	
	event.forEach(eventName => this.startTracking(eventName, cb));
	innerBlock();
	event.forEach(eventName => this.stopTracking(eventName, cb));
};

module.exports = TraversalTracker;
