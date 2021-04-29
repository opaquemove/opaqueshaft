var express = require('express');
var router  = express.Router();
var pgp     = require('pg-promise')();
var conf = {
  connectionString : process.env.DATABASE_URL,
  max : 30,
  ssl : ssl
 };

var db      = pgp( conf );
//var db      = pgp( process.env.DATABASE_URL );
//
//  prepare 
//  $export DATABASE_URL=postgres://[id]:[password]@localhost:5432/opaqueshaft
db.any("select * from accounts")
  .then(function ( data ) {
    console.log( data );
    } )
    .catch( function (error) {
      console.log( error );
     } );

