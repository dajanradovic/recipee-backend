<template>
    
  <ul class="pagination">
    <li v-for="n in pagesCount" :key="n" v-bind:class="n == currentPage ? 'active' : 'waves-effect'"><a @click="$emit('fetchNew', n)">{{n}}</a></li>
  </ul>
            
</template>

<script>

export default {
  props:['pagesCount', 'currentPage'],
}
</script>

<style scoped>
  
  .material-icons{
    font-size: 12px;
  }
</style>
