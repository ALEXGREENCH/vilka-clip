/* Eight completely procedural game worlds for Вилка.
 * No images, textures, fonts, offscreen bitmaps or prerecorded animation.
 * API: VilkaGames.render(ctx,t,look,q,energy,{w,h,local,cycle}).
 * All motion is a function of time. The bottom seventy logical pixels are clear.
 */
(function(root){'use strict';
const TAU=Math.PI*2,PI=Math.PI,clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,p)=>a+(b-a)*p,fract=x=>x-Math.floor(x),smooth=x=>{x=clamp(x);return x*x*(3-2*x)},hash=n=>fract(Math.sin(n*127.13+19.71)*43758.5453);
const C={ink:'#111523',navy:'#263753',coat:'#3c587b',edge:'#7e9dbe',gold:'#edba58',white:'#fff3d7',hair:'#b7c9cf',skin:'#e7b499',skin2:'#b07579',cyan:'#63efde',red:'#fb5773'};
function R(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h)}
function P(c,pts,fill,stroke=null,lw=1){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}}
function L(c,pts,col,lw=1){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle=col;c.lineWidth=lw;c.lineCap='butt';c.stroke()}
function E(c,x,y,rx,ry,col,stroke=null,lw=1){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);if(col){c.fillStyle=col;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}}
function T(c,s,x,y,size=18,col=C.white,align='left'){c.fillStyle=col;c.font=`bold ${size}px monospace`;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y)}
function grad(c,a,b,stops){const g=c.createLinearGradient(...a,...b);stops.forEach(p=>g.addColorStop(p[0],p[1]));return g}
function burst(c,x,y,t,col=C.white,n=20,r=70){for(let i=0;i<n;i++){const a=i*2.39996,d=r*(.5+hash(i)),z=.45+.55*fract(t*1.2+i*.077);L(c,[[x+Math.cos(a)*d*z,y+Math.sin(a)*d*z],[x+Math.cos(a)*d*(z+.25),y+Math.sin(a)*d*(z+.25)]],col,i%5?1:3)}}
const busy=s=>['chorus','copies','original','design','test','joke','laugh','life','salary','doors'].includes(s);
function phase(t,q,local){let p=fract((local==null?t:local)/2);if(p>.47&&p<.51)p=.47;return p}
function fork(c,x,y,s,angle,col=C.white,ink=C.ink){c.save();c.translate(x,y);c.rotate(angle);c.scale(s,s);P(c,[[-4,60],[4,60],[5,-8],[23,-16],[23,-62],[17,-62],[17,-22],[8,-18],[9,-62],[3,-62],[2,-18],[-5,-18],[-5,-62],[-11,-62],[-11,-19],[-18,-23],[-18,-62],[-24,-62],[-23,-16],[-5,-7]],col,ink,2);L(c,[[0,52],[0,-8]],'#ffffff99',1);c.restore()}

// 0. A genuine two-colour 160 × 78 tile world, drawn as grid geometry.
function handheld(c,t,q,en,o){
 c.save();c.scale(6,6);const bg='#cadb8c',fg='#283c32',p=phase(t,q,o.local),scroll=Math.floor(t*8);R(c,0,0,160,79,bg);
 const r=(x,y,w,h)=>R(c,Math.round(x),Math.round(y),Math.round(w),Math.round(h),fg);
 function tile(x,y,type){r(x,y,8,1);r(x,y+7,8,1);r(x,y,1,8);r(x+7,y,1,8);if(type){r(x+3,y+2,2,1);r(x+2,y+3,1,2);r(x+4,y+4,1,2)}else{r(x+1,y+3,6,1);r(x+4,y+1,1,3);r(x+2,y+4,1,3)}}
 for(let k=0;k<5;k++){let x=(k*47-scroll*.18)%207-28;for(let y=0;y<8;y++){r(x-y,34-y,30+y*2,1);if(y%2)for(let xx=0;xx<30+y*2;xx+=4)R(c,x-y+xx,34-y,2,1,bg)}}
 for(let k=0;k<4;k++){let x=(k*53-scroll*.35)%215-25;r(x,21+k%2*6,17,1);r(x+3,18+k%2*6,10,3);r(x+6,16+k%2*6,5,2)}
 for(let x=-8;x<160;x+=8){let xx=x-scroll%8;tile(xx,65,0);tile(xx,73,0)}
 for(let k=0;k<6;k++){let x=(k*34-scroll*.75)%210-24,y=43+(k%3)*5;for(let j=0;j<3;j++)tile(x+j*8,y,k%2)}
 // Readable bespectacled middle-aged hero, boots separating during each stride.
 const jump=busy(q.scene)?Math.sin(p*PI)*16:Math.max(0,Math.sin(t*4))*2,hx=48+Math.round(Math.sin(p*TAU)*7),hy=64-Math.round(jump),step=Math.round(Math.sin(t*13)*3);
 r(hx-4,hy-22,8,6);r(hx-5,hy-20,10,4);R(c,hx-4,hy-19,8,4,bg);r(hx-4,hy-19,3,1);r(hx+1,hy-19,3,1);r(hx-1,hy-18,2,1);r(hx-4,hy-16,8,1);r(hx-2,hy-15,4,1);
 r(hx-4,hy-14,8,10);R(c,hx-1,hy-13,2,8,bg);r(hx-6,hy-12,2,7);r(hx+4,hy-12,2,7);r(hx-4-step,hy-4,3,4);r(hx+1+step,hy-4,3,4);r(hx-5-step,hy,5,1);r(hx+step,hy,5,1);
 const fx=hx+9,fy=hy-10;r(fx,fy-12,1,18);r(fx-4,fy-13,9,1);for(let j=0;j<4;j++)r(fx-4+j*3,fy-19,1,7);
 for(let k=0;k<4;k++){let x=(117+k*38-scroll)%209;if(x<0)x+=209;let y=60;r(x-4,y-8,9,7);r(x-6,y-4,13,5);R(c,x-2,y-7,2,2,bg);R(c,x+2,y-7,2,2,bg);r(x-5,y+1,3,2);r(x+3,y+1,3,2)}
 for(let j=0;j<5;j++){let x=75+j*13;const y=24+Math.round(Math.sin(t*2+j)*2);r(x,y,3,1);r(x-1,y+1,5,3);r(x,y+4,3,1);R(c,x+1,y+1,1,3,bg)}
 const glyphs={'0':['111','101','101','101','111'],'1':['010','110','010','010','111'],'4':['101','101','111','001','001'],'7':['111','001','010','010','010'],O:['111','101','101','101','111'],N:['101','111','111','111','101'],E:['111','100','110','100','111'],R:['110','101','110','101','101'],I:['111','010','010','010','111'],G:['111','100','101','101','111'],A:['010','101','111','101','101'],L:['100','100','100','100','111'],X:['101','101','010','101','101']};
 function pixelText(s,x,y){for(let ch of s){const rows=glyphs[ch];if(rows)rows.forEach((row,j)=>{[...row].forEach((bit,i)=>{if(bit==='1')r(x+i,y+j,1,1)})});x+=4}}
 r(3,3,154,1);r(3,11,154,1);pixelText('47 ONE ORIGINAL',5,5);pixelText('X1000',133,5);c.restore();
}

// 1. Flat-shaded triangles, fog, hard horizon and an orbiting PS1 camera.
function ps1(c,t,q,en,o){
 R(c,0,0,960,470,grad(c,[0,0],[0,470],[[0,'#897896'],[.55,'#cab5b0'],[1,'#39394d']]));
 const a=t*.16,ca=Math.cos(a),sa=Math.sin(a),p=phase(t,q,o.local),zoom=1.0+.05*Math.sin(t*.4);
 // The camera is above the arena: distant ground rises toward the horizon.
 const cameraX=-820*sa,cameraZ=-820*ca;
 const project=(x,y,z)=>{let xx=x*ca-z*sa,zz=x*sa+z*ca;const d=820/(820+zz);return[480+xx*d*zoom,235+(y*.84-zz*.39)*d*zoom]};
 const quad=(vs,col)=>P(c,vs.map(v=>project(...v)),col,null);
 function box(x,y,z,w,h,d,cols){
  const faces=[],add=(vs,col)=>faces.push({vs,col,depth:vs.reduce((sum,v)=>sum+v[0]*sa+v[2]*ca,0)/vs.length});
  // Choose outward faces against the orbiting camera, including perspective
  // offsets: columns off the optical axis can reveal an additional side.
  if(cameraZ<z-d)add([[x-w,y,z-d],[x+w,y,z-d],[x+w,y-h,z-d],[x-w,y-h,z-d]],cols[1]);
  if(cameraZ>z+d)add([[x+w,y,z+d],[x-w,y,z+d],[x-w,y-h,z+d],[x+w,y-h,z+d]],cols[2]);
  if(cameraX<x-w)add([[x-w,y,z+d],[x-w,y,z-d],[x-w,y-h,z-d],[x-w,y-h,z+d]],cols[1]);
  if(cameraX>x+w)add([[x+w,y,z-d],[x+w,y,z+d],[x+w,y-h,z+d],[x+w,y-h,z-d]],cols[2]);
  add([[x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y-h,z+d],[x-w,y-h,z+d]],cols[0]);
  faces.sort((a,b)=>b.depth-a.depth).forEach(face=>quad(face.vs,face.col));
 }
 const objs=[];for(let iz=-4;iz<=4;iz++)for(let ix=-4;ix<=4;ix++){let x=ix*94,z=iz*94,yy=104+Math.sin(ix*1.2+iz+t*.45)*5;objs.push({depth:x*sa+z*ca,fn:()=>{quad([[x-46,yy,z-46],[x+46,yy,z-46],[x+46,yy,z+46]],(ix+iz)%2?'#707686':'#646c80');quad([[x-46,yy,z-46],[x+46,yy,z+46],[x-46,yy,z+46]],'#4d596f')}})}
 for(let i=0;i<7;i++){let ang=i*TAU/7,r=250,x=Math.cos(ang)*r,z=Math.sin(ang)*r;objs.push({depth:x*sa+z*ca,fn:()=>{box(x,95,z,26,145+23*Math.sin(i),25,['#bfc4d0','#656c8b','#424c69']);let top=project(x,-73,z);P(c,[[top[0]-24,top[1]],[top[0],top[1]-19],[top[0]+24,top[1]],[top[0],top[1]+13]],i%2?'#e99974':'#80d9d9')}})}
 const hx=mix(-120,110,smooth((p-.16)/.43)),hz=Math.sin(p*PI)*55,hy=100-Math.sin(p*PI)*54;
 objs.push({depth:hx*sa+hz*ca,fn:()=>{box(hx-14,hy,hz,9,34,11,['#3b4966','#24354f','#182438']);box(hx+15,hy,hz,9,34,11,['#3b4966','#24354f','#182438']);box(hx,hy-32,hz,23,49,13,['#687e99','#354f78','#223753']);box(hx+3,hy-42,hz-14,7,36,2,['#ffe1a0','#d9ad53','#9c6f3c']);box(hx,hy-82,hz,16,27,14,['#e8d8ca','#d7a890','#96707d']);box(hx,hy-109,hz,18,8,16,['#e1e5dd','#a5b4c7','#768caa']);let h=project(hx,hy-96,hz-17);L(c,[[h[0]-15,h[1]],[h[0]+16,h[1]]],'#151d2a',5);const hand=project(hx+31,hy-63,hz);fork(c,...hand,.83,-.35+Math.sin(p*TAU)*.9,'#eef5ee','#344457')}});
 objs.sort((a,b)=>b.depth-a.depth).forEach(o=>o.fn());
 if(busy(q.scene)){let hit=project(105,15,30);burst(c,...hit,p,C.white,17,62);for(let j=0;j<6;j++){const r=30+j*12,ang=p*TAU+j;let pt=project(hx+Math.cos(ang)*r,hy-68,Math.sin(ang)*r);P(c,[[pt[0]-10,pt[1]],[pt[0],pt[1]-13],[pt[0]+9,pt[1]]],j%2?'#fed089':'#78f9f1')}}
 R(c,26,27,189,17,'#263653b8');R(c,30,31,181*(.58+.35*Math.abs(Math.sin(t*.2))),9,'#8df0b7');T(c,'ORIGINAL / LV.47',27,60,15,'#eff9ea');
}

// 2. Phosphor lines only; vector-art depth, skeletal pilot and fork constellation.
function vectors(c,t,q,en,o){
 R(c,0,0,960,470,'#020c0e');const p=phase(t,q,o.local),cx=480+Math.sin(t*.4)*95,cy=211+Math.cos(t*.32)*20;
 for(let z=0;z<13;z++){const d=fract(z/13+t*.22),r=25+d*d*620,a=t*.25;const pts=[];for(let i=0;i<6;i++){let th=i*TAU/6+a;pts.push([cx+Math.cos(th)*r,cy+Math.sin(th)*r*.69])}P(c,pts,null,z%3?'#146c65':'#39ccb4',z%3?1:2)}
 for(let i=0;i<24;i++){let a=i*TAU/24+t*.25;L(c,[[cx+Math.cos(a)*18,cy+Math.sin(a)*13],[cx+Math.cos(a)*900,cy+Math.sin(a)*620]],'#114a49',1)}
 function wireFighter(x,y,s,dir,shadow){c.save();c.translate(x,y);c.scale(s*dir,s);const col=shadow?'#ff8a5e':'#8bf8be',lean=Math.sin(p*TAU)*15;P(c,[[-22,-89],[20,-89],[17,-45],[-14,-43]],null,col,2);P(c,[[-16,-119],[-7,-134],[13,-131],[21,-115],[11,-95],[-10,-99]],null,col,2);L(c,[[-20,-115],[17,-115]],col,2);P(c,[[-14,-116],[-3,-116],[-3,-109],[-14,-109]],null,col,1);P(c,[[3,-116],[14,-116],[14,-109],[3,-109]],null,col,1);L(c,[[-13,-43],[-27+lean,-20],[-43+lean,0]],col,3);L(c,[[13,-44],[35,-29],[56,0]],col,3);L(c,[[-21,-82],[-42,-60],[-29,-39]],col,3);L(c,[[19,-81],[48,-68],[77,-83+lean]],col,3);fork(c,88,-101+lean,.66,.8,null,col);P(c,[[-12,-86],[8,-85],[4,-53],[-6,-53]],null,col,1);c.restore()}
 wireFighter(365+Math.sin(p*TAU)*100,374,1.4,1,false);wireFighter(720,342,1.05,-1,true);
 for(let i=0;i<7;i++){const x=120+i*110,y=63+Math.sin(t*1.2+i)*23;P(c,[[x,y-12],[x+16,y+6],[x,y+16],[x-16,y+6]],null,'#ffd57d',1);L(c,[[x-8,y],[x+8,y]],'#ffd57d',1)}
 if(busy(q.scene)){E(c,576,221,30+150*p,12+62*p,null,'#defdde',2);burst(c,576,221,p,'#dbffd5',18,140)}
 T(c,'VECTOR // AUTHOR 01',28,27,14,'#5efbbb');T(c,'COPY SWARM: 1000',934,442,14,'#ffb974','right');
}

// Shared high-resolution cel figure. Limbs bend individually and retain identity.
const pose={
 guard:{hip:[0,-57],ch:[-8,-101],head:[-9,-134],lk:[-19,-29],lf:[-32,0],rk:[24,-28],rf:[42,0],le:[-43,-88],lh:[-28,-117],re:[31,-91],rh:[51,-110]},
 dash:{hip:[-8,-45],ch:[34,-76],head:[63,-92],lk:[-35,-22],lf:[-76,-7],rk:[21,-19],rf:[58,0],le:[-3,-82],lh:[-48,-81],re:[52,-57],rh:[85,-37]},
 cut:{hip:[0,-57],ch:[19,-100],head:[30,-132],lk:[-29,-27],lf:[-54,0],rk:[38,-26],rf:[64,0],le:[-6,-92],lh:[-31,-62],re:[61,-103],rh:[103,-96]},
 air:{hip:[0,-57],ch:[23,-96],head:[40,-126],lk:[-32,-30],lf:[-62,-46],rk:[42,-33],rf:[64,-8],le:[-9,-100],lh:[-56,-123],re:[59,-119],rh:[77,-161]},
 tired:{hip:[0,-35],ch:[-15,-74],head:[-37,-99],lk:[-31,-15],lf:[-57,0],rk:[32,-5],rf:[59,0],le:[-49,-43],lh:[-56,-11],re:[14,-44],rh:[35,-20]}
};
function celLimb(c,a,b,r0,r1,col){let x=b[0]-a[0],y=b[1]-a[1],l=Math.hypot(x,y)||1,n=[-y/l,x/l];P(c,[[a[0]+n[0]*r0,a[1]+n[1]*r0],[b[0]+n[0]*r1,b[1]+n[1]*r1],[b[0]-n[0]*r1,b[1]-n[1]*r1],[a[0]-n[0]*r0,a[1]-n[1]*r0]],col,C.ink,2)}
function celHead(c,x,y,s=1,ang=0,shadow=false){c.save();c.translate(x,y);c.rotate(ang);c.scale(s,s);P(c,[[-18,-17],[-9,-25],[13,-22],[22,-8],[19,12],[7,23],[-9,18],[-19,5]],shadow?'#8e6676':C.skin,C.ink,2);P(c,[[10,-18],[21,-8],[18,13],[7,23],[-4,18],[10,11]],shadow?'#4a3f60':C.skin2);P(c,[[-19,1],[-25,-14],[-17,-30],[-7,-35],[4,-31],[12,-34],[23,-22],[26,-5],[18,1],[13,-17],[8,-15],[2,-21],[-8,-15],[-13,-18],[-17,-3]],shadow?'#47516b':C.hair,C.ink,2);P(c,[[-18,-24],[-7,-33],[4,-29],[-3,-25],[-1,-23],[-11,-18]],shadow?'#606b7f':'#f3f2dc');P(c,[[-16,-5],[-4,-4],[-4,3],[-16,3]],'#f7f7e5',C.ink,2);P(c,[[3,-4],[16,-6],[16,3],[3,3]],'#f7f7e5',C.ink,2);L(c,[[-4,-2],[3,-2]],C.ink,2);L(c,[[-10,-3],[-10,3]],C.ink,2);L(c,[[8,-3],[8,3]],C.ink,2);L(c,[[-15,-10],[-4,-8]],C.ink,2);L(c,[[4,-8],[16,-12]],C.ink,2);L(c,[[-5,13],[6,13]],C.ink,2);c.restore()}
function celHero(c,x,y,s,name='guard',flip=false,shadow=false,t=0){const p=pose[name]||pose.guard,hip=p.hip,ch=p.ch,coat=shadow?'#65456b':C.coat;c.save();c.translate(x,y);c.scale(flip?-s:s,s);P(c,[[hip[0]-15,hip[1]-17],[hip[0]+15,hip[1]-12],[hip[0]+37,hip[1]+30],[hip[0]-42-Math.sin(t*7)*12,hip[1]+16]],shadow?'#332640':C.navy,C.ink,2);celLimb(c,[hip[0]-9,hip[1]],p.lk,9,7,C.navy);celLimb(c,p.lk,p.lf,7,5,C.navy);celLimb(c,[hip[0]+9,hip[1]],p.rk,9,7,C.navy);celLimb(c,p.rk,p.rf,7,5,C.navy);for(let foot of[p.lf,p.rf])P(c,[[foot[0]-7,foot[1]-5],[foot[0]+7,foot[1]-5],[foot[0]+17,foot[1]+3],[foot[0]-7,foot[1]+3]],C.ink);celLimb(c,[ch[0]-16,ch[1]],p.le,9,7,coat);celLimb(c,p.le,p.lh,7,4,coat);P(c,[[ch[0]-19,ch[1]-7],[ch[0]+17,ch[1]-7],[hip[0]+17,hip[1]+7],[hip[0]-16,hip[1]+7]],coat,C.ink,3);P(c,[[ch[0]-5,ch[1]-7],[ch[0]+7,ch[1]-5],[hip[0]+7,hip[1]+5],[hip[0]-6,hip[1]+4]],shadow?'#946f83':C.gold);P(c,[[ch[0]-17,ch[1]-6],[ch[0]-7,ch[1]-7],[ch[0]+2,ch[1]+12],[ch[0]-10,ch[1]+22]],C.edge);celLimb(c,[ch[0]+17,ch[1]],p.re,9,7,coat);celLimb(c,p.re,p.rh,7,4,coat);for(let hand of[p.lh,p.rh])E(c,...hand,5,5,shadow?'#a48291':C.skin,C.ink,1);celHead(c,...p.head,1,0,shadow);fork(c,p.rh[0]+9,p.rh[1]-13,.9,name==='air'?.1:.92,shadow?'#f4abbb':C.white);c.restore()}
function slash(c,x,y,r,rot,u,col){if(u<0||u>1)return;c.save();c.translate(x,y);c.rotate(rot);const points=[];for(let i=0;i<=28;i++){const a=-2.5+i/28*3.5;points.push([Math.cos(a)*r,Math.sin(a)*r*.44])}for(let i=28;i>=0;i--){const a=-2.5+i/28*3.5,rr=r-35*Math.sin(i/28*PI);points.push([Math.cos(a)*rr,Math.sin(a)*rr*.44])}c.globalAlpha*=1-u*.6;P(c,points,col);c.restore()}

// 3. Clean cel cinema: low camera, giant foreground attacker, distant opponent.
function anime(c,t,q,en,o){
 const p=phase(t,q,o.local),final=q.chorus===3,tired=final&&!busy(q.scene),hit=clamp((p-.43)*6),bg=grad(c,[0,0],[0,470],[[0,'#242b5f'],[.48,'#dd8197'],[.76,'#ffcfa2'],[1,'#7b647a']]);R(c,0,0,960,470,bg);E(c,737,188,86,86,'#ffedbe');
 for(let k=0;k<12;k++){let x=k*96-(t*8)%96,h=43+hash(k)*125;P(c,[[x,330],[x,330-h],[x+19,312-h],[x+63,318-h],[x+63,330]],'#3b4164');L(c,[[x+2,330-h],[x+62,318-h]],'#907690',2)}
 P(c,[[0,350],[960,306],[960,470],[0,470]],'#242d45');for(let i=0;i<9;i++)L(c,[[i*150-140,470],[540+(i*150-620)*.2,325]],'#56526a',2);for(let j=0;j<4;j++)L(c,[[0,363+j*j*10],[960,337+j*j*10]],'#5d5368',1);
 const rush=smooth((p-.17)/.32),hx=mix(201,516,rush),hy=461-Math.sin(p*PI)*(busy(q.scene)?96:32),act=tired?'tired':p<.16?'guard':p<.43?'dash':p<.69?'cut':'guard';
 celHero(c,748+hit*55,378,1.03,hit>0?'air':'guard',true,true,t);
 if(p>.2&&p<.62)for(let j=3;j>0;j--){c.save();c.globalAlpha=.08;celHero(c,hx-j*49,hy+j*3,1.83,'dash',false,false,t);c.restore()}
 celHero(c,hx,hy,1.83,act,false,false,t);
 slash(c,592,235,313,-.16,(p-.42)/.4,'#fff8d1');slash(c,596,242,290,-.14,(p-.44)/.4,'#6be9e0');
 if(p>.41&&p<.65)burst(c,732,202,p,'#fff8d5',34,130);
 if(p<.18){P(c,[[0,35],[439,18],[396,132],[0,162]],'#1c243a');c.save();c.beginPath();c.moveTo(0,35);c.lineTo(439,18);c.lineTo(396,132);c.lineTo(0,162);c.closePath();c.clip();celHead(c,221,155,4.6,-.08,false);c.restore();L(c,[[0,162],[396,132],[439,18]],'#ffd18d',3)}
 if(busy(q.scene))for(let i=0;i<16;i++){let y=46+i*24,x=hash(i)*180;L(c,[[x,y],[x+150+hash(i+4)*220,y-12]],'#ffdbc465',1)}
}

// 4. Constructed pre-render-like RPG: stone diamonds, bevels and warm materials.
function rpg(c,t,q,en,o){
 R(c,0,0,960,470,grad(c,[0,0],[0,470],[[0,'#262d38'],[1,'#49686c']]));const iso=(x,y,z=0)=>[480+(x-y)*37,152+(x+y)*18-z];
 function diamond(x,y,col,outline){let p=iso(x,y);P(c,[[p[0],p[1]-17],[p[0]+36,p[1]],[p[0],p[1]+17],[p[0]-36,p[1]]],col,outline,1)}
 for(let sum=-5;sum<18;sum++)for(let x=-6;x<=10;x++){let y=sum-x;if(y< -5||y>10)continue;const v=hash(x*31+y*13);diamond(x,y,v>.7?'#657b70':v>.3?'#778c7b':'#889586','#4c6260');let pos=iso(x,y);if(v>.68){L(c,[[pos[0]-17,pos[1]],[pos[0],pos[1]+8],[pos[0]+14,pos[1]+1]],'#a7ad88',1)}}
 function block(x,y,z,w,d,h,base){const a=iso(x,y,z),b=iso(x+w,y,z),cc=iso(x+w,y+d,z),dd=iso(x,y+d,z);
  // c is the near corner in this projection. Both front walls meet there;
  // a-b is a hidden rear wall and must not substitute for the missing c-d face.
  P(c,[cc,dd,[dd[0],dd[1]-h],[cc[0],cc[1]-h]],base[1],'#283a37',1);
  P(c,[b,cc,[cc[0],cc[1]-h],[b[0],b[1]-h]],base[2],'#283a37',1);
  P(c,[[a[0],a[1]-h],[b[0],b[1]-h],[cc[0],cc[1]-h],[dd[0],dd[1]-h]],base[0],'#c1c0a0',1)
 }
 const stone=['#a9b296','#6a8174','#435f5a'];
 for(let i=-3;i<8;i++){block(-4,i,0,1,.9,48+(i%3)*5,stone);block(i,-4,0,.9,1,48+(i%3)*5,stone)}
 for(let i=0;i<4;i++){let x=-2+i*2.6,y=-2;block(x,y,0,.72,.72,122,['#d1c5a0','#8f9d87','#607963']);block(x-.13,y-.13,118,1,1,12,['#e4d7af','#a6ab8b','#78876a']);let pp=iso(x+.35,y+.35,140);E(c,...pp,13,7,'#eacf8b');for(let j=0;j<5;j++)L(c,[[pp[0]+Math.sin(t*2+j)*4,pp[1]-j*5],[pp[0]+Math.cos(t*3+j)*7,pp[1]-j*5-9]],'#f9dc94',2)}
 // A gilded fork standing over the impossible cathedral of borrowed work.
 block(1.7,1.3,0,2,1.7,35,['#c7b693','#8d927a','#667765']);const monument=iso(2.7,2.1,92);fork(c,...monument,1.18,-.06,'#e9cd78','#746b48');
 function npc(x,y,s=1,grey=false){let pp=iso(x,y),bob=Math.sin(t*6+x)*2;E(c,pp[0],pp[1]+3,18*s,8*s,'#233d3b88');c.save();c.translate(pp[0],pp[1]+bob);c.scale(s,s);E(c,-6,-6,5,9,'#243348');E(c,7,-6,5,9,'#243348');P(c,[[-15,-39],[-8,-50],[10,-49],[16,-36],[14,-8],[-13,-8]],grad(c,[-16,-30],[16,-30],[[0,'#6f8894'],[.5,grey?'#506373':'#b0986d'],[1,'#263f51']]),'#243846',1);P(c,[[-4,-47],[4,-45],[5,-13],[-4,-14]],'#dcbb71');E(c,0,-60,12,15,'#d8bca0','#706a64',1);P(c,[[-12,-61],[-14,-71],[-4,-79],[8,-75],[14,-65],[10,-63],[6,-69],[-4,-67],[-9,-61]],grey?'#d4d9c5':'#95846c');L(c,[[-11,-61],[10,-62]],'#253746',2);L(c,[[-7,-59],[-2,-59]],'#243441',2);L(c,[[3,-59],[8,-59]],'#243441',2);fork(c,19,-36,.35,.19,'#f5dfaa','#5b665b');c.restore()}
 npc(5+Math.sin(t*.55)*.6,2.6,1.5,true);npc(.3,5.3+Math.sin(t*.5)*.4,.94,false);
 for(let i=0;i<6;i++){let pp=iso(7.7,i-2);E(c,pp[0],pp[1]-13,15,23,grad(c,[pp[0]-15,pp[1]],[pp[0]+15,pp[1]],[[0,'#5f8d66'],[.45,'#94a778'],[1,'#33584b']]));E(c,pp[0]-9,pp[1]-19,10,14,'#77926b');L(c,[[pp[0],pp[1]-8],[pp[0],pp[1]+5]],'#3d5245',4)}
 for(let i=0;i<28;i++){const x=hash(i)*960,y=45+fract(hash(i+7)+t*.023)*370;E(c,x,y,1.3,1.3,i%3?'#f3d992':'#97e2d1')}
}

// 5. DOS ray-cast labyrinth: column geometry and ordered dithering, no textures.
const maze=['1111111111111111','1000000000000001','1011110111011101','1010010100010001','1010010101010101','1000010001010101','1111011101010101','1001000001000101','1001110101111101','1000000100000001','1011110111110101','1000010000010101','1111011111010101','1000000000000001','1000000000000001','1111111111111111'];
function dos(c,t,q,en,o){
 const horizon=214,px=1.55+Math.sin(t*.31)*.14,py=1.53+Math.sin(t*.23)*.1,ang=.43+Math.sin(t*.24)*.58;
 R(c,0,0,960,horizon,'#261f2c');R(c,0,horizon,960,470-horizon,'#594138');
 for(let y=horizon+4;y<470;y+=5){const f=(y-horizon)/(470-horizon);for(let x=0;x<960;x+=8){const k=(Math.floor(x/8)+Math.floor(y/5))%4;R(c,x,y,3,2,k<2?'#7a5640':'#342f32')}if(y%15===4)L(c,[[0,y],[960,y]],'#282329',1)}
 const cols=160;for(let i=0;i<cols;i++){
  const a=ang+((i+.5)/cols-.5)*1.2,dx=Math.cos(a),dy=Math.sin(a),stepX=dx<0?-1:1,stepY=dy<0?-1:1;
  const deltaX=Math.abs(dx)>1e-9?Math.abs(1/dx):Infinity,deltaY=Math.abs(dy)>1e-9?Math.abs(1/dy):Infinity;
  let mapX=Math.floor(px),mapY=Math.floor(py),nextX=(dx<0?px-mapX:mapX+1-px)*deltaX,nextY=(dy<0?py-mapY:mapY+1-py)*deltaY,rayDistance=0,axis=0,hit=false;
  // Traverse actual grid boundaries. The closed 16x16 map needs fewer than
  // 32 crossings, and an open edge remains background instead of a fake wall.
  for(let k=0;k<64;k++){
   if(nextX<nextY){rayDistance=nextX;nextX+=deltaX;mapX+=stepX;axis=0}else{rayDistance=nextY;nextY+=deltaY;mapY+=stepY;axis=1}
   if(mapY<0||mapY>=maze.length||mapX<0||mapX>=maze[mapY].length)break;
   if(maze[mapY][mapX]==='1'){hit=true;break}
  }
  if(!hit||!Number.isFinite(rayDistance))continue;
  const xx=px+dx*rayDistance,yy=py+dy*rayDistance,d=rayDistance*Math.cos(a-ang),height=Math.min(730,335/Math.max(.15,d)),top=horizon-height*.5,side=axis===0,light=clamp(1-d/10),r=Math.floor((side?68:111)*light+36),g=Math.floor((side?54:89)*light+28),b=Math.floor((side?70:74)*light+33);R(c,i*6,top,6,height,`rgb(${r},${g},${b})`);
  for(let yy2=Math.max(0,Math.floor(top/6)*6);yy2<Math.min(470,top+height);yy2+=6){if((i+Math.floor(yy2/6))%3===0)R(c,i*6+1,yy2,2,2,'#342b3b');const brick=Math.floor((yy2-top)/Math.max(8,height/8));if(fract((yy2-top)/Math.max(8,height/8))<.13)R(c,i*6,yy2,6,1,'#302737');if((Math.floor((side?yy:xx)*5)+brick)%4===0)R(c,i*6,yy2,1,3,'#8b7662')}
 }
 // First-person sleeves and fork weapon; restrained recoil before a thrust.
 const p=phase(t,q,o.local),thrust=busy(q.scene)?Math.sin(clamp((p-.2)/.6)*PI)*46:Math.sin(t*4)*6,x=598+Math.sin(t*2)*9,y=486-thrust;
 P(c,[[x-72,y],[x-82,y-67],[x-45,y-90],[x-6,y-20],[x+6,y]],'#243949','#182330',3);P(c,[[x-70,y-63],[x-47,y-81],[x-33,y-62],[x-40,y-38]],'#708799');P(c,[[x-50,y-84],[x-52,y-102],[x-32,y-118],[x-10,y-103],[x-8,y-83],[x-27,y-65]],'#dcad8d','#614b54',2);fork(c,x-31,y-156,1.65,.06,'#b8c5be','#343b49');
 R(c,26,25,130,47,'#2f2435');T(c,'47',42,49,30,'#eac375');T(c,'ОРИГИНАЛ',185,49,16,'#d8c8a5');L(c,[[470,208],[480,218],[490,208]],'#a8c3ab',1);
}

// 6. Wide synthetic racer: curved segmented asphalt and a cockpit fork-shaped car.
function racer(c,t,q,en,o){
 const horizon=155;R(c,0,0,960,470,grad(c,[0,0],[0,470],[[0,'#130d33'],[.42,'#652459'],[1,'#151938']]));
 E(c,680,122,79,79,'#ff9e77');for(let j=0;j<8;j++)R(c,580,119+j*10,210,3+j*.6,'#652459');
 for(let layer=0;layer<2;layer++){const pts=[[0,205]];for(let i=0;i<=20;i++)pts.push([i*50,170-layer*25-hash(i+layer*51)*65]);pts.push([960,234],[0,234]);P(c,pts,layer?'#252454':'#472955');L(c,pts.slice(1,-2),layer?'#485180':'#a14b8a',1)}
 const curve=(z)=>Math.sin(t*.65+z*2.1)*125*z*z+Math.sin(t*.24)*55,road=[];
 for(let i=0;i<=45;i++){const z=i/45,y=horizon+z*z*315,w=23+z*z*375,x=480+curve(z);road.push({x,y,w,z})}
 for(let i=0;i<45;i++){let a=road[i],b=road[i+1],stripe=(i+Math.floor(t*34))%4<2;P(c,[[a.x-a.w-20*a.z,a.y],[a.x+a.w+20*a.z,a.y],[b.x+b.w+20*b.z,b.y],[b.x-b.w-20*b.z,b.y]],stripe?'#e652b0':'#fff1d3');P(c,[[a.x-a.w,a.y],[a.x+a.w,a.y],[b.x+b.w,b.y],[b.x-b.w,b.y]],i%2?'#26304c':'#293450');for(let lane of[-.34,.34])if(stripe)P(c,[[a.x+a.w*lane-2*a.z,a.y],[a.x+a.w*lane+2*a.z,a.y],[b.x+b.w*lane+3*b.z,b.y],[b.x+b.w*lane-3*b.z,b.y]],'#b0e2d3');
  if(i%4===0){for(let side of[-1,1]){let xx=b.x+side*(b.w+46*b.z),h=45*b.z;L(c,[[xx,b.y],[xx,b.y-h]],'#4ff9d2',3*b.z+.3);L(c,[[xx,b.y-h],[xx+side*30*b.z,b.y-h]],'#ff7acc',2*b.z+.2)}}
 }
 const traffic=fract(t*.17);for(let k=0;k<3;k++){const z=fract(traffic+k*.32),i=Math.min(44,Math.floor(z*44)),r=road[i],x=r.x+(k-1)*r.w*.46,y=r.y,s=.15+z*1.4;P(c,[[x-19*s,y],[x-15*s,y-22*s],[x+15*s,y-22*s],[x+21*s,y]],k%2?'#f16f9e':'#68d9d1','#172138',2);R(c,x-12*s,y-18*s,24*s,8*s,'#172b48');R(c,x-17*s,y-3*s,5*s,2*s,'#ffe1ae');R(c,x+12*s,y-3*s,5*s,2*s,'#ffe1ae')}
 const x=481+Math.sin(t*1.5)*22,y=444;E(c,x,y+3,103,11,'#02091d99');P(c,[[x-99,y],[x-72,y-34],[x-36,y-67],[x+37,y-67],[x+76,y-31],[x+98,y]],'#253753','#a9c5d0',2);P(c,[[x-50,y-44],[x-30,y-66],[x+30,y-66],[x+55,y-43]],'#17384d','#86e7db',2);E(c,x,y-58,11,12,C.hair,C.ink,1);L(c,[[x-7,y-57],[x+7,y-57]],C.ink,2);P(c,[[x-34,y-34],[x+35,y-34],[x+29,y-5],[x-28,y-5]],'#dab95b');for(let side of[-1,1]){R(c,x+side*71-17,y-18,34,9,'#ff76bc');L(c,[[x+side*35,y-21],[x+side*58,y+2]],'#75f5d8',3)}fork(c,x+92,y-80,.56,.19,'#bad3d2','#304557');
 T(c,`${Math.round(147+en*110)} KM/H`,28,32,21,'#fbd49b');T(c,'ONE ORIGINAL',933,32,15,'#99f1df','right');
}

// 7. Extreme editorial comic panels: huge eye, weapon perspective, tiny long shot.
function comic(c,t,q,en,o){
 const p=phase(t,q,o.local);R(c,0,0,960,470,'#141626');
 function panel(points,fill,fn){c.save();P(c,points,fill);c.beginPath();points.forEach((pt,i)=>i?c.lineTo(...pt):c.moveTo(...pt));c.closePath();c.clip();fn();c.restore();P(c,points,null,'#111522',6)}
 function dots(x,y,w,h,col,r=2,step=10){for(let yy=y;yy<y+h;yy+=step)for(let xx=x;xx<x+w;xx+=step)E(c,xx+(Math.floor(yy/step)%2)*step*.5,yy,r,r,col)}
 panel([[12,12],[541,12],[484,223],[12,265]],'#f0d27a',()=>{dots(10,8,550,258,'#d49a6f',2.2,10);celHead(c,266,238,6.6,-.1,false);for(let i=0;i<13;i++)L(c,[[12,45+i*15],[107+hash(i)*81,35+i*15]],'#201d2b',2)});
 panel([[562,12],[948,12],[948,315],[501,218]],'#ef82a2',()=>{dots(505,0,455,320,'#803e78',2.5,12);const x=736,y=170;for(let i=0;i<36;i++){const a=i/36*TAU;L(c,[[x+Math.cos(a)*58,y+Math.sin(a)*58],[x+Math.cos(a)*400,y+Math.sin(a)*400]],'#341e3d',i%4?1:3)}fork(c,735,174,2.7,.82+Math.sin(p*PI)*.23,'#fff4bd','#252436');P(c,[[688,258],[701,221],[725,214],[748,235],[748,260],[726,279]],C.skin,C.ink,3)});
 panel([[12,285],[477,242],[612,456],[12,456]],'#65c9ce',()=>{dots(10,241,606,220,'#238d9f',1.8,10);P(c,[[0,425],[600,346],[610,470],[0,470]],'#24455c');for(let i=0;i<12;i++)L(c,[[i*58,459],[361+(i*58-361)*.2,362]],'#5c9eaa',1);celHero(c,251+Math.sin(p*TAU)*67,441,1.14,p<.5?'dash':'cut',false,false,t);celHero(c,485,406,.71,'guard',true,true,t);slash(c,381,340,188,-.1,(p-.4)/.5,'#fff1bb')});
 panel([[511,247],[948,335],[948,456],[636,456]],'#f1ecdb',()=>{dots(511,247,447,220,'#9289a0',1.7,10);for(let i=0;i<9;i++){let x=556+i*46,y=333+(i%3)*14;P(c,[[x-16,y-29],[x+15,y-30],[x+22,y+26],[x-24,y+27]],'#343650');E(c,x,y-38,12,15,'#4b4a64');L(c,[[x-8,y-39],[x+8,y-39]],'#f8e7c4',3)}T(c,'× 1000',752,424,26,'#343047','center')});
 if(busy(q.scene)){c.save();c.translate(675,298);c.rotate(-.14);c.font='900 54px sans-serif';c.lineWidth=7;c.strokeStyle='#171529';c.strokeText('КРАХ!',-63,0);c.fillStyle='#fff3c4';c.fillText('КРАХ!',-63,0);c.restore()}
}
const modes=[handheld,ps1,vectors,anime,rpg,dos,racer,comic];
function render(ctx,t,look,q={},energy=.3,options={}){
 const w=options.w||960,h=options.h||540,i=((Math.floor(look)%8)+8)%8;
 ctx.save();ctx.scale(w/960,h/540);ctx.beginPath();ctx.rect(0,0,960,470);ctx.clip();modes[i](ctx,t,q,clamp(energy),options);ctx.restore();return true;
}
const api={render,names:['Handheld 1-bit','PS1 low-poly arena','Vector arcade','Cel anime duel','Isometric RPG','DOS labyrinth','Synth racer','Halftone comic']};root.VilkaGames=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
