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

initLeaves();
initMusic();
