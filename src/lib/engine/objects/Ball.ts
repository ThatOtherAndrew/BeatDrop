import type { RigidBody } from '@dimforge/rapier2d';
import Sprite from './Sprite';
import { Application, type Graphics } from 'pixi.js';

export default class Ball extends Sprite {
    constructor(
        app: Application,
        graphics: Graphics,
        x: number,
        y: number,
        public rigidBody: RigidBody,
    ) {
        super(app, graphics, x, y);
    }

    update(): void {
        const position = this.rigidBody.translation();
        this.graphics.x = position.x;
        this.graphics.y = position.y;
    }

    destroy(): void {
        super.destroy();
        this.app.physics;
    }
}
