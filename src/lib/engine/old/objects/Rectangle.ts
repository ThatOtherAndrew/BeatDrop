import { Graphics } from 'pixi.js';
import type App from '../App';
import Sprite from './Sprite';

export default class Rectangle extends Sprite {
    constructor(
        app: App,
        public x: number,
        public y: number,
        public readonly width: number,
        public readonly height: number,
        public readonly colour: number,
        public rotation: number = 0,
    ) {
        const graphics = new Graphics()
            .rect(-width / 2, -height / 2, width, height)
            .fill({ color: colour });
        super(app, graphics, x, y);
        this.graphics.rotation = rotation;
    }

    update(): void {
        this.graphics.position.set(this.x, this.y);
        this.graphics.rotation = this.rotation;
    }
}
