var express = require('express');
var router  = express.Router();
var pgp     = require('pg-promise')();
var db      = pgp( process.env.DATABASE_URL );
//
//  prepare 
//  $export DATABASE_URL=postgres://[id]:[password]@localhost:5432/opaqueshaft

