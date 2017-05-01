var map;

var directionsService;
var directionsDisplay;
var polyline;
var responseActualRoute;

/**
 * Inicializa el mapa, calcula la ruta segun el inicio y el fin que le
 * indiquemos y nos añade la altura.
 */
function initMap() {
	map = new google.maps.Map(document.getElementById('mapa'), {
		mapTypeControl : false,
		center : {
			lat : -33.8688,
			lng : 151.2195
		},
		zoom : 13
	});

	var origin_place_id = null;
	var destination_place_id = null;
	var travel_mode = google.maps.TravelMode.DRIVING;

	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer({
		draggable : true, // Nos permite modificar los puntos de una ruta
		map : map
	});

	var origin_input = document.getElementById('origin-input');
	var destination_input = document.getElementById('destination-input');
	var modes = document.getElementById('mode-selector');

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

	var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
	origin_autocomplete.bindTo('bounds', map);
	var destination_autocomplete = new google.maps.places.Autocomplete(
			destination_input);
	destination_autocomplete.bindTo('bounds', map);
	var origin_location = null;
	var destination_location = null;

	function expandViewportToFitPlace(map, place) {
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
	}

	origin_autocomplete.addListener('place_changed', function() {
		var place = origin_autocomplete.getPlace();
		if (!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
		}
		expandViewportToFitPlace(map, place);

		// If the place has a geometry, store its place ID and route if we have
		// the other place ID
		origin_place_id = place.place_id;
		origin_location = place.geometry.location;
		route(origin_place_id, destination_place_id, travel_mode);
	});

	destination_autocomplete.addListener('place_changed', function() {
		var place = destination_autocomplete.getPlace();
		if (!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
		}
		expandViewportToFitPlace(map, place);

		// If the place has a geometry, store its place ID and route if we have
		// the other place ID
		destination_place_id = place.place_id;
		destination_location = place.geometry.location;
		route(origin_place_id, destination_place_id, travel_mode);

		var path = [ origin_location, destination_location ];

		// Draw the path, using the Visualization API and the Elevation service.
		displayPathElevation(path);

	});

	directionsDisplay.addListener('directions_changed', function() {
		computeTotalDistance(directionsDisplay.getDirections());
	});

	var defaultResponse = $('#jsonMapa').val();
	var objeto = JSON.parse(defaultResponse);
	setRoute(objeto);
}

/**
 * Dibuja una ruta determinada en el mapa, dado el origen, los puntos intermedios y el destino.
 */
function setRoute(actualRoute)
{
    var wp = [];
    for(var i=0;i<actualRoute.waypoints.length;i++)
        wp[i] = {'location': new google.maps.LatLng(actualRoute.waypoints[i][0], actualRoute.waypoints[i][1]),'stopover':false }
         
    directionsService.route({'origin':new google.maps.LatLng(actualRoute.start.lat,actualRoute.start.lng),
    'destination':new google.maps.LatLng(actualRoute.end.lat,actualRoute.end.lng),
    'waypoints': wp,
    'travelMode': google.maps.DirectionsTravelMode.DRIVING},function(res,sts) {
        if(sts=='OK')directionsDisplay.setDirections(res);
    })
    var locations = [];
    var cont=0;
    for(var i=0;i<directionsDisplay.directions.routes[0].legs.lenght;i++){
    	for(var j=0;j<directionsDisplay.directions.routes[0].legs[i].steps.lenght;j++){
    		locations[cont]=directionsService.routes[0].legs[i].steps[j].path;
    		cont=cont+1;
    	}
    }
    displayPathElevation(locations);
}

/**
 * Calcula la ruta y la dibuja en el mapa
 */
function route(origin_place_id, destination_place_id, travel_mode) {

	if (!origin_place_id || !destination_place_id) {
		return;
	}
	directionsService.route({
		origin : {
			'placeId' : origin_place_id
		},
		destination : {
			'placeId' : destination_place_id
		},
		travelMode : travel_mode
	}, function(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			responseActualRoute = response;
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}


/**
 * Calcula el gráfico del perfil.
 * 
 * @param path
 * @param elevator
 * @param map
 */
function displayPathElevation(path) {
	// Display a polyline of the elevation path.
	polyline = new google.maps.Polyline({
		path : path,
		strokeColor : '#008000',
		opacity : 0.2,
		map : map
	});

	var elevator = new google.maps.ElevationService;

	elevator.getElevationAlongPath({
		'path' : path,
		'samples' : 256
	}, plotElevation);
}

// Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation(elevations, status) {
	var chartDiv = document.getElementById('elevation_chart');
	if (status !== google.maps.ElevationStatus.OK) {
		// Show the error code inside the chartDiv.
		chartDiv.innerHTML = 'Cannot show elevation: request failed because '
				+ status;
		return;
	}
	// Create a new chart in the elevation_chart DIV.
	var chart = new google.visualization.LineChart(chartDiv);

	// Extract the data from which to populate the chart.
	// Because the samples are equidistant, the 'Sample'
	// column here does double duty as distance along the
	// X axis.
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Sample');
	data.addColumn('number', 'Elevation');
	for (var i = 0; i < elevations.length; i++) {
		data.addRow([ '', elevations[i].elevation ]);
	}

	// Draw the chart using the data within its DIV.
	chart.draw(data, {
		height : 150,
		legend : 'none',
		titleY : 'Elevación (m)',
		colors : [ '#AB0D06' ],
	});
}

/**
 * Calcula la distancia total en km
 * @param result
 */
function computeTotalDistance(result) {
	var total = 0;
	var myroute = result.routes[0];
	for (var i = 0; i < myroute.legs.length; i++) {
		total += myroute.legs[i].distance.value;
	}
	total = total / 1000;

	document.getElementById('distancia_value').innerHTML = total + ' km';
}

