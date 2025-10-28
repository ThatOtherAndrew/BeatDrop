<script lang="ts">
    import { dev } from '$app/environment';
    import PlaybackControls from '$lib/components/PlaybackControls.svelte';
    import App from '$lib/engine/App';

    let canvasContainer: HTMLElement | undefined = $state();

    $effect(() => {
        if (!canvasContainer) return;

        App.init(canvasContainer).then(async (app) => {
            if (dev) {
                const { initDevtools } = await import('@pixi/devtools');
                initDevtools({ app });
            }
            await app.run();
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
