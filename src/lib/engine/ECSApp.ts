import { Application, Graphics } from 'pixi.js';
import Simulation from './Simulation';

export default class ECSApp {
    readonly graphics: Application;

    mouseX: number = 0;
    mouseY: number = 0;

    // temp
    circle = new Graphics()
        .circle(0, 0, 10)
        .fill({ color: 0xffffff, alpha: 0.5 });

    private constructor(readonly simulation: Simulation) {
        this.graphics = new Application();
    }

    static async init(container: HTMLElement): Promise<ECSApp> {
        const simulation = await Simulation.init();
        const app = new ECSApp(simulation);

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
                this.simulation.world.add({
                    position: { x: this.mouseX, y: this.mouseY },
                    graphics: this.circle.clone().fill({ alpha: 1 }),
                    rigidBody: null /* TODO */;
                });
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
