//подключаем модели
const eth = require('./models/eth'),
    userModel = require('./models/userModel').userModel;

//code = результат операции или ошибки!
exports.createUser = async (req, res) => {
    const userId = req.body.userId;
    let code = 0;

    //проверка в бд на случай если user уже существует
    const foundUser = await userModel.getUser(userId);
    if(!foundUser) {
        //создание кошелька
        let walletData = await eth.createWallet();
        walletData.userId = userId;
    
        const newWallet = await userModel.addWallet(walletData);
        
        code = 0;
    } else {
        code = 1;
    }

    res.json({code: code});
}

exports.adminSend = async (req, res) => {
    let userId = req.body.userId,
        tokens = req.body.tokens,
        code = 0,
        tx;

    const foundUser = await userModel.getUser(userId);
    //отправка с кошелька админа токенов
    try {
        tx = await eth.sendToken(foundUser.address, tokens);
    } catch(e) {
        code = 1;
    }

    res.json({code: code});
}

exports.userSend = async (req, res) => {
    let idFrom = req.body.idFrom,
        idTo = req.body.idTo,
        tokens = req.body.tokens,
        code = 0;

    const userFrom = await userModel.getUser(idFrom),
        userTo = await userModel.getUser(idTo);

    //1. Отправка eth с кошелька админа на кошелек idFrom
    await eth.sendEth(userFrom.address);
    //2. Отправка токенов с idFrom на idTo токенов
    await eth.sendTokenFrom(userFrom, userTo.address, tokens);

    res.json({code: code});
}

exports.getUserWallet = async (req, res) => {
    let userId = req.params.id,
        code = 0;

    //вовзрат адреса и приватного ключа от кошелька по id юзера
    let userWallet;
    try {
        userWallet = await userModel.getUser(userId);
        if (userWallet == null) {
            throw new Error('User wallet not found');
        }
    } catch (e) {
        code = 1;
        return res.json({
            code: code
        });
    }

    res.json({
        code: code, 
        wallet: userWallet.address, 
        privateKey: userWallet.privateKey
    });
}

exports.getUserToken = async (req, res) => {
    let userId = req.params.userId;

    const foundUser = userModel.getUser(userId);

    //возврат числа токенов user'a
    const tokenBalance = await eth.getToken(foundUser.address);

    res.json({token: tokenBalance});
}

exports.getGasInfo = async (req, res) => {
    
    //запрос цены gasprice, и умножение на газ при транзакции
    let price = await eth.getGasPrice();

    res.json(price);
}