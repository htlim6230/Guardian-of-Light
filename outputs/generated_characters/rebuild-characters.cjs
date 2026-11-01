// Run: node outputs/generated_characters/rebuild-characters.cjs
// Re-embeds the source OBJ files and manifest in the existing playable game.
const fs=require('fs'),path=require('path');
const keys=['ice_crystallite','heroin_bag','weed_leaf','ecstasy_pill','ketamine_capsule'];
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'characters_manifest.json'),'utf8'));
const data=keys.map(key=>{
 const vertices=[],positions=[];
 const obj=fs.readFileSync(path.join(__dirname,key+'.obj'),'utf8');
 for(const line of obj.split(/\r?\n/)){const parts=line.trim().split(/\s+/);if(parts[0]==='v')vertices.push(parts.slice(1,4).map(Number));if(parts[0]==='f'){
 const indices=parts.slice(1).filter(t=>!t.startsWith('#')).map(t=>{const n=Number(t.split('/')[0]);return n<0?vertices.length+n:n-1});
 for(let i=1;i<indices.length-1;i++)for(const n of [indices[0],indices[i],indices[i+1]]){if(!vertices[n]||vertices[n].some(v=>!Number.isFinite(v)))throw Error('Invalid OBJ vertex in '+key);positions.push(...vertices[n]);}
 }}
 if(!positions.length)throw Error('No faces in '+key);
 return {key,spec:manifest[key],positions};
});
const file=path.join(__dirname,'../index.html');let html=fs.readFileSync(file,'utf8');
// The standalone enhanced game redeclares the live game's globals. Do not load
// a second game engine; only replace the encounter models in the current one.
html=html.replace(/<script\s+src=["'](?:\.\.\/)?enhanced-game\.js["']><\/script>/g,'');
const begin='// BEGIN EMBEDDED KIRO CHARACTERS',end='// END EMBEDDED KIRO CHARACTERS';
const runtime=begin+'\nconst CHARACTER_DATA='+JSON.stringify(data)+';\n'+fs.readFileSync(path.join(__dirname,'character-models.js'),'utf8')+'\n'+end;
if(html.includes(begin)){html=html.slice(0,html.indexOf(begin))+runtime+html.slice(html.indexOf(end)+end.length)}else{
 const marker="document.querySelectorAll('[data-pet]').forEach(b=>b.onclick=";
 if(!html.includes(marker))throw Error('Game event binding marker missing');html=html.replace(marker,()=>runtime+'\n'+marker);
 const old="const npc=new THREE.Group();npc.position.set(0,0,-4.8);room.add(npc);mesh(new THREE.ConeGeometry(.8,1.9,7),mat(0x283347),npc,0,1,0);sphere(npc,.48,encounters[i].color,0,1.95,0);for(const x of [-.18,.18])sphere(npc,.06,0xffe1bc,x,2.02,.43);for(const x of [-.75,.75])sphere(npc,.2,encounters[i].color,x,1.1,.1);label(encounters[i].name,npc,0,3,0);npcs[0]={g:npc};";
 if(!html.includes(old))throw Error('Expected encounter placeholder missing');html=html.replace(old,'const npc=createAssetCharacter(i);room.add(npc);npcs[0]={g:npc};');
 const render='map();renderer.render(scene,camera);}';if(!html.includes(render))throw Error('Frame hook missing');html=html.replace(render,'animateAssetCharacter();'+render);
}
fs.writeFileSync(file,html);console.log('Embedded '+data.length+' OBJ characters in '+file);data.forEach(d=>console.log(d.key+': '+d.positions.length/9+' triangles'));
