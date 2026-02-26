<script lang="ts">
    import { trafficStats } from '$lib/socket';

    $: queueCount = $trafficStats.current_queue || 0;
    
    // Warna teks status
    $: statusColor = queueCount > 80 ? 'text-red-600 dark:text-red-400' : 
                     queueCount > 40 ? 'text-amber-500 dark:text-amber-400' : 
                     'text-emerald-500 dark:text-emerald-400';

    // Warna background badge
    $: bgColor = queueCount > 80 ? 'bg-red-50 dark:bg-red-900/20' : 
                 queueCount > 40 ? 'bg-amber-50 dark:bg-amber-900/20' : 
                 'bg-emerald-50 dark:bg-emerald-900/20';

    // Warna progress bar & indicator
    $: barColor = queueCount > 80 ? 'bg-red-500' : 
                  queueCount > 40 ? 'bg-amber-500' : 
                  'bg-emerald-500';

    $: statusLabel = queueCount > 80 ? 'Critical (Overload)' : 
                     queueCount > 40 ? 'Busy (Processing)' : 
                     'Healthy (Idle)';
</script>

<div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-sm transition-all duration-300 backdrop-blur-sm">
    <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
            <div class="relative flex h-3 w-3">
                {#if queueCount > 0}
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full {barColor} opacity-75"></span>
                {/if}
                <span class="relative inline-flex rounded-full h-3 w-3 {barColor}"></span>
            </div>
            <h3 class="font-semibold text-slate-700 dark:text-slate-200">System Load Monitor</h3>
        </div>
        
        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border {statusColor} {bgColor} border-current">
            {statusLabel}
        </span>
    </div>

    <div class="flex items-end justify-between mb-2">
        <div>
            <span class="text-4xl font-black tracking-tight {statusColor}">
                {queueCount}
            </span>
            <span class="text-slate-400 dark:text-slate-500 text-sm ml-1">/ 100 Packets</span>
        </div>
        <div class="text-right">
            <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">Buffer Capacity</p>
        </div>
    </div>

    <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <div 
            class="h-full transition-all duration-500 ease-out {barColor}" 
            style="width: {Math.min(queueCount, 100)}%">
        </div>
    </div>
    
    <p class="mt-3 text-[11px] text-slate-400 dark:text-slate-500 italic">
        * Menunjukkan jumlah flow yang menunggu diproses oleh AI Worker.
    </p>
</div>

<style>
    .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 500ms;
    }
</style>