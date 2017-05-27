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
		mapTypeControl : true,
		center : {
			lat : 40.463667,
			lng : -3.74922
		},
		zoom : 6
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
	var waypoint_input = document.getElementById('waypoint-input');
	var modes = document.getElementById('mode-selector');

	// Posicion visual en el mapa
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

	var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
	origin_autocomplete.bindTo('bounds', map);
	var destination_autocomplete = new google.maps.places.Autocomplete(
			destination_input);
	destination_autocomplete.bindTo('bounds', map);
	var waypoint_autocomplete = new google.maps.places.Autocomplete(
			waypoint_input);
	waypoint_autocomplete.bindTo('bounds', map);
	
	var origin_location = null;
	var destination_location = null;
	var waypoint_location=null;

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
		route(origin_place_id, destination_place_id,waypoints, travel_mode);
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
		route(origin_place_id, destination_place_id, waypoints, travel_mode);

		var path = [ origin_location, destination_location ];

		// Draw the path, using the Visualization API and the Elevation service.
		displayPathElevation(path);

	});

	directionsDisplay.addListener('directions_changed', function() {
		computeTotalDistance(directionsDisplay.getDirections());
	});
	
	$("#addPunto").click(function(evento) {
		añadirPuntoIntermedio(waypoint_autocomplete);
		route(origin_place_id, destination_place_id, waypoints, travel_mode);
	});
	
	
	$("#listaPuntos").on('click','.delete',function(evento) {
		eliminarPuntoIntermedio(this);
		route(origin_place_id, destination_place_id, waypoints, travel_mode);
	});
		

	var defaultResponse = $('#jsonMapa').val();
	if(defaultResponse !=""){
		var objeto = JSON.parse(defaultResponse);
		setRoute(objeto);
	}
}

var origen;
var destino;
var puntos;
/**
 * Dibuja una ruta determinada en el mapa, dado el origen, los puntos
 * intermedios y el destino.
 */
function setRoute(actualRoute)
{
	var contador=0;
    var wp = [];
    for(var l=0;l<actualRoute.legs.length;l++){
    	if(actualRoute.legs[l].point != undefined){
    		wp[contador] = {'location': new google.maps.LatLng(actualRoute.legs[l].point.lat, actualRoute.legs[l].point.lng),'stopover':false };
    		contador=contador+1;
    	}
		for(var i=0;i<actualRoute.legs[l].waypoints.length;i++){
		   wp[contador] = {'location': new google.maps.LatLng(actualRoute.legs[l].waypoints[i][0], actualRoute.legs[l].waypoints[i][1]),'stopover':false };
		   contador=contador+1;
		 }   
	}
    
    origen=new google.maps.LatLng(actualRoute.start.lat,actualRoute.start.lng);
    destino=new google.maps.LatLng(actualRoute.end.lat,actualRoute.end.lng);
    
    directionsService.route({
    'origin':new google.maps.LatLng(actualRoute.start.lat,actualRoute.start.lng),
    'destination':new google.maps.LatLng(actualRoute.end.lat,actualRoute.end.lng),
    'waypoints': wp,
    'travelMode': google.maps.DirectionsTravelMode.DRIVING},function(res,sts) {
        if(sts=='OK'){
        	directionsDisplay.setDirections(res);
        	$('#addPunto').removeAttr('disabled');
        	var conta=0;
        	var locations = [];
            for(var i=0;i<directionsDisplay.directions.routes[0].legs.length;i++){
            	for(var j=0;j<directionsDisplay.directions.routes[0].legs[i].steps.length;j++){
            			locations[conta]=new google.maps.LatLng(directionsDisplay.directions.routes[0].legs[i].steps[j].start_point.lat(),directionsDisplay.directions.routes[0].legs[i].steps[j].start_point.lng());
            			conta=conta + 1;
            	}
            }
            if(locations.length>0)
            	displayPathElevation(locations);
        }
    });
    cont=0;

    for(var i=0;i<wp.length;i++){
    	waypoints[cont]=wp[i];
    	cont=cont+1;
    }
}

/**
 * Calcula la ruta y la dibuja en el mapa
 */
function route(origin_place_id, destination_place_id, waypoints_array, travel_mode) {

	if (!origin_place_id || !destination_place_id) {
		origin_place_id=origen;
		destination_place_id=destino;
		if (!origin_place_id || !destination_place_id) 
			return;
		
		directionsService.route({
			'origin': origin_place_id ,
			'destination': destination_place_id ,
			'waypoints' : waypoints_array,
			'optimizeWaypoints': true,
			'travelMode' : travel_mode
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				responseActualRoute = response;
				directionsDisplay.setDirections(response);
				$('#addPunto').removeAttr('disabled');
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}else{	
		directionsService.route({
			origin : {
				'placeId' : origin_place_id
			},
			destination : {
				'placeId' : destination_place_id
			},
			'waypoints' : waypoints_array,
			optimizeWaypoints: true,
			travelMode : travel_mode
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				responseActualRoute = response;
				directionsDisplay.setDirections(response);
				$('#addPunto').removeAttr('disabled');
	
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}
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
		strokeColor : '#800800',
		opacity : 0.2,
		map : map
	});

	var elevator = new google.maps.ElevationService;

	elevator.getElevationAlongPath({
		'path' : path,
		'samples' : 256
	}, plotElevation);
}

function displayLocationElevation(locations) {
	
	var elevator = new google.maps.ElevationService;
	elevator.getElevationForLocations({
	   'locations': locations
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
	var chart = new google.visualization.ColumnChart(chartDiv);

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
 * 
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

