'use strict';

/* =========================================================
   4. QUIZ
   ========================================================= */

const QUIZ_FILTER_KEY = 'js-leaves-quiz-topics';
const MIN_TOPICS = 2;

const quiz = {
    topics: loadQuizTopics(),   // selected topic ids, in TOPICS order
    questions: [],
    index: 0,
    score: 0,
    answered: false,
    visible: false,
};

function loadQuizTopics() {
    const all = TOPICS.map(t => t.id);
    try {
        const saved = JSON.parse(localStorage.getItem(QUIZ_FILTER_KEY));
        const valid = all.filter(id => saved?.includes(id));
        if (valid.length >= MIN_TOPICS) return valid;
    } catch { /* ignore */ }
    return all;
}

function saveQuizTopics() {
    try { localStorage.setItem(QUIZ_FILTER_KEY, JSON.stringify(quiz.topics)); } catch { /* ignore */ }
}

const selectedTopics = () => TOPICS.filter(t => quiz.topics.includes(t.id));

function renderFilter() {
    const allOn = quiz.topics.length === TOPICS.length;
    $('#quiz-filter').innerHTML = `
        <button class="chip chip--all" type="button" data-filter="all" aria-pressed="${allOn}">ყველა</button>
        ${TOPICS.map(t => `
            <button class="chip" type="button" data-filter="${t.id}" aria-pressed="${quiz.topics.includes(t.id)}">
                ${icon(t.icon)}${t.label}
            </button>`).join('')}`;

    const count = QUIZ.filter(q => quiz.topics.includes(q.answer)).length;
    $('#quiz-filter-note').textContent =
        `არჩეულია ${quiz.topics.length} თემა, ${Math.min(count, QUIZ_LENGTH)} კითხვა.`;
}

function toggleTopic(id) {
    const note = $('#quiz-filter-note');
    if (id === 'all') {
        quiz.topics = quiz.topics.length === TOPICS.length
            ? TOPICS.slice(0, MIN_TOPICS).map(t => t.id)    // "all" again → minimum set
            : TOPICS.map(t => t.id);
    } else if (quiz.topics.includes(id)) {
        if (quiz.topics.length <= MIN_TOPICS) {
            note.textContent = `მინიმუმ ${MIN_TOPICS} თემა უნდა იყოს არჩეული, თორემ პასუხი თავისთავად ცხადი იქნება.`;
            note.classList.remove('is-warn');
            void note.offsetWidth;                          // restart the shake animation
            note.classList.add('is-warn');
            return;
        }
        quiz.topics = quiz.topics.filter(t => t !== id);
    } else {
        quiz.topics = TOPICS.map(t => t.id).filter(t => t === id || quiz.topics.includes(t));
    }
    note.classList.remove('is-warn');
    saveQuizTopics();
    renderFilter();
    startQuiz();
}

function startQuiz() {
    const pool = QUIZ.filter(q => quiz.topics.includes(q.answer));
    quiz.questions = shuffle(pool).slice(0, QUIZ_LENGTH);
    quiz.index = 0;
    quiz.score = 0;
    renderQuestion();
}

function updateQuizMeta() {
    const done = quiz.index + (quiz.answered ? 1 : 0);
    const pct = Math.round((done / quiz.questions.length) * 100);
    $('#quiz-score').textContent = `${quiz.score} / ${quiz.questions.length}`;
    const progress = $('#quiz-progress');
    progress.setAttribute('aria-valuenow', pct);
    $('.progress__bar', progress).style.width = `${pct}%`;
}

function renderQuestion() {
    const q = quiz.questions[quiz.index];
    quiz.answered = false;

    $('#quiz-body').innerHTML = `
        <p class="quiz__q">კითხვა ${quiz.index + 1} / ${quiz.questions.length}</p>
        ${codeBlock(q.code)}
        <div class="options" role="group" aria-label="პასუხის ვარიანტები">
            ${selectedTopics().map((t, i) => `
                <button class="option" type="button" data-answer="${t.id}">
                    <span class="option__key">${i + 1}</span>${t.label}
                </button>`).join('')}
        </div>
        <div id="quiz-feedback" aria-live="polite"></div>`;
    updateQuizMeta();
}

function answer(id) {
    if (quiz.answered) return;
    quiz.answered = true;

    const q = quiz.questions[quiz.index];
    const correct = id === q.answer;
    if (correct) quiz.score++;

    $$('.option', $('#quiz')).forEach((btn) => {
        btn.disabled = true;
        const a = btn.dataset.answer;
        if (a === q.answer) btn.classList.add('is-correct');
        else if (a === id) btn.classList.add('is-wrong');
        else btn.classList.add('is-dim');
    });

    const right = TOPICS.find(t => t.id === q.answer);
    const isLast = quiz.index === quiz.questions.length - 1;
    $('#quiz-feedback').innerHTML = `
        ${feedbackTemplate(correct, correct ? 'სწორია!' : `სწორი პასუხი: ${right.label}.`,
            `${q.explain} <a href="#${right.id}">გაიმეორე თემა</a>`)}
        <div class="quiz__nav">
            <button class="btn btn--primary" type="button" data-next>${isLast ? 'შედეგი' : 'შემდეგი'}${icon('arrowRight')}</button>
        </div>`;
    updateQuizMeta();
    $('#quiz [data-next]').focus({ preventScroll: true });
}

function next() {
    if (!quiz.answered) return;
    if (quiz.index < quiz.questions.length - 1) {
        quiz.index++;
        renderQuestion();
        $('.option', $('#quiz')).focus({ preventScroll: true });
    } else {
        renderResult();
    }
}

function renderResult() {
    $('#quiz-body').innerHTML = resultTemplate(quiz.score, quiz.questions.length, 'data-restart');
    $('#quiz [data-restart]').focus({ preventScroll: true });
}

function bindQuizEvents() {
    const body = $('#quiz-body');
    body.addEventListener('click', (e) => {
        const opt = e.target.closest('[data-answer]');
        if (opt) return answer(opt.dataset.answer);
        if (e.target.closest('[data-next]')) return next();
        if (e.target.closest('[data-restart]')) return startQuiz();
    });

    $('#quiz-filter').addEventListener('click', (e) => {
        const chip = e.target.closest('[data-filter]');
        if (chip) toggleTopic(chip.dataset.filter);
    });

    new IntersectionObserver(([entry]) => { quiz.visible = entry.isIntersecting; })
        .observe($('#quiz'));

    document.addEventListener('keydown', (e) => {
        if (!quiz.visible || e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.target.matches('input, textarea')) return;

        const n = Number(e.key);
        const options = selectedTopics();
        if (n >= 1 && n <= options.length && $('.option', $('#quiz'))) {
            answer(options[n - 1].id);
        } else if (e.key === 'Enter' && quiz.answered && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            next();
        }
    });
}
