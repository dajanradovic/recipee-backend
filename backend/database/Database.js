const MongoClient = require( 'mongodb' ).MongoClient;
require('dotenv').config()

const url = process.env.MONGO_DB_CONNECTION_STRING;;

let _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db('agilathon');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  },
  
};