const fs=require('fs');
let html=fs.readFileSync('work/before-update.html','utf8');
let js=fs.readFileSync('work/original-game.js','utf8');
// Keep the original question bank, procedural pet models and input controls.
js=js.replace("const e=encounters[stage],q=e.qs[qIndex]","const e=encounters[active],q=e.qs[qIndex]");
js=js.replace("const e=encounters[stage],q=e.qs[qIndex]","const e=encounters[active],q=e.qs[qIndex]");
js=js.replace("qIndex++;if(qIndex<3)return question();npcs[stage].ring.material.color.setHex(green);npcs[stage].g.visible=false;stage++;qIndex=0;mode='play';closeModal();updateHud()","qIndex++;progress[active]=qIndex;if(qIndex<3)return question();collectPiece()");
const marker="document.querySelectorAll('[data-pet]').forEach(b=>b.onclick=";
js=js.replace(marker,fs.readFileSync('work/upgrade.js','utf8')+'\n'+marker);
html=html.slice(0,html.lastIndexOf('<script>')+8)+js+'</script></body></html>';
html=html.replaceAll('Little Guardians','Guardians of Light').replaceAll('LITTLE GUARDIANS','GUARDIANS OF LIGHT').replaceAll('Singapore special','Puppy').replaceAll('Ragdoll cat','Kitty');
html=html.replace('Your owner is waiting at Beacon Tower. Cross the city with their life-flame, face five shadows, and protect the bond that brings you home.','Your owner is waiting at home. Explore five mysterious buildings in any order, protect their life-flame, and collect the five key pieces that will bring you home.');
html=html.replace('<button id="help">Field guide</button>','<button id="motion" aria-pressed="false">Motion: full</button><button id="leave" hidden>Exit room</button><button id="help">Field guide</button>');
html=html.replace('Next destination','Your journey').replace('CITY / YOUR ROUTE','CITY / I · H · W · E · K');
html=html.replace('<div id="bottom" hidden>','<aside id="roomInfo" class="panel" hidden><div class="small" id="roomTitle"></div><p id="roomNote"></p><p id="roomQuote"></p></aside><div id="bottom" hidden>');
html=html.replace('</style>',`#roomInfo{position:fixed;left:28px;top:280px;width:250px;padding:17px;z-index:2;font-size:12px;color:#c1d0d7}#roomInfo p{margin:10px 0 0}#roomQuote{color:#e4c6ff}#modal{background:#030b164d;backdrop-filter:blur(2px)}#dialog{margin-left:auto;margin-right:5vw;width:min(500px,95%)}.keyreward{font-size:58px;color:#f3d185;text-align:center}#toolbar{flex-wrap:wrap;justify-content:flex-end}#toolbar button{padding:7px 10px}#motion[aria-pressed=true]{color:#80ead6}#hud,#objective{background:#0d1d2be8}#intro .small{letter-spacing:.12em}#minimap{height:150px}@media(max-width:700px){header{align-items:flex-start}.brand{max-width:100px;line-height:1.3}#toolbar{max-width:245px;gap:5px}#toolbar button{font-size:10px;padding:6px 7px}#hud,#objective{top:98px}#roomInfo{top:auto;bottom:185px;left:16px;width:175px;padding:10px;font-size:10px;max-height:160px;overflow:auto}#dialog{margin:auto}#intro{transform:translateY(-42%)}#intro h1{font-size:42px}#intro .lead{font-size:13px}#roomQuote{font-size:10px}} </style>`);
fs.writeFileSync('outputs/index.html',html);
console.log('Updated Guardians of Light: '+html.length+' bytes');
