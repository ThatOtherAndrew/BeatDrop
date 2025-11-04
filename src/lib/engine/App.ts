import { Application, Graphics } from 'pixi.js';
import Simulation from './Simulation';
import Scene from './Scene';

export default class App {
    private mouseX: number = 0;
    private mouseY: number = 0;

    // temp
    circle = new Graphics()
        .circle(this.mouseX, this.mouseY, 10)
        .fill({ color: 0xffffff, alpha: 0.5 });

    private constructor(
        private readonly simulation: Simulation,
        readonly graphics: Application,
        private scene: Scene,
    ) {}

    static async init(container: HTMLElement): Promise<App> {
        const graphics = new Application();
        const scene = new Scene();
        const simulation = await Simulation.init(graphics, scene);
        const app = new App(simulation, graphics, scene);

        await app.graphics.init({ background: 'black', resizeTo: container });
        app.graphics.stage.addChild(app.circle);
        container.appendChild(app.graphics.canvas);

        return app;
    }

    run() {
        this.graphics.canvas.addEventListener('mousemove', (e) => {
            const rect = this.graphics.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.graphics.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.scene.entities.push({
                    type: 'ball',
                    position: { x: this.mouseX, y: this.mouseY },
                    radius: 10,
                });
                this.simulation.loadScene(this.scene);
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
}
