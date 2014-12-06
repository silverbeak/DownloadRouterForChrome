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
		//var filenameMatch = $("#filenametext").val();
		var filenameMatch = null;

		if (typeof routeName !== 'undefined' && routeName !== '') {
			saveRoute(routeName, urlMatch, filenameMatch, onSaveFunction);
		}
		$("#newroutename").val("");
		$("#urltext").val("");
		$("#filenametext").val("");
		$("#newroute").hide();
	});
});

function updateRouteList(routeList) {
	$('#routelist').html('');
	var routeNames = Object.keys(routeList);
	var newElement = '<div class="allroutes">';
	for (var route in routeNames) {
		var routeName = routeNames[route];
		newElement += '<div class="routesection"><dt class="routeheader">';
		newElement += routeName;
		newElement += '</dt><dd><a class="btn btn-default" id="';
		newElement += route;
		newElement += '">Delete</a></dd>';
		// newElement += '<tr><td>Filename matches</td><td>';
		// newElement += routeList[routeName].filenameMatch;
		// newElement += '</td></tr>';
		newElement += '<dt class="key">URL matches</dt><dd class="value">';
		newElement += routeList[routeName].urlMatch;
		newElement += '</dd></div>';
	}
	newElement += '';
	newElement += '</div>';
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
