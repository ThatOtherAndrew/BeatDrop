import type Cursor from './Cursor';
import type App from '../App';

export default class CursorManager {
    private cursors: Cursor[];
    private activeIndex: number = 0;

    constructor(
        private readonly app: App,
        cursors: (new (app: App) => Cursor)[],
    ) {
        if (cursors.length === 0) {
            throw new Error('CursorManager requires at least one cursor');
        }

        this.cursors = cursors.map((CursorClass) => new CursorClass(this.app));
        app.graphics.stage.addChild(this.getActive().graphics);
        this.getActive().onActivate?.();
    }

    /**
     * Get the currently active cursor
     */
    getActive(): Cursor {
        return this.cursors[this.activeIndex];
    }

    /**
     * Switch to the next cursor
     */
    next(): void {
        this.switchTo((this.activeIndex + 1) % this.cursors.length);
    }

    /**
     * Switch to the previous cursor
     */
    previous(): void {
        this.switchTo(
            (this.activeIndex - 1 + this.cursors.length) % this.cursors.length,
        );
    }

    /**
     * Switch to a specific cursor by index
     */
    switchTo(index: number): void {
        if (index < 0 || index >= this.cursors.length) {
            throw new Error(`Invalid cursor index: ${index}`);
        }

        if (index === this.activeIndex) {
            return;
        }

        // Remove old cursor
        const oldCursor = this.cursors[this.activeIndex];
        this.app.graphics.stage.removeChild(oldCursor.graphics);

        // Add new cursor
        this.activeIndex = index;
        const newCursor = this.cursors[this.activeIndex];
        this.app.graphics.stage.addChild(newCursor.graphics);

        // Trigger activation callback
        newCursor.onActivate?.();
    }

    /**
     * Update the active cursor position
     */
    updatePosition(worldX: number, worldY: number): void {
        this.getActive().updatePosition(worldX, worldY);
    }
}
