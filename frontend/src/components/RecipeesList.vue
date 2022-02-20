<template>
<div class="row">
  
  <nav id="searchbar">
    <div class="nav-wrapper">
      <form>
        <div class="input-field">
          <input id="search" v-model="searchInput" placeholder="Search by name or ingridient" type="search"  v-on:keyup="search">
          <label class="label-icon" for="search"><i class="material-icons">search</i></label>
          <i class="material-icons">close</i>
        </div>
      </form>
    </div>
  </nav>
    <div v-if="recipeesList.length > 0" class="list">
        <RecipeeCard @refetch="fetchNewPage" class="list-item" v-for="recipee in recipeesList" 
                        :name="recipee.name" 
                        :description="recipee.description" 
                        :ingridients="recipee.ingridients" 
                        :key="recipee.id"
                        :id="recipee._id"
                        :path="recipee.image">
        </RecipeeCard>
    </div>
    <div id="no-data" v-else>No recipees available</div>
   <Pagination @fetchNew="fetchNewPage" :pagesCount="meta.totalPages" :currentPage="meta.currentPage"></Pagination>

  </div>
</template>

<script>
import ApiHandler from '../handlers/ApiHandler.js'
import RecipeeCard from './RecipeeCard.vue'
import Pagination from './Pagination.vue'
import _ from 'lodash'


export default {
  components: { 'RecipeeCard' : RecipeeCard,
                'Pagination' : Pagination},
  data(){
        return{
                recipeesList : [],
                meta: [],
                searchInput: null
        }
  },
  methods:{

    async fetchNewPage(pageNumber = this.meta.currentPage){
      let apiHandler = new ApiHandler()

      try{
        apiHandler.getAllRecipees(pageNumber, this.searchInput).then(res => {
            this.recipeesList = res.data
            this.meta = res.meta
            this.updateQuery(pageNumber, this.searchInput)

           })
      } catch(err){
          console.log(err)
            }

    },

    search: _.debounce(async function (e) {
      
      this.fetchNewPage(1)
      
    }, 1500),
   
  
  updateQuery(currentPage, searchInput){
      let queryObject = {}
      if(searchInput && searchInput !== ''){
          queryObject.name = searchInput
          queryObject.ingridients = searchInput
      }
      if(currentPage !== 1){
          queryObject.page = currentPage
      }

      queryObject = Object.keys(queryObject).length !== 0 ? queryObject : null;
      this.$router.replace({ path: '/recipees',  query : queryObject})   

  }
},

  async mounted(){
    const page = this.$route.query.page
    const search = this.$route.query.name
    this.searchInput = search
    this.fetchNewPage(page)
  
  }
}
</script>

<style>

  .list{
    display:flex;
    flex-wrap: wrap;
    justify-content: flex-start;

  }

  .list-item{
      width: 300px;
      flex-shrink:0; 
      margin: 10px;
      height: 550px;
      overflow: auto;
  }

  #searchbar{
  min-width: 200px;
  width: 500px;
  margin-top:20px;
  margin-left: 10px;
  }

  #no-data{

    margin-top: 20px;
    font-size: 20px;
    font-style:italic;
    margin-left: 10px;

  }
</style>
