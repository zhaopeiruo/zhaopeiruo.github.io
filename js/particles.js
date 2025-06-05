class Particle {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = options.x || Math.random() * canvas.width;
    this.y = options.y || Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 1.5; // 增加粒子大小
    this.speedX = Math.random() * 1.5 - 0.75; // 降低速度使运动更平滑
    this.speedY = Math.random() * 1.5 - 0.75;
    this.color = options.color || "rgba(255, 255, 255, 0.7)"; // 增加透明度
    this.originalSize = this.size;
    this.pulseAngle = Math.random() * Math.PI * 2; // 用于创建脉冲效果
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // 脉冲动画
    this.pulseAngle += 0.02;
    this.size = this.originalSize + Math.sin(this.pulseAngle) * 0.5;

    // 限制粒子在画布范围内
    if (this.x > this.canvas.width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = this.canvas.width;
    }

    if (this.y > this.canvas.height) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = this.canvas.height;
    }
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.shadowBlur = 15; // 添加发光效果
    this.ctx.shadowColor = "white";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.shadowBlur = 0; // 重置阴影效果
  }
}

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.numberOfParticles = 40; // 减少粒子数量以提高清晰度
    this.connectDistance = 150; // 增加连接距离

    this.init();
    this.animate();
    this.handleResize();
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = document.querySelector("header").offsetHeight;

    this.particles = [];

    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(
        new Particle(this.canvas, {
          color: "rgba(255, 255, 255, 0.7)",
        })
      );
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();

      for (let j = i; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectDistance) {
          this.ctx.beginPath();
          const opacity = ((1 - distance / this.connectDistance) * 0.5) || 0;
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.animate());
  }

  handleResize() {
    window.addEventListener("resize", () => {
      this.init();
    });
  }
}
