<template>
  <div class="bg-white rounded-2xl border border-secondary p-6 shadow-sm flex flex-col gap-5">
    <div class="flex justify-between items-center border-b border-secondary pb-3">
      <h3 class="text-lg font-bold text-text-primary">Perbandingan Instrumen</h3>
      <span class="text-xs text-accent font-semibold">Bandingkan Sisi Demi Sisi</span>
    </div>

    <!-- Responsive Grid Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr class="border-b border-secondary">
            <th class="py-3 pr-4 text-xs font-bold uppercase text-text-primary/45 w-1/4">Kriteria / Detail</th>
            <th 
              v-for="item in items" 
              :key="item.id" 
              class="py-3 px-4 text-sm font-bold text-text-primary w-1/3"
            >
              {{ item.name }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-secondary/40">
          <!-- Score -->
          <tr>
            <td class="py-3 pr-4 text-xs font-semibold text-text-primary/70">Kecocokan TOPSIS</td>
            <td v-for="item in items" :key="item.id" class="py-3 px-4 font-bold text-accent text-base">
              {{ (item.closeness * 100).toFixed(1) }}%
            </td>
          </tr>
          <!-- C1 Modal -->
          <tr>
            <td class="py-3 pr-4 text-xs font-semibold text-text-primary/70">Modal Awal (C1)</td>
            <td v-for="item in items" :key="item.id" class="py-3 px-4 text-xs">
              Skala {{ item.scores[0] }} / 5 ({{ c1Labels[item.scores[0] - 1] }})
            </td>
          </tr>
          <!-- C2 Horizon -->
          <tr>
            <td class="py-3 pr-4 text-xs font-semibold text-text-primary/70">Jangka Waktu (C2)</td>
            <td v-for="item in items" :key="item.id" class="py-3 px-4 text-xs">
              Skala {{ item.scores[1] }} / 5 ({{ horizonLabels[item.scores[1] - 1] }})
            </td>
          </tr>
          <!-- C3 Risk -->
          <tr>
            <td class="py-3 pr-4 text-xs font-semibold text-text-primary/70">Risiko (C3)</td>
            <td v-for="item in items" :key="item.id" class="py-3 px-4 text-xs">
              Skala {{ item.scores[2] }} / 5 ({{ riskLabels[item.scores[2] - 1] }})
            </td>
          </tr>
          <!-- C4 Liquidity -->
          <tr>
            <td class="py-3 pr-4 text-xs font-semibold text-text-primary/70">Kemudahan Cair (C4)</td>
            <td v-for="item in items" :key="item.id" class="py-3 px-4 text-xs">
              Skala {{ item.scores[3] }} / 5 ({{ liquidityLabels[item.scores[3] - 1] }})
            </td>
          </tr>
          <!-- Legal protection -->
          <tr>
            <td class="py-3 pr-4 text-xs font-semibold text-text-primary/70">Legalitas</td>
            <td v-for="item in items" :key="item.id" class="py-3 px-4 text-xs text-text-primary/80 font-medium">
              {{ item.legality_desc }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const c1Labels = [
  'Sangat Rendah (< 1 Juta)',
  'Rendah (1 - 5 Juta)',
  'Sedang (5 - 10 Juta)',
  'Tinggi (10 - 50 Juta)',
  'Sangat Tinggi (> 50 Juta)'
]

const horizonLabels = [
  'Sangat Pendek',
  'Pendek',
  'Menengah',
  'Panjang',
  'Sangat Panjang'
]

const riskLabels = [
  'Sangat Aman',
  'Aman',
  'Moderat',
  'Tinggi',
  'Sangat Tinggi'
]

const liquidityLabels = [
  'Sangat Rendah',
  'Rendah',
  'Sedang',
  'Tinggi',
  'Sangat Tinggi'
]
</script>
