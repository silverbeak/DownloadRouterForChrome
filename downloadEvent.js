var myRoutes;
var myDownloads = {};
var mySettings;

var onRoutesRead = function(routes) {
  myRoutes = routes;
};

var downloadCallback = function(downloadItem, suggest) {
  var newFilename = downloadItem.filename;

  var routeKeys = Object.keys(myRoutes);
  var targetDirectory = '';

  for (var i = routeKeys.length - 1; i >= 0; i--) {
    if (!myRoutes[routeKeys[i]].enabled) continue;
    var myRegexp = new RegExp(myRoutes[routeKeys[i]].urlMatch);
    var match = myRegexp.exec(downloadItem.url);

    if (match !== null && typeof match[1] !== 'undefined') {
      targetDirectory = match[1];
      newFilename = match[1] + '/' + downloadItem.filename;
    }
  }

  myDownloads[downloadItem.id] = {
    targetDirectory: targetDirectory,
    filename: newFilename
  };

  suggest( {
    filename: newFilename
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
