<script lang="ts">
    import { dev } from "$app/environment";
    import { initApp, runApp } from "$lib/app";
    import { initDevtools } from "@pixi/devtools";

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

<main bind:this={canvasContainer}></main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
</style>
