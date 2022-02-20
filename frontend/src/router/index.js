import Vue from 'vue'
import Router from 'vue-router'
import RecipeesList from '../components/RecipeesList'
import RecipeeForm from '../components/RecipeeForm'
import EditRecipeeForm from '../components/EditRecipeeForm'
import ReadMore from '../components/ReadMore'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: to => {
         return { path: '/recipees' }
      },
         
    },
    {

    path: '/recipees',
    name: 'Home',
    component: RecipeesList,
    
  },
    {
        path: '/recipee/create',
        name: 'RecipeeForm',
        component: RecipeeForm,
        
      },
      {
        path: '/recipee/:id',
        name: 'ReadMore',
        component: ReadMore,
        
      },
      {
        path: '/recipee/:id/edit',
        name: 'RecipeeEditForm',
        component: EditRecipeeForm,
       
      },
     ],
    mode: 'history'
})