'use strict';

/* =========================================================
   6. MUSIC — one song per season (YouTube IFrame API).
      Autumn is Giya Kancheli's "Yellow Leaves", the others are
      calm music to code to. A hidden player; the header button controls it.
      Browsers block autoplay with sound, so if it fails we start
      on the first interaction — unless the visitor paused it before.
   ========================================================= */

function loadYouTubeApi() {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    return new Promise((resolve, reject) => {
        window.onYouTubeIframeAPIReady = () => resolve(window.YT);
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.onerror = reject;
        document.head.append(script);
    });
}

/** Returns { select(season) } so the season picker can switch songs. */
function initMusic(startSeason) {
    const btn = $('#music-btn');
    const iconBox = $('.music__icon', btn);
    const title = $('.music__title', btn);
    const sub = $('.music__sub', btn);
    const STORAGE_KEY = 'js-leaves-music';
    const VOLUME = 60;
    let season = startSeason;
    let player = null;
    let songIndex = 0;
    let volume = 0;
    let fadeId = null;
    let wanted = false;         // intent: survives the fade-out delay
    let fadeInOnPlay = false;   // a song is loading; fade it in once it really plays

    const storage = {
        get() { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } },
        set(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch { /* ignore */ } },
    };

    const song = () => season.songs[songIndex];

    function showTrack() {
        const { artist, track } = song();
        btn.classList.remove('is-error');
        title.textContent = artist;
        sub.textContent = track;
        btn.title = `${season.name}: ${artist}, ${track}`;
    }

    function render(playing) {
        btn.classList.toggle('is-playing', playing);
        btn.setAttribute('aria-pressed', String(playing));
        btn.setAttribute('aria-label', playing ? 'მუსიკის დაპაუზება' : 'მუსიკის ჩართვა');
        iconBox.innerHTML = icon(playing ? 'pause' : 'play');
    }

    function showError(text) {
        wanted = false;
        render(false);
        btn.classList.add('is-error');
        iconBox.innerHTML = icon('alert');
        sub.textContent = text;
        btn.title = text;
    }

    /** Volume ramp. setInterval keeps going (slowly) in a background tab, rAF would not. */
    function fadeTo(target, ms, done) {
        clearInterval(fadeId);
        const from = volume;
        const start = performance.now();
        fadeId = setInterval(() => {
            const t = Math.min(1, (performance.now() - start) / ms);
            volume = Math.round(from + (target - from) * t);
            player.setVolume(volume);
            if (t < 1) return;
            clearInterval(fadeId);
            done?.();
        }, 30);
    }

    function play() {
        if (!player) return;
        wanted = true;
        render(true);
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            fadeTo(VOLUME, 600);
        } else {
            volume = 0;
            player.setVolume(0);
            fadeInOnPlay = true;
        }
        player.playVideo();
    }

    function pause() {
        wanted = false;
        fadeInOnPlay = false;
        render(false);
        fadeTo(0, 500, () => player.pauseVideo());
    }

    /** Switches to another season's song: the old one fades out, the new one fades in. */
    function select(next) {
        if (next === season) {
            if (!wanted && player) { storage.set('on'); play(); }
            return;
        }
        season = next;
        songIndex = 0;
        if (!player) return showTrack();          // still loading: onReady picks up the new season
        showTrack();
        storage.set('on');
        const load = () => {
            volume = 0;
            player.setVolume(0);
            wanted = true;
            fadeInOnPlay = true;
            render(true);
            player.loadVideoById(song().id);
        };
        if (wanted && volume > 0) fadeTo(0, 700, load);
        else load();
    }

    function startOnFirstInteraction() {
        const events = ['pointerdown', 'keydown', 'touchend'];
        const cleanup = () => events.forEach(ev => window.removeEventListener(ev, handler, true));
        const handler = (e) => {
            cleanup();
            // the player's own buttons start the music themselves
            if (e.target.closest?.('.player') || storage.get() === 'off' || !player) return;
            play();
        };
        events.forEach(ev => window.addEventListener(ev, handler, { capture: true, passive: true }));
    }

    btn.addEventListener('click', () => {
        if (btn.classList.contains('is-error') || !player) return;
        if (wanted) {
            storage.set('off');
            pause();
        } else {
            storage.set('on');
            play();
        }
    });

    function onReady() {
        btn.classList.remove('is-loading');
        showTrack();
        player.setVolume(0);
        if (season !== startSeason) player.cueVideoById(song().id);   // picked while loading
        if (storage.get() === 'off') return render(false);

        play();
        // autoplay with sound is usually blocked — check, then wait for a gesture
        setTimeout(() => {
            if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
                wanted = false;
                render(false);
                startOnFirstInteraction();
            }
        }, 1200);
    }

    function onStateChange({ data }) {
        const S = YT.PlayerState;
        if (data === S.ENDED) {            // loop
            player.seekTo(0);
            player.playVideo();
        } else if (data === S.PAUSED && wanted && volume > 0) {
            wanted = false;                // paused from outside (e.g. media keys)
            render(false);
        } else if (data === S.PLAYING) {
            if (!wanted) {
                wanted = true;
                render(true);
            }
            if (fadeInOnPlay) {
                fadeInOnPlay = false;
                fadeTo(VOLUME, 1500);
            }
        }
    }

    function onError() {
        songIndex++;
        if (songIndex < season.songs.length) {
            showTrack();
            if (wanted) player.loadVideoById(song().id);
            else player.cueVideoById(song().id);
        } else {
            showError('ვიდეო ვერ ჩაიტვირთა');
        }
    }

    // YouTube refuses to play inside pages opened straight from disk
    if (location.protocol === 'file:') {
        showError('გახსენი Live Server-ით');
        return { select() {} };
    }

    showTrack();
    btn.classList.add('is-loading');
    sub.textContent = 'იტვირთება...';

    const host = document.createElement('div');
    host.id = 'yt-player';
    $('#yt-wrap').append(host);

    loadYouTubeApi()
        .then((YT) => {
            player = new YT.Player('yt-player', {
                width: 200,
                height: 200,
                videoId: song().id,
                playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1, rel: 0 },
                events: { onReady, onStateChange, onError },
            });
        })
        .catch(() => showError('YouTube ვერ ჩაიტვირთა'));

    return { select };
}
