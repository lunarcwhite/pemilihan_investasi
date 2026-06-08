<template>
  <div class="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6 relative">
    
    <!-- Toast Notification -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="toast.show" 
        class="fixed top-6 right-6 z-50 p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-3 max-w-sm"
        :class="toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'"
      >
        <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Dashboard Header -->
    <div class="bg-white rounded-2xl border border-secondary p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex flex-col gap-1 text-left">
        <h2 class="text-2xl font-bold tracking-tight text-text-primary">Dashboard Admin</h2>
        <p class="text-sm text-text-primary/60">Kelola kriteria pendukung keputusan & alternatif instrumen investasi</p>
      </div>
      <div class="flex items-center gap-3">
        <router-link 
          to="/" 
          class="px-4 py-2.5 bg-dominant hover:bg-secondary/50 text-text-primary border border-secondary rounded-xl text-sm font-bold transition flex items-center gap-2"
        >
          Lihat Kalkulator
        </router-link>
        <button 
          @click="handleLogout"
          class="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm font-bold transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Keluar Sesi</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-secondary">
      <button 
        @click="activeTab = 'alternatives'"
        class="px-6 py-3 font-bold text-sm border-b-2 transition-all duration-200"
        :class="activeTab === 'alternatives' ? 'border-accent text-accent' : 'border-transparent text-text-primary/65 hover:text-text-primary'"
      >
        Kelola Alternatif
      </button>
      <button 
        @click="activeTab = 'criteria'"
        class="px-6 py-3 font-bold text-sm border-b-2 transition-all duration-200"
        :class="activeTab === 'criteria' ? 'border-accent text-accent' : 'border-transparent text-text-primary/65 hover:text-text-primary'"
      >
        Pengaturan Kriteria
      </button>
    </div>

    <!-- TAB 1: ALTERNATIVES CRUD -->
    <div v-if="activeTab === 'alternatives'" class="flex flex-col gap-6">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold text-text-primary text-left">Daftar Alternatif Investasi</h3>
        <button 
          @click="openAddModal"
          class="px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-bold shadow-md shadow-accent/10 transition flex items-center gap-2"
        >
          + Tambah Alternatif
        </button>
      </div>

      <!-- Alternatives Table -->
      <div class="bg-white rounded-2xl border border-secondary shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-dominant border-b border-secondary">
                <th class="p-4 text-xs font-bold uppercase tracking-wider text-text-primary/60">ID</th>
                <th class="p-4 text-xs font-bold uppercase tracking-wider text-text-primary/60">Nama</th>
                <th class="p-4 text-xs font-bold uppercase tracking-wider text-text-primary/60">Tagline</th>
                <th class="p-4 text-xs font-bold uppercase tracking-wider text-text-primary/60">Skor (C1-C4)</th>
                <th class="p-4 text-xs font-bold uppercase tracking-wider text-text-primary/60">Legalitas</th>
                <th class="p-4 text-xs font-bold uppercase tracking-wider text-text-primary/60 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-secondary">
              <tr v-if="alternatives.length === 0">
                <td colspan="6" class="p-8 text-center text-sm text-text-primary/50">Memuat data instrumen...</td>
              </tr>
              <tr 
                v-for="alt in alternatives" 
                :key="alt.id"
                class="hover:bg-dominant/30 transition duration-150"
              >
                <td class="p-4 text-sm font-extrabold text-text-primary/80">{{ alt.id }}</td>
                <td class="p-4 text-sm font-bold text-text-primary">{{ alt.name }}</td>
                <td class="p-4 text-xs text-text-primary/70 max-w-[180px] truncate">{{ alt.tagline }}</td>
                <td class="p-4 text-xs font-bold text-accent">
                  C1: {{ alt.scores[0] }} | C2: {{ alt.scores[1] }} | C3: {{ alt.scores[2] }} | C4: {{ alt.scores[3] }}
                </td>
                <td class="p-4 text-xs">
                  <a :href="alt.legality_link" target="_blank" class="text-accent hover:underline font-medium">
                    {{ alt.legality_desc }}
                  </a>
                </td>
                <td class="p-4 text-right flex justify-end gap-2">
                  <button 
                    @click="openEditModal(alt)"
                    class="p-2 text-accent bg-accent/5 hover:bg-accent/10 rounded-lg transition"
                  >
                    Ubah
                  </button>
                  <button 
                    @click="triggerDelete(alt)"
                    class="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: CRITERIA CONFIG -->
    <div v-if="activeTab === 'criteria'" class="bg-white rounded-2xl border border-secondary p-6 shadow-sm flex flex-col gap-6">
      <div class="text-left border-b border-secondary pb-4">
        <h3 class="text-lg font-bold text-text-primary">Pengaturan Kriteria TOPSIS</h3>
        <p class="text-xs text-text-primary/50 mt-1">Ubah bobot default (skala 1-10) serta optimasi kriteria.</p>
      </div>

      <div class="flex flex-col gap-4">
        <div 
          v-for="crit in criterias" 
          :key="crit.id"
          class="flex flex-col md:grid md:grid-cols-12 gap-4 items-center p-4 bg-dominant/40 border border-secondary/80 rounded-xl"
        >
          <div class="md:col-span-3 text-left w-full">
            <span class="text-xs font-extrabold text-accent bg-accent/5 px-2 py-0.5 rounded mr-2">{{ crit.id }}</span>
            <span class="text-sm font-bold text-text-primary">{{ crit.name }}</span>
          </div>
          
          <div class="md:col-span-4 flex items-center gap-3 w-full">
            <label class="text-xs font-semibold text-text-primary/60 shrink-0">Bobot Default:</label>
            <input 
              type="number" 
              v-model.number="crit.weight"
              min="1"
              max="10"
              class="w-20 px-3 py-2 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
            />
            <span class="text-xs text-text-primary/40">(1 - 10)</span>
          </div>

          <div class="md:col-span-3 flex items-center gap-3 w-full">
            <label class="text-xs font-semibold text-text-primary/60 shrink-0">Optimasi:</label>
            <select 
              v-model="crit.type"
              class="flex-1 px-3 py-2 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
            >
              <option value="cost">Cost (Minimalisasikan)</option>
              <option value="benefit">Benefit (Maksimalisasikan)</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button 
            @click="saveCriterias"
            :disabled="isSavingCriteria"
            class="px-6 py-3 bg-accent text-white rounded-xl text-sm font-bold shadow-md shadow-accent/15 hover:bg-accent/90 disabled:opacity-50 transition"
          >
            {{ isSavingCriteria ? 'Menyimpan...' : 'Simpan Kriteria' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ADD/EDIT ALTERNATIVE MODAL -->
    <div 
      v-if="modal.show" 
      class="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-6 backdrop-blur-xs"
    >
      <div class="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-secondary p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-secondary pb-4">
          <h3 class="text-lg font-bold text-text-primary">
            {{ modal.mode === 'add' ? 'Tambah Alternatif Baru' : 'Ubah Detail Alternatif' }}
          </h3>
          <button @click="closeModal" class="text-text-primary/50 hover:text-text-primary font-bold">×</button>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col gap-4 text-left">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-text-primary/70">ID Alternatif</label>
            <input 
              type="text" 
              v-model="form.id" 
              disabled
              class="px-4 py-2.5 bg-dominant/50 border border-secondary rounded-xl text-sm text-text-primary/60 cursor-not-allowed"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-text-primary/70">Nama Alternatif</label>
            <input 
              type="text" 
              v-model="form.name" 
              required
              placeholder="e.g., Surat Berharga Negara"
              class="px-4 py-2.5 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-text-primary/70">Tagline Ringkas</label>
            <input 
              type="text" 
              v-model="form.tagline" 
              required
              placeholder="e.g., Kupon tetap jaminan APBN"
              class="px-4 py-2.5 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-text-primary/70">Deskripsi Lengkap</label>
            <textarea 
              v-model="form.description" 
              required
              rows="3"
              placeholder="Jelaskan karakteristik alternatif investasi..."
              class="px-4 py-2.5 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-text-primary/70">Deskripsi Legalitas</label>
              <input 
                type="text" 
                v-model="form.legality_desc" 
                required
                placeholder="e.g., Dijamin LPS"
                class="px-4 py-2.5 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-text-primary/70">Tautan Legalitas</label>
              <input 
                type="url" 
                v-model="form.legality_link" 
                required
                placeholder="https://..."
                class="px-4 py-2.5 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <!-- TOPSIS Criteria Ratings (1-5) -->
          <div class="border-t border-secondary pt-4 mt-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-text-primary/50 mb-3">Nilai Skor Kriteria (Skala 1 - 5)</h4>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-text-primary/70">C1: Kapital Minimum</label>
                <input 
                  type="number" 
                  v-model.number="form.c1" 
                  min="1" 
                  max="5" 
                  required
                  class="px-4 py-2 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-text-primary/70">C2: Horizon Waktu</label>
                <input 
                  type="number" 
                  v-model.number="form.c2" 
                  min="1" 
                  max="5" 
                  required
                  class="px-4 py-2 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-text-primary/70">C3: Toleransi Risiko</label>
                <input 
                  type="number" 
                  v-model.number="form.c3" 
                  min="1" 
                  max="5" 
                  required
                  class="px-4 py-2 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-text-primary/70">C4: Likuiditas</label>
                <input 
                  type="number" 
                  v-model.number="form.c4" 
                  min="1" 
                  max="5" 
                  required
                  class="px-4 py-2 bg-white border border-secondary rounded-xl text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-4 border-t border-secondary pt-4">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-5 py-2.5 border border-secondary text-text-primary/80 rounded-xl text-sm font-bold hover:bg-dominant transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-bold shadow-md shadow-accent/15 hover:bg-accent/90 disabled:opacity-50 transition"
            >
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Alternatif' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- DOUBLE-CONFIRMATION DELETE MODAL -->
    <div 
      v-if="deleteModal.show" 
      class="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-6 backdrop-blur-xs"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary p-8 flex flex-col gap-6 text-left">
        <div class="flex items-center gap-3 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="text-lg font-bold">Hapus Alternatif</h3>
        </div>

        <p class="text-sm text-text-primary/70">
          Apakah Anda yakin ingin menghapus alternatif <strong class="text-text-primary">{{ deleteModal.targetName }}</strong>? Tindakan ini akan menghapus semua skor kriteria terkait secara permanen.
        </p>

        <!-- Safety Verification Checkbox -->
        <label class="flex items-start gap-3 p-3 bg-red-50/50 border border-red-100 rounded-xl cursor-pointer">
          <input 
            type="checkbox" 
            v-model="deleteModal.verified" 
            class="mt-1 accent-red-600 rounded"
          />
          <span class="text-xs font-semibold text-red-800">
            Saya mengerti tindakan ini tidak dapat dibatalkan dan akan langsung memotong data di database.
          </span>
        </label>

        <div class="flex justify-end gap-3 border-t border-secondary pt-4">
          <button 
            @click="cancelDelete" 
            class="px-4 py-2 border border-secondary text-text-primary/80 rounded-xl text-sm font-bold hover:bg-dominant transition"
          >
            Batal
          </button>
          <button 
            @click="executeDelete" 
            :disabled="!deleteModal.verified || isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-md shadow-red-200 disabled:opacity-50 hover:bg-red-700 transition"
          >
            {{ isDeleting ? 'Menghapus...' : 'Hapus Selamanya' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'

const router = useRouter()
const activeTab = ref('alternatives')
const alternatives = ref([])
const criterias = ref([])

// Toast System
const toast = ref({ show: false, message: '', type: 'success' })
const triggerToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Modal Form states
const modal = ref({ show: false, mode: 'add' })
const form = ref({
  id: '',
  name: '',
  tagline: '',
  description: '',
  legality_desc: '',
  legality_link: '',
  c1: 3,
  c2: 3,
  c3: 3,
  c4: 3
})
const isSubmitting = ref(false)

// Delete Dialog states
const deleteModal = ref({ show: false, targetId: '', targetName: '', verified: false })
const isDeleting = ref(false)
const isSavingCriteria = ref(false)

// Load Data
const loadData = async () => {
  if (!supabase) return
  try {
    const { data: altData, error: altErr } = await supabase.from('alternatives').select('*').order('id')
    const { data: scoreData, error: scoreErr } = await supabase.from('alternative_scores').select('*')
    const { data: critData, error: critErr } = await supabase.from('criterias').select('*').order('id')

    if (altErr || scoreErr || critErr) {
      throw new Error(altErr?.message || scoreErr?.message || critErr?.message || 'Gagal mengambil data dari database')
    }

    if (altData && scoreData) {
      alternatives.value = altData.map(alt => {
        const scores = []
        const criteriaIds = ['C1', 'C2', 'C3', 'C4']
        criteriaIds.forEach(cId => {
          const match = scoreData.find(s => s.alternative_id === alt.id && s.criteria_id === cId)
          scores.push(match ? match.score : 3)
        })
        return { ...alt, scores }
      })
    }

    if (critData) {
      criterias.value = critData
    }
  } catch (err) {
    console.error('Gagal mengambil data:', err)
    triggerToast(`Gagal memuat data: ${err.message || err}`, 'error')
  }
}

onMounted(() => {
  loadData()
})

// Add/Edit Modals handlers
const openAddModal = () => {
  // Generate next A index
  const ids = alternatives.value.map(a => parseInt(a.id.replace('A', ''), 10)).filter(Number)
  const nextNum = ids.length > 0 ? Math.max(...ids) + 1 : 1
  
  form.value = {
    id: `A${nextNum}`,
    name: '',
    tagline: '',
    description: '',
    legality_desc: '',
    legality_link: '',
    c1: 3,
    c2: 3,
    c3: 3,
    c4: 3
  }
  modal.value = { show: true, mode: 'add' }
}

const openEditModal = (alt) => {
  form.value = {
    id: alt.id,
    name: alt.name,
    tagline: alt.tagline,
    description: alt.description,
    legality_desc: alt.legality_desc,
    legality_link: alt.legality_link,
    c1: alt.scores[0],
    c2: alt.scores[1],
    c3: alt.scores[2],
    c4: alt.scores[3]
  }
  modal.value = { show: true, mode: 'edit' }
}

const closeModal = () => {
  modal.value.show = false
}

// Submit forms to database
const submitForm = async () => {
  if (!supabase) return
  isSubmitting.value = true

  try {
    const altRow = {
      name: form.value.name,
      tagline: form.value.tagline,
      description: form.value.description,
      legality_desc: form.value.legality_desc,
      legality_link: form.value.legality_link
    }

    if (modal.value.mode === 'add') {
      // 1. Insert Alternative
      const { error: altErr } = await supabase
        .from('alternatives')
        .insert({ id: form.value.id, ...altRow })

      if (altErr) throw altErr

      // 2. Insert Scores
      const scoreRows = [
        { alternative_id: form.value.id, criteria_id: 'C1', score: form.value.c1 },
        { alternative_id: form.value.id, criteria_id: 'C2', score: form.value.c2 },
        { alternative_id: form.value.id, criteria_id: 'C3', score: form.value.c3 },
        { alternative_id: form.value.id, criteria_id: 'C4', score: form.value.c4 }
      ]
      const { error: scoreErr } = await supabase.from('alternative_scores').insert(scoreRows)
      if (scoreErr) throw scoreErr

      triggerToast('Alternatif investasi berhasil ditambahkan.', 'success')
    } else {
      // Update details
      const { error: altErr } = await supabase
        .from('alternatives')
        .update(altRow)
        .eq('id', form.value.id)

      if (altErr) throw altErr

      // Upsert scores
      const criteriaIds = ['C1', 'C2', 'C3', 'C4']
      const scores = [form.value.c1, form.value.c2, form.value.c3, form.value.c4]

      for (let i = 0; i < criteriaIds.length; i++) {
        const { error: scoreErr } = await supabase
          .from('alternative_scores')
          .upsert({ 
            alternative_id: form.value.id, 
            criteria_id: criteriaIds[i], 
            score: scores[i] 
          }, { onConflict: 'alternative_id,criteria_id' })
        if (scoreErr) throw scoreErr
      }

      triggerToast('Perubahan berhasil disimpan.', 'success')
    }

    closeModal()
    loadData()
  } catch (err) {
    triggerToast(`Gagal menyimpan data: ${err.message || err}`, 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Delete Handlers
const triggerDelete = (alt) => {
  deleteModal.value = {
    show: true,
    targetId: alt.id,
    targetName: alt.name,
    verified: false
  }
}

const cancelDelete = () => {
  deleteModal.value.show = false
}

const executeDelete = async () => {
  if (!supabase || !deleteModal.value.verified) return
  isDeleting.value = true

  try {
    const { error } = await supabase
      .from('alternatives')
      .delete()
      .eq('id', deleteModal.value.targetId)

    if (error) throw error

    triggerToast('Alternatif investasi telah dihapus.', 'success')
    deleteModal.value.show = false
    loadData()
  } catch (err) {
    triggerToast(`Gagal menghapus data: ${err.message || err}`, 'error')
  } finally {
    isDeleting.value = false
  }
}

// Save Criteria
const saveCriterias = async () => {
  if (!supabase) return
  isSavingCriteria.value = true

  try {
    for (const crit of criterias.value) {
      const { error } = await supabase
        .from('criterias')
        .update({ 
          weight: crit.weight, 
          type: crit.type 
        })
        .eq('id', crit.id)
      
      if (error) throw error
    }

    triggerToast('Perubahan parameter kriteria berhasil disimpan.', 'success')
    loadData()
  } catch (err) {
    triggerToast(`Gagal menyimpan kriteria: ${err.message || err}`, 'error')
  } finally {
    isSavingCriteria.value = false
  }
}

// Logout
const handleLogout = async () => {
  if (!supabase) {
    router.push('/admin-login')
    return
  }

  try {
    await supabase.auth.signOut()
    router.push('/admin-login')
  } catch (err) {
    console.error('Error saat keluar sesi:', err)
  }
}
</script>
