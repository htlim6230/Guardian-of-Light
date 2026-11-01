# Character Animation and Visual Effects System

This document describes the complete animation and visual effects system implemented for the enhanced 3D game characters based on the Python script specifications.

## Animation Types Overview

The system implements five distinct animation patterns, each designed to reflect the personality and effects of different substances:

### 1. Floating Drift (Ice Crystallite)
**Animation**: `floating_drift`
- **Base Motion**: Gentle vertical floating with sine wave pattern
- **Rotation**: Continuous Y-axis rotation (0.3 rad/s)
- **Enhanced Effects**:
  - Ice particle system (20 particles)
  - Crystalline light reflections with pulsing intensity
  - Mist effect with rotating opacity
  - Multi-faceted crystal rotations on child objects

```javascript
// Base animation
npc.position.y += Math.sin(clock * 2) * 0.01;
npc.rotation.y += deltaTime * 0.3;

// Enhanced effects
crystalLight.intensity = 2 + Math.sin(clock * 3) * 0.5;
iceMist.rotation.z += deltaTime * 0.1;
```

### 2. Slumped Droop (Heroin Bag)
**Animation**: `slumped_droop`
- **Base Motion**: Drooping posture with breathing-like motion
- **Rotation**: Subtle X-axis tilting
- **Enhanced Effects**:
  - Falling powder particles (15 particles)
  - Dim, sickly lighting
  - Sagging scale animation
  - Subtle swaying motion simulating impairment

```javascript
// Base animation
npc.rotation.x = -0.1 + Math.sin(clock * 0.5) * 0.05;

// Enhanced effects
npc.scale.y = 0.95 + Math.sin(clock * 0.3) * 0.05;
npc.position.x += Math.sin(clock * 0.8) * 0.005;
```

### 3. Stem Sway (Weed Leaf)
**Animation**: `stem_sway`
- **Base Motion**: Organic Z-axis swaying
- **Rotation**: Plant-like movement patterns
- **Enhanced Effects**:
  - Floating green spore particles (25 particles)
  - Warm, hazy lighting
  - Expanding/contracting smoke haze
  - Multi-axis gentle bobbing

```javascript
// Base animation
npc.rotation.z = Math.sin(clock * 1.2) * 0.1;

// Enhanced effects
npc.rotation.x = Math.sin(clock * 0.8) * 0.05;
npc.position.y += Math.sin(clock * 1.5) * 0.008;
```

### 4. Manic Bounce (Ecstasy Pill)
**Animation**: `manic_bounce`
- **Base Motion**: Rapid vertical bouncing
- **Rotation**: Fast Y-axis spinning
- **Enhanced Effects**:
  - Chaotic energy particles (40 particles)
  - Strobing party lights with color cycling
  - Rim glow effect with pulsing
  - Erratic jittery movements

```javascript
// Base animation
npc.position.y += Math.sin(clock * 8) * 0.05;
npc.rotation.y += deltaTime * 2;

// Enhanced effects
npc.position.x += (Math.random() - 0.5) * 0.01;
ecstasyLight.intensity = Math.random() > 0.7 ? 5 : 2;
```

### 5. Robotic Float (Ketamine Capsule)
**Animation**: `robotic_float`
- **Base Motion**: Mechanical floating motion
- **Rotation**: X-axis rotation with phase shifts
- **Enhanced Effects**:
  - Dissociative floating particles (30 particles)
  - Phasing light with vertical movement
  - Multi-axis disconnected rotations
  - Floating motion with phase delays

```javascript
// Base animation
npc.position.y += Math.sin(clock * 3) * 0.02;
npc.rotation.x += deltaTime * 0.5;

// Enhanced effects
npc.rotation.y += Math.sin(clock * 0.4) * deltaTime;
ketamineLight.position.y += Math.sin(clock * 1.8) * 0.5;
```

## Visual Effects System

### Particle Systems
Each character has a custom particle system tailored to their substance type:

| Character | Particle Count | Color | Behavior |
|-----------|---------------|-------|----------|
| Ice | 20 | Light blue (#8bcaff) | Floating crystals |
| Heroin | 15 | White (#ffffff) | Falling powder |
| Weed | 25 | Green (#a7bf80) | Floating spores |
| Ecstasy | 40 | Pink/Purple (#e697ee) | Chaotic energy |
| Ketamine | 30 | Purple (#b1a1f0) | Disconnected drift |

### Lighting Effects
Dynamic lighting systems enhance each character's atmosphere:

- **Ice**: Pulsing crystalline light (intensity: 2 ± 0.5)
- **Heroin**: Flickering sickly light (intensity: 0.8 ± 0.3)  
- **Weed**: Warm hazy light (intensity: 1.2 ± 0.3)
- **Ecstasy**: Strobing party lights (intensity: 2-5, color cycling)
- **Ketamine**: Phasing disorienting light (intensity: 1.5 ± 0.5)

### Environmental Effects
Additional atmospheric elements:

- **Ice**: Ground mist with rotation and opacity animation
- **Weed**: Expanding smoke haze sphere
- **Ecstasy**: Rim glow effect with pulsing scale
- **Heroin/Ketamine**: Particle-only systems for performance

## Technical Implementation

### Core Classes

#### `EnhancedCharacterEffects`
Main class managing all visual effects systems:
```javascript
class EnhancedCharacterEffects {
    constructor() {
        this.particleSystems = new Map();
        this.lightingEffects = new Map();
        this.environmentalEffects = new Map();
    }
}
```

#### Animation Integration
The system integrates with the existing game through:
```javascript
function updateCharacterAnimationWithEffects(npc, characterKey, deltaTime) {
    // Base animation (from enhanced-game.js)
    updateCharacterAnimation(npc, characterKey, deltaTime);
    
    // Enhanced visual effects
    const effects = characterEffects.get(characterKey);
    if (effects?.update) {
        effects.update(deltaTime);
    }
}
```

### Performance Optimization

#### Resource Management
- Automatic cleanup when changing rooms
- Proper disposal of geometries and materials
- Particle system pooling and reuse

#### Performance Monitoring
```javascript
class AnimationPerformanceMonitor {
    update() {
        // Track FPS and log warnings if < 30 FPS
        if (this.fps < 30) {
            console.warn(`Animation performance warning: ${this.fps} FPS`);
        }
    }
}
```

#### Optimization Strategies
- Configurable particle counts
- LOD (Level of Detail) for distant effects  
- Device capability detection
- Effect intensity scaling based on performance

### Integration Points

#### Room Creation
```javascript
function createEnhancedRoomWithEffects(roomIndex) {
    makeRoom(roomIndex); // Base room creation
    
    // Initialize animation system
    window.animationSystem = createIntegratedAnimationSystem();
    
    // Setup character effects
    if (npcs[0]?.characterKey) {
        window.animationSystem.initializeCharacterEffects(
            npcs[0].g, npcs[0].characterKey, room
        );
    }
}
```

#### Frame Loop Integration
```javascript
function enhancedFrameLoop(now) {
    // Standard game loop...
    
    if (playing && inside && npcs[0] && window.animationSystem) {
        window.animationSystem.updateCharacterAnimationWithEffects(
            npcs[0].g, npcs[0].characterKey, dt
        );
    }
    
    renderer.render(scene, camera);
}
```

## Character-Specific Details

### Ice Crystallite Effects
- **Particle Physics**: Floating motion with sine wave variations
- **Light Behavior**: Pulsing intensity simulating crystal facet reflections  
- **Environmental**: Ground mist with slow rotation
- **Materials**: High transmission, low roughness for crystal appearance

### Heroin Bag Effects
- **Particle Physics**: Downward falling motion simulating powder spill
- **Light Behavior**: Weak, flickering light suggesting lethargy
- **Animation**: Sagging scale and swaying motion
- **Materials**: Low opacity, powder-like texture

### Weed Leaf Effects
- **Particle Physics**: Organic floating patterns with sine/cosine movement
- **Light Behavior**: Warm, steady glow with gentle pulsing
- **Environmental**: Expanding haze sphere simulating smoke
- **Materials**: Subsurface scattering for organic leaf appearance

### Ecstasy Pill Effects
- **Particle Physics**: Chaotic, high-energy movement with randomization
- **Light Behavior**: Rapid strobing with HSL color cycling
- **Environmental**: Pulsing rim glow effect
- **Materials**: High glossiness with rim lighting

### Ketamine Capsule Effects  
- **Particle Physics**: Disconnected, phase-shifted floating
- **Light Behavior**: Vertical movement with phasing intensity
- **Animation**: Multi-axis rotations suggesting dissociation
- **Materials**: High metallicness with reflective properties

## Educational Integration

The animation system supports the game's anti-drug education goals by:

1. **Visual Metaphors**: Each animation reflects the substance's effects
   - Ice: Cold, sharp, crystalline (methamphetamine's harsh effects)
   - Heroin: Slumped, drooping (depressant effects)
   - Weed: Swaying, hazy (altered perception)
   - Ecstasy: Manic, chaotic (stimulant effects)
   - Ketamine: Disconnected, floating (dissociative effects)

2. **Atmospheric Reinforcement**: Lighting and particles create mood
   - Threatening atmospheres around each character
   - Visual cues that substances are dangerous
   - Memorable associations through immersive effects

3. **Personality Expression**: Animations give substances character traits
   - Makes abstract concepts more concrete and memorable
   - Creates emotional responses through visual storytelling
   - Reinforces educational messaging through artistic expression

## Future Enhancements

Potential improvements to consider:
- Dynamic animation intensity based on proximity
- Interactive particle systems responding to player actions  
- Advanced shader effects for materials
- Audio-reactive animations
- Accessibility options for motion sensitivity
- VR/AR support for immersive effects