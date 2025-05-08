import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../components/HomePage.vue'
import EvaluationPage from '../components/EvaluationPage.vue'
import LeaderboardPage from '../components/LeaderboardPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/evaluation',
    name: 'Evaluation',
    component: EvaluationPage
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: LeaderboardPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router 