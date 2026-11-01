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

// Continue with remaining game functions...
// [The rest of the game code would continue here with enhanced room creation, etc.]

// Export the enhanced game system
window.EnhancedGame = {
    init,
    loadCharacterManifest,
    createCustomGeometry,
    updateCharacterAnimation,
    checkProximityDialogue
};

// Enhanced room creation with new character system
function makeRoom(i){
    if(room){
        scene.remove(room);
        room.traverse(o=>{
            if(o.geometry)o.geometry.dispose();
            if(o.material){
                if(o.material.map)o.material.map.dispose();
                o.material.dispose();
            }
        });
    }
    
    // Clear speech bubbles
    Object.values(speechBubbles).forEach(bubble => {
        if (bubble.sprite && bubble.sprite.parent) {
            bubble.sprite.parent.remove(bubble.sprite);
        }
    });
    speechBubbles = {};
    
    roomObjects=[];
    fogSprites=[];
    room=new THREE.Group();
    scene.add(room);
    
    // Standard room setup
    const wallmat=new THREE.MeshStandardMaterial({map:wallTexture(i),roughness:1});
    mesh(new THREE.BoxGeometry(18,7,.35),wallmat,room,0,3.5,-8);
    mesh(new THREE.BoxGeometry(.3,7,18),wallmat.clone(),room,-9,3.5,0);
    mesh(new THREE.BoxGeometry(.3,7,18),wallmat.clone(),room,9,3.5,0);
    block(room,18,.3,18,0x493f3f,0,-.2,0);
    
    for(let z=-8;z<9;z+=.8)block(room,18,.02,.035,0x75615b,0,-.035,z);
    block(room,18,.25,.3,0x62736f,0,6.7,-7.7);
    block(room,18,.16,.25,0x778781,0,.1,-7.7);
    
    // Room furniture and decorations
    block(room,7,.04,8,0x284d51,0,0,0);
    block(room,7.3,.03,.13,0x9a9475,0,.035,4);
    block(room,7.3,.03,.13,0x9a9475,0,.035,-4);
    block(room,4.7,.55,1.6,0x42565c,-3,.6,-6);
    block(room,4.8,1.4,.42,0x374c56,-3,1.3,-6.65);
    
    for(const x of [-5.5,-.5])block(room,.5,.8,1.9,0x526467,x,.95,-6);
    for(const x of [-4.3,-2.8,-1.3])block(room,1.35,.18,1.3,0x52626a,x,.98,-5.9);
    
    // Character-specific room decorations
    if(i===0){
        // Ice room - crystalline structures
        for(const x of [-7,7]){
            const crystal = mesh(new THREE.OctahedronGeometry(.7,0),mat(0x7cbede,.7),room,x,1.9,-2);
            crystal.rotation.y = clock * 0.5;
            roomObjects.push(crystal);
            block(room,.1,4,.1,0x73bbcf,x,2,-7,.6);
        }
    }
    
    if(i===2){
        // Weed room - melting clocks
        meltingClock(-6,4.9,-7.5,1,-.2);
        meltingClock(-2.2,4.6,-7.5,.8,.2);
        meltingClock(.3,2.4,-6.9,.8,-.4);
        meltingClock(6.7,3.7,-7.45,1.15,.3);
        meltingClock(4.8,2,-5.6,.75,-.5);
        meltingClock(-5,1.2,-2,.8,.6);
    }
    
    if(i===3){
        // Ecstasy room - fog sprites
        const c=document.createElement('canvas');
        c.width=c.height=128;
        const a=c.getContext('2d'),grad=a.createRadialGradient(64,64,1,64,64,64);
        grad.addColorStop(0,'#ccd6ee66');
        grad.addColorStop(1,'#ccd6ee00');
        a.fillStyle=grad;
        a.fillRect(0,0,128,128);
        const tx=new THREE.CanvasTexture(c);
        
        for(let n=0;n<18;n++){
            const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,opacity:.48,depthWrite:false}));
            s.position.set((n%6-2.5)*3,1+(n%3)*.8,Math.floor(n/6)*4-5);
            s.scale.set(6,3.5,1);
            room.add(s);
            fogSprites.push(s);
        }
    }
    
    if(i===4){
        // Ketamine room - floating rings
        for(let n=0;n<7;n++){
            let o=mesh(new THREE.TorusGeometry(1+n*.15,.025,4,48),mat(0x9a9bdd,.35),room,0,.06+n*.005,-2);
            o.rotation.x=Math.PI/2;
            roomObjects.push(o);
        }
    }
    
    // Exit portal
    const exit=mesh(new THREE.TorusGeometry(1,.065,6,32),mat(green,1),room,0,.07,7);
    exit.rotation.x=Math.PI/2;
    label('EXIT TO CITY',room,0,1,7);
    for(let z=4;z>-5;z-=1.5)sphere(room,.06,green,1,.05,z);
    
    // Create enhanced NPC
    const npc = createEnhancedNPC(i);
    room.add(npc);
    npcs[0]={g:npc,characterKey:encounters[i].characterKey};
    
    roomLight=new THREE.PointLight(encounters[i].color,28,19);
    roomLight.position.set(3,5,0);
    room.add(roomLight);
}

// Enhanced frame loop with character animations and dialogue
function frame(now){
    requestAnimationFrame(frame);
    const dt=Math.min((now-last)/1000,.05)||.016;
    last=now;
    clock+=dt;
    
    const playing=mode==='play',inside=roomIndex>=0;
    
    if(playing){
        // Character animations in rooms
        if(inside && npcs[0]){
            updateCharacterAnimation(npcs[0].g, npcs[0].characterKey, dt);
            
            // Check for proximity dialogue
            if(pet && npcs[0].g){
                checkProximityDialogue(pet, npcs[0].g, npcs[0].characterKey);
            }
        }
        
        // Ice room camera shake effect
        if(roomIndex===0 && !motionReduced && clock>iceNext){
            iceAngle+=.02;
            if(iceAngle>.15){
                camera.rotation.z=Math.sin(clock*12)*.01;
                camera.position.y=11+Math.sin(clock*8)*.05;
            }
            if(clock>iceNext+3){iceNext=clock+4;iceAngle=0;camera.rotation.z=0;camera.position.y=11}
        }
        
        // Fog sprite animation for ecstasy room
        if(roomIndex===3){
            fogSprites.forEach((s,i)=>{
                s.position.x+=(Math.sin(clock+i)*.8)*dt;
                s.position.z+=(Math.cos(clock*1.2+i)*.6)*dt;
                s.material.opacity=.3+Math.sin(clock*2+i)*.15;
            });
        }
        
        // Room object rotations
        roomObjects.forEach(obj => {
            if(obj.geometry instanceof THREE.OctahedronGeometry) {
                obj.rotation.y += dt * 0.5;
                obj.rotation.x += dt * 0.3;
            }
        });
    }
    
    // Render the scene
    renderer.render(scene,camera);
}

// Wall texture function
function wallTexture(i){
    const c=document.createElement('canvas');
    c.width=1024;
    c.height=512;
    const a=c.getContext('2d');
    a.fillStyle=['#234653','#343f48','#344d4c','#3e3a55','#323750'][i];
    a.fillRect(0,0,1024,512);
    a.strokeStyle='#6c858333';
    
    for(let x=0;x<1024;x+=18){
        a.beginPath();
        a.moveTo(x,0);
        a.lineTo(x,512);
        a.stroke();
    }
    
    function branch(x,y,ang,len,depth){
        if(depth===0)return;
        const xx=x+Math.cos(ang)*len,yy=y+Math.sin(ang)*len;
        a.lineWidth=depth*1.8;
        a.strokeStyle='#091a25';
        a.beginPath();
        a.moveTo(x,y);
        a.quadraticCurveTo(x+len*.2,yy,xx,yy);
        a.stroke();
        branch(xx,yy,ang-.45,len*.66,depth-1);
        branch(xx,yy,ang+.6,len*.62,depth-1);
    }
    
    branch(140,530,-1.3,150,6);
    branch(910,540,-1.9,180,6);
    
    if(i===1){
        for(let j=0;j<8;j++){
            const x=70+j*123;
            for(let k=0;k<7;k++){
                const y=95+k*36+Math.sin(j+k)*18;
                a.fillStyle=k%2?'#8c638f':'#71986b';
                a.beginPath();
                a.ellipse(x+Math.sin(k)*11,y,11,6,-.3,0,7);
                a.fill();
            }
            a.strokeStyle='#74907466';
            a.lineWidth=4;
            a.beginPath();
            a.moveTo(x,85);
            a.bezierCurveTo(x+22,170,x-22,220,x,335);
            a.stroke();
        }
    }
    
    const tex=new THREE.CanvasTexture(c);
    tex.colorSpace=THREE.SRGBColorSpace;
    return tex;
}

// Melting clock function for weed room
function meltingClock(x,y,z,scale,tilt){
    const c=document.createElement('canvas');
    c.width=256;
    c.height=384;
    const a=c.getContext('2d');
    a.clearRect(0,0,256,384);
    a.fillStyle='#b9ced6';
    a.beginPath();
    a.ellipse(128,168,110,154,0,0,7);
    a.fill();
    a.strokeStyle='#c4a366';
    a.lineWidth=9;
    a.beginPath();
    a.ellipse(128,168,108,152,0,0,7);
    a.stroke();
    a.fillStyle='#273748';
    a.font='25px Georgia';
    a.textAlign='center';
    
    for(let n=1;n<=12;n++){
        const ang=n*Math.PI/6-Math.PI/2;
        a.fillText(n,128+Math.cos(ang)*83,175+Math.sin(ang)*126);
    }
    
    a.lineWidth=6;
    a.beginPath();
    a.moveTo(128,168);
    a.lineTo(85,102);
    a.moveTo(128,168);
    a.bezierCurveTo(150,225,90,246,132,285);
    a.stroke();
    
    const tx=new THREE.CanvasTexture(c);
    tx.colorSpace=THREE.SRGBColorSpace;
    const geo=new THREE.PlaneGeometry(1.6,2.5,16,24),pos=geo.attributes.position;
    
    for(let j=0;j<pos.count;j++){
        const yy=pos.getY(j);
        pos.setX(j,pos.getX(j)+Math.sin(yy*2)*.23);
        pos.setZ(j,Math.sin(yy*2.2)*.25);
        if(yy<-.5)pos.setX(j,pos.getX(j)*.72);
    }
    
    geo.computeVertexNormals();
    const o=mesh(geo,new THREE.MeshStandardMaterial({map:tx,side:THREE.DoubleSide,roughness:.7,transparent:true,alphaTest:.08}),room,x,y,z);
    o.rotation.z=tilt;
    o.scale.setScalar(scale);
    roomObjects.push(o);
}
// City creation functions
function tree(x,z,s=1){
    block(city,.35,1.6,.35,0x715942,x,.8,z);
    const t=mesh(new THREE.ConeGeometry(1.1*s,3*s,5),mat(treeMaterials[Math.abs(Math.round(x+z))%3]),city,x,2.1*s,z);
    t.rotation.y=.3;
}

function makePin(e,i,h){
    const g=new THREE.Group();
    g.position.set(e.x,h+2,e.z);
    city.add(g);
    const c=encounters[i].color;
    const head=mesh(new THREE.SphereGeometry(.65,12,8),mat(c,.45),g,0,.5,0);
    mesh(new THREE.ConeGeometry(.46,.9,10),mat(c,.45),g,0,-.1,0).rotation.z=Math.PI;
    label(encounters[i].name,g,0,1.7,0);
    pins.push({g,head,baseY:h+2});
}

function house(x,z,i=-1,decor=false){
    const h=decor?4.5:5.8,cols=[0x7c9da8,0xb79c91,0x92a38b,0xb59ab2,0x9d9cbd],c=i<0?0xdbbc89:cols[i];
    block(city,11,.4,12,0xa7b6a5,x,.2,z);
    block(city,8,h,7,c,x,h/2+.4,z);
    block(city,8.5,.35,7.5,0xe2ceb0,x,h+.45,z);
    const roof=mesh(new THREE.CylinderGeometry(0,6.4,2.6,4),mat(i===2?0x69836d:0x8b6254),city,x,h+1.9,z);
    roof.rotation.y=Math.PI/4;
    roof.scale.z=.9;
    
    const doorZ=z+3.57;
    block(city,1.65,2.5,.12,0x263f4d,x,1.65,doorZ);
    block(city,1.8,.12,1,0xc0bea4,x,.51,doorZ+.25);
    
    if(!decor){
        block(city,1.7,.10,.12,i<0?0xf7d99d:encounters[i].color,x,3,doorZ+.1,1);
        const ring=mesh(new THREE.TorusGeometry(1.2,.055,6,32),mat(i<0?0xf8d17a:encounters[i].color,.8),city,x,.45,z+5);
        ring.rotation.x=Math.PI/2;
    }
    
    for(const xx of [-2.7,2.7]){
        block(city,1.4,1.5,.1,0x395969,x+xx,2.5,doorZ);
        block(city,1.55,.12,.25,0xe3d5b6,x+xx,1.7,doorZ);
        block(city,.08,1.5,.15,0xd1c8ac,x+xx,2.5,doorZ+.04);
    }
    
    for(const zz of [-1.8,1.4])block(city,.1,1.4,1.2,0x38566a,x+4.03,2.5,z+zz);
    
    obstacles.push({x,z,w:4.6,d:4.05});
    if(i>=0)makePin({x,z},i,h+2);
    if(i<0&&!decor){
        label('HOME · 5 KEY PIECES',city,x,h+3.4,z,'#ffe3a5');
        sphere(city,.28,0xffce72,x+.5,1.6,doorZ+.12);
    }
}

function makeCity(){
    city=new THREE.Group();
    scene.add(city);
    block(city,76,.6,88,0x6c956f,0,-.4,-4);
    block(city,8,.05,84,0x556168,0,0,-4);
    
    for(const z of [25,5,-15,-35])block(city,70,.05,6,0x556168,0,.01,z);
    for(let z=-43;z<36;z+=5)block(city,.16,.02,2,0xe4d8ae,0,.05,z);
    for(const z of [25,5,-15,-35])for(const x of [-6,6])for(let j=0;j<4;j++)block(city,.65,.02,2.7,0xd4d3bd,x+j*.95-1.4,.065,z);
    
    sites.forEach((e,i)=>house(e.x,e.z,i));
    house(home.x,home.z);
    
    for(const x of [-29,29])for(const z of [-27,-7,13]){
        house(x,z,-1,true);
        tree(x-4,z+6,.75);
    }
    
    for(const x of [-7,7])for(const z of [-24,-4,16]){
        tree(x,z,.85);
        block(city,.22,3,.22,0x40575a,x,1.5,z+5);
        sphere(city,.28,0xffe5af,x,3.1,z+5);
    }
    
    // Pocket parks
    for(const z of [-40,32])for(const x of [-17,17]){
        block(city,16,.24,6,0xa7b6a5,x,.12,z);
        block(city,13,.12,4.5,0x91b57b,x,.27,z);
        block(city,6,.06,2.8,0x3eaaa5,x,.35,z);
        tree(x-5,z,.75);
        tree(x+5,z,.75);
        block(city,2,.18,.65,0xb48c5d,x+4,.8,z+1.4);
        for(const xx of [-.7,.7])block(city,.12,.6,.5,0x495253,x+4+xx,.45,z+1.4);
    }
}

// Pet creation function  
function makePet(type){
    if(pet)scene.remove(pet);
    pet=new THREE.Group();
    scene.add(pet);
    
    const bird=type==='bird',pig=type==='pig',cat=type==='cat';
    const c=bird?0xb9c5ca:pig?0xbc875b:cat?0xe6e0cc:0xbd8351,dark=cat?0x6e665f:0x634535;
    
    sphere(pet,.7,c,0,.68,0,pig?1:.7,bird?1.2:.8,bird?.65:1.15);
    sphere(pet,.47,bird?0xffe58b:c,0,1.12,.52);
    
    if(!bird){
        sphere(pet,.27,cat?dark:0xebd2ac,0,.99,.87,1,.7,.6);
        sphere(pet,.09,0x18262a,0,1.07,1.03);
        for(const x of [-.29,.29]){
            if(pig)sphere(pet,.17,dark,x,1.44,.53,1,.5,.5);
            else{
                let e=mesh(new THREE.ConeGeometry(.2,cat?.38:.56,4),mat(dark),pet,x,1.61,.46);
                e.rotation.z=x<0?.2:-.2;
            }
        }
        for(const x of [-.35,.35])for(const z of [-.4,.4])block(pet,.21,.35,.25,c,x,.23,z);
        const tail=mesh(new THREE.CapsuleGeometry(.10,cat?.85:.55,4,8),mat(c),pet,0,.95,-.8);
        tail.rotation.x=cat?-.5:1.2;
    }else{
        for(const x of [-.55,.55])sphere(pet,.45,0x798fa0,x,.76,0,.3,1,.7);
        mesh(new THREE.ConeGeometry(.13,.3,4),mat(0xe6a36f),pet,0,1.04,.99).rotation.x=Math.PI/2;
        for(const x of [-.16,0,.16])mesh(new THREE.ConeGeometry(.07,.55,4),mat(0xffdd73),pet,x,1.65,.46);
        for(const x of [-.37,.37])sphere(pet,.12,0xf69459,x,1.05,.78);
        block(pet,.22,.1,.4,0xe1a775,-.2,.1,.3);
        block(pet,.22,.1,.4,0xe1a775,.2,.1,.3);
    }
    
    for(const x of [-.2,.2]){
        sphere(pet,.067,0x101c2c,x,1.23,.92);
        sphere(pet,.019,0xffffff,x-.015,1.25,.975);
    }
    
    const scarf=mesh(new THREE.TorusGeometry(.32,.10,6,20),mat(green),pet,0,.89,.45);
    scarf.rotation.x=Math.PI/2;
    pet.position.set(0,0,25);
}

// Game state functions that integrate with enhanced character system
function updateHud(){
    stage=completed.size;
    $('health').textContent=hp+' / 5 sparks';
    $('condition').textContent=' · '+['Extinguished','Fading','Dim','Wavering','Warm','Bright'][hp];
    $('healthbar').style.width=hp*20+'%';
    $('healthbar').style.background=new THREE.Color(green).multiplyScalar(hp/5).getStyle();
    $('cleared').textContent=stage+' / 5 key pieces collected';
    $('route').innerHTML=encounters.map((e,i)=>`<i class="${completed.has(i)?'done':''}" title="${e.name}: ${completed.has(i)?'key collected':progress[i]+'/3 questions'}">${completed.has(i)?'◆':e.name.slice(0,1)}</i>`).join('');
    flameMat.color.setHex(green).multiplyScalar(hp/5);
    flameMat.emissive.copy(flameMat.color);
    flameLight.intensity=hp*1.4;
    pins.forEach((p,i)=>p.head.material.color.setHex(completed.has(i)?0xf2cb76:encounters[i].color));
}

function nextSite(){
    let best=null,dist=Infinity;
    sites.forEach((s,i)=>{
        if(completed.has(i))return;
        const d=Math.hypot(pet.position.x-s.x,pet.position.z-(s.z+5));
        if(d<dist){
            dist=d;
            best={...s,z:s.z+5,index:i,dist:d};
        }
    });
    return best||{x:home.x,z:home.z+5,index:5,dist:Math.hypot(pet.position.x-home.x,pet.position.z-home.z-5)};
}

function target(){
    return roomIndex<0?nextSite():{x:0,z:-4.8,index:roomIndex};
}

function nearEntrance(){
    return [...sites.map((s,i)=>({...s,index:i})),{...home,index:5}].find(s=>Math.hypot(pet.position.x-s.x,pet.position.z-s.z-5)<2.4);
}

// Initialize the enhanced game system
if (typeof window !== 'undefined') {
    window.addEventListener('load', init);
}