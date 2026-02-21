<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { onMount } from 'svelte'
  import type { TrafficLog, TrafficStats, LogType } from '$lib/types';
  import { trafficLogs, trafficStats, isAiConnected, socket } from '$lib/socket';

  let { children } = $props();

onMount(() => {
    let isInitialized = false;

    async function initializeSystem() {
        try {
            // 1. Coba ambil data awal sampai berhasil
            const response = await fetch("http://localhost:5000/api/initial-data");
            if (!response.ok) throw new Error("Backend Busy");
            
            const payload = await response.json();
            trafficLogs.set(payload.logs);
            trafficStats.set(payload.stats);
            
            console.log("✅ Initial Data Synced. Starting WebSocket...");
            
            // 2. SETELAH initial data beres, baru aktifkan Socket
            if (!socket.connected) {
                socket.connect();
            }
            
            // 3. Pasang listener            
            socket.on("connect", () => isAiConnected.set(true));
            socket.on("disconnect", () => isAiConnected.set(false));
            socket.on('new_traffic', handleTraffic);
            isInitialized = true;

        } catch (err) {
            console.error("❌ Sync failed, retrying in 3s...", err);
            setTimeout(initializeSystem, 3000); // Retry terus
        }
    }

    const handleTraffic = (payload: {type: LogType, data: any, stats: any}) => {
        // Gabungkan type kedalam object data agar store konsisten
        const newLogEntry: TrafficLog = {
            ...payload.data,
            type: payload.type,
            timestamp: payload.data.timestamp || new Date().toISOString()
        }

        trafficLogs.update(currentLogs => {
            const updated = [newLogEntry, ...currentLogs]
            return updated.slice(0,50)
        })

        if(payload.stats){
            trafficStats.set(payload.stats);
        }

        // Console log untuk debugging pas demo (opsional)
        if (payload.type === 'VOTING') {
            console.warn(`⚠️ [VOTING] IP ${payload.data.ip} virdict: ${payload.data.final_label}`);
        }
    };

    initializeSystem();

    return () => {
        socket.off('new_traffic', handleTraffic);
        socket.disconnect();
    };
});

</script>

<div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
  <Sidebar />
  <main class="flex-1 overflow-y-auto p-4 md:p-8">
    {@render children()}
  </main>
</div>