'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const { resolve } = require('path');
var app = express();
var server = require('http').Server(app);
var io     = require('socket.io').listen(server);
//io.configure( function() {
//  io.set("transports", ["xhr-polling"]);
//  io.set("polling duration", 10 );
//});

var accounts = require('./routes/accounts');

var ipaddr = "0.0.0.0";
var port   = process.env.PORT || 8080;

app.use( bodyParser.urlencoded( { extended: true} ) );  // POST形式で受信
app.use( cookieParser());
//app.use( bodyParser.json ); // JSON形式で受信
app.use('/', express.static( __dirname + '/public' ));
app.use('/accounts', accounts );

//
//  socket.io
//
io.on( 'connection', ( socket ) => {

  socket.on('cmd', ( msg ) => {
    console.log( 'connection.cmd:' + msg);
    switch( msg ) {
      case 'getaccountlist':
        getAccountList( socket );
        break;
      case 'getchildrenlist':
        getChildrenList( socket );
        break;
      case 'exchange':
        break;
      default:
          //socket.broadcast.emit( msg, 'hogehoge' );
          // socket.emit( msg, 'hogehoge' );
          break;
        }
    });

    socket.on('sync', (data) => {
      console.log('sync.data:' + data );
      // socket.emit( 'sync', data );            // local cast
      socket.broadcast.emit( 'sync', data );  // broadcast
    });
  }
)

//
//  予備コード
//
app.post( '/webbackend', ( req, res ) => {
  var r = '';
  var rc = false;
//  res.set( 'Content-Type', 'application/json' );
  console.log( 'cmd:' + req.body.cmd );
  switch( req.body.cmd ){
    case 'sign':
      r += 'SIGN:';
      r += ( req.cookies.acc == undefined )? 
          'sign out':'sign in (' + req.cookies.acc + ')';
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

//
//  チルドレンリストを取得すrsocket.io
//
function getChildrenList( socket ){
  var r = '';

  var pg = require('pg');
  var cstring = process.env.DATABASE_URL;
  const pool = new pg.Pool(
    { connectionString: cstring } );

  pool.query('SELECT * FROM children')
    .then(( result ) => {
      if ( result.rows ) {
        r += JSON.stringify( result.rows );
      }
    })
    .catch( ( error ) => {
      console.log('Failure', error );
    })
    .then( () => {
      console.log('disconnect');
      pool.end();
      console.log( 'r:' + r );
      socket.emit( 'getchildrenlist', r );
    });
  return r;
}

//
//  アカウントリストを取得するsocket.io
//
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

//
//  サインインしているクライアントにブロードキャスト(socket.io)
//
function exchange( socket, msg ){
  var r = '';
  r += 'exchange...';

  console.log( 'msg:' + msg );
  
  socket.emit( 'exchange', msg );
  // socket.broadcast.emit( 'exchange', msg );

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

function authAccountHelper( id, pwd ){
  var pg = require('pg');
  const cstring = process.env.DATABASE_URL;
    return new Promise( resolv => {
      const pool = new pg.Pool(
          { connectionString: cstring } );
      var r = 'FAIL';
      pool.query({
        text: "SELECT * FROM accounts WHERE acc_id = $1 AND password = $2",
        values: [ id, pwd ]
        })
      .then(( result ) => {
          if ( result.rows.length > 0 ) r = 'SUCCESS';
        })
      .then( () => {
        pool.end();
        resolv( r );
      });
    });
}

async function authAccount( id, pwd ) {
  var result = await authAccountHelper( id, pwd );
  return result;
}

/*
app.get('/', (req, res) => res.send('OpaqueShaft.'));
app.listen( port, () => console.log(`OpaqueShaft listening on port ${port}.`));
*/

