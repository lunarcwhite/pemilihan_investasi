<template>
  <div class="flex-1 flex items-center justify-center p-6 bg-dominant">
    <div class="w-full max-w-md bg-white rounded-2xl border border-secondary p-8 shadow-sm flex flex-col gap-6">
      
      <!-- Card Header -->
      <div class="text-center flex flex-col gap-2">
        <h2 class="text-2xl font-bold tracking-tight text-text-primary">Login Administrator</h2>
        <p class="text-sm text-text-primary/60">Masuk untuk mengelola instrumen investasi dan parameter TOPSIS</p>
      </div>

      <!-- Error Notice -->
      <div 
        v-if="errorMessage" 
        class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-xs font-bold text-text-primary/75">Alamat Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="admin@smartinvest.id"
            class="px-4 py-3 bg-dominant border border-secondary/80 rounded-xl text-sm focus:outline-none focus:border-accent transition"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-xs font-bold text-text-primary/75">Kata Sandi</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="••••••••"
            class="px-4 py-3 bg-dominant border border-secondary/80 rounded-xl text-sm focus:outline-none focus:border-accent transition"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full mt-2 py-3 bg-accent text-white rounded-xl text-sm font-bold shadow-md shadow-accent/20 hover:bg-accent/90 disabled:bg-accent/50 disabled:shadow-none transition flex justify-center items-center gap-2"
        >
          <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>{{ isLoading ? 'Memproses...' : 'Masuk Ke Dashboard' }}</span>
        </button>
      </form>

      <!-- Back Link -->
      <div class="text-center mt-2">
        <router-link to="/" class="text-xs font-bold text-accent hover:underline">
          Kembali ke Rekomendasi
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const translateError = (errMessage) => {
  if (!errMessage) return 'Terjadi kesalahan saat mencoba masuk.'
  const msg = errMessage.toLowerCase()
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'Email atau password salah.'
  }
  if (msg.includes('email not confirmed')) {
    return 'Alamat email Anda belum dikonfirmasi.'
  }
  if (msg.includes('user not found')) {
    return 'Pengguna tidak terdaftar.'
  }
  return errMessage
}

const handleLogin = async () => {
  if (!supabase) {
    errorMessage.value = 'Koneksi Supabase belum terkonfigurasi. Tidak dapat melakukan login.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      errorMessage.value = translateError(error.message)
    } else {
      router.push('/admin-dashboard')
    }
  } catch (err) {
    errorMessage.value = 'Terjadi kesalahan sistem. Silakan coba lagi.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>
