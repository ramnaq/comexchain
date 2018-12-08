pragma solidity ^0.5.0

contract ComexDocStorage {

  string ipfsHash;
 
  function set(string x) public {
	ipfsHash = x; 
  }

  function get() public view returns (string) {
	return ipfsHash;
  }

}
