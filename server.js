
/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path')
    , passport = require('passport')
    , fs = require('fs')
    , url = require('url')
    , cuid = require('cuid')
    , flash = require('connect-flash')
    , validator = require('validator')
    , LocalStrategy = require('passport-local').Strategy
    // , dbMgr = require('./models/dbMgrLocal')
    , dbMgr = require('./models/dbMgrMySQL')
    , settings = require('./settings')
    , ceh = require('./models/commonErrHandler');

var routes = require('./routes');
var app = express();


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function(id, done) {
    dbMgr.findUserByUid(id, function (err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function(name, password, done) {
    // asynchronous verification, for effect...
        process.nextTick(function () {
            // Find the user by username.    If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.    Otherwise, return the
            // authenticated `user`.
            dbMgr.findUserByName(name, function(err, user) {
                if (err) { return done(null, false, { message: err }); } //用户不存在
                // if (!user) { return done(null, false, { message: 'Unknown user ' + name }); }
                if (user.password != password) { return done(null, false, { message: '1' }); } //密码错误
                return done(null, user);
            })
        });
  }));

app.configure(function() {
    app.set('port', process.env.PORT || 404);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser({
        uploadDir: __dirname + '/uploads/tmp/',
        keepExtensions: true
    }));
    // app.use(express.bodyParser());
    app.use(express.limit('5mb'));
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.session({ secret: 'secccret'}));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.configure(function() {
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});


app.get('/', routes.index.get);
// app.post('/', routes.index.post);
app.post('/todo', routes.todo.post);

app.get('/login', routes.login.get);
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    routes.login.post);

app.get('/register', routes.register.get);
app.post('/register', routes.register.post);

app.get('/logout', routes.logout.get);

// console.log(app.routes);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
