
var distDirect = '---';

// {{{ function initMapOverview(map_ov, map_zm)
function initMapOverview(map_ov, map_zm)
{
	//----------
	// create markes.
	//----------
	var markerHome = createPinMarker(map_ov, '宅');
	var markerGrge = createPinMarker(map_ov, '駐');
	var arrowLine = new google.maps.Polyline({map: map_ov, strokeColor: 'red', strokeWeight: 2, icons: [
			{icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 2}, offset: '100%'}
		]});
	initMarker(map_ov, markerHome, markerGrge);
	renderPoint2PointDirect(markerHome, markerGrge, arrowLine);
	behaviorSearchBox(map_ov, map_zm, markerHome, markerGrge, arrowLine);

	// add bollow to marker
	var infoHome = makeBollowInfo(map_ov, markerHome, 'hm');
	var infoGrge = makeBollowInfo(map_ov, markerGrge, 'gr');

	//----------
	// assigne events to markers.
	//----------
	markerHome.addListener('click', function(){
		renderPoint2PointDirect(markerHome, markerGrge, arrowLine);
		infoHome.open(map_ov, markerHome);
	});
	markerGrge.addListener('click', function(){
		renderPoint2PointDirect(markerHome, markerGrge, arrowLine);
		infoGrge.open(map_ov, markerGrge);
	});
	markerHome.addListener('dragend', function(arg) {
		renderPoint2PointDirect(markerHome, markerGrge, arrowLine);
	});
	markerGrge.addListener('dragend', function(arg) {
		renderPoint2PointDirect(markerHome, markerGrge, arrowLine);
		synchronizeCenter2Zoom(markerGrge, map_zm);
	});

	//----------
	// synchronize from overview to zoom map
	//----------
	synchronizeCenter2Zoom(markerGrge, map_zm);
}
// }}}

// {{{ function createPinMarker(map, position, caption)
function createPinMarker(map, caption)
{
	var marker = new google.maps.Marker( {
		map: map,
		draggable: true ,
		label: {
			text: caption,
			fontSize: "17px",
			fontWeight: "bold",
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
		+ '<tr><th>直線距離</th><td><div id="' + prefix + '-direct">' + distDirect + '</div><td></tr>'
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

// {{{ function renderPoint2PointDirect(markerHome, markerGrge, arrow)
function renderPoint2PointDirect(markerHome, markerGrge, arrow)
{
	var distance = (Math.round(
		google.maps.geometry.spherical.computeDistanceBetween(
		markerHome.getPosition(), markerGrge.getPosition())))
		.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') + ' m';
	distDirect = distance;

	var elemHD = document.getElementById("hm-direct");
	var elemGD = document.getElementById("gr-direct");
	if (elemHD != null) {
		elemHD.innerHTML = distance;
	}
	if (elemGD != null) {
		elemGD.innerHTML = distance;
	}
	var paths = new Array();
	paths[0] = markerHome.getPosition();
	paths[1] = markerGrge.getPosition();
	arrow.setOptions({path: paths});
}
// }}}

// {{{ function synchronizeCenter2Zoom(marker, map)
function synchronizeCenter2Zoom(marker, map)
{
	map.setCenter(marker.getPosition());
}
// }}}

// ------------------------------
// abolished functions
// ------------------------------

// {{{ function createDirectService()
function createDirectService()
{
	var dServ = new google.maps.DirectionsService(); 
	return dServ;
}
// }}}

// {{{ function createDirectRenderer(map)
function createDirectRenderer(map)
{
	var dRend = new google.maps.DirectionsRenderer({
		map: map,
		preserveViewport: true,
		draggable: true,
		suppressMarkers: true,
		polylineOptions: {
			strokeWeight: 5,
			strokeColor: "black",
			strokeOpacity: 0.5,
		}
	});

	google.maps.event.addListener(dRend, 'directions_changed', function(){
		var directions = dRend.getDirections();
		showRouteDistance(directions);
	});
	return dRend;
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

