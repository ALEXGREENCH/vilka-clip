/* Twelve original, asset-free moving art worlds for Вилка.
 * Browser: window.VilkaWorlds; CommonJS: require('./procedural-worlds').
 * render(ctx,t,look,q,energy,{w:960,h:540,local,cycle}) -> true.
 * Authored at 960x540. Everything below y=470 is kept free for caller captions.
 * No offscreen canvases, image caches, fonts, libraries or prerecorded frames.
 */
(function(root){
'use strict';
const names=['noir','impasto','ukiyo-e','stained-glass','constructivist','charcoal','surrealism','shadow-theatre','rubber-hose','cut-paper','art-deco','photogram'];
const bg=['#080c13','#243854','#e8d9b5','#090d21','#eee5cc','#d7d0bb','#d6b073','#dfbc78','#efe8ce','#e9c7af','#111320','#030d1b'];
const TAU=Math.PI*2;
function clamp(x,a=0,b=1){return Math.max(a,Math.min(b,x));}
function noise(i,j=0){const n=Math.sin(i*127.1+j*311.7)*43758.5453;return n-Math.floor(n)}
function P(c,a,f,s=null,l=1){c.beginPath();a.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));c.closePath();if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=l;c.stroke()}}
function L(c,a,s,l=1){c.beginPath();a.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));c.strokeStyle=s;c.lineWidth=l;c.stroke()}
function B(c,fn,f=null,s=null,l=1){c.beginPath();fn(c);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=l;c.stroke()}}
function E(c,x,y,rx,ry,f,s=null,l=1,rot=0){c.beginPath();c.ellipse(x,y,rx,ry,rot,0,TAU);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=l;c.stroke()}}
function R(c,x,y,w,h,f){c.fillStyle=f;c.fillRect(x,y,w,h)}
function fork(c,x,y,s,angle,col,l=6){c.save();c.translate(x,y);c.rotate(angle);c.scale(s,s);c.lineCap='round';L(c,[[0,64],[0,-9]],col,l);B(c,p=>{p.moveTo(-18,-49);p.lineTo(-18,-18);p.quadraticCurveTo(0,5,18,-18);p.lineTo(18,-49)},null,col,l);L(c,[[-6,-49],[-6,-12]],col,l*.75);L(c,[[6,-49],[6,-12]],col,l*.75);c.restore()}
function bread(c,x,y,s,angle,col,ink,style=0){c.save();c.translate(x,y);c.rotate(angle);c.scale(s,s);B(c,p=>{p.moveTo(-48,15);p.bezierCurveTo(-70,-44,52,-66,62,3);p.quadraticCurveTo(67,35,29,39);p.lineTo(-27,36);p.quadraticCurveTo(-46,32,-48,15)},col,ink,style?2:4);for(let i=0;i<4;i++)B(c,p=>{p.moveTo(-26+i*22,-12);p.quadraticCurveTo(-19+i*22,-5,-21+i*22,5)},null,ink,3);c.restore()}
function human(c,x,y,s,col,headCol=col,lean=0){c.save();c.translate(x,y);c.rotate(lean);c.scale(s,s);E(c,0,-62,14,20,headCol);P(c,[[-9,-44],[-30,-27],[-24,18],[23,18],[30,-27],[10,-44]],col);L(c,[[-12,16],[-19,66]],col,12);L(c,[[13,16],[21,66]],col,12);L(c,[[-24,-26],[-36,18]],col,9);L(c,[[24,-26],[39,9]],col,9);c.restore()}
function text(c,str,x,y,size,color,angle=0,weight='900'){c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=color;c.font=weight+' '+size+'px sans-serif';c.fillText(str,0,0);c.restore()}
function plate(c,x,y,s,col,ink){E(c,x,y,87*s,25*s,col,ink,3*s);E(c,x,y-2*s,65*s,15*s,null,ink,2*s)}
function grain(c,t,col,alpha=.1,count=160){c.save();c.globalAlpha=alpha;for(let i=0;i<count;i++){const x=noise(i,Math.floor(t*9))*960,y=noise(i+311,2)*466;R(c,x,y,1+noise(i,3)*3,1,col)}c.restore()}

function noir(c,t,d){
 const k=d.energy;const g=c.createLinearGradient(0,0,960,470);g.addColorStop(0,'#111926');g.addColorStop(.5,'#2b3541');g.addColorStop(1,'#03060b');R(c,0,0,960,470,g);
 // One high window and hard blinds, a low camera and a monumental detective.
 P(c,[[34,19],[468,48],[468,300],[34,385]],'#819197');
 c.save();c.beginPath();c.rect(35,20,433,360);c.clip();
 for(let i=0;i<17;i++){const x=35+i*27,hh=40+noise(i,1)*111;R(c,x,298-hh,21,hh,'#36434c');for(let j=0;j<3;j++)R(c,x+5,308-hh+j*29,3,6,'#a1adb0')}
 for(let i=0;i<63;i++){const x=36+noise(i,2)*430,y=(noise(i,3)*400+t*104)%405;L(c,[[x,y],[x-11,y+32]],'#c1c9c4',.7)}c.restore();
 for(let i=0;i<9;i++){P(c,[[30,20+i*39],[478,49+i*28],[478,61+i*28],[30,36+i*39]],'#0b1019');P(c,[[0,366+i*19],[473,287+i*12],[783,353+i*22],[230,505+i*20]],i%2?'#0e141f':'#42474c')}
 L(c,[[247,32],[247,339]],'#090e15',13);L(c,[[30,19],[470,48],[470,303]],'#080d16',8);
 // Detectives and interviewees share the same face hidden by an impossible hat shadow.
 const bob=Math.sin(t*1.3)*2;P(c,[[552,458],[579,300],[647,260],[673,239],[719,239],[744,271],[805,314],[847,470]],'#080b11');
 P(c,[[671,249],[655,284],[689,332],[695,391],[720,288],[716,247]],'#7b878b');P(c,[[658,284],[626,293],[656,333],[641,341],[686,413]],'#292f38');
 B(c,p=>{p.moveTo(650,181+bob);p.bezierCurveTo(641,222,667,265,694,268);p.bezierCurveTo(723,255,742,222,730,178+bob);p.closePath()},'#627279');
 P(c,[[628,174+bob],[656,119+bob],[717,114+bob],[742,175+bob]],'#070a0f');P(c,[[598,179+bob],[645,165+bob],[736,164+bob],[783,185+bob],[752,198+bob],[623,196+bob]],'#05080d');
 L(c,[[662,211+bob],[685,208+bob]],'#c9d0c8',1.8);L(c,[[697,208+bob],[719,210+bob]],'#c9d0c8',1.8);L(c,[[682,213],[697,213]],'#080d14',3);
 P(c,[[486,393],[960,363],[960,471],[396,471]],'#080b12');plate(c,776,395,.63,'#3e4b52','#889491');fork(c,880,365,.42,.7,'#a8b3b2',5);
 if(d.paper){P(c,[[529,382],[687,373],[740,407],[547,421]],'#899391');text(c,'47',575,407,26,'#18232e',-.08)}
 if(d.copies)for(let i=0;i<5;i++)human(c,69+i*57,372,.43,'#11161e');
 grain(c,t,'#eee9d7',.1,210);if(k>.65)L(c,[[34,37],[126,138],[110,151],[262,295]],'#899399',1.3);
}

function impasto(c,t,d){
 R(c,0,0,960,470,'#173e60');const colors=['#276790','#2e7897','#405b8b','#639092','#284f7e','#e8c665','#d5a64d'];
 // Individual broken brush strokes bend around the swirling suns.
 for(let i=0;i<700;i++){
  const x=noise(i,1)*975,y=noise(i,2)*473,sky=y<286;
  let angle=sky?Math.atan2(y-127,x-662)+1.2+Math.sin(t*.25)*.14:Math.sin(x*.015+t*.2)*.18;
  const len=sky?10+noise(i,3)*27:13+noise(i,3)*31,co=sky?colors[i%5]:['#6b7658','#bea662','#728b77','#d6b473'][i%4];
  c.save();c.translate(x,y);c.rotate(angle);R(c,0,0,len,3+noise(i,4)*5,co);if(i%4===0)R(c,2,-1,len*.72,1,'#d5c798');c.restore();
 }
 for(let j=0;j<5;j++){
  let cx=j===0?669:80+j*177,cy=j===0?114:52+(j%2)*94;
  for(let r=8;r<59-(j?25:0);r+=5)B(c,p=>{for(let a=0;a<=TAU*1.6;a+=.13){let rad=r+a*2.4;let xx=cx+Math.cos(a+t*.13)*rad,yy=cy+Math.sin(a+t*.13)*rad*.66;a===0?p.moveTo(xx,yy):p.lineTo(xx,yy)}},null,['#e6cb6b','#e2b555','#839b93'][r%3],3);
 }
 B(c,p=>{p.moveTo(0,323);p.bezierCurveTo(194,223,310,344,456,297);p.bezierCurveTo(657,219,838,275,960,230);p.lineTo(960,470);p.lineTo(0,470)},'#6e8464');
 for(let i=0;i<195;i++){const x=noise(i,11)*960,y=312+noise(i,12)*158;L(c,[[x,y],[x+13+Math.sin(t+x*.02)*6,y-6]],['#c2b365','#a9a870','#547a64','#e2c778'][i%4],4)}
 // The gigantic fork is painted as a dark cypress; the figure has an empty plate.
 fork(c,174,272,2.5,-.12,'#173b42',11);fork(c,170,272,2.3,-.12,'#315753',5);
 human(c,533,354,.83,'#24393f','#dbb985',Math.sin(t*.7)*.035);plate(c,561,355,.34,'#bcc5a1','#294b52');
 bread(c,790,366,1.05,-.14,'#d6a35c','#825f3c',1);
 if(d.copies)for(let i=0;i<6;i++)human(c,615+i*44,310-i*3,.22,'#365549');
 if(d.anger){for(let i=0;i<22;i++)L(c,[[493+i*4,232],[507+i*6,198-noise(i)*32]],'#b55741',5)}
}

function ukiyo(c,t,d){
 R(c,0,0,960,470,'#e8d9b5');grain(c,0,'#665850',.14,200);
 E(c,711,112,71,71,'#c85145');P(c,[[437,318],[614,134],[797,317]],'#596c7b');P(c,[[536,217],[614,134],[690,211],[651,196],[627,210],[602,190],[580,212]],'#efdfbc');
 for(let i=0;i<8;i++)B(c,p=>{p.moveTo(0,291+i*24);p.bezierCurveTo(220,244+i*21,445,352+i*12,960,268+i*25)},null,i%2?'#728a95':'#2e526a',3);
 // A single sculpted breaking wave with hooked foam, not a reskinned landscape.
 const sw=Math.sin(t*.7)*9;
 B(c,p=>{p.moveTo(-20,470);p.lineTo(-20,281);p.bezierCurveTo(150,292,170,87,343,77);p.bezierCurveTo(454,66,492,149,412,202);p.bezierCurveTo(418,134,360,125,319,165);p.bezierCurveTo(261,227,342,364,579,394);p.lineTo(966,470);p.closePath()},'#24475d');
 for(let i=0;i<11;i++)B(c,p=>{p.moveTo(-20,315+i*13);p.bezierCurveTo(162,330+i*7,225,137+i*9,338,102+i*7);p.bezierCurveTo(381,88+i*8,411,120+i*6,397,151+i*5)},null,i%3?'#e7d6b4':'#94aab0',2.8);
 for(let i=0;i<24;i++){
  const a=-2.85+i*.088,x=341+Math.cos(a)*136,y=199+Math.sin(a)*116;
  B(c,p=>{p.moveTo(x-13,y+13);p.quadraticCurveTo(x+6,y-15,x+22,y-11+sw*.12);p.quadraticCurveTo(x+8,y-27,x-8,y-10);p.quadraticCurveTo(x-18,y-1,x-13,y+13)},'#f0e4c9','#183d54',1);
 }
 for(let i=0;i<34;i++){const x=253+noise(i,3)*305,y=109+noise(i,4)*188;E(c,x+sw,y+Math.sin(t+i)*4,2,6,'#eee0c0',null,1,-.6)}
 P(c,[[486,348],[762,359],[718,394],[527,382]],'#957455','#283f4d',2);for(let i=0;i<10;i++)L(c,[[505+i*23,355],[530+i*19,382]],'#e0bd82',2);
 fork(c,639,307,.67,-.3,'#2b4656',5);human(c,656,339,.33,'#283f4d');
 if(d.bread)bread(c,838,338,.52,-.11,'#c69c65','#2e4b5a',1);
 R(c,863,26,39,85,'#b34439');text(c,'47',868,83,29,'#eddcb9',0,'700');
}

function glass(c,t,d){
 R(c,0,0,960,470,'#090d20');const glasscol=['#255c98','#703983','#ac3f62','#da984e','#4b9b9a','#39428c'];
 // Radiating leaded rose window and pointed cathedral side windows.
 const cx=480,cy=229,pulse=1+d.energy*.025;
 for(let ring=3;ring>=1;ring--)for(let i=0;i<18;i++){
  let a=i/18*TAU+.01*Math.sin(t*.4),r0=(ring-1)*58+21,r1=ring*59+21;
  let pts=[[cx+Math.cos(a)*r0,cy+Math.sin(a)*r0],[cx+Math.cos(a+.16)*r1*pulse,cy+Math.sin(a+.16)*r1*pulse],[cx+Math.cos(a+.34)*r0,cy+Math.sin(a+.34)*r0]];
  P(c,pts,glasscol[(i+ring)%6],'#080d1a',5);
 }
 for(let i=0;i<18;i++){let a=i/18*TAU;E(c,cx+Math.cos(a)*201,cy+Math.sin(a)*201,17,17,glasscol[i%6],'#070c17',5)}
 E(c,cx,cy,204,204,null,'#b68b55',4);E(c,cx,cy,61,61,'#a46056','#111122',7);
 fork(c,cx,cy,1.16,0,'#efdba0',7);
 for(const side of [-1,1]){
  let x=480+side*328;
  B(c,p=>{p.moveTo(x-75,441);p.lineTo(x-75,149);p.quadraticCurveTo(x-72,88,x,22);p.quadraticCurveTo(x+72,88,x+75,149);p.lineTo(x+75,441);p.closePath()},'#182e59','#bd9a69',4);
  for(let j=0;j<6;j++){let yy=148+j*48;P(c,[[x-64,yy],[x,yy-37],[x+64,yy],[x,yy+37]],glasscol[(j+(side===1?2:0))%6],'#0b1226',6)}
  human(c,x,339,.95,'#173957','#d2bd93');E(c,x,278,24,31,null,'#ebbd75',4);
  L(c,[[x,117],[x,436]],'#0a1023',4);L(c,[[x-65,208],[x+65,208]],'#0a1023',5);
 }
 for(let i=0;i<12;i++){let x=30+i*81;P(c,[[x,470],[x+40,426],[x+80,470]],glasscol[i%6],'#0b0c1a',4)}
 c.save();c.globalAlpha=.08+d.energy*.07;for(let i=0;i<9;i++)P(c,[[480,226],[noise(i,4)*960,470],[noise(i,4)*960+64,470]],'#efe1a0');c.restore();
 if(d.copies){for(let i=0;i<6;i++)fork(c,274+i*82,438,.2,0,'#d6c68e',4)}
}

function construct(c,t,d){
 R(c,0,0,960,470,'#e9e0c5');const red='#b93a2b',black='#202228';
 P(c,[[0,57],[960,0],[960,131],[0,410]],red);P(c,[[0,412],[960,156],[960,195],[0,455]],black);
 E(c,703,246,186,186,red);E(c,703,246,165,165,null,'#24262a',8);
 c.save();c.translate(214,242);c.rotate(-.28);text(c,'47',-157,125,299,black);c.restore();
 // A huge angular revolutionary arm raises the same fork as a demand for food.
 P(c,[[487,470],[515,313],[557,269],[611,278],[668,330],[689,470]],black);
 P(c,[[563,269],[562,213],[585,179],[617,191],[625,224],[606,270]],'#eee3c1',black,5);
 P(c,[[551,289],[492,217],[466,175],[490,157],[535,206],[590,279]],black);
 P(c,[[476,174],[459,132],[466,109],[479,100],[492,110],[500,143],[491,165]],'#ece0c1',black,4);
 fork(c,457,88,.88,-.34,'#22262b',8);
 P(c,[[563,283],[592,313],[605,274],[607,398],[564,398]],red);L(c,[[579,218],[603,211]],black,3);
 // Copies become stamped sheets marching diagonally across the poster.
 const n=d.copies?9:5;for(let i=0;i<n;i++){let x=727+(i%3)*64,y=81+Math.floor(i/3)*62;P(c,[[x,y],[x+40,y-10],[x+42,y+30],[x+1,y+40]],'#eee2c4',black,2);L(c,[[x+9,y+8],[x+30,y+3]],red,4)}
 for(let i=0;i<15;i++)L(c,[[0,457-i*4],[322,372-i*4]],'#e6d9b9',1);
 if(d.bread)bread(c,805,368,.71,-.28,'#e8d6a7',black,1);
 if(d.anger){let z=Math.sin(t*5)*9;P(c,[[677,23],[709+z,16],[776,103],[750,116]],'#f1e7ce')}
}

function charcoal(c,t,d){
 R(c,0,0,960,470,'#d8d1bd');const tick=Math.floor(t*10),ink='#37353a';
 function rough(a,col=ink,w=1.2,seed=0){for(let k=0;k<3;k++)L(c,a.map((p,i)=>[p[0]+(noise(i+seed,k+tick)-.5)*3.2,p[1]+(noise(i+19+seed,k+tick)-.5)*3.2]),col,w*(k===0?1:.45))}
 // A hand-drawn perspective corridor full of vacant chairs, no enclosing panels.
 rough([[0,18],[479,160],[960,18]],ink,1.6);rough([[0,470],[479,268],[960,470]],ink,2);
 rough([[479,160],[479,268]],ink,1.4);
 for(let i=0;i<8;i++){const u=i/8,xx=50+u*310,yy=402-u*134,s=1-u*.7;rough([[xx-27*s,yy],[xx-26*s,yy-58*s],[xx+25*s,yy-58*s],[xx+27*s,yy]],ink,1.5,i);rough([[xx-30*s,yy],[xx+32*s,yy],[xx+31*s,yy+11*s],[xx-29*s,yy+11*s],[xx-30*s,yy]],ink,2,i);rough([[xx-25*s,yy+10*s],[xx-30*s,yy+50*s]],ink,2,i);rough([[xx+25*s,yy+10*s],[xx+33*s,yy+45*s]],ink,2,i)}
 // The sketch sits hunched over a blank application; restrained breathing moves its back.
 const b=Math.sin(t*1.2)*3;
 B(c,p=>{p.moveTo(626,217+b);p.bezierCurveTo(579,258,572,331,596,368);p.lineTo(730,368);p.bezierCurveTo(723,301,706,254,674,236)},'#777267');
 rough([[620,220+b],[594,246],[580,319],[597,367],[732,368],[708,281],[675,238]],ink,3,40);
 E(c,651,203+b,30,39,'#d2c9b5',ink,2,-.24);rough([[624,179],[640,162],[666,164],[680,181]],ink,7,56);
 rough([[621,195],[648,193],[652,211],[627,212],[621,195]],ink,1.3);rough([[653,193],[675,197],[670,215],[654,211],[653,193]],ink,1.3);
 rough([[641,237],[689,271],[704,310],[768,325]],ink,10,81);rough([[595,371],[654,380],[683,450]],ink,12);rough([[711,371],[736,403],[757,456]],ink,12);
 P(c,[[716,315],[837,299],[875,330],[755,349]],'#ece3cc',ink,1);rough([[711,327],[933,307],[935,323],[715,343]],ink,2);rough([[729,343],[721,470]],ink,3);rough([[914,326],[950,470]],ink,3);
 text(c,'47',772,327,23,'#474145',-.15,'400');
 for(let i=0;i<130;i++){const x=582+noise(i,8)*139,y=250+noise(i,9)*111;rough([[x,y],[x+8,y-12]],'#524f4a',.4,i+100)}
 if(d.anger)for(let i=0;i<19;i++)rough([[665,122],[653+(i-8)*17,49+noise(i)*52]],ink,.8,i);
 grain(c,0,'#3f3e36',.17,220);
}

function surreal(c,t,d){
 const g=c.createLinearGradient(0,0,0,470);g.addColorStop(0,'#476c77');g.addColorStop(.55,'#d6c399');g.addColorStop(.56,'#baa26d');g.addColorStop(1,'#d2b77f');R(c,0,0,960,470,g);
 E(c,246,96,33,33,'#e6d39a');P(c,[[718,265],[778,203],[808,263],[861,238],[960,272]],'#827e69');
 // Empty plate as a floating moon, impossibly long fork shadow across the desert.
 const lift=Math.sin(t*.55)*13;E(c,370,398,192,29,'#9b835b');plate(c,349,224+lift,1.78,'#e6dac0','#6e7567');
 fork(c,389,216,2.38,-.32,'#293d44',8);P(c,[[411,305],[434,309],[934,463],[848,469]],'#7a775f');
 // Bare branch holds an elastic clock. Tick marks deform with the painted face.
 B(c,p=>{p.moveTo(718,463);p.bezierCurveTo(710,344,725,204,739,125);p.lineTo(705,90);p.lineTo(747,124);p.lineTo(781,69);p.lineTo(758,136);p.lineTo(847,110)},null,'#493e37',11);
 const sag=13+Math.sin(t*.7)*9;
 B(c,p=>{p.moveTo(679,187);p.bezierCurveTo(714,148,803,154,829,192);p.bezierCurveTo(836,230,786,243,776,266+sag);p.bezierCurveTo(761,308+sag,747,304,741,262);p.bezierCurveTo(722,239,675,231,679,187)},'#ddd1a6','#514d44',3);
 for(let i=0;i<12;i++){const a=i/12*TAU,x=754+Math.cos(a)*59,y=207+Math.sin(a)*41+Math.max(0,Math.sin(a))**5*sag;L(c,[[x,y],[x-Math.cos(a)*7,y-Math.sin(a)*7]],'#4f4d45',2)}
 L(c,[[754,207],[727,189]],'#414546',3);L(c,[[754,207],[775,226+sag*.2]],'#414546',2);E(c,754,207,3,3,'#414546');
 // A door without a building and a bread-shaped cloud are deliberately incongruous.
 R(c,98,233,56,125,'#3e4b4c');P(c,[[154,233],[193,213],[193,337],[154,358]],'#a19676','#374749',2);E(c,181,279,2,2,'#2b383a');P(c,[[99,358],[154,358],[399,453],[302,458]],'#8d825d');
 human(c,588,346,.38,'#33494c');bread(c,506,106,.5,.06,'#c4c1a3','#a0997e',1);
 if(d.copies)for(let i=0;i<7;i++)E(c,65+i*44,427-i*3,13,5,'#d4c49f','#736d57',1);
}

function shadow(c,t,d){
 const g=c.createRadialGradient(484,232,50,480,236,470);g.addColorStop(0,'#f4dd9d');g.addColorStop(1,'#9f6c44');R(c,0,0,960,470,g);
 // Paper proscenium, swinging cut-out limbs and visible marionette strings.
 P(c,[[0,0],[197,0],[182,92],[124,175],[65,307],[50,470],[0,470]],'#342235');P(c,[[960,0],[763,0],[778,92],[839,175],[901,307],[914,470],[960,470]],'#342235');
 for(let i=0;i<17;i++){const x=i*61;B(c,p=>{p.moveTo(x-2,0);p.lineTo(x+64,0);p.quadraticCurveTo(x+41,74+(i%2)*17,x+15,45);p.closePath()},'#41253a')}
 R(c,0,442,960,30,'#302436');
 const sway=Math.sin(t*1.5)*.12,ax=457+Math.sin(t*.9)*11,ay=326;
 c.save();c.translate(ax,ay);c.rotate(sway);
 E(c,0,-98,28,34,'#352739');P(c,[[-26,-129],[-11,-143],[17,-137],[24,-121]],'#352739');P(c,[[-19,-66],[-41,-39],[-33,40],[35,40],[33,-38],[17,-66]],'#352739');
 const aa=Math.sin(t*2)*21;L(c,[[-31,-38],[-69,-4],[-98,-28+aa]],'#352739',15);L(c,[[29,-37],[72,-66],[92,-104-aa]],'#352739',15);
 for(let i=0;i<2;i++){let s=i?1:-1;L(c,[[s*17,37],[s*29,72],[s*(34+Math.sin(t*2+s)*8),112]],'#352739',15);E(c,s*30,110,22,7,'#352739')}
 for(const p of [[-31,-38],[-69,-4],[29,-37],[72,-66],[-17,37],[17,37]])E(c,p[0],p[1],3,3,'#c69969');
 L(c,[[-98,-28+aa],[-105,-350]],'#53364a',.8);L(c,[[92,-104-aa],[116,-350]],'#53364a',.8);L(c,[[0,-131],[0,-350]],'#53364a',.8);
 fork(c,102,-112-aa,.58,.2,'#352739',5);c.restore();
 // A loaf suspended like an unattainable prize and a cast of very small copies.
 const by=219+Math.sin(t*1.4)*13;L(c,[[708,0],[708,by-24]],'#503147',1);bread(c,708,by,.83,Math.sin(t)*.07,'#483047','#efce93',1);
 if(d.copies||d.paper)for(let i=0;i<6;i++)human(c,208+i*30,413,.2,'#493246');
 for(let i=0;i<14;i++){E(c,182+i*48,460,16,16,'#1f202c')}
 grain(c,0,'#61483a',.12,180);
}

function cartoon(c,t,d){
 R(c,0,0,960,470,'#eee7d0');const ink='#262b30';
 // Rubber-hose cartoon staging: broad tiled bakery, bouncing bread and elastic worker.
 for(let i=0;i<9;i++)B(c,p=>{p.moveTo(i*122-40,323);p.quadraticCurveTo(i*122+27,273+Math.sin(i+t)*6,i*122+92,323)},null,'#9c9b88',2);
 for(let j=0;j<5;j++)for(let i=0;i<16;i++)if((i+j)%2===0)P(c,[[i*64-50,358+j*26],[i*64+14,358+j*26],[i*70+14,384+j*26],[i*70-56,384+j*26]],'#c4c3ae');
 R(c,626,89,206,177,'#dedbc4');L(c,[[626,89],[832,89],[832,266],[626,266],[626,89]],ink,5);for(let i=0;i<4;i++){L(c,[[638,139+i*32],[820,139+i*32]],ink,3);bread(c,666+(i%2)*60,126+i*33,.19,.1,'#ada68c',ink,1)}
 const bob=Math.sin(t*4.2)*13,stretch=1+Math.sin(t*4.2)*.04;
 c.save();c.translate(382,276+bob);c.scale(1/stretch,stretch);
 B(c,p=>{p.moveTo(-35,45);p.bezierCurveTo(-87,68,-77,101,-36,101)},null,ink,15);B(c,p=>{p.moveTo(28,44);p.bezierCurveTo(68,63,90,88,59,108)},null,ink,15);
 E(c,-30,106,29,12,ink);E(c,66,112,29,12,ink);E(c,0,1,63,78,ink);
 E(c,0,-60,66,65,'#eee7cf',ink,5);P(c,[[-61,-76],[-56,-108],[-25,-137],[10,-132],[28,-137],[52,-115],[61,-79],[44,-99],[20,-90],[0,-107],[-27,-94]],ink);
 E(c,-22,-64,16,26,'#f7efda',ink,2);E(c,22,-64,16,26,'#f7efda',ink,2);E(c,-18,-60,7,14,ink);E(c,25,-60,7,14,ink);
 L(c,[[-43,-78],[-5,-78],[-5,-46],[-43,-46],[-43,-78]],ink,3);L(c,[[3,-78],[43,-78],[43,-46],[3,-46],[3,-78]],ink,3);L(c,[[-5,-70],[3,-70]],ink,3);
 E(c,4,-33,9,8,ink);B(c,p=>{p.moveTo(-25,-17);p.quadraticCurveTo(0,d.anger?15:-4,27,-17)},null,ink,3);
 E(c,0,16,22,27,'#ded7bb');text(c,'47',-16,23,22,ink,0,'700');
 B(c,p=>{p.moveTo(-49,-2);p.bezierCurveTo(-102,-39,-109,-66,-146,-40)},null,ink,12);B(c,p=>{p.moveTo(51,-2);p.bezierCurveTo(95,33,136,3,132,-41)},null,ink,12);
 E(c,-146,-38,18,17,'#eee7cf',ink,3);E(c,132,-43,18,17,'#eee7cf',ink,3);fork(c,140,-88,.64,.15,ink,5);
 c.restore();
 const by=344-Math.abs(Math.sin(t*3))*29;bread(c,702,by,.91,Math.sin(t*3)*.1,'#bbb396',ink);E(c,690,by-11,6,13,ink);E(c,720,by-14,6,13,ink);
 L(c,[[683,by+26],[674,404]],ink,7);L(c,[[723,by+26],[736,404]],ink,7);E(c,667,407,17,7,ink);E(c,742,407,17,7,ink);
 if(d.anger)for(let i=0;i<7;i++)L(c,[[450+i*8,126],[459+i*12,99]],ink,2);
 grain(c,t,'#343d3a',.08,100);
}

function collage(c,t,d){
 R(c,0,0,960,470,'#e8c7af');const ink='#242b41';
 // Large torn pieces overlap with actual offset paper shadows.
 function sheet(a,col){P(c,a.map(p=>[p[0]+7,p[1]+8]),'#af958b');P(c,a,col)}
 sheet([[0,22],[332,0],[366,77],[317,131],[352,203],[274,221],[303,328],[0,383]],'#839b9a');
 sheet([[655,0],[960,0],[960,383],[846,369],[824,301],[786,320],[790,203],[734,199]],'#d57368');
 sheet([[0,406],[192,363],[269,400],[441,337],[614,380],[786,352],[960,405],[960,470],[0,470]],'#dc9b6e');
 for(let i=0;i<11;i++)L(c,[[45,40+i*23],[223+(i%3)*38,21+i*23]],'#445966',i%3===0?5:2);
 // Newspaper portrait is assembled from mismatched cut-out shapes.
 const bob=Math.sin(t*.8)*4;
 sheet([[340,469],[357,282+bob],[421,244+bob],[461,259+bob],[513,240+bob],[583,290+bob],[615,470]],'#3d5369');
 sheet([[429,89+bob],[508,75+bob],[552,123+bob],[533,220+bob],[481,261+bob],[427,222+bob],[411,139+bob]],'#e7b58c');
 sheet([[413,141+bob],[395,115+bob],[418,66+bob],[467,46+bob],[504,53+bob],[528,36+bob],[560,88+bob],[549,139+bob],[521,115+bob],[508,134+bob],[469,100+bob],[445,130+bob]],'#dad8cc');
 sheet([[423,153+bob],[472,148+bob],[473,178+bob],[431,180+bob]],'#eee2c8');sheet([[485,150+bob],[535,153+bob],[529,181+bob],[486,177+bob]],'#eae0c9');
 E(c,453,165+bob,5,10,ink);E(c,506,165+bob,5,10,ink);L(c,[[424,150+bob],[472,148+bob],[475,181+bob],[427,183+bob],[424,150+bob]],ink,3);L(c,[[485,148+bob],[537,151+bob],[534,180+bob],[486,180+bob],[485,148+bob]],ink,3);
 sheet([[479,173+bob],[467,205+bob],[495,208+bob]],'#bd856e');L(c,[[457,224+bob],[506,218+bob]],ink,3);
 sheet([[438,265+bob],[480,293+bob],[519,257+bob],[511,391+bob],[451,394+bob]],'#c5936e');
 for(let i=0;i<7;i++)L(c,[[464,313+i*10],[496,309+i*10]],'#78565b',1);
 // Big perforated disc, collage fork and hand-labelled age ticket.
 E(c,746,125,93,93,'#f3dba3','#b88068',3);for(let i=0;i<22;i++){const a=i/22*TAU;E(c,746+Math.cos(a)*86,125+Math.sin(a)*86,3,3,'#bd9b80')}
 fork(c,199,307,1.55,-.4,ink,9);sheet([[705,268],[849,249],[863,333],[719,351]],'#ece0b8');text(c,'47',739,322,66,'#3a4351',-.13);
 if(d.bread)bread(c,170,134,.62,-.2,'#d6a175','#494d5b',1);
 if(d.copies)for(let i=0;i<4;i++)sheet([[656+i*42,377],[681+i*42,367],[690+i*42,431],[665+i*42,439]],i%2?'#dba68a':'#718e96');
}

function deco(c,t,d){
 R(c,0,0,960,470,'#0f1422');const gold='#b89b64',light='#e4c992';
 // Symmetrical theatre architecture, scalloped fan and converging staircases.
 for(let i=0;i<17;i++){const a=Math.PI+i/16*Math.PI;const xx=480+Math.cos(a)*392,yy=333+Math.sin(a)*314;P(c,[[480,334],[xx,yy],[480+Math.cos(a+.06)*392,333+Math.sin(a+.06)*314]],i%2?'#303748':'#1d2638');L(c,[[480,333],[xx,yy]],gold,1.5)}
 for(let i=0;i<6;i++){E(c,480,334,390-i*42,313-i*31,null,i%2?gold:'#394153',1.5)}
 R(c,0,330,960,142,'#111726');
 for(let i=0;i<7;i++){const yy=354+i*17,left=332-i*43,right=627+i*43;P(c,[[left,yy],[right,yy],[right+34,yy+15],[left-34,yy+15]],i%2?'#2c3342':'#192234');L(c,[[left,yy],[right,yy]],gold,1.6)}
 for(const s of [-1,1]){
  const x=480+s*371;R(c,x-40,97,80,267,'#212a3b');for(let i=0;i<7;i++)L(c,[[x-30+i*10,103],[x-30+i*10,358]],gold,1.4);P(c,[[x-52,96],[x-29,68],[x+29,68],[x+52,96]],gold);R(c,x-54,358,108,12,gold);
  for(let i=0;i<4;i++)P(c,[[x,21+i*14],[x+49-i*10,57+i*14],[x-49+i*10,57+i*14]],i%2?'#2c3546':gold);
 }
 c.save();c.globalAlpha=.12;const sw=Math.sin(t*.65)*92;P(c,[[95,94],[442+sw,406],[706+sw,406]],light);P(c,[[864,94],[196-sw,406],[553-sw,406]],light);c.restore();
 // A live-performance silhouette, the fork itself is the microphone.
 const b=Math.sin(t*1.3)*2;human(c,480,293+b,.87,'#090f1c','#d1b681',Math.sin(t*.5)*.025);
 P(c,[[468,252+b],[483,267+b],[491,250+b],[486,297],[472,297]],'#d8bc7f');L(c,[[455,275],[437,298],[473,313]],gold,2);
 fork(c,526,272,.51,0,light,6);L(c,[[526,305],[526,392]],gold,2.3);L(c,[[504,394],[548,394]],gold,2.3);
 text(c,'47',443,139,66,gold,0,'400');L(c,[[432,156],[528,156]],gold,2);P(c,[[480,171],[490,181],[480,191],[470,181]],gold);
 if(d.copies)for(let i=0;i<8;i++)human(c,218+i*73,393,.2,'#a08c64');
 if(d.anger){for(let i=0;i<9;i++){const x=109+i*92;L(c,[[x,421],[x,427+Math.sin(t*8+i)*8]],light,2)}}
}

function photogram(c,t,d){
 R(c,0,0,960,470,'#061020');const cyan='#87d4d2',blue='#2d879e';
 // A photogram: translucent bones and utensils arranged on an exposed plate.
 const g=c.createRadialGradient(420,244,15,450,235,495);g.addColorStop(0,'#17455c');g.addColorStop(1,'#020c1a');R(c,0,0,960,470,g);
 c.save();c.globalCompositeOperation='screen';
 function bone(a,b,r){L(c,[a,b],blue,r+7);L(c,[a,b],cyan,r);E(c,a[0],a[1],r*.7,r*.7,'#bbdfcd');E(c,b[0],b[1],r*.7,r*.7,'#bbdfcd')}
 // Open hand dominates the composition, fingers articulate separately around a fork.
 const rot=Math.sin(t*.65)*.035;c.save();c.translate(349,323);c.rotate(rot);
 E(c,0,30,48,44,null,blue,18);E(c,0,30,27,29,null,cyan,2);
 for(let i=0;i<5;i++){
  const xx=-44+i*22,top=-69-[0,38,53,35,0][i],bend=Math.sin(t*.9+i)*4;
  bone([xx*.5,38],[xx,-18],8);bone([xx,-18],[xx+bend,top*.63],9);bone([xx+bend,top*.63],[xx+bend*.8,top],7);bone([xx+bend*.8,top],[xx+bend*.6,top-27],6);
 }
 bone([-18,63],[-33,157],13);bone([20,64],[42,157],12);c.restore();
 fork(c,477,173,1.65,-.38,cyan,5);fork(c,488,175,1.65,-.38,'#367394',2);
 E(c,725,354,146,70,null,blue,13);E(c,725,354,141,65,null,cyan,2);E(c,725,354,104,44,null,cyan,2);E(c,725,354,70,27,null,blue,3);
 // Ghost rib cage evokes an original person that the copies omit.
 c.save();c.globalAlpha=.65;c.translate(741,168);L(c,[[0,-96],[0,117]],cyan,5);
 for(let i=0;i<9;i++){
  const yy=-75+i*17,ww=32+Math.sin(i/9*Math.PI)*45;
  B(c,p=>{p.moveTo(-4,yy);p.bezierCurveTo(-ww,-13+yy,-ww-10,29+yy,-8,38+yy)},null,blue,7);
  B(c,p=>{p.moveTo(4,yy);p.bezierCurveTo(ww,-13+yy,ww+10,29+yy,8,38+yy)},null,cyan,3);
 }c.restore();
 if(d.copies)for(let i=0;i<6;i++){c.globalAlpha=.11+i*.025;fork(c,110+i*39,163,.78,-.3,cyan,5)}
 if(d.bread){c.globalAlpha=.36;bread(c,123,342,.86,-.27,'#72c4bc','#a6e5da',1)}
 c.restore();
 // Scan fog is spatially continuous and dim, no strobing negative frames.
 const scan=(t*19)%470;const fog=c.createLinearGradient(0,scan-50,0,scan+50);fog.addColorStop(0,'rgba(146,206,206,0)');fog.addColorStop(.5,'rgba(146,206,206,.07)');fog.addColorStop(1,'rgba(146,206,206,0)');R(c,0,scan-50,960,100,fog);
 grain(c,t,'#c7eece',.12,120);
}

const worlds=[noir,impasto,ukiyo,glass,construct,charcoal,surreal,shadow,cartoon,collage,deco,photogram];
function render(ctx,t,look,q,energy,options){
 options=options||{};q=q||{};t=Number(t)||0;look=((Math.floor(Number(look)||0)%12)+12)%12;
 const w=Number(options.w)||960,h=Number(options.h)||540,scene=String(q.scene||'');
 const e=typeof energy==='number'?energy:energy&&typeof energy.value==='number'?energy.value:energy&&typeof energy.rms==='number'?energy.rms:0;
 const d={energy:clamp(e),local:Number(options.local)||0,cycle:Number(options.cycle)||0,
  anger:/test|joke|laugh|doors|life|ask/.test(scene),copies:/cop|original|chorus|library/.test(scene),
  bread:/bread|rise|diploma|discount|retrain|cracker|hungry|warm/.test(scene),
  paper:/age|experien|panel|flex|resume|finish|erase|rewrite|learn|mail|move|calendar/.test(scene)};
 ctx.save();ctx.scale(w/960,h/540);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.lineCap='round';ctx.lineJoin='round';
 R(ctx,0,0,960,540,bg[look]);ctx.beginPath();ctx.rect(0,0,960,470);ctx.clip();
 worlds[look](ctx,t,d);ctx.restore();return true;
}
const api={render,names,width:960,height:540,captionSafeY:470};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.VilkaWorlds=api;
})(typeof globalThis!=='undefined'?globalThis:this);
