<script lang="ts">
    import { dev } from '$app/environment';
    import WelcomeModal from '$lib/components/WelcomeModal.svelte';
    import App from '$lib/engine/ECSApp';

    let canvasContainer: HTMLElement | undefined = $state();
    let modalOpen = $state(true);

    $effect(() => {
        if (!canvasContainer) return;

        App.init(canvasContainer, 'marimba').then(async (app) => {
            if (dev) {
                const { initDevtools } = await import('@pixi/devtools');
                initDevtools({ app: app.graphics });
            }
        });
    });
</script>

<main>
    <div class="canvas-container" bind:this={canvasContainer}></div>
    <!-- <PlaybackControls /> -->
</main>

<WelcomeModal bind:isOpen={modalOpen} />

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
