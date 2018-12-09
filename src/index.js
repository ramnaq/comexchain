function setFileName() {
	file = document.getElementById('doc_file').files[0];
	document.getElementById('doc_textbox').value = file.name;
}

function retrieve() {
	path = "https://ipfs.io/ipfs/";
	hash = document.getElementById("hash").value;
	document.getElementById("img").src = path + hash;
}
