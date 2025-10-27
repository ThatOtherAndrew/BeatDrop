import type App from '../App';
import Block from './Block';
import Rectangle from './Rectangle';

export default class BlockCursor extends Rectangle {
    private mouseMoveHandler: (e: MouseEvent) => void;
    private mouseClickHandler: (e: MouseEvent) => void;
    private wheelHandler: (e: WheelEvent) => void;
    private rotation = 0;
    private scrollAccumulator = 0;

    constructor(app: App, width: number, height: number, colour: number) {
        super(app, app.mouseX, app.mouseY, width, height, colour);

        this.graphics.alpha = 0.5;

        this.mouseMoveHandler = () => {
            this.x = this.app.mouseX;
            this.y = this.app.mouseY;
            this.graphics.rotation = this.rotation;
        };

        this.mouseClickHandler = (e: MouseEvent) => {
            if (e.button === 0) {
                const block = new Block(
                    this.app,
                    this.x,
                    this.y,
                    this.width,
                    this.height,
                    this.colour,
                    this.rotation,
                );
                this.app.addSprite(block);
            }
        };

        this.wheelHandler = (e: WheelEvent) => {
            e.preventDefault();
            this.scrollAccumulator += e.deltaY;

            const threshold = 250;
            const increment = (5 * Math.PI) / 180;

            while (Math.abs(this.scrollAccumulator) >= threshold) {
                if (this.scrollAccumulator > 0) {
                    this.rotation += increment;
                    this.scrollAccumulator -= threshold;
                } else {
                    this.rotation -= increment;
                    this.scrollAccumulator += threshold;
                }
            }

            this.graphics.rotation = this.rotation;
        };
    }

    spawn(): void {
        super.spawn();
        this.x = this.app.mouseX;
        this.y = this.app.mouseY;
        const canvas = this.app.canvas;
        canvas.addEventListener('mousemove', this.mouseMoveHandler);
        canvas.addEventListener('mousedown', this.mouseClickHandler);
        canvas.addEventListener('wheel', this.wheelHandler, { passive: false });
    }

    destroy(): void {
        const canvas = this.app.canvas;
        canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        canvas.removeEventListener('mousedown', this.mouseClickHandler);
        canvas.removeEventListener('wheel', this.wheelHandler, { passive: false } as any);
        super.destroy();
    }
}
