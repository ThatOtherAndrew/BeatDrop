import type App from '../App';
import Ball from './Ball';
import Rectangle from './Rectangle';

export default class BlockCursor extends Rectangle {
    private mouseMoveHandler: (e: MouseEvent) => void;
    private mouseClickHandler: (e: MouseEvent) => void;

    constructor(app: App, width: number, height: number, colour: number) {
        super(app, app.mouseX, app.mouseY, width, height, colour);

        this.graphics.alpha = 0.5;

        this.mouseMoveHandler = () => {
            this.x = this.app.mouseX;
            this.y = this.app.mouseY;
        };

        this.mouseClickHandler = (e: MouseEvent) => {
            if (e.button === 0) {
                const ball = new Ball(
                    this.app,
                    this.x,
                    this.y,
                    10,
                    this.colour,
                );
                this.app.addSprite(ball);
            }
        };
    }

    spawn(): void {
        super.spawn();
        this.x = this.app.mouseX;
        this.y = this.app.mouseY;
        const canvas = this.app.canvas;
        canvas.addEventListener('mousemove', this.mouseMoveHandler);
        canvas.addEventListener('mousedown', this.mouseClickHandler);
    }

    destroy(): void {
        const canvas = this.app.canvas;
        canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        canvas.removeEventListener('mousedown', this.mouseClickHandler);
        super.destroy();
    }
}
