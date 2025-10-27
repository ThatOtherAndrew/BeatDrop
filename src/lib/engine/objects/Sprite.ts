import type { Graphics } from 'pixi.js';
import type App from '../App';

export default abstract class Sprite {
    constructor(
        protected app: App,
        public graphics: Graphics,
        public x: number,
        public y: number,
    ) {}

    spawn(): void {
        this.app.stage.addChild(this.graphics);
    }

    abstract update(): void;

    destroy(): void {
        this.app.stage.removeChild(this.graphics);
    }
}
