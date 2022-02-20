const fs = require('fs');
const url = require('url');
const formidable = require('formidable');
RecipeeController = require('../controllers/RecipeeController')


class Router{

static init(req, res){

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
            let html = fs.readFileSync(__basedir + '/frontend/public/index.html'); 
                
            res.writeHead(200, {"Content-Type": "text/html"})
            res.write(html);  
            res.end();  
            return

        }catch(err){

            let html = fs.readFileSync(__basedir + '/frontend/public/error500.html'); 
                     
            res.writeHead(500, {"Content-Type": "text/html"})
            res.write(html);  
            res.end(); 
            return 
        }
    }

    try{
            
        let recipeeController = new RecipeeController();

        const [path, pathParam, queryParams] = Router.parseUrl(req);
        console.log(path, pathParam, queryParams)

        if(path ==='/api/recipees' && req.method == 'POST') {

            let form = new formidable.IncomingForm();
            form.parse(req, async function(err, fields, files) {
                if (err)  return;

                recipeeController.insert(fields.name, fields.description, fields.ingridients, files.image, res);
                return;
            
              });
              return;
           
        }
        else if(path == '/api/image' && req.method == 'GET'){
            try{ 
                 let html = fs.readFileSync(__basedir + '/frontend/public/images/' + queryParams.path); 
                     
                 res.writeHead(200, {"Content-Type": "image/jpg"})
                 res.write(html);  
                 res.end();  
                 return
     
             }catch(err){
                 let html = fs.readFileSync(__basedir + '/frontend/public/error500.html'); 
                          
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
              recipeeController.update(data.toString(), res, pathParam);
            })
            
            
        }
        else if(path ==='/api/recipees/:id' && req.method == 'DELETE') {

            recipeeController.delete(res, pathParam);
                
        }
        else if(path ==='/api/recipees' && req.method == 'GET') {
            recipeeController.list(res, queryParams);
        }
        else if(path ==='/api/recipees/:id' && req.method == 'GET') {
            recipeeController.single(res, pathParam);
        }
        else {
            res.status(404).send({ message: 'Not found' }); 
            return;
        }

    }catch(error){
         res.writeHead(404, {'Content-Type': 'application/json'}).end(JSON.stringify({ message: 'error' }));
         return
    }

}

static parseUrl(request){

    let urlString = url.parse(request.url, true);
    let page = urlString.query.page ?? 1;
    let name = urlString.query.name ?? null;
    let ingridients = urlString.query.ingridients ?? null
    let path = urlString.query.path ?? null

   // console.log(urlString.query.page)
    const pathArray = urlString.pathname.split("/");

    if(pathArray && pathArray[1]!== undefined && pathArray[2]!== undefined && pathArray[2] !== ''){
            if(pathArray[3]!== undefined && pathArray[3] !== ''){
                return [`/${pathArray[1]}/${pathArray[2]}/:id`, pathArray[3], {
                    page,
                    name,
                    ingridients,
                    path
                }]
            }
            
            return [`/${pathArray[1]}/${pathArray[2]}`, null, {
                page,
                name,
                ingridients,
                path
            }]

    }
}


}

module.exports = Router