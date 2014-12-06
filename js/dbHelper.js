var callbackList = [];
var settingsCallbackList = [];

var onDbUpdate = function(changes, namespace) {
	var updateKeys = Object.keys(changes);

	if(updateKeys.indexOf('settings') !== -1) {
		$.each(settingsCallbackList, function(settingsCallback) {
			this(changes.settings.newValue);
		});
	}

	if(updateKeys.indexOf('routes') !== -1) {
		readRoutesFromDb(function(routes) {
			for (var i = callbackList.length - 1; i >= 0; i--) {
				callbackList[i](routes);
			}
		});
	}
};

function addDbUpdateCallback(callback) {
	callbackList.push(callback);
}

function addSettingsUpdateCallback(callback) {
	settingsCallbackList.push(callback);
}

function readRoutesFromDb(callback) {
	chrome.storage.local.get({
		'routes': {
			'Any Domain': {
				'urlMatch': "^.*\\:[\\/]*[w\\.]*([\\w\\.]*)\\/",
				'filenameMatch': ""
			}
		}
	}, function(items) {
		callback(items.routes);
	});
}

function readSettings(callback) {
	chrome.storage.local.get({'settings': {
		'showNotificationOnDownload': true
	}}, function(items) {
		callback(items.settings);
	});
}

function saveRoute(routeName, urlMatch, fileNameMatch, onSave) {
	var newRoute = {
		'urlMatch': urlMatch,
		'filenameMatch': fileNameMatch
	};

	readRoutesFromDb(function(routes) {
		routes[routeName] = newRoute;
		chrome.storage.local.set({'routes': routes}, onSave(routeName));
	});
}

function saveAllRoutes(routes) {
	chrome.storage.local.set({'routes': routes}, function() { console.log('Yes, it saved something');});
}

function saveSettings(settings, callback) {
	chrome.storage.local.set({'settings': settings}, callback);
}

function deleteRoute(routeName) {
	readRoutesFromDb(function(routes) {
		delete routes[routeName];
		saveAllRoutes(routes);
	});
}

chrome.storage.onChanged.addListener(onDbUpdate);