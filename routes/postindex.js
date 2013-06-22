/**
 * Created with JetBrains WebStorm.
 * User: YuMS
 * Date: 13-2-24
 * Time: 下午11:01
 * To change this template use File | Settings | File Templates.
 */

exports.postindex = function(req, res){
    console.log(req.body.valueOf());
    var db = require('../models/db');
    var dbconsts = require('../models/dbconsts');
    switch (req.body.type) {
        case 'toggle': {
            if (req.body.status == 'true') {
                db.query(dbconsts.toggleoff(req.body.id), function(err, rows, fields) {
                    if (err) console.log("Toggle off in database failed");
                    if (rows) {
//                    console.log(rows.valueOf());
                        res.send(rows.valueOf());
                    }
                });
            } else {
                db.query(dbconsts.toggleon(req.body.id), function(err, rows, fields) {
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
            db.query(dbconsts.del(req.body.id), function (err, rows, fields) {
                if (err) console.log("Fetch from database failed");
                console.log(rows.valueOf());
                res.send(rows.affectedRows + "");
            });
            break;
        }
        case 'new': {
            db.query(dbconsts.insert(req.body.text), function (err, rows, fields) {
                if (err) console.log("Fetch from database failed");
                console.log(rows.valueOf());
//                alert('new!');
                res.send(rows.insertId + "");
            });
            break;
        }
    }
};
