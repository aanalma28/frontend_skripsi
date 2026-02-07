<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { trafficLogs } from '$lib/socket';
  import type { TrafficLog } from '$lib/types'
  import Chart from 'chart.js/auto';
  import { BrainCircuit, Target, Info, Crosshair } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  // Fungsi untuk memproses data dari store ke format Chart.js
  function getDataset(status: 'Normal' | 'Judol') {
    return $trafficLogs
      .filter((log: TrafficLog) => log.status === status)
      .map((log) => ({
        x: log.latent_coords[0],
        y: log.latent_coords[1],
        label: log.ip // Untuk muncul saat hover
      }));
  }

  // Reactive statement: Update grafik setiap ada data baru di store
  $: if (chart && $trafficLogs) {
    chart.data.datasets[0].data = getDataset('Normal');
    chart.data.datasets[1].data = getDataset('Judol');
    chart.update('none'); // Update tanpa animasi agar ringan
  }

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Normal Traffic',
            data: [],
            backgroundColor: '#10b981', // Emerald 500
            borderColor: '#059669',
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: 'Judol Detected',
            data: [],
            backgroundColor: '#ef4444', // Red 500
            borderColor: '#dc2626',
            pointRadius: 8,
            pointHoverRadius: 10,
            showLine: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { weight: 'bold', family: 'Inter' } }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => `IP: ${context.raw.label} [${context.raw.x.toFixed(2)}, ${context.raw.y.toFixed(2)}]`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Latent Dimension 1', color: '#64748b' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#64748b' }
          },
          y: {
            title: { display: true, text: 'Latent Dimension 2', color: '#64748b' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#64748b' }
          }
        }
      }
    });
  });

  onDestroy(() => {
    if (chart) chart.destroy();
  });
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
          DIMENSION: 2D LATENT
        </div>
      </div>
      
      <div class="h-[500px] w-full relative">
        <canvas bind:this={canvas}></canvas>
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
            <span class="mt-1">●</span> Cluster Hijau: Pola Trafik Normal/Umum.
          </li>
          <li class="flex items-start gap-2 text-[10px] font-bold text-red-400 uppercase">
            <span class="mt-1">●</span> Cluster Merah: Anomali (Terdeteksi Judi Online).
          </li>
        </ul>
        <Crosshair class="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
      </div>

      <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Live Distance</h4>
        {#if $trafficLogs.length > 0}
          <div class="space-y-4">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Latest Latent Z</p>
              <code class="text-xs font-mono text-blue-600 dark:text-blue-400">
                [{$trafficLogs[0].latent_coords[0].toFixed(4)}, {$trafficLogs[0].latent_coords[1].toFixed(4)}]
              </code>
            </div>
            <p class="text-[10px] text-slate-500 italic">
              *Koordinat ini dikirim langsung ke DNN Classifier untuk penentuan status.
            </p>
          </div>
        {:else}
          <p class="text-xs text-slate-400">Menunggu data trafik...</p>
        {/if}
      </div>
    </div>
  </div>
</div>