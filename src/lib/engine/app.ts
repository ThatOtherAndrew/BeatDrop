import type { Collider, RigidBody } from '@dimforge/rapier2d';
import { Application, Graphics } from 'pixi.js';

interface Ball {
    graphics: Graphics;
    radius: number;
    rigidBody: RigidBody;
}

interface BallCollider {
    graphics: Graphics;
    radius: number;
    collider: Collider;
}

export async function initApp(canvasContainer: HTMLElement) {
    const app = new Application();
    await app.init({ background: 'black', resizeTo: canvasContainer });
    canvasContainer.appendChild(app.canvas);
    return app;
}

export async function runApp(app: Application) {
    const rapier = await import('@dimforge/rapier2d');

    const gravity = { x: 0, y: 100 };
    const world = new rapier.World(gravity);

    const balls: Ball[] = [];
    const colliders: BallCollider[] = [];

    const BALL_RADIUS = 15;
    const COLLIDER_RADIUS = 30;

    // Ghost circle (follows cursor)
    const ghostCircle = new Graphics();
    ghostCircle.circle(0, 0, BALL_RADIUS);
    ghostCircle.fill({ color: 0xffffff, alpha: 0.3 });
    app.stage.addChild(ghostCircle);

    let mouseX = 0;
    let mouseY = 0;

    app.canvas.addEventListener('mousemove', (e) => {
        const rect = app.canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        ghostCircle.x = mouseX;
        ghostCircle.y = mouseY;
    });

    app.canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            const rigidBody = world.createRigidBody(
                rapier.RigidBodyDesc.dynamic().setTranslation(mouseX, mouseY),
            );
            // Attach a collider to the rigid body so it can interact with physics
            world.createCollider(
                rapier.ColliderDesc.ball(BALL_RADIUS),
                rigidBody,
            );

            const ball: Ball = {
                graphics: new Graphics(),
                radius: BALL_RADIUS,
                rigidBody: rigidBody,
            };
            ball.graphics.circle(0, 0, BALL_RADIUS);
            ball.graphics.fill({ color: 0x3498db });
            app.stage.addChild(ball.graphics);
            balls.push(ball);
        }
    });

    app.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const collider: BallCollider = {
            graphics: new Graphics({
                x: mouseX,
                y: mouseY,
            }),
            radius: COLLIDER_RADIUS,
            collider: world.createCollider(
                rapier.ColliderDesc.ball(COLLIDER_RADIUS).setTranslation(
                    mouseX,
                    mouseY,
                ),
            ),
        };
        collider.graphics.circle(0, 0, COLLIDER_RADIUS);
        collider.graphics.fill({ color: 0xe74c3c });
        app.stage.addChild(collider.graphics);
        colliders.push(collider);
    });

    app.ticker.add((time) => {
        world.step();
        for (const ball of balls) {
            const position = ball.rigidBody.translation();
            ball.graphics.x = position.x;
            ball.graphics.y = position.y;
        }
    });
}
