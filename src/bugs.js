'use strict';

/* =========================================================
   BUG HUNT — click the line that breaks the code
   hint → explanation → fixed line (diff)
   ========================================================= */

const bugs = {
    index: 0,
    results: BUGS.map(() => null),   // null | 'found' | 'revealed'
    attempts: 0,
    hintShown: false,
};

const bugRoot = () => $('#bugs');
const foundCount = () => bugs.results.filter(r => r === 'found').length;

function renderBugNav() {
    $('#bugs-nav').innerHTML = BUGS.map((_, i) => {
        const r = bugs.results[i];
        const state = r === 'found' ? 'is-found' : r === 'revealed' ? 'is-revealed' : '';
        return `<button class="step-dot ${state} ${i === bugs.index ? 'is-current' : ''}" type="button"
                    data-bug-go="${i}" aria-label="ბაგი ${i + 1}${r ? (r === 'found' ? ', ნაპოვნია' : ', გამხელილია') : ''}"
                    ${i === bugs.index ? 'aria-current="step"' : ''}>${i + 1}</button>`;
    }).join('');
    $('#bugs-score').textContent = `${foundCount()} / ${BUGS.length}`;
}

function renderBug() {
    const b = BUGS[bugs.index];
    const topic = TOPICS.find(t => t.id === b.topic);
    const solved = bugs.results[bugs.index] !== null;
    bugs.attempts = 0;
    bugs.hintShown = false;

    $('#bugs-body').innerHTML = `
        <div class="task-head">
            <p class="task-goal">${icon('target')}<span><b>მიზანი:</b> ${escapeHtml(b.goal)}</span></p>
            <a class="tag" href="#${topic.id}">${icon(topic.icon)}${topic.label}</a>
        </div>
        <p class="task-help">კოდი არ მუშაობს ისე, როგორც უნდა. იპოვე ხაზი, რომელიც ამას იწვევს, და დააჭირე.</p>

        <div class="bug-code" role="group" aria-label="კოდის ხაზები">
            ${b.lines.map((line, i) => `
                <button class="bug-line" type="button" data-line="${i}">
                    <span class="bug-line__no">${i + 1}</span>
                    <code>${highlight(line) || ' '}</code>
                </button>`).join('')}
        </div>

        <p class="task-msg" id="bug-msg" aria-live="polite"></p>

        <div class="task-actions" id="bug-actions">
            <button class="btn" type="button" data-bug-hint>${icon('bulb')}მინიშნება</button>
            <button class="btn btn--ghost" type="button" data-bug-reveal>${icon('eye')}მაჩვენე პასუხი</button>
        </div>

        <div class="hint" id="bug-hint" hidden>${icon('bulb')}<span>${escapeHtml(b.hint)}</span></div>
        <div id="bug-answer" aria-live="polite"></div>`;

    renderBugNav();
    if (solved) solveBug(bugs.results[bugs.index] === 'found', { silent: true });
}

function showBugHint() {
    bugs.hintShown = true;
    $('#bug-hint').hidden = false;
    $('[data-bug-hint]', bugRoot()).classList.remove('is-pulse');
}

function pickLine(i) {
    const b = BUGS[bugs.index];
    if (bugs.results[bugs.index] !== null) return;

    if (i === b.bug) {
        bugs.results[bugs.index] = 'found';
        solveBug(true);
        return;
    }

    bugs.attempts++;
    const line = $(`[data-line="${i}"]`, bugRoot());
    line.classList.remove('is-wrong');
    void line.offsetWidth;            // restart the shake
    line.classList.add('is-wrong');
    $('#bug-msg').textContent = `ხაზი ${i + 1} რიგზეა. სცადე სხვა.`;
    if (bugs.attempts >= 2 && !bugs.hintShown) {
        $('[data-bug-hint]', bugRoot()).classList.add('is-pulse');
        $('#bug-msg').textContent += ' გამოიყენე მინიშნება.';
    }
}

function solveBug(found, { silent = false } = {}) {
    const b = BUGS[bugs.index];
    if (!found && bugs.results[bugs.index] === null) bugs.results[bugs.index] = 'revealed';

    $$('.bug-line', bugRoot()).forEach((btn, i) => {
        btn.disabled = true;
        btn.classList.remove('is-wrong');
        if (i === b.bug) btn.classList.add(found ? 'is-found' : 'is-bug');
    });
    $('#bug-actions').hidden = true;
    $('#bug-msg').textContent = '';
    $('#bug-hint').hidden = false;

    const isLast = bugs.index === BUGS.length - 1;
    $('#bug-answer').innerHTML = `
        ${feedbackTemplate(found, found ? 'იპოვე!' : 'აი, სად იყო ბაგი.', escapeHtml(b.explain))}
        <div class="diff" aria-label="გასწორება">
            <p class="diff__title">გასწორება, ხაზი ${b.bug + 1}</p>
            <div class="diff__row diff__row--del"><span aria-hidden="true">−</span><code>${highlight(b.lines[b.bug])}</code></div>
            <div class="diff__row diff__row--add"><span aria-hidden="true">+</span><code>${highlight(b.fix)}</code></div>
        </div>
        <div class="task-nav">
            <button class="btn btn--primary" type="button" data-bug-next>${isLast ? 'შედეგი' : 'შემდეგი ბაგი'}${icon('arrowRight')}</button>
        </div>`;
    renderBugNav();
    if (!silent) $('[data-bug-next]', bugRoot()).focus({ preventScroll: true });
}

function nextBug() {
    const open = bugs.results.findIndex((r, i) => r === null && i > bugs.index);
    const anyOpen = bugs.results.findIndex(r => r === null);
    if (open !== -1) bugs.index = open;
    else if (anyOpen !== -1) bugs.index = anyOpen;
    else return renderBugResult();
    renderBug();
}

function renderBugResult() {
    $('#bugs-body').innerHTML = resultTemplate(foundCount(), BUGS.length, 'data-bugs-restart')
        .replace('class="result__text">', 'class="result__text">შენ თვითონ იპოვე ბაგების ეს რაოდენობა. ');
    renderBugNav();
}

function restartBugs() {
    bugs.index = 0;
    bugs.results = BUGS.map(() => null);
    renderBug();
}

function initBugs() {
    renderBug();
    bugRoot().addEventListener('click', (e) => {
        const line = e.target.closest('[data-line]');
        if (line) return pickLine(Number(line.dataset.line));
        const go = e.target.closest('[data-bug-go]');
        if (go) { bugs.index = Number(go.dataset.bugGo); return renderBug(); }
        if (e.target.closest('[data-bug-hint]')) return showBugHint();
        if (e.target.closest('[data-bug-reveal]')) return solveBug(false);
        if (e.target.closest('[data-bug-next]')) return nextBug();
        if (e.target.closest('[data-bugs-restart]')) return restartBugs();
    });
}
