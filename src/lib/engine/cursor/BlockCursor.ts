import { Graphics } from 'pixi.js';
import type App from '../App';
import { pitchToColour } from '../utils/ColourUtils';
import Cursor from './Cursor';

const WIDTH = 100;
const HEIGHT = 20;
const SCROLL_THRESHOLD = 250;
const ROTATION_INCREMENT = (5 * Math.PI) / 180; // 5 degrees

export default class BlockCursor extends Cursor {
    private rotation = 0;
    private pitch = 60; // MIDI note C4
    private scrollAccumulator = 0;

    constructor(app: App) {
        const colour = pitchToColour(60);
        const graphics = new Graphics()
            .rect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT)
            .fill({ color: colour });

        super(app, graphics);
    }

    handleClick(_e: MouseEvent): void {
        this.app.scene.entities.push({
            type: 'block',
            position: { x: this.worldX, y: this.worldY },
            width: WIDTH,
            height: HEIGHT,
            rotation: this.rotation,
            pitch: this.pitch,
        });

        this.app.simulation.loadScene(
            this.app.scene,
            this.app.simulation.currentTick,
        );
    }

    handleWheel(e: WheelEvent): void {
        this.scrollAccumulator += e.deltaY;

        if (e.shiftKey) {
            while (Math.abs(this.scrollAccumulator) >= SCROLL_THRESHOLD) {
                if (this.scrollAccumulator > 0) {
                    this.rotation += ROTATION_INCREMENT;
                    this.scrollAccumulator -= SCROLL_THRESHOLD;
                } else {
                    this.rotation -= ROTATION_INCREMENT;
                    this.scrollAccumulator += SCROLL_THRESHOLD;
                }
            }

            this.graphics.rotation = this.rotation;
        } else if (e.ctrlKey) {
            const oldPitch = this.pitch;

            while (Math.abs(this.scrollAccumulator) >= SCROLL_THRESHOLD) {
                if (this.scrollAccumulator > 0) {
                    this.pitch = Math.min(127, this.pitch + 1);
                    this.scrollAccumulator -= SCROLL_THRESHOLD;
                } else {
                    this.pitch = Math.max(0, this.pitch - 1);
                    this.scrollAccumulator += SCROLL_THRESHOLD;
                }
            }

            if (oldPitch !== this.pitch) {
                this.updateColour();
                this.playPreviewSound();
            }
        }
    }

    onActivate(): void {
        this.playPreviewSound();
    }

    private updateColour(): void {
        const colour = pitchToColour(this.pitch);

        this.graphics.clear();
        this.graphics
            .rect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT)
            .fill({ color: colour });
        this.graphics.alpha = 0.5;
        this.graphics.rotation = this.rotation;
    }

    private playPreviewSound(): void {
        this.app.audio.playNote(this.pitch, 100, 0.15);
    }
}
