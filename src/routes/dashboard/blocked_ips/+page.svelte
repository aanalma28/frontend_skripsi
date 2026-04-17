<script lang="ts">
  import { blockedStore } from '$lib/socket';
  import { ShieldCheck, Unlock, Search, Calendar, Info } from 'lucide-svelte';
  import { fade, slide } from 'svelte/transition';

  let searchTerm = $state('');
  let processingIps = $state(new Set());

  // =====================================================================
  // 🛡️ SAFE GUARD: Gunakan ?? [] agar .filter tidak error saat store kosong
  // =====================================================================
  let filteredBlocked = $derived(
    ($blockedStore ?? []).filter(b => 
      b.src_ip.includes(searchTerm) && b.curr_status === 'Active'
    )
  );

  // Fungsi Aksi: Membuka Blokir Manual
  async function releaseBlock(ip: string) {
    if (processingIps.has(ip)) return;    
    if (!confirm(`Buka blokir untuk IP ${ip}? Perubahan ini akan langsung diterapkan ke sistem.`)) return;

    processingIps.add(ip);
    try {
      const response = await fetch('http://localhost:5000/api/ip/release-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // PERBAIKAN: Gunakan key 'ip' agar sesuai dengan route api_release_ip di Flask
        body: JSON.stringify({ ip: ip }) 
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        // Optimistic UI: Hapus dari store lokal agar instan
        blockedStore.update(current => (current ?? []).filter(b => b.src_ip !== ip));
        alert(`✅ SUCCESS: Akses IP ${ip} telah dipulihkan.`);
      } else {
        alert("❌ ERROR: " + result.message);
      }
    } catch (error) {
      console.error("Error release block:", error);
      alert("❌ ERROR: Terjadi kesalahan koneksi ke backend.");
    } finally {
      processingIps.delete(ip); 
    }
  }
</script>

<div class="space-y-6" in:fade>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div class="flex items-center gap-3">
      <div class="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-500/20">
        <ShieldCheck size={24} />
      </div>
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Blocked Management</h1>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Active IPS Restrictors</p>
      </div>
    </div>

    <div class="relative w-full md:w-80">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input 
        bind:value={searchTerm}
        placeholder="Search Blocked IP..." 
        class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all dark:text-white font-bold text-sm"
      />
    </div>
  </div>

  <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-[2rem] flex items-start gap-4">
    <div class="p-2 bg-blue-500 rounded-lg text-white">
      <Info size={20} />
    </div>
    <div>
      <h4 class="text-sm font-black text-blue-800 dark:text-blue-300 uppercase tracking-tighter">Administrator Control</h4>
      <p class="text-xs text-blue-600/70 dark:text-blue-400/50 mt-1 leading-relaxed">
        IP yang terdaftar di bawah ini sedang dibatasi aksesnya oleh sistem. Administrator dapat memulihkan akses secara manual.
      </p>
    </div>
  </div>

  <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
          <tr>
            <th class="px-8 py-5">Source Address</th>
            <th class="px-8 py-5">Reason</th>
            <th class="px-8 py-5">Timestamp</th>
            <th class="px-8 py-5">Duration</th>
            <th class="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          {#each filteredBlocked as block (block.src_ip)}
            <tr transition:slide={{duration: 200}} class="hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span class="font-mono font-bold text-slate-700 dark:text-slate-200">{block.src_ip}</span>
                </div>
              </td>
              
              <td class="px-8 py-6">
                <span class="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-lg text-[10px] font-black uppercase border border-red-200 dark:border-red-800">
                  {block.reason || 'Anomalous Behavior'}
                </span>
              </td>

              <td class="px-8 py-6">
                <div class="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Calendar size={14} />
                  {block.blocked_at}
                </div>
              </td>

              <td class="px-8 py-6">
                <span class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                   {block.blocked_duration_minutes} Min
                </span>
              </td>

              <td class="px-8 py-6 text-right">
                <button 
                    onclick={() => releaseBlock(block.src_ip)}
                    disabled={processingIps.has(block.src_ip)}
                    class="relative inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-emerald-700 dark:text-emerald-400 rounded-xl font-black transition-all hover:scale-105 active:scale-95"
                >
                    {#if processingIps.has(block.src_ip)}
                        <span class="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                        <span class="text-[10px] uppercase">Processing</span>
                    {:else}
                        <Unlock size={14} />
                        <span class="text-[10px] uppercase">Release Block</span>
                    {/if}
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if filteredBlocked.length === 0}
        <div class="p-24 text-center">
          <div class="flex justify-center mb-4 text-slate-200 dark:text-slate-800">
            <ShieldCheck size={60} />
          </div>
          <p class="font-black uppercase text-xs tracking-[0.3em] text-slate-400">All Systems Clear. No Blocked IPs.</p>
        </div>
      {/if}
    </div>
  </div>
</div>