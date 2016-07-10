var dateRegex = /.*?\$d\{(.*?)\}.*/g

function injectDate(targetDirectory) {
  var targetMatch = dateRegex.exec(targetDirectory);

  if (targetMatch) {
    return injectDate(targetDirectory.replace("$d{" + targetMatch[1] + "}", moment().format(targetMatch[1])));
  }

  return targetDirectory;
}
