const f=require('fs');let s=f.readFileSync('outputs/mind-city.js','utf8');
s=s.replace('victoryPresented=false;','victoryPresented=false,homeSign=null;');
s=s.replace("cityText('HOME · OWNER ASLEEP',home.x,7.8,home.z,6.5);","homeSign=cityText('HOME · OWNER ASLEEP',home.x,7.8,home.z,6.5);");
s=s.replace('new THREE.Color(.075+v*.22,.115+v*.27,.19+v*.34)','new THREE.Color(.12+v*.23,.17+v*.28,.25+v*.34)');
s=s.replace('priorStart();applyCityPalette(0);','priorStart();setHomeSign(false);applyCityPalette(0);');
s=s.replace('ownerAwake=true;','ownerAwake=true;setHomeSign(true);');
s+='\nfunction setHomeSign(awake){if(homeSign){city.remove(homeSign);homeSign.material.map.dispose();homeSign.material.dispose()}homeSign=cityText(awake?"HOME · OWNER AWAKE":"HOME · OWNER ASLEEP",home.x,7.8,home.z,6.5);}\n';
f.writeFileSync('outputs/mind-city.js',s);
let b=f.readFileSync('work/build-mind-city.cjs','utf8');b=b.replace("fs.writeFileSync('outputs/index.html',html);","html=html.replaceAll('for(const z of [-35,-15,5,25])','for(const z of [-20,0,20])');\nfs.writeFileSync('outputs/index.html',html);");f.writeFileSync('work/build-mind-city.cjs',b);
