
const DIFF_DIST_FROM_CENTER_MARKER = 0.001;
const STORAGE_KEY_HOME_LAT = 'grgmap.home.lat';
const STORAGE_KEY_HOME_LNG = 'grgmap.home.lng';

// {{{ function initMap()
function initMap()
{
	var centerLatLng = acquireCenterLatLng();

	var map_ov = createMapOverview('map_ov', centerLatLng);
	var map_zm = createMapZoom('map_zm', centerLatLng);

	initMapOverview(map_ov, map_zm);
	initMapZoom(map_zm);
}
// }}}

// {{{ function acquireCenterLatLng()
function acquireCenterLatLng()
{
	var storage = localStorage;
	var lat = storage.getItem(STORAGE_KEY_HOME_LAT);
	var lng = storage.getItem(STORAGE_KEY_HOME_LNG);
	if ((lat !== null) && (lng !== null)) {
		lat = parseFloat(lat);
		lng = parseFloat(lng);
	} else {
		// location is at Yokohama station.
		lat = 35.466010;
		lng = 139.622425;
	}

	lng += DIFF_DIST_FROM_CENTER_MARKER;
	var latlng = {lat: lat, lng: lng};

	return latlng;
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

