import Soundfont from 'soundfont-player';
import type { AudioEngine } from './AudioEngine';

export default class SoundFontPlayer implements AudioEngine {
    private readonly defaultInstrument = 'marimba';

    private audioContext: AudioContext;
    private player: Soundfont.Player | null = null;

    constructor() {
        this.audioContext = new AudioContext();
        this.load(this.defaultInstrument)
            .then(() => console.log('SoundFont loaded'))
            .catch((err) => console.error('Failed to load SoundFont:', err));
    }

    async load(instrument: Soundfont.InstrumentName): Promise<void> {
        // Load instrument from soundfont-player's CDN
        this.player = await Soundfont.instrument(
            this.audioContext,
            instrument,
            {
                soundfont: 'MusyngKite',
                format: 'mp3',
                gain: 1.0,
            },
        );
    }

    playNote(
        note: number,
        velocity: number = 127,
        duration: number = 0.3,
    ): void {
        if (!this.player) {
            console.warn('SoundFont not loaded');
            return;
        }

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.player.play(
            this.midiToNoteName(note),
            this.audioContext.currentTime,
            {
                duration: duration,
                gain: velocity / 127,
            },
        );
    }

    /**
     * Convert MIDI note number (0-127) to note name (e.g., 60 -> "C4")
     */
    private midiToNoteName(midi: number): string {
        const noteNames = [
            'C',
            'C#',
            'D',
            'D#',
            'E',
            'F',
            'F#',
            'G',
            'G#',
            'A',
            'A#',
            'B',
        ];
        const octave = Math.floor(midi / 12) - 1;
        const note = noteNames[midi % 12];
        return `${note}${octave}`;
    }
}
