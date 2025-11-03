import type {
    Collider,
    World as PhysicsWorld,
    RigidBody,
} from '@dimforge/rapier2d';
import { World } from 'miniplex';
import { Application, Graphics } from 'pixi.js';
import type Scene from './Scene';
import type { Ball } from './Scene';

type Entity = {
    position: { x: number; y: number };
    graphics?: Graphics;
    rigidBody?: RigidBody;
    collider?: Collider;
    cursor?: true;
};

export default class Simulation {
    public readonly gravity = { x: 0, y: 100 } as const;

    private physics: PhysicsWorld;
    private readonly world: World<Entity>;
    private readonly graphics: Application;
    private readonly rapier: typeof import('@dimforge/rapier2d');
    private readonly queries;

    private constructor(
        rapier: typeof import('@dimforge/rapier2d'),
        graphics: Application,
        scene: Scene,
    ) {
        this.physics = new rapier.World(this.gravity);
        this.world = new World();
        this.graphics = graphics;
        this.rapier = rapier;
        this.queries = {
            renderable: this.world.with('graphics'),
            dynamic: this.world.with('rigidBody'),
        };

        this.initCallbacks();
        this.spawnEntitiesFromScene(scene);
    }

    private initCallbacks() {
        this.queries.renderable.onEntityAdded.subscribe((entity) => {
            console.debug('Entity added:', entity);
            this.graphics.stage.addChild(entity.graphics);
        });

        this.queries.renderable.onEntityRemoved.subscribe((entity) => {
            this.graphics.stage.removeChild(entity.graphics);
        });
    }

    static async init(
        graphics: Application,
        scene: Scene,
    ): Promise<Simulation> {
        const rapier = await import('@dimforge/rapier2d');
        const app = new Simulation(rapier, graphics, scene);

        return app;
    }

    private reset() {
        this.physics.free();
        this.physics = new this.rapier.World(this.gravity);
        this.world.clear();
    }

    private spawnEntitiesFromScene(scene: Scene) {
        for (const entity of scene.entities) {
            switch (entity.type) {
                case 'ball':
                    this.spawnBall(entity);
                    break;
                default:
                    console.warn(`Unknown entity type: ${entity.type}`);
            }
        }
    }

    private spawnBall(entity: Ball) {
        console.log('Spawning ball:', entity);
        const position = { x: entity.position.x, y: entity.position.y };
        const graphics = new Graphics()
            .circle(0, 0, entity.radius)
            .fill({ color: 0xffffff });
        const rigidBody = this.physics.createRigidBody(
            this.rapier.RigidBodyDesc.dynamic().setTranslation(
                entity.position.x,
                entity.position.y,
            ),
        );

        this.world.add({ position, graphics, rigidBody });
    }

    loadScene(scene: Scene) {
        this.reset();
        this.spawnEntitiesFromScene(scene);
    }

    tick() {
        this.physics.step();

        // Physics -> ECS
        for (const entity of this.queries.dynamic) {
            const position = entity.rigidBody.translation();
            entity.position.x = position.x;
            entity.position.y = position.y;
        }

        // ECS -> Graphics
        for (const entity of this.queries.renderable) {
            entity.graphics.x = entity.position.x;
            entity.graphics.y = entity.position.y;
        }
    }
}
