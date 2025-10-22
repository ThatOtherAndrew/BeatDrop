<script lang="ts">
    import { dev } from '$app/environment';
    import PlaybackControls from '$lib/components/PlaybackControls.svelte';
    import type { SimulationControls } from '$lib/engine/app';
    import { initApp, runApp } from '$lib/engine/app';
    import { initDevtools } from '@pixi/devtools';

    let canvasContainer: HTMLElement | undefined = $state();
    let controls: SimulationControls | undefined = $state();

    $effect(() => {
        if (!canvasContainer) return;
        initApp(canvasContainer).then(async (app) => {
            if (dev) {
                initDevtools({ app });
            }
            controls = await runApp(app);
        });
    });
</script>

<main>
    <div class="canvas-container" bind:this={canvasContainer}></div>
    {#if controls}
        <PlaybackControls {controls} />
    {/if}
</main>

<style>
    main {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .canvas-container {
        position: absolute;
        inset: 0;
    }
</style>
