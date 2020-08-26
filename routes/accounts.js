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
        db.one( {
            text: 'SELECT acc_id, acc_name FROM accounts WHERE acc_id = $1 ',
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
              res.json( {cmd:'signin',status:'SUCCESS', acc_id:id } );
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
router.post('/childfind', function(req, res, next ){
    var keyword = req.body.keyword;
    console.log('childfind:' + keyword );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.any( "SELECT * FROM children WHERE kana ILIKE '" + keyword + "%' OR child_name ILIKE '" + keyword + "%' ORDER BY child_grade ASC" )
      .then( rows => {
            res.json( rows );
      });
});

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
    console.log('load day:' + day );
    res.header('Content-Type', 'application/json;charset=utf-8');
//    res.json( { status:'SUCCESS'});
    
    db.any( {
        text: 'SELECT * FROM whiteboards WHERE day = $1',
        values: [ day ] } )
      .then( rows => {
          res.json( rows );
      })
      .catch( err => {
        next( err );
      });
    
});

//
//  ホワイトボードアップデート
//
router.post('/whiteboardupdate', function(req, res, next ){
    var day           = req.body.day;
    var html          = req.body.html;
    var html_absent   = req.body.html_absent;
    var json_children = req.body.json_children;

    var children      = JSON.parse( json_children );
    if ( children != null )
      console.log( 'whiteboardupdate children.length:' + children.length );
      else
      console.log( 'whiteboardupdate children.length:' + null );

    console.log('day:'    + day );
    // console.log('alive:'  + html );
    // console.log('absent:' + html_absent );
    console.log('json_children:' + json_children );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: "UPDATE whiteboards SET whiteboard = $1, whiteboard_absent = $2 WHERE whiteboard_id = ( SELECT whiteboard_id FROM whiteboards WHERE day = $3)",
        values: [ html, html_absent, day ] } )
      .then( function() {
        // res.json( { status: 'SUCCESS', message:  'update whiteboard' });
      });

    var sql = "delete from results where day = $1";
    console.log( 'sql:' + sql );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: sql,
        values: [ day ] } )
      .then( function() {
        // res.json( { status: 'SUCCESS', message:  'delete child result' });
      });
      
    if ( children == null ){
        res.json( { status: 'SUCCESS', message:  'update whiteboard' });
    } else{
      
      for ( var i=0; i<children.length; i++ ){
        var rslt = children[i];
        var acc_id      = rslt.operator;
        var checkin     = rslt.checkin;
        var estimate    = rslt.estimate;
        var checkout    = rslt.checkout;
        var escort      = rslt.escort;
        var direction   = rslt.direction;
        var absent      = rslt.absent;
        var child_id    = rslt.child_id;
        var coordi_top  = rslt.coordi_top;
        var coordi_left = rslt.coordi_left;
        var inssql = "insert into results( acc_id, day, child_id, child_name, child_grade,child_type, checkin, estimate, checkout, escort, direction, absent, lastupdate ) select $1 acc_id, $2, child_id,child_name,child_grade,child_type,$3 checkin, $4 estimate, $5 checkout, $6 escort, $7 direction, $8 absent, now() lastupdate from children where child_id = $9";
        db.none( {
          text: inssql,
          values: [ acc_id, day, checkin, estimate, checkout, escort, direction, absent, child_id ] } )
        .then( function() {
        });
      }

      res.json( { status: 'SUCCESS', message:  'update whiteboard' });
    }
});

//
//  ホワイトボードリスト取得
//
router.post('/whiteboardlist', function(req, res, next ){
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.any( 'SELECT w.*, ( SELECT count(*) FROM results r WHERE r.day = w.day ) c_children FROM whiteboards w ORDER BY w.day' )
      .then( rows => {
            res.json( rows );
      });
});

//
//  チャイルド履歴追加
//
router.post('/resultadd', function(req, res, next ){
    var acc_id      = req.body.acc_id;
    var child_id    = req.body.child_id;
    var day         = req.body.day;
    var checkin     = req.body.checkin;
    var estimate    = req.body.estimate;
    var checkout    = req.body.checkout;
    var escort      = req.body.escort;
    var direction   = req.body.direction;
    var absent      = req.body.absent;

    if ( checkout == null || checkout == 'null') checkout = null;
    console.log('acc_id:' + acc_id );      // number
    console.log('child_id:' + child_id );   // child_id
    console.log('day:' + day );         // YYYY/MM/DD
    console.log('checkin:' + checkin );     // HH:MM
    console.log('estimate:' + estimate );   // HH:MM
    console.log('checkout:' + checkout );    // HH:MM
    console.log('escort:' + escort );      // 0: no escort, 1: escort
    console.log('direction:' + direction );   // none,left,right
    console.log('absent:' + absent );          // 0: alive, 1:absent

    var sql = "insert into results( acc_id, day, child_id, child_name, child_grade,child_type, checkin, estimate, checkout, escort, direction, absent, lastupdate ) select $1 acc_id, $2, child_id,child_name,child_grade,child_type,$3 checkin, $4 estimate, $5 checkout, $6 escort, $7 direction, $8 absent, now() lastupdate from children where child_id = $9";
    console.log( 'sql:' + sql );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: sql,
        values: [ acc_id, day, checkin, estimate, checkout, escort, direction, absent, child_id ] } )
      .then( function() {
        res.json( { status: 'SUCCESS', message:  'add child result' });
      });
});

//
//  チャイルド履歴削除
//
router.post('/resultdelete', function(req, res, next ){
    var day         = req.body.day;

    console.log('day:' + day );         // YYYY/MM/DD

    var sql = "delete from results where day = $1";
    console.log( 'sql:' + sql );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: sql,
        values: [ day ] } )
      .then( function() {
        res.json( { status: 'SUCCESS', message:  'delete child result' });
      });
});

//
//  チャイルド履歴リスト取得
//
router.post('/resultlist', function(req, res, next ){
    var child_id    = req.body.child_id;
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.any( {
        text: 'SELECT * FROM results WHERE child_id = $1 ORDER BY day',
        values: [ child_id ] } )
      .then( rows => {
            res.json( rows );
      });
});

router.post('/jsonsend', function( req, res, next, ){
  var jsondata = req.body;
  console.log( 'jsondata:' + JSON.stringify(jsondata) );
});
module.exports = router;
