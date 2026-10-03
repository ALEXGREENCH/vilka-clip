'use strict';
const titles=['Star drive','Sine plasma','Wave scroller','Vector cube','Polar tunnel','Rotozoom','Metaball fusion','Fractal dive','Voxel flight','Four dimensions','Recursive gates','Liquid chrome'];
const $=id=>document.getElementById(id);let emulator=null,busy=false;
titles.forEach((title,i)=>{let b=document.createElement('button');b.className='scene';b.type='button';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',`${String(i+1).padStart(2,'0')}. ${title}`);b.innerHTML=`<span class="num">${String(i+1).padStart(2,'0')}</span><span>${title}</span><span class="kind">${i<6||i===9?'Z80':'LZ'}</span>`;b.addEventListener('click',()=>load(`out/scene-${String(i+1).padStart(2,'0')}.sna`,i));$(i<6?'classic':'modern').appendChild(b)});
async function load(url='out/attribute48.sna',index=-1){if(busy)return;busy=true;$('start').disabled=true;$('status').textContent='ЗАГРУЗКА В ПАМЯТЬ SPECTRUM…';
 try{if(!emulator){emulator=JSSpeccy($('emulator'),{machine:48,zoom:2,autoStart:true,autoLoadTapes:true,tapeTrapsEnabled:true,keyboardEnabled:true,uiEnabled:true,sandbox:true,openUrl:url});await new Promise(resolve=>emulator.onReady(resolve))}else await emulator.openUrl(url);
 $('cover').hidden=true;$('reload').disabled=false;$('fullscreen').disabled=false;$('status').textContent=index<0?'SNA / НАТИВНЫЙ Z80 · 12 СЦЕН ПО ПОРЯДКУ':`SNA / ВЫБРАНА СЦЕНА ${String(index+1).padStart(2,'0')} · ${titles[index].toUpperCase()}`;
 document.querySelectorAll('.scene').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
 }catch(e){$('status').textContent='Не удалось загрузить: '+(e.message||String(e));$('cover').hidden=false;if(emulator){emulator.exit();emulator=null}}finally{busy=false;$('start').disabled=false}}
$('start').addEventListener('click',()=>load());$('reload').addEventListener('click',()=>load());$('fullscreen').addEventListener('click',()=>emulator&&emulator.toggleFullscreen());
fetch('out/verification.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(r=>$('bytes').textContent=r.programBytes.toLocaleString('ru-RU')).catch(()=>$('bytes').textContent='48K RAM');
