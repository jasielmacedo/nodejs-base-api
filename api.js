var express = require('express');
require('dotenv').config();

var app = express();
var host = process.env.HOST || "127.0.0.1";
var port = process.env.PORT || 8044;


require('./src/bootstrap.js')(app,host,port,__dirname);

exports = module.exports = app;