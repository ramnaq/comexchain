var ipfs = window.IpfsHttpClient('infura.io', '5081');
var ipfsHash;
var arrBuff;

function setFileName() {
  file = document.getElementById('doc_file').files[0];
  document.getElementById('doc_textbox').value = file.name;
  captureFile();
}

function captureFile() {
  file = document.getElementById('doc_file').files[0];
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend = () => {
	this.arrBuff = reader.result;
  }
  console.log('arrBuff', this.arrBuff);
}

function onSubmit() {
  /*
  node.once('ready', () => {
  // convert your data to a Buffer and add it to IPFS
  node.files.add(node.types.Buffer.from(this.arrBuff), (err, files) => {
    if (err) return console.error(err)

    // 'hash', known as CID, is a string uniquely addressing the data
    // and can be used to get it again. 'files' is an array because
    // 'add' supports multiple additions, but we only added one entry
	this.ipfsHash = files[0].hash;
    console.log(this.ipfsHash)
  })
})
  */
  var buff = arrayBufferToBuffer(this.arrBuff);
  ipfs.add(buff, (error, result) => {
	if(error) {
	  console.error(error);
	  return;
	}
	this.ipfsHash = result[0].hash;
  })
}

function arrayBufferToBuffer(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}
