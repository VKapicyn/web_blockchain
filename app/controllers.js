//подключаем модели
const eth = require('./models/eth'),
    userModel = require('./models/userModel').userModel,
    adminModel = require('./models/adminModel').adminModel,
    fs = require('fs'),
    options = require('../options.json');

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
        tx = await eth.sendToken(foundUser.address, tokens);
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
    const userId = req.params.id;
        
    let code = 0,
        errorMessage;

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

    res.json({
        code: code,
        wallet: {
            address: userWallet.address, 
            privateKey: userWallet.privateKey
        }
    });
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

    res.json({price: price});
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

    const admin = await adminModel.checkAdmin(req.body.username, req.body.password);
    if (admin === null) {
        return res.redirect('back');
    }

    req.session.admin = {id: admin._id, username: admin.username}

    res.redirect('/admin/settings');
}

exports.logout = (req, res) => {
    delete req.session.admin;
    res.redirect('/admin/login');
}

exports.getSettingsPage = (req, res) => {
    res.render('settings.html', {options: options});
}

exports.updateSettings = async (req, res) => {
    options.test = req.body.test;
}