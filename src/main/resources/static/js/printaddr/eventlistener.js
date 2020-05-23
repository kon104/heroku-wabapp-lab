
// selecting the download file
var selectdownload = document.getElementById('selectdownload');

// {{{ selectdownload.addEventListener('change', function(e) {});
selectdownload.addEventListener('change', function(e) {
	changeCsvFile(this);
});
// }}}

// uploading the csv file
var csvfile = document.getElementById('csvfile');
var selectchar = document.getElementById('selectchar');

// {{{ csvfile.addEventListener('change', function(e){});
csvfile.addEventListener('change', function(e) {
//	var char = document.getElementById('selectchar').value;
	var char = selectchar.value;
	var file = e.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file, char);
	reader.addEventListener('load', function() {
		createCards(this);
	});
	document.getElementById('filepath').firstChild.nodeValue = file.name;
	this.value = '';
});
// }}}

// {{{ selectchar.addEventListener('change', function(e){});
selectchar.addEventListener('change', function(e) {
	var download = document.getElementById('selectdownload');
	download.options[this.selectedIndex].selected = true;
	changeCsvFile(download);
});
// }}}

// selecting font
var selectfont = document.getElementById('selectfont');

// {{{ selectfont.addEventListener('change', function(e) {});
selectfont.addEventListener('change', function(e) {
	var article = document.getElementsByTagName('article');
	article[0].style.fontFamily = this.value;
});
// }}}

// {{{ sub routine: function changeCsvFile(selectdownload)
function changeCsvFile(selectdownload) {
	document.getElementById('downloadlink').href = selectdownload.value;

	var soft = document.getElementById('software');
	var char = document.getElementById('selectchar');
	if (selectdownload.selectedIndex === 0) {
		soft.firstChild.nodeValue = 'Googleスプレッドシート';
		char.options[0].selected = true;
	} else {
		soft.firstChild.nodeValue = 'Excel';
		char.options[1].selected = true;
	}
}
// }}}

