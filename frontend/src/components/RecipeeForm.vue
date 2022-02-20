<template>
   <div class="row">
   <div v-if="alertSuccess" class="alert" v-text="editMode ? 'Recipe successfully updated' : 'New recipee successfully created!'">
        <span class="closebtn" @click="closeAlert">&times;</span> 
      
    </div>
    <div v-if="alertErrors.length > 0" class="alert-errors">
        <span class="closebtn" @click="closeErrorAlert">&times;</span> 
        <p v-for="error in alertErrors" :key="error">- {{error}}</p>
    </div>
    <form class="col s12 red lighten-5" v-on:submit.prevent>
      <div class="row">
        <div class="col s12">
          <label class="active" for="name">Title</label>
          <input v-model="name" id="name" type="text" class="validate">
        </div>
      <div class="col s12">
          <label class="active" for="description">Description</label>

          <textarea v-model="description" rows="4" cols="50" id="description" name="description" class="materialize-textarea active"></textarea>
     </div>
     </div>
      <div class="row">
        <div class="input-field col s6">
          <input v-model="ingridient" id="ingridient" type="text" v-on:keyup.enter="addIngridient">
          <label for="ingridient">Enter ingridient</label>
        </div>
        <div class="input-field col s6">
          <a @click="addIngridient" class="waves-effect waves-light btn-small">Add ingridient</a>
        </div>
      </div>
      <div class="row">
          <div v-for="ingridient in ingridientsList" :key="ingridient" class="chip" title="click to remove" @click="removeFromList(ingridient)">{{ingridient}}</div>
      </div>
            <div class="liner"></div>
        <div v-if="!editMode" id="image-select">
            <div v-if="!image">
          <h6>Select an image</h6>
          <input type="file" @change="onFileChange">
        </div>
        <div v-else>
          <img :src="image" />
          <button @click="removeImage">Remove image</button>
        </div>
      </div>
     
      <input v-if="editMode == true" type="submit" class="waves-effect waves-light #ff9800 orange btn" value="Submit changes" @click="onSubmit" />
      <input v-else type="submit" class="waves-effect waves-light btn" value="Create" @click="onSubmit"/>

    </form>
    
  </div>
        
</template>

<script>
import ApiHandler from '../handlers/ApiHandler.js'

export default {
  data(){
      return{
          name: '',
          description: '',
          ingridient: '',
          ingridientsList: [],
          editMode: false,
          alertSuccess: false,
          alertErrors: [],
          image : '',
          imageFile: ''
      }
  },
  methods: {
        addIngridient(){
            if(this.ingridientsList.includes(this.ingridient)){
                alert('ingridient already added')
            }else {

                this.ingridientsList.push(this.ingridient)
                this.ingridient = '';
            }
           
        },
        removeFromList(item){
            let filteredList = this.ingridientsList.filter(singleItem => singleItem !== item)
            this.ingridientsList = filteredList
        },
        async onSubmit(){
            if(!this.editMode){

                let apiHandler = new ApiHandler()

                try{
                  var formData = new FormData();
                  formData.append("image", this.imageFile);
                  formData.append("name", this.name);
                  formData.append("description", this.description);
                  formData.append("ingridients", JSON.stringify(this.ingridientsList));

                  await apiHandler.createRecipee(formData)

                  this.alertSuccess = true
                  this.alertErrors = false
                  this.name = ''
                  this.description = ''
                  this.ingridientsList = []
                }catch(error){
                  this.alertErrors = error.response.data.data.errors
                      }
            }else{
                
                let apiHandler = new ApiHandler()

                try{
                  await apiHandler.updateRecipee(this.description, this.name, this.ingridientsList, this.$route.params.id)

                  this.alertSuccess = true
                  this.alertErrors = false

                 
                }catch(error){
                  this.alertErrors = error.response.data.data.errors
                 }

            }
         },
         closeAlert(){
           this.alertSuccess = false
         },
         closeErrorAlert(){
           this.alertErrors = []
         },
         onFileChange(e) {

          let files = e.target.files || e.dataTransfer.files;
          if (!files.length)
            return;
          this.imageFile = e.target.files[0]  
          this.createImage(files[0]);
        },
    createImage(file) {

      let image = new Image();
      let reader = new FileReader();
      let vm = this;
  
      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
      this.image = '';
    }

    },
  mounted(){
    
    const id = this.$route.params.id
    if(id){
      
      this.editMode = true

      let apiHandler = new ApiHandler()

      try{
        apiHandler.getSingleRecipee(id).then(res=>{
            this.name = res.data.name
            this.description = res.data.description
            this.ingridientsList = res.data.ingridients
           })
      }catch(err){
          console.log(err.response.data)
            }

    }

  }
}
</script>

<style scoped>
    form{
    margin: 50px;
    padding: 50px 50px 50px 50px !important;
    border-radius: 20px;
    }
    .row{
        margin: 0 auto;
    }
    .ingridient-wrapper{
        margin-top: 5px;
    }

    .input-field.col.s12.ingridient-wrapper{
        margin-top: 0.5rem !important;
    }

    .liner{
    border-top: 1px solid rgba(160,160,160,0.2);
    margin-bottom: 15px;
}

    .alert {
      margin-top:20px;
      padding: 10px;
      background-color: green;
      color: white;
      border-radius: 20px;

    }

    .alert-errors {
      margin-top:20px;
      padding: 10px;
      background-color:red;
      color: white;
      border-radius: 20px;

    }

    .closebtn {
      margin-left: 15px;
      color: white;
      font-weight: bold;
      float: right;
      font-size: 22px;
      line-height: 20px;
      cursor: pointer;
      transition: 0.3s;
    }

    .closebtn:hover {
      color: black;
    }

    img {
      width: 150px;
      display: block;
      margin-bottom: 10px;
    }

    #image-select{
      margin-bottom: 20px;
    }
</style>
