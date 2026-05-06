const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');
const floatingContainer = document.getElementById('floatingMessages');

let hearts = [];
let canvasWidth, canvasHeight;

const heartPattern = [
  [0,0,1,1,0,1,1,0,0],
  [0,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,0,0,0],
  [0,0,0,0,1,0,0,0,0]
];

const pastelColors = ['#ff9a9e', '#fecfef', '#a1c4fd', '#fbc2eb', '#ffd1dc', '#ffb6c1', '#d4b8ff'];
const compliments = [
  '✨ Ты самая лучшая! ✨',
  'Сияешь ярче звёзд',
  'Твоя улыбка — моё счастье',
  'Обожаю тебя!',
  'Ты — моё чудо',
  'Самая красивая',
  'Ты — моя вселенная'
];

class PixelHeart {
  constructor(x, y, speedX, speedY, scale, color, life = null) {
    this.x = x;
    this.y = y;
    this.speedX = speedX || 0;
    this.speedY = speedY || 1;
    this.scale = scale;
    this.color = color;
    this.opacity = 0.9 + Math.random() * 0.1;
    this.life = life;
    this.age = 0;
  }

  draw(ctx) {
    const pixelSize = this.scale;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.imageSmoothingEnabled = false;

    for (let row = 0; row < heartPattern.length; row++) {
      for (let col = 0; col < heartPattern[row].length; col++) {
        if (heartPattern[row][col] === 1) {
          ctx.fillRect(
            this.x + col * pixelSize,
            this.y + row * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
    ctx.restore();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.life !== null) {
      this.age++;
      this.opacity = Math.max(0, 1 - this.age / this.life);
    }
  }

  isOffScreen() {
    const heartH = heartPattern.length * this.scale;
    const heartW = 9 * this.scale;
    return (
      this.y - heartH > canvasHeight ||
      this.x + heartW < 0 ||
      this.x > canvasWidth
    );
  }

  isDead() {
    return this.life !== null && this.age >= this.life;
  }
}

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

function randomColor() {
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
}

function createFallingHeart() {
  const scale = Math.floor(Math.random() * 3) + 3;
  const x = Math.random() * (canvasWidth - 9 * scale);
  const y = -9 * scale;
  const speed = 0.5 + Math.random() * 2.2;
  hearts.push(new PixelHeart(x, y, 0, speed, scale, randomColor()));
}

function showFloatingText(x, y, text) {
  const el = document.createElement('div');
  el.className = 'floating-text';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  floatingContainer.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

// Автоматический фейерверк из центра
function launchFirework() {
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  for (let i = 0; i < 35; i++) {
    const angle = (i / 35) * Math.PI * 2;
    const force = 3.5 + Math.random() * 4;
    const speedX = Math.cos(angle) * force;
    const speedY = Math.sin(angle) * force - 1.5;
    const scale = Math.floor(Math.random() * 4) + 3;
    const life = 70 + Math.floor(Math.random() * 30);
    hearts.push(new PixelHeart(cx, cy, speedX, speedY, scale, randomColor(), life));
  }
  // Случайный комплимент
  const msg = compliments[Math.floor(Math.random() * compliments.length)];
  showFloatingText(canvasWidth/2 - 80, canvasHeight/2 - 20, msg);
}

// Запускаем фейерверк сразу и потом каждые 6 секунд
setTimeout(() => {
  if (canvasWidth && canvasHeight) launchFirework();
}, 500);
setInterval(() => {
  if (canvasWidth && canvasHeight) launchFirework();
}, 6000);

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  hearts = hearts.filter(h => {
    h.update();
    h.draw(ctx);
    return !h.isOffScreen() && !h.isDead();
  });
  // Много падающих сердечек
  if (Math.random() < 0.04) createFallingHeart();
  requestAnimationFrame(animate);
}

resizeCanvas();
animate();

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 100));