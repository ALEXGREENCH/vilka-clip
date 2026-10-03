/* Shared camera geometry. Positive y points down; all surfaces use the same camera. */
(function(root){'use strict';
const faces=[[3,2,1,0],[5,6,7,4],[1,5,4,0],[2,6,5,1],[3,7,6,2],[0,4,7,3]];
function clipNear(vertices,near=.18){
 const out=[];
 for(let i=0;i<vertices.length;i++){
  const a=vertices[i],b=vertices[(i+1)%vertices.length],inside=a[2]>=near,next=b[2]>=near;
  if(inside)out.push(a);
  if(inside!==next){const u=(near-a[2])/(b[2]-a[2]);out.push([a[0]+u*(b[0]-a[0]),a[1]+u*(b[1]-a[1]),near])}
 }
 return out;
}
function normal(v){const a=v[1].map((x,i)=>x-v[0][i]),b=v[2].map((x,i)=>x-v[0][i]);return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function visible(v){return normal(v).reduce((n,x,i)=>n+x*v[0][i],0)<0}
function project(v,f=260,cx=320,cy=164){return[cx+f*v[0]/v[2],cy+f*v[1]/v[2]]}
function camera(v,x,z,yaw=0){const xx=v[0]-x,zz=v[2]-z,co=Math.cos(yaw),si=Math.sin(yaw);return[xx*co-zz*si,v[1],xx*si+zz*co]}
const api={faces,clipNear,normal,visible,project,camera};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SceneGeometry=api;
})(typeof window!=='undefined'?window:this);
