'use strict';

/* =========================================================
   ORDER THE CODE — drag (pointer), arrow buttons or keyboard
   Every line is a square tube: click its middle and it rolls
   like a long die, showing what the line does on the next side.
   When the order is valid, the program actually runs.
   ========================================================= */

const order = {
    index: 0,
    sequence: [],                         // step indices in their current order
    solved: PUZZLES.map(() => false),
};

const orderRoot = () => $('#order');
const puzzle = () => PUZZLES[order.index];

/** A sequence is valid when ranks never go down. */
function isValidSequence(seq, steps) {
    return seq.every((s, i) => i === 0 || steps[seq[i - 1]].rank <= steps[s].rank);
}

function shuffledSequence(steps) {
    const ids = steps.map((_, i) => i);
    let seq;
    do { seq = shuffle(ids); } while (isValidSequence(seq, steps));
    return seq;
}

function renderPuzzleTabs() {
    $('#order-tabs').innerHTML = PUZZLES.map((p, i) => `
        <button class="step-dot ${order.solved[i] ? 'is-found' : ''} ${i === order.index ? 'is-current' : ''}" type="button"
                role="tab" aria-selected="${i === order.index}" data-puzzle="${i}" title="${p.title}"
                aria-label="${i + 1}. ${p.title}${order.solved[i] ? ', ამოხსნილია' : ''}">${i + 1}</button>`).join('');
    $('#order-score').textContent = `${order.solved.filter(Boolean).length} / ${PUZZLES.length}`;
}

/* Four sides around the tube: code, explanation, code, explanation.
   Rolling always goes down, so after two rolls the code is back on top. */
function rollTemplate(step) {
    const sides = [
        `<code>${highlight(step.code)}</code>${icon('info', 'roll__hint')}`,
        `<span>${escapeHtml(step.explain)}</span>${icon('code', 'roll__hint')}`,
    ];
    const faces = [0, 1, 2, 3].map(i => `
        <span class="roll__face roll__face--${i % 2 ? 'info' : 'code'} ${i ? '' : 'is-front'}" ${i ? 'aria-hidden="true"' : ''}>${sides[i % 2]}</span>`).join('');
    return `
        <button class="roll" type="button" aria-pressed="false" title="გადააგორე: რას აკეთებს ეს ხაზი?">
            <span class="roll__prism" style="--turn: 0">${faces}</span>
        </button>`;
}

function sortItemTemplate(stepIndex) {
    const step = puzzle().steps[stepIndex];
    return `
        <li class="sort-item" data-step="${stepIndex}">
            <button class="sort-item__grip" type="button" aria-label="გადაადგილება (ისრები ↑ ↓)">${icon('grip')}</button>
            ${rollTemplate(step)}
            <span class="sort-item__mark" aria-hidden="true"></span>
            <span class="sort-item__moves">
                <button class="icon-btn" type="button" data-move="-1" aria-label="ზემოთ">${icon('arrowUp')}</button>
                <button class="icon-btn" type="button" data-move="1" aria-label="ქვემოთ">${icon('arrowDown')}</button>
            </span>
        </li>`;
}

function renderPuzzle({ reshuffle = true } = {}) {
    const p = puzzle();
    if (reshuffle) order.sequence = shuffledSequence(p.steps);
    const tags = p.topics.map((id) => {
        const t = TOPICS.find(x => x.id === id);
        return `<a class="tag" href="#${t.id}">${icon(t.icon)}${t.label}</a>`;
    }).join('');

    $('#order-body').innerHTML = `
        <div class="task-head">
            <div>
                <h3 class="task-title">${order.index + 1}. ${p.title}</h3>
                <p class="task-goal">${icon('target')}<span><b>მიზანი:</b> ${escapeHtml(p.goal)}</span></p>
            </div>
            <div class="tags">${tags}</div>
        </div>
        <p class="task-help">
            ხაზები არეულია. გადაათრიე ისინი მარცხენა სახელურით (ან ისრებით) სწორი თანმიმდევრობით, ზემოდან ქვემოთ.
            ხაზის შუაში დააჭირე და ის კამათელივით გადაგორდება: მეორე მხარეს წერია, რას აკეთებს.
        </p>

        <ol class="sortable" id="sortable" aria-label="კოდის ნაბიჯები">
            ${order.sequence.map(sortItemTemplate).join('')}
        </ol>

        <div class="task-actions">
            <button class="btn btn--primary" type="button" data-order-check>${icon('check')}შემოწმება</button>
            <button class="btn" type="button" data-order-roll></button>
            <button class="btn btn--ghost" type="button" data-order-shuffle>${icon('shuffle')}არევა</button>
        </div>
        <div id="order-msg" aria-live="polite"></div>
        <div class="preview" id="order-preview" hidden>
            <p class="preview__title">${icon('play')}შედეგი: კოდი გაეშვა</p>
            <div class="preview__body" id="order-preview-body"></div>
        </div>`;
    renderPuzzleTabs();
    sizePrisms();
    syncRollAll();
}

/* ---- rolling ---- */

// the tube is as deep as it is tall, so each prism needs its own height in px
const prismSizer = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => target.style.setProperty('--h', `${target.offsetHeight}px`));
});

function sizePrisms() {
    prismSizer.disconnect();
    $$('.roll__prism', orderRoot()).forEach((prism) => {
        prism.style.setProperty('--h', `${prism.offsetHeight}px`);
        prismSizer.observe(prism);
    });
}

const showsInfo = (roll) => roll.getAttribute('aria-pressed') === 'true';

/** Rolls one line down a quarter turn. With `toInfo`, only rolls if needed. */
function rollLine(roll, toInfo) {
    if (toInfo !== undefined && toInfo === showsInfo(roll)) return;
    const prism = roll.firstElementChild;
    const turn = Number(prism.style.getPropertyValue('--turn')) + 1;
    prism.style.setProperty('--turn', turn);
    [...prism.children].forEach((face, i) => {
        const front = i === turn % 4;
        face.classList.toggle('is-front', front);
        if (front) face.removeAttribute('aria-hidden');
        else face.setAttribute('aria-hidden', 'true');
    });
    roll.setAttribute('aria-pressed', String(turn % 2 === 1));
}

/** Rolls every line to the same side, one after another like falling dominoes. */
function rollAll() {
    const rolls = $$('.roll', orderRoot());
    const toInfo = rolls.some(r => !showsInfo(r));
    rolls.forEach((roll, i) => {
        roll.firstElementChild.style.setProperty('--delay', `${i * 70}ms`);
        rollLine(roll, toInfo);
    });
    // running transitions keep their delay; clear it so single rolls stay instant
    setTimeout(() => rolls.forEach(r => r.firstElementChild.style.removeProperty('--delay')), rolls.length * 70 + 50);
    syncRollAll();
}

function syncRollAll() {
    const allInfo = $$('.roll', orderRoot()).every(showsInfo);
    $('[data-order-roll]', orderRoot()).innerHTML = allInfo
        ? `${icon('code')}ყველას კოდი`
        : `${icon('info')}ყველას ახსნა`;
}

/* ---- checking ---- */

function readSequence() {
    return $$('.sort-item', orderRoot()).map(li => Number(li.dataset.step));
}

function clearMarks() {
    $$('.sort-item', orderRoot()).forEach((li) => {
        li.classList.remove('is-right', 'is-wrong');
        li.querySelector('.sort-item__mark').innerHTML = '';
    });
    $('#order-msg').innerHTML = '';
    $('#order-preview').hidden = true;
}

/** Moves an element and animates the siblings that shifted (FLIP). */
function flipMove(list, mutate) {
    const items = [...list.children];
    const before = new Map(items.map(el => [el, el.getBoundingClientRect().top]));
    mutate();
    if (prefersReducedMotion.matches) return;
    items.forEach((el) => {
        const dy = before.get(el) - el.getBoundingClientRect().top;
        if (!dy || el.classList.contains('is-dragging')) return;
        el.style.transition = 'none';
        el.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(() => {
            el.style.transition = '';
            el.style.transform = '';
        });
    });
}

function moveItem(li, dir) {
    const list = li.parentElement;
    const target = dir < 0 ? li.previousElementSibling : li.nextElementSibling;
    if (!target) return;
    flipMove(list, () => (dir < 0 ? list.insertBefore(li, target) : list.insertBefore(target, li)));
    clearMarks();
}

/** Lines that share a rank don't depend on each other, so either order was fine. */
function swapNote(p) {
    const byRank = new Map();
    p.steps.forEach(s => byRank.set(s.rank, [...(byRank.get(s.rank) || []), s]));
    const groups = [...byRank.values()].filter(g => g.length > 1);
    if (!groups.length) return '';
    const list = groups
        .map(g => g.map(s => `<code>${escapeHtml(s.code.trim().split('\n')[0])}</code>`).join(' ⇄ '))
        .join('<br>');
    return `
        <p class="tip swap-note">${icon('shuffle')}<span>
            ეს ხაზები ერთმანეთზე არ არის დამოკიდებული, ამიტომ მათი გაცვლაც სწორი იქნებოდა:<br>${list}
        </span></p>`;
}

function checkOrder() {
    const p = puzzle();
    const seq = readSequence();
    const sortedRanks = seq.map(s => p.steps[s].rank).sort((a, b) => a - b);
    let wrong = 0;
    $$('.sort-item', orderRoot()).forEach((li, i) => {
        const ok = p.steps[seq[i]].rank === sortedRanks[i];
        li.classList.toggle('is-right', ok);
        li.classList.toggle('is-wrong', !ok);
        li.querySelector('.sort-item__mark').innerHTML = icon(ok ? 'check' : 'x');
        if (!ok) wrong++;
    });

    if (wrong) {
        $('#order-msg').innerHTML = feedbackTemplate(false, 'ჯერ არა.',
            `${wrong} ხაზი არასწორ ადგილზეა (წითლად არის მონიშნული). გადააგორე ისინი და წაიკითხე, რას აკეთებენ: რა უნდა არსებობდეს მანამ, სანამ ამ ხაზს გამოიყენებ?`);
        return;
    }
    order.solved[order.index] = true;
    renderPuzzleTabs();
    const isLast = order.index === PUZZLES.length - 1;
    $('#order-msg').innerHTML = `
        ${feedbackTemplate(true, 'სწორია!', 'ყველა ნაბიჯი თავის ადგილზეა. ქვემოთ ნახე, რას აკეთებს ეს კოდი სინამდვილეში.')}
        ${swapNote(p)}
        ${isLast ? '' : `<div class="task-nav"><button class="btn btn--primary" type="button" data-order-next>შემდეგი ამოცანა${icon('arrowRight')}</button></div>`}`;
    const preview = $('#order-preview');
    const body = $('#order-preview-body');
    body.innerHTML = '';
    preview.hidden = false;
    p.run(body);
}

/* ---- pointer drag ---- */
function bindDrag() {
    let drag = null;

    orderRoot().addEventListener('pointerdown', (e) => {
        const grip = e.target.closest('.sort-item__grip');
        if (!grip || e.button !== 0) return;
        const li = grip.closest('.sort-item');
        e.preventDefault();
        grip.setPointerCapture(e.pointerId);
        li.classList.add('is-dragging');
        drag = { li, grip, list: li.parentElement };
        clearMarks();
    });

    orderRoot().addEventListener('pointermove', (e) => {
        if (!drag) return;
        const { li, list } = drag;
        const siblings = [...list.children].filter(el => el !== li);
        const after = siblings.find((el) => {
            const r = el.getBoundingClientRect();
            return e.clientY < r.top + r.height / 2;
        });
        if (after === li.nextElementSibling || (!after && li === list.lastElementChild)) return;
        flipMove(list, () => list.insertBefore(li, after || null));
    });

    const end = () => {
        if (!drag) return;
        drag.li.classList.remove('is-dragging');
        drag.grip.focus({ preventScroll: true });
        drag = null;
    };
    orderRoot().addEventListener('pointerup', end);
    orderRoot().addEventListener('pointercancel', end);
}

function initOrder() {
    renderPuzzle();
    bindDrag();

    orderRoot().addEventListener('click', (e) => {
        const tab = e.target.closest('[data-puzzle]');
        if (tab) { order.index = Number(tab.dataset.puzzle); return renderPuzzle(); }
        const roll = e.target.closest('.roll');
        if (roll) { rollLine(roll); return syncRollAll(); }
        const move = e.target.closest('[data-move]');
        if (move) {
            const li = move.closest('.sort-item');
            moveItem(li, Number(move.dataset.move));
            return move.focus({ preventScroll: true });
        }
        if (e.target.closest('[data-order-check]')) return checkOrder();
        if (e.target.closest('[data-order-roll]')) return rollAll();
        if (e.target.closest('[data-order-shuffle]')) return renderPuzzle();
        if (e.target.closest('[data-order-next]')) {
            order.index = Math.min(order.index + 1, PUZZLES.length - 1);
            renderPuzzle();
            return $('#order').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
        }
    });

    // keyboard: focus a grip, then ↑ / ↓
    orderRoot().addEventListener('keydown', (e) => {
        const grip = e.target.closest('.sort-item__grip');
        if (!grip || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
        e.preventDefault();
        moveItem(grip.closest('.sort-item'), e.key === 'ArrowUp' ? -1 : 1);
        grip.focus({ preventScroll: true });
    });
}
