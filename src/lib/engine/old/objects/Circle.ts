import { Graphics } from 'pixi.js';
import type App from '../App';
import Sprite from './Sprite';

export default class Circle extends Sprite {
    constructor(
        app: App,
        public x: number,
        public y: number,
        public readonly radius: number,
        public readonly colour: number,
    ) {
        const graphics = new Graphics()
            .circle(0, 0, radius)
            .fill({ color: colour });
        super(app, graphics, x, y);
    }

    update(): void {
        this.graphics.position.set(this.x, this.y);
    }
}
