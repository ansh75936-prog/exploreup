/* ExploreUP Hotels & Stays — reliable district hotel block fix. */
(function(){
  'use strict';

  var loadPromise=null;

  function modalOpen(){
    var modal=document.getElementById('modal');
    if(!modal) return false;
    return getComputedStyle(modal).display!=='none';
  }

  function districtName(){
    try{
      if(window.currentExploreCity) return String(window.currentExploreCity).trim();
      var modal=document.getElementById('modal');
      var title=modal && modal.querySelector('h1,h2,h3');
      if(title && title.textContent.trim()) return title.textContent.trim();
      var crumb=document.getElementById('breadcrumb');
      if(crumb) return String(crumb.textContent||'').split('›').pop().trim();
    }catch(e){}
    return '';
  }

  function hotelBlock(){
    var stay=document.getElementById('districtStay');
    if(!stay) return null;
    var block=document.getElementById('exploreup-hotels-stays');
    if(!block){
      block=document.createElement('section');
      block.id='exploreup-hotels-stays';
      block.setAttribute('data-exploreup-hotel-placement','districtStay');
      stay.appendChild(block);
    }else if(block.parentElement!==stay){
      stay.appendChild(block);
    }
    block.style.display='block';
    block.style.visibility='visible';
    return block;
  }

  function loadHotels(){
    if(window.ExploreUPHotels && window.ExploreUPHotels.data) return Promise.resolve(true);
    if(loadPromise) return loadPromise;
    loadPromise=new Promise(function(resolve){
      var existing=document.querySelector('script[data-exploreup-hotels-loader]');
      if(existing){
        existing.addEventListener('load',function(){resolve(true)},{once:true});
        existing.addEventListener('error',function(){resolve(false)},{once:true});
        setTimeout(function(){resolve(!!(window.ExploreUPHotels&&window.ExploreUPHotels.data))},2000);
        return;
      }
      var s=document.createElement('script');
      s.src='./district-hotels.js?v=20260915-hotels-fix';
      s.async=true;
      s.setAttribute('data-exploreup-hotels-loader','1');
      s.onload=function(){resolve(!!(window.ExploreUPHotels&&window.ExploreUPHotels.data));};
      s.onerror=function(){resolve(false);};
      document.head.appendChild(s);
    });
    return loadPromise;
  }

  function render(){
    if(!modalOpen()) return false;
    var block=hotelBlock();
    var api=window.ExploreUPHotels;
    if(!block || !api || !api.data) return false;
    var city=districtName();
    var rows=api.get ? api.get(city) : api.data[city];
    if(!Array.isArray(rows)){
      var keys=Object.keys(api.data);
      var wanted=String(city||'').toLowerCase().replace(/\s+/g,' ').trim();
      var key=keys.find(function(k){return String(k).toLowerCase().replace(/\s+/g,' ').trim()===wanted;});
      rows=key?api.data[key]:null;
    }
    if(!Array.isArray(rows)){
      block.innerHTML='';
      return false;
    }

    function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    var html='<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><h3 style="margin:0">🏨 Hotels &amp; Stays</h3><p style="margin:5px 0;color:#60708a;font-size:12px">Hotel information supplied for ExploreUP. Please confirm current details directly before booking.</p></div><span style="background:#eef5ff;color:#145eaf;padding:6px 9px;border-radius:999px;font-size:11px;font-weight:800">'+rows.length+' listings</span></div>';
    html+='<div class="detailgrid">';
    rows.forEach(function(r){
      var phone=String(r[2]||'');
      html+='<div class="detail"><b>'+esc(r[0])+'</b><small>'+esc(r[1])+'</small><div style="margin-top:9px;display:flex;gap:7px;flex-wrap:wrap">';
      if(phone) html+='<a href="tel:'+esc(phone.replace(/\s+/g,''))+'" style="color:#0b67d1;font-weight:800;font-size:12px">📞 '+esc(phone)+'</a>';
      html+='<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(String(r[0]||'')+' '+String(r[1]||''))+'" style="color:#0b67d1;font-weight:800;font-size:12px">📍 Directions</a></div></div>';
    });
    html+='</div>';
    block.innerHTML=html;
    return true;
  }

  var timer=null;
  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(function(){
      if(!modalOpen()) return;
      loadHotels().then(function(){
        if(!modalOpen()) return;
        try{ if(window.ExploreUPHotels&&typeof window.ExploreUPHotels.mount==='function') window.ExploreUPHotels.mount(); }catch(e){}
        render();
      });
    },60);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  document.addEventListener('click',schedule,true);
  document.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')schedule();},true);
  new MutationObserver(function(){if(modalOpen()) schedule();}).observe(document.documentElement,{childList:true,subtree:true});
})();
