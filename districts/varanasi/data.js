// ExploreUP district data: Varanasi
window.ExploreUPDistricts=window.ExploreUPDistricts||[];
window.ExploreUPDistricts.push({"name":"Varanasi","tag":"Ghats, spirituality & Banarasi culture","img":"https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80","video":"https://exploreup-five.vercel.app/images/varanasi-under-25mb-faststart-1.mp4?v=20260927","places":"Dashashwamedh Ghat, Kashi Vishwanath, Sarnath","food":"Kachori-Sabzi, Banarasi Paan, Lassi","shop":"Banarasi silk & handicrafts","time":"Oct – Mar","budget":"₹1,000 – ₹3,500/day","tip":"Check local timings, transport and seasonal conditions before visiting.","about":"Varanasi is one of the destinations covered by ExploreUP, with local heritage, food, culture and practical travel information.","distance":"Local guide","fee":"Varies","rating":"—"});


// ExploreUP Varanasi video visibility/playback recovery
(function(){
  'use strict';
  const VIDEO='https://exploreup-five.vercel.app/images/varanasi-under-25mb-faststart-1.mp4?v=20260927';
  function recover(){
    const name=String(window.currentExploreCity||'').trim().toLowerCase();
    if(name!=='varanasi') return false;
    const hero=document.getElementById('modalHero');
    const video=document.getElementById('districtHeroVideo');
    if(!hero||!video) return false;
    hero.classList.add('has-district-video');
    video.style.display='block';
    video.style.opacity='1';
    video.muted=true;
    video.defaultMuted=true;
    video.autoplay=true;
    video.loop=true;
    video.playsInline=true;
    if(!video.src || !video.src.includes('varanasi-under-25mb-faststart-1.mp4')){
      video.src=VIDEO;
      video.load();
    }
    const p=video.play();
    if(p&&typeof p.catch==='function') p.catch(()=>{});
    return true;
  }
  function start(){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(recover() || tries>=100) clearInterval(timer);
    },300);
    recover();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
