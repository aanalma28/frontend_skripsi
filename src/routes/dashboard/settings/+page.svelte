<script lang="ts">
  import { systemConfig } from '$lib/socket';
  import { 
    Settings, Save, Power, 
    Network, Database, Cpu, RefreshCcw 
  } from 'lucide-svelte';
  import { fade, slide } from 'svelte/transition';

  let isSaving = $state(false);
  let errors: Record<string, string> = $state({});

  // Fungsi Validasi Lokal
  function validate() {
    const newErrors: Record<string, string> = {};
    const cfg = $systemConfig;

    if (!cfg) return false;

    // 1. Validasi Angka
    if (cfg.block_threshold <= 0) newErrors.block_threshold = "Threshold harus positif";
    if (cfg.penalty_heavy_rate <= 0) newErrors.heavy = "Heavy rate harus > 0";
    if (cfg.penalty_suspect_rate <= 0) newErrors.suspect = "Suspect rate harus > 0";
    
    // 2. Validasi Format IP (CIDR)
    const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    if (!cidrRegex.test(cfg.ip_filter || '')) {
      newErrors.ip_filter = "Format IP/CIDR tidak valid (Contoh: 192.168.1.0/24)";
    }

    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    
    isSaving = true;
    try {
      const response = await fetch('http://localhost:5000/api/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify($systemConfig)
      });

      const result = await response.json();
      if (result.status === 'success') {
        alert("✅ SUCCESS: Konfigurasi Sistem Berhasil Diperbarui!");
      }
    } catch (err) {
      alert("❌ ERROR: Gagal menghubungi server backend.");
      console.error("Error saving config:", err);
    } finally {
      isSaving = false;
    }
  }

  function toggleEngine() {
    if (!$systemConfig) return;
    systemConfig.update(c => ({
        ...c,
        engine_status: c.engine_status === 'on' ? 'off' : 'on'
    }));
  }
</script>

{#if $systemConfig && Object.keys($systemConfig).length > 0}
  <div class="max-w-5xl mx-auto space-y-8 p-8" in:fade>
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center gap-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-3xl text-blue-600">
          <Settings size={32} />
        </div>
        <div>
          <h1 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Settings</h1>
          <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Engine Control Center</p>
        </div>
      </div>

      <button 
        onclick={toggleEngine}
        class="group relative flex items-center gap-4 px-8 py-4 rounded-3xl transition-all duration-300 font-black uppercase tracking-widest overflow-hidden shadow-lg 
        {$systemConfig.engine_status === 'on' 
            ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600' 
            : 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600'}"
        >
        <Power size={20} class={$systemConfig.engine_status === 'on' ? 'animate-pulse' : ''} />
        <span>Engine {$systemConfig.engine_status.toUpperCase()}</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        
        <section class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div class="flex items-center gap-3 mb-2">
                <Cpu class="text-blue-500" size={20} />
                <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-tighter">AI Inference & Penalty Rates</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                <label class="space-y-2">
                    <span class="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Block Threshold (Max Points)</span>
                    <input type="number" step="0.1" bind:value={$systemConfig.block_threshold} 
                        class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200" />
                </label>

                <label class="space-y-2">
                    <span class="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Decay Rate (Recovery/Hour)</span>
                    <input type="number" step="0.1" bind:value={$systemConfig.penalty_decay_rate} 
                        class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200" />
                </label>

                <label class="space-y-2">
                <span class="text-[10px] font-black text-blue-500 uppercase ml-2 tracking-widest">Heavy Rate (Judol Confirmed)</span>
                <div class="relative">
                    <input type="number" step="0.1" bind:value={$systemConfig.penalty_heavy_rate} 
                        class="w-full bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400">PTS/HIT</span>
                </div>
                </label>

                <label class="space-y-2">
                <span class="text-[10px] font-black text-amber-500 uppercase ml-2 tracking-widest">Suspect Rate (Anomalous)</span>
                <div class="relative">
                    <input type="number" step="0.1" bind:value={$systemConfig.penalty_suspect_rate} 
                        class="w-full bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-2xl p-4 font-bold focus:ring-2 focus:ring-amber-500 text-slate-700 dark:text-slate-200" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-amber-400">PTS/HIT</span>
                </div>
                </label>

            </div>
            </section>

        <section class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex items-center gap-3">
            <Network class="text-purple-500" size={20} />
            <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Network Interface</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="space-y-2">
              <span class="text-[10px] font-black text-slate-400 uppercase ml-2">Sniffer Device</span>
              <input type="text" bind:value={$systemConfig.port_sniffer_device} 
                     class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-purple-500 text-slate-700 dark:text-slate-200" />
            </label>
            <label class="space-y-2">
              <span class="text-[10px] font-black text-slate-400 uppercase ml-2">IP Filter (CIDR)</span>
              <input type="text" bind:value={$systemConfig.ip_filter} 
                     class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-mono font-bold focus:ring-2 focus:ring-purple-500 text-slate-700 dark:text-slate-200" />
              {#if errors.ip_filter}<p class="text-red-500 text-[10px] ml-2 font-bold">{errors.ip_filter}</p>{/if}
            </label>
          </div>
        </section>
      </div>

      <div class="space-y-8">
        <section class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <Database class="text-orange-500" size={20} />
                <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-tighter">MikroTik Block API</h3>
            </div>
            
            <button 
                type="button"
                onclick={() => $systemConfig.mikrotik_block_enabled = !$systemConfig.mikrotik_block_enabled}
                aria-label="Toggle MikroTik API"
                class="w-12 h-6 rounded-full transition-colors duration-200 relative {$systemConfig.mikrotik_block_enabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}"
            >
                <div 
                class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 
                {$systemConfig.mikrotik_block_enabled ? 'translate-x-6' : 'translate-x-0'}"
                ></div>
            </button>
          </div>

          {#if $systemConfig.mikrotik_block_enabled}
            <div transition:slide={{ duration: 300 }} class="space-y-4 pt-2">
                <label class="space-y-1">
                <span class="text-[9px] font-black text-slate-400 uppercase ml-1">Router Host / IP</span>
                <input type="text" placeholder="192.168.88.1" bind:value={$systemConfig.mikrotik_api_host} 
                        class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-orange-500" />
                </label>
                
                <div class="grid grid-cols-2 gap-3">
                <label class="space-y-1">
                    <span class="text-[9px] font-black text-slate-400 uppercase ml-1">Username</span>
                    <input type="text" placeholder="admin" bind:value={$systemConfig.mikrotik_api_username} 
                        class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-orange-500" />
                </label>
                <label class="space-y-1">
                    <span class="text-[9px] font-black text-slate-400 uppercase ml-1">Password</span>
                    <input type="password" placeholder="****" bind:value={$systemConfig.mikrotik_api_password} 
                        class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-orange-500" />
                </label>
                </div>
            </div>
           {/if}
        </section>

        <button 
          onclick={handleSave}
          disabled={isSaving}
          class="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {#if isSaving}
            <RefreshCcw size={20} class="animate-spin" />
          {:else}
            <Save size={20} />
            Apply Settings
          {/if}
        </button>
      </div>
    </div>
  </div>
{:else}
  <div class="flex flex-col items-center justify-center h-[80vh] gap-4" in:fade>
    <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p class="font-black text-slate-400 uppercase tracking-widest text-xs">Awaiting System Context...</p>
  </div>
{/if}