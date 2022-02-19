
const mongoUtil = require( '../database/Database' );
const Recipee = require('../models/Recipee');
const ObjectId = require('mongodb').ObjectId;
 sanitize = require('mongo-sanitize');

class RecipeeController{

    constructor(){
        this.db = mongoUtil.getDb()
        this.headers =  {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, PUT, GET, DELETE',
            'Content-Type' : 'application/json' 
             };
        
    }

    async insert(body, res){

            const parsedData = JSON.parse(body)
            console.log(parsedData.ingridients)

            const recipee = new Recipee(parsedData.name, parsedData.ingridients, parsedData.description, 'CREATE')
            const validationErrors = recipee.validate()
            console.log('validation',validationErrors)
            if(validationErrors?.length > 0){
                res.writeHead(422, {'Content-Type': 'application/json'}).end(JSON.stringify({data : {errors : validationErrors}})); 
                return;
            }
            try{
                await this.db.collection( 'recipees' ).insertOne(recipee.output());
                res.writeHead(201, this.headers).end(JSON.stringify({data : recipee})); 
            }
            catch(err){
                console.log(err.message)
                //res.status(422).json({message: err.message })
                }
    }

    async list(res, queryParams){

           
        const itemsPerPage = 12;
        const page = parseInt(queryParams.page)
        const startFrom = parseInt(page - 1) * itemsPerPage;

        try{
               
        const filterQuery = Recipee.formatFilterQuery(queryParams)

        const recipeesCount = await this.db.collection( 'recipees' ).find(filterQuery).count();

        const meta = {
            totalItems : recipeesCount,
            totalPages : Math.ceil(recipeesCount / itemsPerPage),
            currentPage : page,
            previousPage : page == 1 ? null : page -1,
            nextPage: parseInt(recipeesCount > (page * itemsPerPage) ? page + 1 : null)
        }

        
        const recipees = await this.db.collection( 'recipees' ).find(filterQuery).skip(startFrom)
        .limit(itemsPerPage)
        .toArray();
            
            
        res.writeHead(200, this.headers).end(JSON.stringify({data : recipees, meta})); 
        }
        catch(err){
            res.writeHead(500, {'Content-Type': 'application/json'}).end(JSON.stringify({ message: 'something went wrong' })); 
        }
        //const files = await db.collection('recipees').insertOne(myobj);
    }

    async single(res, param){

          
        try{
            const single = await this.db.collection( 'recipees' ).findOne({"_id" : ObjectId(param)});
            res.writeHead(200, this.headers).end(JSON.stringify({data : single})); 
        }
        catch(err){
            res.end({message: err.message })
            }
          
    }

    async update(body, res, param){

           const parsedData = JSON.parse(body)
           const recipee = new Recipee(parsedData.name, parsedData.ingridients, parsedData.description, 'UPDATE')

           const validationErrors = recipee.validate()
           if(validationErrors?.length > 0){
                res.writeHead(422, {'Content-Type': 'application/json'}).end(JSON.stringify({data : {errors : validationErrors}})); 
                return;
           }
       
        try{
            await this.db.collection( 'recipees' ).updateOne({"_id" : ObjectId(param)}, {$set : recipee.output()});
            const updatedRecipee = await this.db.collection( 'recipees' ).findOne({"_id" : ObjectId(param)});
            res.writeHead(200, this.headers).end(JSON.stringify({data : updatedRecipee})); 
        }
        catch(err){
            //console.log(err.message)
            res.end({message: err.message })
            }
    }

    async delete(res, param){

          
        try{
            const deletedResponse = await this.db.collection( 'recipees' ).deleteOne({"_id" : ObjectId(param)});
            console.log(deletedResponse)
            res.writeHead(200, this.headers).end(JSON.stringify({data : {deleted : deletedResponse.deletedCount > 0}})); 
        }
        catch(err){
            res.end({message: err.message })
            }
 }



}

module.exports = RecipeeController