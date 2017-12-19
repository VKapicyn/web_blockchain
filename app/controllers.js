//подключаем модели
const eth = require('./models/eth'),
    userModel = require('./models/userModel').userModel,
    adminModel = require('./models/adminModel').adminModel,
    logModel = require('./models/logModel').logModel,

    fs = require('fs');

let options = require('../options.json');

//code = результат операции или ошибки!
exports.createUser = async (req, res) => {
    const userId = req.body.userId;
    let code = 0,
        errorMessage;

    try {
        //проверка в бд на случай если user уже существует
        const foundUser = await userModel.getUser(userId);
        if (foundUser) {
            throw new Error('User wallet already exist!');
        }

        //создание кошелька
        let walletData = await eth.createWallet();
        walletData.userId = userId;
    
        const newWallet = await userModel.addWallet(walletData);
    } catch (e) {
        errorMessage = e.name + ":" + e.message + "\n" + e.stack;
        code = 1;
    }

    res.json({
        code: code,
        error: errorMessage
    });
}

exports.adminSend = async (req, res) => {
    const userId = req.body.userId,
        tokens = req.body.tokens;

    let code = 0,
        errorMessage,
        tx;

    const foundUser = await userModel.getUser(userId),
        gasPrice = await eth.getGasPrice();
    
    //отправка с кошелька админа токенов
    try {
        tx = await eth.sendToken(foundUser.address, tokens, gasPrice);
    } catch(e) {
        errorMessage = e.name + ":" + e.message + "\n" + e.stack;
        code = 2;
    }

    res.json({
        code: code,
        error: errorMessage
    });
}

exports.userSend = async (req, res) => {
    const idFrom = req.body.idFrom,
        idTo = req.body.idTo,
        tokens = req.body.tokens;
        
    let code = 0,
        errorMessage;


    const userFrom = await userModel.getUser(idFrom),
        userTo = await userModel.getUser(idTo),

        gasPrice = await eth.getGasPrice();
        
    
    try {
        //1. Отправка eth с кошелька админа на кошелек idFrom
        await eth.sendEth(userFrom.address, gasPrice);
        //2. Отправка токенов с idFrom на idTo токенов
        await eth.sendTokenFrom(userFrom, userTo.address, tokens, gasPrice);
    } catch (e) {
        errorMessage = e.name + ":" + e.message + "\n" + e.stack;
        code = 2;
    }
    
    res.json({
        code: code,
        error: errorMessage
    });
}

exports.getUserWallet = async (req, res) => {
    if (options.passPhrase == req.params.pass)
    {
        const userId = req.params.id;
        
        let code = 0,
            errorMessage;

        await logModel.newLog('getUserWallet', [userId], 0);
        //вовзрат адреса и приватного ключа от кошелька по id юзера
        let userWallet;
        try {
            userWallet = await userModel.getUser(userId);
            if (userWallet == null) {
                throw new Error('User wallet not found');
            }
        } catch (e) {
            errorMessage = e.name + ":" + e.message + "\n" + e.stack;
            code = 3;
            return res.json({
                code: code,
                error: errorMessage
            });
        }

        await logModel.newLog('getUserWallet', [userId], 1);
        res.json({
            code: code,
            wallet: {
                address: userWallet.address, 
                privateKey: userWallet.privateKey
            }
        });
    }
    else{
        res.json({code: 4, error: 'Incorrect pass phrase'});
    }
        
}

exports.getUserToken = async (req, res) => {
    const userId = req.params.id,
        foundUser = await userModel.getUser(userId);

    let code = 0,
        tokenBalance = 0,
        errorMessage;

    try {
        //возврат числа токенов user'a
        tokenBalance = await eth.getToken(foundUser.address);
    } catch (e) {
        errorMessage = e.name + ":" + e.message + "\n" + e.stack;
        code = 3;
    }

    res.json({
        token: tokenBalance,
        code: code,
        error: errorMessage
    });
}

exports.getGasInfo = async (req, res) => {
    //запрос цены gasprice, и умножение на газ при транзакции
    let price = await eth.getGasPrice();
        
    let _eth = (Number(options.gas)+21000)*price/1000000000000000000,
        usd = await eth.usdPrice()*_eth;

    res.json({
        gwei: price/1000000000, 
        eth: _eth, 
        usd: usd
    });
}

// =============================================================================
// Admin page
// =============================================================================

exports.getLoginPage = (req, res) => {
    if (req.session.admin) {
        return res.redirect('/admin/settings');
    }

    res.render('login.html');
}

exports.login = async (req, res) => {
    if (req.session.admin) {
        return res.redirect('/admin/settings');
    }

    let admin = await adminModel.checkAdmin(req.body.username, req.body.password);
    if (admin === null) {
        let firstConnect = await adminModel.firstConnect();

        if (firstConnect) {
            await adminModel.addAdmin({
                username:req.body.username, 
                password:req.body.password
            });
            admin = await adminModel.checkAdmin(req.body.username, req.body.password);
        }
        else
            return res.redirect('back');
    }

    req.session.admin = {id: admin._id, username: admin.username}

    res.redirect('/admin/settings');
}

exports.logout = (req, res) => {
    delete req.session.admin;
    res.redirect('/admin/login');
}

exports.getSettingsPage = async (req, res) => {
    const logs = await logModel.getLogs();
    res.render('settings.html', {
        options: options,
        logs: logs
    });
}

exports.updateSettings = async (req, res) => {
    options.test = req.body.test;
    options = req.body.edit;
    
        fs.writeFile('./options.json', JSON.stringify(options, null, 4), (err) => {
            eth.changeProvider(options.provider);
    
            res.redirect('/admin/settings');
        })
}

// =============================================================================
// Pages
// =============================================================================

exports.testPage = (req, res) => {
    res.render('test.html');
}