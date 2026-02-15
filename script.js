// Loading Screen Fade Out
window.addEventListener('load', () => {
    const loading = document.getElementById('loading-screen');
    loading.style.opacity = 0;
    setTimeout(() => loading.remove(), 1000);
});

// 3D Galaxy Background with Three.js (Optimized)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('galaxy-bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

// Particles for Galaxy
const particles = new THREE.BufferGeometry();
const particleCount = 5000;
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}
particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.005 });
const particleSystem = new THREE.Points(particles, material);
scene.add(particleSystem);

function animateGalaxy() {
    requestAnimationFrame(animateGalaxy);
    particleSystem.rotation.y += 0.0005; // Slow rotation for performance
    renderer.render(scene, camera);
}
animateGalaxy();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Cursor Glow Trail (Canvas Particles)
const cursorCanvas = document.createElement('canvas');
cursorCanvas.id = 'cursor-trail';
document.body.appendChild(cursorCanvas);
const ctx = cursorCanvas.getContext('2d');
cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;
let particlesArray = [];
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'rgba(0, 255, 255, 0.5)';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle(e.x, e.y));
    }
});
function animateCursor() {
    ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    particlesArray.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.size <= 0.2) particlesArray.splice(i, 1);
    });
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Animated Typing Subtitle
const subtitles = ['Full Stack Developer', '3D UI Engineer', 'Python Backend Developer'];
let index = 0, charIndex = 0;
const typingElement = document.getElementById('typing-subtitle');
function type() {
    if (charIndex < subtitles[index].length) {
        typingElement.textContent += subtitles[index].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(() => {
            typingElement.textContent = '';
            charIndex = 0;
            index = (index + 1) % subtitles.length;
            type();
        }, 2000);
    }
}
type();

// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.section').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
});

// Project Cards GSAP Entrance
gsap.from('.project-card', { opacity: 0, stagger: 0.2, duration: 1, scrollTrigger: { trigger: '#projects', start: 'top 80%' } });

// Sidebar Toggle
document.getElementById('open-sidebar').addEventListener('click', () => document.getElementById('sidebar').classList.add('open'));
document.getElementById('close-sidebar').addEventListener('click', () => document.getElementById('sidebar').classList.remove('open'));

// Theme Toggle
const toggleTheme = () => document.body.classList.toggle('light-theme');
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-desktop').addEventListener('click', toggleTheme);

// Project Modal
const modal = document.getElementById('project-modal');
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const data = card.dataset.modal;
        let content = '';
        if (data === 'project1') content = '<h3>3D Portfolio</h3><p>Details...</p>';
        // Add similar for others
        document.getElementById('modal-body').innerHTML = content;
        modal.style.display = 'flex';
    });
});
document.querySelector('.close-modal').addEventListener('click', () => modal.style.display = 'none');

// 3D Skill Cube with Three.js
const cubeScene = new THREE.Scene();
const cubeCamera = new THREE.PerspectiveCamera(75, 200 / 200, 0.1, 1000);
const cubeRenderer = new THREE.WebGLRenderer({ alpha: true });
const cubeContainer = document.getElementById('skill-cube-container');
cubeRenderer.setSize(200, 200);
cubeContainer.appendChild(cubeRenderer.domElement);
const geometry = new THREE.BoxGeometry();
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Faces with skill names (simplified)
    // Add textures or text for skills
];
const cube = new THREE.Mesh(geometry, materials);
cubeScene.add(cube);
cubeCamera.position.z = 2;
function animateCube() {
    requestAnimationFrame(animateCube);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cubeRenderer.render(cubeScene, cubeCamera);
}
animateCube();
// Glow on hover
cubeContainer.addEventListener('mouseover', () => cubeRenderer.domElement.style.boxShadow = '0 0 20px #00b4d8');

// Contact Form Submit
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = { name: formData.get('name'), email: formData.get('email'), message: formData.get('message') };
    await fetch('https://your-backend-url/contact', { // Replace with actual backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    alert('Message sent!');
});

// AI Chat
const chatWidget = document.getElementById('chat-widget');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatToggle = document.querySelector('.chat-toggle');
chatToggle.addEventListener('click', () => chatWidget.style.display = 'flex');
document.querySelector('.close-chat').addEventListener('click', () => chatWidget.style.display = 'none');
chatSend.addEventListener('click', async () => {
    const userMsg = chatInput.value;
    chatBody.innerHTML += `<div class="user-msg">${userMsg}</div>`;
    chatInput.value = '';
    const res = await fetch('https://your-backend-url/chat', { // Replace with actual
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
    });
    const { reply } = await res.json();
    chatBody.innerHTML += `<div class="ai-msg">${reply}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
});
