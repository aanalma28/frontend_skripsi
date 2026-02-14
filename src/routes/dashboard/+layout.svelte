<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { onMount } from 'svelte'
  import type { TrafficLog, TrafficStats } from '$lib/types';
  import { trafficLogs, trafficStats, isAiConnected, socket } from '$lib/socket';

  let { children } = $props();

  // sinkronisasi saat refresh menggunakan API di backend
  onMount(() => {
    const updateHandler = (payload: {data: TrafficLog, stats: TrafficStats}) => {
      // update untuk menambahkan log jaringan
      trafficLogs.update(logs => [payload.data, ...logs].slice(0,50))
      // set untuk mengubah angka stats jumlah log dan deteksi judol yang terbaru
      trafficStats.set(payload.stats)
    }

    // fetch data terbaru
    const initData = async () => {
      try{
        // Koneksi ke socket
        if (!socket.connected) socket.connect();

        const response = await fetch("http://localhost:5000/api/initial-data")
        const payload = await response.json()

        // mengisi variable svelte store dengan data dari database
        trafficLogs.set(payload.logs)
        trafficStats.set(payload.stats)

        // kode realtime dari websocket
        socket.on('new_traffic', updateHandler)
      }catch(err){
        console.error("Gagal Sinkronisasi awal: ", err)
      }      
    }

    initData()
  
    // 4. Cleanup: Mati saat logout / pindah ke luar grup dashboard
    return () => {
        console.log("Cleaning up socket listeners...");
        socket.off('new_traffic', updateHandler);
    };
  })

</script>

<div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
  <Sidebar />
  <main class="flex-1 overflow-y-auto p-4 md:p-8">
    {@render children()}
  </main>
</div>