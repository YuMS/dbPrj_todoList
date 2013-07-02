/**
 * Author: YuMS
 */

var db = require('./db');
var settings = require('../settings');
//var esc = connection.escape;

var defaultCallback = function(callback) {
    return function(err, rows) {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    }
}
var dbMgr = {
    findUserByUid: function(uid, callback) {
        console.log('findUserByUid');
        var connection = db.getConnection();
        connection.query('SELECT * FROM ' + settings.USERTABLE + ' WHERE UID = ? LIMIT 1', [uid], function(err, rows) {
            if (err) {
                console.log('Query in user table failed.')
                return callback(err);
            }
            if (rows[0]) {
                // console.log(rows[0].valueOf());
                callback(null, rows[0]);
            } else {
                // console.log('id not exist');
                callback(new Error('User ' + id + ' does not exist'));
            }
        });
    },

    findUserByName: function(name, callback) {
        console.log('findUserByName');
        var connection = db.getConnection();
        connection.query('SELECT * FROM ' + settings.USERTABLE + ' WHERE NAME = ? LIMIT 1', [name], function(err, rows) {
            if (err) {
                console.log('Query in user table failed.')
                return callback(err);
            }
            if (rows[0]) {
                // console.log(rows[0].valueOf());
                callback(null, rows[0]);
            } else {
                // console.log('User ' + name + ' not exist');
                callback('2');
            }
        });
    },

    createUser: function(name, password, email, callback){
        console.log('createUser');
        if (name == undefined || password == undefined || email == undefined) {
            callback(new Error('createUser: Lack of parameter'));
        }
        var newUser = {
            name: name,
            password: password,
            email: email,
        };
        var connection = db.getConnection();
        connection.query('INSERT INTO ' + settings.USERTABLE + ' SET ?', newUser, function(err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result.insertId);
        });
    },

    toggleOnTodo: function(tid, callback) {
        console.log('togglingOnTodo');
        var q = 'UPDATE ' + settings.TODOTABLE + ' SET `done`=\'1\' WHERE `tid`= ?';
        var connection = db.getConnection();
        connection.query(q, [tid], defaultCallback(callback));
    },

    toggleOffTodo: function(tid, callback) {
        console.log('togglingOffTodo');
        var q = 'UPDATE ' + settings.TODOTABLE + ' SET `done`=\'1\' WHERE `tid`= ?';
        var connection = db.getConnection();
        connection.query(q, [tid], defaultCallback(callback));
    },

    deleteTodo: function(tid, callback) {
        console.log('deleteTodo');
        var q = 'DELETE FROM ' + settings.TODOTABLE + ' WHERE `tid` = ?';
        var connection = db.getConnection();
        connection.query(q, [tid], defaultCallback(callback));
    },

    insertTodo: function(body, user, callback) {
        console.log('insertTodo');
        var d = new Date();
        if (user == undefined) {
            user = 0;
        } else {
            user = user.uid || 0;
        }
        d = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
        var newTodo = {
            data: body.text || "",
            date: d.toFormat('YYYY-MM-DD HH24:MI:SS'),
            uid: user,
            gid: body.gid || 0,
            done: 0,
        };
        var q = 'INSERT INTO ' + settings.TODOTABLE + ' SET ?';
        // console.log(newTodo.valueOf());
        // console.log(q);
        var connection = db.getConnection();
        connection.query(q, newTodo, defaultCallback(callback));
    },

    listTodo: function(gid, uid, callback) {
        console.log('listTodo');
        if (gid == undefined || uid == undefined) {
            return callback(new Error('lack of parameters'));
        }
        var connection = db.getConnection();
        var q = 'SELECT gid FROM ' + settings.USERINGROUPTABLE + ' WHERE uid = ' + connection.escape(uid) + ' AND gid = ' + connection.escape(gid);
        connection.query(q, function(err, rows) {
            if (err) {
                return callback(err);
            }
            //TODO: hardcoded 0 to be public group, bad in flexibility
            if (!rows.length && gid != 0) {
                return callback(new Error('you have no permission to this group'));
            }
            var q = 'SELECT ' + settings.TODOTABLE + '.*, name FROM ' + settings.TODOTABLE + ', ' + settings.USERTABLE + ' WHERE todo.uid = user.uid AND todo.gid = ? order by tid desc';
            var connection = db.getConnection();
            connection.query(q, [gid], defaultCallback(callback));
        })
    },

    findGroupByUid: function(uid, callback) {
        console.log('findGroupByUid');
        uid = uid || 0;
        var q = 'SELECT * FROM ' + settings.GROUPTABLE + ', ' + settings.USERINGROUPTABLE + ' WHERE ' + settings.USERINGROUPTABLE + '.gid = ' + settings.GROUPTABLE + '.gid AND (uid = ? OR privacy=3) order by ' + settings.GROUPTABLE + '.gid asc';
        var connection = db.getConnection();
        connection.query(q, [uid], defaultCallback(callback));
    },

    //TODO: check this!! Havn' t been used!
    setPrjByUid: function(uid, prj, callback) {
        console.log('setPrjByUid');
        var connection = db.getConnection();
        connection.query('UPDATE ' + settings.USERTABLE + ' SET ? WHERE `uid` = ' + connection.escape(uid), {inproject: prj}, function(err, results) {
            if (err) {
                callback(err);
            } else if (results.affectedRows) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        });
    },

    findPrjByUid: function(uid, callback) {
        console.log('findPrjByUid');
        var connection = db.getConnection();
        connection.query('SELECT * FROM ' + settings.PRJTABLE + ' WHERE `uid` = ?', [uid], function(err, rows) {
            if (err) {
                callback(err);
            } else {
//                console.log('findPrjByUid get ', rows);
                callback(null, rows);
            };
        });
    },

    findPrjByPid: function(pid, callback) {
        console.log('findPrjByPid');
        var connection = db.getConnection();
        connection.query('SELECT * FROM ' + settings.PRJTABLE + ' WHERE `pid` = ? LIMIT 1', [pid], function(err, rows) {
            if (err) {
                callback(err);
            } else {
//                console.log('findPrjByPid get ', rows[0]);
                callback(null, rows[0]);
            };
        });
    },

    findPrjMaxViewed: function(n, callback) {
        console.log('findPrjMaxViewed');
        var connection = db.getConnection();
        connection.query('SELECT * FROM ' + settings.PRJTABLE + ' JOIN ' + settings.USERTABLE + ' ON ' + settings.PRJTABLE + '.uid = ' + settings.USERTABLE + '.uid WHERE privacy = 0 AND pid in (select pid from ' + settings.SUMMARYTABLE + ') ORDER BY viewed desc LIMIT 0, ?', [n], function(err, rows){
            if (err) {
                callback(err);
            } else {
                callback(null, rows);
            }
        });
    }, 
    findMemosByPid: function(pid, callback) {
        console.log('findMemosByPid');
        var connection = db.getConnection();
        connection.query('SELECT * FROM ' + settings.MEMOTABLE + ' WHERE `pid` = ?', [pid], function(err, rows) {
            if (err) {
                callback(err);
            } else {
//                console.log('findMemosByPid get ', rows);
                callback(null, rows);
            };
        });
    },

    findSummaryByPid: function(pid, callback) {
        console.log('findSummaryByPid');
        var connection = db.getConnection();
        connection.query('SELECT * FROM ' + settings.SUMMARYTABLE + ' WHERE `pid` = ? LIMIT 1', [pid], function(err, rows) {
            if (err) {
                callback(err);
            } else {
                if (rows[0]) {
//                    console.log('findSummaryByPid get ', rows[0]);
                    callback(null, rows[0]);
                } else {
//                    console.log('findSummaryByPid get nothing');
                    callback(null, null);
                }
            };
        });
    },

    findSelfRandomSummary: function(uid, callback) {
        console.log('findSelfRandomSummary');
        var connection = db.getConnection();
        connection.query('SELECT COUNT(*) AS cnt FROM ' + settings.PRJTABLE + ' WHERE pid in (select pid from ' + settings.SUMMARYTABLE + ' where uid = ?)', [uid], function(err, rows){
            if (err) {
                return callback(err);
            }
            var rand = Math.floor(Math.random() * rows[0].cnt);
            connection.query('SELECT pid FROM ' + settings.PRJTABLE + ' WHERE pid in (select pid from ' + settings.SUMMARYTABLE + ' where uid = ?) LIMIT ' + connection.escape(rand) + ', 1', [uid], function(err, rows) {
                if (err) {
                    return callback(err);
                }
                if (rows[0]) {
                    return callback(null, rows[0].pid);
                } else {
                    return callback('You have no summary');
                }
            });
        });
    },

    findOthersRandomSummary: function(uid, callback) {
        console.log('findOthersRandomSummary');
        var connection = db.getConnection();
        connection.query('SELECT COUNT(*) AS cnt FROM ' + settings.PRJTABLE + ' WHERE pid in (select pid from ' + settings.SUMMARYTABLE + ' where uid != ?) AND privacy = 0', [uid], function(err, rows){
            if (err) {
                return callback(err);
            }
            var rand = Math.floor(Math.random() * rows[0].cnt);
            connection.query('SELECT pid FROM ' + settings.PRJTABLE + ' WHERE pid in (select pid from ' + settings.SUMMARYTABLE + ' where uid != ?) AND privacy = 0 LIMIT ' + connection.escape(rand) + ', 1', [uid], function(err, rows) {
                if (err) {
                    return callback(err);
                }
                if (rows[0]) {
                    return callback(null, rows[0].pid);
                } else {
                    return callback('No summary is open to public');
                }
            });
        });
    },
    createPrj: function(uid, pname, privacy, callback) {
        console.log('createPrj');
        //TODO: this statement requires all uid are larger than 0, check this
        if (!uid || !pname || privacy == undefined || privacy == null) {
            callback(new Error('Lack of parameters'));
        }
        var newPrj = {
            uid: uid,
            pname: pname,
            ctime: new Date(),
            mtime: new Date(),
            privacy: privacy,
            modified: 0,
            viewed: 0
        }
        var connection = db.getConnection();
        connection.query('INSERT INTO ' + settings.PRJTABLE + ' SET ?', newPrj, function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results.insertId);
            }
        });
    },

    updatePrj: function(pid, pname, privacy, callback) {
        console.log('updatePrj');
        var updatedProject = new Object();
        if (pname) {
            updatedProject.pname = pname;
        }
        if (privacy != undefined && privacy != null && privacy >= 0) {
            updatedProject.privacy = privacy;
        }
        var connection = db.getConnection();
//        console.log('updatePrj: QUERY: ' + 'UPDATE ' + settings.PRJTABLE + ' SET ? WHERE `pid` = ' + connection.escape(pid));
        connection.query('UPDATE ' + settings.PRJTABLE + ' SET ? WHERE `pid` = ' + connection.escape(pid), updatedProject, function(err, results) {
            if (err) {
                callback(err);
            } else if (results.affectedRows) {
                callback(null, true);
            } else {
                callback(new Error('updatePrj: Can` t find project'));
            }
        });
    },

    viewPrj: function(pid, callback) {
        console.log('viewPrj');
        var connection = db.getConnection();
        connection.query('UPDATE ' + settings.PRJTABLE + ' SET viewed = viewed + 1 WHERE `pid` = ' + connection.escape(pid), function(err, results) {
            if (err) {
                callback(err);
            } else if (results.affectedRows) {
                console.log('view accept : ', pid);
                callback(null, true);
            } else {
                callback(new Error('viewPrj: Can` t find project'));
            }
        });
    },

    modifyPrj: function(pid, callback) {
        console.log('modifyPrj');
        var connection = db.getConnection();
        connection.query('UPDATE ' + settings.PRJTABLE + ' SET modified = modified + 1 WHERE `pid` = ' + connection.escape(pid), function(err, results) {
            if (err) {
                callback(err);
            } else if (results.affectedRows) {
                console.log('modified accept : ', pid);
                callback(null, true);
            } else {
                callback(new Error('modifyPrj: Can` t find project'));
            }
        });
    },

    //If not exist summary, create
    updateSummary: function(pid, data, callback) {
        console.log('createSummary');
        //TODO: this statement requires all uid are larger than 0, check this
        if (!data) {
            callback(new Error('Lack of parameters'));
        }
        var newSummary = {
            pid: pid,
            data: data,
            viewed: 0,
            modified: 0
        }
        var connection = db.getConnection();
        connection.query('INSERT INTO ' + settings.SUMMARYTABLE + ' SET ? ON DUPLICATE KEY UPDATE `data` = ' + connection.escape(data), newSummary, function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results.insertId);
            }
        });
    },

    createMemo: function(uid, pid, memodata, callback) {
        console.log('createMemo');
//        console.log(JSON.stringify(memos));
        if (uid == undefined || pid == undefined || memodata == undefined) {
            callback(new Error('createMemo: Lack of parameter'));
        }
        var newMemo = {
            uid: uid,
            pid: pid,
            data: memodata,
            time: new Date(),
            insummary: 0
        };
        var connection = db.getConnection();
//        console.log(JSON.stringify(newMemo));
//        console.log('INSERT INTO ' + settings.MEMOTABLE + ' SET ?');
        connection.query('INSERT INTO ' + settings.MEMOTABLE + ' SET ?', newMemo, function(err, results) {
            if (err) {
                callback(err);
            } else {
//                console.log("callback no err from createMemo");
                callback(null, results.insertId);
            }
        });
    },

    updateMemo: function(mid, data, callback) {
        console.log('updateMemo');
        if (mid == undefined || data == undefined) {
            callback(new Error('updateMemo: Lack of parameter'));
        }
        var updatedMemo = {
            data: data
        };
        var connection = db.getConnection();
        connection.query('UPDATE ' + settings.MEMOTABLE + ' SET ? WHERE `mid` = ' + connection.escape(mid), updatedMemo, function(err, results) {
            if (err) {
                callback(err);
            } else if (results.affectedRows) {
                callback(null, true);
            } else {
                callback(new Error('updateMemo: Can` t find memo'));
            }
        });
    }
};

module.exports = dbMgr;
