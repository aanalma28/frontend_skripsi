<script lang="ts">
  import { ShieldCheck, ArrowRight } from 'lucide-svelte';
</script>

<div class="relative overflow-x-hidden">
  <nav class="flex items-center justify-between p-6 max-w-7xl mx-auto">
    <div class="flex items-center gap-2 font-black text-xl dark:text-white uppercase tracking-tighter">
      <ShieldCheck class="text-blue-600" /> AI-IPS
    </div>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href="/login" class="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition-all">
      Console
    </a>
  </nav>

  <section class="py-24 px-6 text-center max-w-4xl mx-auto">
    <h1 class="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight">
      Smart <span class="text-blue-600 italic">IPS</span> for Modern Threats.
    </h1>
    <p class="mt-8 text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
      Mendeteksi aktivitas judi online di balik VPN dan DoH menggunakan ekstraksi fitur cerdas 
      <span class="text-slate-900 dark:text-white font-bold">VAE</span>.
    </p>
    <div class="mt-12 flex flex-col md:flex-row justify-center gap-4">
      <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
      <a href="/login" class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
        Get Started <ArrowRight size={18} />
      </a>
    </div>
  </section>
</div>