/* Realtime material finishing for the procedural Canvas artwork.
 * Input is the live, locally painted canvas, never an external texture asset.
 * VilkaFinish.init(canvas) -> {available,render(source,t,style,energy),error,logs,dispose}.
 * render returns the WebGL canvas on success, the source canvas on failure.
 * Apply before subtitles. The source's bottom caption margin is left untreated.
 */
(function(root){
'use strict';
const vertexSource=`
attribute vec2 aPosition;
varying vec2 vUV;
void main(){vUV=aPosition*0.5+0.5;gl_Position=vec4(aPosition,0.0,1.0);}
`;
const fragmentSource=`
precision PRECISION float;
uniform sampler2D uSource;
uniform vec2 uSourceSize;
uniform vec2 uOutputSize;
uniform float uTime;
uniform float uEnergy;
uniform float uAA;
uniform float uPixel;
uniform float uMaterial;
uniform float uRelief;
uniform float uTexture;
uniform float uBloom;
uniform float uCinema;
uniform float uGraphic;
varying vec2 vUV;

float lum(vec3 c){return dot(c,vec3(0.2126,0.7152,0.0722));}
vec3 image(vec2 uv){return texture2D(uSource,clamp(uv,vec2(0.00001),vec2(0.99999))).rgb;}
float hash(vec2 p){p=fract(p*vec2(.1031,.1030));p+=dot(p,p+33.33);return fract(p.x*p.y);}
float smoothNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}
float fbm(vec2 p){return .57*smoothNoise(p)+.28*smoothNoise(p*2.07+13.4)+.15*smoothNoise(p*4.17+7.2);}
mat2 rotation(float a){float cs=cos(a),sn=sin(a);return mat2(cs,-sn,sn,cs);}

// Local contrast guided FXAA. Only high-contrast stair steps are integrated.
// Long poster edges remain crisp; fine lines reject samples that exceed extrema.
vec3 edgeAA(vec2 uv,vec3 center){
 vec2 px=1.0/uSourceSize;
 vec3 nw=image(uv+vec2(-1.0,1.0)*px),ne=image(uv+vec2(1.0,1.0)*px);
 vec3 sw=image(uv+vec2(-1.0,-1.0)*px),se=image(uv+vec2(1.0,-1.0)*px);
 float m=lum(center),a=lum(nw),b=lum(ne),c=lum(sw),d=lum(se);
 float lo=min(m,min(min(a,b),min(c,d))),hi=max(m,max(max(a,b),max(c,d)));
 float contrast=hi-lo;
 if(contrast<max(.026,hi*.085))return center;
 vec2 dir=vec2(-((a+b)-(c+d)),((a+c)-(b+d)));
 float reduction=max((a+b+c+d)*.03125,.0078125);
 float inverse=1.0/(min(abs(dir.x),abs(dir.y))+reduction);
 dir=clamp(dir*inverse,vec2(-5.0),vec2(5.0))*px;
 vec3 aa=.5*(image(uv+dir*(1.0/3.0-.5))+image(uv+dir*(2.0/3.0-.5)));
 vec3 bb=aa*.5+.25*(image(uv+dir*-.5)+image(uv+dir*.5));
 float lb=lum(bb);vec3 result=(lb<lo||lb>hi)?aa:bb;
 // Restrained coverage for print; no blur is applied inside flat fills.
 float coverage=uAA*mix(.92,.57,uGraphic);
 return mix(center,result,coverage);
}

// Finite, interrupted brush deposits. Each cell owns its direction and centre;
// the surface cannot form global contour rings or continuous wood-grain bands.
float brushDeposit(vec2 p,vec2 cellSize,float seed){
 vec2 id=floor(p/cellSize),local=mod(p,cellSize)-cellSize*.5;
 float a=(hash(id+vec2(seed,4.7))-.5)*.86;
 vec2 offset=vec2(hash(id+seed+2.1),hash(id+seed+8.4))-.5;
 vec2 q=rotation(a)*(local-offset*vec2(3.0,1.3));
 float halfLength=cellSize.x*(.29+.10*hash(id+seed+3.8));
 float halfWidth=cellSize.y*(.17+.09*hash(id+seed+9.3));
 float radius=length(q/vec2(halfLength,halfWidth));
 float envelope=1.0-smoothstep(.42,1.0,radius);
 // Anisotropic pigment granules make short bristles inside the stroke only.
 float fibre=smoothNoise(vec2(q.x*.045,q.y*1.27)+id*vec2(7.31,11.17)+seed);
 float breaks=smoothstep(.12,.66,smoothNoise(q*vec2(.22,.15)+id*3.71+seed));
 return envelope*(.28+.72*fibre)*(.40+.60*breaks);
}
float paintHeight(vec2 p,float direction){
 float broad=brushDeposit(p,vec2(34.0,15.0),1.73);
 float fine=brushDeposit(p+vec2(13.7,6.2),vec2(25.0,12.0),8.91);
 float tooth=smoothNoise(p*.49);
 return .35+.30*broad+.20*fine+.08*tooth;
}
float paperHeight(vec2 p){
 float fibre=.5+.5*sin(p.x*2.18+.32*sin(p.y*.091)+smoothNoise(p*.063));
 float tooth=fbm(p*.62);
 return .62*tooth+.24*fibre+.14*smoothNoise(p*vec2(.033,.47));
}
float clothHeight(vec2 p){
 float warp=pow(.5+.5*cos(p.x*1.15),4.0),weft=pow(.5+.5*cos(p.y*1.15),4.0);
 float over=mod(floor(p.x/5.464)+floor(p.y/5.464),2.0);
 return mix(warp*.75+weft*.25,warp*.25+weft*.75,over);
}
float heightAt(vec2 p,float orientation){
 if(uMaterial<.5)return 0.0;
 if(uMaterial<1.5)return paintHeight(p,orientation);
 if(uMaterial>4.5&&uMaterial<5.5)return clothHeight(p);
 return paperHeight(p);
}

// Only saturated, genuinely bright elements glow; white paper is not emissive.
vec3 emission(vec3 c){
 float mx=max(c.r,max(c.g,c.b)),mn=min(c.r,min(c.g,c.b));
 float saturation=(mx-mn)/max(mx,.001);
 float signal=smoothstep(.56,.91,mx)*smoothstep(.12,.48,saturation);
 return c*signal;
}
vec3 bloomAt(vec2 uv){
 vec2 px=1.0/uSourceSize;
 vec3 sum=emission(image(uv+vec2(3.0,0.0)*px));
 sum+=emission(image(uv+vec2(-3.0,0.0)*px));
 sum+=emission(image(uv+vec2(0.0,3.0)*px));
 sum+=emission(image(uv+vec2(0.0,-3.0)*px));
 sum+=.65*emission(image(uv+vec2(7.0,5.0)*px));
 sum+=.65*emission(image(uv+vec2(-7.0,5.0)*px));
 sum+=.65*emission(image(uv+vec2(7.0,-5.0)*px));
 sum+=.65*emission(image(uv+vec2(-7.0,-5.0)*px));
 return sum/6.6;
}

void main(){
 vec2 uv=vUV;
 if(uPixel>.5){
  // Exact source-texel lookup: handheld, DOS and ASCII never enter AA or shading.
  uv=(floor(uv*uSourceSize)+.5)/uSourceSize;
  gl_FragColor=vec4(image(uv),1.0);return;
 }
 vec3 raw=image(uv),color=raw;
 float artMask=smoothstep(.112,.153,uv.y);
 if(artMask<=0.0){gl_FragColor=vec4(raw,1.0);return;}
 if(uAA>.0)color=edgeAA(uv,raw);
 vec2 px=1.0/uSourceSize;
 vec3 north=image(uv+vec2(0.0,1.0)*px),south=image(uv-vec2(0.0,1.0)*px);
 vec3 east=image(uv+vec2(1.0,0.0)*px),west=image(uv-vec2(1.0,0.0)*px);
 float l=lum(raw),ln=lum(north),ls=lum(south),le=lum(east),lw=lum(west);
 vec2 edge=vec2(le-lw,ln-ls);
 float edgeMagnitude=length(edge);
 float interior=1.0-smoothstep(.025,.20,edgeMagnitude);
 float orientation=atan(edge.y+.0001,edge.x+.0001)+1.5707963;
 // Large uniform regions get gently curved bristles, not unmotivated random marks.
 float region=fbm(uv*vec2(960.0,540.0)*.006);
 orientation=mix(-.23+.55*region,orientation,smoothstep(.025,.14,edgeMagnitude));
 // Material scale follows the artwork, independent of source supersampling.
 vec2 p=uv*vec2(960.0,540.0);
 if(uTexture>.0){
  float h=heightAt(p,orientation);
  float hx=heightAt(p+vec2(.72,0.0),orientation)-heightAt(p-vec2(.72,0.0),orientation);
  float hy=heightAt(p+vec2(0.0,.72),orientation)-heightAt(p-vec2(0.0,.72),orientation);
  vec3 normal=normalize(vec3(-hx*uRelief,-hy*uRelief,1.0));
  vec3 lightDir=normalize(vec3(-.42,.52,.79));
  float diffuse=dot(normal,lightDir)/lightDir.z-1.0;
  // Dark ink stays solid and fine printed edges avoid a shiny bevel.
  float surface=smoothstep(.035,.25,l)*mix(.34,1.0,interior);
  float pigment=(h-.48)*uTexture;
  float reliefLight=clamp(diffuse,-.20,.20)*uTexture*2.6;
  if(uMaterial>2.5&&uMaterial<3.5){
   // Charcoal granules settle in paper valleys; highlights retain open paper.
   float tooth=paperHeight(p*.8);
   float charcoal=smoothstep(.08,.65,l)*(1.0-smoothstep(.77,.95,l));
   pigment=(tooth-.51)*uTexture*(.3+charcoal*1.7);
   reliefLight*=.26;
  }
  if(uMaterial>3.5&&uMaterial<4.5){
   // One-pixel offset occlusion at cut-paper boundaries creates layer thickness.
   float back=lum(image(uv+vec2(-2.0,2.5)*px));
   float shade=clamp(l-back,-.16,.16);
   color-=vec3(max(shade,0.0))*.20;
   color+=vec3(max(-shade,0.0))*.08;
  }
  color*=1.0+(pigment+reliefLight)*surface;
  if(uMaterial>.5&&uMaterial<1.5){
   vec3 halfDir=normalize(lightDir+vec3(0.0,0.0,1.0));
   float spec=pow(max(dot(normal,halfDir),0.0),35.0);
   color+=vec3(.95,.84,.67)*spec*uTexture*.074*surface;
  }
 }
 if(uRelief>.0){
  // A restrained one-pixel rim follows actual shapes, with no fabricated geometry.
  float bevel=clamp(dot(edge,vec2(-.55,.68)),-.14,.14);
  float strength=uRelief*.055*(1.0-uGraphic*.8);
  color+=bevel*strength*vec3(1.0,.94,.87);
 }
 if(uCinema>.0){
  vec2 camera=(uv-vec2(.49,.51))*vec2(1.0,.63);
  float vignette=smoothstep(.19,.64,length(camera));
  float key=exp(-dot((uv-vec2(.29,.68))*vec2(1.0,1.5),(uv-vec2(.29,.68))*vec2(1.0,1.5))*4.0);
  // Soft key light lives inside the drawn materials, shadows keep their blacks.
  color*=1.0+uCinema*(key*.028-vignette*.072);
  vec3 coolShadow=vec3(-.006,.001,.010)*(1.0-smoothstep(.05,.42,l));
  color+=coolShadow*uCinema;
 }
 if(uBloom>.0){
  vec3 glow=bloomAt(uv);
  // Screen blend instead of fog. Pure black keeps structure; no clipping halo.
  color+=glow*(1.0-color)*uBloom*(.93+uEnergy*.07);
 }
 // Sub-perceptual quantization dither for gradients, anchored to screen pixels.
 // This is disabled for graphic layouts and never changes from frame to frame.
 float dither=(hash(floor(uv*uOutputSize))-.5)/510.0;
 color+=vec3(dither)*(1.0-uGraphic);
 color=clamp(color,0.0,1.0);
 gl_FragColor=vec4(mix(raw,color,artMask),1.0);
}
`;

function profile(style){
 style=style||{};const kind=style.kind||'',look=Number(style.look)||0,family=style.family||'';
 const p={aa:1,pixel:0,material:0,relief:.35,texture:0,bloom:0,cinema:.22,graphic:0};
 if((kind==='game'&&(look===0||look===5))||(kind==='extra'&&look===0))return{aa:0,pixel:1,material:0,relief:0,texture:0,bloom:0,cinema:0,graphic:1};
 if(kind==='world'){
  if(look===0)Object.assign(p,{aa:1,cinema:.90,relief:.42,texture:0});
  if(look===1)Object.assign(p,{aa:.78,material:1,relief:1.15,texture:.16,cinema:.12});
  if(look===2)Object.assign(p,{aa:.60,material:2,relief:.58,texture:.09,cinema:.08,graphic:.50});
  if(look===3)Object.assign(p,{aa:.95,relief:1.0,bloom:.20,cinema:.55});
  if(look===4)Object.assign(p,{aa:.66,material:2,relief:.24,texture:.055,cinema:0,graphic:1});
  if(look===5)Object.assign(p,{aa:.74,material:3,relief:.55,texture:.17,cinema:.08,graphic:.38});
  if(look===6)Object.assign(p,{aa:1,material:1,relief:.60,texture:.07,cinema:.40});
  if(look===7)Object.assign(p,{aa:.85,material:2,relief:.30,texture:.065,cinema:.66,graphic:.5});
  if(look===8)Object.assign(p,{aa:1,relief:.19,cinema:.18,graphic:.20});
  if(look===9)Object.assign(p,{aa:.72,material:4,relief:1.12,texture:.10,cinema:.15,graphic:.45});
  if(look===10)Object.assign(p,{aa:1,relief:.68,bloom:.065,cinema:.55,graphic:.33});
  if(look===11)Object.assign(p,{aa:1,relief:.38,bloom:.18,cinema:.26});
 }else if(kind==='game'){
  if(look===1)Object.assign(p,{aa:.74,relief:.58,cinema:.30,graphic:.55});
  if(look===2)Object.assign(p,{aa:.55,bloom:.17,relief:0,cinema:.15,graphic:.85});
  if(look===3)Object.assign(p,{aa:1,relief:.24,bloom:.04,cinema:.24,texture:0});
  if(look===4)Object.assign(p,{aa:.83,relief:.62,cinema:.22,graphic:.42});
  if(look===6)Object.assign(p,{aa:.83,relief:.20,bloom:.095,cinema:.25});
  if(look===7)Object.assign(p,{aa:.88,material:2,relief:.30,texture:.055,cinema:.1,graphic:.64});
 }else if(kind==='extra'){
  if(look===1)Object.assign(p,{aa:.68,material:5,relief:1.2,texture:.15,cinema:.12,graphic:.30});
  if(look===2)Object.assign(p,{aa:.64,material:2,relief:.33,texture:.055,cinema:.10,graphic:1});
  if(look===3)Object.assign(p,{aa:.50,relief:0,texture:0,cinema:0,graphic:1});
 }else if(kind==='gpu')Object.assign(p,{aa:.9,relief:0,texture:0,bloom:0,cinema:0});
 else if(family==='anime')Object.assign(p,{aa:1,relief:.24,texture:0,cinema:.20});
 else if(family==='painting')Object.assign(p,{material:1,relief:.9,texture:.10});
 return p;
}

function init(canvas){
 let gl=null,program=null,quad=null,texture=null,uniforms=null,position=-1;
 let ready=false,disposed=false,lost=false,error='',logs=[],textureWidth=0,textureHeight=0,lastPixel=-1;
 const note=(label,value)=>{if(value){const line=label+': '+value;logs.push(line);if(logs.length>24)logs.shift();return line}return''};
 function destroyResources(){
  if(gl&&!lost){if(texture)gl.deleteTexture(texture);if(quad)gl.deleteBuffer(quad);if(program)gl.deleteProgram(program)}
  texture=null;quad=null;program=null;uniforms=null;textureWidth=0;textureHeight=0;lastPixel=-1;
 }
 function compile(type,source,label){
  const shader=gl.createShader(type);if(!shader)throw new Error(label+': unable to allocate shader');
  gl.shaderSource(shader,source);gl.compileShader(shader);const info=gl.getShaderInfoLog(shader)||'';note(label,info.trim());
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error(label+': '+(info||'compilation failed without a log'))}return shader;
 }
 function build(){
  if(disposed||!canvas||typeof canvas.getContext!=='function'){error='A dedicated HTMLCanvasElement or OffscreenCanvas is required.';return}
  ready=false;
  try{
   gl=gl||canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'})||canvas.getContext('experimental-webgl',{alpha:false,antialias:false,depth:false,stencil:false});
   if(!gl)throw new Error('WebGL1 is unavailable, or the output canvas already owns a different context.');
   destroyResources();
   const high=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT),precision=high&&high.precision>0?'highp':'mediump';
   let vs=null,fs=null;
   try{vs=compile(gl.VERTEX_SHADER,vertexSource,'vertex');fs=compile(gl.FRAGMENT_SHADER,fragmentSource.replace('PRECISION',precision),'fragment');program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);const info=gl.getProgramInfoLog(program)||'';note('link',info.trim());if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Program link failed: '+(info||'no driver log'))}
   finally{if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs)}
   quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
   position=gl.getAttribLocation(program,'aPosition');texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
   uniforms={};for(const name of ['Source','SourceSize','OutputSize','Time','Energy','AA','Pixel','Material','Relief','Texture','Bloom','Cinema','Graphic'])uniforms[name]=gl.getUniformLocation(program,'u'+name);
   gl.useProgram(program);gl.uniform1i(uniforms.Source,0);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);gl.disable(gl.DITHER);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
   error='';ready=true;note('ready',precision+' fragment precision; runtime canvas texture; one rendering pass');
  }catch(e){error=e&&e.message?e.message:String(e);note('error',error);ready=false;destroyResources()}
 }
 function onLost(event){if(event&&event.preventDefault)event.preventDefault();lost=true;ready=false;error='WebGL context lost; waiting for browser restoration.';note('context',error)}
 function onRestored(){if(disposed)return;lost=false;program=null;quad=null;texture=null;uniforms=null;build()}
 if(canvas&&canvas.addEventListener){canvas.addEventListener('webglcontextlost',onLost,false);canvas.addEventListener('webglcontextrestored',onRestored,false)}
 build();
 function render(source,t,style,energy){
  if(!ready||disposed||lost||!source)return source;
  const width=Number(source.videoWidth||source.naturalWidth||source.width)||0,height=Number(source.videoHeight||source.naturalHeight||source.height)||0;
  if(width<1||height<1){error='The source canvas has no pixels.';return source}
  try{
   const p=profile(style),pixel=p.pixel>.5?1:0;
   gl.useProgram(program);gl.viewport(0,0,canvas.width,canvas.height);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
   if(lastPixel!==pixel){gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,pixel?gl.NEAREST:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,pixel?gl.NEAREST:gl.LINEAR);lastPixel=pixel}
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
   if(textureWidth!==width||textureHeight!==height){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);textureWidth=width;textureHeight=height}
   else gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,gl.RGBA,gl.UNSIGNED_BYTE,source);
   gl.uniform2f(uniforms.SourceSize,width,height);gl.uniform2f(uniforms.OutputSize,canvas.width,canvas.height);gl.uniform1f(uniforms.Time,Number(t)||0);
   const e=typeof energy==='number'?energy:energy&&Number(energy.value||energy.rms)||0;gl.uniform1f(uniforms.Energy,Math.max(0,Math.min(1,e)));
   for(const pair of [['AA','aa'],['Pixel','pixel'],['Material','material'],['Relief','relief'],['Texture','texture'],['Bloom','bloom'],['Cinema','cinema'],['Graphic','graphic']])gl.uniform1f(uniforms[pair[0]],p[pair[1]]);
   gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,6);
   error='';return canvas;
  }catch(e){error=e&&e.message?e.message:String(e);note('render',error);return source}
 }
 function dispose(){if(disposed)return;disposed=true;ready=false;if(canvas&&canvas.removeEventListener){canvas.removeEventListener('webglcontextlost',onLost,false);canvas.removeEventListener('webglcontextrestored',onRestored,false)}destroyResources();gl=null}
 return{render,dispose,canvas,get available(){return ready&&!lost&&!disposed},get error(){return error},get logs(){return logs.slice()}};
}
const api={init,profile};root.VilkaFinish=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
