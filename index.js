const http = require('http');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const { parseUrl } = require('./backend/helpers.js')
RecipeeController = require('./backend/controllers/RecipeeController')
const mongoUtil = require( './backend/database/Database' );
const fs = require('fs');
const formidable = require('formidable');

global.__basedir = __dirname;

//database connection
mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} );


const databaseUrl = process.env.MONGO_DB_CONNECTION_STRING;

/*MongoClient.connect(databaseUrl, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
   
    db.close();
  });
*/


  //server and router
http.createServer(async function (req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', '*');

    if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}

    if(req.url == '/'){
       try{ 
            let html = fs.readFileSync(__dirname + '/frontend/public/index.html'); 
                
            res.writeHead(200, {"Content-Type": "text/html"})
            res.write(html);  
            res.end();  
            return

        }catch(err){
            console.log(err)
            let html = fs.readFileSync(__dirname + '/frontend/public/error500.html'); 
                     
            res.writeHead(500, {"Content-Type": "text/html"})
            res.write(html);  
            res.end(); 
            return 
        }
    }

    try{
            

        //old paths
        const [path, pathParam, queryParams] = parseUrl(req);
        console.log(path, pathParam, queryParams)


        if(path ==='/api/recipees' && req.method == 'POST') {

            let form = new formidable.IncomingForm();
            let data = form.parse(req) 
            form.parse(req, async function(err, fields, files) {
                if (err)  return;

                let recipeeController = new RecipeeController();
                recipeeController.insert(fields.name, fields.description, fields.ingridients, files.image, res);
                return;
            
              });
              return;
           
        }
        else if(path == '/api/image' && req.method == 'GET'){
            try{ 
                 let html = fs.readFileSync(__dirname + '/frontend/public/images/' + queryParams.path); 
                     
                 res.writeHead(200, {"Content-Type": "image/jpg"})
                 res.write(html);  
                 res.end();  
                 return
     
             }catch(err){
                 let html = fs.readFileSync(__dirname + '/frontend/public/error500.html'); 
                          
                 res.writeHead(500, {"Content-Type": "text/html"})
                 res.write(html);  
                 res.end();  
                 return
             }
         }

        else if(path ==='/api/recipees/:id' && req.method == 'PUT') {
            let data = '';
            req.on('data', chunk => {
              data += chunk;
            })
            req.on('end', () => {
              let recipeeController = new RecipeeController();
              recipeeController.update(data.toString(), res, pathParam);
            })
            
        }
        else if(path ==='/api/recipees/:id' && req.method == 'DELETE') {

            let recipeeController = new RecipeeController();
            recipeeController.delete(res, pathParam);
                
        }
        else if(path ==='/api/recipees' && req.method == 'GET') {
            let recipeeController = new RecipeeController();
            recipeeController.list(res, queryParams);
        }
        else if(path ==='/api/recipees/:id' && req.method == 'GET') {
            let recipeeController = new RecipeeController();
            recipeeController.single(res, pathParam);
        }
        else {
            res.status(404).send({ message: 'Not found' }); 
        }

    }catch(error){
         res.writeHead(404, {'Content-Type': 'application/json'}).end(JSON.stringify({ message: 'error' })); 
    }

}).listen(3000, function() {
      
    console.log("server start at port 3000");
});
