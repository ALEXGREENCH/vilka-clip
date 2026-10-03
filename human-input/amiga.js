'use strict';
class AmigaAudio {
  constructor(url,fallback){this.url=url;this.fallback=fallback;this.paused=true;this._position=0;this._stamp=0;this._volume=.8;this.mode='a500'}
  async init(){
    if(this.loading)return this.loading;
    this.loading=(async()=>{
      this.context=new AudioContext({latencyHint:'playback',sampleRate:48000});
      const response=await fetch(this.url);if(!response.ok)throw Error('MOD download failed');const bytes=await response.arrayBuffer();
      await this.context.audioWorklet.addModule('vendor/paula-worklet.js?v=harmony5');
      this.node=new AudioWorkletNode(this.context,'human-input-paula',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});
      this.gain=this.context.createGain();this.gain.gain.value=this._volume;this.node.connect(this.gain).connect(this.context.destination);
      await new Promise((resolve,reject)=>{
        const timeout=setTimeout(()=>reject(Error('Amiga engine timed out')),20000);
        this.node.onprocessorerror=()=>{clearTimeout(timeout);reject(Error('Amiga processor failed'));this.onerror?.()};
        this.node.port.onmessage=({data:d})=>{
          if(d.cmd==='ready'){clearTimeout(timeout);resolve()}
          if(d.cmd==='error'){clearTimeout(timeout);reject(Error(d.message));this.onerror?.()}
          if(d.cmd==='position'){this._position=d.position;this._stamp=d.stamp}
          if(d.cmd==='ended'){this.paused=true;this._position=176.64;this.onended?.()}
        };
        this.node.port.postMessage({cmd:'load',bytes},[bytes]);
      });
      this.initialized=true;
      this.node.port.postMessage({cmd:'mode',value:this.mode});
      this.currentTime=this._position;
      document.querySelector('#soundStatus').textContent=`PAULA / ${this.mode.toUpperCase()} · LIVE MOD`;
    })();return this.loading;
  }
  async play(){
    if(this.useFallback){await this.fallback.play();this.paused=false;return}
    try{await this.init();await this.context.resume();this._stamp=this.context.currentTime;this.node.port.postMessage({cmd:'play'});this.paused=false}
    catch(e){await this.context?.close();this.useFallback=true;this.fallback.currentTime=this._position;this.fallback.volume=this._volume;await this.fallback.play();this.paused=false;this.fallback.onended=()=>{this.paused=true;this.onended?.()};document.querySelector('#soundStatus').textContent='A500 RENDER · AUDIO FALLBACK';document.querySelector('#soundMode').disabled=true;}
  }
  pause(){this._position=this.currentTime;this.paused=true;if(this.useFallback)this.fallback.pause();else this.node?.port.postMessage({cmd:'pause'})}
  get currentTime(){return this.useFallback?this.fallback.currentTime:Math.min(176.64,this._position+(!this.paused&&this.context?Math.max(0,this.context.currentTime-this._stamp):0))}
  set currentTime(t){this._position=t;this._stamp=this.context?.currentTime||0;if(this.useFallback)this.fallback.currentTime=t;else if(this.initialized)this.node.port.postMessage({cmd:'seek',time:t})}
  set volume(v){this._volume=v;if(this.gain)this.gain.gain.setTargetAtTime(v,this.context.currentTime,.015);this.fallback.volume=v}
  get volume(){return this._volume}
  setMode(value){this.mode=value;if(this.initialized)this.node.port.postMessage({cmd:'mode',value});document.querySelector('#soundStatus').textContent=`PAULA / ${value.toUpperCase()} · ${this.node?'LIVE MOD':'READY'}`}
}
