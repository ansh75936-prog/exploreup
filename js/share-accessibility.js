(function(){
  const btn=document.getElementById('exploreupBottomShare');
  const status=document.getElementById('exploreupShareStatus');
  if(!btn)return;
  function showStatus(message){
    if(!status)return;
    status.textContent=message;
    status.style.display='block';
    clearTimeout(window.__exploreUpShareTimer);
    window.__exploreUpShareTimer=setTimeout(()=>{status.style.display='none'},2200);
  }
  btn.addEventListener('click',async()=>{
    const url=location.href;
    const data={title:'ExploreUP — Explore Uttar Pradesh',text:'Explore Uttar Pradesh with ExploreUP: cities, places, food, stays and travel information.',url};
    try{
      if(navigator.share){
        await navigator.share(data);
        showStatus('Share dialog opened.');
        return;
      }
      if(navigator.clipboard&&window.isSecureContext){
        await navigator.clipboard.writeText(url);
        showStatus('Link copied. Ab share kar sakte ho.');
        return;
      }
      const ta=document.createElement('textarea');
      ta.value=url;ta.style.position='fixed';ta.style.opacity='0';
      document.body.appendChild(ta);ta.select();
      document.execCommand('copy');ta.remove();
      showStatus('Link copied. Ab share kar sakte ho.');
    }catch(e){
      if(e&&e.name==='AbortError')return;
      showStatus('Share nahi ho paya. Link copy karke share kar lo.');
    }
  });
})();

/* ExploreUP polish v1: accessibility + quick navigation */
(function(){
  const main=document.querySelector('main')||document.body;
  if(!document.querySelector('.skip-link')){
    const a=document.createElement('a');a.className='skip-link';a.href='#mainContent';a.textContent='Skip to main content';document.body.prepend(a);
  }
  if(!document.getElementById('mainContent')){
    const target=document.querySelector('.wrap')||document.querySelector('.section');
    if(target)target.id='mainContent';
  }
  if(!document.getElementById('backToTop')){
    const b=document.createElement('button');b.id='backToTop';b.type='button';b.setAttribute('aria-label','Back to top');b.title='Back to top';b.textContent='↑';
    document.body.appendChild(b);
    b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    const sync=()=>b.classList.toggle('show',window.scrollY>500);window.addEventListener('scroll',sync,{passive:true});sync();
  }
})();
