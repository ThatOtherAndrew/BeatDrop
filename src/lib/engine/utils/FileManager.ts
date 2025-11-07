import Scene from '../Scene';

export default class FileManager {
    /**
     * Save a scene to a JSON file download
     */
    static saveScene(scene: Scene, filename: string = 'scene.json'): void {
        const blob = new Blob([scene.save()], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Load a scene from a file dialog
     * Returns a Promise that resolves with the loaded Scene
     */
    static loadSceneFile(): Promise<Scene> {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';

            input.onchange = (event: Event) => {
                const target = event.target as HTMLInputElement;
                const file = target.files?.[0];

                if (!file) {
                    reject(new Error('No file selected'));
                    return;
                }

                const reader = new FileReader();

                reader.onload = (e) => {
                    try {
                        const content = JSON.parse(e.target?.result as string);
                        const scene = Scene.load(content);
                        resolve(scene);
                    } catch (error) {
                        reject(error);
                    }
                };

                reader.onerror = () => {
                    reject(new Error('Failed to read file'));
                };

                reader.readAsText(file);
            };

            input.click();
        });
    }
}
