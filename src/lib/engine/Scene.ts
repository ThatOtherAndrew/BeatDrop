export type Ball = {
    type: 'ball';
    position: { x: number; y: number };
    radius: number;
};

export type Block = {
    type: 'block';
    position: { x: number; y: number };
    width: number;
    height: number;
    rotation: number;
    pitch: number;
};

type Entity = Ball | Block;

export default class Scene {
    constructor(
        public name: String = 'Untitled Scene',
        public entities: Entity[] = [],
    ) {}

    static load(obj: any): Scene {
        return new Scene(obj.name, obj.entities);
    }

    save(): string {
        return JSON.stringify({
            name: this.name,
            entities: this.entities,
        });
    }
}
