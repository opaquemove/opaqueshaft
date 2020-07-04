var express = require('express');
var router  = express.Router();
var pgp     = require('pg-promise')();
var db      = pgp( process.env.DATABASE_URL );

router.get('/', function(req, res, next ){
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.send('hoge');
});

router.post('/', function(req, res, next ){
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.send('hoge');
});

router.get('/list', function(req, res, next ){
    db.any( 'SELECT * FROM accounts ' )
      .then( rows => {
//          var list = [];
//          for( var result of rows ){
//              list.push( result );
//          }
//          res.json( list );
            res.json( rows );
      });
});

router.post('/signin', function(req, res, next ){
    var id  = req.body.acc;
    var pwd = req.body.pwd;
    console.log( 'acc:' + id + ':');
    db.any( {
        text: 'SELECT acc_id FROM accounts WHERE acc_id = $1 AND password = $2',
        values: [id,pwd] } )
      .then( rows => {
          if ( rows.length > 0 )
            res.cookie( 'acc', id );
//          var list = [];
//          for( var result of rows ){
//              list.push( result );
//          }
//          res.json( list );
            res.json( rows );
      });
});

router.post('/signout', function(req, res, next ){
    var id  = req.cookies.acc;
    console.log( 'acc:' + id + ':');

    res.cookie( 'acc', '', { maxAge:0 } );
    res.json( { cmd:'signout',status:'SUCCESS'} );
});

router.post('/signstatus', function(req, res, next ){
    var id  = req.cookies.acc;

    res.json( { cmd:'signstatus',status:id} );
});

module.exports = router;
