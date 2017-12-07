//подключаем модели
const eth = require('./models/eth'),
    userModel = require('./models/userModel').userModel;

//code = результат операции или ошибки!
exports.createUser = async (req, res) => {
    const userId = req.body.userId;
    let code;

    //проверка в бд на случай если user уже существует
    const foundUser = await userModel.getUser(userId);
    if(!foundUser) {
        //создание кошелька
        let walletData = await eth.createWallet();
        walletData.userId = userId;
    
        const newWallet = await userModel.addWallet(walletData);
        
        code = 1;
    } else {
        code = 0;
    }

    res.json({code: code});
}

exports.adminSend = (req, res) => {
    let userId = req.body.userId,
        tokens = req.body.tokens;

    //отправка с кошелька админа токенов

    res.json({code: code});
}

exports.userSend = (req, res) => {
    let idFrom = req.body.idFrom,
        idTo = req.body.idTp,
        tokens = req.body.tokens;

    //1. Отправка eth с кошелька админа на кошелек idFrom
    //2. Отправка токенов с idFrom на idTo токенов

    res.json({code: code});
}

exports.getUserWallet = async (req, res) => {
    let userId = req.params.id,
        code = 1;

    //вовзрат адреса и приватного ключа от кошелька по id юзера
    let userWallet;
    try {
        userWallet = await userModel.getUser(userId);
        if (userWallet == null) {
            throw new Error('User wallet not found');
        }
    } catch (e) {
        code = 0;
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

exports.getUserToken = (req, res) => {
    let userId = req.body.userId;

    //возврат числа токенов user'a

    res.json({token: token});
}

exports.getGasInfo = async (req, res) => {
    
    //запрос цены gasprice, и умножение на газ при транзакции
    let price = await eth.gasPrice();


    res.json(price);
}