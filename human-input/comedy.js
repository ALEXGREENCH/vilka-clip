/* Original vector logo parodies and the classic red/white Boing Ball motif. */
(function(root){'use strict';let ball,bc,img;const S=Math.sin,C=Math.cos,PI=Math.PI,TAU=PI*2;
function txt(c,s,x,y,size,color='#e6d5e9'){c.fillStyle=color;c.font=`${size}px ScenePixel`;c.textAlign='center';c.fillText(s,x,y);c.textAlign='left'}
function badge(c,kind,x,y,t){c.save();c.translate(x,y);c.rotate(S(t*2+kind)*.08);const colors=['#88e3cf','#e6a282','#b7b3ff','#87b8ff'];c.strokeStyle=colors[kind];c.fillStyle=colors[kind];c.lineWidth=3;
 if(kind===0){for(let i=0;i<6;i++){c.save();c.rotate(i*PI/3+t*.2);c.beginPath();c.ellipse(11,0,18,9,0,0,TAU);c.stroke();c.restore()}}
 if(kind===1){for(let i=0;i<12;i++){let a=i*PI/6;c.beginPath();c.moveTo(C(a)*7,S(a)*7);c.lineTo(C(a)*28,S(a)*28);c.stroke()}}
 if(kind===2){c.beginPath();for(let i=0;i<8;i++){let a=i*PI/4,r=i%2?7:29;i?c.lineTo(C(a)*r,S(a)*r):c.moveTo(C(a)*r,S(a)*r)}c.closePath();c.fill()}
 if(kind===3){c.beginPath();c.ellipse(-3,0,25,14,0,0,TAU);c.fill();c.beginPath();c.moveTo(17,-2);c.lineTo(35,-18);c.lineTo(33,7);c.closePath();c.fill();c.fillStyle='#0c1023';c.fillRect(-18,-4,4,4);c.strokeStyle='#9ec5ff';c.beginPath();c.moveTo(-12,-14);c.quadraticCurveTo(-20,-30,-12,-32);c.stroke()}
 txt(c,['OPEN INVOICE','CLAUDE NINE','GEMIN-I','DEEP SLEEP'][kind],0,46,7,colors[kind]);txt(c,['NOW WITH MORE FEES','THINKING... BILLING...','TWICE THE CAPTCHA','STILL BUFFERING'][kind],0,61,5,'#9b8da8');c.restore()}
function drawBall(c,x,y,r,t){const d=img.data,n=128;for(let yy=0;yy<n;yy++)for(let xx=0;xx<n;xx++){const u=(xx-63.5)/62,v=(yy-63.5)/62,rr=u*u+v*v,i=(yy*n+xx)*4;if(rr>1){d[i+3]=0;continue}const z=Math.sqrt(1-rr),co=C(t*1.4),si=S(t*1.4),nx=u*co+z*si,nz=z*co-u*si,check=((Math.floor((Math.atan2(nx,nz)+PI)/TAU*16)+Math.floor(Math.acos(v)/PI*8))&1),light=.3+.7*Math.max(0,-u*.4-v*.5+z*.75),spec=Math.pow(Math.max(0,-u*.35-v*.45+z*.8),26)*65;d[i]=Math.min(255,(check?235:248)*light+spec);d[i+1]=Math.min(255,(check?33:241)*light+spec);d[i+2]=Math.min(255,(check?57:243)*light+spec);d[i+3]=255}bc.putImageData(img,0,0);c.imageSmoothingEnabled=false;c.drawImage(ball,x-r,y-r,r*2,r*2)}
function draw(c,t,local,logos=false){const g=c.createLinearGradient(0,0,0,360);g.addColorStop(0,'#080a23');g.addColorStop(1,'#321c40');c.fillStyle=g;c.fillRect(0,0,640,360);const horizon=231;for(let y=0;y<8;y++)for(let x=0;x<18;x++){const a=y/8,b=(y+1)/8,x1=320+(x-9)*(15+a*39),x2=320+(x-9)*(15+b*39);c.fillStyle=(x+y)%2?'#362c62':'#13172e';c.beginPath();c.moveTo(x1,horizon+a*a*130);c.lineTo(x1+15+a*39,horizon+a*a*130);c.lineTo(x2+15+b*39,horizon+b*b*130);c.lineTo(x2,horizon+b*b*130);c.fill()}
 // Two-beat bounce: constant gravity in flight, elastic contact, conserved silhouette area.
 const phase=((local%.96)+.96)%.96,flight=.80,contact=.16,u=phase/flight,q=(phase-flight)/contact;
 const jump=phase<flight?4*u*(1-u):0;
 const sy=phase<flight?1+.10*(2*u-1)**2:1+.10*C(TAU*q)-.32*S(PI*q)**2,sx=1/sy;
 const x=320+S(local*.75)*97,r=58,y=291-r*sy-jump*133;
 c.globalAlpha=.46-jump*.25;c.fillStyle='#000';c.beginPath();c.ellipse(x,291,(65-jump*19)*sx,12-jump*5,0,0,TAU);c.fill();c.globalAlpha=1;
 if(logos){badge(c,0,112,80,t);badge(c,1,522,80,t);badge(c,2,112,214,t);badge(c,3,522,214,t);txt(c,'THE BOARD OF ARTIFICIAL DIRECTORS',320,41,8,'#ffd3a1')}else{for(let i=0;i<4;i++){c.fillStyle=`hsla(${280+i*23},80%,60%,.23)`;c.fillRect(0,47+i*7,640,3)}txt(c,'BOING!  /  THE ORIGINAL FOUNDATION MODEL',320,45,8,'#f9cea6')}
 c.save();c.translate(x,y);c.scale(sx,sy);drawBall(c,0,0,r,t);c.restore();if(logos&&local>4.2){c.save();c.translate(320,275);c.rotate(-.07);c.fillStyle='#f7c598';c.fillRect(-116,-13,232,27);txt(c,'TOKEN LIMIT EXCEEDED',0,5,10,'#32162d');c.restore()}}
const api={init(create){ball=create(128,128);bc=ball.getContext('2d');img=bc.createImageData(128,128)},draw};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ComedyFX=api;
})(typeof window!=='undefined'?window:this);
