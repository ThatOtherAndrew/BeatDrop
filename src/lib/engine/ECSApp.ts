import { Application, Graphics } from 'pixi.js';
import Simulation from './Simulation';
import Scene from './Scene';

export default class ECSApp {
    private mouseX: number = 0;
    private mouseY: number = 0;

    // temp
    circle = new Graphics()
        .circle(this.mouseX, this.mouseY, 25)
        .fill({ color: 0xffffff, alpha: 0.5 });

    private constructor(
        private readonly simulation: Simulation,
        private readonly graphics: Application,
        private scene: Scene,
    ) {}

    static async init(container: HTMLElement): Promise<ECSApp> {
        const graphics = new Application();
        const scene = new Scene();
        const simulation = await Simulation.init(graphics, scene);
        const app = new ECSApp(simulation, graphics, scene);

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
                    radius: 25,
                });
                this.simulation.loadScene(this.scene);
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                console.log('tick');
                this.simulation.tick();
            }
        });

        this.graphics.ticker.add(() => {
            this.circle.position.set(this.mouseX, this.mouseY);
        });
    }
}
