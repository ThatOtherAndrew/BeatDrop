<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';

    let { children } = $props();
</script>

<svelte:head>
    <title>BeatDrop!</title>
</svelte:head>

{@render children?.()}

<style>
    :global(body) {
        margin: 0;
    }
</style>
