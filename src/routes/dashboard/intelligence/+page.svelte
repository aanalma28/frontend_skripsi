<script lang="ts">
  import { fade } from 'svelte/transition';
  import { LayerCake, Svg } from 'layercake';
  import { trafficLogs } from '$lib/socket';
  import { BrainCircuit, Target, Info, Crosshair, Zap } from 'lucide-svelte';
  
  import Scatter from '$lib/components/Scatter.svelte';
  import AxisX from '$lib/components/AxisX.svelte';
  import AxisY from '$lib/components/AxisY.svelte';

  // Reactive Data: Filter & Transform
  $: chartData = $trafficLogs.map(log => {
    const isFlow = log.type === 'FLOW';
    // Gunakan latent_coords untuk flow, centroid untuk voting
    const coords = isFlow ? log.latent_coords : log.centroid;
    
    // Proteksi jika data belum datang
    if (!coords) return null;

    return {
      x: coords[0],
      y: coords[1],
      // Gunakan status asli untuk FLOW, final_label untuk VOTING
      status: isFlow ? log.status : log.final_label,
      type: log.type,
      ip: log.ip
    };
  }).filter(d => d !== null);

  // Helper untuk koordinat real-time (hanya ambil dari FLOW terbaru)
  $: latestFlow = $trafficLogs.find(l => l.type === 'FLOW');
  $: latestCoords = latestFlow?.latent_coords ?? [0, 0];
</script>

<div class="p-8 space-y-8" in:fade>
  <div class="flex justify-between items-start">
    <div>
      <h1 class="text-3xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
        Neural Intelligence
      </h1>
      <p class="text-slate-500 font-medium">Visualisasi Sebaran Ruang Laten (Beta-VAE Latent Space)</p>
    </div>
    <div class="p-4 bg-purple-600 rounded-3xl text-white shadow-lg shadow-purple-500/30">
      <BrainCircuit size={24} />
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div class="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="absolute top-10 right-10 flex flex-col gap-2 z-10">
         <div class="flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-full border border-slate-200 dark:border-slate-700">
            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            <span class="text-[9px] font-bold text-slate-500 uppercase">Normal Flow</span>
         </div>
         <div class="flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-full border border-slate-200 dark:border-slate-700">
            <div class="w-2 h-2 rounded-full bg-red-500"></div>
            <span class="text-[9px] font-bold text-slate-500 uppercase">Judol Pattern</span>
         </div>
         <div class="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 backdrop-blur rounded-full border border-amber-200">
            <Zap size={10} class="text-amber-600" />
            <span class="text-[9px] font-bold text-amber-700 uppercase">Final Decision</span>
         </div>
      </div>

      <div class="h-[550px] w-full relative">
        {#if chartData.length > 0}
          <LayerCake
            data={chartData}
            x="x"
            y="y"
            xDomain={[-4, 4]} 
            yDomain={[-4, 4]}
            padding={{ top: 20, right: 20, bottom: 40, left: 40 }}
          >
            <Svg>
              <AxisX />
              <AxisY />
              <Scatter />
            </Svg>
          </LayerCake>
        {:else}
          <div class="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="font-black uppercase text-xs tracking-widest">Awaiting Neural Signal...</p>
          </div>
        {/if}
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative shadow-xl shadow-slate-200 dark:shadow-none">
        <h4 class="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <Info size={16} class="text-blue-400" /> Interpretation
        </h4>
        <p class="text-[11px] text-slate-400 leading-relaxed mb-6">
          Model **Beta-VAE** memetakan fitur trafik ke distribusi Gaussian. Titik yang berkumpul menunjukkan kesamaan pola perilaku jaringan.
        </p>
        
        <div class="space-y-4">
           <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full border-2 border-white/20 bg-blue-500"></div>
              <span class="text-[10px] font-bold uppercase tracking-tighter">Normal Packets</span>
           </div>
           <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full border-2 border-white/20 bg-red-500"></div>
              <span class="text-[10px] font-bold uppercase tracking-tighter">Judol Packets</span>
           </div>
           <div class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-full border-4 border-amber-500 animate-pulse bg-transparent flex items-center justify-center text-[10px] font-black">!</div>
              <span class="text-[10px] font-bold uppercase tracking-tighter text-amber-400">Voted/Blocked IP</span>
           </div>
        </div>
        <Crosshair class="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12 text-blue-500" />
      </div>

      <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Neural State</h4>
        <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <p class="text-[9px] font-black text-slate-400 uppercase mb-2">Latent Vector (Z1, Z2)</p>
          <code class="text-sm font-mono text-purple-600 dark:text-purple-400 font-bold">
            {latestCoords[0].toFixed(4)}, {latestCoords[1].toFixed(4)}
          </code>
        </div>
      </div>
    </div>
  </div>
</div>