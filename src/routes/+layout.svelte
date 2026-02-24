<script lang="ts">
  import '../app.css';
  import { theme } from '$lib/theme';
  import { onMount } from 'svelte';  
  import { browser } from '$app/environment';

  let { children } = $props();  

  // Memastikan theme store aktif segera setelah aplikasi load
  onMount(() => {
    const unsubscribe = theme.subscribe(() => {});
    return unsubscribe;
  });
</script>

<svelte:head>
  <title>AI-IPS | Intelligent Prevention System</title>
</svelte:head>

<div class="min-h-screen transition-colors duration-500 bg-white dark:bg-slate-950">
  {@render children()}
</div>