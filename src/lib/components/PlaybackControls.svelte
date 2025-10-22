<script lang="ts">
    import PlayPause from 'phosphor-svelte/lib/PlayPause';
    import Stop from 'phosphor-svelte/lib/Stop';
</script>

<div>
    <button>
        <PlayPause weight="fill" size="48" />
    </button>
    <button>
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
