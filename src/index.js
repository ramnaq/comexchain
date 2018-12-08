function setFileName() {
	file = document.getElementById('doc_file').files[0];
	document.getElementById('doc_textbox').value = file.name;
}
