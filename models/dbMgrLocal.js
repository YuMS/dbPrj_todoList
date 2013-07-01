/**
 * Author: YuMS
 */

var async = require('async');
var users = [
    {uid: 1, name: 'bob', password: 'secret', email: 'bob@example.com', inproject: 3}
    , {uid: 2, name: 'joe', password: 'birthday', email: 'joe@example.com', inproject: -1}
];

var projects = [
    {pid: 0, uid: 1, pname: 'wocao', ctime: new Date('2013-02-27 17:46:56'), mtime: new Date('2013-02-27 17:46:56'), privacy: 1, modified: 5, viewed: 10}
    , {pid: 1, uid: 1, pname: 'jiong', ctime: new Date('2013-02-27 17:46:56'), mtime: new Date('2013-02-27 17:46:56'), privacy: 1, modified: 6, viewed: 5}
    , {pid: 3, uid: 1, pname: 'fuasdfdasck', ctime: new Date('2013-02-27 17:46:56'), mtime: new Date('2013-02-27 17:46:56'), privacy: 0, modified: 8, viewed: 7}
    , {pid: 4, uid: 2, pname: 'haha', ctime: new Date('2013-02-27 17:46:56'), mtime: new Date('2013-02-27 17:46:56'), privacy: 0, modified: 9, viewed: 9}
    , {pid: 5, uid: 2, pname: 'eeee', ctime: new Date('2013-02-27 17:46:56'), mtime: new Date('2013-02-27 17:46:56'), privacy: 1, modified: 1, viewed: 11}
];

var memos = [
    {mid: 0, uid: 1, pid: 0, data: '我是好人你呢', time: new Date('2013-02-27 17:46:56'), insummary: 0}
    , {mid: 1, uid: 1, pid: 1, data: {'memotext':[{'dtext':'asdfasdfasdfasdfasdfasdf','dtype':'ft'},{'dtext':'as','dtype':'ft'},{'dtext':'df','dtype':'ft'},{'dtext':'asd','dtype':'ft'},{'dtext':'f','dtype':'ft'},{'dtext':'asdf','dtype':'ft'},{'dtext':'asdfasdfasdfasdf','dtype':'ft'}],'memoimg':[]}, time: new Date('2013-02-27 17:46:57'), insummary: 0}
    , {mid: 2, uid: 1, pid: 0, data: '我是好人你呢2', time: new Date('2013-02-27 17:46:58'), insummary: 1}
    , {mid: 3, uid: 2, pid: 4, data: '我是好人你呢3', time: new Date('2013-02-27 17:46:59'), insummary: 0}
    , {mid: 4, uid: 4, pid: 4, data: '我是好人你呢4', time: new Date('2013-02-27 17:46:55'), insummary: 1}
    , {mid: 5, uid: 1, pid: 1, data: {'memotext':[{'dtext':'asfasdfasdf','dtype':'ft'},{'dtext':'asdfasdfasdfcvzxcfbfsghfdshwregt wfascxfas\na\nfdcadfasdfsdfsdf','dtype':'ct'},{'dtext':'asdfasdfasdfasdf','dtype':'ft'},{'dtext':'asdfasdfasdfasdfasdfasdfasdfa','dtype':'ft'},{'dtext':'werqwfasdgsrtyoilukyfjtghfdrsadfghjfgdsghfdsghfdghgfdsg','dtype':'ct'}],'memoimg':[]} , time: new Date('2013-02-27 17:46:57'), insummary: 0}
];

var summaries = [
    {pid: 0, data: 'What` s in it?', viewed: 5, modified: 10}
    , {pid: 1, data: {'title':'hello','data':[{'subtitle':'caoniam','time':new Date('2013-03-20T11:40:00.431Z'),'content':[{'memoimg':[],'memotext':[{'dtext':'helloasdfasdf','dtype':'ft'}]},{'memoimg':[],'memotext':[{'dtext':'helloasfasdfasdfasdf','dtype':'ft'}]},{'memoimg':[],'memotext':[{'dtext':'helloasdfasdfadasdfafasdfaasdfadsfasdfasdfa','dtype':'ft'}]}]},{'subtitle':'akljsdfkajsdlf','time':new Date('2013-03-20T11:40:00.432Z'),'content':[{'memoimg':[],'memotext':[{'dtext':'helloasADDFASFDASD','dtype':'ft'}]},{'memoimg':[],'memotext':[{'dtext':'kaksdflkasjdflajsd;f\nklajsdlfajsdfasdfasdfasd\nasdfasdfasdfasdasdfasdfasdffasdfasdfasdfwioefjlkashello world.','dtype':'ft'},{'dtext':'','dtype':'ct'}]},{'memoimg':[],'memotext':[{'dtext':'image text','dtype':'ft'},{'dtext':'','dtype':'ct'}]}]}]}, viewed: 5, modified: 10}
    , {pid: 1, data: 'W` s in i alksjfa;lksjdft?', viewed: 5, modified: 10}
    , {pid: 4, data: 'What` s in it?', viewed: 5, modified: 10}
];

var dbMgr = {
    findUserByUid: function(id, fn) {
        console.log('findUserByUid');
        var idx = id - 1;
        if (users[idx]) {
            fn(null, users[idx]);
        } else {
            fn(new Error('findUserByUid: User ' + id + ' does not exist'));
        }
    },

    findUserByName: function(name, callback) {
        console.log('findByUsername');
        async.detect(users,
            function(user, callback) {
                callback(user.name == name);
            },
            function(user) {
                if (user) {
                    return callback(null, user);
                } else {
                    return callback('2'); //用户不存在
                }
            });
//        return fn(new Error('User ' + name + ' does not exist'));
    },

    createUser: function(name, password, email, callback){
        console.log('createUser');
        if (name == undefined || password == undefined || email == undefined) {
            callback(new Error('createUser: Lack of parameter'));
        }
        var newUser = {
            uid: 0,
            name: name,
            password: password,
            email: email,
            inproject: -1
        };
        async.reduce(users, 0,
            function(user, oneuser, callback) {
                callback(null, Math.max(user, oneuser.uid));
            }, function(err, result) {
                if (err) {
                    callback(err, -1);
                } else {
                    console.log('found max', result);
                    newUser.uid = result + 1;
                    console.log('new user id is ' + newUser.uid);
                    users.push(newUser);
                    callback(null, newUser.uid);
                }
            });
    },

    setPrjByUid: function(uid, prj, callback) {
        console.log('setPrjByUid');
        var idx = uid - 1;
        if (users[idx]) {
            users[idx].inproject = prj;
            return callback(null, users[idx]);
        } else {
            callback(new Error('setPrjByUid: User ' + uid + ' does not exist'));
        }
    },

    findPrjByUid: function(uid, callback) {
        console.log('findPrjByUid');
        async.filter(projects,
            function(project, callback) {
                callback(project.uid == uid);
            },
            function(result) {
                callback(null, result);
            });
    },

    findPrjByPid: function(pid, callback) {
        console.log('findPrjByPid');
        async.detect(projects,
            function(project, callback) {
                callback(project.pid == pid);
            },
            function(result) {
                if (result) {
                    callback(null, result);
                } else {
                    callback(new Error('findPrjByPid: Can`t find project'));
                }
            });
    },

    findMemosByPid: function(pid, callback) {
        console.log('findMemosByPid');
        async.filter(memos,
            function(memo, callback) {
                callback(memo.pid == pid);
            },
            function(result) {
                console.log(result);
                callback(null, result);
            });
    },

    findSummaryByPid: function(pid, callback) {
        console.log('findSummaryByPid');
        async.detect(summaries,
            function(summary, callback) {
                callback(summary.pid == pid);
            },
//            function(result) {
//                if (result) {
//                    callback(null, result);
//                } else {
//                    callback(new Error('Can`t find summary'));
//                }
//            });
            function(result) {
                callback(null, result);
            });
    },

    createPrj: function(uid, pname, callback) {
        console.log('createPrj');
        if (uid == undefined) {
            callback(new Error('Lack of parameters'));
        }
        var newPrj = {
            pid: 0,
            uid: uid,
            pname: pname || '',
            ctime: new Date(),
            mtime: new Date(),
            privacy: 1,
            modified: 0,
            viewed: 0
        }
        async.reduce(projects, 0,
            function(memo, project, callback) {
                callback(null, Math.max(memo, project.pid));
            }, function(err, result) {
                if (err) {
                    callback(err, -1);
                } else {
                    console.log('found max', result);
                    newPrj.pid = result + 1;
                    projects.push(newPrj);
                    callback(null, newPrj.pid);
                }
            });
//        for (var i in projects) {
//            var project = projects[i];
//            maxId = Math.max(project.pid, maxId);
//        }
//        newPrj.pid = maxId + 1;
//        projects.push(newPrj);
//        return newPrj.pid;
    },

    updatePrj: function(pid, pname, privacy, callback) {
        console.log('updatePrj');
        async.detect(projects,
            function(project, callback) {
                callback(project.pid == pid);
            },
            function(result) {
                if (result) {
                    if (pname) {
                        result.pname = pname;
                    }
                    if (privacy != undefined) {
                        console.log('assign privacy to:' + privacy);
                        result.privacy = privacy;
                    }
                    callback(null, true);
                } else {
                    callback(new Error('updatePrj: Can` t find project'));
                }
            });
    },

    viewPrj: function(pid, callback) {
        console.log('viewPrj');
        async.detect(projects,
            function(project, callback) {
                callback(project.pid == pid);
            },
            function(result) {
                if (result) {
                    result.viewed++;
                    callback(null, true);
                } else {
                    callback(new Error('viewPrj: Can` t find project'));
                }
            });
    },

    modifyPrj: function(pid, callback) {
        console.log('modifyPrj');
        async.detect(projects,
            function(project, callback) {
                callback(project.pid == pid);
            },
            function(result) {
                if (result) {
                    result.modified++;
                    callback(null, true);
                } else {
                    callback(new Error('modifyPrj: Can` t find project'));
                }
            });
    },

    //invoke this if you are sure that there' s no summary for project
    createSummary: function(pid, data, callback) {
        console.log('createSummary');
        async.detect(summaries,
            function(summary, callback) {
                callback(summary.pid == pid);
            },
            function(result) {
                if (result) {
                    callback(null, false);
                } else {
                    var newSummary = {
                        pid: pid,
                        data: data,
                        viewed: 0,
                        modified: 0
                    }
                    summaries.push(newSummary);
                    callback(null, newSummary);
                }
            });
    },

    updateSummary: function(pid, data, callback) {
        console.log('updateSummary');
        async.detect(summaries,
            function(summary, callback) {
                callback(summary.pid == pid);
            },
            function(result) {
                if (result) {
                    result.data = data;
                    result.modified++;
                    callback(null, true);
                } else {
                    createSummary(pid, data, callback);
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
            mid: 0,
            uid: uid,
            pid: pid,
            data: memodata,
            time: new Date(),
            insummary: 0
        };
        async.reduce(memos, 0,
            function(memo, onememo, callback) {
                callback(null, Math.max(memo, onememo.mid));
            }, function(err, result) {
                if (err) {
                    callback(err, -1);
                } else {
                    console.log('found max', result);
                    newMemo.mid = result + 1;
                    memos.push(newMemo);
                    callback(null, newMemo.mid);
                }
            });
    },

    updateMemo: function(mid, data, callback) {
        console.log('updateMemo');
        async.detect(memos, function(memo, callback) {
            callback(memo.mid == mid);
        }, function(result) {
            if (result) {
                result.data = data;
                callback(null, true);
            } else {
                callback(new Error('updateMemo: Can` t find memo'));
            }
        })
    }
};

module.exports = dbMgr;
