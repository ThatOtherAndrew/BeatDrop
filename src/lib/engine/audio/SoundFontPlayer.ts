import Soundfont from 'soundfont-player';

export default class SoundFontPlayer {
    private audioContext: AudioContext;
    private instrument: any = null;

    constructor() {
        this.audioContext = new AudioContext();
    }

    async load(instrumentName: string = 'acoustic_grand_piano'): Promise<void> {
        // Load instrument from soundfont-player's CDN
        this.instrument = await Soundfont.instrument(this.audioContext, instrumentName, {
            soundfont: 'MusyngKite',
            format: 'mp3',
            gain: 1.0
        });

        console.log('SoundFont instrument loaded:', instrumentName);
    }

    /**
     * Play a note from the soundfont
     * @param note MIDI note number (0-127)
     * @param velocity Note velocity (0-127)
     * @param duration Duration in seconds
     */
    playNote(note: number, velocity: number = 100, duration: number = 0.3): void {
        if (!this.instrument) {
            console.warn('SoundFont not loaded');
            return;
        }

        // Resume audio context if needed
        this.resume();

        // Play the note with velocity and duration
        const gain = velocity / 127;
        this.instrument.play(note, this.audioContext.currentTime, {
            duration: duration,
            gain: gain
        });
    }

    resume(): void {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}
