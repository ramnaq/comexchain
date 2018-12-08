const IPFS = require('ipfs-api');
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5081, protocol: 'https'});

export default ipfs;
