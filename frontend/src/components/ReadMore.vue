<template>
<div>
    <h1>{{name}}</h1>
    <img v-if="path" class="responsive-img" :src="baseUrl + '/image?path=' + path" />
    <p>{{description}}</p>
    <div class="row">
          <div v-for="ingridient in ingridientsList" :key="ingridient" class="chip">{{ingridient}}</div>
    </div>
</div>
</template>

<script>
import ApiHandler from '../handlers/ApiHandler.js'
import { baseBackendUrl } from '../../settings.js'
let apiHandler = new ApiHandler()


export default {
  data(){
      return{
          name: '',
          description: '',
          ingridientsList: [],
          path : '',
          baseUrl : baseBackendUrl
        
      }
  },
  mounted(){
    
    const id = this.$route.params.id
    if(id){
      
      this.editMode = true
      try{
        apiHandler.getSingleRecipee(id).then(res=>{
            this.name = res.data.name
            this.description = res.data.description
            this.ingridientsList = res.data.ingridients
            this.path = res.data.image
           })
      }catch(err){
          console.log(err.response.data)
            }

    }

  }
}
</script>

<style scoped>



</style>
