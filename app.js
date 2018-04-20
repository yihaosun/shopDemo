var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var ccap = require('ccap');//Instantiated ccap class
var ejs = require('ejs');  //我是新引入的ejs插件
var index = require('./routes/index');
var cookieParser = require('cookie-parser');
var session = require('express-session');
// app.use(function(req, res, next){
//     app.locals.username1 = 'sunyihao';
//     next();
// });
//引用官方提供的中间件
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//修改view下面的文件的样式
// // view engine setup
 app.use(express.static(path.join(__dirname, 'views')));
 app.engine('.html', require('ejs').__express);
 app.set('view engine', 'html');
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/',index);
//配置路由，（'自定义路径'，上面设置的接口地址）
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

