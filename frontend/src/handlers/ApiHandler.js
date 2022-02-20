import axios from 'axios';
import  { baseBackendUrl  }  from '../../settings.js'

export default class ApiHandler {

     #headers = {
         'Content-Type' : 'application/json',
         'Accept' : 'application/json'
     }

     constructor(baseUrl = baseBackendUrl){
        this.baseUrl = baseUrl
        
     }

    async getAllRecipees(pageNumber = 1, searchInput){
       console.log(searchInput)
      if(searchInput){

         let result = await axios.get(`${this.baseUrl}/recipees?page=${pageNumber}&name=${searchInput}&ingridients=${searchInput}`, this.headers);

         return result.data;
      }
      
       let result = await axios.get(`${this.baseUrl}/recipees?page=${pageNumber}`, this.headers);

       return result.data;
 
    }

    async getSingleRecipee(id){

        let result = await axios.get(`${this.baseUrl}/recipees/${id}`, this.headers);
 
        return result.data;
   
     }


     async createRecipee(formData){

        let result = await axios.post(`${this.baseUrl}/recipees`, formData, {'Content-Type' : 'multipart/form-data',
        'Accept' : 'application/json'});
 
        return result.data;
       
   
     }

     async updateRecipee(description, name, ingridients, id){
       
      let result = await axios.put(`${this.baseUrl}/recipees/${id}`, {description, name, ingridients}, this.headers);

      return result.data;
     
 
   }

     async deleteRecipee(id){
       
      let result = await axios.delete(`${this.baseUrl}/recipees/${id}`, {}, this.headers);

      return result.data;
      
   }
 
     

}