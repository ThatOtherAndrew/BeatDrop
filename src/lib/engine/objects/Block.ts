import type { Collider } from '@dimforge/rapier2d';
import Rectangle from './Rectangle';

export default class Block extends Rectangle {
    private readonly collider!: Collider;

    constructor(
        app: any,
        x: number,
        y: number,
        width: number,
        height: number,
        colour: number,
        rotation: number,
        public pitch: number = 60,
    ) {
        super(app, x, y, width, height, colour, rotation);
    }

    spawn(): void {
        super.spawn();

        (this.collider as Collider) = this.app.world.createCollider(
            // prettier-ignore
            this.app.rapier.ColliderDesc
                .cuboid(this.width / 2, this.height / 2)
                .setTranslation(this.x, this.y)
                .setRotation(this.rotation)
                .setRestitution(1)
                .setActiveEvents(this.app.rapier.ActiveEvents.COLLISION_EVENTS),
        );

        this.app.registerCollider(this.collider.handle, this);
    }

    onCollision(): void {
        // Resume audio context on first interaction (browser requirement)
        this.app.soundFont.resume();

        // Play the note with the block's pitch
        const velocity = 80 + Math.floor(Math.random() * 20);
        this.app.soundFont.playNote(this.pitch, velocity, 0.2);
    }

    destroy(): void {
        this.app.unregisterCollider(this.collider.handle);
        this.app.world.removeCollider(this.collider, false);

        super.destroy();
    }
}
