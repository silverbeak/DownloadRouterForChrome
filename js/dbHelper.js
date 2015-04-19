var callbackList = [];
var settingsCallbackList = [];

var sortRoutes = function(routes) {
	var arr = [];
	for (var key in routes) {
		if (routes.hasOwnProperty(key)) {
			arr.push(routes[key]);
		}
	}

	return arr.sort(function(a, b) { return a.prio - b.prio; });
};

var onDbUpdate = function(changes, namespace) {
	var updateKeys = Object.keys(changes);

	if(updateKeys.indexOf('settings') !== -1) {
		$.each(settingsCallbackList, function(settingsCallback) {
			this(changes.settings.newValue);
		});
	}

	if(updateKeys.indexOf('routes') !== -1) {
		readRoutesFromDb(function(routes) {
			var routeList = sortRoutes(routes);
			for (var i = callbackList.length - 1; i >= 0; i--) {
				callbackList[i](routeList);
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
				'name': 'Default',
				'urlMatch': "^.*\\:[\\/]*[w\\.]*([\\w\\.]*)\\/",
				'filenameMatch': "",
				'enabled': true,
				'prio': 0,
				'targetDirectory': "$1"
			}
		}
	}, function(items) {
		callback(sortRoutes(items.routes));
	});
}

function readSettings(callback) {
	chrome.storage.local.get({'settings': {
		'showNotificationOnDownload': true
	}}, function(items) {
		callback(items.settings);
	});
}

function saveRoute(routeName, urlMatch, fileNameMatch, targetDirectory, prio, onSave, index) {
	var newRoute = {
		'name': routeName,
		'urlMatch': urlMatch,
		'filenameMatch': fileNameMatch,
		'prio': prio,
		'enabled': true,
		'targetDirectory': targetDirectory
	};


	readRoutesFromDb(function(routes) {
		if (typeof index === 'undefined' || index === -1) {
			// New route, just push to object
			routes.push(newRoute);
		} else {
			// Update existing route
			routes[index] = newRoute;
		}

		chrome.storage.local.set({'routes': routes}, onSave(routeName));
	});
}

function setRouteEnabled(index, value) {
	readRoutesFromDb(function(routes) {
		routes[index].enabled = value;
		saveAllRoutes(routes);
	});
}

function saveAllRoutes(routes) {
	chrome.storage.local.set({'routes': routes}, function() {});
}

function saveSettings(settings, callback) {
	chrome.storage.local.set({'settings': settings}, callback);
}

function deleteRoute(index) {
	readRoutesFromDb(function(routes) {
		routes.splice(index, 1);
		saveAllRoutes(routes);
	});
}

chrome.storage.onChanged.addListener(onDbUpdate);
// chrome.storage.local.clear(function() { console.log('CLEARED!'); });