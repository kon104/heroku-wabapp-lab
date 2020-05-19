

// {{{ function createCards(reader)
function createCards(reader) {

	var cardsNew = refreshCardsNode();
	var rows = reader.result.split('\n');
	var fmNames;
	var fmZip;
	var fmAddrs;
	for (var i = 0; i < rows.length; i++) {
		var fields = rows[i].split(',');
		if (fields.length < 9) {
			continue;
		}
		if (i === 0) {
			// title
		} else
		if (i === 1) {
			// from: name
			var lastName = fields[1];
			var firstName = fields[2];
			var wifeName = fields[3];
			var childName = fields[4];
			fmNames = buildNameList(lastName, firstName, wifeName, childName);
			// from: zip
			fmZip = fields[5].split('-');
			// from: address
			var state = fields[6];
			var city = fields[7];
			var addrline = fields[8];
			fmAddrs = buildAddressList(state, city, addrline);
		} else {
			// to
			var card = createCardSection(fields, fmZip, fmAddrs, fmNames);
			cardsNew.appendChild(card);
		}
	}
}
// }}}

// {{{ function refreshCardsNode()
function refreshCardsNode() {

	var cardsOld = document.getElementById('cards');
	cardsOld.remove();

	var cardsNew = document.createElement('div');
	cardsNew.id = 'cards';
	var article = document.getElementsByTagName('article');
	article[0].appendChild(cardsNew);

	return cardsNew;
}
// }}}

// {{{ function createCardSection(fields, fmZip, fmAddrs, fmNames)
function createCardSection(fields, fmZip, fmAddrs, fmNames) {

//	console.log(fields);
	var card = document.createElement('section');
	card.className = 'card';

	// receiver's zip code
	var toZip = fields[5].split('-');
	putPartsOfZip(toZip[0], card, 'tozip3', 3);
	putPartsOfZip(toZip[1], card, 'tozip4', 4);

	// receiver's address
	var state = fields[6];
	var city = fields[7];
	var addrline = fields[8];
	var toAddrs = buildAddressList(state, city, addrline);
	putPartsOfAddress(toAddrs[0], card, 'toaddr1', 't-l');
	putPartsOfAddress(toAddrs[1], card, 'toaddr2', 't-r');
	putPartsOfAddress(toAddrs[2], card, 'toaddr3', 't-r');

	// receiver's name
	var lastName = fields[1];
	var firstName = fields[2];
	var wifeName = fields[3];
	var childName = fields[4];
	var toNames = buildNameList(lastName, firstName, wifeName, childName);
	for (var i = 0, j = 1; i < toNames.length; i++, j++) {
		if ((i === 0) && (toNames.length < 3)) {
			j++;
		}
		putPartsOfName(toNames[i], card, j, 'toname', 'toname-ls');
		putPartsOfTitle(card, 'totitle' + j);
	}

	// sender's zip code
	putPartsOfZip(fmZip[0], card, 'fmzip3', 3);
	putPartsOfZip(fmZip[1], card, 'fmzip4', 4);

	// sender's address
	putPartsOfAddress(fmAddrs[0], card, 'fmaddr1', 't-l');
	putPartsOfAddress(fmAddrs[1], card, 'fmaddr2', 't-r');

	// sender's name
	for (var i = 0, j = 1; i < fmNames.length; i++, j++) {
		if ((i === 0) && (fmNames.length < 3)) {
			j++;
		}
		putPartsOfName(fmNames[i], card, j, 'fmname', 'fmname-ls');
	}

	return card;
}
// }}}

// {{{ function buildAddressList(state, city, addrline)
function buildAddressList(state, city, addrline) {

	const MAX_ADDRLINE = 16;

	addrline = replaceZen2HanKaku(addrline);
	var addrlist = addrline.split(' ');

	var areanum = addrlist[0];
	var area = '';
	var number = '';
	if (areanum.search(/\d/) < 1) {
		area = areanum;
	} else {
		area = areanum.substr(0, areanum.search(/\d/));
		number = areanum.substr(areanum.search(/\d/));
	}

	var building = addrlist[1];
	if (building === undefined) {
		building = '';
	}

	var addrs = ['', '', '', '', ''];
	var index = 0;

	// place a state
	addrs[index] = state;

	// place a city
	if ((addrs[index].length > MAX_ADDRLINE) ||
	   ((addrs[index] + city).length > MAX_ADDRLINE)) {
		index++;
	}
	addrs[index] += city;

	// place an area
	if ((addrs[index].length > MAX_ADDRLINE) ||
	   ((addrs[index] + area).length > MAX_ADDRLINE)) {
		index++;
	}
	addrs[index] += area;

	// place a number
	if ((addrs[index].length > MAX_ADDRLINE) ||
	   ((addrs[index] + number).length > MAX_ADDRLINE)) {
		index++;
	}
	addrs[index] += number;

	// place a building
	if (building.length > 0) {
		if ((addrs[index].length > MAX_ADDRLINE) ||
		   ((addrs[index] + ' ' + building).length > MAX_ADDRLINE)) {
			index++;
		} else {
			building = ' ' + building;
		}
		addrs[index] += building;
	}

	// replace from a half-width to Kanji charactor
	for (var i = 0; addrs.length > i; i++) {
		addrs[i] = replaceHan2Kanji(addrs[i]);
	}

	return addrs;
}
// }}}

// {{{ function buildNameList(lastName, firstName, wifeName, childName)
function buildNameList(lastName, firstName, wifeName, childName) {

	var names = [];
	var index = 0;

	if ((lastName !== '') && (firstName !== '')) {
		names[index] = lastName + ' ' + firstName;
		index++;
	} else
	if (lastName !== '') {
		names[index] = lastName;
		index++;
	} else
	if (firstName !== '') {
		names[index] = firstName;
		index++;
	}

	if ((lastName !== '') && (wifeName !== '')) {
		names[index] = ' '.repeat(lastName.length + 1) + wifeName;
		index++;
	} else
	if (wifeName !== '') {
		names[index] = wifeName;
		index++;
	}

	if ((lastName !== '') && (childName !== '')) {
		names[index] = ' '.repeat(lastName.length + 1) + childName;
		index++;
	} else
	if (childName !== '') {
		names[index] = childName;
		index++;
	}

	for (var i = 0; names.length > i; i++) {
		names[i] = replaceHan2Kanji(names[i]);
	}

	return names;
}
// }}}

// {{{ function putPartsOfZip(value, card, classDiv, max)
function putPartsOfZip(value, card, classDiv, max) {

	var values = value.split('');
	for (var i = 0; (values.length > i) && (max > i); i++) {
		var text = document.createTextNode(values[i]);
		var p = document.createElement('p');
		p.className = 't-c';
		p.appendChild(text);

		var div = document.createElement('div');
		div.className = classDiv + '-' + (i + 1);
		div.appendChild(p);

		card.appendChild(div);
	}

	return true;
}
// }}}

// {{{ function putPartsOfAddress(value, card, classDiv, classP)
function putPartsOfAddress(value, card, classDiv, classP) {

	var text = document.createTextNode(value);
	var p = document.createElement('p');
	p.className = classP;
	p.appendChild(text);

	var div = document.createElement('div');
	div.className = classDiv;
	div.appendChild(p);
	card.appendChild(div);

	return true;
}
// }}}

// {{{ function putPartsOfName(value, card, classDiv, classSpan)
function putPartsOfName(value, card, index, classDiv, classSpan) {

	var text = document.createTextNode(value);
	var span = document.createElement('span');
	var vLen = value.length;
	if ((vLen > 0) && (vLen < 9)) {
		span.className = classSpan + vLen;
	}
	span.appendChild(text);

	var p = document.createElement('p');
	if (value.length === 1) {
		p.className = "t-c";
	}
	p.appendChild(span);

	var div = document.createElement('div');
	div.className = classDiv + index;
	div.appendChild(p);

	card.appendChild(div);

	return true;
}
// }}}

// {{{ function putPartsOfTitle(card, classDiv)
function putPartsOfTitle(card, classDiv) {

	var text = document.createTextNode('様');
	var div = document.createElement('div');
	div.className = classDiv;
	div.appendChild(text);

	card.appendChild(div);

	return true;
}
// }}}


