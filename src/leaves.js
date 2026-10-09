'use strict';

/* =========================================================
   5. FALLING LEAVES — canvas background
      green → yellow → dry → falls → a new one sprouts
   ========================================================= */

const LEAF_COLORS = {
    green: [74, 154, 92],
    yellow: [230, 195, 74],
    dry: [160, 112, 58],
};

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
const rand = (min, max) => min + Math.random() * (max - min);

/** Point and tangent angle on a quadratic Bézier. */
function bezier(b, t) {
    const u = 1 - t;
    const x = u * u * b.x0 + 2 * u * t * b.cx + t * t * b.x1;
    const y = u * u * b.y0 + 2 * u * t * b.cy + t * t * b.y1;
    const dx = 2 * u * (b.cx - b.x0) + 2 * t * (b.x1 - b.cx);
    const dy = 2 * u * (b.cy - b.y0) + 2 * t * (b.y1 - b.cy);
    return { x, y, angle: Math.atan2(dy, dx) };
}

class Leaf {
    constructor(anchor, size, startAged = false) {
        this.anchor = anchor;     // { x, y, angle } on a branch
        this.baseSize = size;
        this.phase = rand(0, Math.PI * 2);
        this.reset();
        if (startAged) {          // spread the lifecycle so not all leaves turn at once
            this.age = rand(0, this.life * 0.95);
            this.grow = 1;
        }
    }

    reset() {
        this.state = 'attached';
        this.age = 0;
        this.life = rand(14, 38);  // seconds until it falls
        this.grow = 0;             // 0 → 1 sprout animation
        this.size = this.baseSize * rand(0.85, 1.15);
        this.x = this.anchor.x;
        this.y = this.anchor.y;
        this.rotation = this.anchor.angle;
        this.alpha = 1;
    }

    get progress() { return Math.min(this.age / this.life, 1); }

    color() {
        const p = this.progress;
        if (p < 0.45) return LEAF_COLORS.green;
        if (p < 0.8) return mix(LEAF_COLORS.green, LEAF_COLORS.yellow, (p - 0.45) / 0.35);
        return mix(LEAF_COLORS.yellow, LEAF_COLORS.dry, (p - 0.8) / 0.2);
    }

    update(dt, time, height) {
        if (this.state === 'attached') {
            this.age += dt;
            this.grow = Math.min(1, this.grow + dt / 1.6);
            this.rotation = this.anchor.angle + Math.sin(time * 1.2 + this.phase) * 0.06 * (1 + this.progress);
            if (this.progress >= 1) {
                this.state = 'falling';
                this.vx = rand(-12, 12);
                this.vy = 0;
                this.spin = rand(-1.6, 1.6);
            }
            return;
        }

        // falling: gravity with a terminal speed + side-to-side drift
        this.vy = Math.min(this.vy + 38 * dt, 46 + this.size);
        this.x += (this.vx + Math.sin(time * 1.4 + this.phase) * 34) * dt;
        this.y += this.vy * dt;
        this.rotation += this.spin * dt + Math.cos(time * 1.4 + this.phase) * 0.02;
        if (this.y > height - 60) this.alpha = Math.max(0, (height + 20 - this.y) / 80);
        if (this.y > height + 30) {
            if (this.once) this.dead = true;
            else this.reset();
        }
    }

    draw(ctx) {
        const scale = this.state === 'attached' ? easeOutBack(this.grow) : 1;
        if (scale <= 0) return;
        const L = this.size * scale;
        const curl = this.progress > 0.8 ? 1 - (this.progress - 0.8) * 1.5 : 1; // dry leaves curl
        const [r, g, b] = this.color();

        ctx.save();
        ctx.globalAlpha = this.alpha * 0.9;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(1, curl);

        // stem
        ctx.strokeStyle = `rgb(${r - 30}, ${g - 40}, ${b - 20})`;
        ctx.lineWidth = Math.max(1, L * 0.05);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(L * 0.18, 0);
        ctx.stroke();

        // blade
        ctx.translate(L * 0.15, 0);
        const grad = ctx.createLinearGradient(0, -L * 0.3, 0, L * 0.3);
        grad.addColorStop(0, `rgb(${Math.min(255, r + 25)}, ${Math.min(255, g + 25)}, ${Math.min(255, b + 15)})`);
        grad.addColorStop(1, `rgb(${r}, ${g}, ${b})`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(L * 0.3, -L * 0.38, L * 0.78, -L * 0.3, L, 0);
        ctx.bezierCurveTo(L * 0.78, L * 0.3, L * 0.3, L * 0.38, 0, 0);
        ctx.fill();

        // veins
        ctx.strokeStyle = `rgba(${r - 45}, ${g - 55}, ${b - 30}, 0.55)`;
        ctx.lineWidth = Math.max(0.6, L * 0.025);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(L * 0.92, 0);
        for (let i = 1; i <= 3; i++) {
            const vx = L * 0.2 * i;
            ctx.moveTo(vx, 0);
            ctx.lineTo(vx + L * 0.14, -L * 0.15);
            ctx.moveTo(vx, 0);
            ctx.lineTo(vx + L * 0.14, L * 0.15);
        }
        ctx.stroke();
        ctx.restore();
    }
}

function easeOutBack(t) {
    const c = 1.5;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

function initLeaves() {
    const canvas = $('#leaves');
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let branches = [];
    let leaves = [];
    let rafId = null;
    let lastTime = 0;
    let leafSize = 34;
    const MAX_PLANTED = 40;
    const HIT_DISTANCE = 22;   // px from a branch that still counts as a hit

    function buildScene() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const small = width < 720;
        const reach = small ? width * 0.32 : Math.min(width * 0.24, 360);
        const size = leafSize = small ? 22 : 34;

        // branches grow in from the left and right edges
        const defs = [
            { side: 'left', y: 0.1 }, { side: 'right', y: 0.28 },
            { side: 'left', y: 0.58 }, { side: 'right', y: 0.8 },
        ];
        branches = defs.map(({ side, y }) => {
            const y0 = height * y;
            const dir = side === 'left' ? 1 : -1;
            const x0 = side === 'left' ? -10 : width + 10;
            return {
                x0, y0,
                cx: x0 + dir * reach * 0.5, cy: y0 - rand(10, 40),
                x1: x0 + dir * reach, y1: y0 + rand(10, 50),
                dir,
            };
        });

        const perBranch = small ? 5 : 8;
        leaves = [];
        branches.forEach((b) => {
            for (let i = 0; i < perBranch; i++) {
                const t = 0.18 + (i / (perBranch - 1)) * 0.8;
                const p = bezier(b, t);
                const side = i % 2 === 0 ? -1 : 1;  // alternate above / below the branch
                leaves.push(new Leaf(
                    { x: p.x, y: p.y, angle: p.angle + side * rand(0.6, 1.1) },
                    size,
                    true
                ));
            }
        });
    }

    function drawBranches() {
        ctx.save();
        ctx.lineCap = 'round';
        branches.forEach((b) => {
            ctx.strokeStyle = 'rgba(92, 72, 44, 0.55)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(b.x0, b.y0);
            ctx.quadraticCurveTo(b.cx, b.cy, b.x1, b.y1);
            ctx.stroke();
        });
        ctx.restore();
    }

    /** Closest point on any branch to (x, y), or null if too far. */
    function hitBranch(x, y) {
        let best = null;
        for (const b of branches) {
            for (let i = 0; i <= 60; i++) {
                const t = i / 60;
                const p = bezier(b, t);
                const d = Math.hypot(p.x - x, p.y - y);
                if (d < HIT_DISTANCE && (!best || d < best.d)) best = { ...p, t, d, b };
            }
        }
        return best;
    }

    function plantLeaf(hit, y) {
        const side = y < hit.y ? -1 : 1;   // grow on the side that was clicked
        const leaf = new Leaf(
            { x: hit.x, y: hit.y, angle: hit.angle + side * rand(0.6, 1.1) },
            leafSize * rand(0.9, 1.1)
        );
        leaf.once = true;
        leaves.push(leaf);

        const planted = leaves.filter(l => l.once);
        if (planted.length > MAX_PLANTED) leaves.splice(leaves.indexOf(planted[0]), 1);
        if (prefersReducedMotion.matches) { leaf.grow = 1; drawStatic(); }
    }

    // clicks on the page background (not on cards or controls)
    const isBackground = (el) => !el.closest('a, button, input, label, .card, .chain, .music, pre');

    document.addEventListener('click', (e) => {
        if (!isBackground(e.target)) return;
        const hit = hitBranch(e.clientX, e.clientY);
        if (hit) plantLeaf(hit, e.clientY);
    });

    let hoverQueued = false;
    document.addEventListener('pointermove', (e) => {
        if (hoverQueued || e.pointerType !== 'mouse') return;
        hoverQueued = true;
        requestAnimationFrame(() => {
            hoverQueued = false;
            const over = isBackground(e.target) && hitBranch(e.clientX, e.clientY);
            document.body.classList.toggle('on-branch', Boolean(over));
        });
    });

    function frame(now) {
        const time = now / 1000;
        const dt = Math.min(time - lastTime, 0.05);
        lastTime = time;

        ctx.clearRect(0, 0, width, height);
        drawBranches();
        // attached first, falling on top
        for (const leaf of leaves) {
            leaf.update(dt, time, height);
            if (leaf.state === 'attached') leaf.draw(ctx);
        }
        for (const leaf of leaves) if (leaf.state === 'falling') leaf.draw(ctx);
        if (leaves.some(l => l.dead)) leaves = leaves.filter(l => !l.dead);

        rafId = requestAnimationFrame(frame);
    }

    function drawStatic() {
        ctx.clearRect(0, 0, width, height);
        drawBranches();
        leaves.forEach(leaf => leaf.draw(ctx));
    }

    function start() {
        if (rafId || prefersReducedMotion.matches) return;
        lastTime = performance.now() / 1000;
        rafId = requestAnimationFrame(frame);
    }

    function stop() {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    function refresh() {
        buildScene();
        if (prefersReducedMotion.matches) { stop(); drawStatic(); }
        else start();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refresh, 200);
    });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    prefersReducedMotion.addEventListener('change', refresh);

    refresh();
}
