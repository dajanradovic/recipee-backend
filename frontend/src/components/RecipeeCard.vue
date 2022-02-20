<template>

    <div class="card blue-grey darken-1" id="card-wrapper">
     <div id="test">
          <router-link :to="{ name: 'RecipeeEditForm', params: { id: id }}" class="waves-effect waves-light btn-small actions"><i class="material-icons">mode_edit</i></router-link>
          <button @click="removeRecipee(id)" class="waves-effect #d32f2f red darken-2 btn-small actions"><i class="material-icons">delete</i></button>
        </div>
        <div class="card-image">
          <img alt="img" :src="path ? baseUrl + '/image?path=' + path : image" >
        </div>
        <div class="card-content white-text">
          <span class="card-title">{{name}}</span>
          <p>{{shortDescription}}</p>
        </div>
        <div class="liner"></div>
        <div id="ingridients-wrapper">
            <span class="ingridients" v-for="ingridient in ingridients" :key="ingridient">{{ingridient}}</span>
        </div>
        <div class="card-action">
        <router-link :to="{ name: 'ReadMore', params: { id: id }}" id="read-more-button" class="waves-effect waves-light btn-small">Read More</router-link>
         
        </div>
      </div>
  
</template>

<script>
import ApiHandler from '../handlers/ApiHandler.js'
const imgLink = require('../../public/no-image1.jpg')
import  { baseBackendUrl  }  from '../../settings.js'


export default {
    name: 'RecipeeCard',
    props: ['name', 'description', 'ingridients', 'id', 'path'],
     data(){
      return{
         image : imgLink,
         baseUrl : baseBackendUrl
      }
  },
    methods: {
      async removeRecipee(id){

          if(confirm("Are you sure?")){
           
              let apiHandler = new ApiHandler()

              try{
                let deletedRecipee = await  apiHandler.deleteRecipee(id)
                this.$emit('refetch')
              } catch(err){
                  console.log(err)
                    }

          }
        

      }

    },
    computed:{

      shortDescription(){
        
        return this.description && (this.description.length > 80) ? this.description.substring(0, 80) + '...' : this.description ?? null
      }
    }
}
</script>

<style scoped>

    .btn{
        width: 100px;
        margin: 5px;
    }

    .ingridients{
        padding:1px 1px 1px 1px;
        color:white;
        background-color:#0b99df;
        border-radius:5px;
        font-size: 10px;
        margin: 2px 2px 2px 2px;
    }
    .card-action{
        margin-top: 5px;
        
    }

    .liner{
        border-top: 1px solid rgba(160,160,160,0.2);
        margin-bottom: 5px;
    }

    #ingridients-wrapper{
      width: 100%;
      display:flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 4px;
    }

    #read-more-button{

      width:100%;
    }

    #test{
      display:flex;
      margin-top: 5px;
      justify-content: flex-end;
    }

    .actions{
      margin-right: 5px;
    }

    .card .card-image img{
      height: 200px;
      margin-top: 10px;
    }

</style>
