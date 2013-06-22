var settings = require('../settings');
var mysql = require('mysql');
var db = mysql.createConnection({
    host: settings.HOST,
    user: settings.MYSQL_USER,
    password: settings.MYSQL_PASS
});
db.connect();
module.exports = db;
