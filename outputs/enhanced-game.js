// Enhanced Guardians of Light with improved character system
'use strict';

const $=id=>document.getElementById(id), green=0x27c1bb;
const sourceBase='https://www.cnb.gov.sg/singapore-drug-situation/drugs--psychoactive-substances--and-inhalants/';

// Load character manifest and enhanced encounter data
let characterManifest = null;
let enhancedCharacterGeometries = {};
let speechBubbles = {};

// Enhanced encounters array with character manifest integration
const encounters=[
{name:'Ice',drug:'Methamphetamine',slug:'methamphetamine',place:'Frost junction',x:-14,z:15,color:0x8bcaff,
 characterKey:'ice_crystallite',
 qs:[
['Ice promises to help you power through. What is a real risk?',['Better long-term sleep','Dependence and serious heart problems','A reliable study boost'],1,'Methamphetamine is highly addictive and can harm the heart and brain. A promised boost can come with serious costs.'],
['Which change can methamphetamine cause?',['Anxiety and difficulty sleeping','Protection from stress','Permanently sharper memory'],0,'Anxiety and insomnia are possible effects. Feeling wired is not the same as being well.'],
['Your owner misses meals and your evening walks. Who can be affected by drug use?',['Only the person using it','Nobody if it stays secret','Their loved ones and pets too'],2,'When health and routines are disrupted, people and pets who depend on someone can be affected too.'] ]},
{name:'Heroin',drug:'Heroin',slug:'heroin',place:'Hollow lane',x:14,z:15,color:0xe6a889,
 characterKey:'heroin_bag',
 qs:[
['What is a serious danger of heroin?',['Dangerously slowed breathing','Stronger lungs','Improved concentration'],0,'Heroin can slow breathing and heart rate. It is a powerful, highly addictive drug.'],
['Heroin says, "I will help you get things done." What is the reality?',['It guarantees energy','It can cause tiredness and poor concentration','It makes all responsibilities easier'],1,'Tiredness and difficulty concentrating can interfere with everyday responsibilities.'],
['A friend is struggling with substance use. What is a caring response?',['Shame them in public','Promise to hide everything forever','Listen and help them seek professional support'],2,'Support starts with listening without judgement. A trusted adult, counsellor or healthcare professional can help.'] ]},
{name:'Weed',drug:'Cannabis',slug:'cannabis',place:'Overgrown square',x:-14,z:-5,color:0xa7bf80,
 characterKey:'weed_leaf',
 qs:[
['"It is a plant, so it is harmless." Which reply is accurate?',['Cannabis can impair memory and coordination','Natural substances are always safe','Cannabis cannot lead to addiction'],0,'Cannabis can impair short-term memory and coordination, and can lead to addiction. Natural does not mean risk-free.'],
['Why can cannabis make crossing a busy road more dangerous?',['It makes traffic disappear','It improves balance','It can impair coordination and perception'],2,'Impaired coordination can increase the risk of injury. That can affect both you and anyone depending on you.'],
['You feel pressured to try cannabis. Which choice protects your boundaries?',['Take it to fit in','Say no, leave, and contact someone you trust','Let someone decide for you'],1,'You can refuse without debating. Moving to a safer place and reaching out for support are valid choices.'] ]},
{name:'Ecstasy',drug:'Ecstasy / MDMA',slug:'ecstasy',place:'Neon arcade',x:14,z:-5,color:0xe697ee,
 characterKey:'ecstasy_pill',
 qs:[
['Can a pill's logo or colour tell you it is safe?',['Yes, if it looks familiar','No; contents can be unpredictable','Yes, if a friend recognises it'],1,'Ecstasy tablets may contain mixtures of drugs. A familiar appearance does not prove what is inside.'],
['Which is a possible effect of ecstasy?',['Increased heart rate and impaired coordination','Guaranteed focus','Protection from organ damage'],0,'Ecstasy can increase heart rate and blood pressure and impair thinking and coordination.'],
['How might substance use affect someone's family?',['It never affects relationships','It automatically builds trust','It can bring worry and disrupt shared responsibilities'],2,'Loved ones can experience worry and disrupted routines. Seeking help can be a step toward rebuilding trust.'] ]},
{name:'Ketamine',drug:'Ketamine',slug:'ketamine',place:'Echo crossing',x:-14,z:-25,color:0xb1a1f0,
 characterKey:'ketamine_capsule',
 qs:[
['Outside supervised medical use, ketamine misuse can…',['Make judgement more accurate','Cause confusion and distorted perception','Guarantee emotional wellbeing'],1,'Ketamine has medical uses, but misuse can distort perception and judgement and cause confusion.'],
['Which health problem is linked to ketamine misuse?',['Urinary and bladder problems','Stronger bladder control','Improved memory'],0,'Ketamine misuse can cause urinary and bladder problems, as well as other harms.'],
['What does protecting your loved ones include?',['Handling every problem alone','Keeping serious struggles secret','Seeking support early and accepting help'],2,'You do not have to solve substance use problems alone. Recovery and support are possible; asking for help is a strong step.'] ]}
];

// Core game variables
let city,room,roomIndex=-1,active=0,completed=new Set(),progress=[0,0,0,0,0],outsidePosition=new THREE.Vector3(),pins=[],roomObjects=[],fogSprites=[],motionReduced=matchMedia('(prefers-reduced-motion: reduce)').matches,iceAngle=0,iceNext=0,toastUntil=0,roomLight,attackOrb;
let scene,camera,renderer,pet,flame,flameMat,flameLight;let petType='dog',mode='intro',hp=5,stage=0,qIndex=0,hits=0,correct=0,last=0,clock=0,attack=0;const keys={},obstacles=[],npcs=[],trail=[],embers=[];let previousFocus=null;

const sites=[{x:-14,z:15},{x:14,z:15},{x:-14,z:-5},{x:14,z:-5},{x:-14,z:-25}],home={x:14,z:-25};
const roomNames=['Rush chamber','The marked parlour','The hourless room','The clouded ballroom','The detached hall'];
const roomNotes=[
 'Ice: a trembling room and shifting viewpoint symbolise an intense rush. Switch on reduced motion at any time.',
 'Heroin: green-purple wall markings symbolise injection-related injury. Marks alone cannot identify substance use.',
 'Weed: melting clocks symbolise altered time perception. Cannabis can also affect memory and coordination.',
 'Ecstasy: drifting fog symbolises visual disturbance. Keep your guardian in view and follow the floor lights.',
 'Ketamine: slowed movement symbolises dissociation—feeling detached from the body or surroundings.'
];

// Enhanced character system functions
async function loadCharacterManifest() {
    try {
        const response = await fetch('generated_characters/characters_manifest.json');
        characterManifest = await response.json();
        console.log('Character manifest loaded:', characterManifest);
        return true;
    } catch (error) {
        console.warn('Could not load character manifest, using fallback system:', error);
        return false;
    }
}

function createCustomGeometry(characterKey) {
    const charData = characterManifest[characterKey];
    if (!charData) return new THREE.SphereGeometry(.48, 12, 8);
    
    switch (charData.base_shape) {
        case 'octahedron_cluster':
            return createOctahedronCluster();
        case 'deformed_cube_bag':
            return createDeformedCubeBag();
        case 'extruded_star_leaf':
            return createExtrudedStarLeaf();
        case 'extruded_heart':
            return createExtrudedHeart();
        case 'rounded_cylinder':
            return createRoundedCylinder();
        default:
            return new THREE.SphereGeometry(.48, 12, 8);
    }
}

function createOctahedronCluster() {
    const geometry = new THREE.OctahedronGeometry(.6, 0);
    // Add some crystal-like protrusions
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const scale = 1 + Math.random() * 0.3;
        vertices[i] *= scale;
        vertices[i + 1] *= scale;
        vertices[i + 2] *= scale;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
}

function createDeformedCubeBag() {
    const geometry = new THREE.BoxGeometry(.8, .6, .5, 4, 4, 4);
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        // Deform to create bag-like slumping
        if (vertices[i + 1] > 0) {
            vertices[i + 1] *= 0.7 + Math.random() * 0.3;
            vertices[i] += (Math.random() - 0.5) * 0.2;
            vertices[i + 2] += (Math.random() - 0.5) * 0.2;
        }
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
}

function createExtrudedStarLeaf() {
    const shape = new THREE.Shape();
    const points = [];
    for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const radius = i % 2 === 0 ? 0.6 : 0.3;
        points.push(new THREE.Vector2(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        ));
    }
    shape.setFromPoints(points);
    return new THREE.ExtrudeGeometry(shape, {
        depth: 0.1,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.02,
        bevelThickness: 0.02
    });
}

function createExtrudedHeart() {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.4);
    shape.bezierCurveTo(0, -0.4, -0.3, -0.1, -0.3, 0.1);
    shape.bezierCurveTo(-0.3, 0.3, -0.1, 0.3, 0, 0.2);
    shape.bezierCurveTo(0.1, 0.3, 0.3, 0.3, 0.3, 0.1);
    shape.bezierCurveTo(0.3, -0.1, 0, -0.4, 0, -0.4);
    return new THREE.ExtrudeGeometry(shape, {
        depth: 0.2,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.02,
        bevelThickness: 0.02
    });
}

function createRoundedCylinder() {
    return new THREE.CapsuleGeometry(.3, .8, 8, 16);
}

function createEnhancedMaterial(characterKey) {
    const charData = characterManifest?.[characterKey];
    if (!charData) return mat(encounters.find(e => e.characterKey === characterKey)?.color || 0xffffff);
    
    const color = new THREE.Color(
        charData.color_rgba[0],
        charData.color_rgba[1], 
        charData.color_rgba[2]
    );
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: charData.shader_properties.roughness || 0.8,
        metalness: charData.shader_properties.metallic || 0,
        transparent: charData.color_rgba[3] < 1,
        opacity: charData.color_rgba[3],
        emissive: color,
        emissiveIntensity: 0.3
    });
    
    return material;
}

// Animation system
function updateCharacterAnimation(npc, characterKey, deltaTime) {
    if (!characterManifest?.[characterKey]) return;
    
    const animationType = characterManifest[characterKey].animation_idle;
    
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
}

// Speech bubble system
function createSpeechBubble(text, position) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Background bubble
    ctx.fillStyle = '#000000aa';
    ctx.roundRect(10, 10, 492, 108, 20);
    ctx.fill();
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(text, 256, 70);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(4, 1, 1);
    sprite.position.copy(position);
    sprite.position.y += 2;
    
    return sprite;
}

function checkProximityDialogue(pet, npc, characterKey) {
    if (!characterManifest?.[characterKey]) return null;
    
    const distance = pet.position.distanceTo(npc.position);
    const triggerDistance = characterManifest[characterKey].dialogue_system.trigger_distance_meters;
    
    if (distance < triggerDistance) {
        const dialogues = characterManifest[characterKey].dialogue_system.speech_bubbles;
        const currentBubble = speechBubbles[characterKey];
        
        if (!currentBubble || currentBubble.nextChange < clock) {
            // Remove old bubble
            if (currentBubble?.sprite) {
                room.remove(currentBubble.sprite);
            }
            
            // Create new bubble
            const messages = ['greeting', 'taunt', 'scare'];
            const messageType = messages[Math.floor(Math.random() * messages.length)];
            const text = dialogues[messageType];
            
            if (text) {
                const sprite = createSpeechBubble(text, npc.position);
                room.add(sprite);
                
                speechBubbles[characterKey] = {
                    sprite: sprite,
                    nextChange: clock + 3 + Math.random() * 4
                };
            }
        }
        return true;
    } else if (speechBubbles[characterKey]?.sprite) {
        // Remove bubble when too far
        room.remove(speechBubbles[characterKey].sprite);
        delete speechBubbles[characterKey];
    }
    return false;
}

// Enhanced NPC creation function
function createEnhancedNPC(i) {
    const encounter = encounters[i];
    const characterKey = encounter.characterKey;
    
    const npc = new THREE.Group();
    npc.position.set(0, 0, -4.8);
    
    // Base body (cone)
    mesh(new THREE.ConeGeometry(.8, 1.9, 7), mat(0x283347), npc, 0, 1, 0);
    
    // Enhanced character head using custom geometry
    const headGeometry = createCustomGeometry(characterKey);
    const headMaterial = createEnhancedMaterial(characterKey);
    const head = mesh(headGeometry, headMaterial, npc, 0, 1.95, 0);
    
    // Eyes
    for (const x of [-.18, .18]) sphere(npc, .06, 0xffe1bc, x, 2.02, .43);
    
    // Arms with character-specific coloring
    for (const x of [-.75, .75]) sphere(npc, .2, encounter.color, x, 1.1, .1);
    
    // Character name label
    label(encounter.name, npc, 0, 3, 0);
    
    return npc;
}

// Standard utility functions
const treeMaterials=[0x4d8064,0x6c9766,0x87a974];
function mat(c,em=0){return new THREE.MeshStandardMaterial({color:c,roughness:.8,emissive:c,emissiveIntensity:em})}
function mesh(g,m,parent,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function sphere(p,r,c,x,y,z,sx=1,sy=1,sz=1){const o=mesh(new THREE.SphereGeometry(r,14,10),mat(c),p,x,y,z);o.scale.set(sx,sy,sz);return o}
function block(parent,w,h,d,c,x,y,z,em=0){const m=mesh(new THREE.BoxGeometry(w,h,d),mat(c,em),parent,x,y,z);return m}

function label(text,p,x,y,z,color='#c7f4ee'){const c=document.createElement('canvas');c.width=512;c.height=100;const a=c.getContext('2d');a.fillStyle='#071724dd';a.roundRect(5,10,502,80,20);a.fill();a.font='600 30px system-ui';a.textAlign='center';a.fillStyle=color;a.fillText(text,256,62);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(5.4,1.05,1);s.position.set(x,y,z);p.add(s);return s}

// Game initialization with enhanced character system
async function init(){
    // Load character manifest
    await loadCharacterManifest();
    
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0x87abad);
    scene.fog=new THREE.FogExp2(0x87abad,.006);
    camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,200);
    renderer=new THREE.WebGLRenderer({canvas:$('world'),antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setSize(innerWidth,innerHeight);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    
    scene.add(new THREE.HemisphereLight(0xcde6ed,0x77755b,2.3));
    const sun=new THREE.DirectionalLight(0xffe6bd,3);
    sun.position.set(-22,38,22);
    sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);
    Object.assign(sun.shadow.camera,{left:-48,right:48,top:48,bottom:-48,far:120});
    scene.add(sun);
    
    makeCity();
    makePet('dog');
    
    flame=new THREE.Group();
    scene.add(flame);
    flameMat=mat(green,.65);
    mesh(new THREE.SphereGeometry(.52,18,12),flameMat,flame).scale.set(1,1.1,.85);
    for(const [x,y,h] of [[0,.65,.9],[-.32,.36,.6],[.31,.35,.72]])mesh(new THREE.ConeGeometry(.23,h,12),flameMat,flame,x,y,0).rotation.z=-x;
    for(const x of [-.18,.18])sphere(flame,.06,0x082b31,x,.06,.46);
    const smile=mesh(new THREE.TorusGeometry(.11,.025,6,16,Math.PI),mat(0x082b31),flame,0,-.13,.48);smile.rotation.z=Math.PI;
    flameLight=new THREE.PointLight(green,7,8);
    flame.add(flameLight);
    
    attackOrb=mesh(new THREE.SphereGeometry(.24,10,8),mat(0xc178cb,1),scene);
    attackOrb.visible=false;
    camera.position.set(37,40,55);
    
    $('motion').setAttribute('aria-pressed',motionReduced);
    $('motion').textContent='Motion: '+(motionReduced?'reduced':'full');
    $('loading').hidden=true;
    
    requestAnimationFrame(frame);
}

function makeCity(){
    city=new THREE.Group();
    scene.add(city);
    block(city,76,.6,88,0x6c956f,0,-.4,-4);
    sites.forEach((e,i)=>house(e.x,e.z,i));
    house(home.x,home.z);
}

function house(x,z,i=-1){
    const h=5.8,cols=[0x7c9da8,0xb79c91,0x92a38b,0xb59ab2,0x9d9cbd],c=i<0?0xdbbc89:cols[i];
    block(city,11,.4,12,0xa7b6a5,x,.2,z);
    block(city,8,h,7,c,x,h/2+.4,z);
    
    if(i>=0){
        const pin=mesh(new THREE.SphereGeometry(.65,12,8),mat(encounters[i].color,.45),city,x,h+2.5,z);
        label(encounters[i].name,city,x,h+4.2,z);
        pins.push({g:pin,head:pin,baseY:h+2});
    } else {
        label('HOME · 5 KEY PIECES',city,x,h+3.4,z,'#ffe3a5');
    }
}

function makePet(type){
    if(pet)scene.remove(pet);
    pet=new THREE.Group();
    scene.add(pet);
    
    const bird=type==='bird',pig=type==='pig',cat=type==='cat';
    const c=bird?0xb9c5ca:pig?0xbc875b:cat?0xe6e0cc:0xbd8351;
    
    sphere(pet,.7,c,0,.68,0);
    sphere(pet,.47,c,0,1.12,.52);
    sphere(pet,.27,0xebd2ac,0,.99,.87);
    
    for(const x of [-.2,.2]){
        sphere(pet,.067,0x101c2c,x,1.23,.92);
    }
    
    const scarf=mesh(new THREE.TorusGeometry(.32,.10,6,20),mat(green),pet,0,.89,.45);
    scarf.rotation.x=Math.PI/2;
    pet.position.set(0,0,25);
}

function makeRoom(i){
    if(room){
        scene.remove(room);
        // Clear speech bubbles
        Object.values(speechBubbles).forEach(bubble => {
            if (bubble.sprite && bubble.sprite.parent) {
                bubble.sprite.parent.remove(bubble.sprite);
            }
        });
        speechBubbles = {};
    }
    
    roomObjects=[];
    room=new THREE.Group();
    scene.add(room);
    
    // Standard room setup
    block(room,18,7,.35,0x444,0,3.5,-8);
    block(room,18,.3,18,0x493f3f,0,-.2,0);
    
    // Create enhanced NPC
    const npc = createEnhancedNPC(i);
    room.add(npc);
    npcs[0]={g:npc,characterKey:encounters[i].characterKey};
    
    roomLight=new THREE.PointLight(encounters[i].color,28,19);
    roomLight.position.set(3,5,0);
    room.add(roomLight);
}

function frame(now){
    requestAnimationFrame(frame);
    const dt=Math.min((now-last)/1000,.05)||.016;
    last=now;
    clock+=dt;
    
    const playing=mode==='play',inside=roomIndex>=0;
    
    if(playing && inside && npcs[0]){
        updateCharacterAnimation(npcs[0].g, npcs[0].characterKey, dt);
        
        // Check for proximity dialogue
        if(pet && npcs[0].g){
            checkProximityDialogue(pet, npcs[0].g, npcs[0].characterKey);
        }
    }
    
    // Render the scene
    renderer.render(scene,camera);
}

// Export the enhanced game system
window.EnhancedGame = {
    init,
    loadCharacterManifest,
    createCustomGeometry,
    updateCharacterAnimation,
    checkProximityDialogue
};