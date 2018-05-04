

var drawingManager = null;
var activeDraw = {shape: null, type: null};

// {{{ function initMapFully(centerLat, centerLng)
function initMapFully(centerLat, centerLng)
{
	var centerPos = {lat: centerLat, lng: centerLng};

	//----------
	// map
	//----------
	var map_ov = createMapOverview('map_ov', centerPos);
	var map_zm = createMapZoom('map_zm', centerPos);

	//----------
	// setting configurations of 1st map
	//----------
	var dServ = new google.maps.DirectionsService(); 
	var dRend = new google.maps.DirectionsRenderer({
		map: map_ov,
		preserveViewport: true,
		draggable: true,
		suppressMarkers: true,
		polylineOptions: {
			strokeWeight: 5,
			strokeColor: "black",
			strokeOpacity: 0.5,
		}
	});

	//----------
	// created markes.
	//----------
	var markerHome = createPieceMarker(map_ov, '宅');
	var markerGrge = createPieceMarker(map_ov, '駐');
	var infoHome = makeBollowInfo(map_ov, markerHome, 'hm');
	var infoGrge = makeBollowInfo(map_ov, markerGrge, 'gr');
	var plineMarkers = new google.maps.Polyline({map: map_ov, strokeColor: 'red', strokeWeight: 2, icons: [
			{icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 2}, offset: '100%'}
		]});
	initMarker(map_ov, markerHome, markerGrge);
	renderPoint2PointDirect(markerHome, markerGrge, plineMarkers);
	renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);

	behaviorSearchBox(map_ov, map_zm, markerHome, markerGrge, dServ, dRend, plineMarkers);

	//----------
	// setting configurations of 2nd map
	//----------
	synchronizeCenter2Zoom(markerGrge, map_zm);

	//----------
	// assigned events to markers.
	//----------
	markerHome.addListener('click', function(){
		renderPoint2PointDirect(markerHome, markerGrge, plineMarkers);
		renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);
		infoHome.open(map_ov, markerHome);
	});
	markerGrge.addListener('click', function(){
		renderPoint2PointDirect(markerHome, markerGrge, plineMarkers);
		renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);
		infoGrge.open(map_ov, markerGrge);
	});
	markerHome.addListener('dragend', function(arg) {
		renderPoint2PointDirect(markerHome, markerGrge, plineMarkers);
		renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);
		convMarker2Geocode(markerHome, annexPref2Search);
	});
	markerGrge.addListener('dragend', function(arg) {
		renderPoint2PointDirect(markerHome, markerGrge, plineMarkers);
		renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);
		synchronizeCenter2Zoom(markerGrge, map_zm);
	});

	//----------
	// setting configurations of 2nd map
	//----------
	drawingManager = createDrawingManager();
	drawingManager.setMap(map_zm);
	var mytool = document.getElementById('map_zm_mytool');
	map_zm.controls[google.maps.ControlPosition.TOP].push(mytool);


	google.maps.event.addListener(dRend, 'directions_changed', function(){
		var directions = dRend.getDirections();
		showRouteDistance(directions);
	});
	google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
		drawingManager.setDrawingMode(null);
		var type = event.type;
		var shape = event.overlay;

		if (type == google.maps.drawing.OverlayType.MARKER) {
			var statement = prompt("表示する文字を入力してください");
			var iw = new google.maps.InfoWindow({content: statement});
			iw.open(map_zm, shape);
		} else {
			selectShape(shape, type);
		}
		shape.addListener('click', function() {
			unselectShape();
			selectShape(shape, type);
		});
	});
	google.maps.event.addListener(drawingManager, 'drawingmode_changed', unselectShape);
	google.maps.event.addListener(map_zm, 'click', unselectShape);
	google.maps.event.addDomListener(document, 'keyup', function(event){
		var code = (event.keyCode ? event.keyCode : event.which);
		// esc
		if (code === 27) {
			drawingManager.setDrawingMode(null);
		} else
		// back space, delete
		if ((code === 8) || (code === 46)) {
			deleteShape();
		}
	});
}
// }}}

// {{{ function download_map2img(mapid, filename)
function download_map2img(mapid, filename)
{
	if (window.chrome || window.safari) {
		var transform = $("#" + mapid + ">*>.gm-style>div:first>div").css("transform");
		var comp = transform.split(",");	//split up the transform matrix
		var mapleft = parseFloat(comp[4]);	//get left value
		var maptop = parseFloat(comp[5]);	//get top value
		$("#" + mapid + ">*>.gm-style>div:first>div").css({ //get the map container. not sure if stable
			"transform": "none",
			"left": mapleft,
			"top": maptop,
		});
	}

	var txtbox = document.getElementById('pac-input');
	txtbox.style.display = "none";

	html2canvas(document.getElementById(mapid), {
		useCORS: true,
		}).then(function(canvas) {

		if (window.chrome || window.safari) {
			$("#" + mapid + ">*>.gm-style>div:first>div").css({
				left: 0,
				top: 0,
				"transform": transform
			});
		}

		var type = 'image/png';
		var imgData = canvas.toDataURL(type);
		var bin = atob(imgData.split(',')[1]);
		var buffer = new Uint8Array(bin.length);
		for (var i = 0; i < bin.length; i++) {
			buffer[i] = bin.charCodeAt(i);
		}
		var blob = new Blob([buffer.buffer], {type: type});
		saveAs(blob, filename);
		txtbox.style.display = "block";
	});
}
// }}}

// {{{ function selectShape(shape, type)
function selectShape(shape, type)
{
	if (type != google.maps.drawing.OverlayType.MARKER) {
		shape.setEditable(true);
	}
	activeDraw.type = type;
	activeDraw.shape = shape;
}
// }}}

// {{{ function unselectShape()
function unselectShape()
{
	if (activeDraw.shape != null) {
		if (activeDraw.type != google.maps.drawing.OverlayType.MARKER) {
			activeDraw.shape.setEditable(false);
		}
		activeDraw.type = null;
		activeDraw.shape = null;
	}
}
// }}}

// {{{ function change_shape_color(event)
function change_shape_color(event)
{
	var color = '#000000';
	if (event.target.id === 'shp_blue') {
		color = '#0000ff';
	} else
	if (event.target.id === 'shp_red') {
		color = '#ff0000';
	}

	drawingManager.setOptions({circleOptions: {fillColor: color, strokeColor: color}});
	drawingManager.setOptions({polygonOptions: {fillColor: color, strokeColor: color}});
	drawingManager.setOptions({rectangleOptions: {fillColor: color, strokeColor: color}});
	drawingManager.setOptions({polylineOptions: {fillColor: color, strokeColor: color}});

	if ((activeDraw.shape != null) && (activeDraw.type != google.maps.drawing.OverlayType.MARKER)) {
		activeDraw.shape.setOptions({fillColor: color, strokeColor: color});
	}
}
// }}}

// {{{ function deleteShape()
function deleteShape()
{
	if (activeDraw.shape != null) {
		activeDraw.shape.setMap(null);
		activeDraw.type = null;
		activeDraw.shape = null;
	}
}
// }}}

// {{{ function createMapOverview(name, position)
function createMapOverview(name, position)
{
	var map = new google.maps.Map(document.getElementById(name), {
        center: position,
		zoom: 17,
		scaleControl: true,
		clickableIcons: false,
		rotateControlOptions: true,
	});
	return map;
}
// }}}

// {{{ function createMapZoom(name, position)
function createMapZoom(name, position)
{
	map = new google.maps.Map(document.getElementById(name), {
		center: position,
		zoom: 21,
		scaleControl: true,
		clickableIcons: false,
	});
	return map;
}
// }}}

// {{{ function createPieceMarker(map, position, caption)
function createPieceMarker(map, caption)
{
	var marker = new google.maps.Marker( {
		map: map,
		draggable: true ,
		label: {
			text: caption,
			color: "#FFFFFF",
		}
	});
	return marker;
}
// }}}

// {{{ function makeBollowInfo(prefix)
function makeBollowInfo(map, marker, prefix)
{
	var content
		= '<table>'
		+ '<tr><th>直線距離</th><td><div id="' + prefix + '-direct">---</div><td></tr>'
		+ '<tr><th>道程距離</th><td><div id="' + prefix + '-route">---</div><td></tr>'
		+ '</table>';
	var info = new google.maps.InfoWindow({content: content});
	info.open(map, marker);

	return info;
}
// }}}

// {{{ function initMarker(map, markerH, markerG)
function initMarker(map, markerH, markerG)
{
	const DIFF_DIST_FROM_CENTER = 0.001;
	var mapPos = map.getCenter();
	var homePos = {
		lat: (mapPos.lat() + DIFF_DIST_FROM_CENTER / 2),
		lng: (mapPos.lng() - DIFF_DIST_FROM_CENTER),
	};
	var gragPos = {
		lat: (mapPos.lat() - DIFF_DIST_FROM_CENTER / 2),
		lng: (mapPos.lng() + DIFF_DIST_FROM_CENTER),
	};
	markerH.setPosition(homePos);
	markerG.setPosition(gragPos);
}
// }}}

// {{{ function renderPoint2PointDirect(markerHome, markerGrge, polyline)
function renderPoint2PointDirect(markerHome, markerGrge, polyline)
{
	var distDirect = (Math.round(
		google.maps.geometry.spherical.computeDistanceBetween(
		markerHome.getPosition(), markerGrge.getPosition())))
		.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') + ' m';
	var elemHD = document.getElementById("hm-direct");
	var elemGD = document.getElementById("gr-direct");
	if (elemHD != null) elemHD.innerHTML = distDirect;
	if (elemGD != null) elemGD.innerHTML = distDirect;

	var paths = new Array();
	paths[0] = markerHome.getPosition();
	paths[1] = markerGrge.getPosition();
	polyline.setOptions({path: paths});
}
// }}}

// {{{ function renderPoint2PointRoute(serv, rend, markerHome, markerGrge)
function renderPoint2PointRoute(serv, rend, markerHome, markerGrge)
{
	var request = {
		origin: markerHome.getPosition(),
		destination: markerGrge.getPosition(),
		travelMode: google.maps.DirectionsTravelMode.WALKING,
	};
	serv.route(request, function(result, status){
		if (status == google.maps.DirectionsStatus.OK) {
			rend.setDirections(result);
			showRouteDistance(result);
		}
	});
}
// }}}

// {{{ function showRouteDistance(directions)
function showRouteDistance(directions)
{
	var distRoute = (directions.routes[0].legs[0].distance.value)
		.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') + ' m';
	var elemHW = document.getElementById("hm-route");
	var elemGW = document.getElementById("gr-route");
	if (elemHW != null) elemHW.innerHTML = distRoute;
	if (elemGW != null) elemGW.innerHTML = distRoute;
}
// }}}

// {{{ function convMarker2Geocode(marker, callback)
function convMarker2Geocode(marker, callback)
{
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'location': marker.getPosition()}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				callback(results);
			}
		}
	});
}
// }}}

// {{{ function createDrawingManager()
function createDrawingManager()
{
	var manager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.PAN,
		drawingControl: true,                            
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER, 
			drawingModes: [
				google.maps.drawing.OverlayType.MARKER,
				google.maps.drawing.OverlayType.CIRCLE,
				google.maps.drawing.OverlayType.POLYGON,
				google.maps.drawing.OverlayType.POLYLINE,
				google.maps.drawing.OverlayType.RECTANGLE,
			],
		},
		markerOptions: {
			icon: {
				url: 'http://maps.google.com/mapfiles/kml/paddle/wht-blank-lv.png',
			},
			clickable: true,
			editable: true,
			draggable: true,
			geodesic: true,
		},
		circleOptions: {
			clickable: true,
			editable: true,
			draggable: true,
			geodesic: true,
			zIndex: 1
		},
		polygonOptions: {
//			fillColor: '#ff00ff',
//			fillOpacity: 1,
//			strokeWeight: 5,
			clickable: true,
			editable: true,
			draggable: true,
			geodesic: true,
			zIndex: 1
		},
		rectangleOptions: {
//			fillColor: '#0000ff',
//			fillOpacity: 1,
//			strokeWeight: 5,
			clickable: true,
			editable: true,
			draggable: true,
			geodesic: true,
			zIndex: 1
		},
		polylineOptions: {
//			strokeColor: '#ff0000',
//			strokeWeight: 5,
			clickable: true,
			editable: true,
			draggable: true,
			geodesic: true,
			zIndex: 1
		}
	});

	return manager;
}
// }}}

// {{{ function synchronizeCenter2Zoom(marker, map)
function synchronizeCenter2Zoom(marker, map)
{
	map.setCenter(marker.getPosition());
}
// }}}

var annexPref2Search = function(geocodeResults)
{
	var results = geocodeResults[0].address_components.filter(function(component) {
		return component.types.indexOf("administrative_area_level_1") > -1;
	});
	pref = results[0].long_name;
//	document.getElementById("srchInput").value = pref;
}


