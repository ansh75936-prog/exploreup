/* ExploreUP Phase 2 feature motion. Progressive enhancement; preserves existing handlers. */
(function(){
 'use strict';
 const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const revealSelector=[
  '.interactive-map-section','.up-map-card','.eu-region-panel','.eu-why-panel',
  '.eu-featured-card','.festival','.trail','.foodcard','.district-media-section',
  '#districtKnowledgeSection','.district-tools','#districtPlanner','.footer',
  '.comparepanel','.favpanel','#planMakerModal'
 ].join(',');
 function visible(el){return el&& !el.closest('[hidden],[aria-hidden="true"]') && getComputedStyle(el).display!=='none';}
 function addMotion(root){
  if(!root||root.nodeType!==1)return;
  if(root.matches(revealSelector)&&visible(root))root.classList.add('eu-motion-reveal');
  root.querySelectorAll&&root.querySelectorAll(revealSelector).forEach(el=>{if(visible(el))el.classList.add('eu-motion-reveal');});
  const groups=root.matches('.eu-region-grid,.eu-featured-grid,.foodgrid,.trails,.comparegrid')?[root]:[];
  root.querySelectorAll&&root.querySelectorAll('.eu-region-grid,.eu-featured-grid,.foodgrid,.trails,.comparegrid').forEach(el=>groups.push(el));
  groups.forEach(group=>{group.classList.add('eu-motion-stagger');Array.from(group.children).forEach((child,i)=>child.style.setProperty('--eu-motion-index',Math.min(i,8)));});
 }
 function init(){
  if(reduce)return;
  addMotion(document.body);
  if('IntersectionObserver'in window){
   const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('eu-motion-visible');io.unobserve(entry.target);}
   }),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
   document.querySelectorAll('.eu-motion-reveal').forEach(el=>io.observe(el));
   const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
    if(node.nodeType===1){addMotion(node);node.querySelectorAll&&node.querySelectorAll('.eu-motion-reveal').forEach(el=>io.observe(el));}
   })));
   observer.observe(document.body,{childList:true,subtree:true});
  }else document.querySelectorAll('.eu-motion-reveal').forEach(el=>el.classList.add('eu-motion-visible'));
  // Map dots receive a restrained entrance; existing click/tooltip behavior is untouched.
  document.querySelectorAll('.map-dot,.map-node').forEach((pin,i)=>{pin.classList.add('eu-map-pin-enter');pin.style.setProperty('--eu-motion-delay',Math.min(i,12)*35+'ms');});
  // Observe new map pins and Arya chat messages without intercepting events.
  const chat=document.getElementById('aryaBody');
  if(chat)new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
   if(node.nodeType===1&&node.matches('.arya-msg'))node.classList.add('eu-message-enter');
   else if(node.nodeType===1)node.querySelectorAll&&node.querySelectorAll('.arya-msg').forEach(msg=>msg.classList.add('eu-message-enter'));
  }))).observe(chat,{childList:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();