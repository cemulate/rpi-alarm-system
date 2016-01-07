"use strict";

var express = require('express');
var bodyParser = require('body-parser');

var moment = require('moment');
var schedule = require('node-schedule');

var lightmanager = require('./lightmanager.js');

var app = express();

// Serve static files from the 'static' directory
app.use(express.static('static'));

// Parse request parameters into req.body
app.use(bodyParser.urlencoded());

// Light management
var nextTime = null;
var sTasks = [];
var manager = new lightmanager.LightManager(15);
var manualState = false;

var offsets = [60, 50, 40, 30];
var speeds = [1, 3, 10, 15];

var setupScheduleAtTime = function(t) {
	sTasks.map(x => x.cancel());

	if (t != null) {
		var dates = offsets.map(x => {
			var t2 = moment(t);
			t2.subtract(x, 'minutes');
			return t2.toDate();
		});
		sTasks = dates.map((d, i) => {
			return schedule.scheduleJob(d, () => {
				manager.hz = speeds[i];
			});
		});
		var last = schedule.scheduleJob(t.toDate(), () => {
			manager.hz = -1;
			manager.setLight(lightmanager.LOFF);
			nextTime = null;
		});
		sTasks.push(last);
	}
	console.log("Scheduled events.");
	console.log(sTasks);
}

// API

// Request parameters: next (momentjs object)
app.post('/setnext', function(req, res, next) {
	nextTime = (req.body.next == "") ? null : moment(req.body.next);
	setupScheduleAtTime(nextTime);
	res.send("OK");
});

app.get('/next', function(req, res, next) {
	res.send((nextTime == null) ? null : nextTime.toJSON());
});

// Parameters: state (boolean)
app.post('/manual', function(req, res, next) {
	manualState = (req.body.state == "true");
	manager.hz = -1;
	manager.setLight(manualState ? lightmanager.LON : lightmanager.LOFF);
	res.send("OK");
});

app.get('/manual', function(req, res, next) {
	res.send(manualState);
});

// Launch the app
var serverPort = 80;
var serverIPAddress = '0.0.0.0';

app.listen(serverPort, serverIPAddress, function() {
	console.log('Server running');
});
