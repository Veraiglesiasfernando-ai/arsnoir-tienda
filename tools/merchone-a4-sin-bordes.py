import subprocess, glob, os, json, sys
S='/tmp/claude-0/-home-user-arsnoir-tienda/800fd666-0434-5dd9-bd86-1e54bf5a547a/scratchpad/a4'
O=S+'/out'; os.makedirs(O,exist_ok=True)
T=302.9/215.9
def sh(*a): return subprocess.run(a,capture_output=True,text=True).stdout.strip()
def vp_for(f,geom):
    try:
        c,sd=stats(f,geom); return 'mirror' if sd<10 else 'edge'
    except Exception: return 'edge'
def stats(f,geom):
    # mean colour (0-255) and spread inside a region
    o=sh('convert',f,'-crop',geom,'+repage','-format','%[fx:mean.r*255] %[fx:mean.g*255] %[fx:mean.b*255] %[fx:standard_deviation*255]','info:')
    r,g,b,sd=map(float,o.split()); return (round(r),round(g),round(b)),sd
res={}
for f in sorted(glob.glob(S+'/*.png')):
    h_=os.path.basename(f)[:-4]
    if h_=='tmp': continue
    w,h=map(int,sh('identify','-format','%w %h',f).split())
    r=h/w; mode='encaja'; out=O+'/'+h_+'.png'
    if r < T-0.01:
        H=round(w*T); add=H-h; bh=max(4,int(h*0.03))
        ct,st=stats(f,f'{w}x{bh}+0+0'); cb,sb=stats(f,f'{w}x{bh}+0+{h-bh}')
        top=st<9; bot=sb<9
        if top and bot:
            at=add//2; ab=add-at
            vp=vp_for(f,f'{w}x{max(at,ab)}+0+0') if vp_for(f,f'{w}x{max(at,ab)}+0+{h-max(at,ab)}')=='mirror' else 'edge'
            sh('convert',f,'-virtual-pixel',vp,'-set','option:distort:viewport',f'{w}x{H}+0-{at}','-distort','SRT','0','+repage',out); mode='alarga arriba y abajo'
        elif top:
            vp=vp_for(f,f'{w}x{add}+0+0')
            sh('convert',f,'-virtual-pixel',vp,'-set','option:distort:viewport',f'{w}x{H}+0-{add}','-distort','SRT','0','+repage',out); mode='alarga arriba'
        elif bot:
            vp=vp_for(f,f'{w}x{add}+0+{h-add}')
            sh('convert',f,'-virtual-pixel',vp,'-set','option:distort:viewport',f'{w}x{H}+0+0','-distort','SRT','0','+repage',out); mode='alarga abajo'
        else:
            W=round(h/T); sh('convert',f,'-gravity','center','-crop',f'{W}x{h}+0+0','+repage',out); mode='RECORTE lados'
        pct=round(100*add/h)
    elif r > T+0.01:
        W=round(h/T); add=W-w; bw=max(4,int(w*0.03))
        cl,sl=stats(f,f'{bw}x{h}+0+0'); cr,sr=stats(f,f'{bw}x{h}+{w-bw}+0')
        if sl<9 and sr<9:
            al=add//2; ar=add-al
            vp=vp_for(f,f'{max(al,ar)}x{h}+0+0') if vp_for(f,f'{max(al,ar)}x{h}+{w-max(al,ar)}+0')=='mirror' else 'edge'
            sh('convert',f,'-virtual-pixel',vp,'-set','option:distort:viewport',f'{W}x{h}-{al}+0','-distort','SRT','0','+repage',out); mode='alarga a los lados'
        else:
            H=round(w*T); sh('convert',f,'-gravity','center','-crop',f'{w}x{H}+0+0','+repage',out); mode='RECORTE arriba/abajo'
        pct=round(100*add/w)
    else:
        sh('cp',f,out); pct=0
    res[h_]={'modo':mode,'pct':pct,'r':round(r,3),'vp':locals().get('vp','')}
    vp=''
    # preview tile with the cut line (3 mm of 215.9)
    tw=330; th=round(tw*T); m=round(tw*3/215.9)
    sh('convert',out,'-resize',f'{tw}x{th}!','-fill','none','-stroke','#ff3b30','-strokewidth','1.5','-draw',f'rectangle {m},{m} {tw-m},{th-m}',O+'/t_'+h_+'.png')
    print(h_,mode,pct,flush=True)
json.dump(res,open(O+'/res.json','w'),ensure_ascii=False,indent=1)
