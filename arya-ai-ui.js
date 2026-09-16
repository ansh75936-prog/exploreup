/* ExploreUP Arya AI — V20 UI compatibility mode
 * Keep Arya's original V20 UI/handlers in index-1.html.
 * This file intentionally does not add another send button, response box,
 * click handler, keyboard handler, or layout wrapper.
 * FREE/API wiring is handled by the existing Arya runtime only.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.freeMode=true;
  AI.uiBridgeVersion='v20-compat';
  AI.uiWired=false;
})();