/* ExploreUP Feedback — public submission form only.
 * Stores feedback in Supabase with status=pending. No personal data beyond
 * the optional name is requested. No login and no location access.
 */
(function(){
  'use strict';
  const SUPABASE_URL='https://jsfjorthausrepgnsymv.supabase.co';
  const SUPABASE_KEY='sb_publishable_Lgj3WAOWOny7WQAloGqHcQ_hupjaK-e';
  let client=null;
  function status(msg,ok){
    const el=document.getElementById('feedbackStatus');
    if(!el)return;
    el.textContent=msg||'';
    el.dataset.state=ok?'ok':'';
  }
  function init(){
    if(!window.supabase){status('Feedback service could not load. Please try again later.');return;}
    client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    const form=document.getElementById('feedbackForm');
    if(!form||form.dataset.wired)return;
    form.dataset.wired='1';
    form.addEventListener('submit',async function(e){
      e.preventDefault();
      const btn=form.querySelector('button[type="submit"]');
      const name=(document.getElementById('feedbackName')?.value||'').trim().slice(0,100);
      const category=(document.getElementById('feedbackCategory')?.value||'general');
      const ratingRaw=document.getElementById('feedbackRating')?.value||'';
      const message=(document.getElementById('feedbackMessage')?.value||'').trim().slice(0,1000);
      if(message.length<3){status('Please enter at least 3 characters.');return;}
      const rating=ratingRaw?Number(ratingRaw):null;
      if(rating!==null&&(!Number.isInteger(rating)||rating<1||rating>5)){status('Please choose a valid rating.');return;}
      if(btn)btn.disabled=true;
      status('Submitting…');
      try{
        const {error}=await client.from('feedback').insert({
          name:name||null,
          category,
          rating,
          message,
          page_url:location.href,
          status:'pending'
        });
        if(error)throw error;
        form.reset();
        status('Thanks! Your feedback was submitted for review.',true);
      }catch(err){
        status('Could not submit right now. Please try again later.');
      }finally{
        if(btn)btn.disabled=false;
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();