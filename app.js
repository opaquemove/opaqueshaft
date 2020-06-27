//'use strict'
var express = require('express');
var app = express();
var server = require('http').Server(app);

var ipaddr = "0.0.0.0";
var port   = process.env.PORT || 8080;

app.use('/', express.static( __dirname + '/public' ));

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

