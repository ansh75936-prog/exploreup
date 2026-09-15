/* ExploreUP Hotels & Stays — district hotel block placement fix. */
(function(){
  'use strict';

  function isOpen(){
    var modal=document.getElementById('modal');
    return !!(modal && getComputedStyle(modal).display !== 'none');
  }

  function getStay(){
    var stay=document.getElementById('districtStay');
    return stay || null;
  }

  function getDistrictName(){
    try{
      if(window.currentExploreCity) return String(window.currentExploreCity).trim();
      var modal=document.getElementById('modal');
      if(!modal) return '';
      var title=modal.querySelector('h1,h2,h3');
      return title ? String(title.textContent||'').trim() : '';
    }catch(e){ return ''; }
  }

  function ensureHotelBlock(){
    try{
      if(!isOpen()) return null;
      var stay=getStay();
      if(!stay) return null;
      var block=document.getElementById('exploreup-hotels-stays');
      if(!block){
        block=document.createElement('section');
        block.id='exploreup-hotels-stays';
        block.setAttribute('data-exploreup-hotel-placement','districtStay');
        block.style.display='block';
        block.style.visibility='visible';
        block.style.marginTop='24px';
        block.style.padding='18px';
        block.style.border='1px solid #e1eaf4';
        block.style.borderRadius='18px';
        block.style.background='#fff';
        stay.appendChild(block);
      }else if(block.parentElement!==stay){
        stay.appendChild(block);
      }
      block.style.display='block';
      block.style.visibility='visible';
      return block;
    }catch(e){ return null; }
  }

  function renderFallback(){
    try{
      var block=ensureHotelBlock();
      if(!block) return false;
      var api=window.ExploreUPHotels;
      if(!api || !api.data) return false;
      var city=getDistrictName();
      var rows=api.data[city];
      if(!rows){
        var key=Object.keys(api.data).find(function(k){return String(k).toLowerCase()===String(city).toLowerCase();});
        rows=key?api.data[key]:null;
      }
      if(!Array.isArray(rows)) return false;
      var html='<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px"><div><div style="font-size:22px;font-weight:800">🏨 Hotels &amp; Stays</div><div style="font-size:12px;color:#60708a;margin-top:4px">'+rows.length+' listings</div></div></div>';
      html+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">';
      rows.forEach(function(row){
        var name=String(row[0]||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
        var address=String(row[1]||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
        var phone=String(row[2]||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
        html+='<article style="border:1px solid #e1eaf4;border-radius:14px;padding:14px;background:#f8fbff"><b style="display:block;margin-bottom:7px">'+name+'</b>';
        if(address) html+='<div style="font-size:12px;color:#60708a;line-height:1.5">📍 '+address+'</div>';
        if(phone) html+='<div style="font-size:12px;color:#1559a5;margin-top:7px">☎️ '+phone+'</div>';
        html+='</article>';
      });
      html+='</div>';
      block.innerHTML=html;
      return true;
    }catch(e){ return false; }
  }

  var pending=false;
  function scheduleMount(){
    if(pending) return;
    pending=true;
    setTimeout(function(){
      pending=false;
      if(!isOpen()) return;
      try{
        if(window.ExploreUPHotels && typeof window.ExploreUPHotels.mount === 'function') window.ExploreUPHotels.mount();
      }catch(e){}
      renderFallback();
      [80,220,500,900,1500].forEach(function(ms){setTimeout(function(){
        if(!isOpen()) return;
        try{ if(window.ExploreUPHotels && typeof window.ExploreUPHotels.mount === 'function') window.ExploreUPHotels.mount(); }catch(e){}
        renderFallback();
      },ms);});
    },40);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleMount,{once:true});
  else scheduleMount();

  document.addEventListener('click',function(){scheduleMount();},true);
  document.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '||e.key==='Escape')scheduleMount();},true);

  var observerTimer=null;
  new MutationObserver(function(){
    if(!isOpen()) return;
    clearTimeout(observerTimer);
    observerTimer=setTimeout(function(){scheduleMount();},120);
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
})();
