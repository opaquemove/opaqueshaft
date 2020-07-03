const pg = require('pg');

var id = 'masa';
var pwd = 'password';
var rs = null;
authAccount( id, pwd ).then( result => {
  console.log('mark1');
  console.log( 'authentication id(' + id + '):' + result);
  rs = result;
  console.log('mark2');
  console.log( 'rs:' + rs );
} );

function authAccountHelper( id, pwd ){
//const cstring = 'postgres://user:password@localhost:5432/databasename';
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
//      if ( result.rows ) {
//        result.rows.forEach((row, index ) => {
//          r += row.acc_name;
//          r = 'SUCCESS';
//          console.log( index + 1, row );
//        } );
//      }
//      resolv( r );
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



