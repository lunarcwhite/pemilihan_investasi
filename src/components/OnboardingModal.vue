<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
    <div class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-secondary flex flex-col min-h-[420px] justify-between">
      
      <!-- Slide Content -->
      <div class="p-8 flex-1 flex flex-col items-center justify-center text-center">
        <!-- Slide 1 -->
        <div v-if="currentStep === 0" class="flex flex-col items-center animate-fade-in">
          <div class="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-accent mb-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-text-primary">Selamat Datang di SmartInvest</h3>
          <p class="text-text-primary/75 leading-relaxed">
            Asisten cerdas berbasis ilmiah untuk membantu Anda memilih instrumen investasi terbaik yang disesuaikan khusus dengan kondisi finansial unik Anda.
          </p>
        </div>

        <!-- Slide 2 -->
        <div v-if="currentStep === 1" class="flex flex-col items-center animate-fade-in">
          <div class="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-accent mb-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-text-primary">Tentukan Kriteria Finansial</h3>
          <p class="text-text-primary/75 leading-relaxed">
            Sesuaikan kriteria modal, jangka waktu investasi, toleransi risiko, dan tingkat likuiditas (kemudahan pencairan) yang Anda inginkan menggunakan slider yang disediakan.
          </p>
        </div>

        <!-- Slide 3 -->
        <div v-if="currentStep === 2" class="flex flex-col items-center animate-fade-in">
          <div class="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-accent mb-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-text-primary">Hasil Rekomendasi TOPSIS</h3>
          <p class="text-text-primary/75 leading-relaxed">
            Sistem akan menghitung kemiripan pilihan dengan alternatif ideal menggunakan metode matematis TOPSIS, mengurutkan rekomendasi, dan menyajikan perbandingan instrumen secara berdampingan.
          </p>
        </div>
      </div>

      <!-- Navigation & Buttons Footer -->
      <div class="p-6 bg-secondary/35 border-t border-secondary flex justify-between items-center">
        <!-- Pagination Indicators -->
        <div class="flex gap-2">
          <span 
            v-for="(step, idx) in 3" 
            :key="idx"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            :class="idx === currentStep ? 'bg-accent w-6' : 'bg-text-primary/20'"
          ></span>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button 
            @click="closeOnboarding" 
            class="px-4 py-2 text-sm font-semibold text-text-primary/60 hover:text-text-primary hover:bg-secondary/60 rounded-xl transition-all duration-200"
          >
            Lewati
          </button>
          
          <button 
            v-if="currentStep < 2"
            @click="currentStep++"
            class="px-5 py-2.5 text-sm font-semibold bg-accent text-white rounded-xl hover:bg-accent/90 shadow-md shadow-accent/15 hover:shadow-accent/25 transition-all duration-200"
          >
            Lanjut
          </button>
          
          <button 
            v-else
            @click="closeOnboarding"
            class="px-5 py-2.5 text-sm font-semibold bg-accent text-white rounded-xl hover:bg-accent/90 shadow-md shadow-accent/15 hover:shadow-accent/25 transition-all duration-200"
          >
            Mulai
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const currentStep = ref(0)

onMounted(() => {
  const onboarded = localStorage.getItem('smartinvest_onboarded')
  if (!onboarded) {
    isVisible.value = true
  }
})

const closeOnboarding = () => {
  localStorage.setItem('smartinvest_onboarded', 'true')
  isVisible.value = false
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.35s ease-out forwards;
}
</style>
