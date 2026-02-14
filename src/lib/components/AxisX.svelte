<script>
  import { getContext } from 'svelte';
  const { xScale, height, padding } = getContext('LayerCake');

  export let ticks = 5; // Jumlah angka label yang muncul
</script>

<g class="axis x-axis">
  {#each $xScale.ticks(ticks) as tick}
    <g class="tick" transform="translate({$xScale(tick)}, 0)">
      <line y1="0" y2={$height} stroke="rgba(148, 163, 184, 0.1)" stroke-dasharray="4" />
      <text y={$height + 20} text-anchor="middle" class="fill-slate-400 text-[10px] font-bold">
        {tick}
      </text>
    </g>
  {/each}
  <line x1="0" x2={$xScale.range()[1]} y1={$height} y2={$height} stroke="#e2e8f0" />
</g>