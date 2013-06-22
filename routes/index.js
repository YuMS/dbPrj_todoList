
/*
 * GET home page.
 */

exports.index = function(req, res){
    var db = require('../models/db');
    var dbconsts = require('../models/dbconsts');
    require('date-utils')
    db.query(dbconsts.list(), function(err, rows, fields) {
        if (err) console.log('Fetch from database failed.');
//        for (row in rows) {
//            var d = rows[row];
//            if (d.date) {
//                da = d.date;
//                d.date = new Date(Date.UTC(da.getFullYear(), da.getMonth(), da.getDate(), da.getHours(), da.getMinutes(), da.getSeconds()));
//                d.date = d.date.toFormat('YYYY-MM-DD HH24:MI:SS');
//            }
//        }
        res.render('index', { title: 'YuMS', todos: rows});
    });
};