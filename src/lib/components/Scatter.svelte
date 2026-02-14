<script>
  import { getContext } from 'svelte';
  const { data, xGet, yGet } = getContext('LayerCake');
</script>

<g class="scatter-group">
  {#each $data as d}
    <circle
      cx={$xGet(d)}
      cy={$yGet(d)}
      r={d.status === 'Judol' ? 6 : 4}
      fill={d.status === 'Judol' ? '#ef4444' : '#10b981'}
      stroke="white"
      stroke-width="1"
      class="transition-all duration-300"
    />
  {/each}
</g>