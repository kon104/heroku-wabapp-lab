
// {{{ function initMapOverview(map_ov, map_zm)
function initMapOverview(map_ov, map_zm)
{
//	//----------
//	// setting configurations of 1st map
//	//----------
//	var dServ = new google.maps.DirectionsService(); 
//	var dRend = new google.maps.DirectionsRenderer({
//		map: map_ov,
//		preserveViewport: true,
//		draggable: true,
//		suppressMarkers: true,
//		polylineOptions: {
//			strokeWeight: 5,
//			strokeColor: "black",
//			strokeOpacity: 0.5,
//		}
//	});

//	google.maps.event.addListener(dRend, 'directions_changed', function(){
//		var directions = dRend.getDirections();
//		showRouteDistance(directions);
//	});

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
//	renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);

//	behaviorSearchBox(map_ov, map_zm, markerHome, markerGrge, dServ, dRend, plineMarkers);
	behaviorSearchBox(map_ov, map_zm, markerHome, markerGrge, plineMarkers);

	//----------
	// assigned events to markers.
	//----------
	markerHome.addListener('click', function(){
		renderPoint2PointDirect(markerHome, markerGrge, plineMarkers);
	//	renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);
		infoHome.open(map_ov, markerHome);
	});
	markerGrge.addListener('click', function(){
		renderPoint2PointDirect(markerHome, markerGrge, plineMarkers);
	//	renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);
		infoGrge.open(map_ov, markerGrge);
	});
	markerHome.addListener('dragend', function(arg) {
		renderPoint2PointDirect(markerHome, markerGrge, plineMarkers);
	//	renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);
	});
	markerGrge.addListener('dragend', function(arg) {
		renderPoint2PointDirect(markerHome, markerGrge, plineMarkers);
	//	renderPoint2PointRoute(dServ, dRend, markerHome, markerGrge);
		synchronizeCenter2Zoom(markerGrge, map_zm);
	});

	//----------
	// synchronize from overview to zoom map
	//----------
	synchronizeCenter2Zoom(markerGrge, map_zm);
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
//		+ '<tr><th>道程距離</th><td><div id="' + prefix + '-route">---</div><td></tr>'
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
	if (elemHD != null) {
		elemHD.innerHTML = distDirect;
	}
	if (elemGD != null) {
		elemGD.innerHTML = distDirect;
	}
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

// {{{ function synchronizeCenter2Zoom(marker, map)
function synchronizeCenter2Zoom(marker, map)
{
	map.setCenter(marker.getPosition());
}
// }}}

