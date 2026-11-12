/* Lightweight decorative particles for the ExploreUP homepage background. */
(function(){
  'use strict';
  const canvas=document.getElementById('lbCanvas');
  if(!canvas||!canvas.getContext)return;
  const context=canvas.getContext('2d',{alpha:true});
  if(!context)return;
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced)return;

  const palette=['#ff9933','#ffffff','#138808','#ffcc70','#4fc3f7'];
  const mobile=window.matchMedia&&window.matchMedia('(max-width: 767px)').matches;
  const count=mobile?28:52;
  let width=0,height=0,particles=[],frame=0,raf=0;
  const pixelRatio=Math.min(window.devicePixelRatio||1,1.5);

  function resize(){
    width=window.innerWidth;height=window.innerHeight;
    canvas.width=Math.round(width*pixelRatio);
    canvas.height=Math.round(height*pixelRatio);
    context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    if(!particles.length)createParticles();
  }
  function createParticles(){
    particles=Array.from({length:count},function(){
      return {
        x:Math.random()*width,y:Math.random()*height,
        radius:Math.random()*1.5+.55,
        vx:(Math.random()-.5)*.32,vy:(Math.random()-.5)*.32,
        color:palette[Math.floor(Math.random()*palette.length)],
        alpha:Math.random()*.42+.18
      };
    });
  }
  function draw(){
    if(document.hidden){raf=0;return;}
    context.clearRect(0,0,width,height);
    for(let i=0;i<particles.length;i++){
      const p=particles[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=width;if(p.x>width)p.x=0;
      if(p.y<0)p.y=height;if(p.y>height)p.y=0;
      context.beginPath();context.arc(p.x,p.y,p.radius,0,Math.PI*2);
      context.fillStyle=p.color;context.globalAlpha=p.alpha;context.fill();
      if(i%2===0){
        for(let j=i+1;j<particles.length;j++){
          const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,distance=Math.hypot(dx,dy);
          if(distance<105){
            context.beginPath();context.moveTo(p.x,p.y);context.lineTo(q.x,q.y);
            context.strokeStyle='rgba(255,153,51,'+((1-distance/105)*.11)+')';
            context.lineWidth=.7;context.stroke();
          }
        }
      }
    }
    context.globalAlpha=1;
    frame++;raf=window.requestAnimationFrame(draw);
  }
  function start(){if(!raf&&!document.hidden)raf=window.requestAnimationFrame(draw);}
  function stop(){if(raf){window.cancelAnimationFrame(raf);raf=0;}}
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start();});
  resize();start();
})();
