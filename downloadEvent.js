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

  $.each(myRoutes, function(index, route) {
    if (route.enabled) {
      var myRegexp = new RegExp(route.urlMatch);
      var match = myRegexp.exec(downloadItem.url);

      if (match !== null && typeof match[1] !== 'undefined') {
        var targetMatch = route.targetDirectory.match(/\$\d/g);
        var targetMatchCount = 0;
        if (targetMatch) {
          targetMatchCount = targetMatch.length;
        }

        targetDirectory = route.targetDirectory;

        for (var i = 0; i <= targetMatchCount; i++) {
            console.log("This is a match", i, match[i]);
            targetDirectory = targetDirectory.replace("$" + i, match[i]);
        }

        if (targetDirectory !== '') {
          newFilename = targetDirectory + '/' + downloadItem.filename;
        } else {
          newFilename = downloadItem.filename;
        }
      }
    }
  });

  myDownloads[downloadItem.id] = {
    targetDirectory: targetDirectory,
    filename: newFilename
  };

  console.log('Suggesting filename', newFilename);

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
