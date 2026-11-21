const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:2});
await p.goto('file://'+process.cwd()+'/v2.html');await p.waitForTimeout(2500);
const fs=require('fs');fs.mkdirSync('fr2',{recursive:true});const N=8*30;
for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/30);await p.screenshot({path:`fr2/${String(i).padStart(4,'0')}.png`});}
await b.close();})();
