<script lang="ts">
  import { trafficLogs } from '$lib/socket';
  import { Activity, ShieldAlert, ShieldCheck, Search } from 'lucide-svelte';
  import { flip } from 'svelte/animate';

  let searchTerm = $state('');
  
  // Filter log berdasarkan pencarian IP atau Method
  let filteredLogs = $derived(
    $trafficLogs.filter(log => 
      log.ip.includes(searchTerm) || 
      log.method.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div class="flex items-center gap-3">
      <div class="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
        <Activity size={24} />
      </div>
      <h1 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Live Traffic Monitor</h1>
    </div>

    <div class="relative w-full md:w-96">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input 
        bind:value={searchTerm}
        placeholder="Cari IP atau Protokol..." 
        class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
      />
    </div>
  </div>

  <div class="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
    <div class="p-4 border-b border-slate-800 bg-slate-800/50 flex items-center gap-2">
      <div class="flex gap-1.5">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <span class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Console Output: Interface-Mirroring</span>
    </div>

    <div class="p-2 h-[600px] overflow-y-auto font-mono text-sm">
      <table class="w-full border-collapse">
        <thead class="text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-800/50">
          <tr>
            <th class="p-4 text-left">Timestamp</th>
            <th class="p-4 text-left">Source IP</th>
            <th class="p-4 text-left">Method</th>
            <th class="p-4 text-left">AI Score</th>
            <th class="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/30">
          {#each filteredLogs.slice(0, 30) as log (log.id)}
            <tr class="hover:bg-white/5 transition-colors">
              <td class="p-4 text-slate-500 text-xs">{new Date().toLocaleTimeString()}</td>
              <td class="p-4 text-blue-400 font-bold">{log.ip}</td>
              <td class="p-4">
                <span class="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] border border-slate-700">
                  {log.method}
                </span>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <div class="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full {log.status === 'Judol' ? 'bg-red-500' : 'bg-green-500'}" style="width: {log.confidence * 100}%"></div>
                  </div>
                  <span class="text-[10px] {log.status === 'Judol' ? 'text-red-400' : 'text-green-400'}">{(log.confidence * 100).toFixed(0)}%</span>
                </div>
              </td>
              <td class="p-4 text-right">
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest {log.status === 'Judol' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}">
                  {log.status === 'Judol' ? 'Blocked' : 'Passed'}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>