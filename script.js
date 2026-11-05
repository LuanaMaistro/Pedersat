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
