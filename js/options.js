var mySettings = {};

var onSaveFunction = function (routeName) {
	$.growl({ title: "Saved!", message: "Route " + routeName + " saved!" });
	readRoutesFromDb(updateRouteList);
};

var refreshSettingsOnPage = function () {
	$("#shownotificationcheckbox").prop('checked', mySettings.showNotificationOnDownload);
	$("#allowanonymousstatistics").prop('checked', mySettings.allowAnonymousStatistics);
};

var settingsUpdatedFunc = function (newValue) {
	$.each(Object.keys(newValue), function () {
		mySettings[this] = newValue[this];
	});
	refreshSettingsOnPage();
};

$(function () {

	$('#newroutebtn').click(function (event) {
		$.modal(editTemplate(-1, emptyRoute), {
			onShow: saveRouteBtnClick(-1)
		});
	});

	$("#shownotificationcheckbox").click(function () {
		mySettings.showNotificationOnDownload = this.checked;
		saveSettings(mySettings, function () { });
	});

	$("#allowanonymousstatistics").click(function () {
		mySettings.allowAnonymousStatistics = this.checked;
		saveSettings(mySettings, function () { });
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
