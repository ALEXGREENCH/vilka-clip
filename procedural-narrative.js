/* Semantic foreground for Вилка. Original live Canvas geometry only.
 * VilkaNarrative.render(ctx,t,q,shot,energy); ctx already uses 960 x 540 units.
 * A shot supplies motif/local/duration/progress/intensity. q is a timeline row.
 * Physical props carry the story; the artwork stays visible between them.
 * All painting is clipped above y=450, before finishing and final captions.
 */
(function(root){
'use strict';
const C={ink:'#141a28',paper:'#f0e7d1',paperShade:'#b9b6ae',gold:'#dfb976',red:'#c85e65',cyan:'#acd4d2',coat:'#394859',skin:'#dcbca4',hair:'#bec9cd',bread:'#d49a57',crust:'#76533d'};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,p)=>a+(b-a)*p;
function hash(i){const q=Math.sin(i*127.1+74.7)*43758.5453;return q-Math.floor(q)}
function P(c,a,f,s=null,w=1){c.beginPath();a.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=w;c.stroke()}}
function L(c,a,s=C.ink,w=2){c.beginPath();a.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle=s;c.lineWidth=w;c.stroke()}
function B(c,fn,f=null,s=null,w=1){c.beginPath();fn(c);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=w;c.stroke()}}
function E(c,x,y,rx,ry,f,s=null,w=1){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,Math.PI*2);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=w;c.stroke()}}
function R(c,x,y,w,h,f){c.fillStyle=f;c.fillRect(x,y,w,h)}
function T(c,str,x,y,size,col=C.ink,weight='600',align='left'){c.font=weight+' '+size+'px sans-serif';c.textAlign=align;c.textBaseline='alphabetic';c.fillStyle=col;c.fillText(str,x,y)}
function local(c,x,y,s,angle,fn){c.save();c.translate(x,y);c.rotate(angle||0);c.scale(s,s);fn();c.restore()}
function shade(c,x,y,w,h,alpha=.3){c.save();c.globalAlpha*=alpha;c.translate(x,y);c.scale(1,h/w);const g=c.createRadialGradient(0,0,w*.15,0,0,w);g.addColorStop(0,'#060913');g.addColorStop(1,'rgba(6,9,19,0)');c.fillStyle=g;c.fillRect(-w,-w,w*2,w*2);c.restore()}
function light(c,x,y,r){c.save();const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,225,175,.075)');g.addColorStop(1,'rgba(255,225,175,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore()}
function fork(c,x,y,s,a=0,col=C.paper){local(c,x,y,s,a,()=>{L(c,[[0,67],[0,-10]],C.ink,9);L(c,[[0,65],[0,-10]],col,5);B(c,p=>{p.moveTo(-21,-55);p.lineTo(-21,-18);p.quadraticCurveTo(0,4,21,-18);p.lineTo(21,-55)},null,C.ink,8);B(c,p=>{p.moveTo(-21,-55);p.lineTo(-21,-18);p.quadraticCurveTo(0,4,21,-18);p.lineTo(21,-55)},null,col,4);L(c,[[-7,-54],[-7,-10]],col,4);L(c,[[7,-54],[7,-10]],col,4)})}
function plate(c,x,y,s=1){shade(c,x+6,y+15,103*s,28*s,.34);E(c,x,y,104*s,30*s,C.paper,C.ink,2.5);E(c,x,y-1,84*s,20*s,null,C.paperShade,2);E(c,x,y-2,70*s,15*s,null,'#727985',1.1);B(c,p=>{p.moveTo(x-90*s,y-2*s);p.quadraticCurveTo(x-12*s,y-37*s,x+74*s,y-9*s)},null,'#fff8e6',2)}
function person(c,x,y,s=1,{faint=false,hollow=false,arm=0,sad=false}={}){local(c,x,y,s,0,()=>{
 const coat=hollow?'rgba(60,75,89,.15)':C.coat;P(c,[[-20,-8],[-43,9],[-47,73],[43,73],[38,6],[18,-9]],coat,C.ink,3);L(c,[[-20,72],[-23,124]],C.ink,14);L(c,[[19,72],[24,124]],C.ink,14);E(c,-23,125,17,5,C.ink);E(c,28,125,17,5,C.ink);
 P(c,[[-16,-5],[1,13],[18,-7],[15,45],[-15,45]],C.paperShade);P(c,[[-16,2],[-2,15],[-12,23]],C.ink);P(c,[[18,1],[2,15],[13,25]],C.ink);
 E(c,0,-35,26,34,hollow?'rgba(216,195,170,.12)':C.skin,C.ink,2.5);P(c,[[-26,-35],[-29,-59],[-15,-72],[4,-75],[14,-67],[25,-67],[31,-47],[25,-33],[17,-50],[3,-46],[-5,-55],[-19,-40]],C.hair,C.ink,2);
 L(c,[[-24,-39],[-4,-38],[-4,-25],[-22,-25],[-24,-39]],C.ink,2);L(c,[[4,-38],[24,-39],[22,-25],[4,-25],[4,-38]],C.ink,2);L(c,[[-4,-35],[4,-35]],C.ink,2);E(c,-13,-33,2,4,C.ink);E(c,13,-33,2,4,C.ink);
 B(c,p=>{p.moveTo(-10,-12);p.quadraticCurveTo(0,sad?-19:-11,11,-12)},null,C.ink,1.5);
 L(c,[[-36,10],[-47,39],[-49,58-arm*35]],C.ink,9);L(c,[[35,9],[49,34],[55,54-arm*36]],C.ink,9);E(c,-49,58-arm*35,5,6,C.skin);E(c,55,54-arm*36,5,6,C.skin);
 })}
function chair(c,x,y,s=1,tilt=0){local(c,x,y,s,tilt,()=>{shade(c,0,99,57,12,.24);B(c,p=>{p.moveTo(-39,4);p.lineTo(-43,-66);p.quadraticCurveTo(-43,-101,0,-103);p.quadraticCurveTo(39,-100,42,-68);p.lineTo(40,4);p.closePath()},C.coat,C.ink,4);P(c,[[-48,9],[47,9],[54,29],[-54,29]],'#606b76',C.ink,3);L(c,[[-39,30],[-48,100]],C.ink,7);L(c,[[39,30],[50,101]],C.ink,7);L(c,[[-38,-65],[-35,-4]],'#a9b4b9',1);L(c,[[0,-94],[0,5]],'#566471',1)})}
function sheet(c,x,y,s=1,angle=0,opts={}){local(c,x,y,s,angle,()=>{
 P(c,[[-92,-122],[82,-122],[99,-105],[99,128],[-92,128]],'rgba(4,8,16,.28)');P(c,[[-98,-131],[72,-131],[91,-112],[91,121],[-98,121]],C.paper,C.ink,2);
 P(c,[[72,-131],[72,-112],[91,-112]],C.paperShade,C.ink,1);
 if(opts.portrait!==false){R(c,-76,-106,46,57,'#bac2bf');person(c,-53,-77,.23,{sad:opts.sad});}
 R(c,-16,-99,76,5,'#67727a');R(c,-16,-80,53,3,'#9b9d98');
 for(let i=0;i<5;i++)R(c,-73,-20+i*21,132-(i%3)*19,2.3,'#9d9f98');
 if(opts.age){T(c,'47',-15,-45,24,C.ink);const e=clamp(opts.erase||0);if(e>0){c.save();c.beginPath();c.rect(-22,-72,74*e,35);c.clip();R(c,-22,-72,74,35,C.paper);c.restore();for(let i=0;i<8;i++)R(c,-22+74*e+hash(i)*9,-53+hash(i+12)*20,2,1,C.paperShade)}}
 if(opts.cross){const p=ease(opts.cross);L(c,[[-76,-106],[-76+130*p,-106+185*p]],C.red,7);if(p>.45)L(c,[[54,-106],[54-130*(p-.45)/.55,-106+185*(p-.45)/.55]],C.red,7)}
 if(opts.code){L(c,[[-48,-41],[-59,-32],[-48,-23]],C.coat,2.5);L(c,[[40,-41],[51,-32],[40,-23]],C.coat,2.5);L(c,[[8,-46],[-3,-19]],C.coat,2)}
 })}
function book(c,x,y,s=1,a=0){local(c,x,y,s,a,()=>{P(c,[[-84,-41],[-6,-28],[0,60],[-85,39]],C.paper,C.ink,3);P(c,[[0,-27],[86,-45],[83,40],[0,60]],'#d6d5c8',C.ink,3);L(c,[[0,-27],[0,60]],'#5b6370',4);for(let i=0;i<6;i++){L(c,[[-72,-23+i*9],[-16,-13+i*9]],'#8a918e',1);L(c,[[13,-13+i*9],[70,-25+i*9]],'#79858a',1)}})}
function loaf(c,x,y,s=1,a=0,tie=false){local(c,x,y,s,a,()=>{shade(c,2,49,69,13,.30);B(c,p=>{p.moveTo(-62,15);p.bezierCurveTo(-77,-61,54,-73,69,2);p.quadraticCurveTo(76,42,40,46);p.lineTo(-27,44);p.quadraticCurveTo(-62,39,-62,15)},C.bread,C.ink,3);B(c,p=>{p.moveTo(-55,7);p.bezierCurveTo(-49,-38,24,-57,53,-16)},null,'#edc887',6);for(let i=0;i<4;i++)B(c,p=>{p.moveTo(-37+i*23,-19);p.quadraticCurveTo(-22+i*23,-10,-28+i*23,6)},null,C.crust,4);if(tie){P(c,[[-18,20],[0,35],[18,20],[10,51],[-8,50]],C.paper);P(c,[[0,34],[-6,41],[0,71],[8,43]],C.red);E(c,-27,16,3,4,C.ink);E(c,29,16,3,4,C.ink)}})}
function envelope(c,x,y,s=1,open=0){local(c,x,y,s,0,()=>{shade(c,5,87,128,19,.28);P(c,[[-118,-43],[118,-43],[118,86],[-118,86]],C.paper,C.ink,2);P(c,[[-118,-43],[0,-43-open*89],[118,-43]],'#d1d4c8',C.ink,2);P(c,[[-118,86],[0,8],[118,86]],'#dedfce',C.ink,1.2);L(c,[[-118,-43],[0,29],[118,-43]],'#8c9699',1.5)})}
function shortWriting(c,lines,x,y,w,size=18,col=C.ink){c.save();c.beginPath();c.rect(x-2,y-size,w+4,lines.length*(size+11)+8);c.clip();for(let i=0;i<lines.length;i++)T(c,lines[i],x,y+i*(size+11),size,col,'400');c.restore()}

function plateScene(c,t,d){const x=d.scene==='salary'?662:477,y=355;light(c,x,y,166);plate(c,x,y,1.15);let tapping=d.scene==='intro'?Math.max(0,Math.sin(t*3.7))**10:0;const a=d.scene==='salary'?-.42+d.line*.19:.25;fork(c,x+133,y-92-tapping*14,.74,a,C.paper);if(tapping>.6){for(let i=0;i<3;i++)L(c,[[x+56+i*9,y-48-i*4],[x+61+i*12,y-65-i*7]],C.paper,.8)}if(d.scene==='salary'){fork(c,x-120,y-81,.57,-.7,C.gold);L(c,[[x-82,y-128],[x+55,y-128]],C.gold,2);E(c,x-82,y-128,4,4,C.gold);E(c,x+55,y-128,4,4,C.gold)}}
function interview(c,t,d){
 const clear=ease(d.scene==='age'?d.line:1);light(c,717,248,190);sheet(c,723,237,.87,.055,{age:true,erase:clear});
 if(d.scene==='age'){const x=698+clear*66;local(c,x,202,1,-.12,()=>{R(c,-14,-11,36,22,C.red);R(c,11,-11,11,22,C.paperShade);L(c,[[-14,-11],[22,-11],[22,11]],C.ink,1.5)});}
 chair(c,251,327,.62);if(d.scene==='experience'){for(let i=0;i<4;i++){const yy=340-i*22;P(c,[[150,yy],[277,yy-8],[283,yy+6],[154,yy+14]],i%2?'#9fb4b5':'#bdab91',C.ink,1)}}
 if(d.scene==='team'){for(let i=0;i<3;i++)person(c,205+i*57,337,.28,{arm:.2});}
 if(d.scene==='hungry'){plate(c,260,355,.72);fork(c,349,300,.44,.35)}
}
function library(c,t,d){
 const p=ease(d.line);light(c,572,268,242);book(c,336,309,1.15,-.04);person(c,239,310,.53,{sad:true});
 for(let i=0;i<10;i++){const row=Math.floor(i/5),col=i%5,delay=i*.056,move=ease(clamp((p-delay)/.46)),x=mix(343,532+col*53,move),y=mix(308,209+row*91,move)-Math.sin(move*Math.PI)*(35+row*16);c.save();c.globalAlpha*=.2+.8*move;sheet(c,x,y,.245,mix(-.1,(col-2)*.07,move),{code:true,portrait:false});c.restore();}
 // The flow carries his work away, while the original remains by the empty book.
 if(p>.38){c.save();c.globalAlpha*=ease((p-.38)/.5);L(c,[[290,302],[248,285]],C.red,2);L(c,[[245,281],[254,278]],C.red,2);c.restore()}
}
function rejection(c,t,d){
 light(c,704,277,176);chair(c,710,319,.93,d.scene==='chair'?-.08*(1-ease(d.line)):0);sheet(c,403,313,.66,-.16,{cross:d.scene==='flexibility'?ease(d.line):1,sad:true});
 // A rigid ruler bows, then springs upright with the lyric about flexibility.
 if(d.scene==='flexibility'){B(c,p=>{p.moveTo(554,172);p.quadraticCurveTo(599+Math.sin(d.line*Math.PI)*47,260,554,371)},null,C.gold,6);for(let i=0;i<11;i++)L(c,[[554,183+i*17],[562,184+i*17]],C.ink,1)}
 if(d.scene==='chair')person(c,709,271,.52,{sad:true});
 if(d.scene==='panel')for(let i=0;i<3;i++){const x=163+i*60;E(c,x,218,17,21,C.ink);P(c,[[x-13,237],[x-28,264],[x+28,264],[x+12,237]],C.ink);L(c,[[x-11,216],[x+11,216]],C.paperShade,2)}
}
function copies(c,t,d){
 const phase=ease(d.progress),distribution=d.motif==='distribution';light(c,521,285,238);
 const n=distribution?16:12;
 for(let i=n-1;i>=0;i--){
  const col=i%4,row=Math.floor(i/4),p=ease(clamp(phase*1.4-i*.022)),targetX=510+col*71,targetY=147+row*82;
  let x=mix(337,targetX,p),y=mix(301,targetY,p),a=(col-1.5)*.046;
  if(distribution){const fly=ease(clamp((d.progress-.47-i*.008)*2.5));x+=Math.sin(i*2.4)*fly*192;y-=fly*(46+row*18);a+=fly*Math.sin(i)*.30}
  c.save();c.globalAlpha*=.4+.55*p;sheet(c,x,y,.275,a,{sad:false});c.restore();
 }
 person(c,293,282,.83,{sad:true,hollow:distribution});plate(c,309,407,.64);
 if(distribution){c.save();c.globalAlpha*=.5;for(let i=0;i<11;i++){const f=clamp((d.progress-.26-i*.032)*1.7),x=329+f*(210+hash(i)*174),y=297-f*(100+hash(i+2)*115);P(c,[[x,y],[x+12,y-2],[x+12,y+17],[x-1,y+18]],C.paper); }c.restore();}
 if(d.scene==='original'){c.save();c.globalAlpha*=.7;E(c,293,256,60,83,null,C.gold,1.7);c.restore()}
}
function hunger(c,t,d){
 light(c,488,338,158);plate(c,482,370,1.31);fork(c,665,288,.78,.49);person(c,267,296,.58,{sad:true});
 // A single crumb fails to become a meal, then vanishes into the empty plate.
 const a=(d.scene==='empty'||d.scene==='hungry')?1-ease(d.line):.18;
 c.save();c.globalAlpha*=a;P(c,[[468,361],[473,354],[480,362],[476,367]],C.bread,C.crust,1);c.restore();
 if(d.scene==='design'){L(c,[[697,352],[728,389],[769,326]],C.red,4);L(c,[[712,330],[758,391]],C.red,4)}
}
function breadScene(c,t,d){
 const sc=d.scene,progress=ease(d.line);let y=sc==='rise'?mix(353,260,progress):306;
 light(c,629,296,215);
 if(sc==='rise'){for(let i=0;i<5;i++){P(c,[[452+i*53,397-i*28],[504+i*53,397-i*28],[504+i*53,417],[452+i*53,417]],'#59666b',C.paperShade,1)}L(c,[[471,358],[542,333],[621,291],[700,226]],C.gold,3);P(c,[[689,224],[707,219],[703,238]],C.gold)}
 const isCrackers=sc==='crackers'||sc==='retrain';const split=isCrackers?(sc==='retrain'?progress*.6:progress):0;
 c.save();c.globalAlpha*=1-split;loaf(c,621,y,.98,-.055,true);c.restore();
 if(isCrackers)for(let i=0;i<14;i++){const a=i*2.4,x=mix(620,528+(i%7)*31,split),yy=mix(307,334+Math.floor(i/7)*42,split);local(c,x,yy,1,Math.sin(a)*split*.22,()=>{c.save();c.globalAlpha*=split;P(c,[[-10,-13],[13,-12],[14,14],[-13,13]],C.bread,C.crust,2);R(c,-7,-9,15,18,'#e2bc7e');for(let j=0;j<3;j++)E(c,-3+j*4,-3+j*4,1,1,C.crust);c.restore()})}
 if(sc==='diploma'||sc==='congrats'){local(c,783,256,.67,.14,()=>{P(c,[[-67,-86],[67,-86],[67,88],[-67,88]],C.paper,C.ink,2);for(let i=0;i<4;i++)L(c,[[-45,-54+i*19],[43,-54+i*19]],'#929990',2);E(c,25,49,17,17,C.gold,C.crust,1.5);P(c,[[17,60],[13,96],[26,84],[33,96],[33,60]],C.red)});P(c,[[559,238],[622,219],[683,234],[623,255]],C.ink);L(c,[[677,235],[681,267]],C.gold,2)}
 if(sc==='discount'){local(c,777,322,.8,.18,()=>{L(c,[[-59,-37],[-100,-95]],C.paperShade,1.2);P(c,[[-73,-42],[43,-42],[61,-20],[43,52],[-73,52]],C.paper,C.ink,2);E(c,-57,-24,4,4,C.ink);T(c,'−50%',-49,25,33,C.red,'700')})}
 if(sc==='private'){B(c,p=>{p.moveTo(486,235);p.bezierCurveTo(563,216,679,217,760,239);p.lineTo(760,288);p.quadraticCurveTo(622,269,486,289);p.closePath()},'#263543');}
 if(sc==='congrats')person(c,368,292,.58,{arm:.8,sad:true});
}
function store(c,x,y,s,own=false,press=0){local(c,x,y,s,0,()=>{
 P(c,[[-109,-69],[110,-69],[110,91],[-109,91]],'#728991',C.ink,3);R(c,-96,-54,91,94,'#25384d');R(c,8,-54,88,143,'#233340');L(c,[[51,-52],[51,87]],'#90aaa9',2);
 P(c,[[-127,-69],[-107,-111],[108,-111],[130,-69]],C.paper,C.ink,3);for(let i=0;i<9;i++)P(c,[[-124+i*28,-69],[-105+i*24,-109],[-91+i*24,-109],[-110+i*28,-69]],i%2?C.red:'#e3d2b9');
 for(let i=0;i<9;i++)B(c,p=>{p.moveTo(-125+i*28,-69);p.lineTo(-97+i*28,-69);p.quadraticCurveTo(-108+i*28,-45,-125+i*28,-69)},i%2?C.red:C.paper,C.ink,1);
 R(c,-90,5,170,12,C.paperShade);breadCard(c,-57,-22);if(own){R(c,-79,46+press*3,158,36,'#234b50');L(c,[[-79,46+press*3],[79,46+press*3],[79,82],[-79,82],[-79,46+press*3]],C.paperShade,1.5);T(c,'КУПИТЬ',0,72+press*3,22,C.paper,'700','center')}
 })}
function breadCard(c,x,y){R(c,x-24,y-26,49,33,C.paper);L(c,[[x-15,y-14],[x+15,y-14]],C.ink,2);L(c,[[x-15,y-5],[x+6,y-5]],C.paperShade,2)}
function shop(c,t,d){
 const p=ease(d.line);light(c,634,285,220);store(c,682,307,.84,true,d.scene==='buy'?Math.sin(p*Math.PI):0);
 if(d.scene==='forkstore'||d.scene==='store'){store(c,269,252,.44,false);const endX=mix(336,559,p);B(c,k=>{k.moveTo(311,275);k.bezierCurveTo(405,269,425,351,endX,335)},null,C.cyan,3);E(c,310,275,7,7,C.cyan,C.ink,1.5);E(c,endX,335,7,7,C.cyan,C.ink,1.5);fork(c,449,306,.46,-.50,C.cyan)}
 if(d.scene==='buy'){P(c,[[731,374],[746,400],[751,389],[762,388]],C.paper,C.ink,2)}
 if(['license','money','exception','check'].includes(d.scene)){
  sheet(c,336,279,.61,-.12,{portrait:false});L(c,[[321,314],[333,325],[354,298]],C.gold,4);
  const count=d.scene==='check'?Math.max(1,Math.ceil(p*3)):4;for(let i=0;i<count;i++){let x=490+i*40,y=206-Math.sin(p*Math.PI)*18;E(c,x,y,12,12,C.gold,C.crust,1.5);L(c,[[x-4,y-4],[x+4,y+4]],C.crust,1.2)}
  if(d.scene==='exception'){person(c,336,389,.30,{sad:true});L(c,[[368,323],[397,339]],C.cyan,2);L(c,[[394,329],[397,339],[387,340]],C.cyan,2)}
 }
}
function resume(c,t,d){
 const sc=d.scene,lp=ease(d.line);light(c,655,262,206);
 local(c,655,259,1.0,-.044,()=>{
  P(c,[[-156,-173],[156,-173],[156,178],[-156,178]],'rgba(4,8,16,.28)');P(c,[[-162,-181],[148,-181],[148,170],[-162,170]],C.paper,C.ink,2);
  T(c,'РЕЗЮМЕ',-130,-139,19,'#56646b','700');R(c,-131,-119,94,3,C.paperShade);R(c,-131,-99,223,2,C.paperShade);R(c,-131,-78,190,2,C.paperShade);
  const first=['умею доводить','до конца'];let write=1,erase=0;
  if(sc==='resume')write=0;else if(sc==='finish')write=lp;else if(sc==='erase')erase=lp;else if(['rewrite','learn'].includes(sc))erase=1;
  if(erase<1){c.save();c.beginPath();c.rect(-131,-36,244*write,92);c.clip();shortWriting(c,first,-129,-8,252,23,C.ink);c.restore();if(erase>0)R(c,-134,-35,264*erase,99,C.paper)}
  if(['rewrite','learn'].includes(sc)){const appear=sc==='rewrite'?lp*.18:lp;c.save();c.beginPath();c.rect(-131,-37,247*appear,101);c.clip();shortWriting(c,['быстро обучаюсь'],-129,-8,260,23,C.ink);c.restore()}
  if(sc==='erase'){let xx=-139+264*erase;local(c,xx,3,1,-.12,()=>{R(c,-17,-19,39,28,C.red);R(c,11,-19,11,28,C.paperShade);L(c,[[-17,-19],[22,-19],[22,9]],C.ink,1)});for(let i=0;i<17;i++)R(c,xx-20-hash(i)*50,30+hash(i+12)*18,2,1,C.paperShade)}
  R(c,-131,112,155,2,C.paperShade);L(c,[[-125,141],[-114,131],[-101,139],[-84,130],[-68,136]],'#6d7d80',1.2);
 });
 fork(c,399,316,.5,-.54,C.paperShade);
}
function commission(c,x,y,s=.8){local(c,x,y,s,0,()=>{
 for(let i=0;i<3;i++){const xx=(i-1)*79;E(c,xx,-37,21,25,C.paperShade,C.ink,2);P(c,[[xx-15,-14],[xx-32,10],[xx+31,10],[xx+15,-14]],C.coat,C.ink,2);L(c,[[xx-14,-41],[xx+14,-41]],C.ink,5);L(c,[[xx-8,-23],[xx+10,-23]],C.ink,1.6)}
 P(c,[[-144,15],[145,15],[156,40],[-154,40]],'#586573',C.ink,3);L(c,[[-119,40],[-132,128]],C.ink,8);L(c,[[117,40],[131,128]],C.ink,8);
 })}
function breakdown(c,t,d){
 const sc=d.scene,p=ease(d.line);light(c,532,289,240);
 if(sc==='doors'||sc==='life'){
  for(let i=0;i<2;i++){const x=493+i*178;P(c,[[x-52,146],[x+52,146],[x+52,395],[x-52,395]],'#1b2434',C.paperShade,3);let opening=(sc==='life'?1:p)*.82;P(c,[[x-48,151],[x+48-opening*73,151-opening*17],[x+48-opening*73,390+opening*13],[x-48,390]],i?'#595b70':'#8c9696',C.ink,2);E(c,x+27-opening*60,277,3,3,C.gold);if(i===0)chair(c,x-8,336,.22);else E(c,x,237,22,29,null,C.paperShade,2)}
  person(c,298,278,.77,{sad:true});return;
 }
 commission(c,714,286,.82);
 person(c,312,280,.77,{arm:sc==='test'?Math.sin(p*Math.PI):.6,sad:true});
 if(sc==='test'){const f=ease(p);sheet(c,mix(371,594,f),mix(318,264,f)-Math.sin(f*Math.PI)*63,.42,mix(-.3,.12,f),{code:true});for(let i=0;i<3;i++)L(c,[[368+i*11,342],[395+i*10,328]],C.paperShade,1)}
 if(sc==='joke'||sc==='laugh'){
  const n=sc==='laugh'?4:1;for(let i=0;i<n;i++){const a=(i-(n-1)/2)*.24,x=393+i*48,y=211-Math.sin(p*Math.PI)*24+i%2*20;local(c,x,y,.52,a,()=>{B(c,k=>{k.moveTo(-41,-38);k.quadraticCurveTo(0,-53,41,-38);k.lineTo(30,23);k.quadraticCurveTo(0,57,-30,23);k.closePath()},C.paper,C.ink,2);L(c,[[-24,-14],[-10,-11]],C.ink,3);L(c,[[10,-11],[25,-14]],C.ink,3);B(c,k=>{k.moveTo(-22,10);k.quadraticCurveTo(0,40,23,10)},null,C.red,3)});L(c,[[x,y+18],[x+21,y+79]],C.paperShade,1)}
 }
 if(sc==='ask'){plate(c,481,382,.62);fork(c,530,330,.34,.3)}
 // Cracks start at the desk and propagate toward the employee, not random flashes.
 if(d.intensity>.7){for(let i=0;i<5;i++){const len=clamp(p*1.8-i*.15);L(c,[[592,319+i*10],[592-len*47,312+i*12],[592-len*86,326+i*9]],C.red,1.2)}}
}
function outro(c,t,d){
 const p=ease(d.line),scene=d.scene;light(c,677,298,175);plate(c,282,366,.98);
 const move=scene==='move'?p:scene==='calendar'||scene==='free'?1:0;fork(c,395-move*43,302,.55,.2-move*.14,C.paperShade);
 const open=scene==='hello'?p:1;envelope(c,665,337,.84,open);
 const letterY=scene==='hello'?mix(324,218,p):scene==='free'?mix(213,234,p):213;
 local(c,666,letterY,.80,-.035,()=>{P(c,[[-115,-85],[115,-85],[115,105],[-115,105]],C.paper,C.ink,1.5);shortWriting(c,['Здравствуйте.'], -89,-44,186,17,'#53616a');L(c,[[-89,-22],[78,-22]],'#b4b7aa',1);if(scene!=='hello')shortWriting(c,scene==='free'?['Я свободен.']:['Когда вам удобно?'],-89,14,205,16,'#53616a');L(c,[[-89,49],[63,49]],'#c0c0b2',1);L(c,[[-87,72],[-75,64],[-65,70],[-45,60],[-26,65]],'#637279',1.2)});
 // Envelope's lower flap comes in front of the letter, preserving physical depth.
 local(c,665,337,.84,0,()=>{P(c,[[-118,86],[0,8],[118,86]],'#dedfce',C.ink,1.2)});
 if(scene==='calendar'){local(c,847,203,.53,.10,()=>{R(c,-61,-67,120,131,C.paper);R(c,-61,-67,120,24,C.red);for(let i=0;i<20;i++){let x=-41+i%5*21,y=-24+Math.floor(i/5)*22;E(c,x,y,2,2,C.paperShade)}E(c,1,20,11,11,null,C.red,2)})}
 if(scene==='free'){c.save();c.globalAlpha*=.42;chair(c,860,351,.37);c.restore()}
}

const handlers={plate:plateScene,interview,library,rejection,copies,hunger,bread:breadScene,shop,resume,breakdown,distribution:copies,outro};
function defaultMotif(scene,t){
 if(t>=224.54)return'outro';if(['intro','salary','plate'].includes(scene))return'plate';
 if(['age','experience','team','hungry'].includes(scene))return'interview';if(scene==='library')return'library';
 if(['flexibility','chair','panel'].includes(scene))return'rejection';if(['bread','rise','diploma','discount','retrain','crackers','congrats','private'].includes(scene))return'bread';
 if(['forkstore','store','buy','license','money','exception','check'].includes(scene))return'shop';if(['resume','finish','erase','rewrite','learn'].includes(scene))return'resume';
 if(['test','joke','laugh','ask','doors','life'].includes(scene))return'breakdown';if(['empty','design'].includes(scene))return'hunger';if(t>=177)return'distribution';return'copies';
}
function render(ctx,t,q,shot,energy){
 q=q||{};shot=shot||{};t=Number(t)||0;const motif=shot.motif||defaultMotif(q.scene,t),fn=handlers[motif];if(!fn)return false;
 if(shot.kind==='gpu'&&Number(shot.look)===0&&(motif==='plate'||motif==='outro'))return false;
 const duration=Math.max(.001,Number(shot.duration)||((Number(q.end)||t+1)-(Number(q.start)||0))),localTime=Number.isFinite(Number(shot.local))?Number(shot.local):Math.max(0,t-(Number(q.start)||0));
 const progress=Number.isFinite(Number(shot.progress))?clamp(Number(shot.progress)):clamp(localTime/duration);
 const line=clamp((t-(Number(q.start)||0))/Math.max(.04,(Number(q.end)||t+1)-(Number(q.start)||0)));
 const en=typeof energy==='number'?energy:energy&&Number(energy.value||energy.rms)||0;
 const intensity=clamp(Number.isFinite(Number(shot.intensity))?Number(shot.intensity):en);
 const edge=Math.min(ease(localTime/.22),ease((duration-localTime)/.15));
 const base=motif==='breakdown'?.90:motif==='outro'?.92:motif==='resume'?.94:motif==='library'||motif==='copies'||motif==='distribution'?.78:.86;
 ctx.save();ctx.beginPath();ctx.rect(0,0,960,450);ctx.clip();ctx.lineJoin='round';ctx.lineCap='round';ctx.globalAlpha*=base*Math.max(0,edge);
 fn(ctx,t,{scene:String(q.scene||''),motif,line,progress,local:localTime,duration,intensity,energy:clamp(en)});
 ctx.restore();return true;
}
const api={render,defaultMotif};root.VilkaNarrative=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
