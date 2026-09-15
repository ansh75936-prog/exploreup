/* ExploreUP Hotels & Stays — reliable district hotel block fix. */
(function(){
  'use strict';

  var loadPromise=null, timer=null, lastDistrict='';

  function modalOpen(){
    var modal=document.getElementById('modal');
    return !!modal && getComputedStyle(modal).display!=='none';
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
        existing.addEventListener('load',function(){resolve(!!(window.ExploreUPHotels&&window.ExploreUPHotels.data));},{once:true});
        existing.addEventListener('error',function(){resolve(false);},{once:true});
        setTimeout(function(){resolve(!!(window.ExploreUPHotels&&window.ExploreUPHotels.data));},2000);
        return;
      }
      var s=document.createElement('script');
      s.src='./district-hotels.js?v=20260915-hotels-fix2';
      s.async=true;
      s.setAttribute('data-exploreup-hotels-loader','1');
      s.onload=function(){resolve(!!(window.ExploreUPHotels&&window.ExploreUPHotels.data));};
      s.onerror=function(){resolve(false);};
      document.head.appendChild(s);
    });
    return loadPromise;
  }

  function findRows(city,api){
    if(!api || !api.data) return null;
    var rows=api.get ? api.get(city) : api.data[city];
    if(Array.isArray(rows)) return rows;
    var aliases=window.ExploreUPHotelAliases||{};
    var alias=aliases[city];
    if(alias){
      rows=api.get ? api.get(alias) : api.data[alias];
      if(Array.isArray(rows)) return rows;
    }
    var wanted=String(city||'').toLowerCase().replace(/\s+/g,' ').trim();
    var key=Object.keys(api.data).find(function(k){return String(k).toLowerCase().replace(/\s+/g,' ').trim()===wanted;});
    if(key) return api.data[key];
    return null;
  }

  function loadAliases(){
    if(window.ExploreUPHotelAliases) return Promise.resolve(true);
    return new Promise(function(resolve){
      var s=document.createElement('script');
      s.src='./hotel-district-aliases.js?v=20260915';
      s.async=true;
      s.onload=function(){resolve(!!window.ExploreUPHotelAliases);};
      s.onerror=function(){resolve(false);};
      document.head.appendChild(s);
    });
  }

  function render(){
    if(!modalOpen()) return false;
    var block=hotelBlock(), api=window.ExploreUPHotels;
    if(!block || !api || !api.data) return false;
    var city=districtName();
    var rows=findRows(city,api);
    if(!Array.isArray(rows)){
      block.innerHTML='';
      return false;
    }
    function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    var html='<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><h3 style="margin:0">🏨 Hotels &amp; Stays</h3><p style="margin:5px 0;color:#60708a;font-size:12px">Hotel information supplied for ExploreUP. Please confirm current details directly before booking.</p></div><span style="background:#eef5ff;color:#145eaf;padding:6px 9px;border-radius:999px;font-size:11px;font-weight:800">'+rows.length+' listings</span></div><div class="detailgrid">';
    rows.forEach(function(r){
      var phone=String(r[2]||'');
      html+='<div class="detail"><b>'+esc(r[0])+'</b><small>'+esc(r[1])+'</small><div style="margin-top:9px;display:flex;gap:7px;flex-wrap:wrap">';
      if(phone) html+='<a href="tel:'+esc(phone.replace(/\s+/g,''))+'" style="color:#0b67d1;font-weight:800;font-size:12px">📞 '+esc(phone)+'</a>';
      html+='<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(String(r[0]||'')+' '+String(r[1]||''))+'" style="color:#0b67d1;font-weight:800;font-size:12px">📍 Directions</a></div></div>';
    });
    block.innerHTML=html+'</div>';
    return true;
  }

  function schedule(force){
    clearTimeout(timer);
    timer=setTimeout(function(){
      if(!modalOpen()) return;
      Promise.all([loadHotels(),loadAliases()]).then(function(){
        if(!modalOpen()) return;
        try{if(window.ExploreUPHotels&&typeof window.ExploreUPHotels.mount==='function')window.ExploreUPHotels.mount();}catch(e){}
        render();
        lastDistrict=districtName();
      });
    },force?20:100);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){schedule(true);},{once:true});
  else schedule(true);
  document.addEventListener('click',function(){if(modalOpen())schedule(false);},true);
  document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&modalOpen())schedule(false);},true);

  /* Watch only DOM insertion/removal, not style/class attributes. This prevents
     the hotel renderer from triggering itself repeatedly and wasting CPU. */
  new MutationObserver(function(mutations){
    if(!modalOpen()) return;
    var relevant=mutations.some(function(m){
      if(m.type!=='childList') return false;
      return Array.from(m.addedNodes||[]).some(function(n){
        return n.nodeType===1 && (n.id==='modal'||n.id==='districtStay'||(n.querySelector&&n.querySelector('#districtStay,#modal')));
      });
    });
    if(relevant || districtName()!==lastDistrict) schedule(false);
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
