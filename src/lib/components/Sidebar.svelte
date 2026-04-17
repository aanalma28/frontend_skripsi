<script lang="ts">
  import { theme } from '$lib/theme';
  import { 
    Sun, Moon, LayoutDashboard, Activity, BrainCircuit, 
    LogOut, ShieldCheck, ShieldAlert, Lock, Settings 
  } from 'lucide-svelte';
  import { page } from '$app/stores';  

  // Menambahkan 3 menu baru sesuai request
  const menus = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Monitor', path: '/dashboard/monitor', icon: Activity },
    { name: 'Intelligence', path: '/dashboard/intelligence', icon: BrainCircuit },
    { name: 'Penalty History', path: '/dashboard/penalties', icon: ShieldAlert },
    { name: 'Blocked IPs', path: '/dashboard/blocked_ips', icon: Lock },
    { name: 'System Settings', path: '/dashboard/settings', icon: Settings },
  ];

  // Menggunakan $page.url.pathname secara reaktif (Svelte 4/5 logic)
  $: activePath = $page.url.pathname;

  function toggleTheme() {
    theme.update(t => t === 'light' ? 'dark' : 'light');
  }
</script>

<aside class="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-all duration-500">
  
  <div class="p-8 flex items-center gap-3">
    <div class="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
      <ShieldCheck class="text-white" size={24} />
    </div>
    <div class="flex flex-col">
      <span class="text-xl font-black tracking-tighter text-slate-800 dark:text-white uppercase leading-none">
        SENTINEL
      </span>
      <span class="text-[8px] font-bold text-blue-500 tracking-[0.3em] mt-1 uppercase">AI-IPS Engine</span>
    </div>
  </div>

  <nav class="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
    <p class="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2">Main Menu</p>
    
    {#each menus as menu (menu.path)}
      <a 
        href={menu.path}
        class="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group
        {activePath === menu.path 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'}"
      >
        <svelte:component 
          this={menu.icon} 
          size={18} 
          class="transition-transform group-hover:scale-110 {activePath === menu.path ? 'text-white' : ''}" 
        />
        <span class="text-sm tracking-wide">{menu.name}</span>
      </a>
    {/each}
  </nav>

  <div class="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
    
    <button 
      on:click={toggleTheme} 
      class="flex items-center justify-between w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-600 dark:text-slate-400 hover:ring-2 hover:ring-blue-500/20 transition-all active:scale-95 border border-slate-100 dark:border-slate-800"
    >
      <span class="text-[10px] font-black uppercase tracking-widest leading-none">
        {$theme === 'light' ? 'Light Mode' : 'Dark Mode'}
      </span>
      <div class="text-blue-600 dark:text-blue-400">
        {#if $theme === 'light'}<Sun size={18} />{:else}<Moon size={18} />{/if}
      </div>
    </button>

    <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-[1.5rem] p-4 flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-black">
        AD
      </div>
      <div class="overflow-hidden">
        <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Node Admin</p>
        <p class="text-xs font-black text-slate-700 dark:text-slate-200 truncate mt-1">Administrator</p>
      </div>
    </div>

    <a 
      href='/login'
      class="flex items-center gap-4 px-5 py-2 text-red-500/70 hover:text-red-500 font-bold transition-colors group"
    >
      <LogOut size={18} class="group-hover:-translate-x-1 transition-transform" />
      <span class="text-sm">Sign Out</span>
    </a>
  </div>
</aside>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: transparent;
  }
  .custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  :global(.dark) .custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background: #1e293b;
  }
</style>