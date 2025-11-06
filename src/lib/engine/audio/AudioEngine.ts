export interface AudioEngine {
    /**
     * Load an instrument preset
     * @param instrument Instrument name
     */
    load(instrument: string): Promise<void>;

    /**
     * Play a note
     * @param note MIDI note number (0-127)
     * @param velocity Note velocity (0-127)
     * @param duration Duration in seconds
     */
    playNote(note: number, velocity?: number, duration?: number): void;
}
