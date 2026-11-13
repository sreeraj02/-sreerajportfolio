/**
 * SREERAJ R. — PORTFOLIO // "ORDER IN THE CHAOS"
 * Interactive Engine: Three.js/Canvas Particle Field, Web Audio Synthesis,
 * Kinetic Cursor, Code Runner, and Telemetry Systems.
 */

(function () {
    'use strict';

    // ===================================================================
    // 01. AUDIO SYNTHESIZER (WEB AUDIO API)
    // ===================================================================
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.enabled = false;
            this.initOnFirstInteraction = this.initOnFirstInteraction.bind(this);
            window.addEventListener('click', this.initOnFirstInteraction, { once: true });
        }

        initOnFirstInteraction() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
        }

        ensureContext() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        toggle() {
            this.ensureContext();
            this.enabled = !this.enabled;
            if (this.enabled) {
                this.playClick();
            }
            return this.enabled;
        }

        // Tactile micro-click for hover
        playHover() {
            if (!this.enabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(950, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.02);
                gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.02);
            } catch (e) { }
        }

        // Affirmative chirp for clicks
        playClick() {
            if (!this.enabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06);
                gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.06);
            } catch (e) { }
        }

        // Sub-bass cinematic shockwave blast
        playShock() {
            if (!this.enabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(160, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.4);

                gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, this.ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.4);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.45);
            } catch (e) { }
        }

        // Data blip sequence for code runner
        playDataBurst() {
            if (!this.enabled || !this.ctx) return;
            const freqs = [520, 650, 780, 1040];
            freqs.forEach((freq, idx) => {
                setTimeout(() => {
                    try {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
                        osc.connect(gain);
                        gain.connect(this.ctx.destination);
                        osc.start();
                        osc.stop(this.ctx.currentTime + 0.04);
                    } catch (e) { }
                }, idx * 45);
            });
        }
    }

    const sound = new SoundEngine();

    // ===================================================================
    // 02. KINETIC CURSOR SYSTEM
    // ===================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorLabel = document.getElementById('cursor-label');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: mouse.x, y: mouse.y };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        if (cursorDot) {
            cursorDot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
        }
        if (cursorLabel) {
            cursorLabel.style.transform = `translate(${mouse.x + 20}px, ${mouse.y - 16}px)`;
        }
    });

    // Lerp loop for fluid trailing ring
    function renderCursor() {
        const factor = 0.18;
        ringPos.x += (mouse.x - ringPos.x) * factor;
        ringPos.y += (mouse.y - ringPos.y) * factor;

        if (cursorRing) {
            cursorRing.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
        }
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Interactive Hover States
    const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, .capability-card, .profile-spotlight-card, .tool-chip, .chapter-card, .intent-pill'
    );

    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            if (cursorRing) cursorRing.classList.add('hovered');
            sound.playHover();

            const customLabel = el.getAttribute('data-cursor');
            if (customLabel && cursorLabel) {
                cursorLabel.textContent = customLabel;
                cursorLabel.style.opacity = '1';
            }
        });

        el.addEventListener('mouseleave', () => {
            if (cursorRing) cursorRing.classList.remove('hovered');
            if (cursorLabel) {
                cursorLabel.style.opacity = '0';
            }
        });

        el.addEventListener('click', () => {
            sound.playClick();
        });
    });

    // ===================================================================
    // 03. "ORDER IN THE CHAOS" PARTICLE CANVAS ENGINE
    // ===================================================================
    const canvas = document.getElementById('chaos-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        let particles = [];
        const isMobile = window.innerWidth < 768;
        const PARTICLE_COUNT = isMobile ? 120 : 280;
        let shockwaves = [];
        let chaosIntensity = 0; // 0 = Pure Order, 1 = Maximum Chaos

        class Particle {
            constructor(index) {
                this.index = index;
                this.initOrderPosition();
                this.x = this.orderX;
                this.y = this.orderY;
                this.vx = 0;
                this.vy = 0;
                this.radius = Math.random() * 1.5 + 1;
                this.alpha = Math.random() * 0.45 + 0.25;
                this.baseAlpha = this.alpha;
                this.isAmber = Math.random() < 0.22;
            }

            initOrderPosition() {
                // Structured mathematical wave matrix
                const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * 1.6));
                const rows = Math.ceil(PARTICLE_COUNT / cols);
                const col = this.index % cols;
                const row = Math.floor(this.index / cols);

                const marginX = width * 0.08;
                const marginY = height * 0.08;
                const gridW = width - marginX * 2;
                const gridH = height - marginY * 2;

                const stepX = gridW / cols;
                const stepY = gridH / rows;

                this.orderX = marginX + col * stepX + (stepX / 2);
                this.orderY = marginY + row * stepY + (stepY / 2);

                // Subtle organic Lissajous offset
                this.phase = this.index * 0.06;
            }

            update(time) {
                // Wave oscillation in Order state
                const waveX = Math.cos(time * 0.0012 + this.phase) * 14;
                const waveY = Math.sin(time * 0.0015 + this.phase * 1.3) * 18;

                const targetX = this.orderX + waveX;
                const targetY = this.orderY + waveY;

                // Restoring spring force towards Order
                const spring = 0.035;
                const friction = 0.88;

                const ax = (targetX - this.x) * spring;
                const ay = (targetY - this.y) * spring;

                this.vx += ax;
                this.vy += ay;

                // Mouse deflection
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 140;

                if (dist < maxDist && dist > 0) {
                    const force = (1 - dist / maxDist) * 3.5;
                    this.vx += (dx / dist) * force;
                    this.vy += (dy / dist) * force;
                }

                // Shockwave influence
                shockwaves.forEach((shock) => {
                    const sdx = this.x - shock.x;
                    const sdy = this.y - shock.y;
                    const sdist = Math.sqrt(sdx * sdx + sdy * sdist);
                    const ringDelta = Math.abs(sdist - shock.radius);

                    if (ringDelta < shock.thickness) {
                        const blast = (1 - ringDelta / shock.thickness) * shock.power;
                        const angle = Math.atan2(sdy, sdx);
                        this.vx += Math.cos(angle) * blast;
                        this.vy += Math.sin(angle) * blast;
                        this.alpha = 0.9;
                    }
                });

                this.vx *= friction;
                this.vy *= friction;

                this.x += this.vx;
                this.y += this.vy;

                // Fade back to normal alpha
                if (this.alpha > this.baseAlpha) {
                    this.alpha -= 0.01;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                if (this.isAmber) {
                    ctx.fillStyle = `rgba(255, 159, 28, ${this.alpha * 1.2})`;
                    ctx.shadowColor = '#FF9F1C';
                    ctx.shadowBlur = 6;
                } else {
                    ctx.fillStyle = `rgba(240, 237, 232, ${this.alpha})`;
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle(i));
            }
        }
        initParticles();

        // Trigger Shockwave
        function triggerShock(x, y, customPower = 18) {
            sound.playShock();

            shockwaves.push({
                x: x || mouse.x || width / 2,
                y: y || mouse.y || height / 2,
                radius: 0,
                maxRadius: Math.max(width, height) * 0.85,
                speed: 16,
                thickness: 70,
                power: customPower,
                alpha: 1,
            });

            // Trigger 3D Loop disruption
            if (window.trigger3DDisruption) {
                window.trigger3DDisruption(customPower);
            }

            // Visual shock indicator on cursor
            if (cursorRing) {
                cursorRing.classList.add('shock-active');
                setTimeout(() => cursorRing.classList.remove('shock-active'), 500);
            }

            // HUD telemetry status change
            const statusTelemetry = document.getElementById('hud-order-status');
            if (statusTelemetry) {
                statusTelemetry.textContent = 'DISRUPTED [CHAOS]';
                statusTelemetry.style.color = '#FF9F1C';
                setTimeout(() => {
                    statusTelemetry.textContent = 'STABILIZING...';
                    setTimeout(() => {
                        statusTelemetry.textContent = 'EQUILIBRIUM [ORDER]';
                        statusTelemetry.style.color = '';
                    }, 1200);
                }, 1000);
            }
        }

        // Attach shock to buttons & canvas clicks
        document.querySelectorAll('.trigger-shock-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const rect = btn.getBoundingClientRect();
                triggerShock(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
            });
        });

        // Click on hero area or background triggers shock
        const heroStage = document.querySelector('.hero-stage');
        if (heroStage) {
            heroStage.addEventListener('click', (e) => {
                // Only trigger if not clicking buttons or interactive links
                if (!e.target.closest('a, button, input, .cockpit-terminal')) {
                    triggerShock(e.clientX, e.clientY, 18);
                }
            });
        }

        // Press & hold to build disruption
        let holdTimer = null;
        let holdStartTime = 0;

        window.addEventListener('mousedown', (e) => {
            if (e.target.closest('a, button, input, textarea, .cockpit-terminal')) return;
            holdStartTime = Date.now();
            holdTimer = setInterval(() => {
                const elapsed = (Date.now() - holdStartTime) / 1000;
                if (elapsed > 0.4) {
                    // Small turbulent pulses while holding
                    shockwaves.push({
                        x: mouse.x,
                        y: mouse.y,
                        radius: 0,
                        maxRadius: 180,
                        speed: 12,
                        thickness: 35,
                        power: 6,
                        alpha: 0.6
                    });
                }
            }, 80);
        });

        window.addEventListener('mouseup', () => {
            if (holdTimer) {
                clearInterval(holdTimer);
                holdTimer = null;
                const elapsed = (Date.now() - holdStartTime) / 1000;
                if (elapsed > 0.4) {
                    triggerShock(mouse.x, mouse.y, Math.min(32, 14 + elapsed * 8));
                }
            }
        });

        // Animation Loop
        let time = 0;
        function animate() {
            time++;
            ctx.clearRect(0, 0, width, height);

            // Update & render shockwaves
            for (let i = shockwaves.length - 1; i >= 0; i--) {
                const s = shockwaves[i];
                s.radius += s.speed;
                s.alpha = Math.max(0, 1 - (s.radius / s.maxRadius));

                // Draw luminous shock ring
                ctx.save();
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = `rgba(255, 159, 28, ${s.alpha * 0.45})`;
                ctx.shadowColor = '#FF9F1C';
                ctx.shadowBlur = 12;
                ctx.stroke();
                ctx.restore();

                if (s.radius >= s.maxRadius) {
                    shockwaves.splice(i, 1);
                }
            }

            // Update & render particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(time);
                particles[i].draw();

                // Draw network lines between neighboring particles
                const maxLineDist = isMobile ? 55 : 80;
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const d = Math.sqrt(dx * dx + dy * dy);

                    if (d < maxLineDist) {
                        const lineAlpha = (1 - d / maxLineDist) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(240, 237, 232, ${lineAlpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===================================================================
    // 04. INTERACTIVE COCKPIT CODE RUNNER
    // ===================================================================
    const runBtn = document.getElementById('run-code-btn');
    const codeDisplay = document.getElementById('code-display');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalTabs = document.querySelectorAll('.terminal-tab');

    const codeSnippets = {
        'developer.py': `<span class="syntax-keyword">class</span> <span class="syntax-class">SreerajR</span>:
    <span class="syntax-prop">name</span> = <span class="syntax-str">"Sreeraj R"</span>
    <span class="syntax-prop">role</span> = <span class="syntax-str">"Python Developer | Django &amp; SQL"</span>
    <span class="syntax-prop">education</span> = <span class="syntax-str">"BCA Graduate 2026 (CGPA: 7.219)"</span>
    <span class="syntax-prop">location</span> = <span class="syntax-str">"Alappuzha, Kerala, India"</span>
    <span class="syntax-prop">status</span> = <span class="syntax-str">"Available for Opportunities"</span>

    <span class="syntax-prop">stack</span> = [
        <span class="syntax-str">"Python"</span>, <span class="syntax-str">"Django"</span>, <span class="syntax-str">"Django REST (DRF)"</span>,
        <span class="syntax-str">"PostgreSQL"</span>, <span class="syntax-str">"MySQL"</span>, <span class="syntax-str">"React (Vite)"</span>
    ]

    <span class="syntax-prop">projects</span> = {
        <span class="syntax-str">"POS_Billing"</span>: <span class="syntax-str">"Retail Billing &amp; Inventory (github.com/sreeraj02/Billing-POS)"</span>,
        <span class="syntax-str">"Freelance_Platform"</span>: <span class="syntax-str">"Company-Freelancer Web App (github.com/sreeraj02)"</span>
    }

    <span class="syntax-keyword">def</span> <span class="syntax-func">build_solutions</span>(self, chaos_input):
        <span class="syntax-comment"># Transforming computational chaos into deterministic order</span>
        structure = self.parse_logic(chaos_input)
        <span class="syntax-keyword">return</span> structure.optimize()`,

        'pos_billing.py': `<span class="syntax-comment"># Author: Sreeraj R. | Python &amp; Django Developer</span>
<span class="syntax-comment"># Project: POS Billing Software (github.com/sreeraj02/Billing-POS)</span>
<span class="syntax-keyword">from</span> rest_framework <span class="syntax-keyword">import</span> viewsets, permissions
<span class="syntax-keyword">from</span> rest_framework_simplejwt.authentication <span class="syntax-keyword">import</span> JWTAuthentication
<span class="syntax-keyword">from</span> drf_spectacular.utils <span class="syntax-keyword">import</span> extend_schema
<span class="syntax-keyword">from</span> .models <span class="syntax-keyword">import</span> InventoryItem, SalesOrder
<span class="syntax-keyword">from</span> .serializers <span class="syntax-keyword">import</span> ItemSerializer

<span class="syntax-keyword">class</span> <span class="syntax-class">InventoryViewSet</span>(viewsets.ModelViewSet):
    <span class="syntax-prop">developer</span> = <span class="syntax-str">"Sreeraj R"</span>
    <span class="syntax-prop">queryset</span> = InventoryItem.objects.filter(is_active=<span class="syntax-keyword">True</span>)
    <span class="syntax-prop">serializer_class</span> = ItemSerializer
    <span class="syntax-prop">authentication_classes</span> = [JWTAuthentication]
    <span class="syntax-prop">permission_classes</span> = [permissions.IsAuthenticated]

    <span class="syntax-keyword">def</span> <span class="syntax-func">perform_create</span>(self, serializer):
        serializer.save(created_by=self.request.user)`,

        'database.sql': `<span class="syntax-comment">-- Developer: Sreeraj R. | Relational Database Schema</span>
<span class="syntax-keyword">CREATE TABLE</span> sales_order (
    id <span class="syntax-class">SERIAL PRIMARY KEY</span>,
    customer_name <span class="syntax-class">VARCHAR(100) NOT NULL</span>,
    total_amount <span class="syntax-class">DECIMAL(10, 2) NOT NULL</span>,
    created_at <span class="syntax-class">TIMESTAMP DEFAULT CURRENT_TIMESTAMP</span>
);

<span class="syntax-keyword">SELECT</span> o.id, o.customer_name, <span class="syntax-func">SUM</span>(i.qty * i.unit_price) <span class="syntax-keyword">AS</span> total
<span class="syntax-keyword">FROM</span> sales_order o
<span class="syntax-keyword">INNER JOIN</span> order_items i <span class="syntax-keyword">ON</span> o.id = i.order_id
<span class="syntax-keyword">GROUP BY</span> o.id, o.customer_name
<span class="syntax-keyword">HAVING</span> <span class="syntax-func">SUM</span>(i.qty * i.unit_price) > 500;`,

        'pos_client.jsx': `<span class="syntax-comment">// Developer: Sreeraj R. | React (Vite) + Axios Dashboard</span>
<span class="syntax-keyword">import</span> axios <span class="syntax-keyword">from</span> <span class="syntax-str">'axios'</span>;
<span class="syntax-keyword">import</span> { useEffect, useState } <span class="syntax-keyword">from</span> <span class="syntax-str">'react'</span>;

<span class="syntax-keyword">export const</span> <span class="syntax-class">POSInventoryGrid</span> = () => {
  <span class="syntax-keyword">const</span> [stock, setStock] = useState([]);

  useEffect(() => {
    <span class="syntax-keyword">const</span> token = localStorage.getItem(<span class="syntax-str">'access_token'</span>);
    axios.get(<span class="syntax-str">'/api/inventory/'</span>, {
      headers: { Authorization: \`Bearer \${token}\` }
    }).then(res => setStock(res.data));
  }, []);

  <span class="syntax-keyword">return</span> <span class="syntax-str">&lt;div className="grid"&gt;</span>{stock.map(renderCard)}<span class="syntax-str">&lt;/div&gt;</span>;
};`
    };

    const executionLogs = {
        'developer.py': [
            '> python developer.py --profile',
            '[SYS] Initializing Sreeraj R. Core Environment...',
            '[DEV] Name: Sreeraj R. | Role: Python Developer (Django & SQL)',
            '[LOC] Alappuzha, Kerala | BCA Graduate (CGPA: 7.219)',
            '[STACK] Python, Django, DRF, PostgreSQL, MySQL, React (Vite)',
            '[PROJECT 1] POS Billing Software: github.com/sreeraj02/Billing-POS',
            '[PROJECT 2] Freelance Workplace Platform: github.com/sreeraj02',
            '[STATUS] Equilibrium achieved. 100% Deterministic execution.'
        ],
        'pos_billing.py': [
            '> python manage.py runserver --settings=core.settings.production',
            '[DEVELOPER] Sreeraj R. | Retail Billing & Inventory System',
            '[DJANGO] Initializing Django 5.x & DRF Spectacular...',
            '[AUTH] Simple JWT Authentication provider mounted.',
            '[SWAGGER] OpenAPI schema live at /api/schema/swagger-ui/',
            '[STATUS] 4 REST apps ready (accounts, inventory, suppliers, sales).'
        ],
        'database.sql': [
            '> psql -U postgres -d retail_billing_db -f schema.sql',
            '[SCHEMA] PostgreSQL relational tables created with strict constraints.',
            '[QUERY] Executing multi-table INNER JOIN & aggregate calculations...',
            '[RESULTS] 12 customer sales orders aggregated successfully (0.003 sec)',
            '[STATUS] Database indexes verified & normalized.'
        ],
        'pos_client.jsx': [
            '> npm run dev -- --host (React Vite + Axios)',
            '[VITE] Frontend server running at http://localhost:5173/',
            '[AXIOS] Dispatched authorized GET /api/inventory/ with JWT header.',
            '[200 OK] 48 inventory items loaded into React component state.',
            '[UI] Responsive Admin Dashboard rendered with 0 latency.'
        ]
    };

    let activeTab = 'developer.py';

    terminalTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            terminalTabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.getAttribute('data-tab');

            if (codeDisplay && codeSnippets[activeTab]) {
                codeDisplay.innerHTML = codeSnippets[activeTab];
            }

            if (terminalOutput) {
                terminalOutput.classList.remove('show');
                terminalOutput.innerHTML = '';
            }
            sound.playClick();
        });
    });

    if (runBtn) {
        runBtn.addEventListener('click', () => {
            sound.playDataBurst();
            if (!terminalOutput) return;

            terminalOutput.classList.add('show');
            terminalOutput.innerHTML = '<span style="color:#A1A1AA;">[EXECUTING...]</span>';

            const logs = executionLogs[activeTab] || executionLogs['developer.py'];
            let currentLine = 0;
            terminalOutput.innerHTML = '';

            const interval = setInterval(() => {
                if (currentLine < logs.length) {
                    const p = document.createElement('div');
                    p.textContent = logs[currentLine];
                    p.style.opacity = '0';
                    p.style.transform = 'translateY(4px)';
                    p.style.transition = 'all 0.2s ease';
                    terminalOutput.appendChild(p);

                    setTimeout(() => {
                        p.style.opacity = '1';
                        p.style.transform = 'translateY(0)';
                    }, 20);

                    currentLine++;
                } else {
                    clearInterval(interval);
                }
            }, 180);
        });
    }

    // ===================================================================
    // 05. HUD TELEMETRY & CLOCK
    // ===================================================================
    function updateClock() {
        const timeEl = document.getElementById('hud-time');
        if (timeEl) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            timeEl.textContent = `${hours}:${minutes}:${seconds} IST`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Sound toggle button in HUD
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const isOn = sound.toggle();
            soundToggle.classList.toggle('sound-active', isOn);
            const label = soundToggle.querySelector('.sound-label');
            if (label) {
                label.textContent = isOn ? 'SOUND: ON' : 'SOUND: OFF';
            }
        });
    }

    // ===================================================================
    // 06. SPOTLIGHT FLASH EFFECT ON CARDS
    // ===================================================================
    const spotlightCards = document.querySelectorAll(
        '.capability-card, .chapter-card, .profile-spotlight-card, .contact-hud-form'
    );

    spotlightCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ===================================================================
    // 07. CONTACT INTENT SELECTOR & AJAX SUBMISSION
    // ===================================================================
    const intentPills = document.querySelectorAll('.intent-pill');
    const intentInput = document.getElementById('selected-intent');
    const messageBox = document.getElementById('hud-message');

    intentPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            intentPills.forEach((p) => p.classList.remove('active'));
            pill.classList.add('active');
            const intentVal = pill.getAttribute('data-intent');
            if (intentInput) intentInput.value = intentVal;

            if (messageBox && !messageBox.value) {
                if (intentVal === 'Full-Time Role') {
                    messageBox.placeholder = "Hi Sreeraj, we are hiring for a Python / Full-Stack position and would love to review your background...";
                } else if (intentVal === 'Internship') {
                    messageBox.placeholder = "Hi Sreeraj, we have an developer internship opportunity...";
                } else {
                    messageBox.placeholder = "Tell me about your project or inquiry...";
                }
            }
            sound.playClick();
        });
    });

    // Form submission with high-tech status
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>TRANSMITTING TELEMETRY...</span>`;
            }

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    if (submitBtn) {
                        submitBtn.innerHTML = `<span style="color:#10B981;">✓ DISPATCH SUCCESSFUL</span>`;
                        sound.playDataBurst();
                    }
                    contactForm.reset();
                    setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = `<span>DISPATCH TRANSMISSION</span> <span class="btn-arrow">↗</span>`;
                        }
                    }, 4000);
                } else {
                    throw new Error('Formspree returned error status');
                }
            })
            .catch(error => {
                // Fallback submission if fetch is blocked
                contactForm.submit();
            });
        });
    }

    // ===================================================================
    // 08. MOBILE NAVIGATION MENU TOGGLE
    // ===================================================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const hudNavLinks = document.querySelector('.hud-nav-links');

    if (mobileMenuToggle && hudNavLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            hudNavLinks.classList.toggle('mobile-open');
            sound.playClick();
        });

        document.querySelectorAll('.hud-nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                hudNavLinks.classList.remove('mobile-open');
            });
        });
    }

    // ===================================================================
    // 09. BACK TO TOP
    // ===================================================================
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            sound.playClick();
        });
    }

    // ===================================================================
    // 10. 3D INFINITE LOOP ENGINE (THREE.JS / WEBGL: "CHAOS TO ORDER")
    // ===================================================================
    function init3DInfiniteLoop() {
        const loopCanvas = document.getElementById('three-loop-canvas');
        if (!loopCanvas) return;

        let loopChaosIntensity = 0; // 0 = Pure Order, 1 = Maximum Chaos

        // Expose disruption trigger to shock system
        window.trigger3DDisruption = function (power = 18) {
            loopChaosIntensity = Math.min(1.2, power * 0.05);
        };

        // Fallback procedural 3D Torus Knot if Three.js not loaded
        if (typeof THREE === 'undefined') {
            initCanvas3DFallback(loopCanvas);
            return;
        }

        try {
            const container = loopCanvas.parentElement;
            let width = container.clientWidth || 400;
            let height = container.clientHeight || 380;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            camera.position.z = 5.2;

            const renderer = new THREE.WebGLRenderer({
                canvas: loopCanvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Torus Knot Geometry
            const geometry = new THREE.TorusKnotGeometry(1.25, 0.35, 180, 32, 2, 3);
            const basePositions = geometry.attributes.position.clone();

            // Dual Material: Metallic Obsidian Body + Cyber Amber Wireframe
            const bodyMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x09090d,
                metalness: 0.88,
                roughness: 0.18,
                clearcoat: 0.9,
                clearcoatRoughness: 0.1,
                emissive: 0x221405,
                emissiveIntensity: 0.6
            });

            const wireMaterial = new THREE.MeshBasicMaterial({
                color: 0xff9f1c,
                wireframe: true,
                transparent: true,
                opacity: 0.38
            });

            const knotMesh = new THREE.Mesh(geometry, bodyMaterial);
            const wireMesh = new THREE.Mesh(geometry, wireMaterial);
            wireMesh.scale.setScalar(1.002);

            const loopGroup = new THREE.Group();
            loopGroup.add(knotMesh);
            loopGroup.add(wireMesh);
            scene.add(loopGroup);

            // Orbiting 3D Particle Halo
            const particleCount = 280;
            const particleGeo = new THREE.BufferGeometry();
            const particlePos = new Float32Array(particleCount * 3);
            const particleTraj = [];

            for (let i = 0; i < particleCount; i++) {
                const u = Math.random() * Math.PI * 4;
                particleTraj.push({
                    t: u,
                    speed: 0.008 + Math.random() * 0.012,
                    offsetR: (Math.random() - 0.5) * 0.45,
                    offsetY: (Math.random() - 0.5) * 0.45
                });
                particlePos[i * 3] = 0;
                particlePos[i * 3 + 1] = 0;
                particlePos[i * 3 + 2] = 0;
            }
            particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

            const particleMat = new THREE.PointsMaterial({
                color: 0xffb347,
                size: 0.045,
                transparent: true,
                opacity: 0.8
            });
            const particlesSystem = new THREE.Points(particleGeo, particleMat);
            scene.add(particlesSystem);

            // Dynamic Scene Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);

            const amberLight = new THREE.PointLight(0xff9f1c, 3.2, 20);
            scene.add(amberLight);

            const cyanLight = new THREE.PointLight(0x38bdf8, 2.0, 20);
            scene.add(cyanLight);

            // Interactive Drag to Rotate
            let isDragging = false;
            let prevMouseX = 0;
            let prevMouseY = 0;
            let rotVelocityX = 0;
            let rotVelocityY = 0;

            loopCanvas.addEventListener('pointerdown', (e) => {
                isDragging = true;
                prevMouseX = e.clientX;
                prevMouseY = e.clientY;
                sound.playClick();
            });

            window.addEventListener('pointermove', (e) => {
                if (isDragging) {
                    const deltaX = e.clientX - prevMouseX;
                    const deltaY = e.clientY - prevMouseY;
                    rotVelocityY = deltaX * 0.008;
                    rotVelocityX = deltaY * 0.008;
                    prevMouseX = e.clientX;
                    prevMouseY = e.clientY;
                }
            });

            window.addEventListener('pointerup', () => {
                isDragging = false;
            });

            loopCanvas.addEventListener('click', (e) => {
                window.trigger3DDisruption(24);
                sound.playShock();
            });

            // Resize handling
            window.addEventListener('resize', () => {
                if (!container) return;
                width = container.clientWidth || 400;
                height = container.clientHeight || 380;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            });

            // Animation Loop
            const clock = new THREE.Clock();

            function render3D() {
                requestAnimationFrame(render3D);

                const time = clock.getElapsedTime();

                // Base continuous rotation
                if (!isDragging) {
                    loopGroup.rotation.y += 0.006 + rotVelocityY;
                    loopGroup.rotation.x += 0.004 + rotVelocityX;
                    loopGroup.rotation.z += 0.002;
                    rotVelocityX *= 0.92;
                    rotVelocityY *= 0.92;
                } else {
                    loopGroup.rotation.y += rotVelocityY;
                    loopGroup.rotation.x += rotVelocityX;
                    rotVelocityX = 0;
                    rotVelocityY = 0;
                }

                // Dynamic light revolution
                amberLight.position.x = Math.sin(time * 1.5) * 4;
                amberLight.position.y = Math.cos(time * 1.2) * 3;
                amberLight.position.z = Math.sin(time * 1.8) * 3 + 2;

                cyanLight.position.x = -Math.sin(time * 1.2) * 4;
                cyanLight.position.y = -Math.cos(time * 1.4) * 3;
                cyanLight.position.z = Math.cos(time * 1.5) * 3 - 2;

                // Vertex Wave Deformation (Chaos to Order)
                const positions = geometry.attributes.position;
                for (let i = 0; i < positions.count; i++) {
                    const bx = basePositions.getX(i);
                    const by = basePositions.getY(i);
                    const bz = basePositions.getZ(i);

                    // Smooth harmonious undulating wave in Order
                    const orderWave = Math.sin(time * 2.2 + by * 2.8 + bx * 1.5) * 0.035;

                    // Chaotic distortion when disrupted
                    const chaosWave = (
                        Math.sin(time * 9.0 + bx * 5.0) * 
                        Math.cos(time * 7.0 + bz * 5.0)
                    ) * loopChaosIntensity * 0.45;

                    const factor = 1 + orderWave + chaosWave;
                    positions.setXYZ(i, bx * factor, by * factor, bz * factor);
                }
                geometry.computeVertexNormals();
                positions.needsUpdate = true;

                // Update orbiting particles
                const pAttr = particleGeo.attributes.position;
                for (let i = 0; i < particleCount; i++) {
                    const p = particleTraj[i];
                    p.t += p.speed;

                    // Parametric Torus Knot Curve formulas: p=2, q=3
                    const r = 1.25;
                    const r_tube = 0.35 + p.offsetR;
                    const phi = p.t;
                    const q_phi = 1.5 * phi;

                    const cx = (r + r_tube * Math.cos(q_phi)) * Math.cos(phi);
                    const cy = (r + r_tube * Math.cos(q_phi)) * Math.sin(phi);
                    const cz = r_tube * Math.sin(q_phi) + p.offsetY;

                    pAttr.setXYZ(i, cx, cy, cz);
                }
                pAttr.needsUpdate = true;

                // Wireframe intensity response to disruption
                wireMaterial.opacity = 0.35 + loopChaosIntensity * 0.45;
                if (loopChaosIntensity > 0) {
                    wireMaterial.color.setHex(loopChaosIntensity > 0.4 ? 0xff4d4d : 0xff9f1c);
                } else {
                    wireMaterial.color.setHex(0xff9f1c);
                }

                // Damped return from Chaos to Order
                if (loopChaosIntensity > 0.001) {
                    loopChaosIntensity *= 0.94;
                } else {
                    loopChaosIntensity = 0;
                }

                renderer.render(scene, camera);
            }
            render3D();

        } catch (err) {
            console.warn('Three.js initialization notice:', err);
            initCanvas3DFallback(loopCanvas);
        }
    }

    // High-performance 2D Canvas Fallback projecting a 3D Torus Knot
    function initCanvas3DFallback(canvas) {
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        let width = (canvas.width = container.clientWidth || 400);
        let height = (canvas.height = container.clientHeight || 380);

        let rotX = 0.4;
        let rotY = 0;
        let rotZ = 0;
        let chaos = 0;

        window.trigger3DDisruption = function(power = 18) {
            chaos = Math.min(1.2, power * 0.05);
        };

        const NUM_POINTS = 320;
        const R = Math.min(width, height) * 0.28;
        const r = R * 0.32;

        function drawLoop() {
            ctx.clearRect(0, 0, width, height);

            rotY += 0.008;
            rotX += 0.004;

            ctx.save();
            ctx.translate(width / 2, height / 2);

            for (let i = 0; i < NUM_POINTS; i++) {
                const phi = (i / NUM_POINTS) * Math.PI * 4;
                const q_phi = 1.5 * phi;

                const perturb = Math.sin(phi * 4 + rotY * 3) * (0.05 + chaos * 0.4);
                const curR = R * (1 + perturb);

                let x = (curR + r * Math.cos(q_phi)) * Math.cos(phi);
                let y = (curR + r * Math.cos(q_phi)) * Math.sin(phi);
                let z = r * Math.sin(q_phi);

                // 3D rotation projection
                let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
                let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);

                let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
                let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

                const fov = 350;
                const scale = fov / (fov + z2);
                const projX = x1 * scale;
                const projY = y2 * scale;

                const alpha = Math.max(0.15, (z2 + R) / (2 * R));
                ctx.beginPath();
                ctx.arc(projX, projY, Math.max(1, 2.2 * scale), 0, Math.PI * 2);
                ctx.fillStyle = chaos > 0.3 ? `rgba(255, 100, 100, ${alpha})` : `rgba(255, 159, 28, ${alpha})`;
                ctx.fill();
            }

            ctx.restore();

            if (chaos > 0.005) chaos *= 0.95;
            else chaos = 0;

            requestAnimationFrame(drawLoop);
        }
        drawLoop();
    }

    // Launch 3D Infinite Loop Engine
    init3DInfiniteLoop();

})();
