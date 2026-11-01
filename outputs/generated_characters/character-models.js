// Runtime for Kiro's OBJ meshes. Embedded by rebuild-characters.cjs for file:// use.
// CHARACTER_DATA is provided by the build step; no fetch or OBJLoader is required.
let characterReflection;
function getCharacterReflection(){
 if(characterReflection)return characterReflection;
 const faces=Array.from({length:6},(_,i)=>{const c=document.createElement('canvas');c.width=c.height=64;const a=c.getContext('2d'),g=a.createLinearGradient(0,0,64,64);g.addColorStop(0,'#f5f8ff');g.addColorStop(.35,i===3?'#7586a5':'#d3e3f4');g.addColorStop(.5,'#526579');g.addColorStop(.75,'#b1c2ce');g.addColorStop(1,'#293746');a.fillStyle=g;a.fillRect(0,0,64,64);return c});
 characterReflection=new THREE.CubeTexture(faces);characterReflection.colorSpace=THREE.SRGBColorSpace;characterReflection.needsUpdate=true;return characterReflection;
}
function createAssetCharacter(index){
 const data=CHARACTER_DATA[index],spec=data.spec;
 const npc=new THREE.Group();npc.name=spec.name+' — Kiro OBJ character';npc.position.set(0,0,-4.8);
 const body=new THREE.Group();body.name='animated-character';npc.add(body);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(data.positions,3));geo.computeVertexNormals();geo.computeBoundingBox();
 const size=geo.boundingBox.getSize(new THREE.Vector3()),centre=geo.boundingBox.getCenter(new THREE.Vector3());
 const scale=2.3/Math.max(size.x,size.y);geo.translate(-centre.x,-centre.y,-centre.z);geo.scale(scale,scale,scale);geo.computeBoundingBox();
 const colour=new THREE.Color(...spec.color_rgba.slice(0,3));const props=spec.shader_properties;
 const material=new THREE.MeshPhysicalMaterial({color:colour,roughness:props.roughness??.5,metalness:props.metallic??0,side:THREE.DoubleSide,flatShading:index===0,envMap:getCharacterReflection(),envMapIntensity:index===4?1.5:.7,clearcoat:index===3?1:.25,transparent:index===0||index===1,opacity:index===0?.78:index===1?.35:1,depthWrite:index!==1});
 // Transparency approximates the exported appearance without a separate render pass.
 const model=mesh(geo,material,body,0,1.7,0);model.name=data.key+'.obj';model.userData.source=data.key+'.obj';
 const front=geo.boundingBox.max.z+.035,half=geo.boundingBox.max.y;
 function detail(g,m,x,y,z){return mesh(g,m,body,x,y,z)}
 if(index===0){const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo,25),new THREE.LineBasicMaterial({color:0xc6edff,transparent:true,opacity:.5}));edges.position.y=1.7;body.add(edges);}
 if(index===1){
  // The OBJ provides the slumped bag shell; manifest-only powder and zip details.
  const fill=detail(new THREE.SphereGeometry(.8,16,8),mat(0xe9e4d9),0,1.7-half+.33,0);fill.scale.set(1.15,.35,.75);
  for(const dy of [0,.09])detail(new THREE.BoxGeometry(1.95,.045,.08),mat(0x7ac2bf),0,1.7+half-.18+dy,front-.1);
 }
 if(index===2){
  // Visible root tendrils supplement the flat root triangles exported in the OBJ.
  for(const side of [-1,1]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.18,.85,0),new THREE.Vector3(side*.32,.45,.07),new THREE.Vector3(side*.55,.24,.19)]);detail(new THREE.TubeGeometry(curve,10,.065,6,false),mat(0x44652b),0,0,0)}
 }
 if(index===3){detail(new THREE.BoxGeometry(.035,1.15,.025),mat(0xad481b),0,1.7,front+.006);}
 if(index===4){const seam=detail(new THREE.TorusGeometry(.695,.025,6,32),mat(0x53616f),0,1.7,0);seam.rotation.x=Math.PI/2;}
 // Keep faces on the viewer-facing side of the supplied mesh, not inside it.
 for(const x of [-.25,.25]){sphere(body,.085,0x172536,x,1.86,front+.055);sphere(body,.024,0xf4fbff,x-.015,1.89,front+.125)}
 const mouth=detail(new THREE.TorusGeometry(.15,.024,6,18,Math.PI),mat(0x253341),0,1.55,front+.065);mouth.rotation.z=Math.PI;
 label(spec.name,npc,0,3.35,0);npc.userData={assetKey:data.key,body,animation:spec.animation_idle};
 return npc;
}
function animateAssetCharacter(){
 if(roomIndex<0||roomIndex>4||mode!=='play')return;
 const b=npcs[0]?.g.userData.body;if(!b)return;
 b.position.set(0,0,0);b.rotation.set(0,0,0);b.scale.set(1,1,1);
 if(motionReduced)return;
 switch(roomIndex){
  case 0:b.position.y=Math.sin(clock*1.6)*.13;b.rotation.y=Math.sin(clock*.8)*.2;break;
  case 1:b.scale.y=1+Math.sin(clock*1.2)*.025;b.rotation.z=Math.sin(clock*.7)*.025;break;
  case 2:b.rotation.z=Math.sin(clock*1.7)*.07;break;
  case 3:b.position.y=Math.abs(Math.sin(clock*3.8))*.22;b.rotation.z=Math.sin(clock*3.8)*.045;break;
  case 4:b.position.y=Math.sin(clock*1.4)*.1;b.rotation.y=Math.sin(clock*.6)*.16;break;
 }
}
