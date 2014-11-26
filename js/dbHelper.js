var routes;

function readRoutesFromDb(callback) {
	chrome.storage.sync.get({
		'routes': {}
	}, function(items) {
		console.log('Fetched', items);
		routes = items;
		callback(routes.routes);
	});
}

// Saves options to chrome.storage
function saveRoute(routeName, urlMatch, fileNameMatch, onSave) {
	var newRoute = {
		'urlMatch': urlMatch,
		'filenameMatch': fileNameMatch
	};

	routes.routes[routeName] = newRoute;

	console.log('Saving ', routes);

	chrome.storage.sync.set(routes, onSave);
}

var clearAll = function() {
	chrome.storage.sync.clear();
};

function saveAllRoutes(routes) {
	clearAll();
	var routeKeys = Object.keys(routes);
	for (var i = routeKeys.length - 1; i >= 0; i--) {
		var newRoute = routes[routeKeys[i]];
		saveRoute(routeKeys[i], newRoute.urlMatch, newRoute.fileNameMatch, function() { console.log('Saved ', newRoute); });
	}
}