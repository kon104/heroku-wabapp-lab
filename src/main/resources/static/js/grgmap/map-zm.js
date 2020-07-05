
var drawingManager = null;
var activeDraw = {shape: null, type: null};

// {{{ function initMapZoom(map_zm)
function initMapZoom(map_zm)
{
	//----------
	// setting configurations of 2nd map
	//----------
	var posDrawTool = google.maps.ControlPosition.TOP_LEFT;
	drawingManager = createDrawingManager(posDrawTool);
	drawingManager.setMap(map_zm);
	var mytool = document.getElementById('map_zm_mytool');
	map_zm.controls[posDrawTool].push(mytool);

	google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
		drawingManager.setDrawingMode(null);
		var type = event.type;
		var shape = event.overlay;

		if (type == google.maps.drawing.OverlayType.MARKER) {
			var statement = prompt("表示する文字を入力してください");
			var url = 'https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=bb|';
			url += encodeURIComponent(statement);
			url += '|FFFFFF|000000';
			shape.icon.url = url;
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

// {{{ function createDrawingManager(posCtrl)
function createDrawingManager(posCtrl)
{
	var manager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.PAN,
		drawingControl: true,                            
		drawingControlOptions: {
			position: posCtrl,
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

// {{{ function changeShapeColor(event)
function changeShapeColor(event)
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

var chk_shp_black = document.getElementById("shp_black");
// {{{ chk_shp_black.addEventListener("change")
chk_shp_black.addEventListener("change", function(event) {
	changeShapeColor(event);
}, false);
// }}}

var chk_shp_blue = document.getElementById("shp_blue");
// {{{ chk_shp_blue.addEventListener("change")
chk_shp_blue.addEventListener("change", function(event) {
	changeShapeColor(event);
}, false);
// }}}

var chk_shp_red = document.getElementById("shp_red");
// {{{ chk_shp_red.addEventListener("change")
chk_shp_red.addEventListener("change", function(event) {
	changeShapeColor(event);
}, false);
// }}}

var btn_del_sh = document.getElementById("btn_delete_shape");
// {{{ btn_del_sh.addEventListener("click")
btn_del_sh.addEventListener("click" , function(event) {
	deleteShape();
}, false);
// }}}

