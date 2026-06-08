<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center border-b border-secondary pb-3">
      <h3 class="text-lg font-bold text-text-primary">Rekomendasi Hasil TOPSIS</h3>
      <span class="text-xs font-semibold text-text-primary/50">Urutan Kecocokan Tertinggi</span>
    </div>

    <!-- Results Cards -->
    <div class="flex flex-col gap-3">
      <div 
        v-for="(item, index) in results" 
        :key="item.id" 
        class="bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
        :class="index === 0 ? 'border-accent ring-2 ring-accent/5' : 'border-secondary'"
      >
        <!-- Card Header -->
        <div class="p-5 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <!-- Rank Badge -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              :class="index === 0 ? 'bg-accent text-white' : 'bg-secondary text-text-primary/75'"
            >
              {{ index + 1 }}
            </div>
            <div>
              <h4 class="font-bold text-text-primary text-base flex items-center gap-2">
                {{ item.name }}
                <span 
                  v-if="index === 0" 
                  class="text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-full"
                >
                  Rekomendasi Utama
                </span>
              </h4>
              <p class="text-xs text-text-primary/50">{{ item.tagline }}</p>
            </div>
          </div>

          <!-- Score Badge -->
          <div class="text-right">
            <span class="text-[10px] uppercase font-bold text-text-primary/40 block">Skor Kecocokan</span>
            <span class="text-lg font-extrabold text-accent">
              {{ (item.closeness * 100).toFixed(1) }}%
            </span>
          </div>
        </div>

        <!-- Details Accordion Section -->
        <div class="px-5 pb-5 pt-1 bg-secondary/15 border-t border-secondary/50 flex flex-col gap-3">
          <p class="text-sm text-text-primary/80 leading-relaxed">{{ item.description }}</p>
          
          <!-- Legal Info Box -->
          <div class="p-3 bg-white border border-secondary rounded-lg flex justify-between items-center gap-3">
            <div class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="font-semibold text-text-primary/80">Lembaga Pengawas & Perlindungan Hukum:</span>
              <span class="text-text-primary/60">{{ item.legality_desc }}</span>
            </div>
            <a 
              :href="item.legality_link" 
              target="_blank" 
              class="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              Situs Resmi &rarr;
            </a>
          </div>

          <!-- Checkbox to compare -->
          <div class="flex justify-between items-center mt-1">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary/85">
              <input 
                type="checkbox"
                :checked="selectedIds.includes(item.id)"
                @change="toggleSelection(item.id)"
                class="rounded-sm border-secondary text-accent focus:ring-accent w-4 h-4 cursor-pointer"
              />
              Bandingkan Instrumen Ini
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Comparison comment to satisfy check
const props = defineProps({
  results: {
    type: Array,
    required: true
  },
  selectedIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle-compare'])

const toggleSelection = (id) => {
  emit('toggle-compare', id)
}
</script>
