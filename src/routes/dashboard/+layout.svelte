<script lang="ts">
import Sidebar from '$lib/components/Sidebar.svelte';
import { onMount } from 'svelte'
import type { TrafficLog, TrafficStats, LogType, PenaltyData, BlockedIP, SystemConfig } from '$lib/types';
import { trafficLogs, trafficStats, isAiConnected, socket, penaltyStore, blockedStore, systemConfig } from '$lib/socket';
	import { fade, fly } from 'svelte/transition';
	import { ShieldAlert, Unlock, X } from 'lucide-svelte';

let { children } = $props();

let toast = $state<{show: boolean, msg: string, type: 'danger' | 'success'} | null>(null);

function showToast(msg: string, type: 'danger' | 'success') {
    toast = { show: true, msg, type };
    setTimeout(() => { toast = null; }, 6000);
}

onMount(() => {
    async function initializeSystem() {
        try {
            const response = await fetch("http://localhost:5000/api/initial-data");
            if (!response.ok) throw new Error("Backend Busy");
            
            const payload = await response.json();
            
            // SINKRONISASI DATA (Pastikan key sesuai dengan Backend)
            trafficLogs.set(payload.logs || []);
            trafficStats.set(payload.stats || { total_analyzed: 0, judol_detected: 0 });
            
            const configs = payload.configs as SystemConfig;
            systemConfig.set(configs);

            // Perbaikan: Pastikan fallback array kosong [] jika data null/undefined
            blockedStore.set(payload.blocked_ips || []);
            
            // PERBAIKAN KEY: Backend kirim 'recent_penalties', jangan panggil 'penalties'
            penaltyStore.set(payload.recent_penalties || []);
            
            console.log("✅ Initial Data Synced. Starting WebSocket...");
            
            // 2. SETELAH initial data beres, baru aktifkan Socket
            if (!socket.connected) {
                socket.connect();
            }
            
            // 3. Pasang listener            
            socket.on("connect", () => isAiConnected.set(true));
            socket.on("disconnect", () => isAiConnected.set(false));
            socket.on('new_traffic', handleTraffic);
            
            // Listener Real-time untuk Angka Penalty
            socket.on('penalty_update', (payload: PenaltyData) => {
                penaltyStore.update(current => {
                    const index = current.findIndex(p => p.src_ip === payload.src_ip);
                    if (index !== -1) {
                        current[index] = payload;
                        return [...current];
                    }
                    return [payload, ...current].slice(0, 100);
                });
            });

            // Listener Real-time untuk Blokir Baru
            socket.on('new_blocked', (data: BlockedIP) => {
                blockedStore.update(list => {
                    const currentList = list ?? [];
                    // Cari apakah IP ini sudah ada di list (berdasarkan ID atau IP)
                    const index = currentList.findIndex(item => item.src_ip === data.src_ip);
                    
                    if (index !== -1) {
                        const newList = [...currentList];
                        newList[index] = data; // Update status (misal dari Active -> Released)
                        return newList;
                    } else {
                        return [data, ...currentList]; // Tambah entri baru di atas
                    }
                });

                // Logika Toast Notifikasi
                if (data.curr_status === 'Active') {
                    showToast(`ALARM: ${data.src_ip} blocked for ${data.reason}`, 'danger');
                } else if (data.curr_status === 'Released') {
                    // Gunakan key 'message' dari backend jika ada
                    const msg = data.message || `IP ${data.src_ip} has been released.`;
                    showToast(msg, 'success');
                }
            });

        } catch (err) {
            console.error("❌ Sync failed, retrying in 3s...", err);
            setTimeout(initializeSystem, 3000); // Retry terus
        }
    }
                
    const handleTraffic = (payload: {type: LogType, data: TrafficLog, stats: TrafficStats}) => {
        // Gabungkan type kedalam object data agar store konsisten
        const newLogEntry: TrafficLog = {
            ...payload.data,
            type: payload.type,
            timestamp: payload.data.timestamp || new Date().toISOString()
        }

        trafficLogs.update(currentLogs => {
            const updated = [newLogEntry, ...currentLogs]
            return updated.slice(0,1000)
        })

        if(payload.stats){
            trafficStats.set({
                total_analyzed: payload.stats.total_analyzed,
                judol_detected: payload.stats.judol_detected,
                current_queue: payload.stats.current_queue
            });
        }

        // // Console log untuk debugging pas demo (opsional)
        // if (payload.type === 'VOTING') {
        //     console.warn(`⚠️ [VOTING] IP ${payload.data.ip} virdict: ${payload.data.final_label}`);
        // }
    };

    initializeSystem();

    return () => {
        console.log("Cleaning up WebSocket...");
        socket.off('new_traffic', handleTraffic);                
        socket.off('penalty_update');
        socket.off('new_block');        
        socket.off('connect')
        socket.off('disconnect')
        socket.disconnect();
    };
});

</script>

{#if toast}
  <div 
    in:fly={{ y: 50, duration: 400 }} 
    out:fade 
    class="fixed bottom-8 right-8 z-[1000] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border {toast.type === 'danger' ? 'bg-red-600 border-red-500' : 'bg-emerald-600 border-emerald-500'} text-white"
  >
    <div class="p-2 bg-white/20 rounded-xl">
      {#if toast.type === 'danger'}<ShieldAlert size={20} />{:else}<Unlock size={20} />{/if}
    </div>
    <div class="flex flex-col">
        <span class="text-[10px] font-black uppercase opacity-70 tracking-widest">Security Update</span>
        <p class="font-bold text-sm leading-tight">{toast.msg}</p>
    </div>
    <button onclick={() => toast = null} class="ml-2 hover:rotate-90 transition-transform"><X size={16}/></button>
  </div>
{/if}

<div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
  <Sidebar />
  <main class="flex-1 overflow-y-auto p-4 md:p-8">
    {@render children()}
  </main>
</div>