import { Application } from 'pixi.js';
import type { AudioEngine } from './audio/AudioEngine';
import SoundFontPlayer from './audio/SoundFontPlayer';
import Camera from './canvas/Camera';
import BallCursor from './cursor/BallCursor';
import BlockCursor from './cursor/BlockCursor';
import CursorManager from './cursor/CursorManager';
import Scene from './Scene';
import Simulation from './physics/Simulation';
import FileManager from './utils/FileManager';

export default class App {
    private mouseX: number = 0;
    private mouseY: number = 0;
    private isDragging: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private hasDragged: boolean = false;

    private camera: Camera;
    private cursor: CursorManager;

    private constructor(
        public readonly simulation: Simulation,
        public readonly graphics: Application,
        public readonly audio: AudioEngine,
        public scene: Scene,
    ) {
        this.camera = new Camera(this.graphics.stage);
        this.cursor = new CursorManager(this, [BallCursor, BlockCursor]);

        this.tickSimulation = this.tickSimulation.bind(this);
    }

    static async init(
        container: HTMLElement,
        devMode: boolean = false,
    ): Promise<App> {
        const graphics = new Application();
        const scene = new Scene();
        const audio = new SoundFontPlayer();
        const simulation = await Simulation.init(graphics, audio, scene);
        const app = new App(simulation, graphics, audio, scene);

        await app.graphics.init({ background: 'black', resizeTo: container });
        container.appendChild(app.graphics.canvas);

        await app.audio.load('marimba');

        if (devMode) {
            const { initDevtools } = await import('@pixi/devtools');
            initDevtools({ app: app.graphics });
        }

        app.registerEvents();

        return app;
    }

    private registerEvents() {
        this.graphics.canvas.addEventListener('mousemove', (e) => {
            const { x: screenX, y: screenY } = this.getScreenCoords(e);

            // Convert screen coords to world coords
            const worldPos = this.camera.screenToWorld(screenX, screenY);
            this.mouseX = worldPos.x;
            this.mouseY = worldPos.y;

            if (this.isDragging) {
                // Camera pan
                const deltaX = screenX - this.dragStartX;
                const deltaY = screenY - this.dragStartY;

                if (deltaX !== 0 || deltaY !== 0) {
                    this.hasDragged = true;
                    this.camera.pan(deltaX, deltaY);

                    this.dragStartX = screenX;
                    this.dragStartY = screenY;
                }
            }
        });

        this.graphics.canvas.addEventListener(
            'wheel',
            (e) => {
                e.preventDefault();

                if (e.ctrlKey || e.shiftKey || e.altKey) {
                    this.cursor.getActive().handleWheel?.(e);
                } else {
                    const { x, y } = this.getScreenCoords(e);
                    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                    this.camera.zoom(x, y, zoomFactor);
                }
            },
            { passive: false },
        );

        this.graphics.canvas.addEventListener('mousedown', (e) => {
            const { x, y } = this.getScreenCoords(e);

            if (e.button === 0) {
                this.isDragging = true;
                this.hasDragged = false;
                this.dragStartX = x;
                this.dragStartY = y;
            }
        });

        this.graphics.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                if (!this.hasDragged) {
                    this.cursor.getActive().handleClick(e);
                }
                this.isDragging = false;
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.cursor.previous();
                return;
            }

            if (e.key === 'ArrowRight') {
                this.cursor.next();
                return;
            }

            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                FileManager.saveScene(this.scene);
                return;
            }

            if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                FileManager.loadScene(Scene).then((scene) => {
                    this.scene = scene;
                    this.simulation.loadScene(this.scene);
                });
                return;
            }

            if (e.ctrlKey && e.key === 'z') {
                this.scene.entities.pop();
                this.simulation.loadScene(this.scene);
                return;
            }
        });

        this.graphics.ticker.add(() => {
            this.cursor.updatePosition(this.mouseX, this.mouseY);
        });
    }

    public getMouseCoords(): { x: number; y: number } {
        return { x: this.mouseX, y: this.mouseY };
    }

    private getScreenCoords(e: MouseEvent): { x: number; y: number } {
        const rect = this.graphics.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    private tickSimulation() {
        this.simulation.tick();
    }

    play() {
        this.graphics.ticker.add(this.tickSimulation);
    }

    pause() {
        this.graphics.ticker.remove(this.tickSimulation);
    }

    stop() {
        this.simulation.loadScene(this.scene);
    }
}
