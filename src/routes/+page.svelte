<script lang="ts">
    import { runApp } from "$lib/app";
    import { onMount } from "svelte";

    let canvasContainer: HTMLElement;

    onMount(async () => {
        const cleanup = await runApp(canvasContainer);
        return cleanup;
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
