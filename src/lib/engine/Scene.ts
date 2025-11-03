type Entity = {
    position: { x: number; y: number };
};

export default class Scene {
    constructor(
        public name: String = 'Untitled Scene',
        public entities: Entity[] = [],
    ) {}
}
