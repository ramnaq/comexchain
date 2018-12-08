const express = require('express');
const multer  = require('multer')
const path = require('path');
const IPFS = require('ipfs-http-client');

var ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
var upload = multer({ dest: 'uploads/' })
var app = express();
var ipfsHash;
var arrBuff;


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(express.static(__dirname + '/'));

app.post('/', upload.single('doc_file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file)
  storeOnIPFS(req.file.path);
})

app.listen(8080);


function storeOnIPFS(file_path) {
  fs = require('fs');
  fs.readFile(file_path, function (err, data) {
	if (err) throw err;
	fbuffer = data;
	ipfs.add(fbuffer, (err, result) => {
	  if (err) throw err;
	  this.ipfsHash = result[0].hash;
	  console.log("hash: " + this.ipfsHash);
	});
  });
}
