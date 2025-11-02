import { Application } from 'pixi.js';
import Simulation from './Simulation';

export default class ECSApp {
    readonly graphics: Application;

    private constructor(readonly simulation: Simulation) {
        this.graphics = new Application();
    }

    static async init(container: HTMLElement): Promise<ECSApp> {
        const simulation = await Simulation.init();
        const app = new ECSApp(simulation);

        await app.graphics.init({ background: 'black', resizeTo: container });
        container.appendChild(app.graphics.canvas);

        return app;
    }
}
