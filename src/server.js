const express = require('express');  // for creating a router
const web3 = require('web3');  // interaction with ethereum
const Personal = require('web3-eth-personal');
const Tx = require('ethereumjs-tx');  // for creating transactions
const multer  = require('multer')
const path = require('path');
const IPFS = require('ipfs-http-client');
const LOCALHOST = "http://localhost:8545";

var web3js = new web3(new web3.providers.HttpProvider(LOCALHOST));
var personal = new Personal(Personal.givenProvider || LOCALHOST)
var ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
var upload = multer({ dest: 'uploads/' })  // where the files are stored locally
var app = express();

var hashIPFS;
var hashTransac;


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(express.static(__dirname + '/'));

// ran from http://localhost:8080
app.post('/', upload.single('doc_file'), function (req, res, next) {
  storeOnIPFS(req.file.path, res, storeOnEthereum);
});

app.listen(8080);

// Stores the file addressed by 'file_path' on IPFS and runs storeOnEthereum
// function.
// This function is called when handling a POST request, 'res' is the POST
// response, which will receive its data in 'storeOnEthereum' function.
function storeOnIPFS(file_path, res, storeOnEthereum) {
  fs = require('fs');
  fs.readFile(file_path, function (err, data) {
	if (err) throw err;
	fileBuffer = data;
	ipfs.add(fileBuffer, (err, result) => {
	  if (err) throw err;
	  hashIPFS = result[0].hash;
	  console.log("IPFS hash: " + hashIPFS);
	  storeOnEthereum(hashIPFS, res);
	});
  });
}

// Stores 'data' on Ethereum blockchain and set response data on 'res'
// This function is called in 'storeOnIPFS()', when handling a POST request, so
// 'res' is the POST response.
function storeOnEthereum(data, res){
  // account that will be used to commit transactions.
  const ADDRESS = '0x26330e835742df83dfe17df01e7638a82e2132e2';
  const KEYPSWD = '1234';
 
  //contract abi is the array that you can get from the ethereum wallet or etherscan
  const contractABI = [
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
  
  // the deployed contract address, obtained from Remix IDE
  var contractAddress = '0x06cbb540b57b865a40709279303c8b4ebaf06682';

  // the smart contract instance
  var contract = new web3js.eth.Contract(contractABI, contractAddress);
  web3js.eth.personal.unlockAccount(ADDRESS, KEYPSWD, 0);
  console.log("Account Unlocked!");

  // commit a transaction running 'set()', passing 'data' as parameter.
  // in other words, as 'data' is the hash of the file stored on IPFS, it
  // will be stored on Ethereum blockchain.
  contract.methods.set(data).send({from: ADDRESS}, function(err, result) {
	  if (err) throw err;
	  console.log("TRANSACTION COMMITED!");
	  console.log("Result - transaction id: " + JSON.stringify(result));

	  hashTransac = JSON.stringify(result);
	  res.send(data + ',' + hashTransac);
  });
}
