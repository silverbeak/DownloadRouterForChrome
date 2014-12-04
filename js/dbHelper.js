var callbackList = [];

var onDbUpdate = function(changes, namespace) {
	readRoutesFromDb(function(routes) {
		for (var i = callbackList.length - 1; i >= 0; i--) {
			callbackList[i](routes);
		}	
	});
};

function addDbUpdateCallback(callback) {
	callbackList.push(callback);
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

function saveRoute(routeName, urlMatch, fileNameMatch, onSave) {
	var newRoute = {
		'urlMatch': urlMatch,
		'filenameMatch': fileNameMatch
	};

	readRoutesFromDb(function(routes) {
		routes[routeName] = newRoute;
		chrome.storage.local.set({'routes': routes}, onSave);
	});
}

function saveAllRoutes(routes) {
	chrome.storage.local.set({'routes': routes}, function() { console.log('Yes, it saved something');});
}

function deleteRoute(routeName) {
	readRoutesFromDb(function(routes) {
		console.log('Will delete! ', routes[routeName], routeName);
		delete routes[routeName];
		console.log('Routes are now', routes);
		saveAllRoutes(routes);
	});
}

chrome.storage.onChanged.addListener(onDbUpdate);