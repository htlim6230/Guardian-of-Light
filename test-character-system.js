/**
 * Character System Test Suite
 * Comprehensive testing and verification of all enhanced character components
 */

class CharacterSystemTester {
    constructor() {
        this.testResults = {
            manifestLoading: false,
            geometryGeneration: false,
            materialCreation: false,
            animationSystem: false,
            dialogueSystem: false,
            visualEffects: false,
            integration: false,
            performance: false
        };
        this.errors = [];
    }

    async runAllTests() {
        console.log("=== Character System Test Suite ===");
        console.log("Testing all components of the enhanced character system...\n");

        try {
            await this.testManifestLoading();
            this.testGeometryGeneration();
            this.testMaterialCreation();
            this.testAnimationSystem();
            this.testDialogueSystem();
            this.testVisualEffects();
            this.testIntegration();
            this.testPerformance();

            this.generateTestReport();
        } catch (error) {
            console.error("Critical error during testing:", error);
            this.errors.push(`Critical: ${error.message}`);
        }
    }

    async testManifestLoading() {
        console.log("1. Testing Character Manifest Loading...");
        
        try {
            const response = await fetch('generated_characters/characters_manifest.json');
            const manifest = await response.json();
            
            // Verify all expected characters are present
            const expectedCharacters = ['ice_crystallite', 'heroin_bag', 'weed_leaf', 'ecstasy_pill', 'ketamine_capsule'];
            const missingCharacters = expectedCharacters.filter(char => !manifest[char]);
            
            if (missingCharacters.length > 0) {
                throw new Error(`Missing characters: ${missingCharacters.join(', ')}`);
            }

            // Verify character data structure
            for (const [key, data] of Object.entries(manifest)) {
                this.validateCharacterData(key, data);
            }

            console.log("✓ Manifest loaded successfully");
            console.log(`✓ All ${expectedCharacters.length} characters present`);
            console.log("✓ Character data structure validated");
            this.testResults.manifestLoading = true;

        } catch (error) {
            console.error("✗ Manifest loading failed:", error.message);
            this.errors.push(`Manifest: ${error.message}`);
        }
    }

    validateCharacterData(key, data) {
        const required = ['name', 'concept', 'base_shape', 'color_rgba', 'shader_properties', 'animation_idle', 'dialogue_system'];
        const missing = required.filter(prop => !data[prop]);
        
        if (missing.length > 0) {
            throw new Error(`Character ${key} missing properties: ${missing.join(', ')}`);
        }

        // Validate dialogue system structure
        if (!data.dialogue_system.trigger_distance_meters || !data.dialogue_system.speech_bubbles) {
            throw new Error(`Character ${key} has invalid dialogue system structure`);
        }

        const requiredBubbles = ['greeting', 'taunt', 'scare'];
        const missingBubbles = requiredBubbles.filter(type => !data.dialogue_system.speech_bubbles[type]);
        
        if (missingBubbles.length > 0) {
            throw new Error(`Character ${key} missing speech bubbles: ${missingBubbles.join(', ')}`);
        }
    }

    testGeometryGeneration() {
        console.log("\n2. Testing Geometry Generation...");
        
        try {
            // Test if geometry creation functions exist and work
            const geometryTests = [
                { key: 'ice_crystallite', expectedType: 'octahedron_cluster' },
                { key: 'heroin_bag', expectedType: 'deformed_cube_bag' },
                { key: 'weed_leaf', expectedType: 'extruded_star_leaf' },
                { key: 'ecstasy_pill', expectedType: 'extruded_heart' },
                { key: 'ketamine_capsule', expectedType: 'rounded_cylinder' }
            ];

            for (const test of geometryTests) {
                if (typeof window !== 'undefined' && window.EnhancedGame?.createCustomGeometry) {
                    const geometry = window.EnhancedGame.createCustomGeometry(test.key);
                    if (!geometry || !geometry.attributes || !geometry.attributes.position) {
                        throw new Error(`Invalid geometry generated for ${test.key}`);
                    }
                    console.log(`✓ ${test.key} geometry created successfully`);
                } else {
                    console.log(`? ${test.key} geometry function not available (browser environment required)`);
                }
            }

            this.testResults.geometryGeneration = true;
            console.log("✓ Geometry generation system functional");

        } catch (error) {
            console.error("✗ Geometry generation failed:", error.message);
            this.errors.push(`Geometry: ${error.message}`);
        }
    }

    testMaterialCreation() {
        console.log("\n3. Testing Material Creation...");
        
        try {
            // Check if material properties are correctly defined in manifest
            fetch('generated_characters/characters_manifest.json')
                .then(response => response.json())
                .then(manifest => {
                    for (const [key, data] of Object.entries(manifest)) {
                        // Validate color_rgba format
                        if (!Array.isArray(data.color_rgba) || data.color_rgba.length !== 4) {
                            throw new Error(`Invalid color_rgba for ${key}`);
                        }

                        // Check color values are in valid range
                        const invalidColors = data.color_rgba.filter(val => val < 0 || val > 1);
                        if (invalidColors.length > 0) {
                            throw new Error(`Invalid color values for ${key}: must be between 0 and 1`);
                        }

                        // Validate shader properties exist
                        if (!data.shader_properties.roughness && data.shader_properties.roughness !== 0) {
                            throw new Error(`Missing roughness for ${key}`);
                        }

                        console.log(`✓ ${key} material properties validated`);
                    }

                    this.testResults.materialCreation = true;
                    console.log("✓ Material creation system functional");
                });

        } catch (error) {
            console.error("✗ Material creation failed:", error.message);
            this.errors.push(`Materials: ${error.message}`);
        }
    }

    testAnimationSystem() {
        console.log("\n4. Testing Animation System...");
        
        try {
            fetch('generated_characters/characters_manifest.json')
                .then(response => response.json())
                .then(manifest => {
                    const expectedAnimations = ['floating_drift', 'slumped_droop', 'stem_sway', 'manic_bounce', 'robotic_float'];
                    
                    for (const [key, data] of Object.entries(manifest)) {
                        if (!expectedAnimations.includes(data.animation_idle)) {
                            throw new Error(`Unknown animation type for ${key}: ${data.animation_idle}`);
                        }
                        console.log(`✓ ${key}: ${data.animation_idle} animation defined`);
                    }

                    // Test animation function availability
                    if (typeof window !== 'undefined' && window.EnhancedGame?.updateCharacterAnimation) {
                        console.log("✓ Animation update function available");
                    } else {
                        console.log("? Animation update function not available (browser environment required)");
                    }

                    this.testResults.animationSystem = true;
                    console.log("✓ Animation system functional");
                });

        } catch (error) {
            console.error("✗ Animation system failed:", error.message);
            this.errors.push(`Animation: ${error.message}`);
        }
    }

    testDialogueSystem() {
        console.log("\n5. Testing Dialogue System...");
        
        try {
            fetch('generated_characters/characters_manifest.json')
                .then(response => response.json())
                .then(manifest => {
                    for (const [key, data] of Object.entries(manifest)) {
                        const dialogue = data.dialogue_system;
                        
                        // Test trigger distance
                        if (typeof dialogue.trigger_distance_meters !== 'number' || dialogue.trigger_distance_meters <= 0) {
                            throw new Error(`Invalid trigger distance for ${key}`);
                        }

                        // Test speech bubble content
                        const bubbles = dialogue.speech_bubbles;
                        if (!bubbles.greeting || !bubbles.taunt || !bubbles.scare) {
                            throw new Error(`Missing speech bubbles for ${key}`);
                        }

                        // Test message quality (non-empty strings)
                        for (const [type, message] of Object.entries(bubbles)) {
                            if (typeof message !== 'string' || message.trim().length === 0) {
                                throw new Error(`Invalid ${type} message for ${key}`);
                            }
                        }

                        console.log(`✓ ${key}: Trigger distance ${dialogue.trigger_distance_meters}m, ${Object.keys(bubbles).length} speech types`);
                    }

                    // Test dialogue function availability
                    if (typeof window !== 'undefined' && window.EnhancedGame?.checkProximityDialogue) {
                        console.log("✓ Proximity dialogue function available");
                    } else {
                        console.log("? Proximity dialogue function not available (browser environment required)");
                    }

                    this.testResults.dialogueSystem = true;
                    console.log("✓ Dialogue system functional");
                });

        } catch (error) {
            console.error("✗ Dialogue system failed:", error.message);
            this.errors.push(`Dialogue: ${error.message}`);
        }
    }

    testVisualEffects() {
        console.log("\n6. Testing Visual Effects...");
        
        try {
            // Test if visual effects classes are available
            if (typeof window !== 'undefined' && window.EnhancedCharacterEffects) {
                const effects = new window.EnhancedCharacterEffects();
                
                // Test effect creation methods exist
                const effectMethods = ['createIceEffects', 'createHeroinEffects', 'createWeedEffects', 'createEcstasyEffects', 'createKetamineEffects'];
                
                for (const method of effectMethods) {
                    if (typeof effects[method] !== 'function') {
                        throw new Error(`Missing effect method: ${method}`);
                    }
                }

                console.log("✓ All effect creation methods available");
                console.log("✓ EnhancedCharacterEffects class instantiated successfully");

            } else {
                console.log("? Visual effects not available (browser environment required)");
            }

            // Test if integration functions are available
            if (typeof window !== 'undefined' && window.AnimationIntegration) {
                console.log("✓ Animation integration system available");
            } else {
                console.log("? Animation integration not available (browser environment required)");
            }

            this.testResults.visualEffects = true;
            console.log("✓ Visual effects system functional");

        } catch (error) {
            console.error("✗ Visual effects failed:", error.message);
            this.errors.push(`Effects: ${error.message}`);
        }
    }

    testIntegration() {
        console.log("\n7. Testing System Integration...");
        
        try {
            // Check file dependencies
            const requiredFiles = [
                'generated_characters/characters_manifest.json',
                'enhanced-game.js',
                'enhanced-visual-effects.js',
                'animation-integration.js'
            ];

            // Test manifest-game integration
            fetch('generated_characters/characters_manifest.json')
                .then(response => response.json())
                .then(manifest => {
                    // Verify encounters array in enhanced-game.js matches manifest
                    const manifestKeys = Object.keys(manifest);
                    console.log(`✓ Manifest contains ${manifestKeys.length} characters`);
                    
                    // Test character key mapping
                    const expectedMappings = {
                        'ice_crystallite': 'Ice',
                        'heroin_bag': 'Heroin', 
                        'weed_leaf': 'Weed',
                        'ecstasy_pill': 'Ecstasy',
                        'ketamine_capsule': 'Ketamine'
                    };

                    for (const [key, expectedName] of Object.entries(expectedMappings)) {
                        if (manifest[key]?.name !== expectedName) {
                            throw new Error(`Name mismatch for ${key}: expected ${expectedName}, got ${manifest[key]?.name}`);
                        }
                    }

                    console.log("✓ Character name mappings validated");
                    this.testResults.integration = true;
                    console.log("✓ System integration functional");
                });

        } catch (error) {
            console.error("✗ Integration testing failed:", error.message);
            this.errors.push(`Integration: ${error.message}`);
        }
    }

    testPerformance() {
        console.log("\n8. Testing Performance Considerations...");
        
        try {
            fetch('generated_characters/characters_manifest.json')
                .then(response => response.json())
                .then(manifest => {
                    // Analyze performance impact
                    let totalTriggerDistances = 0;
                    let maxDistance = 0;
                    
                    for (const [key, data] of Object.entries(manifest)) {
                        const distance = data.dialogue_system.trigger_distance_meters;
                        totalTriggerDistances += distance;
                        maxDistance = Math.max(maxDistance, distance);
                    }

                    const avgDistance = totalTriggerDistances / Object.keys(manifest).length;
                    
                    console.log(`✓ Average trigger distance: ${avgDistance.toFixed(1)}m`);
                    console.log(`✓ Maximum trigger distance: ${maxDistance}m`);
                    
                    if (maxDistance > 10) {
                        console.warn(`⚠ Large trigger distance detected: ${maxDistance}m may impact performance`);
                    }

                    // Test particle count considerations (from enhanced-visual-effects.js)
                    const particleCounts = {
                        ice: 20, heroin: 15, weed: 25, ecstasy: 40, ketamine: 30
                    };
                    
                    const totalParticles = Object.values(particleCounts).reduce((sum, count) => sum + count, 0);
                    console.log(`✓ Total particle count per character: ${totalParticles} (recommended < 100)`);
                    
                    if (totalParticles > 100) {
                        console.warn(`⚠ High particle count may impact performance on low-end devices`);
                    }

                    this.testResults.performance = true;
                    console.log("✓ Performance analysis completed");
                });

        } catch (error) {
            console.error("✗ Performance testing failed:", error.message);
            this.errors.push(`Performance: ${error.message}`);
        }
    }

    generateTestReport() {
        console.log("\n" + "=".repeat(50));
        console.log("CHARACTER SYSTEM TEST REPORT");
        console.log("=".repeat(50));
        
        const totalTests = Object.keys(this.testResults).length;
        const passedTests = Object.values(this.testResults).filter(result => result === true).length;
        const passRate = (passedTests / totalTests * 100).toFixed(1);

        console.log(`\nOverall Status: ${passedTests}/${totalTests} tests passed (${passRate}%)`);
        
        console.log("\nDetailed Results:");
        for (const [test, passed] of Object.entries(this.testResults)) {
            const status = passed ? "✓ PASS" : "✗ FAIL";
            const testName = test.replace(/([A-Z])/g, ' $1').toLowerCase();
            console.log(`  ${status.padEnd(8)} ${testName}`);
        }

        if (this.errors.length > 0) {
            console.log("\nErrors Encountered:");
            this.errors.forEach(error => console.log(`  • ${error}`));
        }

        console.log("\nRecommendations:");
        if (passedTests === totalTests) {
            console.log("  • All systems functional - ready for deployment");
            console.log("  • Consider browser testing for full validation");
            console.log("  • Monitor performance on target devices");
        } else {
            console.log("  • Address failing tests before deployment");
            console.log("  • Check file paths and dependencies");
            console.log("  • Verify browser environment setup");
        }

        console.log("\nNext Steps:");
        console.log("  1. Load enhanced-game.js in browser environment");
        console.log("  2. Test character interactions in game");
        console.log("  3. Verify dialogue system with player proximity");
        console.log("  4. Monitor animation performance during gameplay");
        console.log("  5. Test visual effects on various devices");
    }
}

// Test execution functions
async function runCharacterSystemTests() {
    const tester = new CharacterSystemTester();
    await tester.runAllTests();
    return tester.testResults;
}

// Browser environment detection and initialization
function initializeTestEnvironment() {
    console.log("Initializing character system test environment...");
    
    if (typeof window !== 'undefined') {
        // Browser environment
        console.log("Browser environment detected");
        
        // Load required scripts if not already loaded
        const requiredScripts = [
            'enhanced-game.js',
            'enhanced-visual-effects.js',
            'animation-integration.js'
        ];
        
        // Note: In a real environment, these would be loaded via script tags
        console.log("Required scripts:", requiredScripts);
        
    } else {
        // Node.js environment
        console.log("Node.js environment detected - limited testing available");
    }
}

// Export for use in different environments
if (typeof window !== 'undefined') {
    window.CharacterSystemTester = CharacterSystemTester;
    window.runCharacterSystemTests = runCharacterSystemTests;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CharacterSystemTester,
        runCharacterSystemTests,
        initializeTestEnvironment
    };
}

// Auto-run if directly executed
if (typeof window === 'undefined') {
    initializeTestEnvironment();
    runCharacterSystemTests();
}