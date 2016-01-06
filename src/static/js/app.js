function refreshManualState() {
	$.get('/manual', function(data) {
		$("#manualSwitch").prop("checked", data);
	});
}

function refreshDate() {
	$.get('/next', function(data) {
		if (data == "") {
			$("#nextTime").text("OFF");
		} else {
			$("#nextTime").text(moment(data).format("ddd, h:mm A"));
		}
	});
}

$(document).ready(function() {

	$("#clearButton").on("click", function() {
		$.post('/setnext', {
			next: null
		}, function(data) {
			refreshDate();
		});
	});

	$("#goButton").on("click", function() {
		var hour = parseInt($("#hourSelect").val());
		var minute = parseInt($("#minuteSelect").val());

		var now = moment();
		var dayStart = moment().startOf('day');
		var chosen = dayStart.add(hour, 'hours').add(minute, 'minutes');

		while ((chosen - now) < 0) chosen.add(12, 'hours');

		$.post('/setnext', {
			next: chosen.toJSON()
		}, function(data) {
			refreshDate();
		});
	});

	$("#manualSwitch").on("click", function() {
		var b = $("#manualSwitch").prop("checked");
		$.post('/manual', {
			state: b
		});
	});

	refreshDate();
	refreshManualState();

});
