import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/homeView.vue'
import AddUser from '@/components/addUser.vue'
import FindUser from '@/components/findUser.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/addUser', component: AddUser },
    { path: '/findUser', component: FindUser }
  ],
})

export default router
