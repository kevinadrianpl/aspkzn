/* ASP — All Steel Productions — shared behaviour */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- preloader ---------- */
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    const bar = preloader.querySelector('.bar span');
    const pct = preloader.querySelector('.pct');
    let progress = 0;
    const tick = () => {
      progress += Math.random() * 18;
      if (progress > 100) progress = 100;
      if (bar) bar.style.width = progress + '%';
      if (pct) pct.textContent = Math.floor(progress) + '%';
      if (progress < 100) {
        setTimeout(tick, 90);
      } else {
        setTimeout(() => {
          preloader.classList.add('done');
          document.querySelector('.hero')?.classList.add('loaded');
        }, 200);
      }
    };
    tick();
  } else {
    document.querySelector('.hero')?.classList.add('loaded');
  }

  /* ---------- custom cursor ---------- */
  const cursor = document.querySelector('.cursor');
  if (cursor && matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .btn, .service-row, .card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- mobile nav toggle ---------- */
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.main-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      burger.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---------- active nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ---------- image reveal: clean scroll-scrubbed fade + scale (matches lusion.co's actual
     behaviour — verified by inspecting it directly: a simple, fast-settling opacity/scale/rise,
     no blur, no wipe line, no noise/glitch) ---------- */
  setupImageReveal();

  function setupImageReveal() {
    const els = Array.from(document.querySelectorAll('.photo[data-parallax]'));
    if (!els.length) return;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    function frame() {
      const vh = window.innerHeight;
      const startLine = vh * 0.9;   // element top here -> progress 0 (just entering)
      const endLine = vh * 0.55;    // element top here -> progress 1 (settled, matches lusion's quick settle)

      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        let p = (startLine - rect.top) / (startLine - endLine);
        p = Math.min(Math.max(p, 0), 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic

        const scale = 1.08 - 0.08 * eased;
        const rise = (1 - eased) * 36;
        el.style.opacity = eased.toFixed(3);
        el.style.transform = `translateY(${rise.toFixed(2)}px) scale(${scale.toFixed(4)})`;
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- interactive welding plate toy ---------- */
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;


  document.querySelectorAll('.toy-wrap canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    let w = 0, h = 0, dpr = 1;

    const pointer = { x: -9999, y: -9999, hasLast: false, lx: 0, ly: 0, welding: false };
    let sparks = [];
    let beads = [];
    let heat = 0; // arc brightness, rises while moving, decays when idle

    function resize() {
      dpr = window.devicePixelRatio || 1;
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function setPoint(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function onEnter(clientX, clientY) {
      const p = setPoint(clientX, clientY);
      pointer.x = p.x; pointer.y = p.y;
      pointer.lx = p.x; pointer.ly = p.y;
      pointer.hasLast = true;
    }

    function onMove(clientX, clientY) {
      const p = setPoint(clientX, clientY);
      pointer.x = p.x; pointer.y = p.y;
      if (!pointer.hasLast) { pointer.lx = p.x; pointer.ly = p.y; pointer.hasLast = true; return; }
      if (pointer.welding) weld(pointer.lx, pointer.ly, pointer.x, pointer.y);
      pointer.lx = pointer.x; pointer.ly = pointer.y;
    }

    function onLeave() {
      pointer.welding = false;
      pointer.hasLast = false;
    }

    function onWeldStart(event) {
      const p = setPoint(event.clientX, event.clientY);
      pointer.x = p.x; pointer.y = p.y;
      pointer.lx = p.x; pointer.ly = p.y;
      pointer.hasLast = true;
      pointer.welding = true;
      canvas.setPointerCapture(event.pointerId);
    }

    function onWeldEnd() {
      pointer.welding = false;
      pointer.hasLast = false;
    }

    function weld(x1, y1, x2, y2) {
      if (reduceMotion) return;
      heat = Math.min(heat + 0.5, 1.6);
      beads.push({ x1, y1, x2, y2, life: 1 });
      if (beads.length > 240) beads.splice(0, beads.length - 240);

      const dist = Math.hypot(x2 - x1, y2 - y1);
      const count = Math.min(Math.round(dist / 2.2) + 2, 9);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 0.08) + Math.random() * (Math.PI * 0.84);
        const speed = 2.2 + Math.random() * 5.8;
        sparks.push({
          x: x2, y: y2,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.5,
          vy: Math.sin(angle) * speed - 0.8,
          life: 1,
          decay: 0.025 + Math.random() * 0.045,
          size: 1.6 + Math.random() * 3.4,
          length: 6 + Math.random() * 20
        });
      }
      if (sparks.length > 440) sparks.splice(0, sparks.length - 440);
    }

    canvas.addEventListener('pointerenter', e => onEnter(e.clientX, e.clientY));
    canvas.addEventListener('pointermove', e => onMove(e.clientX, e.clientY));
    canvas.addEventListener('pointerleave', () => { if (!pointer.welding) onLeave(); });
    canvas.addEventListener('pointerdown', onWeldStart);
    canvas.addEventListener('pointerup', onWeldEnd);
    canvas.addEventListener('pointercancel', onWeldEnd);
    canvas.addEventListener('lostpointercapture', onWeldEnd);

    function tick() {
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (let i = beads.length - 1; i >= 0; i--) {
        const bead = beads[i];
        bead.life -= 0.012;
        if (bead.life <= 0) { beads.splice(i, 1); continue; }
        ctx.shadowColor = `rgba(255,125,25,${bead.life * 0.9})`;
        ctx.shadowBlur = 15 * bead.life;
        ctx.strokeStyle = `rgba(255,126,32,${bead.life * 0.6})`;
        ctx.lineWidth = 14;
        ctx.beginPath(); ctx.moveTo(bead.x1, bead.y1); ctx.lineTo(bead.x2, bead.y2); ctx.stroke();
        ctx.shadowBlur = 4 * bead.life;
        ctx.strokeStyle = `rgba(255,244,210,${bead.life * 0.9})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(bead.x1, bead.y1); ctx.lineTo(bead.x2, bead.y2); ctx.stroke();
      }
      ctx.restore();

      heat *= 0.9;

      // sparks: gravity + fade
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vy += 0.16;
        s.vx *= 0.992;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0 || s.y > h + 20) { sparks.splice(i, 1); continue; }
        ctx.globalCompositeOperation = 'lighter';
        const t = s.life;
        ctx.lineCap = 'round';
        ctx.shadowColor = `rgba(255,113,22,${t * 0.95})`;
        ctx.shadowBlur = 14 + s.size * 6;
        ctx.strokeStyle = `rgba(255,${130 + (100 * t | 0)},${38 + (70 * t | 0)},${t * 0.9})`;
        ctx.lineWidth = Math.max(s.size * t * 1.25, 0.8);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * s.length * 0.28, s.y - s.vy * s.length * 0.28);
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,245,205,${t * 0.82})`;
        ctx.shadowBlur = 2;
        ctx.lineWidth = Math.max(s.size * t * 0.7, 0.7);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * s.length * 0.1, s.y - s.vy * s.length * 0.1);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;

      // arc glow + torch tip at current pointer while active
      if (pointer.welding && heat > 0.02) {
        const flicker = 0.85 + Math.random() * 0.3;
        const glowR = (52 + heat * 28) * flicker;
        ctx.globalCompositeOperation = 'lighter';
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, glowR);
        glow.addColorStop(0, `rgba(255,255,255,${0.55 * heat})`);
        glow.addColorStop(0.35, `rgba(255,150,40,${0.4 * heat})`);
        glow.addColorStop(1, 'rgba(255,90,20,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, glowR, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }

      requestAnimationFrame(tick);
    }

    new ResizeObserver(resize).observe(wrap);
    resize();
    requestAnimationFrame(tick);
  });

});

