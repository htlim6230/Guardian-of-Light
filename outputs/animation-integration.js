/**
 * Animation Integration System
 * Combines the base animations from enhanced-game.js with the enhanced visual effects
 */

// Enhanced animation system that integrates with the existing game
function createIntegratedAnimationSystem() {
    const effectsSystem = new EnhancedCharacterEffects();
    const characterEffects = new Map();

    return {
        // Initialize enhanced effects for a character
        initializeCharacterEffects(npc, characterKey, scene) {
            if (!characterManifest?.[characterKey]) return;

            let effects;
            switch (characterKey) {
                case 'ice_crystallite':
                    effects = effectsSystem.createIceEffects(npc, scene);
                    break;
                case 'heroin_bag':
                    effects = effectsSystem.createHeroinEffects(npc, scene);
                    break;
                case 'weed_leaf':
                    effects = effectsSystem.createWeedEffects(npc, scene);
                    break;
                case 'ecstasy_pill':
                    effects = effectsSystem.createEcstasyEffects(npc, scene);
                    break;
                case 'ketamine_capsule':
                    effects = effectsSystem.createKetamineEffects(npc, scene);
                    break;
            }

            if (effects) {
                characterEffects.set(characterKey, effects);
            }
        },

        // Enhanced version of updateCharacterAnimation that includes visual effects
        updateCharacterAnimationWithEffects(npc, characterKey, deltaTime) {
            if (!characterManifest?.[characterKey]) return;

            const animationType = characterManifest[characterKey].animation_idle;
            
            // Base animation from enhanced-game.js
            switch (animationType) {
                case 'floating_drift':
                    npc.position.y += Math.sin(clock * 2) * 0.01;
                    npc.rotation.y += deltaTime * 0.3;
                    break;
                case 'slumped_droop':
                    npc.rotation.x = -0.1 + Math.sin(clock * 0.5) * 0.05;
                    break;
                case 'stem_sway':
                    npc.rotation.z = Math.sin(clock * 1.2) * 0.1;
                    break;
                case 'manic_bounce':
                    npc.position.y += Math.sin(clock * 8) * 0.05;
                    npc.rotation.y += deltaTime * 2;
                    break;
                case 'robotic_float':
                    npc.position.y += Math.sin(clock * 3) * 0.02;
                    npc.rotation.x += deltaTime * 0.5;
                    break;
            }

            // Enhanced visual effects
            const effects = characterEffects.get(characterKey);
            if (effects && effects.update) {
                effects.update(deltaTime);
            }

            // Update the effects system clock
            effectsSystem.update(deltaTime);
        },

        // Cleanup when changing rooms or ending game
        cleanupEffects(scene) {
            effectsSystem.cleanup(scene);
            characterEffects.clear();
        },

        // Get the effects system for direct access
        getEffectsSystem() {
            return effectsSystem;
        }
    };
}

// Enhanced room creation that includes visual effects initialization
function createEnhancedRoomWithEffects(roomIndex) {
    // Call the existing makeRoom function
    makeRoom(roomIndex);
    
    // Initialize the animation system for this room
    if (window.animationSystem) {
        window.animationSystem.cleanupEffects(scene);
    }
    
    window.animationSystem = createIntegratedAnimationSystem();
    
    // Initialize effects for the NPC in this room
    if (npcs[0] && npcs[0].characterKey) {
        window.animationSystem.initializeCharacterEffects(
            npcs[0].g, 
            npcs[0].characterKey, 
            room
        );
    }
}

// Enhanced frame loop integration
function enhancedFrameLoop(now) {
    requestAnimationFrame(enhancedFrameLoop);
    const dt = Math.min((now - last) / 1000, 0.05) || 0.016;
    last = now;
    clock += dt;

    const playing = mode === 'play', inside = roomIndex >= 0;

    if (playing && inside && npcs[0] && window.animationSystem) {
        // Use enhanced animation system instead of basic one
        window.animationSystem.updateCharacterAnimationWithEffects(
            npcs[0].g, 
            npcs[0].characterKey, 
            dt
        );

        // Check for proximity dialogue (existing functionality)
        if (pet && npcs[0].g) {
            checkProximityDialogue(pet, npcs[0].g, npcs[0].characterKey);
        }
    }

    // Existing room-specific effects
    if (roomIndex === 0 && !motionReduced && clock > iceNext) {
        iceAngle += 0.02;
        if (iceAngle > 0.15) {
            camera.rotation.z = Math.sin(clock * 12) * 0.01;
            camera.position.y = 11 + Math.sin(clock * 8) * 0.05;
        }
        if (clock > iceNext + 3) {
            iceNext = clock + 4;
            iceAngle = 0;
            camera.rotation.z = 0;
            camera.position.y = 11;
        }
    }

    // Fog sprite animation for ecstasy room
    if (roomIndex === 3) {
        fogSprites.forEach((s, i) => {
            s.position.x += (Math.sin(clock + i) * 0.8) * dt;
            s.position.z += (Math.cos(clock * 1.2 + i) * 0.6) * dt;
            s.material.opacity = 0.3 + Math.sin(clock * 2 + i) * 0.15;
        });
    }

    // Room object rotations
    roomObjects.forEach(obj => {
        if (obj.geometry instanceof THREE.OctahedronGeometry) {
            obj.rotation.y += dt * 0.5;
            obj.rotation.x += dt * 0.3;
        }
    });

    // Render the scene
    renderer.render(scene, camera);
}

// Animation showcase and testing
function demonstrateAnimations() {
    console.log("=== Character Animation System Demo ===");
    
    if (!characterManifest) {
        console.log("Loading character manifest...");
        return;
    }

    console.log("\nAnimation Types Implemented:");
    Object.entries(characterManifest).forEach(([key, data]) => {
        const animation = data.animation_idle;
        console.log(`${data.name}: ${animation}`);
        
        switch (animation) {
            case 'floating_drift':
                console.log("  - Gentle vertical floating with continuous Y-axis rotation");
                console.log("  - Enhanced: Ice particles, crystalline light reflections, mist effects");
                break;
            case 'slumped_droop':
                console.log("  - Drooping posture with subtle breathing motion");
                console.log("  - Enhanced: Falling powder particles, sickly lighting, sagging motion");
                break;
            case 'stem_sway':
                console.log("  - Organic swaying motion like a plant in breeze");
                console.log("  - Enhanced: Floating spores, haze effects, gentle bobbing");
                break;
            case 'manic_bounce':
                console.log("  - Rapid vertical bouncing with fast rotation");
                console.log("  - Enhanced: Energy particles, strobing lights, erratic movement");
                break;
            case 'robotic_float':
                console.log("  - Mechanical floating with X-axis rotation");
                console.log("  - Enhanced: Dissociative particles, phasing lights, disconnected movement");
                break;
        }
        console.log("");
    });

    console.log("Visual Effect Features:");
    console.log("- Particle systems (20-40 particles per character)");
    console.log("- Dynamic lighting effects");
    console.log("- Environmental atmosphere (mist, haze, glow)");
    console.log("- Character-specific material properties");
    console.log("- Synchronized animation timing");
    console.log("- Automatic cleanup and resource management");
}

// Export integration system
if (typeof window !== 'undefined') {
    window.AnimationIntegration = {
        createIntegratedAnimationSystem,
        createEnhancedRoomWithEffects,
        enhancedFrameLoop,
        demonstrateAnimations
    };
}

// Performance monitoring
class AnimationPerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
    }

    update() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Log performance warnings
            if (this.fps < 30) {
                console.warn(`Animation performance warning: ${this.fps} FPS`);
            }
        }
    }

    getFPS() {
        return this.fps;
    }
}

// Usage instructions and integration guide
const INTEGRATION_GUIDE = `
=== Animation System Integration Guide ===

1. Replace makeRoom calls with createEnhancedRoomWithEffects:
   makeRoom(i) → createEnhancedRoomWithEffects(i)

2. Replace frame loop with enhanced version:
   requestAnimationFrame(frame) → requestAnimationFrame(enhancedFrameLoop)

3. Initialize effects system on game start:
   window.animationSystem = createIntegratedAnimationSystem()

4. Clean up on room transitions:
   window.animationSystem.cleanupEffects(scene)

5. Monitor performance:
   const monitor = new AnimationPerformanceMonitor()
   // Call monitor.update() in frame loop

=== Performance Optimization Tips ===

- Particle count can be reduced for better performance
- Disable effects on low-end devices
- Use object pooling for particles
- Implement LOD (Level of Detail) for distant effects
- Consider reducing effect intensity based on FPS

=== Customization Options ===

- Adjust particle counts in createParticleSystem config
- Modify animation speeds in character update methods  
- Change lighting intensities and colors
- Add new effect types by extending EnhancedCharacterEffects class
`;

console.log(INTEGRATION_GUIDE);