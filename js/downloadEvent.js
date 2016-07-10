var myRoutes;
var myDownloads = {};
var mySettings;

var onRoutesRead = function(routes) {
  myRoutes = routes;
};

var applyRoute = function(downloadRoute, url) {
  var target = url.match(new RegExp(downloadRoute.urlMatch));

  var targetMatch = downloadRoute.targetDirectory.match(/\$\d/g);
  var targetMatchCount = 0;
  if (targetMatch) {
    targetMatchCount = targetMatch.length;
  }

  targetDirectory = downloadRoute.targetDirectory;

  for (var i = targetMatchCount; i >= 0; i--) {
      targetDirectory = targetDirectory.replace("$" + i, target[i]);
  }

  return targetDirectory;
}

var isRouteMatch = function(downloadItemUrl, route) {
  if (!route.enabled) return false;

  var myRegexp = new RegExp(route.urlMatch);
  var match = myRegexp.exec(downloadItemUrl);

  return (match !== null && typeof match[1] !== 'undefined')
}

var downloadCallback = function(downloadItem, suggest) {
  var newFilename = downloadItem.filename;

  var targetDirectory = '';

  var foundRoute = _.find(myRoutes, isRouteMatch.bind(this, downloadItem.url));

  if (foundRoute) {
    targetDirectory = applyRoute(foundRoute, downloadItem.url);
    targetDirectory = injectDate(targetDirectory);
  }

  myDownloads[downloadItem.id] = {
    targetDirectory: targetDirectory,
    filename: newFilename
  };

  suggest( {
    filename: targetDirectory + '/' + newFilename
  });
};

var changeCallback = function(downloadDelta) {
  if (mySettings.showNotificationOnDownload && downloadDelta.state && downloadDelta.state.current === 'complete') {
    var thisDownload = myDownloads[downloadDelta.id];
    if (thisDownload) {
      var opt = {
        type: "basic",
        title: "Downloading",
        message: "'" + thisDownload.filename + "' finished downloading to '" + thisDownload.targetDirectory + "'",
        iconUrl: "./img/icon.png"
      };
      chrome.notifications.create('', opt, function() {});

    }
  }
};

var updateSettingsCallback = function(settings) { mySettings = settings; };

addSettingsUpdateCallback(updateSettingsCallback);
addDbUpdateCallback(onRoutesRead);
readRoutesFromDb(onRoutesRead);
readSettings(updateSettingsCallback);
chrome.downloads.onDeterminingFilename.addListener(downloadCallback);
chrome.downloads.onChanged.addListener(changeCallback);
