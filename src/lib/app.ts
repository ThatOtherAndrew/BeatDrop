import { Application, Assets, Container, Sprite } from "pixi.js";

export async function initApp(canvasContainer: HTMLElement) {
    const app = new Application();
    await app.init({ background: "black", resizeTo: canvasContainer });
    canvasContainer.appendChild(app.canvas);
    return app;
}

export async function runApp(app: Application) {
    // *** BEGIN example code
    // Create and add a container to the stage
    const container = new Container();
    app.stage.addChild(container);

    // Load the bunny texture
    const texture = await Assets.load("https://pixijs.com/assets/bunny.png");

    // Create a 5x5 grid of bunnies in the container
    for (let i = 0; i < 25; i++) {
        const bunny = new Sprite(texture);
        bunny.x = (i % 5) * 40;
        bunny.y = Math.floor(i / 5) * 40;
        container.addChild(bunny);
    }

    // Move the container to the center
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Center the bunny sprites in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    // Listen for animate update
    app.ticker.add((time) => {
        // Continuously rotate the container!
        // * use delta to create frame-independent transform *
        container.rotation -= 0.01 * time.deltaTime;
    });
    // *** END example code
}
