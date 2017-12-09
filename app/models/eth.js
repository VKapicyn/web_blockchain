const Web3 = require('web3');
let abiArray = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_totalSupply","type":"uint256"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

exports.testMethods = async () => {
    //console.log(web3.eth.accounts)
    /*let trns = await web3.eth.sendTransaction({
        from: web3.eth.accounts[0],
        to: web3.eth.accounts[1],
        value: '1000'
    })*/

    let web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/nyxynyx-api-key"));
    
    
    //console.log(trns);
    console.log( await web3.eth.getBalance('0xaa1a698B70E88853A550fecbFF6597849EEF3fdA'));
    let MyContract = new web3.eth.Contract(abiArray,'0x97fc13Cd9E17249E04b72ae22A7D83e1b4c3f8D0')
    let balance = await MyContract.methods.balanceOf('0xaa1a698B70E88853A550fecbFF6597849EEF3fdA').call();
    let trns = '';

    console.log(balance);
    console.log(await web3.eth.getAccounts());
    //console.log()

    return trns;
}

exports.gasPrice = async () => {
    let web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/nyxynyx-api-key'));

    let gasPrice = await web3.eth.getGasPrice();
    //web3.eth.accounts.wallet.create('1');
    //0
    web3.eth.accounts.wallet.add({
        privateKey: '0x1a06173639092b00bf55ca420924a08b5c33d96eccb8bf6b4e3149438c7e71ed',
        address: '0xc0CC75E36eC89b0C85eB43AAF846d2C37717340e'
    });
    //1
    web3.eth.accounts.wallet.add({
        privateKey: 'a8f5674863a76d55bb324575d670ff6ec879f246537f69c135cff90c5e4f2248',
        address: '0xCb4e1a1522E1da5E1A994dC5b900cD845997E6a3'
    });

    //console.log(web3.eth.accounts.wallet[1],web3.eth.accounts.wallet[0]);
    //console.log( await web3.eth.getBalance('0xc0CC75E36eC89b0C85eB43AAF846d2C37717340e'));

    //worked!!!
    let trns = await web3.eth.sendTransaction({
        from: web3.eth.accounts.wallet[0].address, 
        to:web3.eth.accounts.wallet[1].address, 
        value: 124842*gasPrice, 
        gasLimit: 210000, 
        gasPrice: gasPrice
    });
    console.log(trns);

    let MyContract = new web3.eth.Contract(abiArray,'0x36b71d7e49535994986850fd4bfaa777ae3a4007');
    //let balance = await MyContract.methods.balanceOf('0xc0CC75E36eC89b0C85eB43AAF846d2C37717340e').call();
    //console.log(balance);

    let transfer = await MyContract.methods.transfer('0xaa1a698B70E88853A550fecbFF6597849EEF3fdA', 500).send({
        from: web3.eth.accounts.wallet[1].address,
        gasLimit: 124842, 
        gasPrice: gasPrice
    });

    console.log(transfer);



    return gasPrice; 
}
