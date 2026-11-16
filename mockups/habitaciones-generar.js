const {chromium}=require('playwright');const fs=require('fs');
const D=__dirname;
const ROOMS={despacho:{inner:[300,378,664,828],art:[322,400,642,805]},sofa:{inner:[381,226,703,674],art:[398,243,685,657]},sillones:{inner:[304,199,640,675],art:[320,218,624,658]}};
const only=process.argv[2]?process.argv[2].split(','):null;
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+D+'/despacho.jpg');
const prods=JSON.parse(fs.readFileSync(D+'/products.json')).filter(x=>!only||only.includes(x.handle));
const roomData={};for(const n in ROOMS)roomData[n]='data:image/jpeg;base64,'+fs.readFileSync(D+'/'+n+'.jpg').toString('base64');
for(const pr of prods){
 const artUrl=pr.art+(pr.art.includes('?')?'&':'?')+'width=1200';
 let ab;try{ab=Buffer.from(await (await fetch(artUrl)).arrayBuffer());}catch(e){console.log('FAIL fetch',pr.handle);continue;}
 const artData='data:image/jpeg;base64,'+ab.toString('base64');
 for(const n in ROOMS){
  const u=await p.evaluate(async({room,art,R})=>{
   const ld=s=>new Promise((ok,ko)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=ko;i.src=s;});
   const rm=await ld(room),ar=await ld(art);const W=rm.naturalWidth,H=rm.naturalHeight;
   const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(rm,0,0);
   const src=g.getImageData(0,0,W,H).data;const px=(x,y)=>{const k=(y*W+x)*4;return [src[k],src[k+1],src[k+2]];};
   const [ix0,iy0,ix1,iy1]=R.inner,[ax0,ay0,ax1,ay1]=R.art;const aw=ax1-ax0,ah=ay1-ay0;
   // mat colour profiles (middle of each mat strip)
   const avg=a=>{const s=[0,0,0];a.forEach(v=>{s[0]+=v[0];s[1]+=v[1];s[2]+=v[2]});return s.map(x=>x/a.length);};
   const Lc=[],Rc=[],Tc=[],Bc=[];
   for(let y=ay0;y<ay1;y++){const l=[],r=[];for(let x=ix0+4;x<ax0-3;x++)l.push(px(x,y));for(let x=ax1+3;x<ix1-4;x++)r.push(px(x,y));Lc.push(avg(l));Rc.push(avg(r));}
   for(let x=ax0;x<ax1;x++){const t=[],bb=[];for(let y=iy0+4;y<ay0-3;y++)t.push(px(x,y));for(let y=ay1+3;y<iy1-4;y++)bb.push(px(x,y));Tc.push(avg(t));Bc.push(avg(bb));}
   const smooth=(a,k)=>a.map((_,i)=>avg(a.slice(Math.max(0,i-k),i+k+1)));
   const L=smooth(Lc,12),Rr=smooth(Rc,12),T=smooth(Tc,12),B=smooth(Bc,12);
   const paper=245;
   // art drawn with cover fit
   const t=document.createElement('canvas');t.width=aw;t.height=ah;const tg=t.getContext('2d');
   const k=Math.max(aw/ar.naturalWidth,ah/ar.naturalHeight);const sw=aw/k,sh=ah/k;
   tg.drawImage(ar,(ar.naturalWidth-sw)/2,(ar.naturalHeight-sh)/2,sw,sh,0,0,aw,ah);
   const id=tg.getImageData(0,0,aw,ah),d=id.data;
   for(let y=0;y<ah;y++)for(let x=0;x<aw;x++){const u=x/(aw-1),v=y/(ah-1);
     const f=[0,1,2].map(ch=>(((1-u)*L[y][ch]+u*Rr[y][ch])+((1-v)*T[x][ch]+v*B[x][ch]))/2/paper);
     const o=(y*aw+x)*4;
     // paper slightly less than pure white, a touch of contrast loss like a real print
     for(let ch=0;ch<3;ch++){let val=d[o+ch]*0.95+6;val*=Math.min(f[ch],1.06);val+=(Math.random()-.5)*5;d[o+ch]=Math.max(0,Math.min(255,val));}
   }
   tg.putImageData(id,0,0);
   g.save();g.filter='blur(0.35px)';g.drawImage(t,ax0,ay0);g.restore();
   // soft shadow from the mat bevel / frame on top and left
   const s1=g.createLinearGradient(0,ay0,0,ay0+ah*0.035);s1.addColorStop(0,'rgba(0,0,0,0.16)');s1.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=s1;g.fillRect(ax0,ay0,aw,ah*0.035);
   const s2=g.createLinearGradient(ax0,0,ax0+aw*0.025,0);s2.addColorStop(0,'rgba(0,0,0,0.10)');s2.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=s2;g.fillRect(ax0,ay0,aw*0.025,ah);
   return c.toDataURL('image/jpeg',0.9);
  },{room:roomData[n],art:artData,R:ROOMS[n]});
  fs.writeFileSync(D+'/out/'+pr.handle+'-'+n+'.jpg',Buffer.from(u.split(',')[1],'base64'));
 }
 console.log('ok',pr.handle);
}
await b.close();})();
