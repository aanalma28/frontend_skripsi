<script>
  import { getContext } from 'svelte';
  // Ambil data yang udah di-map di Page.svelte
  const { data, xGet, yGet } = getContext('LayerCake');
</script>

<g class="scatter-group">
  {#each $data as d (d.id)}
    <circle
      cx={$xGet(d)}
      cy={$yGet(d)}
      r={d.type === 'PENALTY' ? 10 : 5} 
      fill={d.color} 
      stroke="white"
      stroke-width={d.type === 'PENALTY' ? 3 : 1}
      class="transition-all duration-500 {d.type === 'PENALTY' ? 'animate-pulse' : ''}"
      opacity={d.type === 'PENALTY' ? 1 : 0.7}
    />
  {/each}
</g>