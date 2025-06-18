
        // Initialize Three.js for Parallax Effect
        let parallaxScene, parallaxCamera, parallaxRenderer;
        let computerModels = [];
        let assemblyScene, assemblyCamera, assemblyRenderer, assemblyComputer;
        let scrollY = 0;
        let particles = [];
        
        // Wait for DOM to load
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize loader
            const loader = document.querySelector('.loader');
            
            // Initialize navigation
            const navBar = document.querySelector('.nav-bar');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
            
            // Scroll event for navbar
            window.addEventListener('scroll', () => {
                scrollY = window.scrollY;
                
                if (scrollY > 50) {
                    navBar.classList.add('nav-scrolled');
                } else {
                    navBar.classList.remove('nav-scrolled');
                }
            });
            
            // Initialize GSAP animations
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero animations
            gsap.to('.hero-title', {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.5
            });
            
            gsap.to('.hero-subtitle', {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.7
            });
            
            gsap.to('.cta-button', {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.9
            });
            
            gsap.to('.scroll-indicator', {
                opacity: 1,
                duration: 1,
                delay: 1.2
            });
            
            // Component cards animation
            gsap.utils.toArray('.component-card').forEach((card, i) => {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=100',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: i * 0.2
                });
            });
            
            // Assembly steps animation
            gsap.utils.toArray('.step').forEach((step, i) => {
                gsap.to(step, {
                    scrollTrigger: {
                        trigger: step,
                        start: 'top bottom-=100',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: i * 0.2
                });
            });
            
            // Specs items animation
            gsap.utils.toArray('.spec-item').forEach((item, i) => {
                gsap.to(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom-=100',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    delay: i * 0.1
                });
            });
            
            // Contact form animation
            gsap.to('.contact-container', {
                scrollTrigger: {
                    trigger: '.contact-container',
                    start: 'top bottom-=100',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 1
            });
            
            // Initialize 3D scenes
            initParallaxScene();
            initAssemblyScene();
            createParticles();
            
            // Hide loader after everything is initialized
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 2000);
            
            // Form submission
            const contactForm = document.querySelector('.contact-form');
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your message! Our team will get back to you soon.');
                contactForm.reset();
            });
            
            // CTA button action
            const ctaButton = document.querySelector('.cta-button');
            ctaButton.addEventListener('click', () => {
                document.getElementById('components').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Create glowing particles
        function createParticles() {
            const container = document.getElementById('particles-container');
            
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random size between 5px and 20px
                const size = Math.random() * 15 + 5;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Random position
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                
                // Random color
                const colors = ['var(--neon-blue)', 'var(--neon-purple)', 'var(--neon-pink)'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
                
                // Random animation duration and delay
                const duration = Math.random() * 10 + 10;
                const delay = Math.random() * 5;
                particle.style.animation = `float ${duration}s infinite ease-in-out ${delay}s`;
                
                container.appendChild(particle);
                particles.push({
                    element: particle,
                    posX,
                    posY,
                    speedX: (Math.random() - 0.5) * 0.1,
                    speedY: (Math.random() - 0.5) * 0.1
                });
            }
            
            animateParticles();
        }
        
        function animateParticles() {
            particles.forEach(particle => {
                particle.posX += particle.speedX;
                particle.posY += particle.speedY;
                
                // Wrap around screen
                if (particle.posX > 100) particle.posX = 0;
                if (particle.posX < 0) particle.posX = 100;
                if (particle.posY > 100) particle.posY = 0;
                if (particle.posY < 0) particle.posY = 100;
                
                particle.element.style.left = `${particle.posX}%`;
                particle.element.style.top = `${particle.posY}%`;
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        // Initialize Parallax 3D Scene
        function initParallaxScene() {
            // Create scene
            parallaxScene = new THREE.Scene();
            
            // Create camera
            parallaxCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            parallaxCamera.position.z = 5;
            
            // Create renderer
            parallaxRenderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('parallax-canvas'),
                alpha: true,
                antialias: true
            });
            parallaxRenderer.setSize(window.innerWidth, window.innerHeight);
            parallaxRenderer.setPixelRatio(window.devicePixelRatio);
            
            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0x404040, 2);
            parallaxScene.add(ambientLight);
            
            // Add directional light
            const directionalLight = new THREE.DirectionalLight(0x00f3ff, 2);
            directionalLight.position.set(1, 1, 1);
            parallaxScene.add(directionalLight);
            
            // Add point lights for neon effect
            const pointLight1 = new THREE.PointLight(0x00f3ff, 2, 10);
            pointLight1.position.set(2, 2, 2);
            parallaxScene.add(pointLight1);
            
            const pointLight2 = new THREE.PointLight(0x9000ff, 2, 10);
            pointLight2.position.set(-2, -2, 2);
            parallaxScene.add(pointLight2);
            
            // Create multiple computer models for parallax effect
            createComputerModel(0, 0, 0); // Center
            createComputerModel(-8, 5, -10); // Top left
            createComputerModel(8, -5, -15); // Bottom right
            createComputerModel(10, 8, -20); // Top right
            createComputerModel(-10, -8, -25); // Bottom left
            
            // Add glow effect
            const glowGeometry = new THREE.SphereGeometry(3, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x00f3ff,
                transparent: true,
                opacity: 0.1
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            parallaxScene.add(glow);
            
            // Handle window resize
            window.addEventListener('resize', () => {
                parallaxCamera.aspect = window.innerWidth / window.innerHeight;
                parallaxCamera.updateProjectionMatrix();
                parallaxRenderer.setSize(window.innerWidth, window.innerHeight);
            });
            
            // Animation loop
            function animateParallax() {
                requestAnimationFrame(animateParallax);
                
                // Calculate scroll percentage
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercentage = scrollY / scrollHeight;
                
                // Move camera based on scroll
                parallaxCamera.position.y = -scrollPercentage * 10;
                
                // Rotate computer models
                computerModels.forEach((model, index) => {
                    model.rotation.y += 0.005 * (index % 2 === 0 ? 1 : -1);
                    model.rotation.x = Math.sin(Date.now() * 0.001 + index) * 0.1;
                    
                    // Move models based on scroll
                    model.position.y = model.initialY + scrollPercentage * 15;
                });
                
                // Pulsate glow
                const time = Date.now() * 0.001;
                glow.material.opacity = 0.1 + Math.sin(time) * 0.05;
                glow.position.y = -scrollPercentage * 10;
                
                // Render scene
                parallaxRenderer.render(parallaxScene, parallaxCamera);
            }
            
            animateParallax();
        }
        
        // Create computer model for parallax effect
        function createComputerModel(x, y, z) {
            const computer = new THREE.Group();
            
            // Monitor
            const monitorGeometry = new THREE.BoxGeometry(3, 2, 0.1);
            const monitorMaterial = new THREE.MeshPhongMaterial({
                color: 0x111111,
                shininess: 100,
                specular: 0x666666
            });
            const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
            
            // Screen
            const screenGeometry = new THREE.BoxGeometry(2.8, 1.8, 0.05);
            const screenMaterial = new THREE.MeshPhongMaterial({
                color: 0x00f3ff,
                emissive: 0x00f3ff,
                emissiveIntensity: 0.2,
                shininess: 100
            });
            const screen = new THREE.Mesh(screenGeometry, screenMaterial);
            screen.position.z = 0.08;
            monitor.add(screen);
            
            // Stand
            const standGeometry = new THREE.CylinderGeometry(0.1, 0.3, 1, 8);
            const standMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333,
                shininess: 100
            });
            const stand = new THREE.Mesh(standGeometry, standMaterial);
            stand.position.y = -1.5;
            stand.rotation.x = Math.PI / 2;
            monitor.add(stand);
            
            // Base
            const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
            const baseMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333,
                shininess: 100
            });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = -1.5;
            base.position.z = -0.5;
            monitor.add(base);
            
            // Keyboard
            const keyboardGeometry = new THREE.BoxGeometry(2, 0.1, 0.8);
            const keyboardMaterial = new THREE.MeshPhongMaterial({
                color: 0x111111,
                shininess: 100
            });
            const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
            keyboard.position.y = -1;
            keyboard.position.z = -1.5;
            
            // Mouse
            const mouseGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.5);
            const mouseMaterial = new THREE.MeshPhongMaterial({
                color: 0x111111,
                shininess: 100
            });
            const mouse = new THREE.Mesh(mouseGeometry, mouseMaterial);
            mouse.position.x = 1.2;
            mouse.position.y = -1;
            mouse.position.z = -1.5;
            
            // Add all parts to the computer group
            computer.add(monitor);
            computer.add(keyboard);
            computer.add(mouse);
            
            // Position the computer
            computer.position.set(x, y, z);
            computer.initialY = y; // Store initial Y position for parallax effect
            
            // Add computer to scene
            parallaxScene.add(computer);
            computerModels.push(computer);
            
            return computer;
        }
        
        // Initialize Assembly 3D Scene
        function initAssemblyScene() {
            // Create scene
            assemblyScene = new THREE.Scene();
            
            // Create camera
            assemblyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            assemblyCamera.position.z = 5;
            
            // Create renderer
            assemblyRenderer = new THREE.WebGLRenderer({
                canvas: document.getElementById('assembly-canvas'),
                alpha: true,
                antialias: true
            });
            assemblyRenderer.setSize(document.querySelector('.assembly-container').offsetWidth, document.querySelector('.assembly-container').offsetHeight);
            assemblyRenderer.setPixelRatio(window.devicePixelRatio);
            
            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0x404040, 2);
            assemblyScene.add(ambientLight);
            
            // Add directional light
            const directionalLight = new THREE.DirectionalLight(0x00f3ff, 2);
            directionalLight.position.set(1, 1, 1);
            assemblyScene.add(directionalLight);
            
            // Add point lights for neon effect
            const pointLight1 = new THREE.PointLight(0x00f3ff, 2, 10);
            pointLight1.position.set(2, 2, 2);
            assemblyScene.add(pointLight1);
            
            const pointLight2 = new THREE.PointLight(0x9000ff, 2, 10);
            pointLight2.position.set(-2, -2, 2);
            assemblyScene.add(pointLight2);
            
            // Create computer parts
            assemblyComputer = new THREE.Group();
            
            // Motherboard
            const motherboardGeometry = new THREE.BoxGeometry(3, 0.1, 3);
            const motherboardMaterial = new THREE.MeshPhongMaterial({
                color: 0x006600,
                shininess: 100
            });
            const motherboard = new THREE.Mesh(motherboardGeometry, motherboardMaterial);
            
            // CPU
            const cpuGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
            const cpuMaterial = new THREE.MeshPhongMaterial({
                color: 0x999999,
                shininess: 100
            });
            const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
            cpu.position.y = 0.1;
            cpu.position.x = -0.5;
            cpu.position.z = -0.5;
            
            // RAM
            const ramGeometry = new THREE.BoxGeometry(0.1, 0.3, 2);
            const ramMaterial = new THREE.MeshPhongMaterial({
                color: 0x111111,
                shininess: 100
            });
            const ram1 = new THREE.Mesh(ramGeometry, ramMaterial);
            ram1.position.y = 0.2;
            ram1.position.x = 0.5;
            
            const ram2 = new THREE.Mesh(ramGeometry, ramMaterial);
            ram2.position.y = 0.2;
            ram2.position.x = 0.8;
            
            // GPU
            const gpuGeometry = new THREE.BoxGeometry(0.5, 0.1, 2);
            const gpuMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333,
                shininess: 100
            });
            const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
            gpu.position.y = 0.1;
            gpu.position.x = -1;
            
            // Add all parts to the computer group
            assemblyComputer.add(motherboard);
            assemblyComputer.add(cpu);
            assemblyComputer.add(ram1);
            assemblyComputer.add(ram2);
            assemblyComputer.add(gpu);
            
            // Add computer to scene
            assemblyScene.add(assemblyComputer);
            
            // Handle window resize
            window.addEventListener('resize', () => {
                assemblyCamera.aspect = document.querySelector('.assembly-container').offsetWidth / document.querySelector('.assembly-container').offsetHeight;
                assemblyCamera.updateProjectionMatrix();
                assemblyRenderer.setSize(document.querySelector('.assembly-container').offsetWidth, document.querySelector('.assembly-container').offsetHeight);
            });
            
            // Animation loop
            function animateAssembly() {
                requestAnimationFrame(animateAssembly);
                
                // Rotate computer parts
                assemblyComputer.rotation.y += 0.005;
                
                // Animate assembly based on scroll position
                const assemblySection = document.getElementById('assembly');
                const assemblySectionTop = assemblySection.offsetTop;
                const assemblySectionHeight = assemblySection.offsetHeight;
                
                // Calculate how far through the section we've scrolled
                const scrollPercentage = (scrollY - assemblySectionTop + window.innerHeight) / (assemblySectionHeight + window.innerHeight);
                
                if (scrollPercentage >= 0 && scrollPercentage <= 1) {
                    // Animate parts coming together
                    cpu.position.y = 0.1 + (1 - Math.min(scrollPercentage * 3, 1)) * 2;
                    ram1.position.y = 0.2 + (1 - Math.min(Math.max((scrollPercentage - 0.3) * 3, 0), 1)) * 2;
                    ram2.position.y = 0.2 + (1 - Math.min(Math.max((scrollPercentage - 0.4) * 3, 0), 1)) * 2;
                    gpu.position.y = 0.1 + (1 - Math.min(Math.max((scrollPercentage - 0.5) * 3, 0), 1)) * 2;
                    
                    // Rotate based on scroll
                    assemblyComputer.rotation.x = scrollPercentage * Math.PI * 0.5;
                }
                
                // Render scene
                assemblyRenderer.render(assemblyScene, assemblyCamera);
            }
            
            animateAssembly();
            
            // Set up scroll trigger for assembly animation
            ScrollTrigger.create({
                trigger: "#assembly",
                start: "top bottom",
                end: "bottom top",
                onUpdate: (self) => {
                    // Update camera position based on scroll
                    assemblyCamera.position.y = self.progress * -1;
                }
            });
        }
   