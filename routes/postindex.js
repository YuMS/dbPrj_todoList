/**
 * Author: YuMS
 */

exports.postindex = function(req, res){
    console.log(req.body.valueOf());
    var db = require('../models/db');
    var dbconsts = require('../models/dbconsts');
    var connection = db.getConnection();
    switch (req.body.type) {
        case 'toggle': {
            if (req.body.status == 'true') {
                connection.query(dbconsts.toggleoff(req.body.id), function(err, rows, fields) {
                    if (err) console.log("Toggle off in database failed");
                    if (rows) {
//                    console.log(rows.valueOf());
                        res.send(rows.valueOf());
                    }
                });
            } else {
                connection.query(dbconsts.toggleon(req.body.id), function(err, rows, fields) {
                    if (err) console.log("Toggle on in database failed");
                    if (rows) {
//                    console.log(rows.valueOf());
                        res.send(rows.valueOf());
                    }
                });
            }
            break;
        }
        case 'delete': {
            connection.query(dbconsts.del(req.body.id), function (err, rows, fields) {
                if (err) console.log("Fetch from database failed");
                console.log(rows.valueOf());
                res.send(rows.affectedRows + "");
            });
            break;
        }
        case 'new': {
            connection.query(dbconsts.insert(req.body.text), function (err, rows, fields) {
                if (err) console.log("Fetch from database failed");
                console.log(rows.valueOf());
//                alert('new!');
                res.send(rows.insertId + "");
            });
            break;
        }
    }
};
