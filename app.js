//'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
var server = require('http').Server(app);
//var io     = require('socket.io')(server);

var ipaddr = "0.0.0.0";
var port   = process.env.PORT || 8080;

app.use( bodyParser.urlencoded( { extended: true} ) );  // POST形式で受信
app.use( cookieParser());
//app.use( bodyParser.json ); // JSON形式で受信
app.use('/', express.static( __dirname + '/public' ));
/*
io.on( 'connection', ( socket ) => {
  socket.on('cmd', ( msg ) => {
    switch( msg ) {
      default:
        socket.broadcast.emit('cmd', msg );
        socket.emit( 'cmd', msg );
        break;
    }
  })
})
*/

app.post( '/webbackend', ( req, res ) => {
  var r = '';
//  res.set( 'Content-Type', 'application/json' );
  console.log( 'cmd:' + req.body.cmd );
  switch( req.body.cmd ){
    case 'signstatus':
      r += 'SIGNSTATUS:';
      r += req.cookies.acc;
      break;
    case 'sign':
      break;
    case 'signin':
      r += 'SIGNIN:';
      r += req.body.acc + '(' + req.body.pwd + ')';
      res.cookie( 'acc', req.body.acc );
      break;
    case 'signout':
      r += 'SIGNOUT:';
      r += req.cookies.acc;
      res.cookie( 'acc', '', { maxAge:0 } );
      break;
  }
//  res.send( req.body );
    res.send( r );
})

server.on( 'listening', () => {
  console.log('listening on ' + port );
  console.log('__dirname:' + __dirname );
  console.log('server:' + ipaddr + ':' + port );
});

server.listen( port, ipaddr );

/*
app.get('/', (req, res) => res.send('OpaqueShaft.'));
app.listen( port, () => console.log(`OpaqueShaft listening on port ${port}.`));
*/

