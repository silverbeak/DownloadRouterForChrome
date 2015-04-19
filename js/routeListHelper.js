'use strict';

var editRouteTemplate = null;
$.get('./templates/editroute.html', function(routeTemplate) {
	editRouteTemplate = routeTemplate;
});

var saveRouteBtnClick = function(index) {
	return function() {
		$("#save").click(function() {
			var routeName = $("#newroutename").val();
			var urlMatch = $("#urltext").val();
			var targetDirectory = $("#targetdirectorytext").val();
			var filenameMatch = null;

			if (typeof routeName !== 'undefined' && routeName !== '') {
				saveRoute(routeName, urlMatch, filenameMatch, targetDirectory, 1, onSaveFunction, index);
			}
			$.modal.close();
		});
	}
};

var editRoute = function(route) {
	var tpl = editRouteTemplate;
	tpl = tpl.replace('$routename$', route.name);
	tpl = tpl.replace('$urlMatch$', route.urlMatch);
	tpl = tpl.replace('$targetDirectory$', route.targetDirectory);
	return tpl;
};

var emptyRoute = { name: '', targetDirectory: '', urlMatch: '' };

var editTemplate = function(index, route) {
	if (typeof route === 'undefined') {
		return editRoute(emptyRoute);
	} else {
		return editRoute(route);
	}
};

var buildSingleRouteElement = function(index, route) {
	var newElement = "";
	newElement += '<div class="routesection"><dt class="routeheader">';
	newElement += route.name;
	newElement += '</dt><dd><a class="btn btn-default" id="deleteroute';
	newElement += index;
	newElement += '">Delete</a>';

	newElement += ' <a class="btn btn-default" data-route-index="' + index + '"" id="editroute';
	newElement += index;
	newElement += '">Edit</a></dd>';
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

	$('#editroute' + index).click(function(event) {
		$.modal(editTemplate(index, route), {
			onShow: saveRouteBtnClick(index)
		});
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