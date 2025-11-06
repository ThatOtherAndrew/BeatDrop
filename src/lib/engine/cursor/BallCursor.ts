import { Graphics } from 'pixi.js';
import type App from '../App';
import Cursor from './Cursor';

const RADIUS = 20;
const COLOUR = 0xffffff;

export default class BallCursor extends Cursor {
    constructor(app: App) {
        const graphics = new Graphics()
            .circle(0, 0, RADIUS)
            .fill({ color: COLOUR });

        super(app, graphics);
    }

    handleClick(_e: MouseEvent): void {
        this.app.scene.entities.push({
            type: 'ball',
            position: { x: this.worldX, y: this.worldY },
            radius: RADIUS,
        });

        this.app.simulation.loadScene(
            this.app.scene,
            this.app.simulation.currentTick,
        );
    }
}
