<script lang="ts">
  import { onMount } from 'svelte';
  import { ShieldAlert, Globe, Lock, Activity, ArrowLeft } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';

  let userIp = $state('Detecting...');
  let timestamp = new Date().toLocaleString();

  onMount(() => {
    // Ambil IP dari URL params jika kamu mengirimkannya lewat redirect MikroTik
    const params = new URLSearchParams(window.location.search);
    userIp = params.get('ip') || '192.168.50.x'; 
  });
</script>

<svelte:head>
  <title>SENTINEL | ACCESS RESTRICTED</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans text-slate-200 overflow-hidden relative">
  <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

  <div class="max-w-2xl w-full relative z-10" in:scale={{duration: 400, start: 0.95}}>
    <div class="flex justify-center mb-8">
      <div class="relative">
        <div class="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse"></div>
        <div class="bg-slate-900 border-2 border-red-500/50 p-6 rounded-[2.5rem] shadow-2xl relative">
          <ShieldAlert size={64} class="text-red-500" />
        </div>
      </div>
    </div>

    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 shadow-3xl text-center">
      <h1 class="text-4xl font-black uppercase tracking-tighter text-white mb-2">
        Akses Dibatasi
      </h1>
      <p class="text-red-400 font-bold uppercase tracking-[0.2em] text-xs mb-8">
        Sentinel AI-IPS Enforcement
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 text-left">
          <div class="p-3 bg-slate-800 rounded-xl text-blue-400">
            <Globe size={20} />
          </div>
          <div>
            <p class="text-[10px] uppercase font-black text-slate-500">Target IP</p>
            <p class="font-mono font-bold text-white">{userIp}</p>
          </div>
        </div>
        <div class="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 text-left">
          <div class="p-3 bg-slate-800 rounded-xl text-red-400">
            <Lock size={20} />
          </div>
          <div>
            <p class="text-[10px] uppercase font-black text-slate-500">Violation</p>
            <p class="font-mono font-bold text-white">Online Gambling</p>
          </div>
        </div>
      </div>

      <div class="space-y-4 text-sm text-slate-400 leading-relaxed mb-10">
        <p>
          Sistem <span class="text-white font-bold">SENTINEL</span> mendeteksi aktivitas trafik yang mengarah pada pola konten terlarang melalui enkripsi <span class="text-blue-400 font-mono italic">DoH/VPN Tunnel</span>.
        </p>
        <p class="text-xs italic bg-red-500/5 border border-red-500/10 py-3 rounded-lg px-4">
          Berdasarkan analisis Beta-VAE Latent Space, koneksi Anda memiliki tingkat anomali yang melebihi ambang batas keamanan (Threshold Exceeded).
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <button 
          onclick={() => window.location.reload()}
          class="w-full py-4 bg-white text-slate-950 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <Activity size={18} /> Re-Scan Connection
        </button>
        <p class="text-[10px] text-slate-600 uppercase font-bold mt-4 tracking-widest">
          Timestamp: {timestamp} • Enforcement ID: SN-{(Math.random()*1000).toFixed(0)}
        </p>
      </div>
    </div>

    <div class="mt-8 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        Protected by Sentinel IPS Engine
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    background-color: #020617;
  }
</style>