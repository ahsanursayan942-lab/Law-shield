/* ================================================================
   CHANCERY ELITE — JavaScript Engine v6.0
   ================================================================ */

'use strict';

const Chancery = {

    data: null,

    state: {
        mouseX: window.innerWidth / 2,
        mouseY: window.innerHeight / 2,
        ringX:  window.innerWidth / 2,
        ringY:  window.innerHeight / 2,
    },

    /* ── BOOT ── */
    async init() {
        try {
            const res  = await fetch('chancery.json');
            this.data  = await res.json();
        } catch(e) {
            console.error('Data load failed:', e);
            return;
        }

        this.renderStats(this.data.firm.stats);
        this.renderExpertise(this.data.expertise);
        this.renderLeadership(this.data.leadership);
        this.renderAssociates(this.data.associates);
        this.renderPillars(this.data.pillars);
        this.renderCases(this.data.cases);
        this.renderRings();
        this.renderBars(this.data.cases);
        this.renderContactInfo(this.data.firm.contact);
        this.populateSelect(this.data.expertise);

        this.initLoader();
        this.initTheme();
        this.initScrollProgress();
        this.initNav();
        if (window.matchMedia('(pointer:fine)').matches) this.initCursor();
        this.initReveal();
        this.initHeroParallax();
        this.initCounters();
        this.initChartAnimations();
        this.initContactModal();
        this.initInlineForm();
        this.initPayment();
        this.initCalendly();
        this.initBackToTop();
        this.initSmoothLinks();
        this.initMagneticButtons();
    },

    /* ── THEME TOGGLE ── */
    initTheme() {
        const saved = localStorage.getItem('ce-theme') || 'dark';
        this._applyTheme(saved);

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const t = btn.dataset.theme;
                this._applyTheme(t);
                localStorage.setItem('ce-theme', t);
            });
        });
    },

    _applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    },

    /* ── LOADER ── */
    initLoader() {
        const loader    = document.getElementById('loader');
        const heroMedia = document.querySelector('.hero-media');
        const dismiss   = () => {
            setTimeout(() => { if (loader) loader.classList.add('done'); }, 900);
            if (heroMedia) heroMedia.classList.add('loaded');
        };
        if (document.readyState === 'complete') dismiss();
        else window.addEventListener('load', dismiss);
    },

    /* ── RENDERERS ── */
    renderStats(stats) {
        const el = document.getElementById('hero-stats');
        if (!el) return;
        el.innerHTML = stats.map(s => `
            <div class="hero-stat">
                <div class="hero-stat-accent"></div>
                <div class="hero-stat-num">${s.value}</div>
                <div class="hero-stat-label">${s.label}</div>
            </div>`).join('');
    },

    renderExpertise(items) {
        const el = document.getElementById('expertise-container');
        if (!el) return;
        el.innerHTML = items.map((item, i) => `
            <div class="expertise-item reveal stagger-${(i % 4) + 1}" role="listitem" tabindex="0" aria-label="${item.title}">
                <span class="expertise-num">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="expertise-name">${item.title}</h3>
                <span class="expertise-icon" aria-hidden="true">${item.icon}</span>
            </div>`).join('');
    },

    renderLeadership(people) {
        const el = document.getElementById('leadership-container');
        if (!el) return;
        el.innerHTML = people.map((p, i) => `
            <div class="counsel-card reveal stagger-${i + 1}" role="listitem">
                <img src="${p.img}" alt="Portrait of ${p.name}" class="counsel-img" loading="lazy">
                <div class="counsel-overlay">
                    <div><span class="counsel-badge">Senior Counsel</span></div>
                    <div class="counsel-bottom">
                        <h4 class="counsel-name">${p.name}</h4>
                        <p class="counsel-role">${p.role}</p>
                        <div class="counsel-divider"></div>
                        <p class="counsel-record">${p.record}</p>
                        <p class="counsel-specialty">${p.specialty}</p>
                    </div>
                </div>
                <div class="counsel-bar"></div>
            </div>`).join('');
    },

    renderAssociates(associates) {
        const el = document.getElementById('bench-container');
        if (!el) return;
        el.innerHTML = associates.map((a, i) => `
            <div class="associate-card reveal stagger-${(i % 5) + 1}" role="listitem">
                <img src="${a.img}" alt="Portrait of ${a.name}" class="associate-img" loading="lazy">
                <div class="associate-overlay">
                    <h5 class="associate-name">${a.name}</h5>
                    <p class="associate-role">${a.role}</p>
                    <div class="associate-line"></div>
                    <p class="associate-bio">${a.bio}</p>
                </div>
            </div>`).join('');
    },

    renderPillars(pillars) {
        const el = document.getElementById('pillars-container');
        if (!el) return;
        el.innerHTML = pillars.map((p, i) => `
            <div class="pillar reveal stagger-${i + 1}" role="listitem">
                <span class="pillar-num">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="pillar-title">${p.title}</h3>
                <p class="pillar-text">${p.text}</p>
            </div>`).join('');
    },

    renderCases(cases) {
        const el = document.getElementById('cases-container');
        if (!el) return;
        const vals   = cases.map(c => parseFloat(c.value.replace(/[^0-9.]/g, '')));
        const maxVal = Math.max(...vals);
        el.innerHTML = cases.map((c, i) => {
            const pct = Math.round((vals[i] / maxVal) * 100);
            return `
            <div class="case-item reveal stagger-${i + 1}" role="listitem">
                <span class="case-index">Matter ${String(i + 1).padStart(2, '0')}</span>
                <div class="case-value">${c.value}</div>
                <div class="case-title">${c.title}</div>
                <div class="case-bar-wrap">
                    <div class="case-bar-track">
                        <div class="case-bar-fill" data-pct="${pct}"></div>
                    </div>
                </div>
                <div class="case-rule"></div>
                <div class="case-jurisdiction">${c.jurisdiction}</div>
                <div class="case-year">${c.year}</div>
            </div>`;
        }).join('');
    },

    renderContactInfo(contact) {
        const el = document.getElementById('contact-info-blocks');
        if (!el || !contact) return;
        el.innerHTML = `
            <div class="contact-info-block reveal stagger-1">
                <div class="contact-info-label">Principal Contact</div>
                <div class="contact-info-value">${contact.name}</div>
                <div class="contact-info-sub">Managing Partner — Global Advocacy</div>
            </div>
            <div class="contact-info-block reveal stagger-2">
                <div class="contact-info-label">Secure Email</div>
                <div class="contact-info-value">
                    <a href="mailto:${contact.email}">${contact.email}</a>
                </div>
                <div class="contact-info-sub">Encrypted. Attorney-client privilege applies.</div>
            </div>
            <div class="contact-info-block reveal stagger-3">
                <div class="contact-info-label">Direct Line</div>
                <div class="contact-info-value">${contact.phone}</div>
                <div class="contact-info-sub">${contact.hours}</div>
            </div>
            <div class="contact-info-block reveal stagger-4">
                <div class="contact-info-label">Chambers</div>
                <div class="contact-info-value" style="font-size:1.15rem">${contact.address}</div>
            </div>`;
    },

    populateSelect(items) {

        /* ── PORTAL DROPDOWN ENGINE ──────────────────────────────────
           Each panel is moved to <body> so no parent stacking context
           (backdrop-filter, transform, opacity) can ever trap it.
           Positioning is recalculated on open via getBoundingClientRect.
        ──────────────────────────────────────────────────────────── */

        const configs = [
            {
                csId:'cs-modal', selId:'f-area',
                sourceKey:'expertise',
                buildOption:(item,i)=>`
                    <div class="csp-option" data-value="${item.title}">
                        <span class="csp-num">${String(i+1).padStart(2,'0')}</span>
                        <div class="csp-body"><span class="csp-label">${item.title}</span></div>
                        <span class="csp-check">✦</span>
                    </div>`
            },
            {
                csId:'cs-inline', selId:'fi-area',
                sourceKey:'expertise',
                buildOption:(item,i)=>`
                    <div class="csp-option" data-value="${item.title}">
                        <span class="csp-num">${String(i+1).padStart(2,'0')}</span>
                        <div class="csp-body"><span class="csp-label">${item.title}</span></div>
                        <span class="csp-check">✦</span>
                    </div>`
            },
            {
                csId:'cs-modal-matter', selId:'f-matter',
                sourceKey:'matters',
                buildOption:(item,i)=>`
                    <div class="csp-option" data-value="${item.title}">
                        <span class="csp-num">${String(i+1).padStart(2,'0')}</span>
                        <div class="csp-body">
                            <span class="csp-label">${item.title}</span>
                            <span class="csp-sub">${item.desc}</span>
                        </div>
                        <span class="csp-check">✦</span>
                    </div>`
            },
            {
                csId:'cs-inline-matter', selId:'fi-matter',
                sourceKey:'matters',
                buildOption:(item,i)=>`
                    <div class="csp-option" data-value="${item.title}">
                        <span class="csp-num">${String(i+1).padStart(2,'0')}</span>
                        <div class="csp-body">
                            <span class="csp-label">${item.title}</span>
                            <span class="csp-sub">${item.desc}</span>
                        </div>
                        <span class="csp-check">✦</span>
                    </div>`
            },
            {
                csId:'cs-modal-lawyer', selId:'f-lawyer',
                sourceKey:'lawyers',
                buildOption:(item,i)=>`
                    <div class="csp-option" data-value="${item.name}">
                        <span class="csp-num">${String(i+1).padStart(2,'0')}</span>
                        <div class="csp-body">
                            <span class="csp-label">${item.name}</span>
                            <span class="csp-sub">${item.role}</span>
                        </div>
                        <span class="csp-check">✦</span>
                    </div>`
            },
            {
                csId:'cs-inline-lawyer', selId:'fi-lawyer',
                sourceKey:'lawyers',
                buildOption:(item,i)=>`
                    <div class="csp-option" data-value="${item.name}">
                        <span class="csp-num">${String(i+1).padStart(2,'0')}</span>
                        <div class="csp-body">
                            <span class="csp-label">${item.name}</span>
                            <span class="csp-sub">${item.role}</span>
                        </div>
                        <span class="csp-check">✦</span>
                    </div>`
            },
        ];

        // track globally open portal panel so we can close others
        let activePortal = null;

        configs.forEach(cfg => {
            const cs      = document.getElementById(cfg.csId);
            const sel     = document.getElementById(cfg.selId);
            if (!cs) return;

            const sourceItems = cfg.sourceKey === 'lawyers'  ? this.data.lawyers  :
                                cfg.sourceKey === 'matters'  ? this.data.matters  :
                                items;

            const trigger   = cs.querySelector('.custom-select-trigger');
            const valueSpan = cs.querySelector('.cs-value');

            // Populate hidden native select
            if (sel) {
                sel.innerHTML = '<option value="" disabled selected></option>';
                sourceItems.forEach(item => {
                    const o = document.createElement('option');
                    o.value = item.title || item.name;
                    o.textContent = item.title || item.name;
                    sel.appendChild(o);
                });
            }

            /* ── BUILD PORTAL PANEL appended directly to <body> ── */
            const portal = document.createElement('div');
            portal.className = 'csp-portal';
            portal.setAttribute('role','listbox');
            portal.innerHTML = `
                <div class="csp-search">
                    <span class="csp-search-icon">⌕</span>
                    <input type="text" placeholder="Search…" class="csp-search-input" autocomplete="off">
                </div>
                <div class="csp-list">${sourceItems.map((item,i) => cfg.buildOption(item,i)).join('')}</div>`;
            document.body.appendChild(portal);

            const listEl   = portal.querySelector('.csp-list');
            const searchIn = portal.querySelector('.csp-search-input');

            /* ── POSITION portal below trigger ── */
            const reposition = () => {
                const r = trigger.getBoundingClientRect();
                portal.style.position   = 'fixed';
                portal.style.top        = (r.bottom + 4) + 'px';
                portal.style.left       = r.left + 'px';
                portal.style.width      = r.width + 'px';
                portal.style.zIndex     = '999999';
            };

            const openPortal = () => {
                // close any other open portal first
                if (activePortal && activePortal !== portal) {
                    activePortal.classList.remove('csp-open');
                    activePortal._trigger && activePortal._trigger.classList.remove('open','selected-open');
                }
                reposition();
                portal.classList.add('csp-open');
                portal._trigger = trigger;
                activePortal = portal;
                trigger.classList.add('open');
                searchIn.value = '';
                listEl.querySelectorAll('.csp-option').forEach(o => o.classList.remove('hidden'));
                setTimeout(() => searchIn.focus(), 50);
            };

            const closePortal = () => {
                portal.classList.remove('csp-open');
                trigger.classList.remove('open');
                if (activePortal === portal) activePortal = null;
            };

            trigger.addEventListener('click', e => {
                e.stopPropagation();
                portal.classList.contains('csp-open') ? closePortal() : openPortal();
            });

            trigger.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPortal(); }
                if (e.key === 'Escape') closePortal();
            });

            /* ── OPTION CLICK ── */
            listEl.addEventListener('click', e => {
                const opt = e.target.closest('.csp-option');
                if (!opt) return;
                listEl.querySelectorAll('.csp-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                valueSpan.textContent = opt.dataset.value;
                trigger.classList.add('selected');
                if (sel) sel.value = opt.dataset.value;
                closePortal();
            });

            /* ── SEARCH FILTER ── */
            searchIn.addEventListener('input', () => {
                const q = searchIn.value.toLowerCase();
                listEl.querySelectorAll('.csp-option').forEach(opt => {
                    opt.classList.toggle('hidden', !opt.dataset.value.toLowerCase().includes(q));
                });
            });

            /* ── CLOSE ON OUTSIDE CLICK ── */
            document.addEventListener('click', e => {
                if (!cs.contains(e.target) && !portal.contains(e.target)) closePortal();
            });

            /* ── REPOSITION ON SCROLL/RESIZE ── */
            window.addEventListener('scroll', () => { if (portal.classList.contains('csp-open')) reposition(); }, { passive:true });
            window.addEventListener('resize', () => { if (portal.classList.contains('csp-open')) reposition(); });
        });
    },

    /* ── SCROLL PROGRESS ── */
    initScrollProgress() {
        const bar = document.getElementById('scroll-progress');
        if (!bar) return;
        window.addEventListener('scroll', () => {
            const s = window.scrollY;
            const m = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = m > 0 ? `${(s / m) * 100}%` : '0%';
        }, { passive: true });
    },

    /* ── CURSOR ── */
    initCursor() {
        const dot  = document.getElementById('cursor');
        const ring = document.getElementById('cursor-ring');
        if (!dot || !ring) return;

        document.addEventListener('mousemove', (e) => {
            this.state.mouseX = e.clientX;
            this.state.mouseY = e.clientY;
            dot.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`;
        }, { passive: true });

        const lerp = (a, b, t) => a + (b - a) * t;
        const tick = () => {
            this.state.ringX = lerp(this.state.ringX, this.state.mouseX, 0.1);
            this.state.ringY = lerp(this.state.ringY, this.state.mouseY, 0.1);
            ring.style.transform = `translate3d(${this.state.ringX}px,${this.state.ringY}px,0) translate(-50%,-50%)`;
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        const targets = 'a, button, .counsel-card, .expertise-item, .associate-card, .pillar, .case-item, .contact-info-block';
        document.querySelectorAll(targets).forEach(el => {
            el.addEventListener('mouseenter', () => { dot.classList.add('expanded'); ring.classList.add('expanded'); });
            el.addEventListener('mouseleave', () => { dot.classList.remove('expanded'); ring.classList.remove('expanded'); });
        });

        document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    },

    /* ── NAV ── */
    initNav() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    },

    /* ── REVEAL ON SCROLL ── */
    initReveal() {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('active');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal, .reveal-left').forEach(el => io.observe(el));

        // Re-observe after dynamic render
        setTimeout(() => {
            document.querySelectorAll('.reveal:not(.active), .reveal-left:not(.active)').forEach(el => io.observe(el));
        }, 200);
    },

    /* ── HERO PARALLAX ── */
    initHeroParallax() {
        const media = document.querySelector('.hero-media');
        if (!media) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight * 1.2) {
                media.style.transform = `translate3d(0,${window.scrollY * 0.22}px,0)`;
            }
        }, { passive: true });
    },

    /* ── COUNTER ANIMATION ── */
    initCounters() {
        const animate = (el, raw, dur) => {
            const cleaned = raw.replace(/[^0-9.]/g, '');
            const suffix  = raw.replace(/[0-9.]/g, '');
            const target  = parseFloat(cleaned);
            if (isNaN(target)) return;
            const t0 = performance.now();
            const tick = (now) => {
                const p = Math.min((now - t0) / dur, 1);
                const e = 1 - Math.pow(1 - p, 4);
                const v = Number.isInteger(target) ? Math.round(target * e) : (target * e).toFixed(1);
                el.textContent = v + suffix;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !e.target.dataset.animated) {
                    e.target.dataset.animated = '1';
                    animate(e.target, e.target.dataset.final || e.target.textContent, 1900);
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.hero-stat-num').forEach(el => {
            el.dataset.final = el.textContent;
            io.observe(el);
        });
    },

    /* ── MODAL (nav CTA quick-contact) ── */
    initContactModal() {
        const overlay = document.getElementById('contact-overlay');
        if (!overlay) return;

        const open  = () => { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
        const close = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; };

        document.querySelectorAll('.nav-cta').forEach(btn => {
            btn.addEventListener('click', (e) => { e.preventDefault(); open(); });
        });
        document.querySelectorAll('.overlay-close, .modal-close-btn').forEach(btn => btn.addEventListener('click', close));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

        const form = document.getElementById('modal-form');
        if (!form) return;
        this._bindForm(form, close);
    },

    /* ── INLINE CONTACT SECTION FORM ── */
    initInlineForm() {
        const form = document.getElementById('inline-contact-form');
        if (!form) return;
        this._bindForm(form, null);
    },

    /* ── SHARED FORM HANDLER ── */
    _bindForm(form, onSuccess) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn  = form.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span>Transmitting…</span>';
            btn.style.opacity = '0.7';

            await new Promise(r => setTimeout(r, 1800));

            btn.innerHTML = '<span>Inquiry Received</span><span class="btn-arrow">✓</span>';
            btn.style.background = 'transparent';
            btn.style.color = 'var(--gold)';
            btn.style.border = '1px solid var(--gold-rule)';
            btn.style.opacity = '1';

            setTimeout(() => {
                if (onSuccess) onSuccess();
                form.reset();
                btn.innerHTML = orig;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.border = '';
                btn.disabled = false;
            }, 2400);
        });
    },

    /* ══════════════════════════════════════════════════════
       STRIPE PAYMENT MODAL
       ══════════════════════════════════════════════════════
       HOW TO ACTIVATE:
       1. Go to https://stripe.com → create free account
       2. Get your Publishable Key from Dashboard → Developers → API Keys
       3. Replace 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY' below
       4. Set up a backend endpoint to create PaymentIntents
          (or use Stripe Payment Links for zero-code option)
    ══════════════════════════════════════════════════════ */
    initPayment() {
        const overlay   = document.getElementById('payment-overlay');
        const openBtn   = document.getElementById('open-payment-btn');
        const tiers     = document.querySelectorAll('.payment-tier');
        const formWrap  = document.getElementById('payment-form-wrap');
        const summary   = document.getElementById('payment-summary');
        const payBtn    = document.getElementById('stripe-pay-btn');
        const btnText   = document.getElementById('stripe-btn-text');
        const errEl     = document.getElementById('stripe-errors');
        if (!overlay) return;

        /* ── Open / Close ── */
        const openModal  = () => { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
        const closeModal = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; };

        openBtn && openBtn.addEventListener('click', openModal);

        // Also allow nav "Consultation" to open payment
        // (keep existing modal working — payment is separate)

        overlay.querySelector('.overlay-close').addEventListener('click', closeModal);
        overlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

        /* ── Tier Selection ── */
        let selectedPrice = null;
        let selectedLabel = '';
        let stripe = null, cardElement = null;

        tiers.forEach(tier => {
            tier.addEventListener('click', () => {
                tiers.forEach(t => t.classList.remove('active'));
                tier.classList.add('active');
                selectedPrice = parseInt(tier.dataset.price);
                selectedLabel = tier.dataset.label;

                // Show form
                formWrap.style.display = 'block';
                summary.innerHTML = `
                    <span>${selectedLabel}</span>
                    <span>£${(selectedPrice / 100).toFixed(0)}</span>`;

                // Load Stripe.js if not loaded
                if (!window.Stripe) {
                    const script = document.createElement('script');
                    script.src = 'https://js.stripe.com/v3/';
                    script.onload = () => this._mountStripeCard(stripe, cardElement, errEl);
                    document.head.appendChild(script);
                } else {
                    this._mountStripeCard();
                }
            });
        });

        /* ── Pay Button ── */
        payBtn && payBtn.addEventListener('click', async () => {
            if (!selectedPrice) return;

            // ── STRIPE INTEGRATION INSTRUCTIONS ──────────────────────
            // To take real payments:
            //
            // 1. Replace the key below with your real Stripe publishable key
            //    const STRIPE_PK = 'pk_live_YOUR_KEY_HERE';
            //
            // 2. Create a backend endpoint that:
            //    - Receives { amount, currency } via POST
            //    - Creates a PaymentIntent with Stripe server SDK
            //    - Returns { clientSecret }
            //
            // 3. Uncomment the fetch block below and point it to your endpoint
            //
            // ZERO-CODE OPTION (no backend needed):
            //    - Use Stripe Payment Links: https://stripe.com/payment-links
            //    - Replace the button href with your Payment Link URL
            // ─────────────────────────────────────────────────────────

            btnText.textContent = 'Processing…';
            payBtn.disabled = true;

            // Simulate for demo — replace with real Stripe call:
            await new Promise(r => setTimeout(r, 1800));

            btnText.textContent = 'Booking Confirmed ✓';
            payBtn.style.background = 'transparent';
            payBtn.style.color = 'var(--gold)';
            payBtn.style.border = '1px solid var(--gold-rule)';

            setTimeout(() => {
                closeModal();
                btnText.textContent = 'Pay Securely';
                payBtn.style = '';
                payBtn.disabled = false;
                formWrap.style.display = 'none';
                tiers.forEach(t => t.classList.remove('active'));

                // After real payment — redirect to Calendly or show success
                // window.open('https://calendly.com/YOUR_LINK', '_blank');
            }, 2200);
        });
    },

    /* Mount Stripe card element */
    _mountStripeCard() {
        const cardEl = document.getElementById('stripe-card-element');
        const errEl  = document.getElementById('stripe-errors');
        if (!cardEl || !window.Stripe) return;
        if (cardEl.dataset.mounted) return;
        cardEl.dataset.mounted = '1';

        /* Replace with your real publishable key */
        const STRIPE_PK = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';

        try {
            const stripe  = window.Stripe(STRIPE_PK);
            const elements = stripe.elements({
                fonts:[{ cssSrc:'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500' }]
            });
            const card = elements.create('card', {
                style:{
                    base:{
                        fontFamily:'Instrument Sans, sans-serif',
                        fontSize:'16px',
                        color:'#eee9dc',
                        '::placeholder':{ color:'#64635a' },
                        iconColor:'#c9a86c',
                    },
                    invalid:{ color:'#e05c5c', iconColor:'#e05c5c' }
                },
                hidePostalCode: true,
            });
            card.mount('#stripe-card-element');
            card.on('change', e => {
                errEl.textContent = e.error ? e.error.message : '';
            });
            card.on('focus', () => cardEl.classList.add('focused'));
            card.on('blur',  () => cardEl.classList.remove('focused'));
        } catch(e) {
            cardEl.innerHTML = `<div style="color:#888;font-size:0.8rem;padding:0.5rem">
                Add your Stripe publishable key in chancery.js to enable card payments.
            </div>`;
        }
    },

    /* ══════════════════════════════════════════════════════
       CALENDLY BOOKING EMBED
       ══════════════════════════════════════════════════════
       HOW TO ACTIVATE:
       1. Go to https://calendly.com → sign up free
       2. Create an event type (e.g. "30-min Legal Consultation")
       3. Copy your Calendly URL e.g. https://calendly.com/yourname/consultation
       4. Replace CALENDLY_URL below with your actual link
    ══════════════════════════════════════════════════════ */
    initCalendly() {
        /* ── REPLACE THIS with your real Calendly URL ── */
        const CALENDLY_URL = '';
        // Example: const CALENDLY_URL = 'https://calendly.com/chanceryelite/consultation';

        const placeholder = document.getElementById('cal-placeholder');
        const embedDiv    = document.getElementById('calendly-embed');
        if (!placeholder || !embedDiv) return;

        if (CALENDLY_URL && CALENDLY_URL.length > 10) {
            // Load Calendly widget script
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = () => {
                if (window.Calendly) {
                    placeholder.style.display = 'none';
                    embedDiv.style.display = 'block';
                    window.Calendly.initInlineWidget({
                        url: CALENDLY_URL,
                        parentElement: embedDiv,
                        prefill: {},
                        utm: {}
                    });
                }
            };
            document.head.appendChild(script);
        }
        // If no URL set, placeholder remains visible with setup instructions
    },

    /* ── BACK TO TOP ── */
    initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;
        window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 700), { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    },

    /* ── SMOOTH LINKS ── */
    initSmoothLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href === '#' || href === '#contact-overlay') return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const navH   = document.getElementById('main-nav')?.offsetHeight || 80;
                const offset = target.getBoundingClientRect().top + window.scrollY - navH - 20;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            });
        });
    },

    /* ── RADIAL RINGS ── */
    renderRings() {
        const el = document.getElementById('rings-container');
        if (!el) return;
        const C = 339;
        const rings = [
            { pct: 97, label: 'Verdict\nRecord',    bright: true  },
            { pct: 89, label: 'Client\nRetention',  bright: false },
            { pct: 94, label: 'Cases\nResolved',    bright: false },
            { pct: 78, label: 'Pre-trial\nSettled', dim:    true  },
        ];
        el.innerHTML = rings.map((r) => {
            const dash = (r.pct / 100) * C;
            const cls  = r.bright ? 'ring-fill bright' : r.dim ? 'ring-fill dim' : 'ring-fill';
            const lines = r.label.split('\n');
            return `
            <div class="ring-item">
              <svg class="ring-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <circle class="ring-track" cx="60" cy="60" r="54"
                  transform="rotate(-90 60 60)"/>
                <circle class="${cls}" cx="60" cy="60" r="54"
                  data-dash="${dash}" data-c="${C}"
                  stroke-dasharray="0 ${C}"
                  transform="rotate(-90 60 60)"/>
                <text x="60" y="56" text-anchor="middle" dominant-baseline="middle">
                  <tspan class="ring-pct" x="60" dy="0">${r.pct}%</tspan>
                  <tspan class="ring-unit" x="60" dy="14">${lines[0]}</tspan>
                </text>
              </svg>
              <div class="ring-caption">${lines[1] || ''}</div>
            </div>`;
        }).join('');
    },

    /* ── HORIZONTAL BAR CHART ── */
    renderBars(cases) {
        const el = document.getElementById('bars-container');
        if (!el) return;
        const vals   = cases.map(c => parseFloat(c.value.replace(/[^0-9.]/g, '')));
        const maxVal = Math.max(...vals);
        el.innerHTML = cases.map((c, i) => {
            const pct = Math.round((vals[i] / maxVal) * 100);
            return `
            <div class="bar-item">
              <div class="bar-meta">
                <span class="bar-name">${c.title}</span>
                <span class="bar-val">${c.value}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" data-pct="${pct}"></div>
                <div class="bar-track-glow"></div>
              </div>
              <div class="bar-jurisdiction">${c.jurisdiction}</div>
            </div>`;
        }).join('');
    },

    /* ── ANIMATE CHARTS ON SCROLL ── */
    initChartAnimations() {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                e.target.querySelectorAll('.ring-fill').forEach((circle, i) => {
                    const dash = parseFloat(circle.dataset.dash);
                    const C    = parseFloat(circle.dataset.c) || 339;
                    setTimeout(() => {
                        circle.style.strokeDasharray = `${dash} ${C - dash}`;
                    }, i * 130);
                });
                e.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.pct + '%';
                        bar.classList.add('lit');
                    }, i * 160);
                });
                e.target.querySelectorAll('.case-bar-fill').forEach((bar, i) => {
                    setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, i * 120);
                });
                io.unobserve(e.target);
            });
        }, { threshold: 0.18 });

        const viz = document.getElementById('data-viz');
        if (viz) io.observe(viz);
        const casesBand = document.querySelector('.cases-band');
        if (casesBand) io.observe(casesBand);
    },

    /* ── MAGNETIC BUTTONS ── */
    initMagneticButtons() {
        if (!window.matchMedia('(pointer:fine)').matches) return;
        document.querySelectorAll('.btn-primary, .btn-outline, .btn-form').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r  = btn.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width  / 2)) * 0.22;
                const dy = (e.clientY - (r.top  + r.height / 2)) * 0.22;
                btn.style.transform = `translate(${dx}px,${dy}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                btn.style.transform  = '';
                setTimeout(() => { btn.style.transition = ''; }, 500);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Chancery.init());
