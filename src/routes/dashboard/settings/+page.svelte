<script lang="ts">
  import { systemConfig } from '$lib/socket';
  import { 
    Settings, Save, Power, Clock,
    Network, Database, Cpu, RefreshCcw 
  } from 'lucide-svelte';
  import { fade, slide } from 'svelte/transition';

  let isSaving = $state(false);
  let errors: Record<string, string> = $state({});

  let localConfig = $state({ ...($systemConfig || {}) });

  $effect(() => {
    if ($systemConfig && Object.keys($systemConfig).length > 0) {
      localConfig = { ...$systemConfig };
    }
  });

  function validate() {
    const newErrors: Record<string, string> = {};
    const cfg = localConfig;

    if (cfg.block_threshold <= 0) newErrors.block_threshold = "Threshold harus positif";
    // Validasi tambahan untuk durasi blokir
    if (cfg.block_duration_minutes < 1) newErrors.block_duration = "Minimal blokir 1 menit";
    
    const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    if (!cidrRegex.test(cfg.ip_filter || '')) {
      newErrors.ip_filter = "Format IP/CIDR tidak valid";
    }

    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate() || isSaving) return;    
    isSaving = true;
    
    try {
      const response = await fetch('http://localhost:5000/api/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localConfig)
      });

      const result = await response.json();
      if (result.status === 'success') {
        systemConfig.set(localConfig);
        alert("✅ SUCCESS: Konfigurasi Sistem Berhasil Diperbarui!");
      }
    } catch (err) {
      alert("❌ ERROR: Gagal menghubungi server.");
      console.error("Error updating config:", err);
    } finally {
      setTimeout(() => { isSaving = false; }, 1000);
    }
  }

  function toggleEngine() {
    localConfig.engine_status = localConfig.engine_status === 'on' ? 'off' : 'on';
    handleSave();
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
        disabled={isSaving}
        class="group relative flex items-center gap-4 px-8 py-4 rounded-3xl transition-all duration-300 font-black uppercase tracking-widest overflow-hidden shadow-lg 
        {localConfig.engine_status === 'on' 
            ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600' 
            : 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600'}"
        >
        <Power size={20} class={localConfig.engine_status === 'on' ? 'animate-pulse' : ''} />
        <span>{isSaving ? 'Processing...' : `Engine ${localConfig.engine_status}`}</span>
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
                    <span class="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Block Threshold</span>
                    <input type="number" step="0.1" bind:value={localConfig.block_threshold} 
                        class="input-field" />
                </label>

                <label class="space-y-2">
                    <div class="flex items-center gap-2 ml-2">
                        <Clock size={12} class="text-emerald-500" />
                        <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Auto Block Duration (Min)</span>
                    </div>
                    <input type="number" bind:value={localConfig.block_duration_minutes} 
                        class="input-field bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100" />
                    {#if errors.block_duration}<p class="text-red-500 text-[10px] ml-2 font-bold">{errors.block_duration}</p>{/if}
                </label>

                <label class="space-y-2">
                    <span class="text-[10px] font-black text-blue-400 uppercase ml-2 tracking-widest">Decay Rate</span>
                    <input type="number" step="0.1" bind:value={localConfig.penalty_decay_rate} 
                        class="input-field" />
                </label>

                <label class="space-y-2">
                    <span class="text-[10px] font-black text-red-500 uppercase ml-2 tracking-widest">Heavy Rate</span>
                    <input type="number" step="0.1" bind:value={localConfig.penalty_heavy_rate} 
                        class="input-field bg-blue-50/30 dark:bg-blue-900/10" />
                </label>

                <label class="space-y-2">
                    <span class="text-[10px] font-black text-amber-500 uppercase ml-2 tracking-widest">Suspect Rate</span>
                    <input type="number" step="0.1" bind:value={localConfig.penalty_suspect_rate} 
                        class="input-field bg-amber-50/30 dark:bg-amber-900/10" />
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
              <input type="text" bind:value={localConfig.interface_dst} class="input-field" />
            </label>
            <label class="space-y-2">
              <span class="text-[10px] font-black text-slate-400 uppercase ml-2">IP Filter (CIDR)</span>
              <input type="text" bind:value={localConfig.ip_filter} class="input-field font-mono" />
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
                <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-tighter">MikroTik API</h3>
            </div>
            
            <button 
                type="button"
                onclick={() => localConfig.mikrotik_block_enabled = !localConfig.mikrotik_block_enabled}
                aria-label="Toggle MikroTik block"
                title="Toggle MikroTik block"
                class="w-12 h-6 rounded-full transition-colors relative {localConfig.mikrotik_block_enabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}"
            >
                <div class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform {localConfig.mikrotik_block_enabled ? 'translate-x-6' : 'translate-x-0'}"></div>
            </button>
          </div>

          {#if localConfig.mikrotik_block_enabled}
            <div transition:slide class="space-y-4 pt-2">
                <input type="text" placeholder="Router Host" bind:value={localConfig.mikrotik_api_host} class="input-field text-sm" />
                <input type="text" placeholder="Username" bind:value={localConfig.mikrotik_api_username} class="input-field text-sm" />
                <input type="password" placeholder="Password" bind:value={localConfig.mikrotik_api_password} class="input-field text-sm" />
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
    <p class="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing System Context...</p>
  </div>
{/if}

<style lang="postcss">
  @reference "../../../app.css"; 

  .input-field {
    @apply w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 transition-all outline-none;
  }
</style>