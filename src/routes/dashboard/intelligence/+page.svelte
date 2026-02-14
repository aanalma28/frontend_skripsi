<script lang="ts">
  import { fade } from 'svelte/transition';
  import { LayerCake, Svg } from 'layercake';
  import { trafficLogs } from '$lib/socket';
  import { BrainCircuit, Target, Info, Crosshair } from 'lucide-svelte';
  
  // Import komponen internal LayerCake (kita buat di bawah)
  import Scatter  from '$lib/components/Scatter.svelte';
  import AxisX from '$lib/components/AxisX.svelte';
  import AxisY from '$lib/components/AxisY.svelte';

  // Reactive data: Transformasi format store ke format yang dibaca LayerCake
  $: chartData = $trafficLogs.slice(0,50).map(log => ({
    x: log.latent_coords[0],
    y: log.latent_coords[1],
    status: log.status,
    ip: log.ip
  }));

  // Helper untuk mendapatkan koordinat terbaru
  $: latestCoords = $trafficLogs.length > 0 ? $trafficLogs[0].latent_coords : [0, 0];
</script>

<div class="p-8 space-y-8" in:fade>
  <div class="flex justify-between items-start">
    <div>
      <h1 class="text-3xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
        Neural Intelligence
      </h1>
      <p class="text-slate-500 font-medium">Visualisasi Sebaran Ruang Laten (Beta-VAE Latent Space)</p>
    </div>
    <div class="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-500/30">
      <BrainCircuit size={24} />
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div class="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <Target class="text-blue-500" size={18} />
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">Clustering Analysis</h3>
        </div>
        <div class="text-[10px] font-black px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
          ENGINE: LAYERCAKE (SVELTE NATIVE)
        </div>
      </div>
      
      <div class="h-[500px] w-full relative">
        {#if chartData.length > 0}
          <LayerCake
            data={chartData}
            x="x"
            y="y"
            padding={{ top: 20, right: 20, bottom: 40, left: 40 }}
          >
            <Svg>
              <AxisX />
              <AxisY />
              <Scatter />
            </Svg>
          </LayerCake>
        {:else}
          <div class="flex items-center justify-center h-full text-slate-400 animate-pulse">
            Menunggu aliran data trafik...
          </div>
        {/if}
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
        <h4 class="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <Info size={16} class="text-blue-400" /> Interpretation
        </h4>
        <p class="text-xs text-slate-400 leading-relaxed mb-4">
          Model **Beta-VAE** mereduksi 12 dimensi fitur trafik menjadi 2 dimensi koordinat laten. 
        </p>
        <ul class="space-y-3">
          <li class="flex items-start gap-2 text-[10px] font-bold text-emerald-400 uppercase">
            <span class="mt-1">●</span> Cluster Hijau: Pola Trafik Normal.
          </li>
          <li class="flex items-start gap-2 text-[10px] font-bold text-red-400 uppercase">
            <span class="mt-1">●</span> Cluster Merah: Anomali (Judi Online).
          </li>
        </ul>
        <Crosshair class="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
      </div>

      <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Live Coordinate</h4>
        <div class="space-y-4">
          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Latest Latent Z</p>
            <code class="text-xs font-mono text-blue-600 dark:text-blue-400">
              [{latestCoords[0].toFixed(4)}, {latestCoords[1].toFixed(4)}]
            </code>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>