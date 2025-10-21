<script lang="ts">
    import { runApp } from "$lib/app";

    let canvasContainer: HTMLElement | undefined = $state();

    $effect(() => {
        if (!canvasContainer) return;
        runApp(canvasContainer);
    });
</script>

<main bind:this={canvasContainer}></main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
</style>
