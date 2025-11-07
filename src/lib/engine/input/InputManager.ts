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
}
