<template>
    <nav>
    <div class="nav-wrapper">
        <a onclick="(() => window.location.href='/recipees')()"  class="brand-logo left">Home</a> 
         <ul id="nav-mobile" class="right">
           <li><router-link to="/recipee/create" class="waves-effect waves-light btn">Create recipee</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>

export default {
  
}
</script>

<style scoped>

.brand-logo{
  margin-left: 10px;
  cursor: pointer;
}

</style>
