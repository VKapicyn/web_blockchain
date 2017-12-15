const options = require('../options.json');

exports.isAdminLogged = (req, res, next) => {
    if (req.session.admin) {
        return next();
    }

    res.redirect('/admin/login');
}

exports.isPassPhrase = (req, res, next) => {
    if (req.body.passPhrase == options.passPhrase) {
        return next();
    }
    
    res.redirect('back');
}