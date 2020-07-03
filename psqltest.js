const pg = require('pg');


function getAccountName( id ){
//const cstring = 'postgres://user:password@localhost:5432/databasename';
const cstring = process.env.DATABASE_URL;
  return new Promise( resolv => {
    const pool = new pg.Pool(
	{ connectionString: cstring } );
    var r = '';
    pool.query("SELECT * FROM accounts WHERE acc_id ='" + id + "' ")
    .then(( result ) => {
      if ( result.rows ) {
        result.rows.forEach((row, index ) => {
          r += row.acc_name;
//          console.log( index + 1, row );
        } );
      }
//      resolv( r );
    })
    .then( () => {
      pool.end();
      resolv( r );
    });
  });
}

async function showAccountName( id ) {
  var result = await getAccountName( id );
  return result;
}

showAccountName( 'masa' ).then( value => {
  console.log('mark1');
  console.log( 'value:' + value);
  console.log('mark2');
} );
