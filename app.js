/// <reference path='./typings/tsd.d.ts' />
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    var url = req.originalUrl;
    var loginAccount = req.cookies.ppismloginaccount;
    var uid = req.cookies.ppismid;
    if (url != "/" && url != "/users/login" && url != "/users/register" && url != "/users/" && (loginAccount == undefined || uid == undefined)) {
        return res.render("error", { fromUrl: "/users/myspace", toUrl: "/users/login", toUrlTitle: "登录", message: "用户信息找不到了！" });
    }
    next();
});
app.use('/', routes);
app.use('/users', users);
//catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(3001);
module.exports = app;
//# sourceMappingURL=app.js.map