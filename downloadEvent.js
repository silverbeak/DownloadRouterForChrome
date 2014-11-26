var myRoutes;

var onRoutesRead = function(routes) {
  myRoutes = routes;
};

var downloadCallback = function(downloadItem, suggest) {
  var newFilename = downloadItem.filename;

  var routeKeys = Object.keys(myRoutes);

  for (var i = routeKeys.length - 1; i >= 0; i--) {
    var myRegexp = new RegExp(myRoutes[routeKeys[i]].urlMatch);
    var match = myRegexp.exec(downloadItem.url);

    if (match !== null && typeof match[1] !== 'undefined') {
      newFilename = match[1] + '/' + downloadItem.filename;
    }
  }

  suggest( {
    filename: newFilename
  });
};

readRoutesFromDb(onRoutesRead);
chrome.downloads.onDeterminingFilename.addListener(downloadCallback);
