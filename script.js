// ===== Electric Canvas Animation =====
class ElectricBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.lightnings = [];
        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }

        // Create periodic lightning (больше молний, дольше держатся)
        const isMobile = window.innerWidth < 768;
        const lightningChance = isMobile ? 0.8 : 0.6;
        const lightningInterval = isMobile ? 800 : 1200;

        // Создаем начальные молнии сразу при старте
        const initialLightnings = isMobile ? 4 : 3;
        for (let i = 0; i < initialLightnings; i++) {
            setTimeout(() => this.createLightning(), i * 300);
        }

        setInterval(() => {
            if (Math.random() < lightningChance) {
                this.createLightning();
            }
        }, lightningInterval);
    }

    createLightning() {
        const startX = Math.random() * this.canvas.width;
        const startY = 0;
        const endX = startX + (Math.random() - 0.5) * 300;
        const endY = Math.random() * this.canvas.height;

        // Основная молния
        this.lightnings.push({
            points: this.generateLightningPoints(startX, startY, endX, endY),
            opacity: 1,
            decay: 0.03
        });

        // Случайно добавляем дополнительные молнии (двойные/тройные)
        const extraBolts = Math.random();

        if (extraBolts > 0.4) { // 60% шанс второй молнии
            const offset = (Math.random() - 0.5) * 100;
            this.lightnings.push({
                points: this.generateLightningPoints(startX + offset, startY, endX + offset, endY),
                opacity: 0.8,
                decay: 0.03
            });
        }

        if (extraBolts > 0.7) { // 30% шанс третьей молнии
            const offset = (Math.random() - 0.5) * 150;
            this.lightnings.push({
                points: this.generateLightningPoints(startX + offset, startY, endX + offset, endY),
                opacity: 0.6,
                decay: 0.03
            });
        }
    }

    generateLightningPoints(x1, y1, x2, y2) {
        const points = [{x: x1, y: y1}];
        const segments = 15;
        const displacement = 50;

        for (let i = 1; i < segments; i++) {
            const progress = i / segments;
            const x = x1 + (x2 - x1) * progress + (Math.random() - 0.5) * displacement;
            const y = y1 + (y2 - y1) * progress + (Math.random() - 0.5) * displacement;
            points.push({x, y});
        }

        points.push({x: x2, y: y2});
        return points;
    }

    update() {
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });

        // Update lightnings
        this.lightnings = this.lightnings.filter(lightning => {
            lightning.opacity -= lightning.decay;
            return lightning.opacity > 0;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#fcda00';
            this.ctx.fill();

            // Draw connections
            this.particles.forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(252, 218, 0, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        // Draw lightnings (трехслойные - желтое свечение + желтая линия + белый центр)
        const isMobile = window.innerWidth < 768;
        const outerWidth = isMobile ? 6 : 4;
        const middleWidth = isMobile ? 4 : 2.5;
        const innerWidth = isMobile ? 2 : 1.5;
        const shadowBlur = isMobile ? 25 : 15;

        this.lightnings.forEach(lightning => {
            // Внешний слой - яркое желтое свечение
            this.ctx.beginPath();
            this.ctx.moveTo(lightning.points[0].x, lightning.points[0].y);
            for (let i = 1; i < lightning.points.length; i++) {
                this.ctx.lineTo(lightning.points[i].x, lightning.points[i].y);
            }
            this.ctx.strokeStyle = `rgba(252, 218, 0, ${lightning.opacity * 0.6})`;
            this.ctx.lineWidth = outerWidth;
            this.ctx.shadowBlur = shadowBlur;
            this.ctx.shadowColor = '#fcda00';
            this.ctx.stroke();

            // Средний слой - насыщенный желтый
            this.ctx.beginPath();
            this.ctx.moveTo(lightning.points[0].x, lightning.points[0].y);
            for (let i = 1; i < lightning.points.length; i++) {
                this.ctx.lineTo(lightning.points[i].x, lightning.points[i].y);
            }
            this.ctx.strokeStyle = `rgba(252, 218, 0, ${lightning.opacity})`;
            this.ctx.lineWidth = middleWidth;
            this.ctx.shadowBlur = shadowBlur / 2;
            this.ctx.stroke();

            // Внутренний слой - яркий белый центр
            this.ctx.beginPath();
            this.ctx.moveTo(lightning.points[0].x, lightning.points[0].y);
            for (let i = 1; i < lightning.points.length; i++) {
                this.ctx.lineTo(lightning.points[i].x, lightning.points[i].y);
            }
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${lightning.opacity * 0.9})`;
            this.ctx.lineWidth = innerWidth;
            this.ctx.shadowBlur = shadowBlur / 3;
            this.ctx.shadowColor = '#ffffff';
            this.ctx.stroke();

            this.ctx.shadowBlur = 0;
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ===== Theme Switcher =====
class ThemeSwitcher {
    constructor(headerScroll) {
        this.switch = document.getElementById('themeSwitch');
        this.body = document.body;
        this.isDark = true;
        this.headerScroll = headerScroll;

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.toggleTheme();
        }

        this.switch.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.isDark = !this.isDark;

        if (this.isDark) {
            this.body.classList.remove('light-theme');
            this.switch.classList.remove('active');
            localStorage.setItem('theme', 'dark');
        } else {
            this.body.classList.add('light-theme');
            this.switch.classList.add('active');
            localStorage.setItem('theme', 'light');
        }

        // Update header background immediately
        if (this.headerScroll) {
            this.headerScroll.onScroll();
        }

        // Trigger spark animation
        this.createSparks();
    }

    createSparks() {
        const spark = this.switch.querySelector('.switch-spark');
        spark.style.animation = 'none';
        setTimeout(() => {
            spark.style.animation = '';
        }, 10);
    }
}

// ===== Scroll Animations =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.generator-card, .step, .contact-card');
        this.init();
        window.addEventListener('scroll', () => this.onScroll());
    }

    init() {
        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        });
        this.onScroll();
    }

    onScroll() {
        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85;

            if (isVisible) {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
}

// ===== Smooth Scroll for Navigation =====
class SmoothScroll {
    constructor() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => this.scroll(e));
        });
    }

    scroll(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ===== Generator Card Hover Effects =====
class GeneratorCardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.generator-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onHover(card));
            card.addEventListener('mousemove', (e) => this.onMove(card, e));
            card.addEventListener('mouseleave', () => this.onLeave(card));
        });
    }

    onHover(card) {
        // Add pulsing effect to power badge
        const badge = card.querySelector('.power-badge');
        if (badge) {
            badge.style.animation = 'pulse 0.5s ease';
        }
    }

    onMove(card, e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }

    onLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ===== Parallax Effect =====
class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero');
        window.addEventListener('scroll', () => this.onScroll());
    }

    onScroll() {
        const scrolled = window.pageYOffset;
        if (this.hero) {
            this.hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }
}

// ===== Cursor Glow Effect =====
class CursorGlow {
    constructor() {
        this.glow = this.createGlow();
        document.body.appendChild(this.glow);

        document.addEventListener('mousemove', (e) => this.onMove(e));
    }

    createGlow() {
        const glow = document.createElement('div');
        glow.style.position = 'fixed';
        glow.style.width = '300px';
        glow.style.height = '300px';
        glow.style.borderRadius = '50%';
        glow.style.background = 'radial-gradient(circle, rgba(252, 218, 0, 0.1) 0%, transparent 70%)';
        glow.style.pointerEvents = 'none';
        glow.style.zIndex = '999';
        glow.style.transform = 'translate(-50%, -50%)';
        glow.style.transition = 'opacity 0.3s ease';
        glow.style.opacity = '0';
        return glow;
    }

    onMove(e) {
        this.glow.style.left = e.clientX + 'px';
        this.glow.style.top = e.clientY + 'px';
        this.glow.style.opacity = '1';
    }
}

// ===== Header Scroll Effect =====
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        window.addEventListener('scroll', () => this.onScroll());
    }

    onScroll() {
        const isLightTheme = document.body.classList.contains('light-theme');

        if (window.pageYOffset > 100) {
            document.body.classList.add('scrolled');
            this.header.style.padding = '1.5rem 0';
            this.header.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 10, 0.95)';
        } else {
            document.body.classList.remove('scrolled');
            this.header.style.padding = '1rem 0';
            this.header.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 10, 10, 0.9)';
        }
    }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Electric background
    const canvas = document.getElementById('electricCanvas');
    const electric = new ElectricBackground(canvas);
    electric.animate();

    // Header scroll effect
    new HeaderScroll();

    // Scroll animations
    new ScrollAnimations();

    // Smooth scroll
    new SmoothScroll();

    // Generator card effects
    // new GeneratorCardEffects(); // ОТКЛЮЧЕНО - крутит карточки

    // Parallax effect
    new ParallaxEffect();

    // Cursor glow
    new CursorGlow();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Performance Optimization =====
// Adjust canvas visibility on mobile (увеличена видимость молний)
if (window.innerWidth < 768) {
    const canvas = document.getElementById('electricCanvas');
    if (canvas) {
        canvas.style.opacity = '0.3';
    }
}

// Preload WhatsApp
const preconnect = document.createElement('link');
preconnect.rel = 'preconnect';
preconnect.href = 'https://wa.me';
document.head.appendChild(preconnect);
