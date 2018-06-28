import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import injectTest from '@/components/injectTest'
import provideTest from '@/components/provideTest'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/provideTest',
      name: 'provideTest',
      component: provideTest
    },
    {
      path: '/injectTest',
      name: 'injectTest',
      component: injectTest
    }
  ]
})
