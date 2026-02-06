<script lang="ts">
  import { theme } from '$lib/theme';
  import { Sun, Moon, LayoutDashboard, Activity, BrainCircuit, LogOut, ShieldCheck } from 'lucide-svelte';
  import { page } from '$app/stores';

  // Svelte 5 merekomendasikan deklarasi menu tetap konstan
  const menus = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Monitor', path: '/dashboard/monitor', icon: Activity },
    { name: 'Intelligence', path: '/dashboard/intelligence', icon: BrainCircuit },
  ];

  // Reaktivitas untuk mendeteksi halaman aktif
  $: activePath = $page.url.pathname;

  function toggleTheme() {
    // Memastikan update store memicu logic di theme.ts
    theme.update(t => t === 'light' ? 'dark' : 'light');
  }
</script>

<aside class="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-all duration-500">
  
  <div class="p-8 flex items-center gap-3">
    <div class="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
      <ShieldCheck class="text-white" size={24} />
    </div>
    <span class="text-xl font-black tracking-tighter text-slate-800 dark:text-white uppercase">
      AI-IPS
    </span>
  </div>

  <nav class="flex-1 px-4 space-y-2">
    {#each menus as menu}
      <a 
        href={menu.path}
        class="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group
        {activePath === menu.path 
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' 
          : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-200'}"
      >
        <svelte:component this={menu.icon} size={20} class="transition-transform group-hover:scale-110" />
        <span class="text-sm tracking-wide">{menu.name}</span>
      </a>
    {/each}
  </nav>

  <div class="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
    
    <button 
      on:click={toggleTheme} 
      class="flex items-center justify-between w-full px-5 py-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400 hover:ring-2 hover:ring-blue-500/20 transition-all active:scale-95"
    >
      <span class="text-[10px] font-black uppercase tracking-widest leading-none">
        {$theme === 'light' ? 'Light Mode' : 'Dark Mode'}
      </span>
      <div class="text-blue-600 dark:text-blue-400">
        {#if $theme === 'light'}<Sun size={18} />{:else}<Moon size={18} />{/if}
      </div>
    </button>

    <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-[1.5rem] p-4">
      <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Admin Node</p>
      <p class="text-sm font-black text-slate-700 dark:text-slate-200 truncate mt-0.5">Administrator</p>
    </div>
    
    <a 
      href="/login" 
      class="flex items-center gap-4 px-5 py-3 text-red-500/70 hover:text-red-500 font-bold transition-colors group"
    >
      <LogOut size={20} class="group-hover:-translate-x-1 transition-transform" />
      <span class="text-sm">Sign Out</span>
    </a>
  </div>
</aside>