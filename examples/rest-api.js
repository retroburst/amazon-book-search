var express = require('express');
var app = express();
var ABS = require('../.');

var abs = new ABS({awsKey:'AKIAI6HXKAF4PMFLG65A',awsSecret:'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'});

app.use(express.json());
app.use(express.urlencoded());
app.use(express.logger('dev'));
app.get('/search',abs.middleware());

app.listen(3000);

console.log('Go to http://localhost:3000/search, try http://localhost:3000/search?q=porn or more at http://localhost:3000/search?q=porn&page=2');

module.exports = app;