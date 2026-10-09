'use strict';

/* =========================================================
   5. FALLING LEAVES — canvas over the forest photo
      A leaf sprouts, turns colour, dries and falls, fluttering
      in a slow wind, and a new one sprouts in its place.
      The colours come from the current season (data/seasons.js).
      Click a branch to grow a leaf of your own.
   ========================================================= */

const LEAF_TYPES = ['oval', 'oval', 'oak', 'maple'];
let leafPalette = SEASONS[0].leaves;   // new leaves take their colours from here
const BARK = 'rgb(46, 34, 24)';
const BARK_LIGHT = 'rgba(176, 146, 104, 0.35)';

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const shade = ([r, g, b], k, a = 1) => `rgba(${Math.round(r * k)}, ${Math.round(g * k)}, ${Math.round(b * k)}, ${a})`;

/* Leaf outlines in unit size: stem at (0, 0), tip at (1, 0).
   edge = the upper half as quadratic curves [cx, cy, x, y]; it is mirrored below.
   veins = upper side veins [x1, y1, x2, y2], also mirrored. */
const LEAF_SHAPES = {
    oval: {
        edge: [[0.12, -0.32, 0.45, -0.3], [0.82, -0.28, 1, 0]],
        veins: [[0.22, 0, 0.38, -0.17], [0.44, 0, 0.6, -0.17], [0.66, 0, 0.8, -0.11]],
    },
    oak: {
        edge: [[0.02, -0.22, 0.18, -0.1], [0.26, -0.38, 0.4, -0.14], [0.52, -0.42, 0.64, -0.14], [0.76, -0.34, 0.84, -0.08], [0.97, -0.14, 1, 0]],
        veins: [[0.08, 0, 0.1, -0.12], [0.24, 0, 0.3, -0.24], [0.46, 0, 0.53, -0.26], [0.7, 0, 0.76, -0.18]],
    },
    maple: {
        edge: [[0.04, -0.06, 0.06, -0.1], [0.04, -0.23, 0.02, -0.36], [0.16, -0.24, 0.26, -0.2], [0.31, -0.34, 0.36, -0.48], [0.45, -0.3, 0.5, -0.2], [0.58, -0.2, 0.68, -0.24], [0.8, -0.12, 1, 0]],
        veins: [[0, 0, 0.03, -0.32], [0, 0, 0.34, -0.43]],
    },
};

function buildLeafPath({ edge }) {
    const path = new Path2D();
    path.moveTo(0, 0);
    edge.forEach(([cx, cy, x, y]) => path.quadraticCurveTo(cx, cy, x, y));
    for (let i = edge.length - 1; i >= 0; i--) {         // walk back along the mirrored lower half
        const [px, py] = i ? edge[i - 1].slice(2) : [0, 0];
        path.quadraticCurveTo(edge[i][0], -edge[i][1], px, -py);
    }
    path.closePath();
    return path;
}

function buildVeinPath({ veins }) {
    const path = new Path2D();
    path.moveTo(0, 0);
    path.lineTo(0.92, 0);
    veins.forEach(([x1, y1, x2, y2]) => {
        path.moveTo(x1, y1); path.lineTo(x2, y2);
        path.moveTo(x1, -y1); path.lineTo(x2, -y2);
    });
    return path;
}

Object.values(LEAF_SHAPES).forEach((shape) => {
    shape.path = buildLeafPath(shape);
    shape.vein = buildVeinPath(shape);
});

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
    /** On a branch at position t (0…1), or drifting in from above when branch is null. */
    constructor({ branch = null, t = 0, side = 1, size, aged = false }) {
        this.branch = branch;
        this.t = t;
        this.side = side;
        this.baseSize = size;
        this.phase = rand(0, Math.PI * 2);
        this.reset();
        if (aged) {               // spread the lifecycle so not all leaves turn at once
            this.age = rand(0, this.life * 0.95);
            this.grow = 1;
        }
        if (!branch) {
            this.age = this.life * rand(0.75, 1);
            this.drop();
        }
    }

    reset() {
        this.state = 'attached';
        this.age = 0;
        this.life = rand(16, 40);  // seconds until it falls
        this.speed = 1;            // > 1 when a new season hurries it along
        this.grow = 0;             // 0 → 1 sprout animation
        this.size = this.baseSize * rand(0.85, 1.15);
        this.shape = LEAF_SHAPES[pick(LEAF_TYPES)];
        this.young = pick(leafPalette.young);
        this.turn = pick(leafPalette.turn);
        this.dry = leafPalette.dry;
        this.tilt = this.side * rand(0.6, 1.1);
        this.alpha = 1;
        this.flip = 0;
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
    }

    get progress() { return Math.min(this.age / this.life, 1); }

    color() {
        const p = this.progress;
        if (p < 0.4) return this.young;
        if (p < 0.72) return mix(this.young, this.turn, (p - 0.4) / 0.32);
        return mix(this.turn, this.dry, ((p - 0.72) / 0.28) * 0.65);
    }

    /** Follows its (swaying) branch. */
    attach(time, wind) {
        const p = bezier(this.branch.live, this.t);
        this.x = p.x;
        this.y = p.y;
        const sway = Math.sin(time * 1.3 + this.phase) * 0.06 + wind * 0.1 * this.branch.dir;
        this.rotation = p.angle + this.tilt + sway * (1 + this.progress);
    }

    drop() {
        this.state = 'falling';
        this.vx = rand(-12, 12);
        this.vy = 0;
        this.spin = rand(-1.4, 1.4);
        this.flipSpeed = rand(2, 4.5) * (Math.random() < 0.5 ? -1 : 1);
    }

    /** Returns true at the moment the leaf lets go of its branch. */
    update(dt, time, wind, width, height) {
        if (this.state === 'attached') {
            this.age += dt * this.speed;
            this.grow = Math.min(1, this.grow + dt / 1.6);
            this.attach(time, wind);
            if (this.progress < 1) return false;
            this.drop();
            return true;
        }

        // falling: gravity with a terminal speed, side-to-side drift, carried by the wind
        this.vy = Math.min(this.vy + 38 * dt, 42 + this.size * 0.8);
        this.x += (this.vx + wind * 36 + Math.sin(time * 1.3 + this.phase) * 30) * dt;
        this.y += this.vy * dt;
        this.flip += this.flipSpeed * dt;
        this.rotation += this.spin * dt + Math.cos(time * 1.3 + this.phase) * 0.015;
        if (this.y > height - 60) this.alpha = Math.max(0, (height + 20 - this.y) / 80);
        if (this.y > height + 30 || this.x < -100 || this.x > width + 100) this.dead = true;
        return false;
    }

    draw(ctx) {
        const scale = this.state === 'attached' ? easeOutBack(this.grow) : 1;
        if (scale <= 0) return;
        const L = this.size * scale;
        const p = this.progress;
        const curl = p > 0.85 ? 1 - (p - 0.85) * 1.6 : 1;                  // dry leaves curl
        const turn = this.state === 'falling' ? Math.cos(this.flip) : 1;   // turning over in the air
        const back = turn < 0;
        const color = this.color();

        ctx.save();
        ctx.globalAlpha = this.alpha * 0.92;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(L, L * curl * turn);

        // stem
        ctx.strokeStyle = shade(color, 0.55);
        ctx.lineWidth = 0.05;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0.18, 0);
        ctx.stroke();

        // blade, lit from above; the underside is a little duller
        ctx.translate(0.15, 0);
        const grad = ctx.createLinearGradient(0, -0.4, 0, 0.4);
        grad.addColorStop(0, shade(color, back ? 0.85 : 1.18));
        grad.addColorStop(1, shade(color, back ? 0.6 : 0.85));
        ctx.fillStyle = grad;
        ctx.fill(this.shape.path);

        // veins
        ctx.strokeStyle = shade(color, 0.55, 0.55);
        ctx.lineWidth = 0.022;
        ctx.stroke(this.shape.vein);
        ctx.restore();
    }
}

function easeOutBack(t) {
    const c = 1.5;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

/** Slow breeze with an occasional gust; roughly −1…2, positive blows right. */
function windAt(time) {
    const breeze = Math.sin(time * 0.31) * 0.5 + Math.sin(time * 0.17 + 1.3) * 0.35;
    const gust = Math.pow(Math.max(0, Math.sin(time * 0.09)), 16) * 1.4;
    return breeze + gust;
}

/** Returns { setSeason(season) }. */
function initLeaves(season) {
    leafPalette = season.leaves;
    const canvas = $('#leaves');
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let branches = [];
    let leaves = [];
    let rafId = null;
    let lastTime = 0;
    let leafSize = 34;
    let nextDrift = 0;
    const MAX_PLANTED = 40;
    const MAX_DRIFTING = 6;
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
            const b = {
                x0, y0,
                cx: x0 + dir * reach * 0.5, cy: y0 - rand(10, 40),
                x1: x0 + dir * reach, y1: y0 + rand(10, 50),
                dir,
                width: small ? 6 : 9,
                phase: rand(0, Math.PI * 2),
                twigs: [0.38, 0.62, 0.84].map((t, i) => ({
                    t: t + rand(-0.05, 0.05),
                    side: i % 2 ? 1 : -1,
                    length: reach * rand(0.1, 0.16),
                })),
            };
            b.live = { ...b };
            return b;
        });

        const perBranch = small ? 5 : 8;
        leaves = [];
        branches.forEach((branch) => {
            for (let i = 0; i < perBranch; i++) {
                const t = 0.18 + (i / (perBranch - 1)) * 0.8;
                const side = i % 2 === 0 ? -1 : 1;  // alternate above / below the branch
                const leaf = new Leaf({ branch, t, side, size, aged: true });
                leaf.attach(0, 0);
                leaves.push(leaf);
            }
        });
    }

    /** Branches bob a little; stronger wind bends them more. */
    function swayBranches(time, wind) {
        branches.forEach((b) => {
            const s = Math.sin(time * 0.8 + b.phase) * 2 + wind * 5;
            b.live.cy = b.cy + s * 0.4;
            b.live.y1 = b.y1 + s;
        });
    }

    /** A tapered branch: thick at the edge of the screen, thin at the tip. */
    function drawBranch(b) {
        const N = 28;
        const upper = [], lower = [];
        for (let i = 0; i <= N; i++) {
            const t = i / N;
            const p = bezier(b.live, t);
            const w = lerp(b.width, 1.2, t) / 2;
            const nx = -Math.sin(p.angle), ny = Math.cos(p.angle);
            upper.push([p.x - nx * w * b.dir, p.y - ny * w * b.dir]);
            lower.push([p.x + nx * w * b.dir, p.y + ny * w * b.dir]);
        }
        ctx.beginPath();
        upper.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        for (let i = lower.length - 1; i >= 0; i--) ctx.lineTo(...lower[i]);
        ctx.closePath();
        ctx.fillStyle = BARK;
        ctx.fill();

        // a thin highlight on top so the branch reads against the dark forest
        ctx.beginPath();
        upper.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.strokeStyle = BARK_LIGHT;
        ctx.lineWidth = 1;
        ctx.stroke();

        // twigs
        ctx.strokeStyle = BARK;
        ctx.lineWidth = 1.6;
        b.twigs.forEach((twig) => {
            const p = bezier(b.live, twig.t);
            const a = p.angle + twig.side * 0.7 * b.dir;
            const ex = p.x + Math.cos(a) * twig.length, ey = p.y + Math.sin(a) * twig.length;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.quadraticCurveTo(p.x + Math.cos(p.angle) * twig.length * 0.6, p.y + Math.sin(p.angle) * twig.length * 0.6, ex, ey);
            ctx.stroke();
        });
    }

    /** Closest point on any branch to (x, y), or null if too far. */
    function hitBranch(x, y) {
        let best = null;
        for (const b of branches) {
            for (let i = 0; i <= 60; i++) {
                const t = i / 60;
                const p = bezier(b.live, t);
                const d = Math.hypot(p.x - x, p.y - y);
                if (d < HIT_DISTANCE && (!best || d < best.d)) best = { ...p, t, d, b };
            }
        }
        return best;
    }

    function plantLeaf(hit, y) {
        const side = y < hit.y ? -1 : 1;   // grow on the side that was clicked
        const leaf = new Leaf({ branch: hit.b, t: Math.max(0.05, hit.t), side, size: leafSize * rand(0.9, 1.1) });
        leaf.planted = true;       // grows once: no new leaf replaces it when it falls
        leaf.attach(performance.now() / 1000, 0);
        leaves.push(leaf);

        const planted = leaves.filter(l => l.planted && l.state === 'attached');
        if (planted.length > MAX_PLANTED) leaves.splice(leaves.indexOf(planted[0]), 1);
        if (prefersReducedMotion.matches) { leaf.grow = 1; drawStatic(); }
    }

    /** A new season: the old leaves hurry through their colours and fall,
        and every one that falls is replaced by a sprout in the new colours. */
    function setSeason(next) {
        if (leafPalette === next.leaves) return;
        leafPalette = next.leaves;
        if (prefersReducedMotion.matches) {
            leaves = leaves.filter(l => l.state === 'attached');
            leaves.forEach((l) => { l.reset(); l.age = rand(0, l.life * 0.9); l.grow = 1; l.attach(0, 0); });
            return drawStatic();
        }
        leaves.forEach((leaf) => {
            if (leaf.state === 'attached') leaf.speed = Math.max(1, (leaf.life - leaf.age) / rand(2, 9));
        });
        nextDrift = 0;             // and a stray leaf drifts in right away
    }

    /** Now and then a leaf from a tree off-screen drifts down through the page. */
    function maybeDrift(time) {
        if (time < nextDrift) return;
        nextDrift = time + rand(2.5, 6);
        if (leaves.filter(l => !l.branch).length >= MAX_DRIFTING) return;
        const leaf = new Leaf({ size: leafSize * rand(0.7, 1) });
        leaf.x = rand(-40, width * 0.9);
        leaf.y = -30;
        leaf.rotation = rand(0, Math.PI * 2);
        leaves.push(leaf);
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
        const wind = windAt(time);

        ctx.clearRect(0, 0, width, height);
        swayBranches(time, wind);
        branches.forEach(drawBranch);
        maybeDrift(time);
        // attached first, falling on top
        const sprouts = [];
        for (const leaf of leaves) {
            const fell = leaf.update(dt, time, wind, width, height);
            if (fell && !leaf.planted) {
                sprouts.push(new Leaf({ branch: leaf.branch, t: leaf.t, side: leaf.side, size: leaf.baseSize }));
            }
            if (leaf.state === 'attached') leaf.draw(ctx);
        }
        for (const leaf of leaves) if (leaf.state === 'falling') leaf.draw(ctx);
        if (sprouts.length) sprouts.forEach(s => s.attach(time, wind));
        if (sprouts.length || leaves.some(l => l.dead)) leaves = [...leaves.filter(l => !l.dead), ...sprouts];

        rafId = requestAnimationFrame(frame);
    }

    function drawStatic() {
        ctx.clearRect(0, 0, width, height);
        branches.forEach(drawBranch);
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
    return { setSeason };
}

/** Crossfades to the season's forest photo, once it has loaded. */
function setForest(season) {
    const forest = $('#forest');
    if (forest.dataset.season === season.id) return;
    forest.dataset.season = season.id;

    let layer = $(`.forest__layer[data-season="${season.id}"]`, forest);
    if (!layer) {
        layer = document.createElement('div');
        layer.className = 'forest__layer';
        layer.dataset.season = season.id;
        layer.style.backgroundImage = `url("${season.image}")`;
        layer.style.setProperty('--dim', season.dim);
    }

    const img = new Image();
    img.src = season.image;
    img.decode().catch(() => { /* show it anyway */ }).then(() => {
        if (forest.dataset.season !== season.id) return;    // another season was picked meanwhile
        forest.append(layer);                                // newest photo on top
        void layer.offsetWidth;                              // start the fade from transparent
        $$('.forest__layer', forest).forEach(l => l.classList.toggle('is-active', l === layer));
    });
}

/** Shows the first forest; it drifts up a little as you scroll, so it feels deeper than the page. */
function initForest(season) {
    const forest = $('#forest');
    let queued = false;
    setForest(season);

    function update() {
        queued = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        forest.style.transform = prefersReducedMotion.matches ? '' : `translate3d(0, ${(-progress * 4).toFixed(2)}vh, 0)`;
    }

    window.addEventListener('scroll', () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(update);
    }, { passive: true });
    prefersReducedMotion.addEventListener('change', update);
    update();
}
