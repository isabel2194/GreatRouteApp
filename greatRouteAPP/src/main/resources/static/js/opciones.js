$(document).ready(function() {
	$("#borrar").click(reiniciarComponentes);
	$("#exportar").click(exportarRuta);
	$("#imprimir").click(function() {
		printMaps();
	});
	$("#guardarRuta").click(function(evento) {
		var data={};
		var w = [], wp;
		var rleg = directionsDisplay.directions.routes[0].legs[0];
		data.start = {
			'name': rleg.start_address,
			'lat' : rleg.start_location.lat(),
			'lng' : rleg.start_location.lng()
		};
		data.end = {
			'name': rleg.end_address,	
			'lat' : rleg.end_location.lat(),
			'lng' : rleg.end_location.lng()
		};
		data.distance = rleg.distance.value;
		data.time = rleg.duration.value;
		var wp = rleg.via_waypoints;
		for (var i = 0; i < wp.length; i++)
			w[i] = [ wp[i].lat(), wp[i].lng() ]
		data.waypoints = w;
		$.ajax({
			url : "guardarRuta",
			type : "POST",
			data : JSON.stringify(data),
			contentType : "application/json",
			processData : false,
			success : function(result) {
				alert("Ruta guardada con éxito.")
				// sacar mensaje de ruta guardada correctamente.
			},
			error : function(result) {
				alert("Error al guardar la ruta.")
				// sacar mensaje de ruta no guardada con exito.
			}
		});
		evento.preventDefault();
	});
	$("#modificarRuta").click(function(evento) {
		var data={};
		var w = [], wp;
		var rleg = directionsDisplay.directions.routes[0].legs[0];
		data.start = {
			'name': rleg.start_address,
			'lat' : rleg.start_location.lat(),
			'lng' : rleg.start_location.lng()
		};
		data.end = {
			'name': rleg.end_address,	
			'lat' : rleg.end_location.lat(),
			'lng' : rleg.end_location.lng()
		};
		data.distance = rleg.distance.value;
		data.time = rleg.duration.value;
		var wp = rleg.via_waypoints;
		for (var i = 0; i < wp.length; i++)
			w[i] = [ wp[i].lat(), wp[i].lng() ]
		data.waypoints = w;
		$.ajax({
			url : "modificarRuta",
			type : "POST",
			data : JSON.stringify(data),
			contentType : "application/json",
			processData : false,
			success : function(result) {
				alert("Ruta guardada con éxito.")
				// sacar mensaje de ruta guardada correctamente.
			},
			error : function(result) {
				alert("Error al guardar la ruta.")
				// sacar mensaje de ruta no guardada con exito.
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

	printContainer.addClass('print-container').css('position', 'relative').css(
			'text-align', 'center').height(mapContainer.height()).append(logo)
			.append(info).append(mapContainer).prependTo(body);

	var content = body.children().not('script').not(printContainer).detach();

	/*
	 * Needed for those who use Bootstrap 3.x, because some of its `@media
	 * print` styles ain't play nicely when printing.
	 */
	var patchedStyle = $('<style>').attr('media', 'print').text(
			'img { max-width: none !important; }'
					+ 'a[href]:after { content: ""; }').appendTo('head');

	window.print();

	logo.css("width", "100%");

	body.prepend(content);
	mapContainerParent.prepend(mapContainer);
	$("#div_info").prepend(info);
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
}

/**
 * Realiza una peticion POST a un servicio que nos exporta la ruta a formato GPX
 */
function exportarRuta() {
	var rutaJSON = directionsDisplay.directions.routes[0].legs[0];
	
	
	var data={};
	var path = [], pathinfo, steps;
	data.start = {
		'name': rutaJSON.start_address,
		'lat' : rutaJSON.start_location.lat(),
		'lng' : rutaJSON.start_location.lng()
	};
	data.end = {
		'name': rutaJSON.end_address,	
		'lat' : rutaJSON.end_location.lat(),
		'lng' : rutaJSON.end_location.lng()
	};
	var steps = rutaJSON.steps;
	var cont=0;
	for (var i = 0; i < steps.length; i++){
		path[cont] = steps[i].path
		cont++;
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
 * Funcion que añade un <li> dentro del <ul>
 */
function añadirPuntoIntermedio(waypoint_autocomplete)
{
    var nuevoPunto=document.getElementById("waypoint-input").value;
    if(nuevoPunto.length>0)
    {
        if(find_li(nuevoPunto))
        {
            var li=document.createElement('li');
            li.id=nuevoPunto;
            $(li).addClass("list-group-item");
            $(li).addClass("col-xs-12");
            li.innerHTML="<button id='deletePoint' class='pull-right'>X</button>"+nuevoPunto;
            document.getElementById("listaPuntos").appendChild(li);
        }
    }
    
    place=waypoint_autocomplete.getPlace();
    //Añadimos a la ruta
    waypoints.push({
    	'location': nuevoPunto,
    	'stopover':true
    });
    cont=cont+1;
    
    return false;
}

/**
 * Funcion que busca si existe ya el <li> dentrol del <ul>
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
 * Funcion para eliminar los elementos
 * Tiene que recibir el elemento pulsado
 */
function eliminarPuntoIntermedio(elemento)
{
    var id=elemento.parentNode.getAttribute("id");
    node=document.getElementById(id);
    node.parentNode.removeChild(node);
    
  //Añadimos a la ruta
    waypoints.pop();
    cont=cont-1;
    
}
