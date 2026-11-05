(function(){
  /* ============================================================
     WHATSAPP
     Formato: 55 + DDD + número, sem espaços nem traços.
     A mensagem de cada botão fica no atributo data-wa-msg do HTML.
     ============================================================ */
  var WA_NUMERO = '551432832486';

  document.querySelectorAll('a[data-wa-msg]').forEach(function(a){
    a.href = 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(a.getAttribute('data-wa-msg'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* Rastreamento de cliques no WhatsApp (GA4, GTM e Meta Pixel, se instalados) */
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[data-wa]');
    if (!a) return;
    var origem = a.getAttribute('data-wa');
    try {
      if (window.gtag) gtag('event', 'whatsapp_click', { cta: origem });
      if (window.dataLayer) window.dataLayer.push({ event: 'whatsapp_click', cta: origem });
      if (window.fbq) fbq('track', 'Contact');
    } catch(err){}
  });

  /* Menu mobile */
  var menu = document.getElementById('menu');
  var burger = document.getElementById('burger');
  var menuClose = document.getElementById('menuClose');
  function setMenu(open){
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    (open ? menuClose : burger).focus({preventScroll:true});
  }
  burger.addEventListener('click', function(){ setMenu(true); });
  menuClose.addEventListener('click', function(){ setMenu(false); });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });

  /* Animação de entrada (leve) */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('in'); });
  }

  /* Vídeos do YouTube: o player só carrega quando a pessoa clica na capa */
  document.querySelectorAll('a.video-thumb[data-yt]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + a.getAttribute('data-yt') + '?autoplay=1&rel=0&playsinline=1';
      f.title = a.getAttribute('aria-label').replace('Assistir ao vídeo: ', '');
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      var box = document.createElement('div');
      box.className = 'video-thumb';
      box.appendChild(f);
      a.replaceWith(box);
    });
  });

  /* Galeria de fotos: filtro por tipo e foto ampliada */
  var galItems = Array.prototype.slice.call(document.querySelectorAll('.gal-item'));
  var chips = document.querySelectorAll('.chip[data-filter]');
  var galMore = document.getElementById('galMore');
  var galFilter = 'all', galExpanded = false;
  /* Fotos mostradas antes do "Ver mais": celular 4, tablet 6, computador 8 (sempre linhas completas) */
  function galLimit(){
    return window.matchMedia('(min-width:1024px)').matches ? 8 : window.matchMedia('(min-width:640px)').matches ? 6 : 4;
  }
  function galApply(){
    var n = 0, GAL_LIMIT = galLimit();
    galItems.forEach(function(it){
      var show = galFilter === 'all' || it.getAttribute('data-cat') === galFilter;
      it.hidden = !show;
      if (show) { n++; it.classList.toggle('over', !galExpanded && n > GAL_LIMIT); }
    });
    galMore.hidden = n <= GAL_LIMIT;
    galMore.textContent = galExpanded ? 'Ver menos fotos' : 'Ver mais fotos (' + (n - GAL_LIMIT) + ')';
    galMore.setAttribute('aria-expanded', galExpanded);
  }
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      galFilter = chip.getAttribute('data-filter');
      galExpanded = false;
      chips.forEach(function(c){ c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      galApply();
    });
  });
  galMore.addEventListener('click', function(){ galExpanded = !galExpanded; galApply(); });
  galApply();
  window.addEventListener('resize', galApply);
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbList = [], lbPos = 0;
  function lbShow(){
    var b = lbList[lbPos];
    lbImg.src = b.getAttribute('data-full');
    lbImg.alt = b.getAttribute('data-cap');
    lbCap.textContent = b.getAttribute('data-cap');
    var multi = lbList.length > 1;
    document.getElementById('lbPrev').style.visibility = multi ? '' : 'hidden';
    document.getElementById('lbNext').style.visibility = multi ? '' : 'hidden';
  }
  function lbMove(d){ lbPos = (lbPos + d + lbList.length) % lbList.length; lbShow(); }
  document.querySelectorAll('.gal-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      lbList = galItems.filter(function(it){ return it.offsetParent !== null; }).map(function(it){ return it.querySelector('.gal-btn'); });
      lbPos = lbList.indexOf(btn);
      lbShow();
      if (lb.showModal) lb.showModal();
    });
  });
  document.getElementById('lbClose').addEventListener('click', function(){ lb.close(); });
  document.getElementById('lbPrev').addEventListener('click', function(){ lbMove(-1); });
  document.getElementById('lbNext').addEventListener('click', function(){ lbMove(1); });
  lb.addEventListener('click', function(e){ if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function(e){
    if (e.key === 'ArrowLeft') lbMove(-1);
    if (e.key === 'ArrowRight') lbMove(1);
  });

  /* Balão do botão flutuante */
  var bubble = document.getElementById('bubble');
  setTimeout(function(){ bubble.classList.add('show'); }, 4000);
  setTimeout(function(){ bubble.classList.remove('show'); }, 12000);

  /* Destaca o dia de hoje na tabela de horários (fuso de São Paulo) */
  try {
    var dias = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
    var hoje = dias[new Intl.DateTimeFormat('en-US', { timeZone:'America/Sao_Paulo', weekday:'short' }).format(new Date())];
    document.querySelectorAll('tr[data-days]').forEach(function(tr){
      if (tr.getAttribute('data-days').split(',').indexOf(String(hoje)) > -1) tr.classList.add('today');
    });
  } catch(err){}

  /* Política de privacidade */
  var dlg = document.getElementById('privacy');
  document.getElementById('openPrivacy').addEventListener('click', function(){ if (dlg.showModal) dlg.showModal(); });
  document.getElementById('closePrivacy').addEventListener('click', function(){ dlg.close(); });
  dlg.addEventListener('click', function(e){ if (e.target === dlg) dlg.close(); });

  /* Ano no rodapé */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
