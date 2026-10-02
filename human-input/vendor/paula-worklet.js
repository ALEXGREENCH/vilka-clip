import {ready,Paula} from './paula.js';
class PaulaProcessor extends AudioWorkletProcessor {
  constructor(){super();this.paused=true;this.count=0;this.port.onmessage=async({data:d})=>{
    try{
      if(d.cmd==='load'){this.replay?.destroy();this.replay=new Paula(await ready,new Uint8Array(d.bytes),sampleRate);this.port.postMessage({cmd:'ready'})}
      if(d.cmd==='play')this.paused=false;
      if(d.cmd==='pause')this.paused=true;
      if(d.cmd==='seek'){this.replay.seek(d.time);this.report()}
      if(d.cmd==='mode')this.replay.mode(d.value);
    }catch(e){this.paused=true;this.port.postMessage({cmd:'error',message:e.message})}
  }}
  report(){this.port.postMessage({cmd:'position',position:this.replay.position,stamp:currentTime})}
  process(inputs,outputs){
    if(!this.replay||this.paused)return true;
    const [left,right]=outputs[0],n=this.replay.read(left,right);
    if(++this.count%8===0)this.report();
    if(!n||this.replay.position>=176.64){this.paused=true;this.port.postMessage({cmd:'ended'})}
    return true;
  }
}
registerProcessor('human-input-paula',PaulaProcessor);
