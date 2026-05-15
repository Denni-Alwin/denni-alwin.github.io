/* ============================================================
   ANIMATIONS — denni-alwin.github.io
   ============================================================ */
(function () {
    'use strict';

    /* ── Helpers ──────────────────────────────────────────── */
    function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
    function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
    function el(tag, cls, html) {
        var d = document.createElement(tag);
        if (cls) d.className = cls;
        if (html) d.innerHTML = html;
        return d;
    }

    /* ── 1. Particles canvas ──────────────────────────────── */
    (function particles() {
        var canvas = el('canvas');
        canvas.id = 'da-particles';
        document.body.prepend(canvas);
        var ctx = canvas.getContext('2d');
        var W, H, pts = [];

        function resize() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        function Pt() {
            this.rx = Math.random();
            this.ry = Math.random();
            this.x  = this.rx * W;
            this.y  = this.ry * H;
            this.vx = (Math.random() - .5) * .35;
            this.vy = (Math.random() - .5) * .35;
            this.r  = Math.random() * 1.2 + .3;
            this.a  = Math.random() * .45 + .1;
        }
        Pt.prototype.tick = function () {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
        };

        for (var i = 0; i < 90; i++) pts.push(new Pt());

        function draw() {
            ctx.clearRect(0, 0, W, H);
            for (var i = 0; i < pts.length; i++) {
                pts[i].tick();
                /* glow halo behind dot */
                ctx.shadowBlur  = 10;
                ctx.shadowColor = 'rgba(167,139,250,.9)';
                ctx.beginPath();
                ctx.arc(pts[i].x, pts[i].y, pts[i].r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(167,139,250,' + pts[i].a + ')';
                ctx.fill();
                ctx.shadowBlur = 0;
                for (var j = i + 1; j < pts.length; j++) {
                    var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    var d  = Math.sqrt(dx * dx + dy * dy);
                    if (d < 140) {
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = 'rgba(108,99,255,' + (.28 * (1 - d / 140)) + ')';
                        ctx.lineWidth = .8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }());

    /* ── 2. Ambient orbs ──────────────────────────────────── */
    document.body.insertAdjacentHTML('beforeend',
        '<div class="da-orb da-orb-1"></div><div class="da-orb da-orb-2"></div>');

    /* ── 3. Scroll progress bar ───────────────────────────── */
    (function scrollBar() {
        var bar = el('div'); bar.id = 'da-scroll-bar';
        document.body.prepend(bar);
        window.addEventListener('scroll', function () {
            var s = document.documentElement;
            bar.style.width = (s.scrollTop / (s.scrollHeight - s.clientHeight) * 100) + '%';
        }, { passive: true });
    }());

    /* ── 4. Typewriter in hero ────────────────────────────── */
    (function typewriter() {
        var roles = [
            'Back-End Developer',
            'Full Stack Engineer',
            'Java Developer',
            'Automation Builder',
            'Problem Solver'
        ];
        var heroCol = qs('.hero-section .col-12');
        if (!heroCol) return;

        // Add data-text for glitch
        var h1 = qs('.hero-heading');
        if (h1) h1.setAttribute('data-text', h1.textContent);

        // Available badge
        var badge = el('div','da-badge',
            '<span class="da-badge-dot"></span>Available for Opportunities');
        heroCol.appendChild(badge);

        // Typed row
        var row = el('div','da-typed-row',
            '<span class="da-typed-prefix">I\'m a</span>' +
            '<span class="da-typed-text"></span>' +
            '<span class="da-typed-cursor"></span>');
        heroCol.appendChild(row);

        var span = qs('.da-typed-text', row);
        var ri = 0, ci = 0, del = false;

        function tick() {
            var cur = roles[ri];
            if (!del) {
                span.textContent = cur.slice(0, ++ci);
                if (ci === cur.length) { del = true; return setTimeout(tick, 2200); }
            } else {
                span.textContent = cur.slice(0, --ci);
                if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
            }
            setTimeout(tick, del ? 55 : 95);
        }
        setTimeout(tick, 900);
    }());

    /* ── 4b. Text glitch — hover only (auto handled by coordinator) ── */
    (function textGlitchHover() {
        var h = qs('.hero-heading');
        if (!h) return;

        window._daTextEl = h;
        window._daFireText = function () {
            if (h.classList.contains('da-glitch-on') || h.classList.contains('da-pre-glitch')) return;
            h.classList.add('da-glitch-on');
            setTimeout(function () { h.classList.remove('da-glitch-on'); }, 1600);
        };
        h.addEventListener('mouseenter', window._daFireText);
    }());

    /* ── 5. Scroll-reveal via IntersectionObserver ────────── */
    (function scrollReveal() {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: .12 });

        function addReveal(sel, cls, delay) {
            qsa(sel).forEach(function (node, i) {
                node.classList.add(cls, 'da-delay-' + Math.min((i % 4) + 1, 4));
                io.observe(node);
            });
        }

        addReveal('.service-box',    'da-reveal',   0);
        addReveal('.portfolio-box',  'da-reveal',   0);
        addReveal('.timeline-item',  'da-reveal-l', 0);
        addReveal('.contact-form',   'da-reveal',   0);
        addReveal('.section > .container > .row > [class*="col-"]', 'da-reveal', 0);
    }());

    /* ── 6. Animated counters ─────────────────────────────── */
    (function counters() {
        var nodes = qsa('.fw-light.display-4');
        if (!nodes.length) return;

        // Wrap stat cells for hover effect
        nodes.forEach(function (n) {
            var box = n.closest('[class*="col-"]');
            if (box) box.classList.add('da-stat-box');
            n.classList.add('da-stat-num');
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting || e.target.dataset.done) return;
                e.target.dataset.done = '1';
                var raw = e.target.textContent.trim();
                var suf = raw.replace(/[\d.]/g,'');
                var num = parseFloat(raw);
                var start = 0, dur = 1800, step = num / dur * 16;
                var t = setInterval(function () {
                    start = Math.min(start + step, num);
                    e.target.textContent = (start < num ? Math.floor(start) : num) + suf;
                    if (start >= num) clearInterval(t);
                }, 16);
            });
        }, { threshold: .6 });

        nodes.forEach(function (n) { io.observe(n); });
    }());

    /* ── 7. Skill bars (injected into Skills column) ──────── */
    (function skillBars() {
        var skills = [
            { name:'Full Stack Dev',  pct: 85 },
            { name:'Web Development', pct: 80 },
            { name:'Java',            pct: 78 },
            { name:'Python',          pct: 72 },
            { name:'Shell / Bash',    pct: 65 },
        ];

        // Find the Skills heading cell
        var skillsHeading = null;
        qsa('h6.sm-heading').forEach(function (h) {
            if (h.textContent.trim() === 'Skills') skillsHeading = h;
        });
        if (!skillsHeading) return;

        var wrap = el('div','da-skills');
        skills.forEach(function (s) {
            wrap.insertAdjacentHTML('beforeend',
                '<div class="da-skill-item">' +
                '<div class="da-skill-header"><span>' + s.name + '</span><span>' + s.pct + '%</span></div>' +
                '<div class="da-skill-track"><div class="da-skill-fill" data-pct="' + s.pct + '"></div></div>' +
                '</div>');
        });
        skillsHeading.parentNode.appendChild(wrap);

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting || e.target.dataset.done) return;
                e.target.dataset.done = '1';
                qsa('.da-skill-fill', e.target).forEach(function (b) {
                    setTimeout(function () { b.style.width = b.dataset.pct + '%'; }, 200);
                });
            });
        }, { threshold: .3 });
        io.observe(wrap);
    }());

    /* ── 8. Tech tags infinite ticker ────────────────────── */
    (function ticker() {
        var tags = ['JavaScript','Java','Python','Selenium','WebRTC','HTML5','CSS3',
            'jQuery','Git','REST API','Bootstrap','Full Stack','Back-End',
            'Automation','Shell Script','Spring Boot'];

        function buildRow(arr) {
            return arr.concat(arr).map(function (t) {
                return '<span class="da-tag">' + t + '</span>';
            }).join('');
        }

        var sec = el('div','da-ticker-section section pt-0',
            '<div class="da-ticker-row forward">' + buildRow(tags) + '</div>' +
            '<div class="da-ticker-row backward">' + buildRow([].concat(tags).reverse()) + '</div>');

        var contact = document.getElementById('contact');
        if (contact) contact.parentNode.insertBefore(sec, contact);
    }());

    /* ── 9. Tech logo hover class ─────────────────────────── */
    qsa('img[src*="/logo/"]').forEach(function (img) {
        img.classList.add('tech-logo-icon');
    });

    /* ── 10. Timeline pulse dots ──────────────────────────── */
    qsa('.timeline-item').forEach(function (item) {
        var dot = el('span','da-tl-dot');
        item.style.position = 'relative';
        item.prepend(dot);
    });

    /* ── 11. Service box mouse glow ───────────────────────── */
    qsa('.service-box').forEach(function (box) {
        box.addEventListener('mousemove', function (e) {
            var r = box.getBoundingClientRect();
            box.style.setProperty('--gx', (e.clientX - r.left) + 'px');
            box.style.setProperty('--gy', (e.clientY - r.top)  + 'px');
            var pseudo = box.querySelector('.da-glow-pseudo');
            if (!pseudo) {
                pseudo = el('span','da-glow-pseudo');
                pseudo.style.cssText =
                    'position:absolute;width:220px;height:220px;border-radius:50%;' +
                    'background:radial-gradient(circle,rgba(108,99,255,.12) 0%,transparent 70%);' +
                    'pointer-events:none;transform:translate(-50%,-50%);transition:none;z-index:0;';
                box.appendChild(pseudo);
            }
            pseudo.style.left = (e.clientX - box.getBoundingClientRect().left) + 'px';
            pseudo.style.top  = (e.clientY - box.getBoundingClientRect().top)  + 'px';
        });
        box.addEventListener('mouseleave', function () {
            var pseudo = box.querySelector('.da-glow-pseudo');
            if (pseudo) pseudo.style.left = '-9999px';
        });
    });

    /* ── 12. Magnetic buttons ─────────────────────────────── */
    qsa('.button, .button-circle').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var r = btn.getBoundingClientRect();
            var x = e.clientX - r.left - r.width  / 2;
            var y = e.clientY - r.top  - r.height / 2;
            btn.style.transform = 'translate(' + x * .18 + 'px,' + y * .18 + 'px)';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = '';
        });
    });

    /* ── 13. Footer shimmer class ─────────────────────────── */
    var footerP = qs('.py-4 p, .py-lg-5 p');
    if (footerP) footerP.className = 'da-footer-text';

    /* ── 14. Picture glitch — setup only, no auto-schedule ─────── */
    (function imgGlitchSetup() {
        var img = qs('.hero-avatar img');
        if (!img) return;

        var wrap = el('div', 'da-img-glitch');
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);

        /* scanlines overlay */
        var sl = el('div', 'da-scanlines');
        wrap.appendChild(sl);

        function setVar() {
            wrap.style.setProperty('--gi', 'url(' + img.src + ')');
        }
        if (img.complete) { setVar(); } else { img.addEventListener('load', setVar); }

        window._daImgWrap = wrap;
        window._daFireImg = function () {
            if (wrap.classList.contains('on')) return;
            wrap.classList.add('on');
            setTimeout(function () { wrap.classList.remove('on'); }, 1900);
        };

        /* hover still works instantly */
        wrap.addEventListener('mouseenter', window._daFireImg);
    }());

    /* ── 15. Glitch coordinator — fires both every ~50 seconds ─── */
    (function glitchCoordinator() {
        function fireAll() {
            var h = window._daTextEl;

            /* Step 1: pre-flicker on heading (400ms tension builder) */
            if (h) {
                h.classList.add('da-pre-glitch');
                setTimeout(function () { h.classList.remove('da-pre-glitch'); }, 400);
            }

            /* Step 2: main burst fires after pre-flicker ends */
            setTimeout(function () {
                if (window._daFireText) window._daFireText();
                /* image glitch staggers 180ms after text for cascade feel */
                setTimeout(function () {
                    if (window._daFireImg) window._daFireImg();
                }, 180);
            }, 380);
        }

        /* First preview: 6s after load so user sees it quickly */
        setTimeout(fireAll, 6000);

        /* Then every ~50 seconds (±3s random drift) */
        function schedule() {
            setTimeout(function () { fireAll(); schedule(); }, 50000 + (Math.random() - .5) * 6000);
        }
        schedule();
    }());

}());
