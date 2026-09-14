/* ExploreUP Priority 5 — Arya knowledge add-on. Does not replace Arya's existing answers. */
(function(){
'use strict';
function attach(){
  if(typeof window.aryaAnswer!=='function'||window.aryaAnswer.__priority5Arya)return;
  const original=window.aryaAnswer;
  const wrapped=async function(q,lang){
    const answer=await original.apply(this,arguments);
    const x=String(q||'').toLowerCase();
    if(!/smart travel|priority 5|weather|festival|event|wishlist|favourite|favorite|save plan|share plan|route|timing|saved places|trip wishlist/.test(x))return answer;
    return answer+'\n\nPriority 5 Smart Travel knowledge:\n• Arya can refine a 1–7 day itinerary using destination places, food and travel style.\n• Wishlist → Trip lets saved ExploreUP places be selected as planned stops and shown with the trip plan.\n• Route order is a practical suggestion, not GPS navigation or guaranteed travel time.\n• Seasonal event guidance is a general planning aid; exact dates and local schedules should be verified.\n• Live weather is optional and needs internet; forecasts can change.\n• Saved plans and wishlist selections stay on this device. Share Plan uses the phone share feature or copy fallback.\n• Arya should not claim that wishlist items, weather, event dates or travel times are guaranteed live data unless a verified live source is available.';
  };
  wrapped.__priority5Arya=true;
  window.aryaAnswer=wrapped;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});
else attach();
setTimeout(attach,500);
setTimeout(attach,1500);
})();
