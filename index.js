const http = require('http');
Router = require('./backend/utils/Router')
const MongoClient = require('mongodb').MongoClient;
const mongoUtil = require( './backend/database/Database' );
global.__basedir = __dirname;

//database connection
mongoUtil.connectToServer( function( err, client ) {
  if (err) throw new Error('something went wrong');
} );


  //server and router
http.createServer(async function (req, res) {

    Router.init(req, res);
    

}).listen(3000, function() {
      
    console.log("server start at port 3000");
});
