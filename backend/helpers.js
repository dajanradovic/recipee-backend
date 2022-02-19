let url = require('url');
let sanitizer = require('sanitize')();

function parseUrl(request){

    let urlString = url.parse(request.url, true);
    let page = urlString.query.page ?? 1;
    let name = urlString.query.name ?? null;
    let ingridients = urlString.query.ingridients ?? null
   // console.log(urlString.query.page)
    const pathArray = urlString.pathname.split("/");

    if(pathArray && pathArray[1]!== undefined && pathArray[2]!== undefined && pathArray[2] !== ''){
            if(pathArray[3]!== undefined && pathArray[3] !== ''){
                return [`/${pathArray[1]}/${pathArray[2]}/:id`, pathArray[3], {
                    page,
                    name,
                    ingridients
                }]
            }
            
            return [`/${pathArray[1]}/${pathArray[2]}`, null, {
                page,
                name,
                ingridients
            }]

    }
}

function sanitizeString(input){
   return  sanitizer.value(input, String);

}

function sanitizeArray(input){
    return  sanitizer.value(input, Array);

}



module.exports = {
    parseUrl,
    sanitizeString,
    sanitizeArray
 }
