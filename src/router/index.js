import Vue from 'vue'
import Router from 'vue-router'
import homepage from '../components/homepage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {  
      path: '/',  
      redirect: '/homepage'  
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: homepage
    }
  ]
})