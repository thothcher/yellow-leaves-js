'use strict';

/* =========================================================
   2. HELPERS
   ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const escapeHtml = (str) =>
    str.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

const KEYWORDS = 'const|let|var|if|else|switch|case|default|break|continue|for|while|do|of|in|function|return|class|constructor|new|this|extends|super|static|async|await|try|catch|throw|typeof|true|false|undefined|null';
const TOKEN = new RegExp(
    String.raw`(\/\/[^\n]*)` +                                                   // 1 comment
    String.raw`|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\x60(?:[^\x60\\]|\\.)*\x60)` + // 2 string
    String.raw`|\b(${KEYWORDS})\b` +                                             // 3 keyword
    String.raw`|\b(\d+(?:\.\d+)?)\b` +                                           // 4 number
    String.raw`|(?<![\w$])([A-Za-z_$][\w$]*)(?=\s*\()`,                          // 5 call
    'g'
);
const TOKEN_CLASS = [null, 'c', 's', 'k', 'n', 'f'];

/** Minimal JS syntax highlighter: returns safe HTML. */
function highlight(code) {
    let html = '';
    let last = 0;
    for (const m of code.matchAll(TOKEN)) {
        html += escapeHtml(code.slice(last, m.index));
        const group = m.findIndex((g, i) => i > 0 && g !== undefined);
        html += `<span class="${TOKEN_CLASS[group]}">${escapeHtml(m[0])}</span>`;
        last = m.index + m[0].length;
    }
    return html + escapeHtml(code.slice(last));
}

const codeBlock = (code) => `<pre class="code"><code>${highlight(code)}</code></pre>`;

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Final score screen, shared by every practice section. */
function resultTemplate(score, total, restartAttr) {
    const ratio = total ? score / total : 0;
    const [iconName, text] =
        ratio === 1 ? ['trophy', 'იდეალურია! ყველა ფოთოლი მწვანეა.'] :
        ratio >= 0.75 ? ['leaf', 'ძალიან კარგია! რამდენიმე ფოთოლი ცოტა გაყვითლდა.'] :
        ratio >= 0.5 ? ['sprout', 'ნახევარზე მეტი სწორია. გადახედე თემებს და სცადე თავიდან.'] :
                       ['rotate', 'ჯერ ადრეა. დაბრუნდი ზემოთ და კიდევ ერთხელ გაიარე ჯაჭვი.'];
    return `
        <div class="result">
            <div class="result__icon">${icon(iconName)}</div>
            <p class="result__score">${score} / ${total}</p>
            <p class="result__text">${text}</p>
            <button class="btn btn--primary" type="button" ${restartAttr}>${icon('rotate')}თავიდან</button>
        </div>`;
}

/** Green / yellow feedback box. */
function feedbackTemplate(ok, title, body) {
    return `
        <div class="feedback ${ok ? 'feedback--ok' : 'feedback--bad'}">
            ${icon(ok ? 'check' : 'x', 'feedback__icon')}
            <div><b>${title}</b> ${body}</div>
        </div>`;
}
