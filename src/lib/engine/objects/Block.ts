import type { Collider } from '@dimforge/rapier2d';
import Rectangle from './Rectangle';

export default class Block extends Rectangle {
    private readonly collider!: Collider;

    spawn(): void {
        super.spawn();

        (this.collider as Collider) = this.app.world.createCollider(
            // prettier-ignore
            this.app.rapier.ColliderDesc
                .cuboid(this.width / 2, this.height / 2)
                .setTranslation(this.x, this.y)
                .setRotation(this.rotation)
                .setRestitution(1),
        );
    }

    destroy(): void {
        this.app.world.removeCollider(this.collider, false);

        super.destroy();
    }
}
