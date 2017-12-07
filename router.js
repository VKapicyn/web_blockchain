let express = require('express'),
    router = express.Router();

router.post('/create/user', require('./app/controllers').createUser);
router.post('/send/admin', require('./app/controllers').adminSend);
router.post('/send/user', require('./app/controllers').userSend);
router.get('/wallet/:id', require('./app/controllers').getUserWallet);
router.get('/token/:id', require('./app/controllers').getUserToken);
router.get('/price', require('./app/controllers').getGasInfo);

module.exports = router;