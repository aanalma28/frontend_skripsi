<script lang="ts">
  import { fade } from 'svelte/transition';
  import { LayerCake, Svg } from 'layercake';
  import { trafficLogs } from '$lib/socket';
  import { BrainCircuit, Info, Crosshair, Activity } from 'lucide-svelte';
  
  import Scatter from '$lib/components/Scatter.svelte';
  import AxisX from '$lib/components/AxisX.svelte';
  import AxisY from '$lib/components/AxisY.svelte';

  // Reactive Data
  $: chartData = $trafficLogs.map((log, index) => {
    const isFlow = log.type === 'FLOW';
    const coords = isFlow ? log.latent_coords : null;
    
    if (!coords || !Array.isArray(coords) || coords.length < 2) return null;

    let pointColor = '#3b82f6'; 
    if (isFlow) {
      if (log.status === 'Suspected' || log.status === 'Judol') {
        pointColor = '#ef4444'; 
      }
    } else {
      pointColor = '#f59e0b';
    }

    return {
      x: Number(coords[0]) || 0,
      y: Number(coords[1]) || 0,
      id: `${log.type}-${log.id || index}`,
      type: log.type,
      color: pointColor
    };
  }).filter(d => d !== null).slice(0, 50); // Batasi untuk performa

  $: latestFlow = [...$trafficLogs].reverse().find(l => l.type === 'FLOW');
  $: latestCoords = latestFlow?.latent_coords ?? [0, 0];
</script>

<div class="p-8 space-y-6" in:fade>
  <div class="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
    <div class="flex items-center gap-4">
      <div class="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/30">
        <BrainCircuit size={28} />
      </div>
      <div>
        <h1 class="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white leading-none">
          Neural Intelligence
        </h1>
        <p class="text-slate-500 font-medium text-xs mt-1 uppercase tracking-wider">Latent Space Visualization</p>
      </div>
    </div>

    <div class="flex items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
        <span class="text-[10px] font-black text-slate-500 uppercase">Normal</span>
      </div>
      <div class="flex items-center gap-2 border-l border-slate-300 dark:border-slate-600 pl-4">
        <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
        <span class="text-[10px] font-black text-slate-500 uppercase">Judol Pattern</span>
      </div>      
    </div>
  </div>

  <div class="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
    <div class="h-[600px] w-full relative">
      {#if chartData && chartData.length > 0}
        <LayerCake
          data={chartData}
          x="x"
          y="y"
          xDomain={[-2, 2]}
          yDomain={[-2, 2]}
          padding={{ top: 20, right: 20, bottom: 50, left: 60 }}
        >
          <Svg>
            <AxisX ticks={11} />
            <AxisY ticks={11} />
            <Scatter />
          </Svg>
        </LayerCake>
      {:else}
        <div class="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
          <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="font-black uppercase text-xs tracking-widest">Scanning Neural Signal...</p>
        </div>
      {/if}
    </div>
    <Crosshair class="absolute -left-10 -bottom-10 w-48 h-48 opacity-[0.03] text-blue-500" />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="md:col-span-2 bg-slate-900 p-6 rounded-[2rem] text-white flex items-center gap-6 shadow-xl relative overflow-hidden">
      <div class="bg-blue-500/20 p-4 rounded-2xl text-blue-400">
        <Info size={24} />
      </div>
      <div>
        <h4 class="text-xs font-black uppercase tracking-[0.2em] mb-1">Interpretation Guide</h4>
        <p class="text-[11px] text-slate-400 leading-relaxed max-w-2xl">
          Sumbu X dan Y merepresentasikan dimensi laten dari trafik terenkripsi. Titik yang menjauhi pusat koordinat <b>[0,0]</b> mengindikasikan deviasi perilaku trafik (Anomali) yang diklasifikasikan sebagai pola akses perjudian online melalui terowongan VPN/DoH.
        </p>
      </div>
      <div class="absolute -right-4 -bottom-4 opacity-10">
        <BrainCircuit size={100} />
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
      <div class="flex items-center gap-2 mb-3">
        <Activity size={14} class="text-purple-500" />
        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Real-time State</h4>
      </div>
      <div class="flex flex-col">
        <span class="text-[9px] font-bold text-slate-500 uppercase mb-1">Vector Z-Coords</span>
        <code class="text-lg font-mono text-purple-600 dark:text-purple-400 font-black tracking-tighter">
          {latestCoords[0].toFixed(4)} , {latestCoords[1].toFixed(4)}
        </code>
      </div>
    </div>
  </div>
</div>