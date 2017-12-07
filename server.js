const express = require('express'),
    nunjucks = require('nunjucks'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    app = express();

let login = require('./config').dbLogin,
    pass = require('./config').dbPass,
    adress = require('./config').dbAdress,
    dbName = require('./config').dbName,
    dbPort = require('./config').dbPort,
    //url = 'mongodb://'+login+':'+pass+'@'+adress+':'+dbPort + '/' + dbName;
    url = 'mongodb://localhost:27017/ExampleDB';

mongoose.Promise = global.Promise;
//mongoose.connect(url, {useMongoClient: true});
module.exports.mongoose = mongoose;


/*app.use(    
session(
    ({
        secret: require('./config.js').session,
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({ 
            url: url
        })
    })
));*/

app.use(
    express.static(__dirname + '/src'),
    bodyParser(),
    cookieParser(),
);

nunjucks.configure(__dirname + '/src/view', {
    autoescape: true,
    cache: false,
    express: app
});

app.use('/', require('./router'));
app.listen(require('./config.js').port);

console.log('Server started!');