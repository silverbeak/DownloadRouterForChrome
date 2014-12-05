var onSaveFunction = function(routeName) {
    $.growl({ title: "Saved!", message: "Route " + routeName + " saved!" });
    readRoutesFromDb(updateRouteList);
};

$(function() {

	$("#newroute").hide();

	$("#newroutebtn").click(function() {
		$("#newroute").toggle();
	});

	$("#save").click(function() {
		var routeName = $("#newroutename").val();
		var urlMatch = $("#urltext").val();
		var filenameMatch = $("#filenametext").val();

		if (typeof routeName !== 'undefined' && routeName !== '') {
			saveRoute(routeName, urlMatch, filenameMatch, onSaveFunction);
		}
		$("#newroute").hide();
	});
});

function updateRouteList(routeList) {
	$('#routelist').html('');
	var routeNames = Object.keys(routeList);
	var newElement = '<table class="table"><tbody>';
	for (var route in routeNames) {
		var routeName = routeNames[route];
		newElement += '<tr  style="border-top: 2px solid"><td><b>';
		newElement += routeName;
		newElement += '</b></td><td><a class="btn btn-default" id="';
		newElement += route;
		newElement += '">Delete</a></td></tr>';
		// newElement += '<tr><td>Filename matches</td><td>';
		// newElement += routeList[routeName].filenameMatch;
		// newElement += '</td></tr>';
		newElement += '<tr><td>URL matches</td><td>';
		newElement += routeList[routeName].urlMatch;
		newElement += '</td></tr>';
	}
	newElement += '</tbody></table>';
	$('#routelist').append(newElement);

	$.each(routeNames, function(index, value) {
		$('#' + index).click(function(event) {
			deleteRoute(value);
			$.growl({ title: "Deleted!", message: "Route " + value + " deleted!" });
		});
	});
}

function readRoutesFromDbDefault() {
	addDbUpdateCallback(updateRouteList);
	readRoutesFromDb(updateRouteList);
}

document.addEventListener('DOMContentLoaded', readRoutesFromDbDefault);
