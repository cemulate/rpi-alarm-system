function refreshManualState() {
	$.get('/manual', function(data) {
		$("#manualSwitch").prop("checked", data);
	});
}

function refreshDate() {
	$.get('/next', function(data) {
		console.log(data);
		if (data == "") {
			$("#nextTime").text("OFF");
		} else {
			$("#nextTime").text(moment(data).format("ddd, hA"));
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

		console.log(chosen.toDate());

		$.post('/setnext', {
			next: chosen.toJSON()
		}, function(data) {
			refreshDate();
		});
	});

	$("#manualSwitch").on("click", function() {
		var b = $("#manualSwitch").prop("checked");
		console.log(b);
		$.post('/manual', {
			state: b
		});
	});

	refreshDate();
	refreshManualState();

});
