<script lang="ts">
import Sidebar from '$lib/components/Sidebar.svelte';
import { onMount } from 'svelte'
import type { TrafficLog, TrafficStats, LogType, PenaltyData, BlockedIP, SystemConfig } from '$lib/types';
import { trafficLogs, trafficStats, isAiConnected, socket, penaltyStore, blockedStore, systemConfig } from '$lib/socket';

let { children } = $props();

onMount(() => {

    async function initializeSystem() {
        try {
            // 1. Coba ambil data awal sampai berhasil
            const response = await fetch("http://localhost:5000/api/initial-data");
            if (!response.ok) throw new Error("Backend Busy");
            
            const payload = await response.json();
            console.log(payload)
            trafficLogs.set(payload.logs);
            trafficStats.set(payload.stats);
            // cast systemconfig dengan type SystemConfig untuk memastikan konsistensi
            const configs = payload.configs as SystemConfig;
            systemConfig.set(configs);
            blockedStore.set(payload.blocked_ips);
            penaltyStore.set(payload.penalties);
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
                    const index = current.findIndex(p => p.ip_address === payload.ip_address);
                    if (index !== -1) {
                        current[index] = payload;
                        return [...current];
                    }
                    return [payload, ...current].slice(0, 100);
                });
            });

            // Listener Real-time untuk Blokir Baru
            socket.on('new_block', (payload: BlockedIP) => {
                blockedStore.update(current => [payload, ...current]);
                // Logika alert bisa ditambahkan di sini
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
        socket.off('connect')
        socket.off('disconnect')
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