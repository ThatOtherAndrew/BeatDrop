<script lang="ts">
    import Pause from 'phosphor-svelte/lib/Pause';
    import Play from 'phosphor-svelte/lib/Play';
    import Stop from 'phosphor-svelte/lib/Stop';

    let isPlaying = $state(true);

    function togglePlayPause() {
        isPlaying = !isPlaying;
    }

    function handleStop() {
        isPlaying = false;
    }
</script>

<div>
    <button onclick={togglePlayPause}>
        {#if isPlaying}
            <Pause weight="fill" size="48" />
        {:else}
            <Play weight="fill" size="48" />
        {/if}
    </button>
    <button onclick={handleStop}>
        <Stop weight="fill" size="48" />
    </button>
</div>

<style lang="scss">
    div {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        padding: 10px;
        border-radius: 10px;
        background-color: #202029;
        pointer-events: none;
    }

    button {
        display: flex;
        padding: 0;
        border: none;
        border-radius: 5px;
        background-color: transparent;
        color: white;
        cursor: pointer;
        transition: background-color 0.15s ease;
        pointer-events: auto;

        &:hover {
            background-color: #445;
        }
    }
</style>
