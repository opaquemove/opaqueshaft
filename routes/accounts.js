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

//
//  アカウント関連
//

//
//  アカウントリスト取得
//
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

//
//  アカウントプロパティ取得
//
router.post('/property', function(req, res, next ){
    var id = req.body.acc;
    console.log( 'acc:' + id );
    res.header('Content-Type', 'application/json;charset=utf-8');
    if ( id == null ){
        res.json( null );
    }else {
        db.any( {
            text: 'SELECT acc_id FROM accounts WHERE acc_id = $1 ',
            values: [id] } )
          .then( rows => {
                res.json( rows );
          });
    }
});

//
//  サインイン処理
//
router.post('/signin', function(req, res, next ){
    var id  = req.body.acc;
    var pwd = req.body.pwd;
    console.log( 'acc:' + id );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.any( {
        text: 'SELECT acc_id FROM accounts WHERE acc_id = $1 AND password = $2',
        values: [id,pwd] } )
      .then( rows => {
          if ( rows.length > 0 ) {
              //res.json( rows );
              res.cookie( 'acc', id );
              res.json( {cmd:'signin',status:'SUCCESS'} );
            } else{
                res.json( {cmd:'signin',status:'FAIL'} );
          }
      });
});

//
//  サインアウト処理
//
router.post('/signout', function(req, res, next ){
    var id  = req.cookies.acc;
    console.log( 'acc:' + id + ':');

    res.cookie( 'acc', '', { maxAge:0 } );
    res.json( { cmd:'signout',status:'SUCCESS'} );
});

//
//  サインステータス
//
router.post('/sign', function(req, res, next ){
    var id  = req.cookies.acc;
    console.log( 'sign acc:' + id );

    res.header('Content-Type', 'application/json;charset=utf-8');
    res.json( { cmd:'sign',status:id} );
});


//
//  チャイルド関連
//


//
//  チャイルドリスト取得
//
router.post('/childlist', function(req, res, next ){
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.any( 'SELECT * FROM children ORDER BY child_grade ASC' )
      .then( rows => {
            res.json( rows );
      });
});

//
//  チャイルド取得
//
router.post('/child', function(req, res, next ){
    var id  = req.body.id;
    console.log('child_id:' + id);
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.one( {
        text: 'SELECT * FROM children WHERE child_id = $1',
        values: [ id ] } )
      .then( rows => {
            res.json( rows );
      });
});

//
//  チャイルド追加
//
router.post('/childadd', function(req, res, next ){
    var name  = req.body.child_name;
    var grade = req.body.child_grade;
    var type  = req.body.child_type;
    console.log('childadd:' + name );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: 'INSERT INTO children (child_name,child_grade,child_type) VALUES($1,$2,$3)',
        values: [ name,grade,type ] } )
      .then( function() {
        res.json( {status: 'SUCCESS', message:  'add child'});
      });
});

//
//  ホワイトボード関連
//

//
//  ホワイトボード追加
//
router.post('/whiteboardadd', function(req, res, next ){
    var day  = req.body.day;
    console.log('day:' + day );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: "INSERT INTO whiteboards ( day ) SELECT  $1 WHERE NOT EXISTS ( SELECT * FROM whiteboards WHERE day = $2)",
        values: [ day, day ] } )
      .then( function() {
        res.json( { status: 'SUCCESS', message:  'add whiteboard' });
      });
});

//
//  ホワイトボードロード
//
router.post('/whiteboardload', function(req, res, next ){
    var day  = req.body.day;
    console.log('day:' + day );
    res.header('Content-Type', 'application/json;charset=utf-8');
//    res.json( { status:'SUCCESS'});
    
    db.one( {
        text: 'SELECT * FROM whiteboards WHERE day = $1',
        values: [ day ] } )
      .then( rows => {
            res.json( rows );
      });
    
});

//
//  ホワイトボードアップデート
//
router.post('/whiteboardupdate', function(req, res, next ){
    var day  = req.body.day;
    var html = req.body.html;
    console.log('day:' + day );
    console.log('html:' + html );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: "UPDATE whiteboards SET whiteboard = $1 WHERE whiteboard_id = ( SELECT whiteboard_id FROM whiteboards WHERE day = $2)",
        values: [ html, day ] } )
      .then( function() {
        res.json( { status: 'SUCCESS', message:  'update whiteboard' });
      });
});

//
//  ホワイトボードリスト取得
//
router.post('/whiteboardlist', function(req, res, next ){
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.any( 'SELECT * FROM whiteboards ORDER BY day' )
      .then( rows => {
            res.json( rows );
      });
});

//
//  チャイルド履歴追加
//
router.post('/resultadd', function(req, res, next ){
    var acc_id      = req.body.acc_id;
    var day         = req.body.day;
    var checkin     = req.body.checkin;
    var checkout    = req.body.checkout;
    var escort      = req.body.escort;
    var direction   = req.body.direction;
    if ( checkout == null || checkout == 'null') checkout = '';
    console.log('acc_id:' + acc_id );      // number
    console.log('day:' + day );         // YYYY/MM/DD
    console.log('checkin:' + checkin );     // HH:MM
    console.log('checkout:' + checkout );    // HH:MM
    console.log('escort:' + escort );      // 0: no escort, 1: escort
    console.log('direction:' + direction );   // none,left,right

    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: "insert into results( acc_id, day, child_id, child_name, child_grade,child_type, checkin, checkout,escort, direction, lastupdate )select $1, $2, child_id,child_name,child_grade,child_type,$3, $4 , $5, $6, now() from children where child_id = $7",
        values: [ acc_id, day, checkin, checkout, escort, direction, child_id ] } )
      .then( function() {
        res.json( { status: 'SUCCESS', message:  'add child result' });
      });
});



module.exports = router;
