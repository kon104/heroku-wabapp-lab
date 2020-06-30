
// {{{ function initMapFully(centerLat, centerLng)
function initMapFully(centerLat, centerLng)
{
	var centerLatLng = {lat: centerLat, lng: centerLng};

	var map_ov = createMapOverview('map_ov', centerLatLng);
	var map_zm = createMapZoom('map_zm', centerLatLng);

	initMapOverview(map_ov, map_zm);
	initMapZoom(map_zm);
}
// }}}

// {{{ function createMapOverview(name, latlng)
function createMapOverview(name, latlng)
{
	var map = new google.maps.Map(document.getElementById(name), {
        center: latlng,
		zoom: 17,
		tilt: 0,
		scaleControl: true,
		clickableIcons: false,
		rotateControlOptions: true,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM
		},
	});
	return map;
}
// }}}

// {{{ function createMapZoom(name, latlng)
function createMapZoom(name, latlng)
{
	map = new google.maps.Map(document.getElementById(name), {
		center: latlng,
		zoom: 21,
		tilt: 0,
		scaleControl: true,
		clickableIcons: false,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM
		},
	});
	return map;
}
// }}}

