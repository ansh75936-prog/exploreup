// ExploreUP district data: Varanasi
window.ExploreUPDistricts=window.ExploreUPDistricts||[];
window.ExploreUPDistricts.push({"name":"Varanasi","tag":"Ghats, spirituality & Banarasi culture","img":"https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80","video":"https://cdn.jsdelivr.net/gh/ansh75936-prog/exploreup@main/images/varanasi-under-25mb-faststart-1.mp4?v=20260927","places":"Dashashwamedh Ghat, Kashi Vishwanath, Sarnath","food":"Kachori-Sabzi, Banarasi Paan, Lassi","shop":"Banarasi silk & handicrafts","time":"Oct – Mar","budget":"₹1,000 – ₹3,500/day","tip":"Check local timings, transport and seasonal conditions before visiting.","about":"Varanasi is one of the destinations covered by ExploreUP, with local heritage, food, culture and practical travel information.","distance":"Local guide","fee":"Varies","rating":"—"});

// ExploreUP Varanasi video playback recovery
(function(){
  'use strict';
  const SOURCES=[
    'https://raw.githubusercontent.com/ansh75936-prog/exploreup/main/images/varanasi-under-25mb-faststart-1.mp4',
    'https://cdn.jsdelivr.net/gh/ansh75936-prog/exploreup@main/images/varanasi-under-25mb-faststart-1.mp4',
    './images/varanasi-under-25mb-faststart-1.mp4'
  ];
  let sourceIndex=0;
  let lastVideo=null;
  function isVaranasi(){
    return String(window.currentExploreCity||window.currentExploreCityName||'').trim().toLowerCase()==='varanasi';
  }
  function attach(){
    if(!isVaranasi()) return false;
    const hero=document.getElementById('modalHero');
    const video=document.getElementById('districtHeroVideo');
    const sound=document.getElementById('districtHeroSound');
    if(!hero||!video) return false;
    if(video===lastVideo && video.dataset.exploreupVideoReady==='1') return true;
    lastVideo=video;
    video.dataset.exploreupVideoReady='1';
    hero.classList.add('has-district-video');
    if(sound) sound.hidden=false;
    video.style.display='block';
    video.style.visibility='visible';
    video.style.opacity='1';
    video.muted=true;
    video.defaultMuted=true;
    video.autoplay=true;
    video.loop=true;
    video.playsInline=true;
    video.preload='auto';
    video.poster='https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85';
    const load=()=>{
      if(sourceIndex>=SOURCES.length) return;
      video.src=SOURCES[sourceIndex];
      video.load();
      const p=video.play();
      if(p&&typeof p.catch==='function') p.catch(function(){});
    };
    video.onerror=()=>{
      sourceIndex++;
      if(sourceIndex<SOURCES.length) load();
    };
    video.onloadeddata=()=>{
      hero.classList.add('has-district-video');
      const p=video.play();
      if(p&&typeof p.catch==='function') p.catch(function(){});
    };
    load();
    return true;
  }
  function start(){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(attach() || tries>=160) clearInterval(timer);
    },250);
    attach();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();