<script lang="ts">
  import { goto } from '$app/navigation';  
  let email = '';
  let password = '';
  
  const handleLogin = async (): Promise<void> => {
    // Implementasi auth sederhana
    if (email === "admin@local.com") {
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      await goto('/dashboard');
    }
  };
</script>

<div class="min-h-screen bg-slate-900 flex items-center justify-center p-6">
  <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-12">
    <div class="mb-10 text-center">
      <h2 class="text-4xl font-black text-slate-900 tracking-tighter uppercase">AI-IPS</h2>
      <p class="text-slate-400 mt-2 font-medium italic">Network Guard Intelligence</p>
    </div>
    
    <form class="space-y-6" on:submit|preventDefault={handleLogin}>
      <div>
        <label for="email" class="block text-xs font-black text-slate-400 uppercase tracking-widest">Admin Email</label>
        <input 
            type="email" 
            bind:value={email} 
            placeholder="admin@local.com"
            class="w-full mt-2 px-6 py-4 rounded-2xl border-2 border-transparent outline-none font-bold transition-all
                    bg-slate-100 text-slate-900 
                    placeholder:text-slate-400
                    focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" 
            required 
        />
      </div>
      
      <div>
        <label for="password" class="block text-xs font-black text-slate-400 uppercase tracking-widest">Security Key</label>
        <input 
            type="password" 
            bind:value={password} 
            placeholder="••••••••"
            class="w-full mt-2 px-6 py-4 rounded-2xl border-2 border-transparent outline-none font-bold transition-all
                    bg-slate-100 text-slate-900 
                    placeholder:text-slate-400
                    focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" 
            required 
        />
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]">
        Authorize Access
      </button>
    </form>
    
    <div class="mt-8 text-center">
      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Beta-VAE + DNN Classification System</p>
    </div>
  </div>
</div>