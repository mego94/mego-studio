const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const comets = [];
const colors = ['#4fc3f7', '#81d4fa', '#e040fb', '#ff4081']; // Blue and pink hues

class Comet {
	constructor() {
		this.reset();
	}

	reset() {
		this.x = Math.random() * canvas.width;
		this.y = -10;
		this.length = Math.random() * 100 + 50;
		this.speed = Math.random() * 4 + 2;
		this.angle = Math.PI / 3 + Math.random() * 0.2 - 0.1;
		this.opacity = Math.random() * 0.5 + 0.5;
		this.color = colors[Math.floor(Math.random() * colors.length)];
	}

	update() {
		this.x += Math.cos(this.angle) * this.speed;
		this.y += Math.sin(this.angle) * this.speed;
		if (this.y > canvas.height || this.x > canvas.width) {
			this.reset();
		}
	}

	draw() {
		ctx.beginPath();
		const gradient = ctx.createLinearGradient(
			this.x,
			this.y,
			this.x - this.length * Math.cos(this.angle),
			this.y - this.length * Math.sin(this.angle)
		);
		gradient.addColorStop(0, this.color);
		gradient.addColorStop(1, 'transparent');
		ctx.strokeStyle = gradient;
		ctx.lineWidth = 2;
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(
			this.x - this.length * Math.cos(this.angle),
			this.y - this.length * Math.sin(this.angle)
		);
		ctx.stroke();
	}
}

for (let i = 0; i < 15; i++) {
	comets.push(new Comet());
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	comets.forEach((comet) => {
		comet.update();
		comet.draw();
	});
	requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
