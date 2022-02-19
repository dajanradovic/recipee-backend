const http = require('http');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const { parseUrl } = require('./backend/helpers.js')
RecipeeController = require('./backend/controllers/RecipeeController')
const mongoUtil = require( './backend/database/Database' );
const fs = require('fs/promises');
const formidable = require('formidable');

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

async function uploader(req, res){

    console.log('unutra forme')
    let form = new formidable.IncomingForm();
    let data = await form.parse(req) 
    const oldpath = data.openedFiles[0].filepath;
    const newpath = __dirname + '/frontend/public/images/' + data.openedFiles[0].originalFilename;
    await fs.rename(oldpath, newpath)
    console.log('nakon renamea')
        //res.write('File uploaded and moved!');
       // res.writeHead(200)
       // res.end();
      


}
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
                
            res.wridteHead(200, {"Content-Type": "text/html"})
            res.write(html);  
            res.end();  

        }catch(err){
            let html = fs.readFileSync(__dirname + '/frontend/public/error500.html'); 
                     
            res.writeHead(500, {"Content-Type": "text/html"})
            res.write(html);  
            res.end();  
        }
    }

    try{
            

        //old paths
        const [path, pathParam, queryParams] = parseUrl(req);
        console.log(path, pathParam, queryParams)

        if(path ==='/api/upload' && req.method == 'POST') {
           
            try{
            await uploader(req, res)
            res.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify({ message: 'success' })); 
            return

            }catch(err){
                console.log(err)
            }
            console.log('gotovo')
         /*let form=new formidable.IncomingForm(),
                files=[],
                fields=[]
            form.uploadDir=__dirname + '/frontend/public/images/'

            form.on('field', (field, value)=>{
                fields.push([field, value])
            })
            .on('file', (field, file)=>{
                files.push([field, file])
            })
            .on('end', ()=>{
                console.log(files, fields, 'FT here awefwa', __filename)
                console.log('Upload terminado')
                //res.writeHead(200)

                res.end()
                return
            })
            form.parse(req)*/
        }

        if(path ==='/api/recipees' && req.method == 'POST') {
            req.on('data', function(chunk) {
                let recipeeController = new RecipeeController();
                recipeeController.insert(chunk.toString(), res);
              });
           
            //res.end(JSON.stringify({ message: 'Hello from about page' })); 
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
