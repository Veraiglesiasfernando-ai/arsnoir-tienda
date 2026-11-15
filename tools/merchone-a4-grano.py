# For works where the plain border is grainy (edge-stretch makes stripes): grow the border by
# repeating a thin strip of it, flipped back and forth so the grain continues with no seam.
import subprocess, json
S='/tmp/claude-0/-home-user-arsnoir-tienda/800fd666-0434-5dd9-bd86-1e54bf5a547a/scratchpad/a4'; O=S+'/out'
T=302.9/215.9
def sh(*a): return subprocess.run(a,capture_output=True,text=True).stdout.strip()
res=json.load(open(O+'/res.json'))
for h,v in res.items():
    if v.get('vp')!='edge': continue
    f=S+'/'+h+'.png'; w,hh=map(int,sh('identify','-format','%w %h',f).split())
    H=round(w*T); add=H-hh; bh=max(8,int(hh*0.03))
    top = v['modo']=='alarga arriba'
    strip = f'{w}x{bh}+0+0' if top else f'{w}x{bh}+0+{hh-bh}'
    sh('convert',f,'-crop',strip,'+repage',S+'/strip.png')
    n=add//bh+2; parts=[]
    for i in range(n):
        # the copy next to the picture is mirrored so the first row matches the picture's own edge row
        parts += ['(',S+'/strip.png','-flip',')'] if i%2==0 else [S+'/strip.png']
    sh('convert',*parts,'-append','+repage',S+'/ext.png')
    if top:
        sh('convert',S+'/ext.png','-flip','-gravity','south','-crop',f'{w}x{add}+0+0','+repage',S+'/ext2.png')
        # (after the flip the strip copy touching the picture keeps the picture's top row orientation)
        sh('convert',S+'/ext2.png',f,'-append',O+'/'+h+'.png')
    else:
        sh('convert',S+'/ext.png','-crop',f'{w}x{add}+0+0','+repage',S+'/ext2.png')
        sh('convert',f,S+'/ext2.png','-append',O+'/'+h+'.png')
    v['vp']='tira'; tw=330; th=round(tw*T); m=round(tw*3/215.9)
    sh('convert',O+'/'+h+'.png','-resize',f'{tw}x{th}!','-fill','none','-stroke','#ff3b30','-strokewidth','1.5','-draw',f'rectangle {m},{m} {tw-m},{th-m}',O+'/t_'+h+'.png')
    print(h, sh('identify','-format','%wx%h',O+'/'+h+'.png'))
json.dump(res,open(O+'/res.json','w'),ensure_ascii=False,indent=1)
