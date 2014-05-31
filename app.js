/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// add start
var twitter = require('ntwitter');
var io = require('socket.io').listen(app);

var twitter = new twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
// add end

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// del start
//app.get('/', routes.index);
// del end
app.get('/users', user.list);

// update start
//http.createServer(app).listen(app.get('port'), function(){
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
// update end

// add start
var io = require('socket.io').listen(server);
// debug非表示
io.settings.log = false;

app.get('/', function(req, res){
  res.render('index');

  // Twitter Streaming API
  twitter.stream('statuses/filter', {'locations': '139.163204, 35.259096, 140.599219, 36.026476'},function(stream) {
    stream.on('data', function (data) {
      io.sockets.emit('tweet',data);
    });
    stream.on('end', function (response) {
      // 切断された場合の処理
    });
    stream.on('destroy', function (response) {
      // 接続が破棄された場合の処理
    });
  });
});
// add end
