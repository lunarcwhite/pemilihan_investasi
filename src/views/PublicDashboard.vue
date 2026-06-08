<template>
  <div class="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 flex flex-col md:grid md:grid-cols-12 gap-8">
    <!-- Left Column: Inputs -->
    <div class="md:col-span-5 flex flex-col gap-6">
      <CriteriaInputs @calculate="handleCalculate" />
      
      <!-- History Panel -->
      <div v-if="history.length > 0" class="bg-white rounded-2xl border border-secondary p-6 shadow-sm flex flex-col gap-4">
        <div class="flex justify-between items-center border-b border-secondary pb-3">
          <h4 class="font-bold text-sm text-text-primary">Riwayat Simulasi</h4>
          <button 
            @click="confirmResetHistory"
            class="text-xs font-bold text-red-500 hover:text-red-700 transition"
          >
            Hapus Semua
          </button>
        </div>
        <div class="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
          <div 
            v-for="(record, idx) in history" 
            :key="idx" 
            @click="loadHistoryRecord(record)"
            class="p-3 bg-dominant hover:bg-secondary/40 border border-secondary/50 rounded-xl cursor-pointer transition flex justify-between items-center"
          >
            <div class="flex flex-col text-left">
              <span class="text-xs font-bold text-text-primary">Modal: Rp {{ formatNumber(record.rawC1) }}</span>
              <span class="text-[10px] text-text-primary/50">C2:{{ record.c2 }} | C3:{{ record.c3 }} | C4:{{ record.c4 }}</span>
            </div>
            <span class="text-xs font-extrabold text-accent bg-accent/5 px-2 py-1 rounded-md">
              {{ record.topAlternative }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Results -->
    <div class="md:col-span-7 flex flex-col gap-6">
      
      <!-- Empty State -->
      <div v-if="!hasCalculated" class="bg-white rounded-2xl border border-secondary p-6 md:p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
        <div class="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-accent mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold mb-2">Belum Ada Rekomendasi</h2>
        <p class="text-text-primary/70 max-w-md text-sm">
          Tentukan kriteria finansial Anda menggunakan slider di atas, lalu ketuk tombol Dapatkan Rekomendasi untuk memulai kalkulasi.
        </p>
      </div>

      <!-- Calculated Results -->
      <template v-else>
        <!-- TOPSIS Ranked list -->
        <ResultsList 
          :results="results" 
          :selectedIds="selectedCompareIds"
          @toggle-compare="handleToggleCompare"
        />

        <!-- Comparison Grid -->
        <ComparisonTable 
          v-if="selectedAlternatives.length >= 2"
          :items="selectedAlternatives"
        />
      </template>
    </div>

    <!-- Onboarding Modal -->
    <OnboardingModal />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import OnboardingModal from '../components/OnboardingModal.vue'
import CriteriaInputs from '../components/CriteriaInputs.vue'
import ResultsList from '../components/ResultsList.vue'
import ComparisonTable from '../components/ComparisonTable.vue'
import { calculateTOPSIS } from '../utils/topsis'
import { supabase } from '../utils/supabase'

const hasCalculated = ref(false)
const results = ref([])
const selectedCompareIds = ref([])
const history = ref([])
const alternatives = ref([])
const criterias = ref([])

// Static fallback seed data
const alternativesSeed = [
  { 
    id: 'A1', 
    name: 'Deposito Bank', 
    tagline: 'Simpanan bank aman berjangka',
    description: 'Pilihan investasi sangat aman yang dijamin oleh negara (LPS). Sangat cocok untuk mengamankan nilai modal jangka pendek.',
    scores: [2, 2, 1, 2],
    legality_desc: 'Dijamin LPS (UU No. 24 Tahun 2004)',
    legality_link: 'https://lps.go.id'
  },
  { 
    id: 'A2', 
    name: 'Emas Fisik', 
    tagline: 'Logam mulia lindung nilai',
    description: 'Investasi safe-haven tradisional yang sangat likuid. Nilainya cenderung naik dalam jangka panjang sebagai perlindungan inflasi.',
    scores: [1, 4, 2, 4],
    legality_desc: 'Diawasi Bappebti & OJK',
    legality_link: 'https://ojk.go.id'
  },
  { 
    id: 'A3', 
    name: 'Reksadana Pasar Uang', 
    tagline: 'Portofolio likuiditas tinggi',
    description: 'Investasi reksadana dengan risiko sangat rendah dan likuiditas harian. Modal awal sangat terjangkau.',
    scores: [1, 1, 1, 5],
    legality_desc: 'Diawasi OJK (UU No. 8 Tahun 1995)',
    legality_link: 'https://ojk.go.id'
  },
  { 
    id: 'A4', 
    name: 'Reksadana Saham', 
    tagline: 'Pertumbuhan agresif jangka panjang',
    description: 'Menginvestasikan mayoritas dana ke instrumen ekuitas/saham. Fluktuasi tinggi namun menawarkan potensi imbal hasil besar.',
    scores: [1, 5, 5, 4],
    legality_desc: 'Diawasi OJK (UU No. 8 Tahun 1995)',
    legality_link: 'https://ojk.go.id'
  },
  { 
    id: 'A5', 
    name: 'Saham Blue Chip', 
    tagline: 'Ekuitas perusahaan papan atas',
    description: 'Kepemilikan langsung pada perusahaan besar yang mapan dengan likuiditas saham harian sangat tinggi di Bursa Efek.',
    scores: [2, 5, 5, 5],
    legality_desc: 'Diawasi OJK & BEI',
    legality_link: 'https://www.idx.co.id'
  },
  { 
    id: 'A6', 
    name: 'Obligasi Negara (SBN)', 
    tagline: 'Surat berharga negara berkupon',
    description: 'Pemberian pinjaman dana ke pemerintah dengan imbalan kupon bunga tetap bulanan. Dijamin 100% aman oleh APBN negara.',
    scores: [3, 3, 1, 2],
    legality_desc: 'Dijamin Kementerian Keuangan RI',
    legality_link: 'https://www.djppr.kemenkeu.go.id'
  }
]

const useFallback = () => {
  alternatives.value = [...alternativesSeed]
  criterias.value = []
}

const loadData = async () => {
  if (!supabase) {
    useFallback()
    return
  }

  try {
    const { data: altData, error: altErr } = await supabase.from('alternatives').select('*')
    const { data: scoreData, error: scoreErr } = await supabase.from('alternative_scores').select('*')
    const { data: critData, error: critErr } = await supabase.from('criterias').select('*')

    if (altErr || scoreErr || critErr || !altData || !scoreData || !critData) {
      throw new Error('Gagal mengambil data dari Supabase')
    }

    const mappedAlternatives = altData.map(alt => {
      const scores = []
      const criteriaIds = ['C1', 'C2', 'C3', 'C4']
      criteriaIds.forEach(cId => {
        const matchingScore = scoreData.find(s => s.alternative_id === alt.id && s.criteria_id === cId)
        scores.push(matchingScore ? matchingScore.score : 3)
      })

      return {
        id: alt.id,
        name: alt.name,
        tagline: alt.tagline,
        description: alt.description,
        scores,
        legality_desc: alt.legality_desc,
        legality_link: alt.legality_link
      }
    })

    alternatives.value = mappedAlternatives
    criterias.value = critData
  } catch (err) {
    console.warn('Gagal memuat data dari Supabase, memuat seed lokal:', err)
    useFallback()
  }
}

onMounted(() => {
  loadData()
  loadHistoryFromStorage()
})

const selectedAlternatives = computed(() => {
  return results.value.filter(item => selectedCompareIds.value.includes(item.id))
})

const handleCalculate = (preferences) => {
  const calculated = calculateTOPSIS(preferences, alternatives.value, criterias.value)
  results.value = calculated
  hasCalculated.value = true
  selectedCompareIds.value = [] // Reset comparison checkmarks
  
  const newRecord = {
    ...preferences,
    topAlternative: calculated[0].name,
    timestamp: new Date().toISOString()
  }
  
  saveToHistory(newRecord)
}

const handleToggleCompare = (id) => {
  const idx = selectedCompareIds.value.indexOf(id)
  if (idx > -1) {
    selectedCompareIds.value.splice(idx, 1)
  } else {
    selectedCompareIds.value.push(id)
  }
}

const saveToHistory = (record) => {
  history.value.unshift(record)
  if (history.value.length > 15) {
    history.value.pop()
  }
  localStorage.setItem('smartinvest_history', JSON.stringify(history.value))
}

const loadHistoryFromStorage = () => {
  const saved = localStorage.getItem('smartinvest_history')
  if (saved) {
    history.value = JSON.parse(saved)
  }
}

const loadHistoryRecord = (record) => {
  handleCalculate({
    c1: record.c1,
    c2: record.c2,
    c3: record.c3,
    c4: record.c4,
    rawC1: record.rawC1
  })
}

const confirmResetHistory = () => {
  const confirmMessage = "Hapus Riwayat: Apakah Anda yakin ingin menghapus seluruh riwayat simulasi Anda? Tindakan ini tidak dapat dibatalkan."
  if (window.confirm(confirmMessage)) {
    localStorage.removeItem('smartinvest_history')
    history.value = []
    hasCalculated.value = false
    results.value = []
    selectedCompareIds.value = []
  }
}

const formatNumber = (val) => {
  if (!val) return '0'
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
</script>
