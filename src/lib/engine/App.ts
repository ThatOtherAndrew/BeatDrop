import type { World } from '@dimforge/rapier2d';
import { Application } from 'pixi.js';
import type Sprite from './objects/Sprite';
import BallCursor from './objects/BallCursor';
import BlockCursor from './objects/BlockCursor';
import SoundFontPlayer from './audio/SoundFontPlayer';

export default class App extends Application {
    gravity = { x: 0, y: 100 };
    cursors = [
        new BallCursor(this, 20, 0xffffff),
        new BlockCursor(this, 100, 20, 0xff0000),
    ];

    readonly world: World;
    readonly soundFont: SoundFontPlayer;
    private sprites: Sprite[] = [];
    private currentCursor: number = 0;
    private colliderMap = new Map<number, Sprite>();
    private eventQueue: any;

    mouseX = 0;
    mouseY = 0;

    private constructor(readonly rapier: typeof import('@dimforge/rapier2d')) {
        super();
        this.world = new this.rapier.World(this.gravity);
        this.soundFont = new SoundFontPlayer();
        this.eventQueue = new this.rapier.EventQueue(true);
    }

    static async init(container: HTMLElement): Promise<App> {
        const rapier = await import('@dimforge/rapier2d');
        const app = new App(rapier);
        await app.init({ background: 'black', resizeTo: container });
        container.appendChild(app.canvas);

        // Load soundfont instrument (marimba for percussive sound)
        await app.soundFont.load('marimba');

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

    registerCollider(colliderHandle: number, sprite: Sprite): void {
        this.colliderMap.set(colliderHandle, sprite);
    }

    unregisterCollider(colliderHandle: number): void {
        this.colliderMap.delete(colliderHandle);
    }

    shiftCursor(shift: number): void {
        this.removeSprite(this.cursors[this.currentCursor]);
        this.currentCursor = (this.currentCursor + shift) % this.cursors.length;
        if (this.currentCursor < 0) {
            this.currentCursor += this.cursors.length;
        }
        this.addSprite(this.cursors[this.currentCursor]);
    }

    async run() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.addSprite(this.cursors[this.currentCursor]);

        // Cursor switching
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') this.shiftCursor(1);
            if (event.key === 'ArrowLeft') this.shiftCursor(-1);
        });

        this.ticker.add(() => {
            this.world.step(this.eventQueue);

            // Process collision events
            this.eventQueue.drainCollisionEvents((handle1: number, handle2: number, started: boolean) => {
                if (started) {
                    // Collision started
                    const sprite1 = this.colliderMap.get(handle1);
                    const sprite2 = this.colliderMap.get(handle2);

                    if (sprite1?.onCollision) sprite1.onCollision();
                    if (sprite2?.onCollision) sprite2.onCollision();
                }
            });

            this.sprites.forEach((sprite) => sprite.update());
        });
    }
}
