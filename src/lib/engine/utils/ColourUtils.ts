/**
 * Convert MIDI pitch (0-127) to a hex colour value
 * Maps pitch to hue (0-360) for visual representation
 */
export function pitchToColour(pitch: number): number {
    const hue = (pitch / 127) * 360;
    const [r, g, b] = hslToRgb(hue, 0.8, 0.5);
    return (r << 16) | (g << 8) | b;
}

/**
 * Convert HSL colour values to RGB
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
        g = 0,
        b = 0;
    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255),
    ];
}
