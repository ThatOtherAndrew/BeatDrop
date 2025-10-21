import { Application, Graphics } from 'pixi.js';

interface Ball {
    graphics: Graphics;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

interface Collider {
    graphics: Graphics;
    x: number;
    y: number;
    radius: number;
}

export async function initApp(canvasContainer: HTMLElement) {
    const app = new Application();
    await app.init({ background: 'black', resizeTo: canvasContainer });
    canvasContainer.appendChild(app.canvas);
    return app;
}

export async function runApp(app: Application) {
    const balls: Ball[] = [];
    const colliders: Collider[] = [];

    // Physics constants
    const GRAVITY = 0.5;
    const BALL_RADIUS = 15;
    const COLLIDER_RADIUS = 30;
    const BOUNCE_DAMPING = 0.7;

    // Ghost circle (follows cursor)
    const ghostCircle = new Graphics();
    ghostCircle.circle(0, 0, BALL_RADIUS);
    ghostCircle.fill({ color: 0xffffff, alpha: 0.3 });
    app.stage.addChild(ghostCircle);

    // Mouse position tracking
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
            // Left click
            const ball: Ball = {
                graphics: new Graphics(),
                x: mouseX,
                y: mouseY,
                vx: 0,
                vy: 0,
                radius: BALL_RADIUS,
            };
            ball.graphics.circle(0, 0, BALL_RADIUS);
            ball.graphics.fill({ color: 0x3498db });
            app.stage.addChild(ball.graphics);
            balls.push(ball);
        }
    });

    app.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const collider: Collider = {
            graphics: new Graphics(),
            x: mouseX,
            y: mouseY,
            radius: COLLIDER_RADIUS,
        };
        collider.graphics.circle(0, 0, COLLIDER_RADIUS);
        collider.graphics.fill({ color: 0xe74c3c });
        collider.graphics.x = mouseX;
        collider.graphics.y = mouseY;
        app.stage.addChild(collider.graphics);
        colliders.push(collider);
    });

    app.ticker.add((time) => {
        const dt = time.deltaTime;

        for (const ball of balls) {
            ball.vy += GRAVITY * dt;

            ball.x += ball.vx * dt;
            ball.y += ball.vy * dt;

            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx = -ball.vx * BOUNCE_DAMPING;
            }
            if (ball.x + ball.radius > app.screen.width) {
                ball.x = app.screen.width - ball.radius;
                ball.vx = -ball.vx * BOUNCE_DAMPING;
            }
            if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.vy = -ball.vy * BOUNCE_DAMPING;
            }
            if (ball.y + ball.radius > app.screen.height) {
                ball.y = app.screen.height - ball.radius;
                ball.vy = -ball.vy * BOUNCE_DAMPING;
                ball.vx *= 0.98; // Ground friction
            }

            for (const collider of colliders) {
                const dx = ball.x - collider.x;
                const dy = ball.y - collider.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDist = ball.radius + collider.radius;

                if (distance < minDist) {
                    const angle = Math.atan2(dy, dx);
                    ball.x = collider.x + Math.cos(angle) * minDist;
                    ball.y = collider.y + Math.sin(angle) * minDist;

                    const nx = dx / distance;
                    const ny = dy / distance;
                    const dot = ball.vx * nx + ball.vy * ny;
                    ball.vx = (ball.vx - 2 * dot * nx) * BOUNCE_DAMPING;
                    ball.vy = (ball.vy - 2 * dot * ny) * BOUNCE_DAMPING;
                }
            }

            ball.graphics.x = ball.x;
            ball.graphics.y = ball.y;
        }
    });
}
