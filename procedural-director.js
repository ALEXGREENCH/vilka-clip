/* Procedural narrative edit shared by the live player and deterministic export. */
(function(root){'use strict';
const W=960,H=540,TAU=Math.PI*2,clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const catalog=[
 ['Нуар / дождь','world',0,'cinema'],['Хром / пустая тарелка','gpu',0,'physical'],
 ['Карманная консоль','game',0,'game'],['Масляная живопись','world',1,'painting'],
 ['Полигональная арена','game',1,'game'],['Жидкое стекло','gpu',2,'physical'],
 ['Японская гравюра','world',2,'painting'],['Векторный автомат','game',2,'game'],
 ['Индустриальный тоннель','gpu',1,'cinema'],['Готический витраж','world',3,'painting'],
 ['Аниме / поединок','game',3,'anime'],['Сюрреализм','world',6,'painting'],
 ['Чужая планета','gpu',3,'cinema'],['Изометрическая RPG','game',4,'game'],
 ['Конструктивизм','world',4,'print'],['Неоновый собор','gpu',4,'physical'],
 ['Уголь / нервный рисунок','world',5,'print'],['DOS / лабиринт','game',5,'game'],
 ['Театр теней','world',7,'cinema'],['Огненная сцена','gpu',5,'cinema'],
 ['Резиновый мультфильм','world',8,'anime'],['Аркадная гонка','game',6,'game'],
 ['Бумажный коллаж','world',9,'print'],['Невозможная архитектура','gpu',6,'physical'],
 ['Комикс / крупный план','game',7,'print'],['Ар-деко / сцена','world',10,'cinema'],
 ['Психоделическая жидкость','gpu',7,'physical'],['Рентген / фотограмма','world',11,'print'],
 ['ASCII / потерянный сигнал','extra',0,'game'],['Жаккард / вышивка','extra',1,'painting'],
 ['Кубизм / лицо автора','extra',2,'painting'],['Оп-арт / резонанс','extra',3,'physical']
].map(([name,kind,look,family],id)=>({id,name,kind,look,family}));
let storyPlan=null;
function cueAt(t,override=-1){const plan=storyPlan||root.VilkaStory,shot=plan?plan.cueAt(t):{index:0,start:0,end:255,duration:255,local:Math.max(0,t),progress:clamp(t/255),styleId:0,motif:'plate',intensity:.2,transition:'none'},id=override>=0?override:shot.styleId;return{...catalog[id],...shot,id,cut:shot.index,cycle:shot.index}}
function sectionAt(t){return t<12.22?0:t<39?1:t<46?2:t<71.28?3:t<96.82?1:t<103.9?2:t<123.14?3:t<153.07?4:t<177?5:t<224.54?6:7}
function extra(c,t,look,q,e,cy){
 const fill=(col)=>{c.fillStyle=col;c.fillRect(0,0,W,H)},line=(x,y,xx,yy,col,w=1)=>{c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.strokeStyle=col;c.lineWidth=w;c.stroke()},poly=(p,col)=>{c.beginPath();p.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.closePath();c.fillStyle=col;c.fill()};
 if(look===0){
  fill('#020b09');c.font='11px monospace';c.textBaseline='middle';const chars=' .,:;+*=xX#@',shift=Math.sin(t*.7)*90;
  for(let y=25;y<470;y+=12)for(let x=8;x<954;x+=9){const u=(x-480-shift)/190,v=(y-250)/180;let silhouette=((u*u/.4+(v+.55)*(v+.55)/.25<1)||((Math.abs(u)<.60-.12*v)&&v>-.15&&v<1))?1:0;let fork=Math.abs(x-740-Math.sin(t)*25)<8&&y>145&&y<390;for(let j=0;j<4;j++)fork=fork||(Math.abs(x-(713+j*18)-Math.sin(t)*25)<4&&y>72&&y<155);const z=.5+.25*Math.sin(u*3+t)+.25*Math.sin(v*8-t);c.fillStyle=silhouette?'#baffda':fork?'#ffba75':'#174333';c.fillText(chars[Math.floor(clamp(silhouette?z+.25:z*.42,0,.999)*chars.length)],x,y)}
  c.fillStyle='#a7efc3';c.font='14px monospace';c.fillText('> ORIGINAL_47 / ACCESS DENIED',27,30);for(let i=0;i<8;i++){let yy=(t*50+i*71)%465;c.fillStyle='#9cffe709';c.fillRect(0,yy,960,2)}
 }else if(look===1){
  fill('#251427');const colors=['#e4b47a','#dd585b','#639f9c','#947ca8','#482941'],step=12;
  for(let y=0;y<470;y+=step)for(let x=0;x<W;x+=step){let u=(x-480)/190,v=(y-245)/150;const plate=Math.abs(u*u+v*v*.6-1.5)<.18,fork=(Math.abs(x-480)<12&&y>165&&y<410)||([444,468,492,516].some(z=>Math.abs(x-z)<7)&&y>60&&y<169);const a=Math.sin(x*.032+t*.45)+Math.cos(y*.043-t*.5);let k=fork?0:plate?2:Math.floor((Math.sin((x+y)/48+cy)*.5+.5)*4);c.strokeStyle=colors[k];c.lineWidth=fork?4:2;let bend=Math.sin(t+x*.01+y*.012)*2;c.beginPath();c.moveTo(x+2,y+2+bend);c.lineTo(x+9,y+9+bend);c.moveTo(x+9,y+2+bend);c.lineTo(x+2,y+9+bend);c.stroke();if(a>1.3&&!fork){c.fillStyle='#f4d9b4';c.fillRect(x+4,y+4,2,2)}}
  for(let x=0;x<960;x+=24){line(x,16,x+12,29,'#e6b576',2);line(x,452,x+12,439,'#e6b576',2)}
 }else if(look===2){
  fill('#dac8a0');for(let i=0;i<15;i++){let x=i*83-50+Math.sin(t*.3+i)*25;poly([[x,0],[x+120,0],[x-50,470],[x-140,470]],['#ac533c','#4c6772','#ceb477','#efe1b7','#342e3c'][i%5])}
  const cx=485+Math.sin(t*.55)*30,cyy=220,scale=1+.06*Math.sin(t);c.save();c.translate(cx,cyy);c.scale(scale,scale);
  const facets=[[[[-165,-155],[-5,-190],[25,-42],[-142,29]],'#ecd699'],[[[-5,-190],[149,-117],[178,49],[25,-42]],'#758c8d'],[[[-142,29],[25,-42],[51,196],[-96,146]],'#b95742'],[[[25,-42],[178,49],[91,177],[51,196]],'#e9bd73']];for(const[p,col]of facets)poly(p,col);
  poly([[17,-46],[-30,96],[61,63]],'#313342');line(-120,-52,-12,-36,'#272636',13);line(60,-52,147,-89,'#272636',13);line(-11,133,77,126,'#302937',12);c.fillStyle='#f6e8bd';c.fillRect(-95,-62,53,25);c.fillRect(77,-79,48,22);c.fillStyle='#1e3438';c.fillRect(-73,-60,16,24);c.fillRect(94,-82,15,30);c.restore();
  c.save();c.translate(795,232);c.rotate(-.5+.12*Math.sin(t));for(let j=0;j<4;j++)poly([[j*17,0],[j*17+10,-80],[j*17+14,0]],'#272a33');poly([[0,0],[65,0],[40,43],[38,210],[22,220],[24,42]],'#eee3b6');c.restore();
 }else{
  fill('#e8e5d9');c.save();c.beginPath();c.rect(0,0,960,470);c.clip();
  for(let i=0;i<100;i++){const x=i*12-140;c.beginPath();for(let y=0;y<=500;y+=5){const xx=x+Math.sin(y*.018+t*1.3+i*.055)*70+Math.sin(y*.043-t)*18;y?c.lineTo(xx,y):c.moveTo(xx,y)}c.strokeStyle=i%2?'#e8e5d9':'#111523';c.lineWidth=7;c.stroke()}
  c.save();c.translate(480+Math.sin(t*.6)*75,230);c.rotate(t*.11);for(let i=32;i>0;i--){c.beginPath();c.ellipse(0,0,i*7,i*4,0,0,TAU);c.fillStyle=i%2?'#eeeae1':'#ef553c';c.fill()}c.restore();c.restore();
  c.fillStyle='#111523';c.font='900 65px sans-serif';c.textAlign='center';c.fillText(q.chorus===3?'РАЗДАЛИ':'ОРИГИНАЛ',480,240);c.textAlign='left';
 }
}
function init({canvas,worlds,games,shaders,finish,story,narrative,timeline,energy,createCanvas}){
 storyPlan=story||root.VilkaStory; narrative=narrative||root.VilkaNarrative;
 const ctx=canvas.getContext('2d'),world=createCanvas(canvas.width,canvas.height),wc=world.getContext('2d'),prev=createCanvas(canvas.width,canvas.height),pc=prev.getContext('2d'),source=createCanvas(1440,810),sc=source.getContext('2d'),finishCanvas=createCanvas(canvas.width,canvas.height),post=finish?finish.init(finishCanvas):{available:false},gpuCanvas=createCanvas(720,405),gpu=shaders.init(gpuCanvas);
 let override=-1,quality='auto',materials=true;const errors=[];
 const hardPixel=s=>(s.kind==='game'&&[0,5].includes(s.look))||(s.kind==='extra'&&s.look===0);
 const quote=t=>timeline.find(q=>t>=q.start&&t<q.end)||[...timeline].reverse().find(q=>q.start<=t)||timeline[0];
 function drawWorld(c,style,t,q,en){c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.imageSmoothingEnabled=!hardPixel(style);c.imageSmoothingQuality='high';
  const sourceWidth=hardPixel(style)?960:quality==='high'?1920:quality==='low'?960:1440;
  if(source.width!==sourceWidth){source.width=sourceWidth;source.height=sourceWidth*9/16}
  sc.save();sc.setTransform(source.width/W,0,0,source.height/H,0,0);sc.globalAlpha=1;sc.globalCompositeOperation='source-over';sc.fillStyle='#080b15';sc.fillRect(0,0,W,H);const opts={w:W,h:H,local:style.local,cycle:style.cycle};
  try{if(style.kind==='gpu'&&gpu.available){gpu.render(t,style.look,en,sectionAt(t));sc.drawImage(gpuCanvas,0,0,W,H)}else if(style.kind==='world')worlds.render(sc,t,style.look,q,en,opts);else if(style.kind==='game')games.render(sc,t,style.look,q,en,opts);else extra(sc,t,style.kind==='extra'?style.look:style.look%4,q,en,style.cycle);if(narrative)narrative.render(sc,t,q,style,en)}catch(e){if(!errors.includes(e.message))errors.push(e.message);extra(sc,t,0,q,en,0)}sc.restore();
  let frame=source;if(materials&&post.available){try{frame=post.render(source,t,style,en)||source}catch(e){if(!errors.includes(e.message))errors.push(e.message)}}
  c.drawImage(frame,0,0,c.canvas.width,c.canvas.height);c.restore();
 }
 function caption(q,t,style){const cw=canvas.width,ch=canvas.height,g=ctx.createLinearGradient(0,ch*434/540,0,ch*470/540);g.addColorStop(0,'#05060b00');g.addColorStop(1,'#05060b');ctx.fillStyle=g;ctx.fillRect(0,ch*434/540,cw,ch*(1-434/540));
  const text=q.text||(t>239.3?'я свободен.':'');if(!text)return;
  const sf=cw/1280,serif=style.family==='painting'||style.name.includes('Нуар'),mono=style.family==='game';let size=30*sf,font=()=>`${serif?'600':'700'} ${size}px ${mono?'monospace':serif?'Georgia, serif':'"Trebuchet MS", sans-serif'}`;
  ctx.font=font();while(ctx.measureText(text).width>cw-90*sf&&size>18*sf){size-=sf;ctx.font=font()}
  const wide=ctx.measureText(text).width,x=(cw-wide)/2,y=ch-39*sf;ctx.textBaseline='middle';ctx.textAlign='left';ctx.shadowColor='#000';ctx.shadowBlur=4*sf;ctx.fillStyle='#f4f1e8';ctx.fillText(text,x,y);ctx.shadowBlur=0;
  let progress=0;const tokens=[...text.matchAll(/[А-Яа-яЁёA-Za-z0-9]+/g)];for(let i=0;i<(q.words||[]).length&&i<tokens.length;i++){let a=ctx.measureText(text.slice(0,tokens[i].index)).width,b=ctx.measureText(text.slice(0,tokens[i].index+tokens[i][0].length)).width;if(t>=q.words[i].end)progress=b;else if(t>=q.words[i].start){progress=a+(b-a)*clamp((t-q.words[i].start)/Math.max(.06,q.words[i].end-q.words[i].start));break}}
  ctx.save();ctx.beginPath();ctx.rect(x,y-28*sf,progress,56*sf);ctx.clip();ctx.fillStyle=style.family==='painting'?'#f4cf84':style.family==='game'?'#8ffff0':'#ff997a';ctx.fillText(text,x,y);ctx.restore();
 }
 function transition(t,style,en){const duration=style.transition==='cut'||style.transition==='none'?0:style.transition==='shards'?.20:style.transition==='pixel'?.34:style.transition==='diagonal'?.38:style.intensity<.3?1.05:.65;if(override>=0||style.cut===0||style.local>=duration)return;const f=clamp(style.local/duration),old=cueAt(style.start-.001);drawWorld(pc,old,style.start-.001,quote(style.start-.001),en);const cw=canvas.width,ch=canvas.height,k=({pixel:1,diagonal:3,shards:5})[style.transition]||0;
  ctx.save();ctx.imageSmoothingEnabled=k!==1;
  if(k===0){ctx.globalAlpha=1-f;ctx.drawImage(prev,0,0,cw,ch)}
  else if(k===1){const n=12;for(let row=0;row<7;row++)for(let col=0;col<12;col++){const threshold=((col*7+row*13)%31)/31;if(threshold>f)ctx.drawImage(prev,col*prev.width/n,row*prev.height/7,prev.width/n,prev.height/7,col*cw/n,row*ch/7,cw/n+1,ch/7+1)}}
  else if(k===2){for(let i=0;i<9;i++){const h=ch/9*(1-f);ctx.drawImage(prev,0,i*prev.height/9,prev.width,prev.height/9,Math.sin(i+t*30)*f*35,i*ch/9,cw,h)}}
  else if(k===3){ctx.beginPath();ctx.moveTo(cw*f*1.8,0);ctx.lineTo(cw,0);ctx.lineTo(cw,ch);ctx.lineTo(cw*f*1.8-cw*.8,ch);ctx.closePath();ctx.clip();ctx.drawImage(prev,0,0,cw,ch)}
  else if(k===4){ctx.translate(cw/2,ch/2);ctx.rotate(f*.11);ctx.scale(1+f*.3,1+f*.3);ctx.globalAlpha=1-f;ctx.drawImage(prev,-cw/2,-ch/2,cw,ch)}
  else{for(let i=0;i<4;i++){let x=(i%2)*cw/2,y=Math.floor(i/2)*ch/2,dx=(i%2?1:-1)*f*cw/2,dy=(i<2?-1:1)*f*ch/2;ctx.drawImage(prev,i%2*prev.width/2,Math.floor(i/2)*prev.height/2,prev.width/2,prev.height/2,x+dx,y+dy,cw/2,ch/2)}}ctx.restore();
 }
 function render(t){const style=cueAt(t,override),q=quote(t),en=(energy[Math.min(energy.length-1,Math.floor(t*20))]||.025)*(.35+.8*style.intensity);
  drawWorld(wc,style,t,q,en);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.imageSmoothingEnabled=!(style.kind==='game'&&[0,1,5].includes(style.look));ctx.drawImage(world,0,0,canvas.width,canvas.height);transition(t,style,en);
  if(t<12.22){ctx.save();ctx.scale(canvas.width/1280,canvas.height/720);ctx.fillStyle='#080912b0';ctx.fillRect(33,31,182,58);ctx.fillStyle='#f5ead7';ctx.font=`${style.family==='painting'?'italic':'900'} 39px ${style.family==='painting'?'Georgia':'sans-serif'}`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('ВИЛКА',48,62);ctx.restore()}
  caption(q,t,style);if(t>251.5){ctx.fillStyle=`rgba(5,6,11,${clamp((t-251.5)/3.46)})`;ctx.fillRect(0,0,canvas.width,canvas.height)}return{...style,scene:q.scene,text:q.text,energy:en,section:sectionAt(t),gpu:gpu.available,finish:post.available,materials,sourceWidth:source.width,errors:[...errors]};
 }
 return{render,canvas,catalog,gpu,post,setStyle(id){override=Number(id)},setMaterials(value){materials=Boolean(value)},setQuality(v){quality=v;gpuCanvas.width=v==='high'?960:v==='low'?480:720;gpuCanvas.height=Math.round(gpuCanvas.width*9/16)},get errors(){return errors}};
}
root.VilkaProcedural={init,catalog,cueAt,sectionAt};if(typeof module!=='undefined')module.exports=root.VilkaProcedural;
})(typeof window!=='undefined'?window:globalThis);
