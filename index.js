const http = require('http');
Router = require('./backend/utils/Router')
const MongoClient = require('mongodb').MongoClient;
const mongoUtil = require( './backend/database/Database' );
global.__basedir = __dirname;

//database connection
mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} );



//const databaseUrl = process.env.MONGO_DB_CONNECTION_STRING;

/*MongoClient.connect(databaseUrl, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
   
    db.close();
  });
*/


  //server and router
http.createServer(async function (req, res) {

    Router.init(req, res);
    

}).listen(3000, function() {
      
    console.log("server start at port 3000");
});
