// Shared browser/offline Amiga replay. libopenmpt emulates Paula resampling and A500 filters.
import init from './libopenmpt.js';
export const ready = init();
export function stringCall(m, fn, ...values) {
  const ptrs=values.map(v=>{const s=String(v),p=m._malloc(s.length+1);for(let i=0;i<s.length;i++)m.HEAPU8[p+i]=s.charCodeAt(i);m.HEAPU8[p+s.length]=0;return p});
  try{return fn(...ptrs)}finally{ptrs.forEach(p=>m._free(p))}
}
export class Paula {
  constructor(m, bytes, rate=48000) {
    this.m=m;this.rate=rate;this.position=0;
    const file=m._malloc(bytes.length);m.HEAPU8.set(bytes,file);
    try{this.ptr=m._openmpt_module_create_from_memory(file,bytes.length,0,0,0)}finally{m._free(file)}
    if(!this.ptr)throw Error('Invalid MOD');
    this.left=m._malloc(4096*4);this.right=m._malloc(4096*4);
    m._openmpt_module_set_repeat_count(this.ptr,0);
    m._openmpt_module_set_render_param(this.ptr,2,80);
    this.ctl('play.at_end','stop');this.ctl('seek.sync_samples','1');this.mode('a500');
  }
  ctl(name,value){if(!stringCall(this.m,(n,v)=>this.m._openmpt_module_ctl_set(this.ptr,n,v),name,value))throw Error('Unsupported audio control: '+name)}
  mode(value){this.ctl('render.resampler.emulate_amiga','1');this.ctl('render.resampler.emulate_amiga_type',value)}
  seek(t){this.position=this.m._openmpt_module_set_position_seconds(this.ptr,t);return this.position}
  read(left,right){
    const n=this.m._openmpt_module_read_float_stereo(this.ptr,this.rate,left.length,this.left,this.right),heap=this.m.HEAPF32;
    for(let i=0;i<left.length;i++){
      const fade=Math.max(0,Math.min(1,(176.64-this.position-i/this.rate)/3.84));
      // Gentle analogue-like saturation, with headroom; identical in exports and live replay.
      left[i]=i<n?.88*Math.tanh(heap[(this.left>>2)+i]*2.35)*fade:0;
      right[i]=i<n?.88*Math.tanh(heap[(this.right>>2)+i]*2.35)*fade:0;
    }
    this.position+=n/this.rate;return n;
  }
  destroy(){this.m._openmpt_module_destroy(this.ptr);this.m._free(this.left);this.m._free(this.right)}
}
