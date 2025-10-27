import type { RigidBody } from '@dimforge/rapier2d';
import Circle from './Circle';

export default class Ball extends Circle {
    private readonly rigidBody!: RigidBody;

    spawn(): void {
        super.spawn();

        const RigidBodyDesc = this.app.rapier.RigidBodyDesc;
        const BallDesc = RigidBodyDesc.dynamic().setTranslation(this.x, this.y);
        (this.rigidBody as RigidBody) =
            this.app.world.createRigidBody(BallDesc);
    }

    update(): void {
        const position = this.rigidBody.translation();
        this.x = position.x;
        this.y = position.y;
        super.update();
    }

    destroy(): void {
        this.app.world.removeRigidBody(this.rigidBody);
        super.destroy();
    }
}
