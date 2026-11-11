// ExploreUP V19 consolidated service renderer
(function(){
 function ensureServiceCards(){try{const modal=document.getElementById('modal'),h=document.getElementById('hotelContacts'),p=document.getElementById('hospitalContacts');if(!modal||modal.style.display!=='block'||typeof renderContacts!=='function'||!currentExploreCity)return;if(h&&!h.innerHTML.trim()||p&&!p.innerHTML.trim())renderContacts(currentExploreCity);[h,p].forEach(g=>g&&g.querySelectorAll('.contact-card').forEach(c=>{c.style.display='block';c.style.visibility='visible';c.style.opacity='1'}))}catch(e){console.warn('ExploreUP service renderer:',e)}}
 document.addEventListener('DOMContentLoaded',()=>{const modal=document.getElementById('modal');if(modal&&window.MutationObserver)new MutationObserver(ensureServiceCards).observe(modal,{attributes:true,attributeFilter:['style','aria-hidden'],subtree:true,childList:true});setTimeout(ensureServiceCards,300)},{once:true});
 window.addEventListener('load',ensureServiceCards);
})();
window.addEventListener('online',()=>{const s=document.getElementById('planStatus');if(s&&document.getElementById('planMakerModal')?.classList.contains('show'))s.textContent='🌐 Internet connected. Smart Plan is available.'});
window.addEventListener('offline',()=>{const s=document.getElementById('planStatus');if(s&&document.getElementById('planMakerModal')?.classList.contains('show'))s.textContent='📴 You are offline. Use Quick Plan, or reconnect for Smart Plan.'});
