
var chk_shp_black = document.getElementById("shp_black");
chk_shp_black.addEventListener("change", function(event) {
	change_shape_color(event);
}, false);

var chk_shp_blue = document.getElementById("shp_blue");
chk_shp_blue.addEventListener("change", function(event) {
	change_shape_color(event);
}, false);

var chk_shp_red = document.getElementById("shp_red");
chk_shp_red.addEventListener("change", function(event) {
	change_shape_color(event);
}, false);

var btn_del_sh = document.getElementById("btn_delete_shape");
btn_del_sh.addEventListener("click" , function(event) {
	deleteShape();
}, false);

