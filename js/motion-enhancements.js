/* ExploreUP progressive motion enhancements. Native APIs keep the current static site lightweight. */
(function(){
 "use strict";
 const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const root=document.documentElement;
 if(reduce){root.classList.add("eu-motion-reduced");return;}
 document.documentElement.classList.add("eu-motion-ready");
 const progress=document.createElement("div");progress.id="euScrollProgress";progress.setAttribute("aria-hidden","true");progress.innerHTML="<span></span>";document.body.appendChild(progress);
 const bar=progress.firstElementChild;let ticking=false;
 function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;const ratio=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;bar.style.transform="scaleX("+ratio+")";ticking=false;}
 window.addEventListener("scroll",()=>{if(!ticking){ticking=true;window.requestAnimationFrame(updateProgress)}},{passive:true});window.addEventListener("resize",updateProgress,{passive:true});updateProgress();
 if("IntersectionObserver" in window){
  const revealTargets=document.querySelectorAll(".sectionhead,.home-discovery-dashboard,.eu-home-dashboard,.eu-featured-section,.eu-featured-card,.home-map-panel,.home-region-panel,.home-why-panel,#cityGrid .city,.feature-row,.calendar,.trails,.blogs");
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("eu-visible");observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:"0px 0px -36px 0px"});
  revealTargets.forEach((el,i)=>{el.classList.add("eu-reveal");el.style.transitionDelay=Math.min(i%6,5)*55+"ms";observer.observe(el)});
 }
 if(window.matchMedia&&window.matchMedia("(hover:hover) and (pointer:fine)").matches){
  document.querySelectorAll("#cityGrid .city,.eu-featured-card").forEach(card=>{
   card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform="perspective(900px) rotateX("+(-y*3.5)+"deg) rotateY("+(x*4)+"deg) translateY(-3px)"});
   card.addEventListener("pointerleave",()=>{card.style.transform=""});
  });
 }
 document.addEventListener("visibilitychange",()=>{if(document.hidden)document.documentElement.classList.add("eu-tab-hidden");else document.documentElement.classList.remove("eu-tab-hidden")});
})();
