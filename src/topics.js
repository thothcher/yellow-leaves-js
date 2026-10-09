'use strict';

/* =========================================================
   TOPICS — render cards + sticky chain nav
   ========================================================= */

// the chain = 8 topics + the practice area at the end
const CHAIN = [
    ...TOPICS.map(t => ({ id: t.id, icon: t.icon, title: t.title, short: t.label.length <= 3 ? t.label : t.en })),
    { id: 'practice', icon: 'target', title: 'პრაქტიკა', short: 'პრაქტიკა' },
];

function topicTemplate(topic, i) {
    const prev = TOPICS[i - 1];
    const next = TOPICS[i + 1];
    const links = [
        prev && `<a class="chip-link" href="#${prev.id}">${icon('arrowUp')}ეყრდნობა: ${prev.title}</a>`,
        next && `<a class="chip-link chip-link--next" href="#${next.id}">${icon('arrowDown')}ხსნის: ${next.title}</a>`,
        !next && `<a class="chip-link chip-link--next" href="#practice">${icon('arrowDown')}შეამოწმე თავი: პრაქტიკა</a>`,
    ].filter(Boolean).join('');

    return `
    <article class="topic card" id="${topic.id}" aria-labelledby="${topic.id}-title">
        <header class="topic__head">
            <span class="topic__icon">${icon(topic.icon)}</span>
            <div>
                <p class="topic__step">${i + 1} / ${TOPICS.length}</p>
                <h2 class="topic__title" id="${topic.id}-title">${topic.title}<span class="topic__en">${topic.en}</span></h2>
            </div>
        </header>

        <p class="topic__summary">${topic.summary}</p>

        <div class="explain">
            <div class="analogy">
                <span class="analogy__icon">${icon('chat')}</span>
                <div>
                    <p class="explain__label">ცხოვრებისეული მაგალითი</p>
                    <p>${escapeHtml(topic.analogy)}</p>
                </div>
            </div>
            <div class="keypoints">
                <p class="explain__label">დაიმახსოვრე</p>
                <ul>${topic.keyPoints.map(k => `<li>${icon('check')}<span>${escapeHtml(k)}</span></li>`).join('')}</ul>
            </div>
        </div>

        <div class="links">${links}</div>

        ${codeBlock(topic.code)}

        <div class="topic__actions">
            <button class="btn btn--primary" type="button" data-run="${topic.id}">${icon('play')}გაუშვი</button>
            <button class="btn toggle" type="button" aria-expanded="false" aria-controls="${topic.id}-more">
                <span class="toggle__text">მეტის ნახვა</span>${icon('chevronDown', 'toggle__arrow')}
            </button>
        </div>
        <output class="output" id="${topic.id}-out" aria-live="polite"></output>

        <div class="more" id="${topic.id}-more">
            <div class="more__inner" inert>
                <div class="more__content">
                    <p class="bridge">${icon('link')}<span>${escapeHtml(topic.bridge)}</span></p>
                    <h3>${topic.more.title}</h3>
                    <ul class="points">${topic.more.points.map(p => `<li>${p}</li>`).join('')}</ul>
                    ${codeBlock(topic.more.code)}
                    <p class="tip">${icon('alert')}<span>${topic.more.tip}</span></p>
                </div>
            </div>
        </div>
    </article>`;
}

function renderTopics() {
    const tpl = document.createElement('template');
    tpl.innerHTML = TOPICS.map(topicTemplate).join('');
    $('#topics').append(tpl.content);
}

function renderChain() {
    const list = $('#chain');
    const frag = document.createDocumentFragment();

    const progress = document.createElement('li');
    progress.className = 'chain__progress';
    progress.setAttribute('aria-hidden', 'true');
    frag.append(progress);

    CHAIN.forEach((c) => {
        const li = document.createElement('li');
        li.className = `chain__item${c.id === 'practice' ? ' chain__item--practice' : ''}`;
        li.innerHTML = `
            <a class="chain__link" href="#${c.id}" title="${c.title}">
                <span class="chain__dot">${icon(c.icon)}</span>
                <span class="chain__label">${c.short}</span>
            </a>`;
        frag.append(li);
    });
    list.append(frag);
}

function setActiveChain(id) {
    const index = CHAIN.findIndex(c => c.id === id);
    $$('.chain__link').forEach((link, i) => {
        const active = i === index;
        link.classList.toggle('is-active', active);
        link.classList.toggle('is-done', i < index);
        if (active) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
    });
    $('#chain').style.setProperty('--f', Math.max(0, index) / (CHAIN.length - 1));
}

function observeSections() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveChain(entry.target.id);
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    CHAIN.forEach(c => observer.observe(document.getElementById(c.id)));
}

function bindTopicEvents() {
    $('#topics').addEventListener('click', async (e) => {
        const toggle = e.target.closest('.toggle');
        if (toggle) {
            const panel = document.getElementById(toggle.getAttribute('aria-controls'));
            const open = toggle.getAttribute('aria-expanded') !== 'true';
            toggle.setAttribute('aria-expanded', String(open));
            $('.toggle__text', toggle).textContent = open ? 'ნაკლები' : 'მეტის ნახვა';
            panel.classList.toggle('is-open', open);
            panel.firstElementChild.inert = !open;
            return;
        }

        const runBtn = e.target.closest('[data-run]');
        if (runBtn) {
            const topic = TOPICS.find(t => t.id === runBtn.dataset.run);
            const out = document.getElementById(`${topic.id}-out`);
            out.classList.remove('is-error');
            runBtn.disabled = true;
            out.textContent = 'მუშავდება...';
            try {
                const result = await topic.run(out);
                if (typeof result === 'string') out.textContent = result;
            } catch (err) {
                out.classList.add('is-error');
                out.textContent = `შეცდომა: ${err.message}\nშეამოწმე ინტერნეტი. სწორედ ამ შემთხვევისთვის გვჭირდება try/catch.`;
            } finally {
                runBtn.disabled = false;
            }
        }
    });
}
