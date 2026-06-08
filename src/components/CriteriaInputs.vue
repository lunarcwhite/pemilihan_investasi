<template>
  <div class="bg-white rounded-2xl border border-secondary p-6 md:p-8 shadow-sm flex flex-col gap-6">
    <h3 class="text-lg font-bold text-text-primary border-b border-secondary pb-3">Parameter Finansial Anda</h3>

    <!-- C1 Capital / Modal -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-semibold text-text-primary/80 flex justify-between">
        <span>Modal Investasi (C1)</span>
        <span class="text-xs text-text-primary/50">Skala Kelayakan: {{ mappedC1 }}</span>
      </label>
      <div class="relative">
        <input 
          type="text" 
          v-model="formattedC1"
          @input="onC1Input"
          placeholder="Masukkan jumlah modal (cth: 1.000.000)"
          class="w-full pl-4 pr-18 py-3 bg-dominant border border-secondary rounded-xl font-semibold text-lg text-text-primary focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
        />
        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-primary/40">Rupiah</span>
      </div>
      
      <!-- Preset Buttons -->
      <div class="flex flex-wrap gap-2 mt-1">
        <button 
          v-for="preset in presets" 
          :key="preset.value"
          @click="applyPreset(preset.value)"
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-secondary hover:border-accent hover:bg-accent/5 hover:text-accent transition-all duration-200"
          :class="rawC1 === preset.value ? 'bg-accent/10 border-accent text-accent' : 'bg-white text-text-primary/70'"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- C2 Horizon / Jangka Waktu -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-semibold text-text-primary/80 flex justify-between">
        <span>Jangka Waktu Investasi (C2)</span>
        <span class="text-accent font-bold">{{ horizonLabels[c2 - 1] }}</span>
      </label>
      <input 
        type="range" 
        v-model.number="c2" 
        min="1" 
        max="5" 
        class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent transition-all duration-200"
      />
      <div class="flex justify-between text-[10px] font-semibold text-text-primary/45 px-1">
        <span>Jangka Pendek (&lt;1 Thn)</span>
        <span>Jangka Panjang (&gt;5 Thn)</span>
      </div>
    </div>

    <!-- C3 Risk / Risiko -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-semibold text-text-primary/80 flex justify-between">
        <span>Toleransi Risiko (C3)</span>
        <span class="text-accent font-bold">{{ riskLabels[c3 - 1] }}</span>
      </label>
      <input 
        type="range" 
        v-model.number="c3" 
        min="1" 
        max="5" 
        class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent transition-all duration-200"
      />
      <div class="flex justify-between text-[10px] font-semibold text-text-primary/45 px-1">
        <span>Aman / Konservatif</span>
        <span>Tinggi / Agresif</span>
      </div>
    </div>

    <!-- C4 Liquidity / Likuiditas -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-semibold text-text-primary/80 flex justify-between">
        <span>Kebutuhan Likuiditas (C4)</span>
        <span class="text-accent font-bold">{{ liquidityLabels[c4 - 1] }}</span>
      </label>
      <input 
        type="range" 
        v-model.number="c4" 
        min="1" 
        max="5" 
        class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent transition-all duration-200"
      />
      <div class="flex justify-between text-[10px] font-semibold text-text-primary/45 px-1">
        <span>Sangat Rendah (Locked)</span>
        <span>Sangat Tinggi (Instan)</span>
      </div>
    </div>

    <!-- Action Trigger -->
    <button 
      @click="triggerCalculation"
      class="mt-4 w-full py-4.5 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:bg-accent/95 hover:shadow-accent/30 active:scale-98 transition-all duration-200 text-base"
    >
      Dapatkan Rekomendasi
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['calculate'])

// Input States
const formattedC1 = ref('')
const rawC1 = ref(0)
const c2 = ref(3) // Default scale: 3
const c3 = ref(3)
const c4 = ref(3)

const presets = [
  { label: 'Rp 1.000.000', value: 1000000 },
  { label: 'Rp 5.000.000', value: 5000000 },
  { label: 'Rp 10.000.000', value: 10000000 },
  { label: 'Rp 50.000.000', value: 50000000 }
]

const horizonLabels = [
  'Sangat Pendek (< 1 Tahun)',
  'Pendek (1 - 2 Tahun)',
  'Menengah (2 - 3 Tahun)',
  'Panjang (3 - 5 Tahun)',
  'Sangat Panjang (> 5 Tahun)'
]

const riskLabels = [
  'Sangat Rendah (Konservatif)',
  'Rendah (Moderat Konservatif)',
  'Sedang (Berimbang)',
  'Tinggi (Moderat Agresif)',
  'Sangat Tinggi (Agresif)'
]

const liquidityLabels = [
  'Sangat Rendah (Locked / > 1 Tahun)',
  'Rendah (Bulanan)',
  'Sedang (Mingguan)',
  'Tinggi (Harian / T+2)',
  'Sangat Tinggi (Seketika / Instan)'
]

// Map capital to 1-5 scale for TOPSIS
const mappedC1 = computed(() => {
  const val = rawC1.value
  if (val <= 1000000) return 1
  if (val <= 5000000) return 2
  if (val <= 10000000) return 3
  if (val <= 50000000) return 4
  return 5
})

// Formatting helper
const formatNumber = (val) => {
  if (!val) return ''
  const numberString = val.toString().replace(/[^0-9]/g, '')
  if (!numberString) return ''
  const split = numberString.split('')
  let sisa = split.length % 3
  let rupiah = split.slice(0, sisa).join('')
  const ribuan = split.slice(sisa).join('').match(/\d{3}/gi)
  if (ribuan) {
    const separator = sisa ? '.' : ''
    rupiah += separator + ribuan.join('.')
  }
  return rupiah
}

const onC1Input = (e) => {
  const cleanVal = e.target.value.replace(/[^0-9]/g, '')
  rawC1.value = cleanVal ? parseInt(cleanVal, 10) : 0
  formattedC1.value = formatNumber(rawC1.value)
}

const applyPreset = (value) => {
  rawC1.value = value
  formattedC1.value = formatNumber(value)
}

const triggerCalculation = () => {
  emit('calculate', {
    c1: mappedC1.value,
    c2: c2.value,
    c3: c3.value,
    c4: c4.value,
    rawC1: rawC1.value
  })
}
</script>
