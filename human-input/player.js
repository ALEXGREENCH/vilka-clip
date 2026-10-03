'use strict';
const $=s=>document.querySelector(s),audio=$('#audio'),ctx=$('#output').getContext('2d'),timing=DemoTiming;
ctx.imageSmoothingEnabled=false;audio.volume=.8;let ready=false,starting=false,lastBeat=-1,lastScene=-1;
const demo=RasterRitual.init({createCanvas:(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c},font:'ScenePixel'});
const format=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function sync(t){const scene=Math.min(22,Math.floor(t/demo.chapterDuration)),beat=Math.floor((t-timing.beatOffset)/timing.beatDuration);if(beat===lastBeat&&scene===lastScene)return;lastBeat=beat;lastScene=scene;
 $('#patNo').textContent='CHAPTER '+String(scene+1).padStart(2,'0');let rows='';const localBeat=((beat%24)+24)%24;
 for(let bar=0;bar<6;bar++)rows+='<span class="'+(Math.floor(localBeat/4)===bar?'active':'row')+'">'+String(bar+1).padStart(2,'0')+'     '+Array.from({length:4},(_,b)=>bar*4+b===localBeat?'●':'·').join('     ')+'</span>';
 $('#pattern').innerHTML=rows;$('#sceneTitle').textContent=`${String(scene+1).padStart(2,'0')} / ${demo.names[scene]}`;$('#effects').textContent=demo.families[scene].join(' · ');$('#chapter').value=scene;
}
function paint(t){ctx.drawImage(demo.render(t),0,0);$('#seek').value=t;$('#clock').textContent=`${format(t)} / ${format(demo.duration)}`;sync(t)}
function loop(){if(!audio.paused)paint(Math.min(audio.currentTime,demo.duration));requestAnimationFrame(loop)}
async function toggle(){if(!ready||starting)return;if(audio.paused){try{starting=true;if(audio.currentTime>=demo.duration-.1)audio.currentTime=0;await audio.play();$('#cover').hidden=true;$('#play').textContent='Ⅱ PAUSE';$('#status').textContent=''}catch(e){$('#status').textContent='Could not play the MP3: '+e.message}finally{starting=false}}else{audio.pause();$('#play').textContent='▶ PLAY'}}
function seek(t){audio.currentTime=Math.max(0,Math.min(demo.duration-.01,t));paint(audio.currentTime);$('#cover').hidden=true}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#screen').requestFullscreen()}catch(e){$('#status').textContent='Fullscreen unavailable: '+e.message}}
$('#start').onclick=toggle;$('#play').onclick=toggle;$('#restart').onclick=()=>seek(0);$('#seek').oninput=e=>seek(+e.target.value);$('#volume').oninput=e=>audio.volume=+e.target.value;$('#fullscreen').onclick=fullscreen;
$('#chapter').onchange=e=>seek(+e.target.value*demo.chapterDuration+.48);audio.onended=()=>{$('#play').textContent='▶ REPLAY';paint(demo.duration-.01)};audio.onerror=()=>$('#status').textContent='Could not load the MP3. Reload the page or check your connection.';
demo.names.forEach((n,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${String(i+1).padStart(2,'0')} / ${n}`;$('#chapter').append(o)});
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','BUTTON'].includes(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();toggle()}else if(e.code==='ArrowRight'){e.preventDefault();seek((Math.floor(audio.currentTime/demo.chapterDuration)+1)*demo.chapterDuration+.48)}else if(e.code==='ArrowLeft'){e.preventDefault();seek((Math.floor(audio.currentTime/demo.chapterDuration)-1)*demo.chapterDuration+.48)}else if(e.code==='KeyF')fullscreen()});
document.fonts.load('10px ScenePixel').then(()=>{ready=true;paint(3.84);$('#seek').value=0;$('#clock').textContent=`0:00 / ${format(demo.duration)}`;$('#start').disabled=false;$('#start').textContent='▶ RUN THE DEMO';$('#play').disabled=false;requestAnimationFrame(loop)}).catch(e=>$('#status').textContent='Loading error: '+e.message);
