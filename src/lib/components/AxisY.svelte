<script>
  import { getContext } from 'svelte';
  const { yScale, width } = getContext('LayerCake');

  export let ticks = 5;
</script>

<g class="axis y-axis">
  {#each $yScale.ticks(ticks) as tick}
    <g class="tick" transform="translate(0, {$yScale(tick)})">
      <line x1="0" x2={$width} stroke="rgba(148, 163, 184, 0.1)" stroke-dasharray="4" />
      <text x="-10" y="4" text-anchor="end" class="fill-slate-400 text-[10px] font-bold">
        {tick}
      </text>
    </g>
  {/each}
  <line x1="0" x2="0" y1="0" y2={$yScale.range()[0]} stroke="#e2e8f0" />
</g>