/* One deterministic audio-derived clock for the live demo and video export. */
(function(root){'use strict';
const data=typeof module!=='undefined'&&module.exports?require('./timing'):root.DemoTiming;
function index(a,t){let lo=0,hi=a.length;while(lo<hi){const m=(lo+hi)>>1;if(a[m][0]<=t)lo=m+1;else hi=m}return Math.max(0,lo-1)}
const integral=[0];for(let i=1;i<data.levels.length;i++){const a=data.levels[i-1],b=data.levels[i];integral[i]=integral[i-1]+(b[0]-a[0])*(.75+.25*(a[1]+b[1]))}
function at(t){
 const p=index(data.peaks,t),e=data.peaks[p],i=index(data.levels,t),a=data.levels[i],b=data.levels[Math.min(i+1,data.levels.length-1)],u=b[0]>a[0]?Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0]))):0;
 const energy=a[1]+(b[1]-a[1])*u,beat=(t-data.beatOffset)/data.beatDuration,phase=((beat%1)+1)%1;
 const hit=t>=e[0]?e[1]*Math.exp(-(t-e[0])/.105):0;
 return {beat,energy,pulse:Math.max(hit,.18*energy*Math.exp(-phase*9)),motion:integral[i]+Math.max(0,t-a[0])*(.75+.25*(a[1]+energy))};
}
const api={...data,at};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DemoRhythm=api;
})(typeof window!=='undefined'?window:this);
