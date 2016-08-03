var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express_session = require('express-session');
var compression = require('compression');

var membership = require('./routes/Membership');
var session= require('./routes/Session');
var profile = require('./routes/Profile');
var Search = require('./routes/Search');
var post = require('./routes/Post-test');
var reply = require('./routes/Reply');
var space = require('./routes/Space');
var review = require('./routes/review');
var mainpage = require('./routes/Mainpage');
//var s_location = require('./routes/s_location');
var temp = require('./routes/temp');
var image_view = require('./routes/image');

var app = express();
var http = require('http');
var server = http.createServer(app);

connection.connect(function(err) {
    if(err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express_session({

        name : 'session_id',
        saveUninitialized  : false,
        secret : 'keyboard cat',
        resave : false,

}));


app.use('/membership', membership);
app.use('/session', session);
app.use('/profile', profile);
app.use('/search', Search);
app.use('/post', post);
app.use('/review', review);
app.use('/reply', reply);
app.use('/space', space);
app.use('/mainpage', mainpage);
//app.use('/s_location',s_location);
app.use('/temp', temp);
app.use('/image', image_view);

app.use(function(err,req,res,next) {
        if(err!=null){
                console.log('에러 내용 : ' + err.message);
        }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



server.listen(5000, function() {
    console.log('Server is running on port 5000');
});

module.exports = app;
