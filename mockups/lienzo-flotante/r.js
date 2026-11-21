const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [rot,n] of [[-24,'tres-cuartos'],[0,'frontal']]){fs.writeFileSync('g.html',fs.readFileSync('f.html','utf8').replace('ROT',rot));await p.goto('file://'+process.cwd()+'/g.html');await p.waitForTimeout(800);await p.screenshot({path:n+'.png'});}
await b.close();})();
