var onSaveFunction = function() {
    // Update status to let user know options were saved.
    $('#status').html('Saved ');
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

		// alert("Saving " + routeName + ", " + urlMatch + ", " + filenameMatch);
		saveRoute(routeName, urlMatch, filenameMatch, onSaveFunction);
	});
});

function updateRouteList(routeList) {
	$('#routelist').html('');
	var routeNames = Object.keys(routeList);
	console.log('Routekeys: ', routeNames);
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


	for (var route in routeNames) {
		$('#' + route).click(function(event) {
			console.log('Will delete! ', event);
			readRoutesFromDb(function(routes) {
				var routeKeys = Object.keys(routes);
				delete routes[routeKeys[route]];
				saveAllRoutes(routes);

				// TODO: Possible race condition here. Implement with callback functionality instead.
				readRoutesFromDb(updateRouteList);
			});
		});
	}
}

function readRoutesFromDbDefault() {
	readRoutesFromDb(updateRouteList);
}

document.addEventListener('DOMContentLoaded', readRoutesFromDbDefault);
