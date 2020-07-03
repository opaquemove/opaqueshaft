//'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const e = require('express');
const { resolve } = require('path');
var app = express();
var server = require('http').Server(app);
var io     = require('socket.io').listen(server);
//io.configure( function() {
//  io.set("transports", ["xhr-polling"]);
//  io.set("polling duration", 10 );
//});
var ipaddr = "0.0.0.0";
var port   = process.env.PORT || 8080;

app.use( bodyParser.urlencoded( { extended: true} ) );  // POST形式で受信
app.use( cookieParser());
//app.use( bodyParser.json ); // JSON形式で受信
app.use('/', express.static( __dirname + '/public' ));

io.on( 'connection', ( socket ) => {
  socket.on('cmd', ( msg ) => {
    console.log( msg);
    switch( msg ) {
      case 'getaccountlist':
        getAccountList( socket );
        break;
      default:
        //socket.broadcast.emit( msg, 'hogehoge' );
        socket.emit( msg, 'hogehoge' );
        break;
    }
  })
})


app.post( '/webbackend', ( req, res ) => {
  var r = '';
  var rc = false;
//  res.set( 'Content-Type', 'application/json' );
  console.log( 'cmd:' + req.body.cmd );
  switch( req.body.cmd ){
    case 'signstatus':
      r += 'SIGNSTATUS:';
      r += ( req.cookies.acc == undefined )? 
          'sign out':'sign in (' + req.cookies.acc + ')';
      break;
    case 'sign':
      break;
    case 'signin':
      var result = null;
      r += 'SIGNIN:';
      r += req.body.acc + '(' + req.body.pwd + ')';
      var prms = new Promise( (resolv,reject) =>{
        resolv( checkAcc( req.body.acc ) );} );
      prms.then( data => {result = data;console.log('[' + data + ']');})
      r += 'result(' + result + ')';
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
function getAccountList( socket ){
  var r = '';

  var pg = require('pg');
  //const cstring = 'postgres://user:password@localhost:5432/databasename';
  var cstring = process.env.DATABASE_URL;
  var client = new pg.Client( cstring );
  client.connect();
  client.query( 'SELECT * FROM accounts' )
    .then( result => r += JSON.stringify( result ) )
    .catch( e => r += e.stack )
    .then( () => client.end() )

  socket.emit('getaccountlist', r );

}
*/



function getAccountList( socket ){
  var r = '';

  var pg = require('pg');
  //const cstring = 'postgres://user:password@localhost:5432/databasename';
  var cstring = process.env.DATABASE_URL;
  const pool = new pg.Pool(
    { connectionString: cstring } );

  pool.query('SELECT * FROM accounts')
    .then(( result ) => {
      //    console.log('Success', result );
      if ( result.rows ) {
        r += JSON.stringify( result.rows );
//        result.rows.forEach((row, index ) => {
//          console.log( index + 1, row );
//          r += JSON.stringify(row);
//        } );
      }
    })
    .catch( ( error ) => {
      console.log('Failure', error );
    })
    .then( () => {
      console.log('disconnect');
      pool.end();
      console.log( 'r:' + r );
      socket.emit( 'getaccountlist', r );
    });
//    r += "Working..."
  return r;
}

function checkAcc( id ){
  var rc = 'FAIL';

  var pg = require('pg');
  //const cstring = 'postgres://user:password@localhost:5432/databasename';
  var cstring = process.env.DATABASE_URL;
  const pool = new pg.Pool( { connectionString: cstring } );
  var sql = "SELECT * FROM accounts WHERE acc_id = '" + id + "'";
  var prms = new Promise( (resolv, reject ) => {
    pool.query( sql )
    .then(( result ) => {
      //    console.log('Success', result );
      if ( result.rows.length > 0 ) { rc = 'SUCCESS'; resolve(rc); }
    })
    .catch( ( error ) => {
      console.log('Failure', error );
    })
    .then( () => {
      console.log('disconnect');
      pool.end();
      console.log('checkacc(' + sql + '):' + rc );
      resolv(rc);
      //return rc;
    });
  })
//  prms.then( data => {rc = data;} )
  return rc;

}


/*
app.get('/', (req, res) => res.send('OpaqueShaft.'));
app.listen( port, () => console.log(`OpaqueShaft listening on port ${port}.`));
*/

