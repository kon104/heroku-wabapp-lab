
// selecting the download file
var selectDownload = document.getElementById('selectdownload');

// {{{ selectDownload.addEventListener('change', function(e) {});
selectDownload.addEventListener('change', function(e) {
	changeCsvFile(this);
});
// }}}

// uploading the csv file
var csvfile = document.getElementById('csvfile');
var selectChar = document.getElementById('selectchar');

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

// {{{ selectChar.addEventListener('change', function(e){});
selectChar.addEventListener('change', function(e) {
	var selectDownload = document.getElementById('selectdownload');
	selectDownload.options[this.selectedIndex].selected = true;
	changeCsvFile(selectDownload);
});
// }}}

// selecting font
var selectFont = document.getElementById('selectfont');

// {{{ selectFont.addEventListener('change', function(e) {});
selectFont.addEventListener('change', function(e) {
	var article = document.getElementsByTagName('article');
	article[0].style.fontFamily = this.value;
});
// }}}

// {{{ sub routine: function changeCsvFile(selectDownload)
function changeCsvFile(selectDownload) {
	document.getElementById('downloadlink').href = selectDownload.value;

	var soft = document.getElementById('software');
	var char = document.getElementById('selectchar');
	var softName;
	if (selectDownload.selectedIndex === 0) {
		softName = 'Excel';
	} else {
		softName = 'Googleスプレッドシート';
	}
	soft.firstChild.nodeValue = softName;
	char.options[selectDownload.selectedIndex].selected = true;
}
// }}}

