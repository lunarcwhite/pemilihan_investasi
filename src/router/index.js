import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../utils/supabase'
import PublicDashboard from '../views/PublicDashboard.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PublicDashboard
  },
  {
    path: '/admin-login',
    name: 'Login',
    component: AdminLogin,
    meta: { guestOnly: true }
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!supabase) {
    // Jika Supabase tidak terkonfigurasi, biarkan navigasi lewat (atau sesuaikan)
    next()
    return
  }

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (to.meta.requiresAuth && !session) {
      next('/admin-login')
    } else if (to.meta.guestOnly && session) {
      next('/admin-dashboard')
    } else {
      next()
    }
  } catch (err) {
    console.error('Error saat memeriksa session auth:', err)
    next()
  }
})

export default router
