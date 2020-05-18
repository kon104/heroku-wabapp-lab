
// {{{ function replaceZen2HanKaku(str)
function replaceZen2HanKaku(str) {
	str = str.replace(/　/g, ' ');
	str = str.replace(/－/g, '-');
	str = str.replace(/[０-９Ａ-Ｚａ-ｚ]/g, function(s){
		return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	});
	return str;
}
// }}}

// {{{ function replaceHan2Kanji(str)
function replaceHan2Kanji(str) {
	str = str.replace(/ /g, '　');
	str = str.replace(/-/g, '－');
	str = str.replace(/[0-9]/g, function(s){
		var map = ['０', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
		return map[s];
	});
	str = str.replace(/[A-Za-z]/g, function(s){
		return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
	});
	return str;
}
// }}}

