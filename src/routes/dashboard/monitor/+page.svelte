<script lang="ts">
  import { trafficLogs } from '$lib/socket';
  import { Activity, ShieldAlert, ShieldCheck, Search, Zap, Lock, Info } from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  let searchTerm = $state('');
  
  // Filter log: Pastikan handle null/undefined pada method
  let filteredLogs = $derived(
    $trafficLogs.filter(log => {
      const s = searchTerm.toLowerCase();
      const ipMatch = log.ip?.includes(s) ?? false;
      const method = (log.type === 'FLOW' ? log.method : log.final_method) || '';
      const methodMatch = method.toLowerCase().includes(s);
      return ipMatch || methodMatch;
    })
  );
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div class="flex items-center gap-3">
      <div class="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
        <Activity size={24} />
      </div>
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">System Monitor</h1>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Deep Packet Inspection Logs</p>
      </div>
    </div>

    <div class="relative w-full md:w-96">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input 
        bind:value={searchTerm}
        placeholder="Filter IP or Protocol..." 
        class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white font-bold text-sm"
      />
    </div>
  </div>

  <div class="bg-slate-950 rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
    <div class="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
        </div>
        <span class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 font-mono">NFStream-Capture-Output</span>
      </div>
      <div class="flex gap-4">
        <span class="text-[10px] font-bold text-blue-500 uppercase">Buffer: {filteredLogs.length} Entries</span>
      </div>
    </div>

    <div class="overflow-x-auto h-[650px] overflow-y-auto custom-scrollbar">
      <table class="w-full border-collapse font-mono text-xs">
        <thead class="sticky top-0 bg-slate-950 text-slate-500 uppercase tracking-widest text-[10px] z-10">
          <tr>
            <th class="p-4 text-left border-b border-slate-800">Event Time</th>
            <th class="p-4 text-left border-b border-slate-800">Type</th>
            <th class="p-4 text-left border-b border-slate-800">Src Address</th>
            <th class="p-4 text-left border-b border-slate-800">Method</th>
            <th class="p-4 text-left border-b border-slate-800">Confidence</th>
            <th class="p-4 text-right border-b border-slate-800">IPS Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-900">
          {#each filteredLogs as log (`${log.type}-${log.id}`)}
            {@const isFlow = log.type === 'FLOW'}
            {@const isVoting = log.type === 'VOTING'}
            
            {@const conf = isFlow ? (log.confidence ?? 0) : (log.avg_confidence ?? 0)}
            
            {@const isDanger = isFlow 
              ? (log.status === 'Suspected' || log.status === 'Judol') 
              : (log.final_label === 'Judol')}

            <tr transition:slide={{duration: 150}} class="hover:bg-white/[0.03] transition-colors group">
              <td class="p-4 text-slate-600 whitespace-nowrap font-mono">
                {new Date(log.timestamp).toLocaleTimeString('en-GB')}
              </td>
              
              <td class="p-4">
                {#if isVoting}
                  <span class="text-amber-500 font-black px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20 text-[9px]">VOTE</span>
                {:else}
                  <span class="text-blue-500/60 font-bold text-[9px]">FLOW</span>
                {/if}
              </td>

              <td class="p-4 font-bold {isDanger ? (isFlow ? 'text-amber-400' : 'text-red-400') : 'text-slate-300'}">
                {log.ip}
              </td>

              <td class="p-4">
                <span class="text-slate-500">
                  {isFlow ? (log.method ?? 'HTTPS') : (log.final_method ?? 'DoH')}
                </span>
              </td>

              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full {isDanger ? (isFlow ? 'bg-amber-500' : 'bg-red-500') : 'bg-green-500'}" 
                        style="width: {conf * 100}%"></div>
                  </div>
                  <span class="{isDanger ? (isFlow ? 'text-amber-400' : 'text-red-400') : 'text-slate-500'}">
                    {(conf * 100).toFixed(0)}%
                  </span>
                </div>
              </td>

              <td class="p-4 text-right">
                {#if isVoting}
                  <div class="inline-flex items-center gap-2 {log.final_label === 'Judol' ? 'text-red-500' : 'text-green-500'} font-black text-[10px]">
                    {log.final_label === 'Judol' ? 'BLOCKED' : 'PASSED'}
                    {#if log.final_label === 'Judol'}<Lock size={12}/>{:else}<ShieldCheck size={12}/>{/if}
                  </div>
                {:else}
                  <div class="inline-flex items-center gap-2 {isDanger ? 'text-amber-500 font-black' : 'text-slate-600'} text-[10px]">
                    {isDanger ? 'SUSPECTED' : 'CLEAN'}
                    {#if isDanger}<Zap size={12} class="animate-pulse"/>{/if}
                  </div>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      
      {#if filteredLogs.length === 0}
        <div class="flex flex-col items-center justify-center p-20 text-slate-600">
          <Info size={40} class="mb-4 opacity-20" />
          <p class="uppercase tracking-[0.2em] text-[10px] font-black">No matching logs in current buffer</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #020617;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 10px;
  }
</style>