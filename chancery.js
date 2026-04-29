/* =============================================
   CHANCERY ELITE — Production JS Engine v2.0
   ============================================= */

const Chancery = {

    state: {
        mouseX: 0, mouseY: 0,
        ringX: 0, ringY: 0,
        raf: null,
        loaded: false,
    },

    async init() {
        const loader = document.getElementById('loader');
        const heroMedia = document.querySelector('.hero-media');

        // Helper to remove loader and show content
        const dismissLoader = () => {
            if (loader) loader.classList.add('done');
            if (heroMedia) heroMedia.classList.add('loaded');
            this.state.loaded = true;
        };

        try {
            // 1. Fetch Data Secure Link
            const res = await fetch('chancery.json');
            if (!res.ok) throw new Error('Data fetch failed');
            const data = await res.json();

            // 2. Render Components from JSON
            this.renderPillars(data.pillars);
            this.renderExpertise(data.expertise);
            this.renderLeadership(data.leadership);
            this.renderAssociates(data.associates);

            // 3. Initialize UI Systems
            // Only init custom cursor if a mouse is detected
            if (window.matchMedia("(pointer: fine)").matches) {
                this.initCursor();
            } else {
                const c1 = document.getElementById('cursor');
                const c2 = document.getElementById('cursor-ring');
                if(c1) c1.style.display = 'none';
                if(c2) c2.style.display = 'none';
            }

            this.initNav();
            this.initContactModal();
            this.initHeroParallax();
            this.initCounters();
            this.initTickerDupe();
            
            // 4. Initial Scroll Observer Call
            this.initReveal();

            /* CRITICAL FIX: We re-trigger initReveal after 100ms.
               This ensures that the scroll animations "see" the 
               elements we just injected from the JSON data.
            */
            setTimeout(() => this.initReveal(), 100);

            // 5. Professional Dismissal of Loading Overlay
            if (document.readyState === 'complete') {
                dismissLoader();
            } else {
                window.addEventListener('load', dismissLoader);
            }

        } catch (err) {
            console.error('[Chancery] Engine Failure:', err);
            
            // Premium Error Display in the Expertise section
            const expertiseContainer = document.getElementById('expertise-container');
            if (expertiseContainer) {
                expertiseContainer.innerHTML = `
                    <div style="text-align:center; grid-column: 1/-1; padding: 4rem; border: 1px solid var(--gold-rule); background: rgba(200,164,110,0.02);">
                        <p style="color:var(--gold); margin-bottom: 1.5rem; font-family: 'Space Mono', monospace; font-size: 0.7rem; letter-spacing: 0.2em;">
                            PROTOCOL ERROR: SECURE DATA LINK UNAVAILABLE
                        </p>
                        <button onclick="location.reload()" class="btn-outline" style="margin: 0 auto; padding: 0.8rem 2rem; border: 1px solid var(--gold-rule); background: transparent; color: var(--gold); cursor: pointer; font-family: 'Space Mono', monospace; font-size: 0.6rem; text-transform: uppercase;">
                            RE-ESTABLISH CONNECTION
                        </button>
                    </div>`;
            }
            
            // Ensure site is visible even on failure
            dismissLoader(); 
        }
    },

    // ─── RENDER ENGINES ─────────────────────────

    renderExpertise(items) {
        const el = document.getElementById('expertise-container');
        const formSelect = document.getElementById('f-area');
        if (!el) return;

        el.innerHTML = items.map((item, i) => `
            <div class="expertise-item reveal stagger-${(i % 4) + 1}">
                <span class="expertise-num">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="expertise-name">${item.title}</h3>
                <span class="expertise-tag">${item.desc}</span>
            </div>
        `).join('');

        if (formSelect) {
            formSelect.innerHTML = '<option value="" disabled selected>Select practice area…</option>';
            items.forEach(item => {
                const opt = document.createElement('option');
                opt.textContent = item.title;
                formSelect.appendChild(opt);
            });
        }
    },

    renderLeadership(people) {
        const el = document.getElementById('leadership-container');
        if (!el) return;
        el.innerHTML = people.map((p, i) => `
            <div class="counsel-card reveal stagger-${i + 1}">
                <img src="${p.img}" alt="${p.name}" class="counsel-img" loading="lazy">
                <div class="counsel-overlay">
                    <div><span class="counsel-badge">Trial Counsel</span></div>
                    <div>
                        <h4 class="counsel-name">${p.name}</h4>
                        <p class="counsel-role">${p.role}</p>
                        <div class="counsel-divider"></div>
                    </div>
                </div>
                <div class="counsel-bar"></div>
            </div>
        `).join('');
    },

    renderAssociates(associates) {
    const el = document.getElementById('bench-container');
    if (!el) return;
    el.innerHTML = associates.map((a, i) => `
        <div class="associate-card reveal stagger-${(i % 5) + 1}">
            <img src="${a.img}" alt="${a.name}" class="associate-img" loading="lazy">
            <div class="associate-overlay">
                <h5 class="associate-name">${a.name}</h5>
                <p class="associate-role">${a.role}</p>
                <div class="associate-line"></div>
                <p class="associate-bio">${a.bio}</p>
            </div>
        </div>
    `).join('');
},

    renderPillars(pillars) {
        const el = document.getElementById('pillars-container');
        if (!el) return;
        el.innerHTML = pillars.map((p, i) => `
            <div class="pillar reveal stagger-${i + 1}">
                <span class="pillar-num">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="pillar-title">${p.title}</h3>
                <p class="pillar-text">${p.text}</p>
            </div>
        `).join('');
    },

    // ─── INTERACTIVE SYSTEMS ─────────────────────

    initCursor() {
        const dot = document.getElementById('cursor');
        const ring = document.getElementById('cursor-ring');
        if (!dot || !ring) return;

        document.addEventListener('mousemove', (e) => {
            this.state.mouseX = e.clientX;
            this.state.mouseY = e.clientY;
            dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        });

        const lerp = (a, b, t) => a + (b - a) * t;
        const tick = () => {
            this.state.ringX = lerp(this.state.ringX, this.state.mouseX, 0.12);
            this.state.ringY = lerp(this.state.ringY, this.state.mouseY, 0.12);
            ring.style.transform = `translate3d(${this.state.ringX}px, ${this.state.ringY}px, 0)`;
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    },

    initReveal() {
        const options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('active');
                    io.unobserve(e.target);
                }
            });
        }, options);

        const observeTargets = () => {
            document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => io.observe(el));
        };
        observeTargets();
        setTimeout(observeTargets, 500);
    },

    initNav() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    },

    initHeroParallax() {
        const media = document.querySelector('.hero-media');
        if (!media) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                media.style.transform = `translate3d(0, ${window.scrollY * 0.25}px, 0)`;
            }
        }, { passive: true });
    },

    initCounters() {
        const stats = document.querySelectorAll('.hero-stat-num');
        stats.forEach(el => { el.dataset.final = el.textContent; });
    },

    initTickerDupe() {
        document.querySelectorAll('.ticker-track, .marquee-track').forEach(track => {
            const clone = track.cloneNode(true);
            track.parentElement.appendChild(clone);
        });
    },

    initContactModal() {
        const overlay = document.getElementById('contact-overlay');
        if (!overlay) return;

        const open = () => {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            overlay.setAttribute('aria-hidden', 'false');
        };
        const close = () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            overlay.setAttribute('aria-hidden', 'true');
        };

        document.querySelectorAll('.nav-cta, .btn-primary, .btn-outline').forEach(btn => {
            btn.addEventListener('click', (e) => { 
                if(!btn.classList.contains('reload-btn')) { // Don't trigger modal for reload button
                    e.preventDefault(); 
                    open(); 
                }
            });
        });

        document.querySelectorAll('.overlay-close, .modal-close-btn').forEach(btn => {
            btn.addEventListener('click', close);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) close();
        });

        const form = document.getElementById('consultation-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                const original = btn.innerHTML;

                btn.innerHTML = '<span>Verifying Protocol...</span>';
                btn.disabled = true;
                btn.style.opacity = '0.7';

                try {
                    await new Promise(resolve => setTimeout(resolve, 1800));
                    btn.innerHTML = '<span>Inquiry Transmitted</span> <span class="btn-arrow">✓</span>';
                    btn.style.background = 'rgba(200,164,110,0.2)';
                    btn.style.color = 'var(--gold)';
                    btn.style.opacity = '1';

                    setTimeout(() => {
                        close();
                        form.reset();
                        btn.innerHTML = original;
                        btn.style.background = '';
                        btn.style.color = '';
                        btn.disabled = false;
                    }, 1500);
                } catch (err) {
                    btn.innerHTML = '<span>System Error</span>';
                    btn.disabled = false;
                }
            });
        }
    },
};

document.addEventListener('DOMContentLoaded', () => Chancery.init());