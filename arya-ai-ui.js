/* ExploreUP Arya AI — FREE/local UI safety bridge
 * Deliberately does not intercept global clicks or open/close controls.
 * The page's existing Arya UI owns the panel and send controls.
 * This file only marks Arya as FREE/local mode.
 */
(function(){
  'use strict';
  const AI = window.ExploreUPAryaAI = window.ExploreUPAryaAI || {};
  AI.freeMode = true;
  AI.uiWired = false;
  AI.uiBridgeVersion = 'safe-free-1';
})();
