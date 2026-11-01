/**
 * Enhanced Visual Effects System
 * Extends the character animations with additional particle effects, lighting, and environmental interactions
 */

// Enhanced Animation System with Visual Effects
class EnhancedCharacterEffects {
    constructor() {
        this.particleSystems = new Map();
        this.lightingEffects = new Map();
        this.environmentalEffects = new Map();
        this.clock = 0;
    }

    // Ice Crystallite Enhanced Effects
    createIceEffects(npc, scene) {
        // Floating ice particles
        const iceParticles = this.createParticleSystem({
            count: 20,
            color: 0x8bcaff,
            size: 0.02,
            spread: 2,
            speed: 0.5,
            opacity: 0.7
        });
        
        // Crystalline light reflections
        const crystalLight = new THREE.PointLight(0x8bcaff, 2, 5);
        crystalLight.position.copy(npc.position);
        crystalLight.position.y += 1;
        
        // Ice mist effect
        const mistGeometry = new THREE.PlaneGeometry(3, 3);
        const mistMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const iceMist = new THREE.Mesh(mistGeometry, mistMaterial);
        iceMist.position.copy(npc.position);
        iceMist.position.y -= 0.5;
        iceMist.rotation.x = -Math.PI / 2;

        scene.add(iceParticles);
        scene.add(crystalLight);
        scene.add(iceMist);

        this.particleSystems.set('ice', iceParticles);
        this.lightingEffects.set('ice', crystalLight);
        this.environmentalEffects.set('ice', iceMist);

        return {
            update: (deltaTime) => {
                // Enhanced floating drift with ice crystal rotation
                npc.position.y += Math.sin(this.clock * 2) * 0.01;
                npc.rotation.y += deltaTime * 0.3;
                
                // Crystal facet reflections
                npc.children.forEach((child, index) => {
                    if (child.geometry) {
                        child.rotation.x += deltaTime * (0.2 + index * 0.1);
                        child.rotation.z += deltaTime * (0.15 + index * 0.05);
                    }
                });

                // Update particles
                this.updateIceParticles(iceParticles, deltaTime);
                
                // Pulsing light
                crystalLight.intensity = 2 + Math.sin(this.clock * 3) * 0.5;
                crystalLight.position.copy(npc.position);
                crystalLight.position.y += 1;

                // Mist rotation
                iceMist.rotation.z += deltaTime * 0.1;
                iceMist.material.opacity = 0.05 + Math.sin(this.clock * 1.5) * 0.05;
            }
        };
    }

    // Heroin Bag Enhanced Effects
    createHeroinEffects(npc, scene) {
        // Drooping powder particles
        const powderParticles = this.createParticleSystem({
            count: 15,
            color: 0xffffff,
            size: 0.015,
            spread: 1.5,
            speed: -0.2,
            opacity: 0.6
        });

        // Dim, sickly lighting
        const heroinLight = new THREE.PointLight(0xe6a889, 1, 3);
        heroinLight.position.copy(npc.position);
        
        scene.add(powderParticles);
        scene.add(heroinLight);

        this.particleSystems.set('heroin', powderParticles);
        this.lightingEffects.set('heroin', heroinLight);

        return {
            update: (deltaTime) => {
                // Enhanced slumped droop with sagging motion
                npc.rotation.x = -0.1 + Math.sin(this.clock * 0.5) * 0.05;
                npc.scale.y = 0.95 + Math.sin(this.clock * 0.3) * 0.05;
                
                // Subtle sway like being under influence
                npc.position.x += Math.sin(this.clock * 0.8) * 0.005;
                npc.position.z += Math.cos(this.clock * 0.6) * 0.003;

                // Update powder particles falling
                this.updateHeroinParticles(powderParticles, deltaTime);
                
                // Flickering, weakening light
                heroinLight.intensity = 0.8 + Math.sin(this.clock * 2) * 0.3;
                heroinLight.position.copy(npc.position);
            }
        };
    }

    // Weed Leaf Enhanced Effects
    createWeedEffects(npc, scene) {
        // Floating green spores
        const sporeParticles = this.createParticleSystem({
            count: 25,
            color: 0xa7bf80,
            size: 0.01,
            spread: 2.5,
            speed: 0.1,
            opacity: 0.5
        });

        // Warm, hazy light
        const weedLight = new THREE.PointLight(0xa7bf80, 1.5, 4);
        weedLight.position.copy(npc.position);

        // Smoke/haze effect
        const hazeGeometry = new THREE.SphereGeometry(2, 8, 6);
        const hazeMaterial = new THREE.MeshBasicMaterial({
            color: 0xa7bf80,
            transparent: true,
            opacity: 0.05,
            side: THREE.BackSide
        });
        const smokeHaze = new THREE.Mesh(hazeGeometry, hazeMaterial);
        smokeHaze.position.copy(npc.position);

        scene.add(sporeParticles);
        scene.add(weedLight);
        scene.add(smokeHaze);

        this.particleSystems.set('weed', sporeParticles);
        this.lightingEffects.set('weed', weedLight);
        this.environmentalEffects.set('weed', smokeHaze);

        return {
            update: (deltaTime) => {
                // Enhanced stem sway with organic movement
                npc.rotation.z = Math.sin(this.clock * 1.2) * 0.1;
                npc.rotation.x = Math.sin(this.clock * 0.8) * 0.05;
                
                // Gentle bobbing like in a breeze
                npc.position.y += Math.sin(this.clock * 1.5) * 0.008;

                // Update spore particles
                this.updateWeedParticles(sporeParticles, deltaTime);
                
                // Pulsing hazy light
                weedLight.intensity = 1.2 + Math.sin(this.clock * 1.5) * 0.3;
                weedLight.position.copy(npc.position);

                // Expanding/contracting haze
                const scale = 1 + Math.sin(this.clock * 0.7) * 0.1;
                smokeHaze.scale.setScalar(scale);
                smokeHaze.material.opacity = 0.03 + Math.sin(this.clock * 1.2) * 0.02;
            }
        };
    }

    // Ecstasy Pill Enhanced Effects
    createEcstasyEffects(npc, scene) {
        // Manic energy particles
        const energyParticles = this.createParticleSystem({
            count: 40,
            color: 0xe697ee,
            size: 0.025,
            spread: 3,
            speed: 2,
            opacity: 0.8
        });

        // Strobing party lights
        const ecstasyLight = new THREE.PointLight(0xe697ee, 3, 6);
        ecstasyLight.position.copy(npc.position);

        // Rim glow effect
        const glowGeometry = new THREE.SphereGeometry(1.2, 16, 12);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xe697ee,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const rimGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        rimGlow.position.copy(npc.position);

        scene.add(energyParticles);
        scene.add(ecstasyLight);
        scene.add(rimGlow);

        this.particleSystems.set('ecstasy', energyParticles);
        this.lightingEffects.set('ecstasy', ecstasyLight);
        this.environmentalEffects.set('ecstasy', rimGlow);

        return {
            update: (deltaTime) => {
                // Enhanced manic bounce with erratic movement
                npc.position.y += Math.sin(this.clock * 8) * 0.05;
                npc.rotation.y += deltaTime * 2;
                
                // Jittery, hyperactive movements
                npc.position.x += (Math.random() - 0.5) * 0.01;
                npc.position.z += (Math.random() - 0.5) * 0.01;
                npc.rotation.z += (Math.random() - 0.5) * 0.02;

                // Update energy particles
                this.updateEcstasyParticles(energyParticles, deltaTime);
                
                // Strobing light effect
                ecstasyLight.intensity = Math.random() > 0.7 ? 5 : 2;
                ecstasyLight.color.setHSL((this.clock * 2) % 1, 1, 0.5);
                ecstasyLight.position.copy(npc.position);

                // Pulsing rim glow
                const glowScale = 1 + Math.sin(this.clock * 6) * 0.2;
                rimGlow.scale.setScalar(glowScale);
                rimGlow.material.opacity = 0.1 + Math.sin(this.clock * 4) * 0.1;
            }
        };
    }

    // Ketamine Capsule Enhanced Effects
    createKetamineEffects(npc, scene) {
        // Disconnected, floating particles
        const dissociativeParticles = this.createParticleSystem({
            count: 30,
            color: 0xb1a1f0,
            size: 0.02,
            spread: 4,
            speed: 0.3,
            opacity: 0.4
        });

        // Disorienting light
        const ketamineLight = new THREE.PointLight(0xb1a1f0, 1.8, 5);
        ketamineLight.position.copy(npc.position);

        scene.add(dissociativeParticles);
        scene.add(ketamineLight);

        this.particleSystems.set('ketamine', dissociativeParticles);
        this.lightingEffects.set('ketamine', ketamineLight);

        return {
            update: (deltaTime) => {
                // Enhanced robotic float with disconnected movement
                npc.position.y += Math.sin(this.clock * 3) * 0.02;
                npc.rotation.x += deltaTime * 0.5;
                
                // Dissociative phase shifts
                npc.rotation.y += Math.sin(this.clock * 0.4) * deltaTime;
                npc.rotation.z += Math.cos(this.clock * 0.6) * deltaTime * 0.5;

                // Update dissociative particles
                this.updateKetamineParticles(dissociativeParticles, deltaTime);
                
                // Phasing light intensity
                ketamineLight.intensity = 1.5 + Math.sin(this.clock * 2.5) * 0.5;
                ketamineLight.position.copy(npc.position);
                ketamineLight.position.y += Math.sin(this.clock * 1.8) * 0.5;
            }
        };
    }

    // Particle system creation
    createParticleSystem(config) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const velocities = [];

        for (let i = 0; i < config.count; i++) {
            vertices.push(
                (Math.random() - 0.5) * config.spread,
                Math.random() * 2,
                (Math.random() - 0.5) * config.spread
            );
            velocities.push(
                (Math.random() - 0.5) * config.speed,
                Math.random() * config.speed,
                (Math.random() - 0.5) * config.speed
            );
        }

        geometry.setAttribute('position', new THREE.Float32Array(vertices));
        geometry.setAttribute('velocity', new THREE.Float32Array(velocities));

        const material = new THREE.PointsMaterial({
            color: config.color,
            size: config.size,
            transparent: true,
            opacity: config.opacity,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        return particles;
    }

    // Particle update methods for each character type
    updateIceParticles(particles, deltaTime) {
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i] * deltaTime;
            positions[i + 1] += velocities[i + 1] * deltaTime * Math.sin(this.clock + i);
            positions[i + 2] += velocities[i + 2] * deltaTime;

            // Reset particles that drift too far
            if (Math.abs(positions[i]) > 3 || positions[i + 1] > 4) {
                positions[i] = (Math.random() - 0.5) * 2;
                positions[i + 1] = 0;
                positions[i + 2] = (Math.random() - 0.5) * 2;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    updateHeroinParticles(particles, deltaTime) {
        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= 0.2 * deltaTime; // Falling motion
            
            if (positions[i + 1] < -1) {
                positions[i + 1] = 2;
                positions[i] = (Math.random() - 0.5) * 1.5;
                positions[i + 2] = (Math.random() - 0.5) * 1.5;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    updateWeedParticles(particles, deltaTime) {
        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(this.clock + i * 0.1) * deltaTime * 0.1;
            positions[i + 1] += Math.sin(this.clock * 2 + i * 0.1) * deltaTime * 0.05;
            positions[i + 2] += Math.cos(this.clock + i * 0.1) * deltaTime * 0.1;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    updateEcstasyParticles(particles, deltaTime) {
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;

        for (let i = 0; i < positions.length; i += 3) {
            // Chaotic, energetic movement
            velocities[i] += (Math.random() - 0.5) * 0.1;
            velocities[i + 1] += (Math.random() - 0.5) * 0.1;
            velocities[i + 2] += (Math.random() - 0.5) * 0.1;

            positions[i] += velocities[i] * deltaTime;
            positions[i + 1] += velocities[i + 1] * deltaTime;
            positions[i + 2] += velocities[i + 2] * deltaTime;

            // Reset if too far
            if (Math.hypot(positions[i], positions[i + 2]) > 4) {
                positions[i] = 0;
                positions[i + 1] = 1;
                positions[i + 2] = 0;
                velocities[i] = (Math.random() - 0.5) * 2;
                velocities[i + 1] = Math.random();
                velocities[i + 2] = (Math.random() - 0.5) * 2;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    updateKetamineParticles(particles, deltaTime) {
        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            // Disconnected, floating motion
            positions[i] += Math.sin(this.clock * 0.3 + i * 0.1) * deltaTime * 0.3;
            positions[i + 1] += Math.sin(this.clock * 0.5 + i * 0.15) * deltaTime * 0.2;
            positions[i + 2] += Math.cos(this.clock * 0.4 + i * 0.12) * deltaTime * 0.25;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    // Update all effects
    update(deltaTime) {
        this.clock += deltaTime;
        
        // Update all active effect systems
        this.particleSystems.forEach(system => {
            // Particle updates are handled in individual character update methods
        });
        
        this.lightingEffects.forEach(light => {
            // Lighting updates are handled in individual character update methods
        });
    }

    // Cleanup methods
    cleanup(scene) {
        this.particleSystems.forEach(system => {
            scene.remove(system);
            if (system.geometry) system.geometry.dispose();
            if (system.material) system.material.dispose();
        });
        
        this.lightingEffects.forEach(light => {
            scene.remove(light);
            light.dispose();
        });
        
        this.environmentalEffects.forEach(effect => {
            scene.remove(effect);
            if (effect.geometry) effect.geometry.dispose();
            if (effect.material) effect.material.dispose();
        });

        this.particleSystems.clear();
        this.lightingEffects.clear();
        this.environmentalEffects.clear();
    }
}

// Export the enhanced effects system
if (typeof window !== 'undefined') {
    window.EnhancedCharacterEffects = EnhancedCharacterEffects;
}