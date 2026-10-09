'use strict';

/* =========================================================
   ORDER THE CODE — drag (pointer), arrow buttons or keyboard
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
        <button class="tab ${i === order.index ? 'is-active' : ''} ${order.solved[i] ? 'is-solved' : ''}" type="button"
                role="tab" aria-selected="${i === order.index}" data-puzzle="${i}">
            ${order.solved[i] ? icon('check') : `<span class="tab__no">${i + 1}</span>`}${p.title}
        </button>`).join('');
    $('#order-score').textContent = `${order.solved.filter(Boolean).length} / ${PUZZLES.length}`;
}

function sortItemTemplate(stepIndex) {
    const step = puzzle().steps[stepIndex];
    return `
        <li class="sort-item" data-step="${stepIndex}">
            <button class="sort-item__grip" type="button" aria-label="გადაადგილება (ისრები ↑ ↓)">${icon('grip')}</button>
            <pre class="sort-item__code"><code>${highlight(step.code)}</code></pre>
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
            <p class="task-goal">${icon('target')}<span><b>მიზანი:</b> ${escapeHtml(p.goal)}</span></p>
            <div class="tags">${tags}</div>
        </div>
        <p class="task-help">ხაზები არეულია. გადაათრიე ისინი (ან ისრებით გადააადგილე) სწორი თანმიმდევრობით, ზემოდან ქვემოთ.</p>

        <ol class="sortable" id="sortable" aria-label="კოდის ნაბიჯები">
            ${order.sequence.map(sortItemTemplate).join('')}
        </ol>

        <div class="task-actions">
            <button class="btn btn--primary" type="button" data-order-check>${icon('check')}შემოწმება</button>
            <button class="btn btn--ghost" type="button" data-order-shuffle>${icon('shuffle')}არევა</button>
        </div>
        <div id="order-msg" aria-live="polite"></div>
        <div class="preview" id="order-preview" hidden>
            <p class="preview__title">${icon('play')}შედეგი: კოდი გაეშვა</p>
            <div class="preview__body" id="order-preview-body"></div>
        </div>`;
    renderPuzzleTabs();
}

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
            `${wrong} ხაზი არასწორ ადგილზეა (წითლად არის მონიშნული). დაფიქრდი: რა უნდა არსებობდეს მანამ, სანამ ამ ხაზს გამოიყენებ?`);
        return;
    }
    order.solved[order.index] = true;
    renderPuzzleTabs();
    const isLast = order.index === PUZZLES.length - 1;
    $('#order-msg').innerHTML = `
        ${feedbackTemplate(true, 'სწორია!', 'ყველა ნაბიჯი თავის ადგილზეა. ქვემოთ ნახე, რას აკეთებს ეს კოდი სინამდვილეში.')}
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
        const move = e.target.closest('[data-move]');
        if (move) {
            const li = move.closest('.sort-item');
            moveItem(li, Number(move.dataset.move));
            return move.focus({ preventScroll: true });
        }
        if (e.target.closest('[data-order-check]')) return checkOrder();
        if (e.target.closest('[data-order-shuffle]')) return renderPuzzle();
        if (e.target.closest('[data-order-next]')) {
            order.index = Math.min(order.index + 1, PUZZLES.length - 1);
            return renderPuzzle();
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
