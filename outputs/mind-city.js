// Guardians of Light: five personality landmarks and city restoration.
// Embedded in index.html by work/build-mind-city.cjs.
const pillars=['Family','Friends','Hobbies','Values','Humour'];
const pillarColours=[0xf2c46c,0xe48da7,0x65c6ab,0x8eaaed,0xba91df];
let restoration=0,ownerAwake=false,rescueTime=0,cityMaterials=[],cityLights=[],homeSleeper=null,homeEyes=[],victoryPresented=false,homeSign=null;
function cityText(text,x,y,z,size=5){const o=label(text,city,x,y,z,'#e1edf5');o.scale.set(size,size*.195,1);return o}
function linkTube(parent,points,r,c){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),28,r,8,false),mat(c),parent)}
function personalityIsland(x,z,i){
 const c=pillarColours[i],g=new THREE.Group();g.position.set(x,0,z);city.add(g);
 mesh(new THREE.CylinderGeometry(7.6,5.7,1.3,8),mat(0x8879ad),g,0,-.85,0);
 mesh(new THREE.ConeGeometry(5.8,8,8),mat(0x615777),g,0,-5.3,0).rotation.z=Math.PI;
 block(g,11.4,.18,11.5,0xbdc7b3,0,.04,0);block(g,6.6,3.6,5.3,c,0,1.9,-.8);
 block(g,7.1,.28,5.8,0xe7dcca,0,3.8,-.8);block(g,1.6,2.65,.12,0x203f52,0,1.45,1.91);
 for(const xx of [-2.35,2.35]){block(g,1.2,1.55,.12,0x81d4d9,xx,2.1,1.94,.2);block(g,1.3,.1,.2,0xf4dcaf,xx,1.27,2)}
 block(g,2.1,.16,3.4,0xdfd1b7,0,.2,3.55);obstacles.push({x,z:z-.8,w:3.8,d:3.1});
 const ring=mesh(new THREE.TorusGeometry(1,.06,6,32),mat(green,.6),g,0,.32,5);ring.rotation.x=Math.PI/2;
 // Tall supports make each district read as a pillar of the owner's identity.
 for(const xx of [-4.8,4.8]){block(g,.65,5.7,.65,c,xx,2.85,-2.2);sphere(g,.38,0xffdfa1,xx,5.9,-2.2)}
 if(i===0){
  // A protective arch and three figures, the smaller one sheltered between two adults.
  const arch=mesh(new THREE.TorusGeometry(2.25,.3,10,32,Math.PI),mat(0xf5dca2),g,0,6,-.5);
  for(const [xx,h] of [[-1.25,1.8],[0,1.15],[1.25,1.8]]){mesh(new THREE.CapsuleGeometry(.37,h,5,10),mat(0xffe8b5),g,xx,4.9+h*.3,-.5);sphere(g,.44,0xffecc9,xx,5.55+h*.55,-.5)}
  for(const xx of [-2.4,2.4])block(g,.3,2.4,.3,0xf5dca2,xx,4.9,-.5);
 }else if(i===1){
  for(const xx of [-1.1,1.1]){const ring=mesh(new THREE.TorusGeometry(1.5,.3,10,32),mat(xx<0?0xffbb9e:0xf39cb6),g,xx,6,-.7);ring.rotation.y=xx*.13;sphere(g,.36,0xffddbf,xx,5.5,.4);mesh(new THREE.CapsuleGeometry(.25,.75,4,8),mat(0xf3d7d0),g,xx,4.8,.4)}
  linkTube(g,[[-1.1,4.9,.5],[0,4.6,.6],[1.1,4.9,.5]],.12,0xffd4a5);
 }else if(i===2){
  block(g,5.9,.08,4.7,0x418e82,0,4,-.8);
  block(g,.14,3,.14,0xe5dfd4,-2,5.5,-1.9);block(g,1.7,1.05,.13,0xe8e2d2,-2,6.6,-1.9);const hoop=mesh(new THREE.TorusGeometry(.48,.055,6,24),mat(0xf4a057),g,-2,6.1,-1.2);hoop.rotation.x=Math.PI/2;sphere(g,.47,0xe39c57,-1,4.5,.25);
  const racket=mesh(new THREE.TorusGeometry(.65,.07,6,24),mat(0xe9e5c9),g,1.5,6,-.8);racket.scale.y=1.35;block(g,.1,1.5,.1,0xe4cbb6,1.5,4.8,-.8);for(let n=-2;n<=2;n++){block(g,.018,1.2,.018,0xe2eddf,1.5+n*.19,6,-.8);block(g,1.05,.018,.018,0xe2eddf,1.5,6+n*.23,-.8)}
  // A dancer with raised arms and an extended leg.
  sphere(g,.28,0xf5d59d,0,6.5,1.1);linkTube(g,[[0,6.2,1.1],[.1,5.6,1.1],[-.5,5,1.1]],.14,0xffc1db);linkTube(g,[[-.8,6.6,1.1],[0,6,1.1],[.8,6.7,1.1]],.1,0xffc1db);linkTube(g,[[.1,5.6,1.1],[.8,5.5,1.1],[1.2,5.1,1.1]],.1,0xffc1db);
 }else if(i===3){
  for(const [j,xx] of [-2,0,2].entries()){block(g,.8,2.8+j*.3,.9,0xc6d4ff,xx,5.35+j*.15,-.7);block(g,1.25,.2,1.3,0xe4dcbb,xx,6.85+j*.3,-.7)}
  block(g,5.9,.3,1.65,0xf0dba7,0,7.7,-.7);const jewel=mesh(new THREE.OctahedronGeometry(.65),mat(0xffd27a,.15),g,0,8.5,-.7);
 }else{
  const face=sphere(g,1.5,0xffd995,0,5.8,-.6,1,1,.6);for(const xx of [-.48,.48])sphere(g,.12,0x354858,xx,6.15,.23);
  const smile=mesh(new THREE.TorusGeometry(.62,.07,6,24,Math.PI),mat(0xb2759f),g,0,5.72,.34);smile.rotation.z=Math.PI;
  for(const side of [-1,1]){linkTube(g,[[0,7,-.6],[side*.9,7.9,-.6],[side*1.8,7.4,-.6]],.27,side<0?0xc896eb:0x8fd9cf);sphere(g,.22,0xffe6a3,side*1.8,7.3,-.6)}
 }
 cityText(pillars[i].toUpperCase(),x,3.05,z+2.15,5.6);
 if(i===2)cityText('BASKETBALL · BADMINTON · DANCE',x,1.12,z+2.2,6.1);
 if(i===3)cityText('HONESTY · INTEGRITY · RELIABILITY',x,1.12,z+2.2,6.1);
 const p=new THREE.Group();p.position.set(x,10.2,z);city.add(p);const head=sphere(p,.35,0xb0d5ea,0,0,0);mesh(new THREE.ConeGeometry(.27,.5,8),mat(0xb0d5ea),p,0,-.4,0).rotation.z=Math.PI;label(encounters[i].name,p,0,.85,0);pins.push({g:p,head,baseY:10.2});
}
function makeCity(){
 city=new THREE.Group();scene.add(city);obstacles.length=0;pins.length=0;cityMaterials=[];cityLights=[];
 // Walkways connect the floating personality islands above a forest of memory spires.
 block(city,7.5,.65,75,0xc6b7cc,0,-.35,-2.5);for(const z of [20,0,-20])block(city,32,.5,3.8,0xd9c6ac,0,-.25,z);
 for(let z=-37;z<35;z+=3){block(city,.11,.04,1,0x83d6d1,0,.04,z,.3);for(const x of [-3.7,3.7])block(city,.1,.24,1.6,0x98a5c8,x,.1,z)}
 sites.forEach((s,i)=>personalityIsland(s.x,s.z,i));
 const g=new THREE.Group();g.position.set(home.x,0,home.z);city.add(g);mesh(new THREE.CylinderGeometry(7.6,5.8,1.4,12),mat(0x8879ad),g,0,-.7,0);mesh(new THREE.ConeGeometry(5.8,8,10),mat(0x615777),g,0,-5.4,0).rotation.z=Math.PI;
 block(g,7,4.2,6,0xffdca6,0,2.1,-.5);mesh(new THREE.ConeGeometry(5.6,2.4,4),mat(0xc78599),g,0,5.35,-.5).rotation.y=Math.PI/4;block(g,1.7,2.7,.15,0x2d5763,0,1.4,2.58);block(g,2.2,.15,3.3,0xe3d2ae,0,.1,4);
 for(const x of [-2.3,2.3])block(g,1.2,1.4,.1,0xffdb8e,x,2.6,2.56,.2);obstacles.push({x:home.x,z:home.z-.5,w:4,d:3.55});homeSign=cityText('HOME · OWNER ASLEEP',home.x,7.8,home.z,6.5);
 for(let x=-36;x<=36;x+=5)for(let z=-43;z<=34;z+=7){const h=7+(Math.sin(x*8+z)*.5+.5)*13;block(city,2.5,h,2.5,0x7578a1,x,-18-h/2,z)}
 const all=new Set();city.traverse(o=>{if(o.isMesh){const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){if(!m.color||all.has(m))continue;all.add(m);const bright=m.color.clone(),v=(bright.r+bright.g+bright.b)/3;cityMaterials.push({m,bright,dark:new THREE.Color(.12+v*.23,.17+v*.28,.25+v*.34),em:m.emissive?.clone(),intensity:m.emissiveIntensity});}}});
 applyCityPalette(0);
}
function canWalkPillar(x,z){return Math.abs(x)<=3.6&&z>=-39&&z<=35||[20,0,-20].some(v=>Math.abs(z-v)<=1.85&&Math.abs(x)<=16)||[...sites,home].some(s=>Math.hypot(x-s.x,z-s.z)<=7.1)}
function applyCityPalette(amount){restoration=amount;for(const v of cityMaterials){v.m.color.copy(v.dark).lerp(v.bright,amount);if(v.em){v.m.emissive.copy(v.em).multiplyScalar(amount);v.m.emissiveIntensity=v.intensity;}}if(roomIndex<0){scene.background.setHex(0x111e35).lerp(new THREE.Color(0x9fc5df),amount);scene.fog=new THREE.FogExp2(scene.background.clone(),.010-amount*.005)}scene.children.forEach(o=>{if(o.isHemisphereLight){o.intensity=roomIndex>=0?2.3:1.4+amount*.9;o.color.setHex(roomIndex>=0?0xcde6ed:0xb0cae5)}if(o.isDirectionalLight){o.intensity=roomIndex>=0?3:1.5+amount*1.5;o.color.setHex(amount>.2?0xffe6bd:0x9cb7da)}})}
const priorStart=start,priorLeave=leaveRoom,priorEnter=enterRoom,priorHud=updateHud,priorGuide=guide;
start=function(){ownerAwake=false;rescueTime=0;victoryPresented=false;if(homeSleeper){city.remove(homeSleeper);homeSleeper=null}priorStart();setHomeSign(false);applyCityPalette(0);$('cityState').textContent='MIND CITY · ASLEEP';};
leaveRoom=function(){priorLeave();applyCityPalette(ownerAwake?1:0);};
enterRoom=function(i){priorEnter(i);applyCityPalette(restoration);$('roomTitle').textContent=pillars[i]+' / '+roomNames[i];};
updateHud=function(){priorHud();if(completed.size===5&&hp>0){flameMat.color.setHex(green);flameMat.emissive.setHex(green);flameLight.intensity=7;$('condition').textContent=' · Turquoise / restored';$('healthbar').style.background='#27c1bb'}if(!ownerAwake)pins.forEach(p=>p.head.material.color.setHex(0xa4c1dc));};
collectPiece=function(){completed.add(active);progress[active]=3;stage=completed.size;mode='reward';updateHud();showModal(`<p class="small">${pillars[active]} protected · ${stage} / 5 pieces</p><div class="keyreward">◆</div><h2 id="dialogTitle">A piece of who they are.</h2><p>You cleared ${encounters[active].name}'s test and protected your owner's pillar of ${pillars[active].toLowerCase()}.</p><p class="muted">${stage===5?'All five pieces reunite. The key restores the flame to turquoise. Bring it home to awaken your owner and return colour to the city.':'The city is still asleep. Find the remaining key pieces in any order.'}</p><button class="primary" id="returnCity">Return to the city →</button>`);$('returnCity').onclick=leaveRoom;};
enterHome=function(){if(completed.size!==5||hp<=0)return;mode='transfer';roomIndex=5;rescueTime=0;city.visible=false;makeRoom(0);npcs[0].g.visible=false;pet.position.set(0,0,3);owner=new THREE.Group();owner.position.set(0,1,-3);room.add(owner);block(room,3.6,.6,1.8,0x55677a,0,.4,-3);const body=new THREE.Group();owner.add(body);owner.userData.body=body;block(body,.85,1.2,.55,0xaac4a3,0,.9,0);sphere(body,.38,0xf0c39e,0,1.9,0);for(const x of [-.24,.24])block(body,.25,.5,.3,0x394f66,x,.25,0);homeEyes=[];for(const x of [-.13,.13])homeEyes.push(block(body,.14,.025,.04,0x273847,x,1.95,.35));body.rotation.z=Math.PI/2;body.position.x=.8;updateHud();$('roomInfo').hidden=true;$('leave').hidden=true;$('prompt').textContent='Your owner is asleep. The turquoise flame reaches them…';scene.background.setHex(0x111e35);};
finish=function(win){mode=win?'won':'lost';if(!win){ownerAwake=false;applyCityPalette(0);roomIndex=-1;city.visible=true;if(room)room.visible=false;pet.position.set(0,0,29);$('roomInfo').hidden=true;$('leave').hidden=true;$('cityState').textContent='MIND CITY · STILL ASLEEP'}showModal(`<p class="small">${win?'The city remembers its light':'Five mistakes · The city remains asleep'}</p><h2 id="dialogTitle">${win?'Welcome back.':'The light needs another chance.'}</h2><p>${win?'Your turquoise flame awakens your owner. Family, friends, hobbies, values and humour shine again, and colour returns to the city.':'Five attacks extinguished the flame. The grey-blue city stays gloomy. Start a fresh rescue with what you have learned.'}</p><p class="accent">${completed.size} / 5 key pieces · ${correct} / 15 questions · ${hits} mistakes</p><p class="subnote">This is a fictional rescue. Real recovery takes support and care; loved ones are not responsible for curing someone.</p><div class="actions" style="margin-top:18px"><button class="primary" id="again">Play again</button>${win?'<button id="viewCity">View restored city</button>':''}<button id="choose">Choose another pet</button></div>`);$('again').onclick=start;$('choose').onclick=()=>{start();mode='intro';$('intro').hidden=false;['hud','objective','bottom','pad','minimap','pause'].forEach(id=>$(id).hidden=true);document.querySelector('.mapcaption').hidden=true};if(win)$('viewCity').onclick=()=>{closeModal();$('prompt').textContent='Your owner is awake. All five pillars shine again.'};};
guide=function(returnMode){priorGuide(returnMode);const p=document.createElement('p');p.textContent='Mind City starts in grey-blue gloom. Five wrong answers extinguish the flame and leave the city asleep. Collecting all five pieces restores the flame to turquoise. Bring it home: your owner awakens and the city returns to colour. Pillars: Family / Ice; Friends / Heroin; Hobbies / Weed; Values / Ecstasy; Humour / Ketamine.';$('dialog').insertBefore(p,$('back'));};
function updateMindCity(dt){
 animateAssetCharacter();
 if(mode==='transfer'){
  rescueTime+=dt;const wake=THREE.MathUtils.clamp((rescueTime-1.4)/1.5,0,1);owner.userData.body.rotation.z=(1-wake)*Math.PI/2;owner.userData.body.position.x=.8*(1-wake);owner.position.y=1-wake*.7;homeEyes.forEach(e=>e.scale.y=1+wake*4);if(!ownerAwake)flame.position.set(.95,2.5,-2.7);
  if(rescueTime>=3&&!ownerAwake){ownerAwake=true;setHomeSign(true);$('cityState').textContent='MIND CITY · AWAKENING';room.remove(owner);city.add(owner);homeSleeper=owner;owner.position.set(home.x+.9,.2,home.z+4);room.visible=false;city.visible=true;roomIndex=-1;pet.position.set(home.x-1,0,home.z+5);$('prompt').textContent='Your owner is awake. Light is returning to every pillar…'}
  if(ownerAwake){applyCityPalette(THREE.MathUtils.clamp((rescueTime-3)/2.5,0,1));flame.position.set(home.x+.9,2.8,home.z+4);camera.position.lerp(new THREE.Vector3(44,42,55),.06);camera.lookAt(0,0,-4);}
  if(rescueTime>=6&&!victoryPresented){victoryPresented=true;applyCityPalette(1);$('cityState').textContent='MIND CITY · RESTORED';finish(true)}
 }
 if(mode==='won'){camera.position.lerp(new THREE.Vector3(44,42,55),.05);camera.lookAt(0,0,-4);flame.position.set(home.x+.9,2.8,home.z+4)}
 if(mode==='intro'){applyCityPalette(0);camera.position.set(43,41,56);camera.lookAt(0,0,-3)}
}

function setHomeSign(awake){if(homeSign){city.remove(homeSign);homeSign.material.map.dispose();homeSign.material.dispose()}homeSign=cityText(awake?"HOME · OWNER AWAKE":"HOME · OWNER ASLEEP",home.x,7.8,home.z,6.5);}
