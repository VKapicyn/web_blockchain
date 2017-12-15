const config = require('../../config'),
    options = require('../../options.json'),

    logModel = require('../models/logModel').logModel,

    Web3 = require('web3'),
    web3 = new Web3(new Web3.providers.HttpProvider(options.provider)),
    MyContract = new web3.eth.Contract(config.abiArray, config.contractAddr);

web3.eth.accounts.wallet.add({
    privateKey: options.adminPrivKey,
    address: options.adminWalletAddr
});

exports.getGasPrice = async () => {
    await logModel.newLog('getGasPrice', [], 0);

    let gasPrice = await web3.eth.getGasPrice();
    
    await logModel.newLog('getGasPrice', [], 1);

    return gasPrice;
}

exports.createWallet = async () => {
    await logModel.newLog('createWallet', [], 0);

    const wallet = await web3.eth.accounts.create();

    await logModel.newLog('createWallet', [], 1);

    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

exports.getToken = async (walletAddr) => {
    await logModel.newLog('getToken', [walletAddr], 0);
    const balance = await MyContract.methods.balanceOf(walletAddr).call();

    await logModel.newLog('getToken', [walletAddr], 1);
    return balance;
}

exports.sendToken = async (addressTo, value, gasPrice) => {
    await logModel.newLog('sendToken', [addressTo, value, gasPrice], 0);

    let transfer = await MyContract.methods.transfer(addressTo, value).send({
        from: web3.eth.accounts.wallet[0].address,
        gasLimit: options.gas, 
        gasPrice: gasPrice
    });

    await logModel.newLog('sendToken', [addressTo, value, gasPrice], 1);

    return transfer; 
}

exports.sendTokenFrom = async (accountFrom, addressTo, value, gasPrice) => {
    await logModel.newLog('sendTokenFrom', [accountFrom, addressTo, value, gasPrice], 0);

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

    await logModel.newLog('sendTokenFrom', [accountFrom, addressTo, value, gasPrice], 1);

    return transfer;
}

exports.sendEth = async (addressTo, gasPrice) => {
    await logModel.newLog('sendEth', [addressTo, gasPrice], 0);

    let tx = await web3.eth.sendTransaction({
        from: web3.eth.accounts.wallet[0].address, 
        to: addressTo, 
        value: options.gas * gasPrice, 
        gasLimit: 21000, 
        gasPrice: gasPrice
    });

    await logModel.newLog('sendEth', [addressTo, gasPrice], 1);

    return tx;
}

exports.changeProvider = (newProvider) => {
    web3.setProvider(newProvider);
}