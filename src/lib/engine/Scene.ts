export type Ball = {
    type: 'ball';
    position: { x: number; y: number };
    radius: number;
};

type Entity = Ball;

export default class Scene {
    constructor(
        public name: String = 'Untitled Scene',
        public entities: Entity[] = [],
    ) {}

    static load(data: string): Scene {
        const obj = JSON.parse(data);
        return new Scene(obj.name, obj.entities);
    }

    save(): string {
        return JSON.stringify({
            name: this.name,
            entities: this.entities,
        });
    }
}
