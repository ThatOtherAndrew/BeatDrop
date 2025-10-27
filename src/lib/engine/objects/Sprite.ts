import type { Application, Graphics } from 'pixi.js';

export default abstract class Sprite {
    constructor(
        protected app: Application,
        public graphics: Graphics,
        public x: number,
        public y: number,
    ) {}

    abstract update(): void;

    destroy(): void {
        this.app.stage.removeChild(this.graphics);
    }
}
