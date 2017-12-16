let express = require('express'),
    router = express.Router(),

    controllers = require('./app/controllers');
    middleware = require('./app/middleware');

router.post('/create/user', middleware.isPassPhrase, controllers.createUser);
router.post('/send/admin', middleware.isPassPhrase, controllers.adminSend);
router.post('/send/user', middleware.isPassPhrase, controllers.userSend);
router.get('/wallet/:id/:pass', controllers.getUserWallet);
router.get('/token/:id', controllers.getUserToken);
router.get('/price', controllers.getGasInfo);

router.get('/test', controllers.testPage);

//admin page
router.get('/admin/login', controllers.getLoginPage);
router.post('/admin/login', controllers.login);
router.get('/admin/logout', controllers.logout);

router.get('/admin/settings', middleware.isAdminLogged, controllers.getSettingsPage);
router.post('/admin/settings', middleware.isAdminLogged, controllers.updateSettings);

module.exports = router;