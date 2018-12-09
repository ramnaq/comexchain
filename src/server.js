const express = require('express');  // creating a router
const web3 = require('web3');  // interaction with ethereum
const Personal = require('web3-eth-personal');
const Tx = require('ethereumjs-tx');  // for creating transactions
const multer  = require('multer')
const path = require('path');
const IPFS = require('ipfs-http-client');
const LOCALHOST = "http://localhost:8545";

var url = LOCALHOST;
var web3js = new web3(new web3.providers.HttpProvider(LOCALHOST));
var personal = new Personal(Personal.givenProvider || LOCALHOST)
var ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
var upload = multer({ dest: 'uploads/' })
var app = express();


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(express.static(__dirname + '/'));

app.post('/', upload.single('doc_file'), function (req, res, next) {
  storeOnIPFS(req.file.path, storeOnEthereum);
});

app.listen(8080);

function storeOnIPFS(file_path, storeOnEthereum) {
  fs = require('fs');
  fs.readFile(file_path, function (err, data) {
	if (err) throw err;
	fbuffer = data;
	ipfs.add(fbuffer, (err, result) => {
	  if (err) throw err;
	  var ipfsFileHash = result[0].hash;
	  console.log("hash: " + ipfsFileHash);
	  storeOnEthereum(ipfsFileHash);
	});
  });
}

function storeOnEthereum(data){
  const ADDRESS = '0x5d5f548953aab7ca0a85d4f2495854d423ecdd0c';
  const KEYPSWD = '1234';
 
  //contract abi is the array that you can get from the ethereum wallet or etherscan
  var contractABI = [
	{
	  "constant": false,
	  "inputs": [{"name": "x","type": "string"}],
	  "name": "set",
	  "outputs": [],
	  "payable": false,
	  "stateMutability": "nonpayable","type": "function"
	},
	{
	  "constant": true,
	  "inputs": [],
	  "name": "get",
	  "outputs": [{"name": "","type": "string"}],
	  "payable": false,
	  "stateMutability": "view",
	  "type": "function"}
  ];
  var contractAddress ="0x04f22226002fcae95b731550e40ace470befe3f0";
  var contract = new web3js.eth.Contract(contractABI, contractAddress);
  web3js.eth.personal.unlockAccount(ADDRESS, KEYPSWD, 0);
  console.log('ACCOUNT UNLOCKED!');
  contract.methods.set(data).send({from: ADDRESS}, function(err, result) {
	  if (err) throw err;
	  console.log('Transaction commited!');
	  console.log('Result: ' + JSON.stringify(result));
  });
}
