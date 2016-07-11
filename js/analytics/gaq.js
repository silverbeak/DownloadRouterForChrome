var printFake = function() {
  console.log('Analytics has been disabled');
}

var fakeGa = {
  event: function() { printFake() },
  social: function() { printFake() },
  exception: function() { printFake() }
};

var enableAnalytics = function() {
  var ga = new ExtGA({
    trackingId : "UA-66737805-1", // Your Tracking Id
    trackingDns : "download-router.com", // Domain name that you created for the profile
    appVersion : "0.0.7", // application Version
    appName : "Download Router", // application Name
    //getPref :  DownloadRouter.getPref, // (optional) If you want to use a custom function for localSettings
    //setPref : DownloadRouter.setPref  // (optional) If you want to use a custom function for localSettings
  });

  window.ga = ga;
};

var disableAnalytics = function() {
  window.ga = fakeGa;
};

var updateSettingsCallback = function(settings) {
  if (settings.allowAnonymousStatistics) enableAnalytics()
  else disableAnalytics()
}

addSettingsUpdateCallback(updateSettingsCallback);
readSettings(updateSettingsCallback);
