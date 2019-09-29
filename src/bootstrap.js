const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const constants = require('./config/constants');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const AuthGuard = require("./config/authguard");
const Acl = require("acl");
const Debug = require('debug')('bootstrap');
const fileUpload = require('express-fileupload');
const express = require('express');
const path = require('path');

module.exports = function(app,host,port,rootDir)
{
    var corsOptions = 
    {
        origin: ["http://localhost:4200"],
        allowedHeaders : ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "x-web-access-token"],
        credentials : true,
        optionsSuccessStatus : 200
    }

    app.use(cors(corsOptions));

    /*****Body Parser ******/
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    /*** Security ***/
    app.use(helmet());


    /** config mongoose */
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);

    var configDB = require('./config/database');

    var db = mongoose.connect(configDB.url, {useNewUrlParser: true, useUnifiedTopology : true})
        .then(()=>{
            Debug('MongoDB Connection started');

            // acl
            var acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db,'acl_'));
            AuthGuard.createPermissions(acl);
            app.use( function(req, res, next) {
                req.acl = acl;
                next();
            }); 

            /** passport **/
            require('./config/passport')(passport);

            /*** Session ***/
            //app.set('trust proxy', 1) // trust first proxy
            app.use(session({
                secret: constants.session_secret,
                store : new MongoStore({ 
                    mongooseConnection: mongoose.connection, 
                    autoRemove: 'interval',
                    autoRemoveInterval: 120
                }),
                resave: false,
                saveUninitialized: true,
                name : 'SSPGID',
                cookie  : { maxAge  : 24 * 60 * 60 * 1000 }
            }));

            // serve public files with /static
            app.use("/static", express.static(path.join(rootDir, 'public')));

            /** push notification */
            require('./config/push.js')(app);

            /*** Passport ***/
            app.use(passport.initialize());
            app.use(passport.session()); // persistent login sessions
            //app.use(flash()); // use connect-flash for flash messages stored in session
            
            app.use(fileUpload({
                    useTempFiles : true,
                    tempFileDir : '/tmp/'
            }));

            require('./routes/routes.js')(app, passport); 
            require('./config/recovery')(acl);

            /*** Start Application  */
            app.application = app.listen(port,host);
            Debug('Running in http://'+host+':' + port);

        }).catch(err=>{
            Debug('Error during application process');
            Debug(err);
        });

    

    /*** Log dev */
    app.use(morgan('dev'));

    /**** Header Rewrite ****/
    app.disable('x-powered-by');
}