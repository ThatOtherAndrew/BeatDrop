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
}
