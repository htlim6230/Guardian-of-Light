const fs=require('fs');let html=fs.readFileSync('work/before-mind-city.html','utf8');
const marker="document.querySelectorAll('[data-pet]').forEach(b=>b.onclick=";
html=html.replace(marker,()=>fs.readFileSync('outputs/mind-city.js','utf8')+'\n'+marker);
// Hook the active (last) frame implementation, not a legacy declaration.
const hook='map();renderer.render(scene,camera);}';let at=html.lastIndexOf(hook);if(at<0)throw Error('Missing frame hook');html=html.slice(0,at)+'updateMindCity(dt);'+html.slice(at);
html=html.replaceAll('if(inside||!obstacles.some(b=>Math.abs(x-b.x)<b.w&&Math.abs(pet.position.z-b.z)<b.d))','if(inside||(canWalkPillar(x,pet.position.z)&&!obstacles.some(b=>Math.abs(x-b.x)<b.w&&Math.abs(pet.position.z-b.z)<b.d)))');
html=html.replaceAll('if(inside||!obstacles.some(b=>Math.abs(pet.position.x-b.x)<b.w&&Math.abs(z-b.z)<b.d))','if(inside||(canWalkPillar(pet.position.x,z)&&!obstacles.some(b=>Math.abs(pet.position.x-b.x)<b.w&&Math.abs(z-b.z)<b.d)))');
html=html.replace('Your owner is waiting at home. Explore five mysterious buildings in any order, protect their life-flame, and collect the five key pieces that will bring you home.','Your owner’s mind has fallen silent. Protect the five pillars of who they are, reunite the key, and carry the turquoise flame home to wake them.');
html=html.replace('A little guardian. A big reason to keep going.','Five pillars. One person worth protecting.');
html=html.replace('<div class="brand"><span>✦</span> GUARDIANS OF LIGHT</div>','<div class="brand"><span>✦</span> GUARDIANS OF LIGHT<div id="cityState" style="font-size:10px;color:#a6c6da;letter-spacing:.14em;margin-top:5px">MIND CITY · ASLEEP</div></div>');
html=html.replace('Every missed answer costs one spark. Learn, retry, keep going.','Five mistakes end the rescue. Complete the key, restore the flame, awaken your owner.');
html=html.replaceAll('for(const z of [-35,-15,5,25])','for(const z of [-20,0,20])');
fs.writeFileSync('outputs/index.html',html);console.log('Mind City built');
