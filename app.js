//'use strict'
var express = require('express');
var app = express();
var server = require('http').Server(app);
//var io     = require('socket.io')(server);

var ipaddr = "0.0.0.0";
var port   = process.env.PORT || 8080;

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

