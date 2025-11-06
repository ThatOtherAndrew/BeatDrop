import type { Container } from 'pixi.js';

export default class Camera {
    private x: number = 0;
    private y: number = 0;
    private scale: number = 1;

    constructor(private readonly stage: Container) {}

    /**
     * Pan the camera by the given delta in screen coordinates
     */
    pan(deltaX: number, deltaY: number): void {
        this.x += deltaX;
        this.y += deltaY;
        this.updateTransform();
    }

    /**
     * Zoom the camera towards a point in screen coordinates
     */
    zoom(screenX: number, screenY: number, factor: number): void {
        // Calculate world position before zoom
        const worldX = (screenX - this.x) / this.scale;
        const worldY = (screenY - this.y) / this.scale;

        // Update scale with constraints
        this.scale = Math.max(0.1, Math.min(10, this.scale * factor));

        // Adjust camera position to zoom towards point
        this.x = screenX - worldX * this.scale;
        this.y = screenY - worldY * this.scale;

        this.updateTransform();
    }

    /**
     * Convert screen coordinates to world coordinates
     */
    screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
        return {
            x: (screenX - this.x) / this.scale,
            y: (screenY - this.y) / this.scale,
        };
    }

    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
        return {
            x: worldX * this.scale + this.x,
            y: worldY * this.scale + this.y,
        };
    }

    /**
     * Get current camera position
     */
    getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    /**
     * Get current camera scale
     */
    getScale(): number {
        return this.scale;
    }

    /**
     * Update the stage transform based on camera state
     */
    private updateTransform(): void {
        this.stage.position.set(this.x, this.y);
        this.stage.scale.set(this.scale);
    }
}
