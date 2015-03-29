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
	routeListHelper.cleanRouteList();
	routeListHelper.buildRouteList(routeList);
}

function readRoutesFromDbDefault() {
	addDbUpdateCallback(updateRouteList);
	readRoutesFromDb(updateRouteList);
}

document.addEventListener('DOMContentLoaded', readRoutesFromDbDefault);
