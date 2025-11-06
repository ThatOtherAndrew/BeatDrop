import type { EventQueue, World as PhysicsWorld } from '@dimforge/rapier2d';
import type { World } from 'miniplex';
import type { AudioEngine } from '../audio/AudioEngine';
import type { Entity } from './Simulation';

const MIN_VELOCITY_THRESHOLD = 2.0;

export default class CollisionHandler {
    constructor(
        private readonly physics: PhysicsWorld,
        private readonly world: World<Entity>,
        private readonly audio: AudioEngine,
    ) {}

    process(eventQueue: EventQueue): void {
        eventQueue.drainCollisionEvents(
            (handle1: number, handle2: number, started: boolean) => {
                if (!started) return;

                const collider1 = this.physics.getCollider(handle1);
                const collider2 = this.physics.getCollider(handle2);

                if (!collider1 || !collider2) return;

                // Check if collision has significant velocity
                if (!this.hasSignificantVelocity(collider1, collider2)) {
                    return;
                }

                // Find entities with these colliders
                const entity1 = this.findEntityByCollider(handle1);
                const entity2 = this.findEntityByCollider(handle2);

                // Play sound if either entity has a pitch (is a block)
                if (entity1?.pitch !== undefined) {
                    this.playCollisionSound(entity1.pitch);
                }

                if (entity2?.pitch !== undefined) {
                    this.playCollisionSound(entity2.pitch);
                }
            },
        );
    }

    private hasSignificantVelocity(collider1: any, collider2: any): boolean {
        const body1 = collider1.parent();
        const body2 = collider2.parent();

        // Check velocity of both bodies
        if (body1) {
            const vel = body1.linvel();
            const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
            if (speed > MIN_VELOCITY_THRESHOLD) return true;
        }

        if (body2) {
            const vel = body2.linvel();
            const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
            if (speed > MIN_VELOCITY_THRESHOLD) return true;
        }

        return false;
    }

    private findEntityByCollider(colliderHandle: number): Entity | undefined {
        for (const entity of this.world.entities) {
            if (entity.collider?.handle === colliderHandle) {
                return entity;
            }
        }
        return undefined;
    }

    private playCollisionSound(pitch: number): void {
        const velocity = 80 + Math.floor(Math.random() * 20);
        this.audio.playNote(pitch, velocity, 0.2);
    }
}
