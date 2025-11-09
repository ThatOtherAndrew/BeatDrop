<script lang="ts">
    let {
        isOpen = $bindable(false),
        onclose,
    }: { isOpen?: boolean; onclose?: () => void } = $props();

    function closeModal() {
        isOpen = false;
        onclose?.();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Jaini&family=IM+Fell+English&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
    <div
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
    >
        <div class="modal">
            <div class="modal-header">
                <h2>Welcome to BeatDrop!</h2>
                <button
                    class="close-button"
                    onclick={closeModal}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>

            <div class="modal-body">
                <div class="banner">
                    <img
                        src="https://siege.hackclub.com/assets/logo-55998110.webp"
                        alt="Siege logo"
                        class="banner-logo"
                    />
                    <div class="banner-content">
                        <h3>Reviewing for Siege?</h3>
                        <p>
                            Feel free to <a
                                href="https://hackclub.slack.com/team/U074K2VPP62"
                                >message me on Slack</a
                            > if you have any questions or issues :D
                        </p>
                    </div>
                </div>

                <h2>About</h2>

                <p>
                    <b>BeatDrop!</b> lets you make music by spawning falling balls
                    to hit notes in a physics playground.
                </p>
                <div class="video-container">
                    <iframe
                        src="https://www.youtube-nocookie.com/embed/ZEJB2O4PFgA"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                    ></iframe>
                </div>
                <h2>Controls</h2>
                <p>
                    Currently, the only control scheme fully supported for
                    editing is <b>keyboard and mouse/touchpad</b> (sorry, mobile
                    users!).
                </p>
                <ul>
                    <li>
                        <b>Click:</b> Place a ball or brick
                    </li>
                    <li>
                        <b>Click & drag:</b> Move/pan across the canvas
                    </li>
                    <li>
                        <b>Left/Right arrow keys:</b> Switch between ball and brick
                        placement mode
                    </li>
                    <li>
                        <b>Scroll up/down:</b> Zoom in/out
                    </li>
                    <li>
                        <b>Ctrl + scroll:</b> Change the pitch of the next brick
                        to be placed
                    </li>
                    <li>
                        <b>Shift + scroll:</b> Rotate the next brick to be placed
                    </li>
                    <li>
                        <b>Number keys (0-9):</b> Skip to playback time
                    </li>
                </ul>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal {
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 1000px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, sans-serif;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 2px solid #e5e5e5;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1a1a1a;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 2rem;
        color: #1a1a1a;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition:
            color 0.2s,
            background-color 0.2s;
    }

    .close-button:hover {
        background-color: #f5f5f5;
    }

    .modal-body {
        font-size: larger;
        padding: 1.5rem;
        color: #1a1a1a;
        line-height: 1.6;
    }

    .modal-body p {
        margin-bottom: 1rem;
    }

    .modal-body li {
        margin-bottom: 1rem;
    }

    .banner {
        background-image: url('https://siege.hackclub.com/assets/scroll-aca243bf.webp');
        background-position: center;
        background-size: 150%;
        border-left: 4px solid #3b2a1a;
        padding: 1rem;
        margin-bottom: 1.5rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .banner-logo {
        width: 64px;
        height: 64px;
        object-fit: contain;
        flex-shrink: 0;
    }

    .banner-content {
        flex: 1;
    }

    .banner h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.8rem;
        font-weight: 600;
        font-family: 'Jaini', cursive;
        color: #3b2a1a;
    }

    .banner p {
        margin: 0;
        font-size: 1.2rem;
        font-family: 'IM Fell English', serif;
        color: #3b2a1a;
    }

    .banner a {
        color: #3b2a1a;
    }

    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        margin: 1rem 0 2rem 0;
        border-radius: 8px;
        overflow: hidden;
    }

    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
    }

    @media (min-width: 768px) {
        .video-container {
            max-width: 700px;
            margin: 1rem auto 2rem auto;
        }
    }

    @media (min-width: 1024px) {
        .video-container {
            max-width: 800px;
        }
    }
</style>
