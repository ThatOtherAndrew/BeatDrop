import type App from '../App';
import Block from './Block';
import Rectangle from './Rectangle';

export default class BlockCursor extends Rectangle {
    private mouseMoveHandler: (e: MouseEvent) => void;
    private mouseClickHandler: (e: MouseEvent) => void;
    private wheelHandler: (e: WheelEvent) => void;
    private rotation = 0;
    private pitch = 60; // MIDI note (C4)
    private scrollAccumulator = 0;

    constructor(app: App, width: number, height: number, colour: number) {
        super(app, app.mouseX, app.mouseY, width, height, colour);

        this.graphics.alpha = 0.5;
        this.updateColor();

        this.mouseMoveHandler = () => {
            this.x = this.app.mouseX;
            this.y = this.app.mouseY;
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
                    this.pitch,
                );
                this.app.addSprite(block);
            }
        };

        this.wheelHandler = (e: WheelEvent) => {
            e.preventDefault();
            this.scrollAccumulator += e.deltaY;

            const threshold = 250;

            if (e.shiftKey) {
                // Shift+scroll: change rotation
                const rotationIncrement = (5 * Math.PI) / 180;

                while (Math.abs(this.scrollAccumulator) >= threshold) {
                    if (this.scrollAccumulator > 0) {
                        this.rotation += rotationIncrement;
                        this.scrollAccumulator -= threshold;
                    } else {
                        this.rotation -= rotationIncrement;
                        this.scrollAccumulator += threshold;
                    }
                }

                this.graphics.rotation = this.rotation;
            } else {
                // Regular scroll: change pitch
                const pitchIncrement = 1; // 1 semitone
                const oldPitch = this.pitch;

                while (Math.abs(this.scrollAccumulator) >= threshold) {
                    if (this.scrollAccumulator > 0) {
                        this.pitch = Math.min(127, this.pitch + pitchIncrement);
                        this.scrollAccumulator -= threshold;
                    } else {
                        this.pitch = Math.max(0, this.pitch - pitchIncrement);
                        this.scrollAccumulator += threshold;
                    }
                }

                // Only update color/play sound if pitch actually changed
                if (oldPitch !== this.pitch) {
                    this.updateColor();
                }
            }
        };
    }

    private updateColor(): void {
        // Map pitch (0-127) to hue (0-360)
        const hue = (this.pitch / 127) * 360;
        // Convert HSL to RGB
        const rgb = this.hslToRgb(hue, 0.8, 0.5);
        this.colour = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];

        // Redraw the rectangle with new color
        this.graphics.clear();
        this.graphics
            .rect(-this.width / 2, -this.height / 2, this.width, this.height)
            .fill({ color: this.colour });
        this.graphics.alpha = 0.5;
        this.graphics.rotation = this.rotation;

        // Play preview note (if soundFont is initialized)
        if (this.app.soundFont) {
            this.app.soundFont.resume();
            this.app.soundFont.playNote(this.pitch, 100, 0.15);
        }
    }

    private hslToRgb(h: number, s: number, l: number): [number, number, number] {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;

        let r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; }
        else if (h < 120) { r = x; g = c; }
        else if (h < 180) { g = c; b = x; }
        else if (h < 240) { g = x; b = c; }
        else if (h < 300) { r = x; b = c; }
        else { r = c; b = x; }

        return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255)
        ];
    }

    update(): void {
        super.update();
        this.graphics.rotation = this.rotation;
    }

    spawn(): void {
        super.spawn();
        this.x = this.app.mouseX;
        this.y = this.app.mouseY;
        const canvas = this.app.canvas;
        canvas.addEventListener('mousemove', this.mouseMoveHandler);
        canvas.addEventListener('mousedown', this.mouseClickHandler);
        canvas.addEventListener('wheel', this.wheelHandler, { passive: false });

        // Play preview of current pitch when switching to this cursor
        if (this.app.soundFont) {
            this.app.soundFont.resume();
            this.app.soundFont.playNote(this.pitch, 100, 0.15);
        }
    }

    destroy(): void {
        const canvas = this.app.canvas;
        canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        canvas.removeEventListener('mousedown', this.mouseClickHandler);
        canvas.removeEventListener('wheel', this.wheelHandler, { passive: false } as any);
        super.destroy();
    }
}
