<script lang="ts">
    let { children } = $props();
</script>

<svelte:head>
    <title>BeatDrop!</title>
    <meta name="theme-color" content="black" />
</svelte:head>

{@render children?.()}

<style>
    :global(body) {
        margin: 0;
    }
</style>
