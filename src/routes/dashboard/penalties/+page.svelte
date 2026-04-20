<script lang="ts">
  import { penaltyStore, isAiConnected } from '$lib/socket';
  import { ShieldAlert, History, Search, TrendingUp, Clock } from 'lucide-svelte';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  let searchTerm = $state('');

  // =====================================================================
  // 🛡️ SAFE GUARD: Gunakan ($penaltyStore ?? []) agar tidak undefined
  // =====================================================================
  let filteredPenalties = $derived(
    ($penaltyStore ?? [])
      .filter(p => p.src_ip.includes(searchTerm))
      .sort((a, b) => (b.current_penalty ?? 0) - (a.current_penalty ?? 0))
  );

  // Helper untuk menentukan warna berdasarkan tingkat bahaya
  const getSeverityColor = (points: number) => {
    if (points >= 8) return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (points > 5) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
  };
</script>

<div class="space-y-6" in:fade>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div class="flex items-center gap-3">
      <div class="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/20">
        <ShieldAlert size={24} />
      </div>
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Penalty Monitoring</h1>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time Accumulation Logs</p>
      </div>
    </div>

    <div class="relative w-full md:w-80">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input 
        bind:value={searchTerm}
        placeholder="Search IP Address..." 
        class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all dark:text-white font-bold text-sm"
      />
    </div>
  </div>

  {#if !$isAiConnected}
    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
      <Clock size={18} class="animate-pulse" />
      <span class="text-xs font-bold uppercase tracking-widest">AI Engine Offline - Monitoring Paused</span>
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex items-center gap-3 text-slate-400 mb-2">
        <TrendingUp size={16} />
        <span class="text-[10px] font-black uppercase tracking-widest">Total Active Penalties</span>
      </div>
      <h2 class="text-3xl font-black text-slate-800 dark:text-white">
        {($penaltyStore ?? []).length}
      </h2>
    </div>
  </div>

  <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
          <tr>
            <th class="px-8 py-5">Source IP Address</th>
            <th class="px-8 py-5">Accumulated Score</th>
            <th class="px-8 py-5">Last Update</th>
            <th class="px-8 py-5 text-right">Risk Level</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          {#each filteredPenalties as p (p.src_ip)}
            <tr animate:flip={{ duration: 400 }} class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <td class="px-8 py-6">
                <span class="font-mono font-bold text-slate-700 dark:text-slate-300">{p.src_ip}</span>
              </td>
              
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                   <div class="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-amber-500 transition-all duration-500" 
                      style="width: {Math.min(((p.current_penalty ?? 0) / 10) * 100, 100)}%">
                    </div>
                  </div>
                  <span class="text-lg font-black text-slate-800 dark:text-white italic">
                    {(p.current_penalty ?? 0).toFixed(2)}
                  </span>
                </div>
              </td>

              <td class="px-8 py-6">
                <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <History size={14} />
                  {p.last_updated ?? 'Just now'}
                </div>
              </td>

              <td class="px-8 py-6 text-right">
                <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border {getSeverityColor(p.current_penalty ?? 0)}">
                  {#if p.current_penalty >= 8} High Risk {:else if p.current_penalty > 5} Warning {:else} Monitoring {/if}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if filteredPenalties.length === 0}
        <div class="p-20 text-center text-slate-400">
          <p class="font-black uppercase text-xs tracking-[0.3em]">No active penalties under observation</p>
        </div>
      {/if}
    </div>
  </div>
</div>