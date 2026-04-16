<script>
  import { getContext } from 'svelte';
  const { yScale, width } = getContext('LayerCake');
  export let ticks = 11;
</script>

<g class="axis y-axis">
  {#each $yScale.ticks(ticks) as tick (tick)}
    <g class="tick" transform="translate(0, {$yScale(tick)})">
      <line 
        x1="0" 
        x2={$width} 
        stroke="currentColor" 
        class="text-slate-200 dark:text-slate-800" 
        stroke-dasharray="4"
        stroke-opacity="0.5"
      />
      <text 
        x="-20" 
        y="4" 
        text-anchor="end" 
        class="fill-slate-400 text-[9px] font-mono font-bold"
      >
        {tick}
      </text>
    </g>
  {/each}
  <line x1="0" x2="0" y1="0" y2={$yScale.range()[0]} stroke="#334155" stroke-width="2" />
</g>