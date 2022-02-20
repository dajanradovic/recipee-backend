let url = require('url');

function parseUrl(request){

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


module.exports = {
    parseUrl
    
 }
