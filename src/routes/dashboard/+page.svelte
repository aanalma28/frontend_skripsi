<script lang="ts">
  import { onMount } from 'svelte'
  import { trafficLogs, trafficStats, isAiConnected, socket } from '$lib/socket';
  import { ShieldAlert, Activity, ShieldCheck, BrainCircuit, Cpu, Info } from 'lucide-svelte';
  import { fly, fade } from 'svelte/transition'
  import type { TrafficLog, TrafficStats } from '$lib/types';
  
  // sinkronisasi saat refresh menggunakan API di backend
  onMount(async () => {
    try{
        const response = await fetch("http://localhost:5000/api/initial-data")
        const payload = await response.json()

        // mengisi variable svelte store dengan data dari database
        trafficLogs.set(payload.logs)
        trafficStats.set(payload.stats)

    }catch(err){
        console.error("Gagal Sinkronisasi awal: ", err)
    }
  })

  // kode realtime dari websocket
  socket.on('new_traffic', (payload: {data: TrafficLog, stats: TrafficStats}) => {
    // update untuk menambahkan log jaringan
    trafficLogs.update(logs => [payload.data, ...logs].slice(0,50))
    // set untuk mengubah angka stats jumlah log dan deteksi judol yang terbaru
    trafficStats.set(payload.stats)
  })  
</script>

<div class="min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
  
  <div class="p-8 space-y-8 max-w-7xl mx-auto">
    
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
          Network Intelligence
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-medium">
          Monitoring Smart User & AI Classification
        </p>
      </div>
      
      <div class="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div class="w-3 h-3 rounded-full {$isAiConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}"></div>
        <span class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          AI Engine: {$isAiConnected ? 'Active' : 'Offline'}
        </span>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="bg-white dark:bg-slate-900 p-7 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
        <div class="flex justify-between items-start">
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
            <Activity size={24} />
          </div>
          <span class="text-[10px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md uppercase">Live</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-bold mt-6 uppercase tracking-widest">Total Analyzed</p>
        <h3 class="text-4xl font-black mt-1 text-slate-800 dark:text-white">{$trafficStats.total_analyzed}</h3>
      </div>

      <div class="relative overflow-hidden bg-white dark:bg-slate-900 p-7 rounded-[2rem] shadow-sm border border-red-100 dark:border-red-900/20 transition-all hover:shadow-md">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 blur-3xl"></div>
        
        <div class="flex justify-between items-start">
          <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400">
            <ShieldAlert size={24} />
          </div>
        </div>
        <p class="text-red-600/70 dark:text-red-400/70 text-sm font-bold mt-6 uppercase tracking-widest text-red-600">Judol Detected</p>
        <h3 class="text-4xl font-black mt-1 text-red-600 dark:text-red-500">{$trafficStats.judol_detected}</h3>
      </div>

      <div class="bg-white dark:bg-slate-900 p-7 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
        <div class="flex justify-between items-start">
          <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 dark:text-purple-400">
            <BrainCircuit size={24} />
          </div>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-bold mt-6 uppercase tracking-widest">Algorithm</p>
        <h3 class="text-xl font-black mt-2 text-slate-800 dark:text-white uppercase italic">Beta-VAE + DNN</h3>
      </div>

    </div>

    <section class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <h3 class="font-black text-xl text-slate-800 dark:text-white italic">Recent Traffic Flow</h3>
          <p class="text-xs text-slate-400 font-bold uppercase tracking-tighter">AI-Generated Logs</p>
        </div>
        <a href="/dashboard/monitor" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-full transition-transform active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none uppercase tracking-widest">
          Full Monitor
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th class="px-8 py-5">Source Address</th>
              <th class="px-8 py-5">Bypass Method</th>
              <th class="px-8 py-5">AI Confidence</th>
              <th class="px-8 py-5 text-right">Result</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            {#each $trafficLogs.slice(0, 5) as log}
              <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                <td class="px-8 py-6 font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
                  {log.ip}
                </td>
                <td class="px-8 py-6">
                  <span class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase border border-slate-200 dark:border-slate-700">
                    {log.method}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <div class="flex items-center gap-3">
                    <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full max-w-[80px]">
                      <div class="h-full rounded-full transition-all duration-1000 {log.status === 'Judol' ? 'bg-red-500' : 'bg-blue-500'}" style="width: {log.confidence * 100}%"></div>
                    </div>
                    <span class="text-xs font-black text-slate-400 italic">{(log.confidence * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td class="px-8 py-6 text-right">
                  <span class="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest {log.status === 'Judol' ? 'text-red-600 animate-pulse' : 'text-green-600'}">
                    {#if log.status === 'Judol'}
                      <ShieldAlert size={14} /> DETECTED
                    {:else}
                      <ShieldCheck size={14} /> SECURE
                    {/if}
                  </span>
                </td>
              </tr>
            {/each}
            {#if $trafficLogs.length === 0}
               <tr>
                 <td colspan="4" class="px-8 py-10 text-center text-slate-400 italic font-medium">
                   No active traffic detected. Waiting for AI Engine...
                 </td>
               </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </section>

  </div>
</div>