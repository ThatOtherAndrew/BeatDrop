import { Application, Graphics } from 'pixi.js';
import type { AudioEngine } from './audio/AudioEngine';
import SoundFontPlayer from './audio/SoundFontPlayer';
import Camera from './Camera';
import Scene from './Scene';
import Simulation from './Simulation';
import FileManager from './utils/FileManager';

export default class App {
    private mouseX: number = 0;
    private mouseY: number = 0;
    private isDragging: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private hasDragged: boolean = false;
    private camera: Camera;
    readonly audioEngine: AudioEngine;

    // temp
    circle = new Graphics()
        .circle(this.mouseX, this.mouseY, 10)
        .fill({ color: 0xffffff, alpha: 0.5 });

    private constructor(
        private readonly simulation: Simulation,
        private readonly graphics: Application,
        private scene: Scene,
    ) {
        this.tickSimulation = this.tickSimulation.bind(this);
        this.camera = new Camera(this.graphics.stage);
        this.audioEngine = new SoundFontPlayer();
    }

    static async init(
        container: HTMLElement,
        devMode: boolean = false,
    ): Promise<App> {
        const graphics = new Application();
        const scene = new Scene();
        const simulation = await Simulation.init(graphics, scene);
        const app = new App(simulation, graphics, scene);

        await app.graphics.init({ background: 'black', resizeTo: container });
        app.graphics.stage.addChild(app.circle);
        container.appendChild(app.graphics.canvas);

        await app.audioEngine.load('marimba');

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

                const { x: screenX, y: screenY } = this.getScreenCoords(e);
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

                this.camera.zoom(screenX, screenY, zoomFactor);
            },
            { passive: false },
        );

        this.graphics.canvas.addEventListener('mousedown', (e) => {
            const { x: screenX, y: screenY } = this.getScreenCoords(e);

            if (e.button === 0) {
                this.isDragging = true;
                this.hasDragged = false;
                this.dragStartX = screenX;
                this.dragStartY = screenY;
            }
        });

        this.graphics.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                if (!this.hasDragged) {
                    this.scene.entities.push({
                        type: 'ball',
                        position: { x: this.mouseX, y: this.mouseY },
                        radius: 10,
                    });
                    this.simulation.loadScene(
                        this.scene,
                        this.simulation.currentTick,
                    );
                }
                this.isDragging = false;
            }
        });

        window.addEventListener('keydown', (e) => {
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
            }

            if (e.key === 'ArrowRight') {
                this.simulation.tick();
                return;
            }

            if (e.key === ' ') {
                for (let i = 0; i < 10; i++) {
                    this.simulation.tick();
                }
                return;
            }
        });

        this.graphics.ticker.add(() => {
            this.circle.position.set(this.mouseX, this.mouseY);
        });
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
