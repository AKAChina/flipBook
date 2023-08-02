<template>
  <div id="app">
    <!-- <page-turning /> -->
    <pageTurning/>
  </div>
</template>

<script>

// import my_ribbion from './components/my-ribbon.vue'
import pageTurning from './components/pageTurning.vue';

export default {
  name: 'App',
  components: {
    pageTurning
  },
  data(){
    return{
    }
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  
}
</style>
