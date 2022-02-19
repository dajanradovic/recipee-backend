

class Validator{

    errorMessage = [];

    required(field, value){
        

        if(value == null || value == undefined || value == ''){
            this.requiredErrorMessage(field)
        }

    }

    maxLength(field, value, charactersCount){
       if(value && (value.length > charactersCount)){
           this.maxLengthErrorMessage(field, charactersCount);
        }
    }

    minLength(field, value, charactersCount){

        if(value && (value.length < charactersCount)){
            this.minLengthErrorMessage(field, charactersCount);
        }
    }

    arrayValidation(field, value, charactersCount){

        if(Array.isArray(value) && value.length > 0){
            value.forEach((item, index) =>{
                console.log('item',item)
                this.required(field + '.' + index, item)
                this.minLength(field + '.' + index, item, charactersCount)
            })
        }else{
            this.arrayErrorMessage(field)

       }


    }

    requiredErrorMessage(field){
        this.errorMessage.push(`${field} field is required`)
    }

    maxLengthErrorMessage(field, charactersCount){

        this.errorMessage.push(`${field} length is max ${charactersCount} characters`)
    }

    minLengthErrorMessage(field, charactersCount){

        this.errorMessage.push(`${field} length is min ${charactersCount} characters`)
    }

    arrayErrorMessage(field){
        console.log('array errpr message')
        this.errorMessage.push(`${field} must be an array or array must not be empty`)
    }

    validate(){
        throw new Error('You have to implement the method validate!');
    }

    getFieldsForValidation(){

        return [];

    }

   
}

module.exports = Validator