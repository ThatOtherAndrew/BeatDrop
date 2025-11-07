import type App from '../App';
import Scene from '../Scene';
import FileManager from '../utils/FileManager';

export default class InputManager {
    private mouseX: number = 0;
    private mouseY: number = 0;
    private isDragging: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private hasDragged: boolean = false;

    // Touchscreen support
    private initialPinchDistance: number | null = null;
    private lastTouchX: number = 0;
    private lastTouchY: number = 0;

    constructor(private readonly app: App) {
        this.registerEvents();
    }

    private registerEvents(): void {
        this.app.graphics.canvas.addEventListener('mousemove', (e) => {
            const { x: screenX, y: screenY } = this.getScreenCoords(e);

            // Convert screen coords to world coords
            const worldPos = this.app.camera.screenToWorld(screenX, screenY);
            this.mouseX = worldPos.x;
            this.mouseY = worldPos.y;

            if (this.isDragging) {
                const deltaX = screenX - this.dragStartX;
                const deltaY = screenY - this.dragStartY;

                if (deltaX !== 0 || deltaY !== 0) {
                    this.hasDragged = true;
                    this.app.camera.pan(deltaX, deltaY);

                    this.dragStartX = screenX;
                    this.dragStartY = screenY;
                }
            }
        });

        this.app.graphics.canvas.addEventListener(
            'wheel',
            (e) => {
                e.preventDefault();

                if (e.ctrlKey || e.shiftKey || e.altKey) {
                    this.app.cursor.getActive().handleWheel?.(e);
                } else {
                    const { x, y } = this.getScreenCoords(e);
                    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                    this.app.camera.zoom(x, y, zoomFactor);
                }
            },
            { passive: false },
        );

        this.app.graphics.canvas.addEventListener('mousedown', (e) => {
            const { x, y } = this.getScreenCoords(e);

            if (e.button === 0) {
                this.isDragging = true;
                this.hasDragged = false;
                this.dragStartX = x;
                this.dragStartY = y;
            }
        });

        this.app.graphics.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                if (!this.hasDragged) {
                    this.app.cursor.getActive().handleClick(e);
                }
                this.isDragging = false;
            }
        });

        window.addEventListener('keydown', (e) => {
            // Cursor switching
            if (e.key === 'ArrowLeft') {
                this.app.cursor.previous();
                return;
            }

            if (e.key === 'ArrowRight') {
                this.app.cursor.next();
                return;
            }

            // File operations
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                FileManager.saveScene(this.app.scene);
                return;
            }

            if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                FileManager.loadSceneFile().then((scene) => {
                    this.app.scene = scene;
                    this.app.simulation.loadScene(scene);
                });
                return;
            }

            if (e.ctrlKey && e.key === 'z') {
                this.app.scene.entities.pop();
                this.app.simulation.loadScene(this.app.scene);
                return;
            }
        });

        this.app.graphics.canvas.addEventListener(
            'touchstart',
            (e) => {
                e.preventDefault();

                if (e.touches.length === 1) {
                    // Single touch: start drag
                    const touch = e.touches[0];
                    const { x, y } = this.getTouchCoords(touch);

                    this.isDragging = true;
                    this.hasDragged = false;
                    this.dragStartX = x;
                    this.dragStartY = y;
                    this.lastTouchX = x;
                    this.lastTouchY = y;

                    // Update cursor position
                    const worldPos = this.app.camera.screenToWorld(x, y);
                    this.mouseX = worldPos.x;
                    this.mouseY = worldPos.y;
                } else if (e.touches.length === 2) {
                    // Two touches: prepare for pinch zoom
                    this.isDragging = false;
                    this.initialPinchDistance = this.getTouchDistance(
                        e.touches[0],
                        e.touches[1],
                    );
                }
            },
            { passive: false },
        );

        this.app.graphics.canvas.addEventListener(
            'touchmove',
            (e) => {
                e.preventDefault();

                if (e.touches.length === 1 && this.isDragging) {
                    // Single touch: pan
                    const touch = e.touches[0];
                    const { x, y } = this.getTouchCoords(touch);

                    const deltaX = x - this.lastTouchX;
                    const deltaY = y - this.lastTouchY;

                    if (deltaX !== 0 || deltaY !== 0) {
                        this.hasDragged = true;
                        this.app.camera.pan(deltaX, deltaY);
                    }

                    this.lastTouchX = x;
                    this.lastTouchY = y;

                    // Update cursor position
                    const worldPos = this.app.camera.screenToWorld(x, y);
                    this.mouseX = worldPos.x;
                    this.mouseY = worldPos.y;
                } else if (
                    e.touches.length === 2 &&
                    this.initialPinchDistance
                ) {
                    // Two touches: pinch zoom
                    const currentDistance = this.getTouchDistance(
                        e.touches[0],
                        e.touches[1],
                    );
                    const zoomFactor =
                        currentDistance / this.initialPinchDistance;

                    // Get center point between touches
                    const { x: x1, y: y1 } = this.getTouchCoords(e.touches[0]);
                    const { x: x2, y: y2 } = this.getTouchCoords(e.touches[1]);
                    const centerX = (x1 + x2) / 2;
                    const centerY = (y1 + y2) / 2;

                    this.app.camera.zoom(centerX, centerY, zoomFactor);
                    this.initialPinchDistance = currentDistance;
                }
            },
            { passive: false },
        );

        this.app.graphics.canvas.addEventListener(
            'touchend',
            (e) => {
                e.preventDefault();

                if (e.touches.length === 0) {
                    // All touches released
                    if (this.isDragging && !this.hasDragged) {
                        // Tap without drag: spawn entity
                        const mockEvent = new MouseEvent('mouseup', {
                            clientX: this.lastTouchX,
                            clientY: this.lastTouchY,
                        });
                        this.app.cursor.getActive().handleClick(mockEvent);
                    }

                    this.isDragging = false;
                    this.initialPinchDistance = null;
                } else if (e.touches.length === 1) {
                    // One touch remaining: reset to single-touch mode
                    const touch = e.touches[0];
                    const { x, y } = this.getTouchCoords(touch);
                    this.lastTouchX = x;
                    this.lastTouchY = y;
                    this.initialPinchDistance = null;
                }
            },
            { passive: false },
        );

        this.app.graphics.canvas.addEventListener(
            'touchcancel',
            (e) => {
                e.preventDefault();
                this.isDragging = false;
                this.initialPinchDistance = null;
            },
            { passive: false },
        );
    }

    getMouseCoords(): { x: number; y: number } {
        return { x: this.mouseX, y: this.mouseY };
    }

    private getScreenCoords(e: MouseEvent): { x: number; y: number } {
        const rect = this.app.graphics.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    private getTouchCoords(touch: Touch): { x: number; y: number } {
        const rect = this.app.graphics.canvas.getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    }

    private getTouchDistance(touch1: Touch, touch2: Touch): number {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
