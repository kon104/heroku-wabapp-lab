

var activeDraw = {shape: null, type: null};

// {{{ function initMap()
function initMap()
{
	const DIFF_DIST_FROM_CENTER = 0.0008;

	var centerLat = /*[[${lat}]]*/ 35.45481104743612;
	var centerLng = /*[[${lng}]]*/ 139.63120803716913;
	var centerPos = {lat: centerLat, lng: centerLng};
	var homePos   = {lat: centerLat, lng: (centerLng - DIFF_DIST_FROM_CENTER)};
	var garagePos = {lat: centerLat, lng: (centerLng + DIFF_DIST_FROM_CENTER)};

	//----------
	// map
	//----------
	var map_ov = createMapOverview('map_ov', centerPos);
	var map_zm = createMapZoom('map_zm', garagePos);
	behaviorSearchBox(map_ov);

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
			strokeOpacity: 0.6,
		}
	});

	var markerHome = createPieceMarker(map_ov, homePos, "宅");
	var markerGrge = createPieceMarker(map_ov, garagePos, "駐");

	var contentHome = makeBollowContent('hm');
	var infoHome = new google.maps.InfoWindow({content: contentHome});
	infoHome.open(map_ov, markerHome);

	var contentGrge = makeBollowContent('gr');
	var infoGrge = new google.maps.InfoWindow({content: contentGrge});
	infoGrge.open(map_ov, markerGrge);

	renderPoint2Point(dServ, dRend, markerHome, markerGrge);

	markerHome.addListener('click', function(){
		renderPoint2Point(dServ, dRend, markerHome, markerGrge);
		infoHome.open(map_ov, markerHome);
	});
	markerGrge.addListener('click', function(){
		renderPoint2Point(dServ, dRend, markerHome, markerGrge);
		infoGrge.open(map_ov, markerGrge);
	});
	markerHome.addListener('dragend', function(arg) {
		renderPoint2Point(dServ, dRend, markerHome, markerGrge);
		convMarker2Geocode(markerHome, annexPref2Search);
	});
	markerGrge.addListener('dragend', function(arg) {
		renderPoint2Point(dServ, dRend, markerHome, markerGrge);
		synchronizeCenter2Zoom(markerGrge, map_zm);
	});

	//----------
	// setting configurations of 2nd map
	//----------
	var drawingManager = createDrawingManager();
	drawingManager.setMap(map_zm);

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

}
// }}}

// {{{ function download_map2img(mapid, filename)
function download_map2img(mapid, filename)
{
	if (window.chrome || window.safari) {
		var transform = $(".gm-style>div:first>div").css("transform");
		var comp = transform.split(","); //split up the transform matrix
		var mapleft = parseFloat(comp[4]); //get left value
		var maptop = parseFloat(comp[5]); //get top value
		$(".gm-style>div:first>div").css({ //get the map container. not sure if stable
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
			$(".gm-style>div:first>div").css({
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
//		mapTypeId: google.maps.MapTypeId.SATELLITE,
		styles: [{
			stylers: [{
				saturation: -100
			}]
		}]
	});
	return map;
}
// }}}

// {{{ function createPieceMarker(map, position, caption)
function createPieceMarker(map, position, caption)
{
	var marker = new google.maps.Marker( {
		map: map,
		position: position,
		draggable: true ,
		label: {
			text: caption,
			color: "#FFFFFF",
		}
	});
	return marker;
}
// }}}

// {{{ function makeBollowContent(prefix)
function makeBollowContent(prefix)
{
	var content
		= '<table>'
		+ '<tr><th>道程距離</th><td><div id="' + prefix + '-way2go">---</div><td></tr>'
		+ '<tr><th>直線距離</th><td><div id="' + prefix + '-direct">---</div><td></tr>'
		+ '</table>';
	return content;
}
// }}}

// {{{ function renderPoint2Point(serv, rend, markerHome, markerGrge)
function renderPoint2Point(serv, rend, markerHome, markerGrge)
{
	var request = {
		origin: markerHome.getPosition(),
		destination: markerGrge.getPosition(),
		travelMode: google.maps.DirectionsTravelMode.WALKING,
	};
	serv.route(request, function(result, status){
		if (status == google.maps.DirectionsStatus.OK) {
			rend.setDirections(result);
			var distWay2Go = (result.routes[0].legs[0].distance.value)
				.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') + ' m';
			var elemHW = document.getElementById("hm-way2go");
			var elemGW = document.getElementById("gr-way2go");
			if (elemHW != null) elemHW.innerHTML = distWay2Go;
			if (elemGW != null) elemGW.innerHTML = distWay2Go;

			var distDirect = (Math.round(
				google.maps.geometry.spherical.computeDistanceBetween(
				markerHome.getPosition(), markerGrge.getPosition())))
				.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') + ' m';
			var elemHD = document.getElementById("hm-direct");
			var elemGD = document.getElementById("gr-direct");
			if (elemHD != null) elemHD.innerHTML = distDirect;
			if (elemGD != null) elemGD.innerHTML = distDirect;

		}
	});
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
	document.getElementById("srchInput").value = pref;
}


