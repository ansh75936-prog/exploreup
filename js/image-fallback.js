function exploreUpImageFallback(img){
  try{
    const label=(img.getAttribute('alt')||'ExploreUP').replace(/[<>&"']/g,'');
    if(img.dataset.fallbackDone==='1'){ img.onerror=null; return; }
    img.dataset.fallbackDone='1';
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071b35"/><stop offset="1" stop-color="#f28c28"/></linearGradient></defs><rect width="1200" height="700" fill="url(#g)"/><circle cx="1010" cy="120" r="75" fill="#fff" opacity=".16"/><path d="M0 560 L260 370 L430 500 L650 300 L900 520 L1200 350 L1200 700 L0 700Z" fill="#fff" opacity=".12"/><text x="70" y="590" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#fff">${label}</text><text x="72" y="642" font-family="Arial,sans-serif" font-size="26" fill="#fff" opacity=".88">Explore Uttar Pradesh • ExploreUP</text></svg>`;
    img.onerror=null;
    img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }catch(e){ img.onerror=null; }
}
