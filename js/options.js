var mySettings = {};

var onSaveFunction = function(routeName) {
    $.growl({ title: "Saved!", message: "Route " + routeName + " saved!" });
    readRoutesFromDb(updateRouteList);
};

var refreshSettingsOnPage = function() {
	$("#shownotificationcheckbox").prop('checked', mySettings.showNotificationOnDownload);
};

var settingsUpdatedFunc = function(newValue) {
	$.each(Object.keys(newValue), function() {
		mySettings[this] = newValue[this];
	});
	refreshSettingsOnPage();
};

$(function() {

	$("#newroute").hide();

	$("#newroutebtn").click(function() {
		$("#newroute").toggle();
	});

	$("#save").click(function() {
		var routeName = $("#newroutename").val();
		var urlMatch = $("#urltext").val();
		var targetDirectory = $("#targetdirectorytext").val();
		var filenameMatch = null;

		if (typeof routeName !== 'undefined' && routeName !== '') {
			saveRoute(routeName, urlMatch, filenameMatch, targetDirectory, 1, onSaveFunction);
		}
		$("#newroutename").val("");
		$("#urltext").val("");
		$("#filenametext").val("");
		$("#targetdirectorytext").val("");
		$("#newroute").hide();
	});

	$("#shownotificationcheckbox").click(function() {
		mySettings.showNotificationOnDownload = this.checked;
		saveSettings(mySettings, function() {});
	});

	addSettingsUpdateCallback(settingsUpdatedFunc);
	readSettings(settingsUpdatedFunc);
});

function updateRouteList(routeList) {
	console.log('Got this list:', routeList);
	$('#routelist').html('');
	var newElement = '<div class="allroutes">';
	$.each(routeList, function(index, route) {
		console.log('IV', index, route);
		var routeName = route.name;
		newElement += '<div class="routesection"><dt class="routeheader">';
		newElement += route.name;
		newElement += '</dt><dd><a class="btn btn-default" id="deleteroute';
		newElement += index;
		newElement += '">Delete</a></dd>';
		// newElement += '<tr><td>Filename matches</td><td>';
		// newElement += routeList[routeName].filenameMatch;
		// newElement += '</td></tr>';
		newElement += '<dt class="key">URL matches</dt><dd class="value">';
		newElement += route.urlMatch;
		newElement += '</dd><dt class="key">Enabled</dt><dd class="value">';
		newElement += '<input id="enabledcheckbox';
		newElement += index;
		newElement += '" type="checkbox" ';
		console.log("Checked?", route.enabled);
		if (route.enabled) {
			newElement += 'checked';
		}
		newElement += '></input>';
		newElement += '</dd><dt class="key">';
		newElement += 'Target Directory';
		newElement += '</dt><dd class="value">';
		newElement += route.targetDirectory;
		newElement += '</dd></div>';
	});
	newElement += '';
	newElement += '</div>';
	$('#routelist').append(newElement);

	$.each(routeList, function(index, value) {
		console.log('Value', value.name);
		$('#enabledcheckbox' + index).click(function(event) {
			setRouteEnabled(index, this.checked);
			var action;
			if (this.checked) { action = 'enabled'; }
			else { action = 'disabled'; }
			$.growl({ title: "Route change", message: "Route " + value.name + " " + action + "." });
		});
		$('#deleteroute' + index).click(function(event) {
			deleteRoute(index);
			$.growl({ title: "Deleted!", message: "Route " + value.name + " deleted!" });
		});
	});
}

function readRoutesFromDbDefault() {
	addDbUpdateCallback(updateRouteList);
	readRoutesFromDb(updateRouteList);
}

document.addEventListener('DOMContentLoaded', readRoutesFromDbDefault);
