import DEFAULT_SCENE from '$lib/assets/default_scene.json';
import { Application } from 'pixi.js';
import type { AudioEngine } from './audio/AudioEngine';
import SoundFontPlayer from './audio/SoundFontPlayer';
import Camera from './canvas/Camera';
import BallCursor from './cursor/BallCursor';
import BlockCursor from './cursor/BlockCursor';
import CursorManager from './cursor/CursorManager';
import InputManager from './input/InputManager';
import Simulation from './physics/Simulation';
import Scene from './Scene';

export default class App {
    readonly camera: Camera;
    readonly cursor: CursorManager;
    private input!: InputManager;

    private constructor(
        public readonly simulation: Simulation,
        public readonly graphics: Application,
        public readonly audio: AudioEngine,
        public scene: Scene,
    ) {
        this.tickSimulation = this.tickSimulation.bind(this);

        this.camera = new Camera(this.graphics.stage);
        this.cursor = new CursorManager(this, [BallCursor, BlockCursor]);
    }

    static async init(
        container: HTMLElement,
        devMode: boolean = false,
    ): Promise<App> {
        const graphics = new Application();
        const scene = Scene.load(DEFAULT_SCENE);
        const audio = new SoundFontPlayer();
        const simulation = await Simulation.init(graphics, audio, scene);
        const app = new App(simulation, graphics, audio, scene);

        // Initialise graphics
        await app.graphics.init({
            background: 'black',
            resizeTo: container,
            preference: 'webgpu',
        });
        app.graphics.ticker.minFPS = 60;
        app.graphics.ticker.maxFPS = 60;
        container.appendChild(app.graphics.canvas);
        if (devMode) {
            const { initDevtools } = await import('@pixi/devtools');
            initDevtools({ app: app.graphics });
        }

        // Setup input and cursor UI
        app.input = new InputManager(app);
        app.graphics.ticker.add(() => {
            const { x, y } = app.input.getMouseCoords();
            app.cursor.updatePosition(x, y);
        });

        // Load audio
        await app.audio.load('marimba');

        return app;
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
