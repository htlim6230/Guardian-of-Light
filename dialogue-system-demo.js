/**
 * Proximity-Triggered Dialogue System Demo
 * Showcases the dynamic speech bubble functionality from the Python script specifications
 */

// Test the dialogue system functionality
function demonstrateDialogueSystem() {
    console.log("=== Proximity-Triggered Dialogue System Demo ===");
    
    // Load the character manifest to demonstrate the dialogue specifications
    fetch('generated_characters/characters_manifest.json')
        .then(response => response.json())
        .then(manifest => {
            console.log("\nCharacter Dialogue Specifications:");
            
            Object.entries(manifest).forEach(([characterKey, data]) => {
                console.log(`\n${data.name} (${characterKey}):`);
                console.log(`  Trigger Distance: ${data.dialogue_system.trigger_distance_meters} meters`);
                console.log("  Speech Bubbles:");
                Object.entries(data.dialogue_system.speech_bubbles).forEach(([type, text]) => {
                    console.log(`    ${type}: "${text}"`);
                });
            });
            
            // Demonstrate proximity calculation logic
            console.log("\n=== Proximity Detection Logic ===");
            demonstrateProximityLogic(manifest);
            
            // Demonstrate speech bubble rotation
            console.log("\n=== Speech Bubble Rotation System ===");
            demonstrateSpeechBubbleRotation(manifest);
        })
        .catch(error => {
            console.error("Could not load character manifest:", error);
        });
}

function demonstrateProximityLogic(manifest) {
    // Simulate different distances for each character
    const testDistances = [1, 3, 5, 7, 10];
    
    Object.entries(manifest).forEach(([characterKey, data]) => {
        console.log(`\n${data.name} Proximity Tests:`);
        const triggerDistance = data.dialogue_system.trigger_distance_meters;
        
        testDistances.forEach(distance => {
            const isTriggered = distance < triggerDistance;
            const status = isTriggered ? "✓ TRIGGERED" : "✗ Outside range";
            console.log(`  Distance ${distance}m: ${status} (trigger at <${triggerDistance}m)`);
        });
    });
}

function demonstrateSpeechBubbleRotation(manifest) {
    // Show how speech bubbles rotate through different messages
    const messageTypes = ['greeting', 'taunt', 'scare'];
    
    Object.entries(manifest).forEach(([characterKey, data]) => {
        console.log(`\n${data.name} Speech Rotation:`);
        messageTypes.forEach((type, index) => {
            const message = data.dialogue_system.speech_bubbles[type];
            console.log(`  ${index + 1}. ${type}: "${message}"`);
        });
        console.log("  → Bubbles appear for 3-7 seconds, then rotate randomly");
    });
}

// Advanced dialogue features demonstration
function demonstrateAdvancedFeatures() {
    console.log("\n=== Advanced Dialogue Features ===");
    
    console.log("\nSpeech Bubble Styling:");
    console.log("  - Semi-transparent black background (#000000aa)");
    console.log("  - White text (#ffffff)");
    console.log("  - 24px system font");
    console.log("  - Rounded corners (20px border radius)");
    console.log("  - Positioned 2 units above character head");
    console.log("  - Auto-scales to 4x1 sprite dimensions");
    
    console.log("\nTiming System:");
    console.log("  - Initial display: Immediate on entering trigger zone");
    console.log("  - Duration: 3-7 seconds (randomized)");
    console.log("  - Rotation: Random message selection");
    console.log("  - Cleanup: Auto-removes when leaving trigger zone");
    
    console.log("\nCharacter-Specific Triggers:");
    console.log("  - Ice: 5.0m range (cold, distant personality)");
    console.log("  - Heroin: 4.5m range (slumped, lower energy)");
    console.log("  - Weed: 6.0m range (relaxed, approachable)");
    console.log("  - Ecstasy: 5.5m range (energetic, party atmosphere)");
    console.log("  - Ketamine: 5.0m range (dissociative, confusing)");
}

// Canvas-based speech bubble creation demo
function createDemoSpeechBubble(text) {
    console.log(`\nCreating speech bubble: "${text}"`);
    
    // This simulates the canvas creation process from enhanced-game.js
    const canvasSpecs = {
        width: 512,
        height: 128,
        background: '#000000aa',
        textColor: '#ffffff',
        font: '24px system-ui',
        borderRadius: 20,
        padding: 10
    };
    
    console.log("Canvas specifications:", canvasSpecs);
    console.log("THREE.js Sprite scaling: 4x1 units");
    console.log("Position: 2 units above NPC head");
    
    return canvasSpecs;
}

// Integration with game loop demo
function demonstrateGameIntegration() {
    console.log("\n=== Game Loop Integration ===");
    
    console.log("\nFrame-by-frame process:");
    console.log("1. Check if player is in room with NPC");
    console.log("2. Calculate distance between pet and NPC");
    console.log("3. Compare with character's trigger_distance_meters");
    console.log("4. If within range:");
    console.log("   - Check if bubble exists and timing");
    console.log("   - Remove old bubble if expired");
    console.log("   - Create new bubble with random message");
    console.log("   - Set next change time (3-7 seconds)");
    console.log("5. If outside range:");
    console.log("   - Remove existing bubble");
    console.log("   - Clear bubble tracking data");
    
    console.log("\nPerformance considerations:");
    console.log("- Distance calculations only when in rooms");
    console.log("- Bubble creation throttled by timing system");
    console.log("- Automatic cleanup prevents memory leaks");
    console.log("- Canvas textures properly disposed");
}

// Export demo functions
if (typeof window !== 'undefined') {
    window.DialogueDemo = {
        demonstrateDialogueSystem,
        demonstrateAdvancedFeatures,
        createDemoSpeechBubble,
        demonstrateGameIntegration
    };
    
    // Auto-run demonstration
    console.log("Dialogue System Demo loaded. Run DialogueDemo.demonstrateDialogueSystem() to see full demo.");
}

// Run demonstration if in Node.js environment
if (typeof window === 'undefined') {
    demonstrateDialogueSystem();
    demonstrateAdvancedFeatures();
    demonstrateGameIntegration();
}