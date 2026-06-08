<template>
  <div class="min-h-screen bg-dominant text-text-primary flex flex-col font-sans transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white border-b border-secondary py-4 px-6 md:px-12 flex justify-between items-center shadow-xs">
      <router-link to="/" class="flex items-center gap-3 hover:opacity-90 transition">
        <div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-xl shadow-md shadow-accent/20">
          S
        </div>
        <h1 class="text-xl font-bold tracking-tight text-text-primary">SmartInvest</h1>
      </router-link>
      <div class="flex items-center gap-4">
        <div class="text-sm font-medium px-3 py-1.5 rounded-lg bg-secondary/50 text-accent">
          Algoritma TOPSIS
        </div>
      </div>
    </header>

    <!-- Main Viewport -->
    <main class="flex-1 flex flex-col">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center text-xs text-text-primary/50 border-t border-secondary mt-12">
      &copy; 2026 SmartInvest. Bebas Biaya & Serverless.
    </footer>
  </div>
</template>

<script setup>
// Layout shell does not need state management; routes are managed via vue-router.
</script>
