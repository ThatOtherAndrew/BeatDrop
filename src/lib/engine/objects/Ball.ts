import type { RigidBody } from '@dimforge/rapier2d';
import { type Graphics } from 'pixi.js';
import type App from '../App';
import Sprite from './Sprite';

export default class Ball extends Sprite {
    private readonly rigidBody!: RigidBody;

    constructor(
        app: App,
        graphics: Graphics,
        readonly x: number,
        readonly y: number,
        readonly radius: number,
    ) {
        super(app, graphics, x, y);
    }

    spawn(): void {
        super.spawn();

        const RigidBodyDesc = this.app.rapier.RigidBodyDesc;
        const BallDesc = RigidBodyDesc.dynamic().setTranslation(this.x, this.y);
        (this.rigidBody as RigidBody) =
            this.app.world.createRigidBody(BallDesc);
    }

    update(): void {
        const position = this.rigidBody.translation();
        this.graphics.x = position.x;
        this.graphics.y = position.y;
    }

    destroy(): void {
        super.destroy();

        this.app.world.removeRigidBody(this.rigidBody);
    }
}
