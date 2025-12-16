// НАСТОЯЩАЯ анимация молний вокруг кнопки
// Постоянная, без hover, реалистичная

class LightningBorder {
    constructor(button) {
        this.button = button;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.bolts = [];
        this.setupCanvas();
        this.startAnimation();
    }

    setupCanvas() {
        // Canvas поверх кнопки
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '-10px';
        this.canvas.style.left = '-10px';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '10';

        this.button.style.position = 'relative';
        this.button.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.button.getBoundingClientRect();
        this.canvas.width = rect.width + 20;
        this.canvas.height = rect.height + 20;
    }

    // Рисуем зигзагообразную молнию между двумя точками
    drawLightning(x1, y1, x2, y2, segments = 8, offset = 15) {
        const points = [{x: x1, y: y1}];
        const dx = (x2 - x1) / segments;
        const dy = (y2 - y1) / segments;

        // Создаем зигзаг
        for (let i = 1; i < segments; i++) {
            const x = x1 + dx * i + (Math.random() - 0.5) * offset;
            const y = y1 + dy * i + (Math.random() - 0.5) * offset;
            points.push({x, y});
        }
        points.push({x: x2, y: y2});

        // Рисуем желтую толстую линию (glow)
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.strokeStyle = '#fcda00';
        this.ctx.lineWidth = 4;
        this.ctx.shadowBlur = 25;
        this.ctx.shadowColor = '#fcda00';
        this.ctx.stroke();

        // Рисуем белую тонкую линию (основная молния)
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.stroke();
    }

    // Генерируем молнии по периметру кнопки
    generateBolts() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const padding = 10;

        // Очищаем
        this.ctx.clearRect(0, 0, w, h);

        // Рисуем 3-5 случайных молний по периметру
        const numBolts = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < numBolts; i++) {
            const side = Math.floor(Math.random() * 4);
            let x1, y1, x2, y2;

            switch(side) {
                case 0: // TOP
                    x1 = padding + Math.random() * (w - padding * 2);
                    y1 = padding;
                    x2 = padding + Math.random() * (w - padding * 2);
                    y2 = padding;
                    break;
                case 1: // RIGHT
                    x1 = w - padding;
                    y1 = padding + Math.random() * (h - padding * 2);
                    x2 = w - padding;
                    y2 = padding + Math.random() * (h - padding * 2);
                    break;
                case 2: // BOTTOM
                    x1 = padding + Math.random() * (w - padding * 2);
                    y1 = h - padding;
                    x2 = padding + Math.random() * (w - padding * 2);
                    y2 = h - padding;
                    break;
                case 3: // LEFT
                    x1 = padding;
                    y1 = padding + Math.random() * (h - padding * 2);
                    x2 = padding;
                    y2 = padding + Math.random() * (h - padding * 2);
                    break;
            }

            this.drawLightning(x1, y1, x2, y2);
        }
    }

    startAnimation() {
        // ПОСТОЯННАЯ анимация - каждые 150ms новая молния
        setInterval(() => {
            this.generateBolts();
        }, 150);
    }
}

// Инициализация на кнопках "Арендовать"
document.addEventListener('DOMContentLoaded', () => {
    const rentButtons = document.querySelectorAll('.btn-card');
    rentButtons.forEach((btn, index) => {
        new LightningBorder(btn);
        console.log(`✅ Lightning effect initialized on rent button ${index + 1}`);
    });
});
