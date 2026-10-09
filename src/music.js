'use strict';

/* =========================================================
   6. MUSIC — Giya Kancheli, "Yellow Leaves" (YouTube IFrame API)
      A hidden YouTube player; the header button controls it.
      Browsers block autoplay with sound, so if it fails we start
      on the first interaction — unless the visitor paused it before.
   ========================================================= */

const YT_VIDEOS = ['XVAHq7fzDZk', 'SJ_9Oa8tx2c', 'JPhrc757gog', 'mpTPbaVyXIk']; // fallbacks if one is removed

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

function initMusic() {
    const btn = $('#music-btn');
    const iconBox = $('.music__icon', btn);
    const sub = $('.music__sub', btn);
    const STORAGE_KEY = 'js-leaves-music';
    const DEFAULT_SUB = sub.textContent;
    const VOLUME = 60;
    let player = null;
    let videoIndex = 0;
    let volume = 0;
    let fadeId = null;
    let wanted = false;   // intent: survives the fade-out delay

    const storage = {
        get() { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } },
        set(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch { /* ignore */ } },
    };

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

    function fadeTo(target, done) {
        cancelAnimationFrame(fadeId);
        const step = () => {
            volume += Math.sign(target - volume) * 2;
            if (Math.abs(target - volume) < 2) volume = target;
            player.setVolume(volume);
            if (volume === target) return done?.();
            fadeId = requestAnimationFrame(step);
        };
        step();
    }

    function play() {
        if (!player) return;
        wanted = true;
        render(true);
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
            volume = 0;
            player.setVolume(0);
        }
        player.playVideo();
        fadeTo(VOLUME);
    }

    function pause() {
        wanted = false;
        render(false);
        fadeTo(0, () => player.pauseVideo());
    }

    function startOnFirstInteraction() {
        const events = ['pointerdown', 'keydown', 'touchend'];
        const cleanup = () => events.forEach(ev => window.removeEventListener(ev, handler, true));
        const handler = (e) => {
            cleanup();
            if (btn.contains(e.target) || storage.get() === 'off' || !player) return;
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
        sub.textContent = DEFAULT_SUB;
        player.setVolume(0);
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
        } else if (data === S.PLAYING && !wanted) {
            wanted = true;
            render(true);
        }
    }

    function onError() {
        videoIndex++;
        if (videoIndex < YT_VIDEOS.length) {
            player.cueVideoById(YT_VIDEOS[videoIndex]);
            if (wanted) player.playVideo();
        } else {
            showError('ვიდეო ვერ ჩაიტვირთა');
        }
    }

    // YouTube refuses to play inside pages opened straight from disk
    if (location.protocol === 'file:') {
        return showError('გახსენი Live Server-ით');
    }

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
                videoId: YT_VIDEOS[0],
                playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1, rel: 0 },
                events: { onReady, onStateChange, onError },
            });
        })
        .catch(() => showError('YouTube ვერ ჩაიტვირთა'));
}
