<script lang="ts">
  import { blockedStore } from '$lib/socket';
  import { Calendar, Clock, History, CheckCircle2 } from 'lucide-svelte';
  import { fade, slide } from 'svelte/transition';

  let searchTerm = $state('');
  let processingIps = $state(new Set<string>());

  // Tampilkan semua data, urutkan Active di atas
  let filteredBlocked = $derived(
      // Gunakan nama variabel yang deskriptif daripada 'b' agar lebih mudah dibaca
      ($blockedStore ?? [])
        .filter((item) => item.src_ip.includes(searchTerm))
        .sort((a, b) => {
            // Logika urutan: Active (paling atas), Released (bawah)
            if (a.curr_status === b.curr_status) return 0;
            return a.curr_status === 'Active' ? -1 : 1;
        })
  );

  async function releaseBlock(id: string, ip: string) { // Tambahkan parameter ID
    if (processingIps.has(id)) return;
    if (!confirm(`Buka akses untuk IP ${ip}?`)) return;

    processingIps.add(id); // Track berdasarkan ID
    try {
      const response = await fetch('http://localhost:5000/api/ip/release-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // KIRIM ID, BUKAN IP
        body: JSON.stringify({ id: id, ip: ip }) 
      });

      const result = await response.json();
      if (result.status !== 'success') alert(result.message);
    } catch {
      alert("❌ ERROR: Gagal menghubungi server.");
    } finally {
      processingIps.delete(id); 
    }
  }
</script>

<div class="p-6 space-y-6" in:fade>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
          <tr>
            <th class="px-8 py-5">Source Address</th>
            <th class="px-8 py-5">Status & Reason</th>
            <th class="px-8 py-5">Timeline</th>
            <th class="px-8 py-5 text-right">Administrative</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          {#each filteredBlocked as block (block.id || block.src_ip)}
            <tr transition:slide class="transition-all {block.curr_status === 'Released' ? 'bg-slate-50/50 opacity-60' : 'hover:bg-red-50/20'}">
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="font-mono font-black text-slate-700 dark:text-slate-200 text-base">{block.src_ip}</span>
                  <div class="flex items-center gap-1.5 mt-1">
                    <div class="w-2 h-2 rounded-full {block.curr_status === 'Active' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}"></div>
                    <span class="text-[9px] font-black uppercase tracking-tighter {block.curr_status === 'Active' ? 'text-red-500' : 'text-emerald-600'}">
                        {block.curr_status}
                    </span>
                  </div>
                </div>
              </td>
              
              <td class="px-8 py-6">
                <div class="flex flex-col gap-0.5">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{block.reason}</span>
                    <span class="text-[10px] font-medium text-slate-400 italic">
                        {block.curr_status === 'Released' ? (block.message || 'Time expired') : 'Blocking in progress...'}
                    </span>
                </div>
              </td>

              <td class="px-8 py-6">
                <div class="space-y-1 text-[10px] font-bold">
                    <div class="flex items-center gap-2 text-slate-500">
                        <Calendar size={12}/> {block.blocked_at}
                    </div>
                    {#if block.released_at}
                    <div class="flex items-center gap-2 text-emerald-600">
                        <History size={12}/> {block.released_at}
                    </div>
                    {:else}
                    <div class="flex items-center gap-2 text-slate-400">
                        <Clock size={12}/> Duration: {block.blocked_duration_minutes}m
                    </div>
                    {/if}
                </div>
              </td>

              <td class="px-8 py-6 text-right">
                {#if block.curr_status === 'Active'}
                    <button 
                        onclick={() => releaseBlock(block.id, block.src_ip)}
                        disabled={processingIps.has(block.src_ip)}
                        class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                    >
                        {processingIps.has(block.src_ip) ? 'Processing' : 'Restore Access'}
                    </button>
                {:else}
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg">
                        <CheckCircle2 size={14} />
                        <span class="text-[9px] font-black uppercase">Resolved</span>
                    </div>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>