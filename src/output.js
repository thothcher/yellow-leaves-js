'use strict';

/* =========================================================
   WHAT WILL IT PRINT? — read the code, predict the console
   ========================================================= */

const out = {
    questions: [],
    index: 0,
    score: 0,
    answered: false,
};

const outRoot = () => $('#output');

function startOutput() {
    out.questions = shuffle(OUTPUTS);
    out.index = 0;
    out.score = 0;
    renderOutputQuestion();
}

function updateOutputMeta() {
    const done = out.index + (out.answered ? 1 : 0);
    const pct = Math.round((done / out.questions.length) * 100);
    $('#output-score').textContent = `${out.score} / ${out.questions.length}`;
    const bar = $('#output-progress');
    bar.setAttribute('aria-valuenow', pct);
    $('.progress__bar', bar).style.width = `${pct}%`;
}

function renderOutputQuestion() {
    const q = out.questions[out.index];
    out.answered = false;
    $('#output-body').innerHTML = `
        <p class="quiz__q">კითხვა ${out.index + 1} / ${out.questions.length}</p>
        ${codeBlock(q.code)}
        <p class="console-label">${icon('terminal')}კონსოლში დაიბეჭდება:</p>
        <div class="options options--wide" role="group" aria-label="პასუხის ვარიანტები">
            ${q.options.map((o, i) => `
                <button class="option" type="button" data-out-answer="${i}">
                    <span class="option__key">${String.fromCharCode(65 + i)}</span><code>${escapeHtml(o)}</code>
                </button>`).join('')}
        </div>
        <div id="output-feedback" aria-live="polite"></div>`;
    updateOutputMeta();
}

function answerOutput(i) {
    if (out.answered) return;
    out.answered = true;
    const q = out.questions[out.index];
    const correct = i === q.answer;
    if (correct) out.score++;

    $$('[data-out-answer]', outRoot()).forEach((btn) => {
        const n = Number(btn.dataset.outAnswer);
        btn.disabled = true;
        if (n === q.answer) btn.classList.add('is-correct');
        else if (n === i) btn.classList.add('is-wrong');
        else btn.classList.add('is-dim');
    });

    const isLast = out.index === out.questions.length - 1;
    $('#output-feedback').innerHTML = `
        ${feedbackTemplate(correct, correct ? 'სწორია!' : `სწორი პასუხი: ${escapeHtml(q.options[q.answer])}.`, escapeHtml(q.explain))}
        <div class="quiz__nav">
            <button class="btn btn--primary" type="button" data-out-next>${isLast ? 'შედეგი' : 'შემდეგი'}${icon('arrowRight')}</button>
        </div>`;
    updateOutputMeta();
    $('[data-out-next]', outRoot()).focus({ preventScroll: true });
}

function nextOutput() {
    if (out.index < out.questions.length - 1) {
        out.index++;
        renderOutputQuestion();
    } else {
        $('#output-body').innerHTML = resultTemplate(out.score, out.questions.length, 'data-out-restart');
    }
}

function initOutput() {
    startOutput();
    outRoot().addEventListener('click', (e) => {
        const opt = e.target.closest('[data-out-answer]');
        if (opt) return answerOutput(Number(opt.dataset.outAnswer));
        if (e.target.closest('[data-out-next]')) return nextOutput();
        if (e.target.closest('[data-out-restart]')) return startOutput();
    });
}
