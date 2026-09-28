// ExploreUP district data: Varanasi
window.ExploreUPDistricts=window.ExploreUPDistricts||[];
window.ExploreUPDistricts.push({"name":"Varanasi","tag":"Ghats, spirituality & Banarasi culture","img":"https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80","video":"https://cdn.jsdelivr.net/gh/ansh75936-prog/exploreup@main/images/varanasi-under-25mb-faststart-1.mp4?v=20260927","places":"Dashashwamedh Ghat, Kashi Vishwanath, Sarnath","food":"Kachori-Sabzi, Banarasi Paan, Lassi","shop":"Banarasi silk & handicrafts","time":"Oct – Mar","budget":"₹1,000 – ₹3,500/day","tip":"Check local timings, transport and seasonal conditions before visiting.","about":"Varanasi is one of the destinations covered by ExploreUP, with local heritage, food, culture and practical travel information.","distance":"Local guide","fee":"Varies","rating":"—"});

// ExploreUP Varanasi video playback recovery
(function(){
  'use strict';
  const SOURCES=[
    'https://raw.githubusercontent.com/ansh75936-prog/exploreup/main/images/varanasi-under-25mb-faststart-1.mp4?v=20260928',
    'https://cdn.jsdelivr.net/gh/ansh75936-prog/exploreup@main/images/varanasi-under-25mb-faststart-1.mp4?v=20260928',
    './images/varanasi-under-25mb-faststart-1.mp4?v=20260928'
  ];
  let lastVideo=null;
  let sourceIndex=0;

  function isVaranasi(){
    return String(window.currentExploreCity||window.currentExploreCityName||'').trim().toLowerCase()==='varanasi';
  }

  function attach(){
    if(!isVaranasi()) return false;

    const hero=document.getElementById('modalHero');
    const video=document.getElementById('districtHeroVideo');
    const sound=document.getElementById('districtHeroSound');
    if(!hero||!video) return false;

    if(video===lastVideo && video.dataset.exploreupVideoState) return true;

    lastVideo=video;
    sourceIndex=0;
    video.dataset.exploreupVideoState='loading';

    hero.classList.remove('has-district-video');
    if(sound) sound.hidden=true;

    video.style.display='block';
    video.style.visibility='visible';
    video.style.opacity='0';
    video.muted=true;
    video.defaultMuted=true;
    video.autoplay=true;
    video.loop=true;
    video.playsInline=true;
    video.preload='auto';
    video.disablePictureInPicture=true;
    video.disableRemotePlayback=true;

    const showVideo=()=>{
      if(!isVaranasi()) return;
      video.dataset.exploreupVideoState='ready';
      video.style.opacity='1';
      hero.classList.add('has-district-video');
      if(sound) sound.hidden=false;
      const p=video.play();
      if(p&&typeof p.catch==='function') p.catch(function(){});
    };

    const load=()=>{
      if(sourceIndex>=SOURCES.length){
        video.dataset.exploreupVideoState='failed';
        video.style.opacity='0';
        hero.classList.remove('has-district-video');
        if(sound) sound.hidden=true;
        return;
      }
      video.src=SOURCES[sourceIndex];
      video.removeAttribute('poster');
      video.load();
      const p=video.play();
      if(p&&typeof p.catch==='function') p.catch(function(){});
    };

    video.onerror=()=>{
      sourceIndex++;
      video.dataset.exploreupVideoState='retrying';
      load();
    };
    video.onloadeddata=showVideo;
    video.oncanplay=showVideo;
    video.onplaying=showVideo;

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
})();\n