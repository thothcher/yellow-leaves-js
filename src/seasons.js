'use strict';

/* =========================================================
   7. SEASONS — the picker next to the music button.
      Choosing a season switches the song, crossfades the forest
      photo and lets the old leaves fall so new-coloured ones grow.
   ========================================================= */

const SEASON_KEY = 'js-leaves-season';

function savedSeason() {
    let id = null;
    try { id = localStorage.getItem(SEASON_KEY); } catch { /* ignore */ }
    return SEASONS.find(s => s.id === id) || SEASONS[0];
}

function initSeasons(start, onChange) {
    const toggle = $('#season-btn');
    const menu = $('#season-menu');
    let current = start;

    menu.innerHTML = `
        <p class="season-menu__title">სეზონი და მუსიკა</p>
        <div class="season-menu__grid">
            ${SEASONS.map(s => `
                <button class="season" type="button" data-season="${s.id}" aria-pressed="false"
                        style="background-image: url('${s.thumb}')">
                    <span class="season__now" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span class="season__name">${icon(s.icon)}${s.name}</span>
                    <span class="season__track">${s.songs[0].artist} · ${s.songs[0].track}</span>
                </button>`).join('')}
        </div>`;

    function render() {
        toggle.innerHTML = icon(current.icon);
        toggle.title = `სეზონი: ${current.name}`;
        $$('.season', menu).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.season === current.id)));
    }

    function setOpen(open) {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', () => setOpen(menu.hidden));

    menu.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-season]');
        if (!btn) return;
        current = SEASONS.find(s => s.id === btn.dataset.season);
        try { localStorage.setItem(SEASON_KEY, current.id); } catch { /* ignore */ }
        render();
        setOpen(false);
        toggle.focus({ preventScroll: true });
        onChange(current);
    });

    document.addEventListener('click', (e) => {
        if (!menu.hidden && !e.target.closest('.player')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || menu.hidden) return;
        setOpen(false);
        toggle.focus({ preventScroll: true });
    });

    render();
}
