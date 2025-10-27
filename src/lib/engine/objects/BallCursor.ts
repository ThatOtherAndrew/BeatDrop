import type App from '../App';
import Ball from './Ball';
import Circle from './Circle';

export default class BallCursor extends Circle {
    private mouseMoveHandler: (e: MouseEvent) => void;
    private mouseClickHandler: (e: MouseEvent) => void;

    constructor(app: App, radius: number, colour: number) {
        super(app, 0, 0, radius, colour);

        this.mouseMoveHandler = (e: MouseEvent) => {
            const rect = this.app.canvas.getBoundingClientRect();
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
        };

        this.mouseClickHandler = (e: MouseEvent) => {
            if (e.button === 0) { // Left click
                const ball = new Ball(this.app, this.x, this.y, this.radius, this.colour);
                this.app.addSprite(ball);
            }
        };
    }

    spawn(): void {
        super.spawn();
        this.graphics.alpha = 0.5;
        this.app.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        this.app.canvas.addEventListener('mousedown', this.mouseClickHandler);
    }

    destroy(): void {
        this.app.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.app.canvas.removeEventListener('mousedown', this.mouseClickHandler);
        super.destroy();
    }
}
