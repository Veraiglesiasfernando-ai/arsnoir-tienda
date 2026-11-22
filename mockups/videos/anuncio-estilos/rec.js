const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:2});
await p.goto('file://'+process.cwd()+'/c.html');await p.waitForTimeout(2500);const fs=require('fs');fs.mkdirSync('fr',{recursive:true});
const N=Math.round(13*30);for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/30);await p.screenshot({path:`fr/${String(i).padStart(4,'0')}.png`});}
await b.close();})();
