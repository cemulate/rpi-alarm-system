"use strict";

var childProcess = require('child_process');

var moment = require('moment');

const LON = false;
const LOFF = true;

class LightManager {
	constructor(pin) {
		this.pin = pin;
		this.val = LOFF;
		this.t = null;
		this._hz = -1;
	}

	set hz(hz) {
		console.log(moment().format("ddd hh:mmA"), "Setting light speed to " + hz.toString());
		this._hz = hz;
		if (this.t != null) {
			clearInterval(this.t);
			this.t = null;
		}
		if (this._hz > 0) {
			var i = 1000.0 / this._hz;
			this.t = setInterval(() => this.toggle(), i);
		}
	}

	get hz() {
		return this._hz;
	}

	toggle() {
		this.val = !this.val;
		var c = this.val ? 1 : 0;
		childProcess.execSync("gpio write 15 " + c.toString());
		console.log((this.val == LON) ? "Light changed: LON" : "Light changed: LOFF");
	}

	setLight(v) {
		this.val = !v;
		this.toggle();
	}

}

exports.LightManager = LightManager;
exports.LON = LON;
exports.LOFF = LOFF;
