import type { World } from '@dimforge/rapier2d';
import { Application } from 'pixi.js';
import type Sprite from './objects/Sprite';
import CursorCircle from './objects/BallCursor';

export default class App extends Application {
    gravity = { x: 0, y: 100 };

    readonly world: World;
    private sprites: Sprite[] = [];

    private constructor(readonly rapier: typeof import('@dimforge/rapier2d')) {
        super();
        this.world = new this.rapier.World(this.gravity);
    }

    static async init(container: HTMLElement): Promise<App> {
        const rapier = await import('@dimforge/rapier2d');
        const app = new App(rapier);
        await app.init({ background: 'black', resizeTo: container });
        container.appendChild(app.canvas);
        return app;
    }

    addSprite(sprite: Sprite): void {
        if (this.sprites.includes(sprite)) {
            throw new Error('Sprite already added');
        }
        this.sprites.push(sprite);
        sprite.spawn();
    }

    async run() {
        this.addSprite(new CursorCircle(this, 20, 0xffffff));

        this.ticker.add(() => {
            this.world.step();
            this.sprites.forEach((sprite) => sprite.update());
        });
    }
}
