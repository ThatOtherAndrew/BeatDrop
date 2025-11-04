import { Application, Graphics } from 'pixi.js';
import Simulation from './Simulation';
import Scene from './Scene';

export default class App {
    private mouseX: number = 0;
    private mouseY: number = 0;
    private isDragging: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private cameraX: number = 0;
    private cameraY: number = 0;
    private hasDragged: boolean = false;

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

        if (devMode) {
            const { initDevtools } = await import('@pixi/devtools');
            initDevtools({ app: app.graphics });
        }

        app.registerEvents();

        return app;
    }

    private registerEvents() {
        this.graphics.canvas.addEventListener('mousemove', (e) => {
            const rect = this.graphics.canvas.getBoundingClientRect();
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;

            // Convert screen coords to world coords
            this.mouseX = screenX - this.cameraX;
            this.mouseY = screenY - this.cameraY;

            if (this.isDragging) {
                // Camera pan
                const deltaX = screenX - this.dragStartX;
                const deltaY = screenY - this.dragStartY;

                if (deltaX !== 0 || deltaY !== 0) {
                    this.hasDragged = true;
                    this.cameraX += deltaX;
                    this.cameraY += deltaY;

                    this.graphics.stage.position.set(
                        this.cameraX,
                        this.cameraY,
                    );

                    this.dragStartX = screenX;
                    this.dragStartY = screenY;
                }
            }
        });

        this.graphics.canvas.addEventListener('mousedown', (e) => {
            const rect = this.graphics.canvas.getBoundingClientRect();
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;

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
                const blob = new Blob([this.scene.save()], {
                    type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'scene.json';
                a.click();
                return;
            }

            if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/json';
                input.onchange = (event: any) => {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = e.target?.result as string;
                        this.scene = Scene.load(content);
                        this.simulation.loadScene(this.scene);
                    };
                    reader.readAsText(file);
                };
                input.click();
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
