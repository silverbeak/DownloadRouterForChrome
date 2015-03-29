'use strict';

var buildSingleRouteElement = function(index, route) {
	var newElement = "";
	newElement += '<div class="routesection"><dt class="routeheader">';
	newElement += route.name;
	newElement += '</dt><dd><a class="btn btn-default" id="deleteroute';
	newElement += index;
	newElement += '">Delete</a></dd>';
	newElement += '<dt class="key">URL matches</dt><dd class="value">';
	newElement += route.urlMatch;
	newElement += '</dd><dt class="key">Enabled</dt><dd class="value">';
	newElement += '<input id="enabledcheckbox';
	newElement += index;
	newElement += '" type="checkbox" ';
	if (route.enabled) {
		newElement += 'checked';
	}
	newElement += '></input>';
	newElement += '</dd><dt class="key">';
	newElement += 'Target Directory';
	newElement += '</dt><dd class="value">';
	newElement += route.targetDirectory;
	newElement += '</dd></div>';
	return newElement;
};

var addActionsToElements = function(index, route) {
	$('#enabledcheckbox' + index).click(function(event) {
		setRouteEnabled(index, this.checked);
		var action;
		if (this.checked) { action = 'enabled'; }
		else { action = 'disabled'; }
		$.growl({ title: "Route change", message: "Route " + route.name + " " + action + "." });
	});
	$('#deleteroute' + index).click(function(event) {
		deleteRoute(index);
		$.growl({ title: "Deleted!", message: "Route " + route.name + " deleted!" });
	});
};

var routeListHelper = {
	buildRouteList: function(routeList) {
		$('#routelist').html('');
		var newElement = '<div class="allroutes">';
		$.each(routeList, function(index, route) {
			newElement += buildSingleRouteElement(index, route);
		});

		newElement += '';
		newElement += '</div>';
		$('#routelist').append(newElement);

		$.each(routeList, addActionsToElements);
	},

	cleanRouteList: function() {
		$('#routelist').html('');
	}
}