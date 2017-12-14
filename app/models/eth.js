const config = require('../../config'),
    options = require('../../options.json'),

    Web3 = require('web3'),
    web3 = new Web3(new Web3.providers.HttpProvider(options.provider)),
    MyContract = new web3.eth.Contract(config.abiArray, config.contractAddr);

web3.eth.accounts.wallet.add({
    privateKey: options.adminPrivKey,
    address: options.adminWalletAddr
});

exports.getGasPrice = async () => {
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

exports.getToken = async (walletAddr) => {
    const balance = await MyContract.methods.balanceOf(walletAddr).call();

    return balance;
}

exports.sendToken = async (addressTo, value, gasPrice) => {
    let transfer = await MyContract.methods.transfer(addressTo, value).send({
        from: web3.eth.accounts.wallet[0].address,
        gasLimit: options.gas, 
        gasPrice: gasPrice
    });

    return transfer; 
}

exports.sendTokenFrom = async (accountFrom, addressTo, value, gasPrice) => {
    const walletFrom = await web3.eth.accounts.wallet.add({
        address: accountFrom.address,
        privateKey: accountFrom.privateKey
    });

    let transfer = await MyContract.methods.transfer(addressTo, value).send({
        from: walletFrom.address,
        gasLimit: options.gas, 
        gasPrice: gasPrice
    });
    
    await web3.eth.accounts.wallet.remove(walletFrom.address);

    return transfer;
}

exports.sendEth = async (addressTo, gasPrice) => {
    let tx = await web3.eth.sendTransaction({
        from: web3.eth.accounts.wallet[0].address, 
        to: addressTo, 
        value: options.gas * gasPrice, 
        gasLimit: 21000, 
        gasPrice: gasPrice
    });

    return tx;
}