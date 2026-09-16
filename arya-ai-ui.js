/* ExploreUP Arya AI — V20 UI compatibility layer
 * The V20 page keeps ownership of the Arya panel, input, send button,
 * Enter-key handling, bubbles and layout.
 * OpenAI routing is owned by arya-ai-bridge.js only.
 * This file intentionally adds NO event listeners and NO second send handler.
 */
(function(){
  'use strict';
  const AI=window.ExploreUPAryaAI=window.ExploreUPAryaAI||{};
  AI.uiBridgeVersion='v20-openai-single-handler';
  AI.uiWired=false;
})();
