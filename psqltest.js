const pg = require('pg');
//const cstring = 'postgres://user:password@localhost:5432/databasename';
const cstring = process.env.DATABASE_URL;
const pool = new pg.Pool(
	{ connectionString: cstring } );
pool.query('SELECT * FROM accounts')
  .then(( result ) => {
//    console.log('Success', result );
    if ( result.rows ) {
      result.rows.forEach((row, index ) => {
        console.log( index + 1, row );
      } );
    }
  })
  .catch( ( error ) => {
    console.log('Failure', error );
  })
  .then( () => {
    console.log('disconnect');
    pool.end();
  });
