const Web3 = require('web3'),
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/nyxynyx-api-key")),
    abiArray = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_totalSupply","type":"uint256"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}],
    MyContract = new web3.eth.Contract(abiArray,'0x97fc13Cd9E17249E04b72ae22A7D83e1b4c3f8D0'),
    Tx = require('ethereumjs-tx'),
    addressFrom = '0xaa1a698B70E88853A550fecbFF6597849EEF3fdA',
    privKey = '789dc972d811aadc40d95df6d86017b1d00f75a5583fb4b128f3ff6cd9ec133c',
    addressTo = '0xd24756382C191Ce6FEf6865D63011f774a6a894c';

exports.gasPrice = async () => {
    let gasPrice = await web3.eth.getGasPrice();

    return gasPrice;
}

exports.createWallet = async () => {
    const wallet = await web3.eth.accounts.create();

    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

exports.sendEth = async () => {
    // var privateKey = new Buffer('789dc972d811aadc40d95df6d86017b1d00f75a5583fb4b128f3ff6cd9ec133c', 'hex')

    // =========================================================================
    // Maybe this works?7? YEEEEAH IT WORKS!!!
    // OMAGAD!11!!1!
    // =========================================================================

    // Signs the given transaction data and sends it. Abstracts some of the details 
    // of buffering and serializing the transaction for web3.
    function sendSigned(txData, cb) {
        const privateKey = new Buffer(privKey, 'hex');
        const transaction = new Tx(txData);
        transaction.sign(privateKey);
        const serializedTx = transaction.serialize().toString('hex');
        web3.eth.sendSignedTransaction('0x' + serializedTx, cb);
    }

    // get the number of transactions sent so far so we can create a fresh nonce
    web3.eth.getTransactionCount(addressFrom).then(txCount => {

        // console.log(await web3.eth.getBalance(addressFrom));
        // construct the transaction data
        const txData = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(25000),
            gasPrice: web3.utils.toHex(10e9), // 10 Gwei
            to: addressTo,
            from: addressFrom,
            value: web3.utils.toHex(web3.utils.toWei('123', 'wei'))
          }

        // fire away!
        sendSigned(txData, function(err, result) {
            if (err) return console.log('error', err)
            console.log('sent', result)
        });

    });
}

exports.sendTokens = async () => {
    var data = MyContract.transfer.getData("0x2...", 10000, {from: "0x9..."});
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 90000;
    
    var rawTransaction = {
      "from": "0x9...",
      "nonce": web3.toHex(count),
      "gasPrice": web3.toHex(gasPrice),
      "gasLimit": web3.toHex(gasLimit),
      "to": "0x2...",
      "value": "0x1",
      "data": data,
      "chainId": 0x03
    };
    
    var privateKey = new Buffer(privKey, 'hex');
    var tx = new Tx(rawTransaction);
    
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    
    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
      if (!err)
          console.log(hash);
      else
          console.log(err);
    });
}
