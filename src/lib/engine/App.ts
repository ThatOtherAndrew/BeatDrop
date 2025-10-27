import type { World } from '@dimforge/rapier2d';
import { Application } from 'pixi.js';
import type Sprite from './objects/Sprite';
import BallCursor from './objects/BallCursor';
import BlockCursor from './objects/BlockCursor';

export default class App extends Application {
    gravity = { x: 0, y: 100 };
    cursors = [
        new BallCursor(this, 20, 0xffffff),
        new BlockCursor(this, 100, 20, 0xff0000),
    ];

    readonly world: World;
    private sprites: Sprite[] = [];
    private currentCursor: number = 0;

    mouseX = 0;
    mouseY = 0;

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

    removeSprite(sprite: Sprite): void {
        const index = this.sprites.indexOf(sprite);
        if (index === -1) {
            throw new Error('Sprite not found');
        }
        this.sprites.splice(index, 1);
        sprite.destroy();
    }

    async run() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.addSprite(this.cursors[this.currentCursor]);

        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                this.removeSprite(this.cursors[this.currentCursor]);
                this.currentCursor += 1;
                this.currentCursor %= this.cursors.length;
                this.addSprite(this.cursors[this.currentCursor]);
            }
        });

        this.ticker.add(() => {
            this.world.step();
            this.sprites.forEach((sprite) => sprite.update());
        });
    }
}
