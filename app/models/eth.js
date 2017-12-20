const config = require('../../config'),
    options = require('../../options.json'),
    _request = require('request-promise'),

    logModel = require('../models/logModel').logModel,

    Web3 = require('web3'),
    web3 = new Web3(new Web3.providers.HttpProvider(options.provider)),
    MyContract = new web3.eth.Contract(config.abiArray, config.contractAddr);

module.exports.web3 = web3;

    let proxyAcc = require('../models/proxyAcc');
    
    proxyAcc.init();

exports.getGasPrice = async () => {
    await logModel.newLog('getGasPrice', [], 0);

    let gasPrice = await web3.eth.getGasPrice();
        gasPrice = Math.ceil(Number(gasPrice) * Number(options.kf));
    
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

    let adminWallet = proxyAcc.getAdminAcc();

    if (adminWallet===null)
        return null;

    let _adminWallet = await web3.eth.accounts.wallet.add({
            adress: adminWallet.address,
            privateKey: adminWallet.privateKey
        }),

        transfer = await MyContract.methods.transfer(addressTo, value).send({
            //TODO: admin send
            from: _adminWallet.address,
            gasLimit: options.gas, 
            gasPrice: gasPrice
        });
    proxyAcc.removeInUsing(_adminWallet.address);

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

    let adminWallet = proxyAcc.getAdminAcc();

    if (adminWallet===null)
        return null;

    let _adminWallet = await web3.eth.accounts.wallet.add({
            adress: adminWallet.address,
            privateKey: adminWallet.privateKey
        }),
        tx = await web3.eth.sendTransaction({
            //TODO: admin send
            from: _adminWallet.address, 
            to: addressTo, 
            value: options.gas * gasPrice, 
            gasLimit: 21000, 
            gasPrice: gasPrice
        });
    proxyAcc.removeInUsing(_adminWallet.address);

    await logModel.newLog('sendEth', [addressTo, gasPrice], 1);

    return tx;
}

exports.usdPrice = async () => {
    let url = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YourApiKeyToken',
        data;

    let response = await _request({
        url: url,
        json: true
    });
        
    data = JSON.parse(JSON.stringify(response['result']));

    let res = data.ethusd;
    return res;
} 

exports.changeProvider = (newProvider) => {
    web3.setProvider(newProvider);
}

exports.sync = async () => {
    let obj = {
        1: await web3.eth.isSyncing(),
        2: await web3.eth.getBlock('latest')
    }
    return obj;
}
