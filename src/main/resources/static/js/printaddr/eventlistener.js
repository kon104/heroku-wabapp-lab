
// uploading the csv file
var formcsv = document.forms.formcsv;

// {{{ formcsv.csvfile.addEventListener('change', function(e) {});
formcsv.csvfile.addEventListener('change', function(e) {

	var file = e.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file);
	reader.addEventListener('load', function() {
		createCards(this);
	});
	this.value = '';
});
// }}}

// selecting font
var formfont = document.forms.formfont;

// {{{ formfont.selectfont.addEventListener('change', function(e) {});
formfont.selectfont.addEventListener('change', function(e) {
//	var sections = document.getElementsByTagName('section');
//	for (var i = 0; i < sections.length; i++) {
//		sections[i].style.fontFamily = this.value;
//	}
	var main = document.getElementById('main');
	main.style.fontFamily = this.value;
});
// }}}

