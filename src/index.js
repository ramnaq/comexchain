function setFileName() {
	file = document.getElementById('doc_file').files[0];
	document.getElementById('doc_textbox').value = file.name;
}

function retrieve() {
	path = "https://ipfs.io/ipfs/";
	hash = document.getElementById("hash").value;
	document.getElementById("img").src = path + hash;
}

function displayText() {
	document.getElementById("text-tran").style.display = "block";
	document.getElementById("text-ipfs").style.display = "block";
}

function submit() {
	var content = document.getElementsByName('hidden_iframe')[0].contentWindow.document.body.innerHTML || "{}";
	var split = content.split(',');
	console.log(split);
	document.getElementById("text-ipfs").innerHTML = "IPFS hash: " + split[0];
	document.getElementById("text-tran").innerHTML = "Eth hash: " + split[1];
	makeQRCode(split[0]);
}

function makeQRCode(hash) {
  new QRCode(document.getElementById('canvas-div'), 'http://ipfs.io/' + hash);
	console.log(hash.length)
	if (hash.length > 2) {
		document.getElementById('canvas-div').hidden = false;
	}
}
