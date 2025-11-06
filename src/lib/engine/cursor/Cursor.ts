import type { Graphics } from 'pixi.js';
import type App from '../App';

export default abstract class Cursor {
    protected worldX: number = 0;
    protected worldY: number = 0;

    constructor(
        protected readonly app: App,
        public readonly graphics: Graphics,
    ) {
        graphics.alpha = 0.5;
    }

    /**
     * Update cursor position in world coordinates
     */
    updatePosition(worldX: number, worldY: number): void {
        this.worldX = worldX;
        this.worldY = worldY;
        this.graphics.position.set(worldX, worldY);
    }

    /**
     * Handle click event (spawn entity)
     */
    abstract handleClick(e: MouseEvent): void;

    /**
     * Handle wheel event (optional - for pitch/rotation controls)
     */
    handleWheel?(e: WheelEvent): void;

    /**
     * Called when cursor becomes active (optional)
     */
    onActivate?(): void;
}
