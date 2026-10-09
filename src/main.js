'use strict';

/* =========================================================
   INIT
   ========================================================= */

renderChain();
renderTopics();
bindTopicEvents();
observeSections();
setActiveChain(TOPICS[0].id);

renderFilter();
startQuiz();
bindQuizEvents();
initBugs();
initOrder();
initOutput();

// one season drives the forest photo, the leaf colours and the song
const season = savedSeason();
initForest(season);
const leafScene = initLeaves(season);
const music = initMusic(season);
initSeasons(season, (next) => {
    setForest(next);
    leafScene.setSeason(next);
    music.select(next);
});
