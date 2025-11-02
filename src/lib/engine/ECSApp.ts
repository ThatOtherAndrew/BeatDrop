import { World } from 'miniplex';
import type { World as PhysicsWorld } from '@dimforge/rapier2d';
import { Application as PixiApplication } from 'pixi.js';
import SoundFontPlayer from './audio/SoundFontPlayer';

class ECSApp {
    gravity = { x: 0, y: 100 };

    readonly world: World;
    readonly graphics: PixiApplication;
    readonly rapier: typeof import('@dimforge/rapier2d');
    readonly physics: PhysicsWorld;
    readonly soundFont: SoundFontPlayer;

    constructor(rapier: typeof import('@dimforge/rapier2d')) {
        this.world = new World();
        this.graphics = new PixiApplication();
        this.rapier = rapier;
        this.physics = new rapier.World(this.gravity);
        this.soundFont = new SoundFontPlayer();
    }

    static async init(container: HTMLElement, sound: string): Promise<ECSApp> {
        const rapier = await import('@dimforge/rapier2d');
        const app = new ECSApp(rapier);
        app.graphics.init({ background: 'black', resizeTo: container });
        container.appendChild(app.graphics.canvas);
        app.soundFont.load(sound);
        return app;
    }
}
