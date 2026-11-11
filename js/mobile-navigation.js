/* ExploreUP mobile navigation v5 — functional screenshot-style drawer */
(function(){
  function initMobileMenu(){
    const nav=document.querySelector('.nav');
    if(!nav) return;

    /* Use the stable header trigger when present; create one only as a fallback. */
    let btn=document.getElementById('mobileMenuBtn');
    if(!btn){
      btn=document.createElement('button');
      btn.id='mobileMenuBtn';
      btn.className='mobile-menu-btn';
      btn.type='button';
      btn.setAttribute('aria-label','Open menu');
      btn.setAttribute('title','Menu');
      btn.setAttribute('aria-expanded','false');
      btn.textContent='⋮';

      const logo=nav.querySelector('.logo');
      if(logo) nav.insertBefore(btn,logo); else nav.prepend(btn);
    }

    const backdrop=document.createElement('div');
    backdrop.className='mobile-menu-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    document.body.appendChild(backdrop);

    const menu=document.createElement('aside');
    menu.id='mobileMenu';
    menu.className='mobile-menu';
    menu.setAttribute('aria-label','ExploreUP menu');
    menu.innerHTML=`
      <div class="mobile-menu-section">
        <button class="mobile-menu-back" id="mobileBackItem" type="button" aria-label="Go back">← Back</button>
        <div class="mobile-menu-welcome"><div class="mobile-menu-welcome-icon">🎒</div><div><b>Welcome, Explorer!</b><small>Sign in to plan &amp; save your UP journeys</small></div></div>

        <div class="mobile-menu-heading">ACCOUNT</div>
        <button class="mobile-menu-item" id="mobileLoginItem" type="button"><span class="mobile-menu-icon">🔑</span><span class="mobile-menu-copy"><b>Log In</b><small>Access your account &amp; saved trips</small></span><span class="mobile-menu-badge">Sign In</span></button>
        <button class="mobile-menu-item" id="mobileCreateItem" type="button"><span class="mobile-menu-icon">✨</span><span class="mobile-menu-copy"><b>Create Account</b><small>Join ExploreUP for free</small></span><span class="mobile-menu-badge">Free</span></button>

        <div class="mobile-menu-heading">PREFERENCES</div>
        <button class="mobile-menu-item" id="mobileLanguageItem" type="button"><span class="mobile-menu-icon">🌐</span><span class="mobile-menu-copy"><b>Language / भाषा</b><small id="mobileLanguageText">Active: English • Tap to switch</small></span><span class="mobile-menu-badge" id="mobileLanguageBadge">English (Active)</span></button>
        <button class="mobile-menu-item" id="mobileDarkItem" type="button"><span class="mobile-menu-icon">☾</span><span class="mobile-menu-copy"><b>Dark Mode</b><small id="mobileDarkText">Light Theme Active</small></span><span class="mobile-menu-toggle" aria-label="Toggle dark mode"></span></button>

        <div class="mobile-menu-heading">EXPLORE &amp; SUPPORT</div>
        <button class="mobile-menu-item" type="button" id="mobileAdminItem"><span class="mobile-menu-icon">🛡️</span><span class="mobile-menu-copy"><b>Admin Panel</b><small>Destination controls &amp; portal admin</small></span></button>
        <a class="mobile-menu-item" href="tel:112"><span class="mobile-menu-icon">🚨</span><span class="mobile-menu-copy"><b>Helplines &amp; Emergency</b><small>Police 112 • Ambulance 108 • Tourist 1363</small></span><span class="mobile-menu-badge">24×7</span></a>
        <button class="mobile-menu-item" type="button" id="mobileAboutItem"><span class="mobile-menu-icon">⭐</span><span class="mobile-menu-copy"><b>About ExploreUP</b><small>Why ExploreUP, mission &amp; city directory</small></span></button>
      </div>
      <div class="mobile-menu-footer"><b>ExploreUP</b> • Uttar Pradesh<br><span>v2.4 • Har Shehar Ki Kahani • Explore • Discover • Experience</span></div>`;

    document.body.appendChild(menu);

    function closeMenu(){
      menu.classList.remove('show');
      sync();
    }

    function sync(){
      const open=menu.classList.contains('show');
      btn.classList.toggle('is-open',open);
      btn.setAttribute('aria-expanded',String(open));
      btn.setAttribute('aria-label',open?'Close menu':'Open menu');
      btn.textContent=open?'×':'⋮';
      btn.style.position=open?'fixed':'';
      btn.style.top=open?'11px':'';
      btn.style.right=open?'14px':'';
      btn.style.left=open?'auto':'';
      btn.style.zIndex=open?'10001':'';
      backdrop.classList.toggle('show',open);
      document.body.style.overflow=open?'hidden':'';
    }

    btn.addEventListener('click',function(){
      menu.classList.toggle('show');
      sync();
    });

    backdrop.addEventListener('click',closeMenu);

    menu.addEventListener('click',function(e){
      if(e.target.closest('a')) closeMenu();
    });

    document.getElementById('mobileBackItem')?.addEventListener('click',function(){
      closeMenu();
      // The menu's Back control should dismiss the drawer and return to the home section,
      // not unexpectedly navigate away from ExploreUP via browser history.
      const top=document.getElementById('top');
      if(top) top.scrollIntoView({behavior:'smooth',block:'start'});
      else window.scrollTo({top:0,behavior:'smooth'});
    });

    function openAuth(mode){
      let modal=document.getElementById('mobileAuthModal');
      if(!modal){
        modal=document.createElement('div');
        modal.id='mobileAuthModal';
        modal.className='mobile-auth-modal';
        modal.innerHTML=`
          <div class="mobile-auth-card" role="dialog" aria-modal="true" aria-labelledby="mobileAuthTitle">
            <div class="mobile-auth-head"><h3 id="mobileAuthTitle">Log In</h3><button class="mobile-auth-close" type="button" aria-label="Close">×</button></div>
            <input id="mobileAuthName" type="text" placeholder="Your name" autocomplete="name" style="display:none">
            <input id="mobileAuthEmail" type="email" placeholder="Email address" autocomplete="email">
            <input id="mobileAuthPassword" type="password" placeholder="Password" autocomplete="current-password">
            <button id="mobileAuthSubmit" class="mobile-auth-submit" type="button">Log In</button>
            <button id="mobileAuthSwitch" class="mobile-auth-switch" type="button">Create a new account</button>
            <div id="mobileAuthStatus" class="mobile-auth-status"></div>
          </div>`;
        document.body.appendChild(modal);
        modal.querySelector('.mobile-auth-close').addEventListener('click',()=>modal.classList.remove('show'));
        modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
        modal.querySelector('#mobileAuthSwitch').addEventListener('click',()=>{
          openAuth(modal.dataset.mode==='login'?'signup':'login');
        });
        modal.querySelector('#mobileAuthSubmit').addEventListener('click',async()=>{
          const m=modal.dataset.mode;
          const email=modal.querySelector('#mobileAuthEmail').value.trim();
          const password=modal.querySelector('#mobileAuthPassword').value;
          const name=modal.querySelector('#mobileAuthName').value.trim();
          const status=modal.querySelector('#mobileAuthStatus');
          status.style.color='#b42318';
          status.textContent='';
          if(!email||!password||(m==='signup'&&!name)){status.textContent=m==='signup'?'Name, email and password are required.':'Email and password are required.';return}
          const client=await loadSupabaseBackend();
          if(!client){status.textContent='Login service is unavailable right now.';return}
          const btn=modal.querySelector('#mobileAuthSubmit'); btn.disabled=true; btn.textContent=m==='signup'?'Creating…':'Signing in…';
          try{
            let result;
            if(m==='signup'){
              result=await client.auth.signUp({email,password,options:{data:{full_name:name}}});
              if(result.error)throw result.error;
              if(result.data?.session){
                status.style.color='#18794e'; status.textContent='Account created and logged in.';
                modal.classList.remove('show');
              }else{
                status.style.color='#8a5a00'; status.textContent='Account created. Check your email if confirmation is required, then log in.';
              }
            }else{
              result=await client.auth.signInWithPassword({email,password});
              if(result.error)throw result.error;
              status.style.color='#18794e'; status.textContent='Login successful.';
              modal.classList.remove('show');
            }
            updateMobileAuthState();
          }catch(err){status.textContent=err?.message||'Authentication failed.'}
          finally{btn.disabled=false;btn.textContent=m==='signup'?'Create Account':'Log In'}
        });
      }
      const isSignup=mode==='signup';
      modal.dataset.mode=isSignup?'signup':'login';
      modal.querySelector('#mobileAuthTitle').textContent=isSignup?'Create Account':'Log In';
      modal.querySelector('#mobileAuthName').style.display=isSignup?'block':'none';
      modal.querySelector('#mobileAuthPassword').autocomplete=isSignup?'new-password':'current-password';
      modal.querySelector('#mobileAuthSubmit').textContent=isSignup?'Create Account':'Log In';
      modal.querySelector('#mobileAuthSwitch').textContent=isSignup?'Already have an account? Log In':'Create a new account';
      modal.querySelector('#mobileAuthStatus').textContent='';
      modal.classList.add('show');
      setTimeout(()=>modal.querySelector(isSignup?'#mobileAuthName':'#mobileAuthEmail')?.focus(),50);
    }
    async function updateMobileAuthState(){
      const client=await loadSupabaseBackend();
      if(!client)return;
      const {data}=await client.auth.getUser();
      const login=document.getElementById('mobileLoginItem');
      const create=document.getElementById('mobileCreateItem');
      if(data?.user){
        const label=data.user.user_metadata?.full_name||data.user.email||'Account';
        if(login){
          login.querySelector('.mobile-menu-copy b').textContent=label;
          login.querySelector('.mobile-menu-copy small').textContent='Signed in • Open your account';
          login.querySelector('.mobile-menu-badge').textContent='Active';
        }
        if(create) create.style.display='none';
      }
    }
    document.getElementById('mobileLoginItem')?.addEventListener('click',function(){closeMenu();openAuth('login')});
    document.getElementById('mobileCreateItem')?.addEventListener('click',function(){closeMenu();openAuth('signup')});
    updateMobileAuthState();
    loadSupabaseBackend().then(client=>client?.auth?.onAuthStateChange?.(()=>updateMobileAuthState()));

    // Robust menu actions: always prevent the drawer/backdrop from swallowing taps,
    // run the requested action safely, then restore the menu state.
    function runMenuAction(action){
      try{
        if(typeof action==='function') action();
      }catch(err){
        console.warn('ExploreUP menu action failed:',err);
      }finally{
        closeMenu();
      }
    }

    document.getElementById('mobileLanguageItem')?.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      runMenuAction(()=>window.toggleLanguage?.());
    });

    document.getElementById('mobileDarkItem')?.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      runMenuAction(()=>window.toggleDark?.());
    });

    document.getElementById('mobileAdminItem')?.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      runMenuAction(()=>window.openAdminPanel?.());
    });

    document.getElementById('mobileAboutItem')?.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
      // The page has no #about anchor; find the actual About/Why ExploreUP section instead.
      const headings=Array.from(document.querySelectorAll('h1,h2,h3'));
      const heading=headings.find(el=>/why exploreup|about exploreup/i.test(el.textContent||''));
      const target=heading?.closest('section,article')||heading||document.querySelector('footer')||document.getElementById('top');
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    });

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape') closeMenu();
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMobileMenu,{once:true});
  else initMobileMenu();
})();
