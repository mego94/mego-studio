class Comet {
	constructor(canvas, ctx) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.reset();
	}

	reset() {
		this.x = Math.random() * this.canvas.width;
		this.y = -20;
		this.length = Math.random() * 100 + 100;
		this.speed = Math.random() * 3 + 4;
		this.angle = ((Math.random() * 30 + 60) * Math.PI) / 180;
		this.width = Math.random() * 3 + 2;
		this.opacity = Math.random() * 0.5 + 0.5;

		// New properties for color variation and lifetime
		this.colorScheme = this.getRandomColorScheme();
		this.lifetime = Math.random() * 3000 + 2000; // Random lifetime between 2-5 seconds
		this.age = 0;
		this.fadeOutStart = this.lifetime * 0.7; // Start fading when 70% of life is complete
	}

	getRandomColorScheme() {
		const schemes = [
			// Blue scheme (like original)
			{
				start: 'rgba(255, 255, 255, opacity)',
				mid1: 'rgba(0, 247, 255, opacity)',
				mid2: 'rgba(81, 137, 255, opacity)',
				end: 'rgba(135, 43, 255, opacity)',
			},
			// Purple scheme
			{
				start: 'rgba(255, 255, 255, opacity)',
				mid1: 'rgba(255, 0, 255, opacity)',
				mid2: 'rgba(180, 81, 255, opacity)',
				end: 'rgba(90, 43, 255, opacity)',
			},
			// Green scheme
			{
				start: 'rgba(255, 255, 255, opacity)',
				mid1: 'rgba(0, 255, 128, opacity)',
				mid2: 'rgba(81, 255, 164, opacity)',
				end: 'rgba(43, 255, 135, opacity)',
			},
			// Gold scheme
			{
				start: 'rgba(255, 255, 255, opacity)',
				mid1: 'rgba(255, 215, 0, opacity)',
				mid2: 'rgba(255, 180, 0, opacity)',
				end: 'rgba(255, 140, 0, opacity)',
			},
			// Pink scheme
			{
				start: 'rgba(255, 255, 255, opacity)',
				mid1: 'rgba(255, 192, 203, opacity)',
				mid2: 'rgba(255, 130, 171, opacity)',
				end: 'rgba(219, 112, 147, opacity)',
			},
		];
		return schemes[Math.floor(Math.random() * schemes.length)];
	}

	update() {
		this.x += Math.cos(this.angle) * this.speed;
		this.y += Math.sin(this.angle) * this.speed;
		this.age += 16; // Approximate ms per frame at 60fps

		// Calculate fade based on age
		if (this.age >= this.fadeOutStart) {
			const fadeProgress =
				(this.age - this.fadeOutStart) / (this.lifetime - this.fadeOutStart);
			this.opacity *= 1 - fadeProgress;
		}

		// Reset when lifetime is over or comet is off screen
		if (
			this.age >= this.lifetime ||
			this.y > this.canvas.height + this.length
		) {
			this.reset();
		}
	}

	draw() {
		const gradient = this.ctx.createLinearGradient(
			this.x,
			this.y,
			this.x - Math.cos(this.angle) * this.length,
			this.y - Math.sin(this.angle) * this.length
		);

		const currentOpacity = this.opacity;
		const scheme = this.colorScheme;

		gradient.addColorStop(
			0,
			scheme.start.replace('opacity', currentOpacity.toString())
		);
		gradient.addColorStop(
			0.1,
			scheme.mid1.replace('opacity', currentOpacity.toString())
		);
		gradient.addColorStop(
			0.5,
			scheme.mid2.replace('opacity', (currentOpacity * 0.5).toString())
		);
		gradient.addColorStop(1, scheme.end.replace('opacity', '0'));

		this.ctx.beginPath();
		this.ctx.strokeStyle = gradient;
		this.ctx.lineWidth = this.width;
		this.ctx.moveTo(this.x, this.y);
		this.ctx.lineTo(
			this.x - Math.cos(this.angle) * this.length,
			this.y - Math.sin(this.angle) * this.length
		);
		this.ctx.stroke();
	}
}

function initCometRain() {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.style.position = 'fixed';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.style.pointerEvents = 'none';
	canvas.style.zIndex = '-1';

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);

	// Create more comets for variety
	const comets = Array.from(
		{ length: canvas.width * 0.01 },
		() => new Comet(canvas, ctx)
	);

	// Add new comets occasionally
	setInterval(() => {
		if (Math.random() < 0.3 && comets.length < 12) {
			// 30% chance to add a new comet
			comets.push(new Comet(canvas, ctx));
		}
	}, 2000);

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		comets.forEach((comet) => {
			comet.update();
			comet.draw();
		});

		requestAnimationFrame(animate);
	}

	animate();
	document.body.appendChild(canvas);
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', initCometRain);
