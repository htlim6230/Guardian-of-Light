# Dynamic Proximity-Triggered Dialogue System

This document describes the implementation of the dynamic proximity-triggered dialogue system based on the Python script specifications.

## System Overview

The dialogue system creates immersive character interactions by displaying speech bubbles when the player approaches NPCs within specified trigger distances. Each character has unique personality-driven messages and trigger ranges.

## Character Specifications

### Ice Crystallite
- **Trigger Distance**: 5.0 meters
- **Personality**: Cold, sharp, intense
- **Messages**:
  - Greeting: "Feeling cold yet? Take a peek..."
  - Taunt: "You can't shatter my focus. I'm permanent."
  - Scare: "I'm freezing right through your veins!"

### Heroin Bag
- **Trigger Distance**: 4.5 meters  
- **Personality**: Slumped, heavy, drowsy
- **Messages**:
  - Greeting: "Just rest your eyes for a second..."
  - Taunt: "Too heavy to walk away, aren't you?"
  - Scare: "Boo!! Sleep tight forever..."

### Weed Leaf
- **Trigger Distance**: 6.0 meters
- **Personality**: Relaxed, friendly, casual
- **Messages**:
  - Greeting: "Hey friend, relax... what's the rush?"
  - Taunt: "Just a little harmless chill, right?"
  - Scare: "Boo!! Caught in the fog!"

### Ecstasy Pill
- **Trigger Distance**: 5.5 meters
- **Personality**: Energetic, fast-paced, manic
- **Messages**:
  - Greeting: "Feel the beat! Let's go fast!"
  - Taunt: "Your heart can't keep up with this pace!"
  - Scare: "BOO!! Overload incoming!"

### Ketamine Capsule
- **Trigger Distance**: 5.0 meters
- **Personality**: Dissociative, confusing, detached
- **Messages**:
  - Greeting: "Entering the K-hole... watch your step."
  - Taunt: "Are you floating or falling? Hard to tell."
  - Scare: "Boo!! Your mind is slipping away!"

## Technical Implementation

### Core Functions

#### `checkProximityDialogue(pet, npc, characterKey)`
- Calculates distance between player and NPC
- Compares against character's trigger distance
- Manages speech bubble lifecycle
- Handles message rotation and timing

#### `createSpeechBubble(text, position)`
- Creates HTML5 canvas with rounded bubble design
- Renders text with proper styling
- Converts to THREE.js sprite texture
- Positions above character head

### Speech Bubble Styling
- **Background**: Semi-transparent black (#000000aa)
- **Text Color**: White (#ffffff)
- **Font**: 24px system-ui
- **Border Radius**: 20px rounded corners
- **Canvas Size**: 512×128 pixels
- **Sprite Scale**: 4×1 units in 3D space

### Timing System
- **Initial Display**: Immediate upon entering trigger zone
- **Duration**: 3-7 seconds (randomized)
- **Message Rotation**: Random selection from available types
- **Cleanup**: Automatic removal when leaving range

### Performance Optimizations
- Distance calculations only in active rooms
- Bubble creation throttled by timing system
- Automatic cleanup prevents memory leaks
- Proper disposal of canvas textures

## Integration Points

### Game Loop Integration
```javascript
// In main frame loop
if(inside && npcs[0]){
    updateCharacterAnimation(npcs[0].g, npcs[0].characterKey, dt);
    
    // Check for proximity dialogue
    if(pet && npcs[0].g){
        checkProximityDialogue(pet, npcs[0].g, npcs[0].characterKey);
    }
}
```

### Room Creation Integration
```javascript
// Clear speech bubbles when changing rooms
Object.values(speechBubbles).forEach(bubble => {
    if (bubble.sprite && bubble.sprite.parent) {
        bubble.sprite.parent.remove(bubble.sprite);
    }
});
speechBubbles = {};
```

### Character Manifest Loading
```javascript
async function loadCharacterManifest() {
    try {
        const response = await fetch('generated_characters/characters_manifest.json');
        characterManifest = await response.json();
        return true;
    } catch (error) {
        console.warn('Could not load character manifest, using fallback system:', error);
        return false;
    }
}
```

## Data Structure

### Character Manifest Format
```json
{
    "character_key": {
        "name": "Character Name",
        "dialogue_system": {
            "trigger_distance_meters": 5.0,
            "speech_bubbles": {
                "greeting": "Welcome message",
                "taunt": "Challenging message", 
                "scare": "Frightening message"
            }
        }
    }
}
```

### Runtime Speech Bubble Tracking
```javascript
speechBubbles = {
    "character_key": {
        sprite: THREE.Sprite,      // Rendered speech bubble
        nextChange: number         // Clock time for next rotation
    }
}
```

## Message Design Philosophy

Each character's messages reflect their substance's effects and dangers:

- **Ice**: Aggressive, cold, permanent damage themes
- **Heroin**: Drowsy, heavy, sleep-related dangers  
- **Weed**: Casual normalization, time distortion
- **Ecstasy**: Manic energy, cardiovascular risks
- **Ketamine**: Confusion, dissociation, disorientation

## Educational Integration

The dialogue system serves the game's anti-drug education mission by:
- Personalizing substances as threatening characters
- Showing manipulative messaging ("just relax", "power through")
- Demonstrating how substances can seem friendly initially
- Creating memorable negative associations through "scare" messages

## Future Enhancements

Potential improvements to consider:
- Dynamic message adaptation based on player behavior
- Contextual responses to player actions
- Voice synthesis for audio dialogue
- Multilingual support
- Accessibility features (screen reader support)