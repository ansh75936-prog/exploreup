/* Lightweight decorative particles for the ExploreUP homepage background. */
(function(){
  'use strict';

  const canvas=document.getElementById('lbCanvas');
  if(!canvas||!canvas.getContext)return;

  const context=canvas.getContext('2d',{alpha:true});
  if(!context)return;

  const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery=window.matchMedia&&window.matchMedia('(max-width: 767px)');
  // Keep the CSS background active on mobile; only the decorative canvas particles
  // are paused there. Media-query changes are handled so orientation/resize works.

  const palette=['#ff9933','#ffffff','#138808','#ffcc70','#4fc3f7'];
  const count=32;
  const frameInterval=1000/24;
  const pixelRatio=Math.min(window.devicePixelRatio||1,1.25);

  let width=0,height=0,particles=[],raf=0,frameTimer=0;

  function resize(){
    width=window.innerWidth;
    height=window.innerHeight;
    if(mobileQuery&&mobileQuery.matches){
      canvas.width=0;
      canvas.height=0;
      return;
    }
    canvas.width=Math.round(width*pixelRatio);
    canvas.height=Math.round(height*pixelRatio);
    context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    if(!particles.length)createParticles();
  }

  function createParticles(){
    particles=Array.from({length:count},function(){
      return {
        x:Math.random()*width,
        y:Math.random()*height,
        radius:Math.random()*1.5+.55,
        vx:(Math.random()-.5)*.28,
        vy:(Math.random()-.5)*.28,
        color:palette[Math.floor(Math.random()*palette.length)],
        alpha:Math.random()*.42+.18
      };
    });
  }

  function draw(){
    raf=0;
    if(document.hidden||(mobileQuery&&mobileQuery.matches)||(reducedMotion&&reducedMotion.matches)){
      stop();
      return;
    }

    context.clearRect(0,0,width,height);

    for(let i=0;i<particles.length;i++){
      const p=particles[i];
      p.x+=p.vx;
      p.y+=p.vy;
      if(p.x<0)p.x=width;
      if(p.x>width)p.x=0;
      if(p.y<0)p.y=height;
      if(p.y>height)p.y=0;

      context.beginPath();
      context.arc(p.x,p.y,p.radius,0,Math.PI*2);
      context.fillStyle=p.color;
      context.globalAlpha=p.alpha;
      context.fill();

      if(i%2===0){
        for(let j=i+1;j<particles.length;j++){
          const q=particles[j];
          const dx=p.x-q.x;
          const dy=p.y-q.y;
          const distanceSquared=dx*dx+dy*dy;
          if(distanceSquared<11025){
            const strength=1-Math.sqrt(distanceSquared)/105;
            context.beginPath();
            context.moveTo(p.x,p.y);
            context.lineTo(q.x,q.y);
            context.strokeStyle='rgba(255,153,51,'+(strength*.11)+')';
            context.lineWidth=.7;
            context.stroke();
          }
        }
      }
    }

    context.globalAlpha=1;
    frameTimer=window.setTimeout(function(){
      if(!document.hidden)raf=window.requestAnimationFrame(draw);
    },frameInterval);
  }

  function start(){
    if(!raf&&!document.hidden&&!(mobileQuery&&mobileQuery.matches)&&!(reducedMotion&&reducedMotion.matches)){
      raf=window.requestAnimationFrame(draw);
    }
  }

  function stop(){
    if(raf){
      window.cancelAnimationFrame(raf);
      raf=0;
    }
    if(frameTimer){
      window.clearTimeout(frameTimer);
      frameTimer=0;
    }
  }

  function syncLifecycle(){
    if(document.hidden||(mobileQuery&&mobileQuery.matches)||(reducedMotion&&reducedMotion.matches)){
      stop();
      if(mobileQuery&&mobileQuery.matches){canvas.width=0;canvas.height=0;}
      return;
    }
    resize();
    start();
  }

  function scheduleStart(){
    const run=syncLifecycle;
    if('requestIdleCallback' in window){
      window.requestIdleCallback(run,{timeout:1600});
    }else{
      window.setTimeout(run,900);
    }
  }

  window.addEventListener('resize',syncLifecycle,{passive:true});
  if(mobileQuery&&mobileQuery.addEventListener){
    mobileQuery.addEventListener('change',syncLifecycle);
  }
  document.addEventListener('visibilitychange',syncLifecycle);

  if(reducedMotion&&reducedMotion.addEventListener){
    reducedMotion.addEventListener('change',syncLifecycle);
  }

  syncLifecycle();
  if(document.readyState==='complete')scheduleStart();
  else window.addEventListener('load',scheduleStart,{once:true});
})();
