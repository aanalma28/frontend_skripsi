<script>
  import { getContext } from 'svelte';
  const { xScale, height } = getContext('LayerCake');
  export let ticks = 11; 
</script>

<g class="axis x-axis">
  {#each $xScale.ticks(ticks) as tick (tick)}
    <g class="tick" transform="translate({$xScale(tick)}, 0)">
      <line 
        y1="0" 
        y2={$height} 
        stroke="currentColor" 
        class="text-slate-200 dark:text-slate-800" 
        stroke-dasharray="4"
        stroke-opacity="0.5" 
      />
      <text 
        y={$height + 25} 
        text-anchor="middle" 
        class="fill-slate-400 text-[9px] font-mono font-bold"
      >
        {tick}
      </text>
    </g>
  {/each}
  <line x1="0" x2={$xScale.range()[1]} y1={$height} y2={$height} stroke="#334155" stroke-width="2" />
</g>