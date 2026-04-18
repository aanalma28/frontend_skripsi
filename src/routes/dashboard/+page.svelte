<script lang="ts">  
  import { trafficLogs, trafficStats, isAiConnected, systemConfig } from '$lib/socket';
  import { ShieldAlert, Activity, ShieldCheck, BrainCircuit, Zap, Lock } from 'lucide-svelte';
  import Monitoring from '$lib/components/Monitoring.svelte'  
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
      
      <div class="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="w-3 h-3 rounded-full {$isAiConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}"></div>
        
        <div class="flex flex-col">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            System Node: {$isAiConnected ? 'Online' : 'Offline'}
          </span>
          <span class="text-sm font-bold mt-1 uppercase tracking-wider
            {$systemConfig?.engine_status === 'on' ? 'text-emerald-600' : 'text-red-600'}">
            AI Engine: {$systemConfig?.engine_status === 'on' ? 'Running' : 'Paused'}
          </span>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  
      <div class="lg:col-span-2">
        <Monitoring />
      </div>

      <div class="bg-white dark:bg-slate-900 p-7 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
        <div class="flex justify-between items-start">
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
            <Activity size={24} />
          </div>
          <span class="text-[10px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md uppercase tracking-tighter">Throughput</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-bold mt-6 uppercase tracking-widest">Total Analyzed</p>
        <h3 class="text-4xl font-black mt-1 text-slate-800 dark:text-white">{$trafficStats.total_analyzed.toLocaleString()}</h3>
      </div>

      <div class="relative overflow-hidden bg-white dark:bg-slate-900 p-7 rounded-[2rem] shadow-sm border border-red-100 dark:border-red-900/20 transition-all hover:shadow-md">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 blur-3xl"></div>
        <div class="flex justify-between items-start">
          <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400">
            <ShieldAlert size={24} />
          </div>
          <span class="text-[10px] font-black bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-1 rounded-md uppercase tracking-tighter">IPS Active</span>
        </div>
        <p class="text-red-600/70 dark:text-red-400/70 text-sm font-bold mt-6 uppercase tracking-widest">Voted as Judol</p>
        <h3 class="text-4xl font-black mt-1 text-red-600 dark:text-red-500">{$trafficStats.judol_detected.toLocaleString()}</h3>
      </div>

      <div class="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between px-10">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 dark:text-purple-400">
            <BrainCircuit size={24} />
          </div>
          <div>
            <p class="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Inference Engine Status</p>
            <h3 class="text-xl font-black text-slate-800 dark:text-white uppercase italic">Variational Autoencoder + Deep Neural Network</h3>
          </div>
        </div>
        <div class="hidden md:block">
            <span class="text-[10px] font-black border border-purple-200 dark:border-purple-800 text-purple-500 px-3 py-1 rounded-full uppercase">Combined Model</span>
        </div>
      </div>

    </div>

    <section class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <h3 class="font-black text-xl text-slate-800 dark:text-white italic">Recent Traffic Flow</h3>
          <p class="text-xs text-slate-400 font-bold uppercase tracking-tighter">Real-time Classification</p>
        </div>
        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
        <a href='/dashboard/monitor' class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-full transition-transform active:scale-95 uppercase tracking-widest">
          Full Monitor
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th class="px-8 py-5">Source Address</th>
              <th class="px-8 py-5">Detection Type</th>
              <th class="px-8 py-5">Bypass Method</th>
              <th class="px-8 py-5 text-right">IPS Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          {#each $trafficLogs.slice(0, 8) as log (`${log.type}-${log.id}`)}
            {@const isFlow = log.type === 'FLOW'}
            {@const isVoting = log.type === 'PENALTY'}
            
            {@const displayMethod = log.method ?? 'None'}
            {@const displayStatus = isFlow ? (log.status ?? 'Normal') : 'Normal'}
            {@const confidence = log.confidence ?? 0}
            {@const isJudol = displayStatus === 'Judol' || displayStatus === 'Suspected'}

            <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{log.src_ip}</span>
                  <span class="text-[10px] text-slate-400 font-medium">Last Activity: {new Date().toLocaleTimeString()}</span>
                </div>
              </td>
              
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  {#if isVoting}
                    <div class="flex items-center gap-1.5 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800">
                      <Zap size={12} />
                      <span class="text-[10px] font-black uppercase tracking-tighter">Final Vote</span>
                    </div>
                  {:else}
                    <div class="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md border border-slate-200 dark:border-slate-700">
                      <Activity size={12} />
                      <span class="text-[10px] font-black uppercase tracking-tighter">Flow Log</span>
                    </div>
                  {/if}
                </div>
              </td>

              <td class="px-8 py-6">
                <span class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase border border-slate-200 dark:border-slate-700">
                  {displayMethod}
                </span>
              </td>

              <td class="px-8 py-6 text-right">
                <div class="flex flex-col items-end gap-1">
                  {#if isVoting}
                    <span class="inline-flex items-center gap-1.5 font-black text-xs uppercase tracking-widest {log.is_blocked ? 'text-red-600' : 'text-green-600'}">
                      {log.action ?? (log.is_blocked ? 'BLOCKED' : 'PASSED')}
                      {#if log.is_blocked} <Lock size={14} /> {:else} <ShieldCheck size={14} /> {/if}
                    </span>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      Score: {log.penalty_score.toFixed(2)}
                    </span>
                  {:else}
                    <span class="inline-flex items-center gap-1.5 font-black text-xs uppercase tracking-widest {isJudol ? 'text-amber-500' : 'text-emerald-500'}">
                      {displayStatus.toUpperCase()}
                      {#if isJudol}
                        <ShieldAlert size={14} class="animate-pulse" />
                      {:else}
                        <ShieldCheck size={14} />
                      {/if}
                    </span>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      AI Confidence: {(confidence * 100).toFixed(0)}%
                    </span>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      Score: {log.penalty_score.toFixed(2)}
                    </span>
                  {/if}                  
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
        </table>
      </div>
    </section>
  </div>
</div>