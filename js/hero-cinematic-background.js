/* Homepage-only decorative particles for the spiritual cinematic hero. */
(function initHeroCinematicBackground(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const particles=document.getElementById('heroCinematicParticles'),fireflies=document.getElementById('heroCinematicFireflies');
  if(!particles||!fireflies||particles.childElementCount||fireflies.childElementCount)return;
  const mobile=window.matchMedia('(max-width: 640px)').matches,particleCount=mobile?22:44,fireflyCount=mobile?7:12;
  const particleFragment=document.createDocumentFragment(),fireflyFragment=document.createDocumentFragment();
  for(let i=0;i<particleCount;i++){const p=document.createElement('span'),size=2+Math.random()*4;p.style.width=size+'px';p.style.height=size+'px';p.style.left=(Math.random()*100)+'%';p.style.setProperty('--eu-dx',(Math.random()*80-40)+'px');p.style.animationDuration=(10+Math.random()*13)+'s';p.style.animationDelay=(Math.random()*16)+'s';particleFragment.appendChild(p)}
  for(let i=0;i<fireflyCount;i++){const f=document.createElement('span');f.style.left=(8+Math.random()*84)+'%';f.style.top=(18+Math.random()*64)+'%';f.style.setProperty('--eu-mx',(Math.random()*110-55)+'px');f.style.setProperty('--eu-my',(Math.random()*-130-20)+'px');f.style.setProperty('--eu-ex',(Math.random()*160-80)+'px');f.style.setProperty('--eu-ey',(Math.random()*-210-40)+'px');f.style.animationDuration=(10+Math.random()*8)+'s';f.style.animationDelay=(Math.random()*10)+'s';fireflyFragment.appendChild(f)}
  particles.appendChild(particleFragment);fireflies.appendChild(fireflyFragment);
})();
