/* Lightweight decorative particles for the ExploreUP homepage background. */
(function(){
  'use strict';

  const canvas=document.getElementById('lbCanvas');
  if(!canvas||!canvas.getContext)return;

  const context=canvas.getContext('2d',{alpha:true});
  if(!context)return;

  const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reducedMotion&&reducedMotion.matches)return;

  const palette=['#ff9933','#ffffff','#138808','#ffcc70','#4fc3f7'];
  const mobile=window.matchMedia&&window.matchMedia('(max-width: 767px)').matches;
  const count=mobile?14:34;
  const frameInterval=1000/24;
  const pixelRatio=Math.min(window.devicePixelRatio||1,1.25);

  let width=0,height=0,particles=[],raf=0,lastFrameAt=0;

  function resize(){
    width=window.innerWidth;
    height=window.innerHeight;
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

  function draw(now){
    if(document.hidden||(reducedMotion&&reducedMotion.matches)){
      stop();
      return;
    }

    if(now-lastFrameAt<frameInterval){
      raf=window.requestAnimationFrame(draw);
      return;
    }
    lastFrameAt=now;

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
    raf=window.requestAnimationFrame(draw);
  }

  function start(){
    if(!raf&&!document.hidden&&!(reducedMotion&&reducedMotion.matches)){
      lastFrameAt=0;
      raf=window.requestAnimationFrame(draw);
    }
  }

  function stop(){
    if(raf){
      window.cancelAnimationFrame(raf);
      raf=0;
    }
  }

  function scheduleStart(){
    if('requestIdleCallback' in window){
      window.requestIdleCallback(start,{timeout:1600});
    }else{
      window.setTimeout(start,900);
    }
  }

  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)stop();
    else start();
  });

  if(reducedMotion&&reducedMotion.addEventListener){
    reducedMotion.addEventListener('change',function(event){
      if(event.matches)stop();
      else start();
    });
  }

  resize();
  if(document.readyState==='complete')scheduleStart();
  else window.addEventListener('load',scheduleStart,{once:true});
})();
