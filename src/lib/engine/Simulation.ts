import { Query, World } from 'miniplex';
import type { World as PhysicsWorld, RigidBody } from '@dimforge/rapier2d';
import { Graphics, Application } from 'pixi.js';

type Entity = {
    position: { x: number; y: number };
    graphics?: Graphics;
    rigidBody?: RigidBody;
    cursor?: true;
};

export default class Simulation {
    gravity = { x: 0, y: 100 };

    readonly world: World<Entity>;
    readonly graphics: Application;
    readonly rapier: typeof import('@dimforge/rapier2d');
    readonly physics: PhysicsWorld;
    readonly queries;

    constructor(rapier: typeof import('@dimforge/rapier2d')) {
        this.world = new World();
        this.graphics = new Application();
        this.rapier = rapier;
        this.physics = new rapier.World(this.gravity);

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

    static async init(): Promise<Simulation> {
        const rapier = await import('@dimforge/rapier2d');
        const app = new Simulation(rapier);

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
            entity.graphics.x = entity.position.x;
            entity.graphics.y = entity.position.y;
        }
    }
}
