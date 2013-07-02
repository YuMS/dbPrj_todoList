/**
 * Author: zhoutall
 */

var validator = require('validator')
  , async = require('async')
  // , dbMgr = require('../models/dbMgrLocal')
  , dbMgr = require('../models/dbMgrMySQL')
  , ceh = require('../models/commonErrHandler')
  , db = require('../models/db')
  , dbconsts = require('../models/dbconsts');

/*
 * GET home page.
 */

exports.index = {
    get: function(req, res) {
        var groups;
        var uid;
        var gid = req.query.gid || 0;
        if (!req.user) {
            uid = 0;
        } else {
            uid = req.user.uid || 0;
        }
        dbMgr.findGroupByUid(uid, function(err, rows) {
            if (err) {
                console.log('find groups from database failed.');
                return res.render('error', {user: req.user, message: err});
            }
            groups = rows;
            dbMgr.listTodo(gid, uid, function(err, rows) {
                if (err) {
                    console.log('list todos from database failed.');
                    return res.render('error', {user: req.user, message: err});
                }
                res.render('index', { user: req.user, groups: groups, todos: rows, gid: gid});
            });
        });
    },
    post: function(req, res) {
        res.redirect('/');
    }
};

exports.todo = {
    get: function(req, res) {
        res.redirect('/');
    },
    post: function(req, res) {
        console.log(req.body.valueOf());
        var db = require('../models/db');
        var dbconsts = require('../models/dbconsts');
        var connection = db.getConnection();
        switch (req.body.type) {
            case 'toggle': {
                if (req.body.status == 'true') {
                    dbMgr.toggleOffTodo(req.body.id, function(err, rows) {
                        if (err) {
                            console.log("Toggle off todo in database failed");
                            console.log(err.valueOf());
                            return res.render('error', {user: req.user, message: err});
                        }
                        if (rows) {
                            //console.log(rows.valueOf());
                            res.send(rows.valueOf() + "");
                        }
                    });
                } else {
                    dbMgr.toggleOnTodo(req.body.id, function(err, rows) {
                        if (err) {
                            console.log("Toggle on todo in database failed");
                            console.log(err.valueOf());
                            return res.render('error', {user: req.user, message: err});
                        }
                        if (rows) {
                            //console.log(rows.valueOf());
                            res.send(rows.valueOf() + "");
                        }
                    });
                }
                break;
            }
            case 'delete': {
                dbMgr.deleteTodo(req.body.id, function(err, rows) {
                    if (err) {
                        console.log("Delete todo from database failed");
                        console.log(err.valueOf());
                        return res.render('error', {user: req.user, message: err});
                    }
                    console.log(rows.valueOf());
                    res.send(rows.affectedRows + "");
                });
                break;
            }
            case 'insert': {
                dbMgr.insertTodo(req.body, req.user, function(err, rows) {
                    if (err) {
                        console.log("Insert todo into database failed");
                        console.log(err.valueOf());
                        return res.render('error', {user: req.user, message: err});
                    }
    //                alert('new!');
                    res.send(rows.insertId + "");
                });
                break;
            }
        }
    }
};

exports.login = {
    get: function(req, res) {
        if(req.user)
            return res.redirect('/');
        res.render('login', { user: req.user, status: req.flash('error') });
    },
    post: function(req, res) {
        res.redirect('/');
    }
};

exports.signup = {
    get: function(req, res) {
        res.render('signup', { user: req.user, status: req.flash('error') });
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
            return res.render('signup', {status: '2'});  //创建用户失败
        }

        dbMgr.findUserByName(name, function(err, user) {
            if (!err) { 
                return res.render('signup', {status: '1'}); //用户名已存在
            }
            dbMgr.createUser(name, password, email, function(err, uid) {
                if (ceh(req, res, err, {status: '2'}, 'signup'))  return '?'; //创建用户失败
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
