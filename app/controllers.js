//подключаем модели
const eth = require('./models/eth');

//code = результат операции или ошибки!
exports.createUser = (req, res) => {
    let userId = req.body.userId;

    //проверка в бд на случай если user уже существует
    if(true) {
        //создание кошелька
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

exports.getUserWallet = (req, res) => {
    let userId = req.body.userId;

    //вовзрат адреса и приватного ключа от кошелька по id юзера

    res.json({
        code: code, 
        wallet: wallet, 
        privateKey: key
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