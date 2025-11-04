<script lang="ts">
    import { dev } from '$app/environment';
    import PlaybackControls from '$lib/components/PlaybackControls.svelte';
    import WelcomeModal from '$lib/components/WelcomeModal.svelte';
    import App from '$lib/engine/App';

    let canvasContainer: HTMLElement | undefined = $state();
    let modalOpen = $state(true);
    let app: App | undefined = $state();

    $effect(() => {
        if (!canvasContainer) return;
        App.init(canvasContainer, dev).then(async (appInstance) => {
            app = appInstance;
        });
    });
</script>

<main>
    <div class="canvas-container" bind:this={canvasContainer}></div>
    {#if app}
        <PlaybackControls {app} />
    {/if}
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
