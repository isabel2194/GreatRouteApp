$(document).ready(function() {
	$("#borrar").click(reiniciarComponentes);
	$("#exportar").click(exportarRuta);
	$("#imprimir").click(function() {
		printMaps();
	});
	
	$("#guardarRuta").click(function(evento) {
		var data={};
		var w = []
		var wp = [];
		data.distance = 0;
		data.time = 0;
		var route = directionsDisplay.directions.routes[0];
		data.start = {
				'name': route.legs[0].start_address,
				'lat' : route.legs[0].start_location.lat(),
				'lng' : route.legs[0].start_location.lng()
		};
		data.end = {
			'name': route.legs[route.legs.length-1].end_address,	
			'lat' : route.legs[route.legs.length-1].end_location.lat(),
			'lng' : route.legs[route.legs.length-1].end_location.lng()
		};
		data.legs = [];
		for(var i=0;i<route.legs.length;i++){
			data.legs[i]={ 
				'point':{
						'name': route.legs[i].start_address,
						'lat' : route.legs[i].start_location.lat(),
						'lng' : route.legs[i].start_location.lng()
					},
				'waypoints':[]
			};
			data.distance = data.distance + route.legs[i].distance.value;
			data.time = data.time + route.legs[i].duration.value;
			wp=route.legs[i].via_waypoints;
			
			if(wp!=undefined){
				for (var j = 0; j < wp.length; j++)
					w[j] = [ wp[j].lat(), wp[j].lng() ]
				data.legs[i].waypoints = w;
				w=[];
			}
		}
		
		$.ajax({
			url : "guardarRuta",
			type : "POST",
			data : JSON.stringify(data),
			contentType : "application/json",
			processData : false,
			success : function(result) {
				informar("La ruta se ha guardado correctamente.");
			},
			error : function(result) {
				informar("Se ha producido un error al guardar la ruta.");
			}
		});
		evento.preventDefault();
	});
	
	$("#modificarRuta").click(function(evento) {
		var data={};
		var w = []
		var wp = [];
		data.distance = 0;
		data.time = 0;
		var route = directionsDisplay.directions.routes[0];
		data.start = {
				'name': route.legs[0].start_address,
				'lat' : route.legs[0].start_location.lat(),
				'lng' : route.legs[0].start_location.lng()
		};
		data.end = {
			'name': route.legs[route.legs.length-1].end_address,	
			'lat' : route.legs[route.legs.length-1].end_location.lat(),
			'lng' : route.legs[route.legs.length-1].end_location.lng()
		};
		data.legs = [];
		for(var i=0;i<route.legs.length;i++){
			data.legs[i]={ 
				'point':{
						'name': route.legs[i].start_address,
						'lat' : route.legs[i].start_location.lat(),
						'lng' : route.legs[i].start_location.lng()
					},
				'waypoints':[]
			};
			data.distance = data.distance + route.legs[i].distance.value;
			data.time = data.time + route.legs[i].duration.value;
			wp=route.legs[i].via_waypoints;
			
			if(wp!=undefined){
				for (var j = 0; j < wp.length; j++)
					w[j] = [ wp[j].lat(), wp[j].lng() ]
				data.legs[i].waypoints = w;
			}
		}
		
		$.ajax({
			url : "modificarRuta",
			type : "POST",
			data : JSON.stringify(data),
			contentType : "application/json",
			processData : false,
			success : function(result) {
				informar("La ruta se ha modificado correctamente.");
			},
			error : function(result) {
				informar("Se ha producido un error al modificar la ruta.");

			}
		});
		evento.preventDefault();
	});
	
});


/*
 * Permite imprimir el mapa y la información de la ruta
 */
function printMaps() {
	var body = $('body');
	var mapContainer = $('#mapa');
	var mapContainerParent = mapContainer.parent();
	var printContainer = $('<div>');
	var logo = $("#cabecera").find("img");
	logo.css("width", "200px");
	var info = $("#informacion");
	var infoParent = $("#informacion").parent();

	printContainer.addClass('print-container').css('position', 'relative').css(
			'text-align', 'center').height(mapContainer.height()).append(logo)
			.append(info).append(mapContainer).prependTo(body);

	var content = body.children().not('script').not(printContainer).detach();
	var patchedStyle = $('<style>').attr('media', 'print').text(
			'img { max-width: none !important; }'
					+ 'a[href]:after { content: ""; }').appendTo('head');

	window.print();

	logo.css("width", "100%");

	body.prepend(content);
	mapContainerParent.prepend(mapContainer);
	infoParent.prepend(info);
	$("#cabecera").prepend(logo);

	printContainer.remove();
	patchedStyle.remove();
}
/**
 * Reiniciar mapa, borra las rutas, y los campos de origen y destino.
 */
function reiniciarComponentes() {
	$("#origin-input").val('');// Elimina el origen de la ruta
	$("#destination-input").val('');// Elimina el destino de la ruta
	$("#elevation_chart").html("");// Elimina el grafico de perfil
	directionsDisplay.setMap(null);// Elimina la ruta
	$("#distancia_value").html("0 Km");// Elimina el valor total de distancia
	polyline.setMap(null); // Elimina la linea de perfil
	$('#addPunto').attr('disabled','disabled');// Deshabilita el boton de
												// añadir waypoint a la ruta
	$("#waypoint-input").val('');// Elimina el campo de introducir waypoints
	$("#listaPuntos").empty();// Vacia los waypoints que haya
	waypoints=[];
	cont=0;
}

/**
 * Realiza una peticion POST a un servicio que nos exporta la ruta a formato GPX
 */
function exportarRuta() {
	var rutaJSON = directionsDisplay.directions.routes[0];
	
	var data={};
	var path = [], pathinfo, steps;
	
	data.start = {
		'name': rutaJSON.legs[0].start_address,
		'lat' : rutaJSON.legs[0].start_location.lat(),
		'lng' : rutaJSON.legs[0].start_location.lng()
	};
	data.end = {
		'name': rutaJSON.legs[rutaJSON.legs.length-1].end_address,	
		'lat' : rutaJSON.legs[rutaJSON.legs.length-1].end_location.lat(),
		'lng' : rutaJSON.legs[rutaJSON.legs.length-1].end_location.lng()
	};
	var contar=0;
	for(var i=0;i<rutaJSON.legs.length;i++){
		var steps = rutaJSON.legs[i].steps;
		for (var i = 0; i < steps.length; i++){
			path[contar] = steps[i].path
			contar++;
		}
	}
	data.path = path;
	
	$.ajax({
		url : "exportarRuta",
		type : "POST",
		data : JSON.stringify(data),
		contentType : "application/json",
		processData : false,
		success : function(result) {
			descargarArchivo(new Blob([result], {type:'application/xml'}));
			alert("Ruta exportada con éxito.")
			// sacar mensaje de ruta exportada correctamente.
		},
		error : function(result) {
			alert("Error al exportar la ruta.")
			// sacar mensaje de ruta no exportada con exito.
		}
	});
	
}

function descargarArchivo(contenidoEnBlob) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = 'ruta.gpx';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
}


var waypoints=[];
var cont=0;

/**
 * Funcion que añade un
 * <li> dentro del
 * <ul>
 */
function añadirPuntoIntermedio(waypoint_autocomplete)
{
    var nuevoPunto=document.getElementById("waypoint-input").value;
    $("#waypoint-input").val('');
    if(nuevoPunto.length>0)
     {
        if(find_li(nuevoPunto))
        {
            var li=document.createElement('li');
            li.id=nuevoPunto;
            $(li).addClass("list-group-item");
            $(li).addClass("col-xs-12");
            var boton = $("<button class='pull-right delete'></button>").text("X");
            $(li).append(boton,nuevoPunto);
            document.getElementById("listaPuntos").appendChild(li);
        }
    }
    place=waypoint_autocomplete.getPlace();
    // Añadimos a la ruta
    waypoints.push({
    	'location': nuevoPunto,
    	'stopover':true
    });
    cont=cont+1;
    return false;
}

/**
 * Funcion que busca si existe ya el
 * <li> dentrol del
 * <ul>
 * Devuelve true si no existe.
 */
function find_li(contenido)
{
    var el = document.getElementById("listaPuntos").getElementsByTagName("li");
    for (var i=0; i<el.length; i++)
    {
        if(el[i].innerHTML==contenido)
            return false;
    }
    return true;
}

/**
 * Funcion para eliminar los elementos Tiene que recibir el elemento pulsado
 */
function eliminarPuntoIntermedio(elemento)
{
    var id=elemento.parentNode.getAttribute("id");
    node=document.getElementById(id);
    node.parentNode.removeChild(node);
    
  // Añadimos a la ruta
    for(var i=0;i<waypoints.length; i++){
    	if(waypoints[i].location==id){
    		waypoints.splice(i, 1);
    	}
    }
    cont=cont-1;
    
}

function informar(mensaje){
	var dialog = bootbox.dialog({
	    message: '<p><i class="fa fa-spin fa-spinner"></i> Guardando...</p>'
	});
	dialog.init(function(){
	    setTimeout(function(){
	        dialog.find('.bootbox-body').html(mensaje);
	    }, 1500);
	});
}
