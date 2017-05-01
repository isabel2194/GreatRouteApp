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

}
