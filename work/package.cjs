const fs=require('fs');
let html=fs.readFileSync('outputs/index.html','utf8');
const lib=fs.readFileSync('outputs/three.min.js','utf8');
if(lib.length<500000)throw Error('Rendering library incomplete');
html=html.replace('<script src="three.min.js"></script>',()=>'<script>'+lib.replaceAll('</script','<\\/script')+'</script>');
fs.writeFileSync('outputs/index.html',html);
fs.unlinkSync('outputs/three.min.js');
console.log('Self-contained offline game packaged.');
