import Vue from 'vue'
import Router from 'vue-router'
import PhotoEditor from '@/components/PhotoEditor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PhotoEditor',
      component: PhotoEditor
    }
  ]
})
