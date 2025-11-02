import { Query, World } from 'miniplex';
import type { World as PhysicsWorld, RigidBody } from '@dimforge/rapier2d';
import { Graphics, Application as PixiApplication } from 'pixi.js';
import SoundFontPlayer from './audio/SoundFontPlayer';

type Entity = {
    position: { x: number; y: number };
    graphics?: Graphics;
    rigidBody?: RigidBody;
    cursor?: true;
};

export default class ECSApp {
    gravity = { x: 0, y: 100 };

    readonly world: World;
    readonly graphics: PixiApplication;
    readonly rapier: typeof import('@dimforge/rapier2d');
    readonly physics: PhysicsWorld;
    readonly soundFont: SoundFontPlayer;
    readonly queries: Record<string, Query<Entity>>;

    constructor(rapier: typeof import('@dimforge/rapier2d')) {
        this.world = new World<Entity>();
        this.graphics = new PixiApplication();
        this.rapier = rapier;
        this.physics = new rapier.World(this.gravity);
        this.soundFont = new SoundFontPlayer();

        this.soundFont.load('marimba');

        this.queries = {
            renderable: this.world.with('graphics'),
            dynamic: this.world.with('rigidBody'),
        };

        this.queries.renderable.onEntityAdded.subscribe((entity) => {
            this.graphics.stage.addChild(entity.graphics!);
        });

        this.queries.renderable.onEntityRemoved.subscribe((entity) => {
            this.graphics.stage.removeChild(entity.graphics!);
        });
    }

    static async init(container: HTMLElement, sound: string): Promise<ECSApp> {
        const rapier = await import('@dimforge/rapier2d');
        const app = new ECSApp(rapier);
        await app.graphics.init({ background: 'black', resizeTo: container });
        container.appendChild(app.graphics.canvas);

        return app;
    }

    tick() {
        this.physics.step();

        for (const entity of this.queries.dynamic) {
            const position = entity.rigidBody!.translation();
            entity.position.x = position.x;
            entity.position.y = position.y;
        }

        for (const entity of this.queries.renderable) {
            entity.graphics!.x = entity.position.x;
            entity.graphics!.y = entity.position.y;
        }
    }
}
