var express = require('express');
var router  = express.Router();
var pgp     = require('pg-promise')();
// SSL OFF connection 20210501 fix
var conf    = {
    connectionString : process.env.DATABASE_URL,
    max : 30,
    ssl : { rejectUnauthorized: false }
    };
var db;
    if ( process.env.NODE_ENV == 'production' ) // heroku server specific
        db = pgp( conf );
      else
        db = pgp( process.env.DATABASE_URL );	// development pc
//
//  prepare 
//  $export DATABASE_URL=postgres://[id]:[password]@localhost:5432/opaqueshaft
//  $NODE_ENV=production is HEROKU production server 

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
// router.get('/list', function(req, res, next ){
//     db.any( 'SELECT * FROM accounts ' )
//       .then( rows => {
//             res.json( rows );
//       });
// });

//
//  アカウントリスト取得
//
router.post('/list', function(req, res, next ){
  var keyword = req.body.keyword;
  // var id  = req.cookies.acc;
  // console.log('childfind:' + keyword );

  res.header('Content-Type', 'application/json;charset=utf-8');
  db.any( {
        text : "SELECT * FROM accounts WHERE ( acc_id ILIKE '" + keyword + "%' OR acc_name ILIKE '" + keyword + "%' ) AND delete_flag = 0 ORDER BY acc_id ASC",
        values : [] } )
    .then( rows => {
          res.json( rows );
    });
});


//
//  アカウント存在チェック１
//
router.post('/existaccount', function(req, res, next ){
    var acc_id = req.body.acc_id;
    console.log( 'acc_id:' + acc_id );
    res.header('Content-Type', 'application/json;charset=utf-8');
    if ( acc_id == null || acc_id == '' ){
        res.json( { status : 'FAILED', message : 'acc_id(' + acc_id + ') がnull.' } );
    }else {
        db.one( {
            text: 'SELECT acc_id FROM accounts WHERE acc_id = $1 ',
            values: [acc_id] } )
          .then( rows => {
                res.json( { status : 'EXIST', message : 'acc_id はすでに存在.' } );
          })
          .catch( err => {
                res.json( { status : 'NOENTRY', message : 'acc_id は登録されていない.' } )
          });
    }
});

//
//  アカウント登録
//
router.post('/registaccount', function(req, res, next ){
  var acc_id        = req.body.acc_id;
  var acc_name      = req.body.acc_name;
  var acc_priv      = req.body.acc_priv;
  var acc_imagefile = req.body.acc_imagefile;

  console.log( 'acc_id:'   + acc_id );
  console.log( 'acc_name:' + acc_name );
  console.log( 'acc_priv:' + acc_priv );
  console.log( 'acc_imagefile:' + acc_imagefile );

  res.header('Content-Type', 'application/json;charset=utf-8');

  db.none( {
    text: 'INSERT INTO accounts (acc_id, acc_name, password, range_id, priv, imagefile, delete_flag ) VALUES($1,$2,$3,$4,$5,$6,$7)',
    values: [ acc_id, acc_name, 'password', 2021, acc_priv, acc_imagefile, 0 ] } )
  .then( function() {
    res.json( {status: 'SUCCESS', message:  'regist account'});
  })
  .catch( err => {
    res.json( {status: 'FAILED', message:  err });
  });
});

//
//  アカウント削除
//
router.post('/deleteaccount', function(req, res, next ){
  var acc_id    = req.body.acc_id;

  console.log( 'acc_id:'   + acc_id );

  res.header('Content-Type', 'application/json;charset=utf-8');

  db.none( {
    text: 'UPDATE accounts SET delete_flag = 1 WHERE acc_id = $1',
    values: [ acc_id ] } )
  .then( function() {
    res.json( {status: 'SUCCESS', message:  'delete account'});
  })
  .catch( err => {
    res.json( {status: 'FAILED', message:  err });
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
          text: 'SELECT acc_id, acc_name, range_id FROM accounts WHERE acc_id = $1 ',
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
        text: 'SELECT acc_id, range_id FROM accounts WHERE acc_id = $1 AND password = $2',
        values: [id,pwd] } )
      .then( rows => {
          if ( rows.length > 0 ) {
              //res.json( rows );
              console.log( rows );
              res.cookie( 'acc', id );
              res.json( {cmd:'signin',status:'SUCCESS', acc_id:id, range_id: rows.range_id } );
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
    var id  = req.cookies.acc;
    console.log('childfind:' + keyword );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.any( 
      "SELECT * FROM children WHERE delete_flag = 0 AND ( kana ILIKE '" + keyword + "%' OR child_name ILIKE '" + keyword + "%' ) AND range_id = ( SELECT range_id FROM accounts WHERE acc_id = '" + id + "') ORDER BY kana ASC" )
      .then( rows => {
            res.json( rows );
      });
});

//
//  チャイルドリスト取得
//
router.post('/childlist', function(req, res, next ){
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.any( 'SELECT * FROM children WHERE delete_flag = 0 ORDER BY kana ASC' )
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
    var name      = req.body.child_name;
    var kana      = req.body.kana;
    var grade     = req.body.child_grade;
    var type      = req.body.child_type;
    var remark    = req.body.remark;
    var range_id  = req.body.range_id;
    console.log('childadd:' + name );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: 'INSERT INTO children (child_name,kana,child_grade,child_type,remark,range_id) VALUES($1,$2,$3,$4,$5,$6)',
        values: [ name,kana,grade,type,remark,range_id ] } )
      .then( function() {
        res.json( {status: 'SUCCESS', message:  'add child'});
      });
});

//
//  チャイルド更新
//
router.post('/childupdate', function(req, res, next ){
  var child_id    = req.body.child_id;
  var child_name  = req.body.child_name;
  var kana        = req.body.kana;
  var child_grade = req.body.child_grade;
  var child_type  = req.body.child_type;
  var remark      = req.body.remark;
  var imagefile   = req.body.imagefile;
  var range_id    = req.body.range_id;
  console.log('child update:' + child_name );
  res.header('Content-Type', 'application/json;charset=utf-8');
  db.none( {
      text: 'UPDATE children SET child_name = $1, kana = $2, child_grade = $3, child_type = $4, remark = $5 WHERE child_id = $6',
      values: [ child_name, kana, child_grade, child_type, remark, child_id ] } )
    .then( function() {
      res.json( {status: 'SUCCESS', message:  'update child:' + child_name });
    });
});

//
//  チャイルド削除
//
router.post('/childdelete', function(req, res, next ){
  var child_id    = req.body.child_id;

  console.log('child delete:' + child_id );
  res.header('Content-Type', 'application/json;charset=utf-8');
  db.none( {
      text: 'UPDATE children SET delete_flag = 1 WHERE child_id = $1',
      values: [ child_id ] } )
    .then( function() {
      res.json( {status: 'SUCCESS', message:  'delete child:' + child_id });
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
    var desc          = req.body.desc;
    var json_children = req.body.json_children;
    var rc = true;

    var revision = new Date();
    console.log( 'revision:' + revision.getTime() );

    var children      = JSON.parse( json_children );
    if ( children != null )
      console.log( 'whiteboardupdate children.length:' + children.length );
      else
      console.log( 'whiteboardupdate children.length:' + null );


    console.log('day:'    + day );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: "UPDATE whiteboards SET description = $1, lastupdate = now(), revision = $3 WHERE whiteboard_id = ( SELECT whiteboard_id FROM whiteboards WHERE day = $2)",
        values: [ desc, day, revision.getTime() ] } )
      .then( function() {
        // res.json( { status: 'SUCCESS', message:  'update whiteboard' });
      })
      .catch( err => {
        console.log( err );
        rc = false;
      });

    var sql = "delete from results where day = $1 and revision <> $2";
    console.log( 'sql:' + sql );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.none( {
        text: sql,
        values: [ day, revision.getTime() ] } )
      .then( function() {
        // res.json( { status: 'SUCCESS', message:  'delete child result' });
      })
      .catch( err => {
        console.log( err );
        rc = false;
      });
      
    if ( children == null ){
        if ( rc ) res.json( { status: 'SUCCESS', message:  'update whiteboard' });
          else    res.json( { status: 'FAILED', message: 'can not update whiteboard' });
    } else{
      
      var cnt = 0;
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
        var remark      = rslt.remark;
        console.log( 'debug.child_id:' + child_id );
        var inssql = "insert into results( acc_id, day, child_id, child_name, child_grade, child_type, checkin, estimate, checkout, escort, direction, absent, coordi_top, coordi_left, remark, lastupdate, revision ) select $1 acc_id, $2, child_id,child_name,child_grade,child_type,$3 checkin, $4 estimate, $5 checkout, $6 escort, $7 direction, $8 absent, $9 coordi_top, $10 coordi_left, $11 remark, now() lastupdate, $12 revision from children where child_id = $13";
        console.log( 'sql:' + inssql );
        db.none( {
          text: inssql,
          values: [ acc_id, day, checkin, estimate, checkout, escort, direction, absent, coordi_top, coordi_left, remark, revision.getTime(), child_id ] } )
        .then( function() {
          console.log( 'insert:child_id:' + child_id );
          cnt++;
        })
        .catch( err => {
          console.log( err );
          rc = false;
        });
      }

      // res.json( { status: 'SUCCESS', message:  'update whiteboard' });
      if ( rc ) res.json( { status: 'SUCCESS', message:  'update whiteboard', procs: cnt });
      else    res.json( { status: 'FAILED', message: 'can not update whiteboard' });

    }
});

//
//  レンジリストを取得
//
router.post('/rangelist', function(req, res, next ){
  res.header('Content-Type', 'application/json;charset=utf-8');
  db.any( 'SELECT * FROM ranges ORDER BY range_id ASC' )
    .then( rows => {
          res.json( rows );
    });
});
//
//  レンジを追加
//
router.post('/rangeadd', function(req, res, next ){
  var range_id = req.body.range_id;
  var sotd = new Date( range_id + '/4/1' );
  var eotd = new Date( range_id + '/4/1' );
  eotd.setFullYear( eotd.getFullYear() + 1 );
  eotd.setDate( eotd.getDate() - 1 );

  res.header('Content-Type', 'application/json;charset=utf-8');
  db.none(
     {
      text: 'INSERT INTO ranges VALUES( $1, $2, $3 )',
      values: [ range_id, sotd, eotd ]
      } )
    .then( function(){ 
      res.json( {status: 'SUCCESS', message:  'add range:' + range_id });
      console.log( {status: 'SUCCESS', message:  'add range:' + range_id });
    } )
    .catch ( err => {
      console.log( err );
    });
});
//
//  レンジを削除
//
router.post('/rangedelete', function(req, res, next ){
  var range_id = req.body.range_id;

  res.header('Content-Type', 'application/json;charset=utf-8');
  db.none(
     {
      text: 'DELETE FROM ranges WHERE range_id = $1',
      values: [ range_id ]
      } )
    .then( function(){ 
      res.json( {status: 'SUCCESS', message:  'delete range:' + range_id });
      console.log( {status: 'SUCCESS', message:  'delete range:' + range_id });
    } )
    .catch ( err => {
      console.log( err );
    });
});

//
//  ホワイトボードリスト取得（年度は気にしない）
//
router.post('/whiteboardlist', function(req, res, next ){
    var range_id = parseInt( req.body.range_id );
    var sotd    = range_id + '/4/1';
    var eotd    = ( range_id + 1 ) + '/3/31';
    console.log( 'range_id:' + range_id );
    res.header('Content-Type', 'application/json;charset=utf-8');
    db.any( {
        text : 'SELECT w.*, ( SELECT count(*) FROM results r WHERE r.day = w.day ) c_children, ( SELECT count(*) FROM reserves rsv WHERE rsv.day = w.day ) c_resv_children FROM whiteboards w WHERE w.day BETWEEN $1 AND $2 ORDER BY w.day',
        values : [ sotd, eotd ] } )
      .then( rows => {
            res.json( rows );
      });
});

//
//  ホワイトボードリスト取得(指定期間）
//
router.post('/whiteboardlist2', function(req, res, next ){
  var sotd    = req.body.sotd;
  var eotd    = req.body.eotd;
  console.log( 'sotd:' + sotd );
  console.log( 'eotd:' + eotd );

  res.header('Content-Type', 'application/json;charset=utf-8');
  db.any( {
      text : 'SELECT w.*, ( SELECT count(*) FROM results r WHERE r.day = w.day ) c_children, ( SELECT count(*) FROM results r  WHERE r.day = w.day AND r.checkout is not null ) c_checkout, ( SELECT count(*) FROM reserves rsv WHERE rsv.day = w.day ) c_resv_children FROM whiteboards w WHERE w.day BETWEEN $1 AND $2 ORDER BY w.day',
      values : [ sotd, eotd ] } )
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

    var sql = "insert into results( acc_id, day, child_id, child_name, kana, child_grade,child_type, checkin, estimate, checkout, escort, direction, absent, lastupdate ) select $1 acc_id, $2, child_id,child_name,kana,child_grade,child_type,$3 checkin, $4 estimate, $5 checkout, $6 escort, $7 direction, $8 absent, now() lastupdate from children where child_id = $9";
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
//
//  チャイルド履歴リスト取得２
//
router.post('/resultlist2', function(req, res, next ){
  var sotd    = req.body.sotd;
  var eotd    = req.body.eotd;
  res.header('Content-Type', 'application/json;charset=utf-8');
  db.any( {
      text: 'SELECT * FROM results WHERE day >= $1 AND day <= $2 ORDER BY day',
      values: [ sotd, eotd ] } )
    .then( rows => {
          res.json( rows );
    });
});

//
//  ホワイトボードチャイルド履歴リスト取得
//
router.post('/resultwhiteboard', function(req, res, next ){
  var day    = req.body.day;
  res.header('Content-Type', 'application/json;charset=utf-8');
  db.any( {
      text: 'SELECT r.*, c.kana, c.imagefile FROM results r INNER JOIN children c ON c.child_id = r.child_id WHERE r.day = $1 AND r.revision = ( SELECT revision FROM whiteboards WHERE day = $1 ) ORDER BY r.estimate',
      values: [ day ] } )
    .then( rows => {
          res.json( rows );
    });
});

//
//  月別履歴数集計
//
router.post('/countresultbymonth', function(req, res, next ){
  var sotd  = req.body.sotd;
  var eotd  = req.body.eotd;
  console.log( 'sotd:' + sotd );
  console.log( 'eotd:' + eotd );
  var sql = "SELECT to_char( day, 'YYYY/MM' ) ym, count(*) days FROM whiteboards WHERE day BETWEEN $1 AND $2 GROUP BY day ORDER BY to_char( day, 'YYYY/MM' ) ";
  console.log( 'sql:' + sql );
  res.header('Content-Type', 'application/json;charset=utf-8');
  db.any( {
      text: sql,
      values: [ sotd, eotd ] } )
    .then( rows => {
          res.json( rows );
    });
});


//
//  リザーブ関連
//

//  リザーブ追加
router.post('/reserveadd', function(req, res, next ){
  var day         = req.body.day;
  var sott        = req.body.sott;
  var eott        = req.body.eott;
  var child_id    = req.body.child_id;

  console.log('day:'      + day );         // YYYY/MM/DD
  console.log('sott:'     + sott );         // 
  console.log('eott:'     + eott );         // 
  console.log('child_id:' + child_id );     // 

  res.header('Content-Type', 'application/json;charset=utf-8');

  var sql = null;
  sql = 'delete from reserves where day = $1 and child_id = $2';
  console.log( 'sql:' + sql );
  db.none( {
      text: sql,
      values: [ day, child_id ] } );

  sql = 'insert into reserves ( day, sott, eott, child_id ) values ( $1, $2, $3, $4 )';
  console.log( 'sql:' + sql );
  db.none( {
      text: sql,
      values: [ day, sott, eott, child_id ] } )
    .then( function() {
      res.json( { status: 'SUCCESS', message:  'insert reserve(' + day +',' + child_id + ')' });
    });
});

//  リザーブ削除（日付け、チャイルドID）
router.post('/reservedelete', function(req, res, next ){
  var day         = req.body.day;
  var child_id    = req.body.child_id;

  console.log('day:' + day );         // YYYY/MM/DD
  res.header('Content-Type', 'application/json;charset=utf-8');

  var sql = null;
  sql = 'delete from reserves where day = $1 and child_id = $2';
  console.log( 'sql:' + sql );
  db.none( {
      text: sql,
      values: [ day, child_id ] } )
    .then( function() {
      res.json( { status: 'SUCCESS', message:  'delete reserve(' + day +',' + child_id + ')' });
    });
});

//  リザーブ取得（rangeid、チャイルドID）
router.post('/reserveget', function(req, res, next ){
  var range_id    = req.body.range_id;
  var child_id    = req.body.child_id;

  console.log('range_id:' + range_id );         // YYYY/MM/DD
  res.header('Content-Type', 'application/json;charset=utf-8');

  var sql = null;
  sql =  'select * from reserves where child_id = $1 and ';
  sql += '( day >= (select sotd from ranges where range_id = $2 ) and ';
  sql += '  day <= (select eotd from ranges where range_id = $2 ) )';
  sql += ' order by day';
  console.log( 'sql:' + sql );
  db.any( {
      text: sql,
      values: [ child_id, range_id ] } )
      .then( rows => {
        res.json( rows );
  });
});

//  リザーブ取得（rangeid）
router.post('/reservelist', function(req, res, next ){
  var range_id    = req.body.range_id;
  var sotd        = req.body.sotd;
  var eotd        = req.body.eotd;

  console.log('range_id:' + range_id );         // YYYY/MM/DD
  console.log( 'sotd:' + sotd );
  console.log( 'eotd:' + eotd );
  res.header('Content-Type', 'application/json;charset=utf-8');

  var sql = null;
  sql =  'select * from reserves where ';
  sql += ' day >= $1 and day <= $2 ';
  sql += ' order by child_id, day';
  console.log( 'sql:' + sql );
  db.any( {
      text: sql,
      values: [ sotd, eotd ] } )
      .then( rows => {
        res.json( rows );
  });
});


//  リザーブ削除（日付け、チャイルドID）
router.post('/reserveday', function(req, res, next ){
  var day    = req.body.day;

  console.log('day:' + day );         // YYYY/MM/DD
  res.header('Content-Type', 'application/json;charset=utf-8');

  var sql = null;
  sql =  'select r.*,c.child_name, c.kana, c.child_type,c.child_grade from reserves r inner join children c on c.child_id = r.child_id where r.day = $1';
  console.log( 'sql:' + sql );
  db.any( {
      text: sql,
      values: [ day ] } )
      .then( rows => {
        res.json( rows );
  });
});


router.post('/jsonsend', function( req, res, next, ){
  var jsondata = req.body;
  console.log( 'jsondata:' + JSON.stringify(jsondata) );
});
module.exports = router;
