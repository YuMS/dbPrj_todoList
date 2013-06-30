var 
    validator = require('validator')
  , accountMgr = require('../models/accountMgrLocal')
  , ceh = require('../models/commonErrHandler');
/*
 * GET home page.
 */

exports.index = function(req, res) {
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
        res.render('index', { user: req.user, todos: rows});
    });
};

exports.login = {
    get: function(req, res) {
        if(req.user)
            return res.redirect('/profile');
        res.render('login', { user: req.user, status: req.flash('error') });
    },
    post: function(req, res) {
        res.redirect('/profile');
    }
};

exports.register = {
    get: function(req, res) {
        res.render('register', { user: req.user, status: req.flash('error') });
    },
    post: function(req, res) {
        var name=validator.sanitize(req.param("name")).trim(); //trim
        var password=req.param("password");
        var email=validator.sanitize(req.param("email")).trim();//trim
        
        try{
            validator.check(email).len(6, 64).isEmail();
            validator.check(name).len(4).is(/^[\w\!\@\#\$\%\&\^\*\+\-\=\.\~\_]+$/);
            validator.check(password).len(6);
        } catch(e){
            return res.render('register', {status: '2'});  //创建用户失败
        }

        accountMgr.findUserByName(name, function(err, user) {
            if (!err) { 
                return res.render('register', {status: '1'}); //用户名已存在
            }
            accountMgr.createUser(name, password, email, function(err, uid) {
                if (ceh(req, res, err, {status: '2'}, 'register'))  return '?'; //创建用户失败
                return res.render('login', {status: '3'}); //创建用户成功
            });
        });
    }
};

exports.logout = {
    get: function(req, res) {
        req.logout();
        res.redirect('/');
    }
};
