const Validator = require("../validators/Validator");
let sanitize = require('mongo-sanitize');

class Recipee extends Validator{


    constructor(name, ingridients, description, type){
        super();
        this.name = sanitizeString(name);
        this.ingridients = sanitizeArray(ingridients)
        this.description = sanitizeString(description)

        if(type == 'CREATE'){
            this.created_at = new Date()
            this.updated_at = new Date()
        }else{
            this.updated_at = new Date()
        }

    }

    getFieldsForValidation(){

        return ['name','ingridients', 'description'];
    }

    validate(){
            const fieldsToValidate = this.getFieldsForValidation();

            const nameMinLength = 2
            const nameMaxLength = 100
            const descriptionMinLength = 2
            const descriptionMaxLength = 300
            const arrayItemMinLength = 2

            for(let propertyName in this) {

                if(fieldsToValidate.includes(propertyName) && propertyName == 'name'){
                        this.required(propertyName, this[propertyName])
                        this.maxLength(propertyName, this[propertyName], nameMaxLength)
                        this.minLength(propertyName, this[propertyName], nameMinLength)
                }
               else if(fieldsToValidate.includes(propertyName) && propertyName == 'description'){

                        this.required(propertyName, this[propertyName])
                        this.maxLength(propertyName, this[propertyName], descriptionMaxLength)
                        this.minLength(propertyName, this[propertyName], descriptionMinLength)
                        
                    }
                else if(fieldsToValidate.includes(propertyName) && propertyName == 'ingridients'){
                        console.log('nutraa array')
                        this.arrayValidation(propertyName, this[propertyName], arrayItemMinLength)
                       
                        
                    }
                  
             }

             return this.errorMessage.length > 0 ? this.errorMessage : this.errorMessage = undefined;
         
    }

    output(){
        return {
            'name' : this.name,
            'description' : this.description,
            'ingridients' : this.ingridients,
            'created_at' : this.created_at,
            'updated_at' : this.updated_at
        }
    }

    static formatFilterQuery(queryParameters){

        const filterQuery = {};
        const nameQuery = {};
        const ingridientsQuery = {};

        let queryParams = sanitize(queryParameters)

        if(queryParams.name){
            nameQuery.name = new RegExp(`^${queryParams.name}`, 'i')
            filterQuery.$or = [nameQuery]

        }

        if(queryParams.ingridients){
            ingridientsQuery.ingridients = new RegExp(`^${queryParams.ingridients}`, 'i')
            filterQuery.$or.push(ingridientsQuery) 

        }
       
        return filterQuery
    }
        
}

module.exports = Recipee