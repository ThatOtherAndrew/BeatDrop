import type { World as PhysicsWorld, RigidBody } from '@dimforge/rapier2d';
import { World } from 'miniplex';
import { Application, Graphics } from 'pixi.js';
import type Scene from './Scene';

type Entity = {
    position: { x: number; y: number };
    graphics?: Graphics;
    rigidBody?: RigidBody;
    cursor?: true;
};

export default class Simulation {
    public readonly gravity = { x: 0, y: 100 } as const;

    private physics: PhysicsWorld;
    private readonly world: World<Entity>;
    private readonly graphics: Application;
    private readonly rapier: typeof import('@dimforge/rapier2d');
    private readonly queries;

    constructor(rapier: typeof import('@dimforge/rapier2d'), scene: Scene) {
        this.physics = new rapier.World(this.gravity);
        this.world = new World();
        this.graphics = new Application();
        this.rapier = rapier;
        this.queries = {
            renderable: this.world.with('graphics'),
            dynamic: this.world.with('rigidBody'),
        };

        this.initCallbacks();
        this.addEntities(scene);
    }

    private initCallbacks() {
        this.queries.renderable.onEntityAdded.subscribe((entity) => {
            this.graphics.stage.addChild(entity.graphics!);
        });

        this.queries.renderable.onEntityRemoved.subscribe((entity) => {
            this.graphics.stage.removeChild(entity.graphics!);
        });
    }

    static async init(scene: Scene): Promise<Simulation> {
        const rapier = await import('@dimforge/rapier2d');
        const app = new Simulation(rapier, scene);

        return app;
    }

    private reset() {
        this.physics.free();
        this.physics = new this.rapier.World(this.gravity);
        this.world.clear();
    }

    private addEntities(scene: Scene) {
        for (const entity of scene.entities) {
            this.world.add(entity);
        }
    }

    loadScene(scene: Scene) {
        this.reset();
        this.addEntities(scene);
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
