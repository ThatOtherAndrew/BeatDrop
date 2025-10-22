<script lang="ts">
    import { dev } from '$app/environment';
    import PlaybackControls from '$lib/components/PlaybackControls.svelte';
    import { initApp, runApp } from '$lib/engine/app';
    import { initDevtools } from '@pixi/devtools';

    let canvasContainer: HTMLElement | undefined = $state();

    $effect(() => {
        if (!canvasContainer) return;
        initApp(canvasContainer).then((app) => {
            if (dev) {
                initDevtools({ app });
            }
            runApp(app);
        });
    });
</script>

<main>
    <div class="canvas-container" bind:this={canvasContainer}></div>
    <PlaybackControls />
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
