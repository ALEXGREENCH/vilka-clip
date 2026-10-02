/* ВИЛКА — eight original, fully procedural realtime worlds.
 * No textures, images, frame exports, network access or dependencies.
 * WebGL 1 / GLSL ES 1.00. 32 distance-field steps, up to 48 for close studio
 * objects; analytic floors, stable normals and deferred bracket refinement.
 * API: const worlds=VilkaShaders.init(canvas);
 *      worlds.render(seconds, styleId /* 0..7 * /, energy /* 0..1 * /, section);
 *      worlds.available, worlds.logs, worlds.dispose().
 */
(function(root){
'use strict';
const styles=['CHROME / original and copies','BRUTAL / industrial artery','GLASS / liquid memory','ALIEN / silent landscape','NEON / cathedral of work','INFERNO / final interview','ESCHER / impossible office','PSYCHE / fluid hyperspace'];
const vertexSource='attribute vec2 aPosition; varying vec2 vUv; void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.0,1.0);}';
const fragmentSource=`
precision __PRECISION__ float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uEnergy;
uniform float uStyle;
uniform float uSection;
const float PI=3.14159265359;
const float TAU=6.28318530718;
const float TRACE_PRECISION_SCALE=__TRACE_PRECISION_SCALE__;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float sat(float x){return clamp(x,0.0,1.0);}
vec3 palette(float x){return .52+.48*cos(TAU*(x+vec3(.02,.35,.68)));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){return noise(p)*.55+noise(p*2.03+7.1)*.27+noise(p*4.11-3.7)*.13;}
float box(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}
float sphere(vec3 p,float r){return length(p)-r;}
float torus(vec3 p,vec2 r){return length(vec2(length(p.xz)-r.x,p.y))-r.y;}
float cylinder(vec3 p,float r,float h){vec2 q=vec2(length(p.xz)-r,abs(p.y)-h);return min(max(q.x,q.y),0.0)+length(max(q,0.0));}
float roundedBox(vec3 p,vec3 outer,float radius){return box(p,outer-vec3(radius))-radius;}
float smin(float a,float b,float k){float h=sat(.5+.5*(b-a)/k);return mix(b,a,h)-k*h*(1.-h);}
vec2 unite(vec2 a,vec2 b){return a.x<b.x?a:b;}
float fork(vec3 p){
 // Keep the original outer dimensions, with a resolvable rolled-metal bevel
 // and smooth welds. A hard union followed by one final offset left concave
 // normal discontinuities at every tine/bar intersection.
 float d=roundedBox(p-vec3(0.,-.63,0.),vec3(.15,1.105,.145),.077);
 d=smin(d,roundedBox(p-vec3(0.,.50,0.),vec3(.535,.16,.145),.078),.065);
 for(int i=0;i<4;i++){float x=(float(i)-1.5)*.265;float rise=.56+.025*cos(float(i));d=smin(d,roundedBox(p-vec3(x,1.07,0.),vec3(.12,rise+.045,.14),.067),.012);}
 return d;
}
float mountain(vec2 p){
 float a=sin(p.x*.17+sin(p.y*.08)*1.7),b=sin(p.y*.12-p.x*.09),ridge=abs(a+b);
 return ridge*2.8+fbm(p*.18)*2.4-3.0;
}

// Distance and material. IDs: 1 stone, 2 metal, 3 glass, 4 emissive,
// 5 terrain, 6 lava, 7 marble, 8 iridescent fluid, 9 dark acoustic fabric.
vec2 scene(vec3 p){
 float t=uTime;
 if(uStyle<.5){
  vec2 d=vec2(10000.,7.); // The studio floor is intersected analytically.
  vec3 f=p-vec3(-.45,.10,.15);f.xz=rot(.22*sin(t*.28))*f.xz;f.xy=rot(-.13)*f.xy;
  d=unite(d,vec2(fork(f),2.));
  // One smoothly joined revolved profile. The old sharp cylinder intersected
  // a separate torus, creating two discontinuous rings of mirror normals.
  float dish=cylinder(p-vec3(0.,-1.50,0.),1.945,.022)-.075;
  dish=smin(dish,torus(p-vec3(0.,-1.385,0.),vec2(1.89,.10)),.13);
  d=unite(d,vec2(dish,2.));
  d=unite(d,vec2(sphere(p-vec3(1.19,-.76,.40),.63),2.));
  d=unite(d,vec2(torus(p-vec3(0.,-1.70,0.),vec2(2.52,.025)),4.));
  return d;
 }
 if(uStyle<1.5){
  vec3 q=p;q.z=mod(p.z+2.,4.)-2.;
  vec2 d=vec2(min(p.y+1.60,min(3.85-abs(p.x),4.1-p.y)),1.);
  d=unite(d,vec2(box(vec3(abs(q.x)-3.20,q.y-.75,q.z),vec3(.28,2.5,.33)),1.));
  d=unite(d,vec2(box(q-vec3(0.,3.30,0.),vec3(3.5,.31,.35)),1.));
  d=unite(d,vec2(box(vec3(abs(p.x)-3.77,p.y-.45,p.z),vec3(.03,.04,70.)),4.));
  d=unite(d,vec2(box(vec3(abs(p.x)-.92,p.y+1.53,p.z),vec3(.055,.055,70.)),2.));
  return d;
 }
 if(uStyle<2.5){
  vec2 d=vec2(10000.,7.);vec3 q=p;q.xy=rot(.18*sin(t*.3))*q.xy;
  float blob=sphere(q-vec3(-.3,.0,.0),1.13);
  blob=smin(blob,sphere(q-vec3(.70,.93,.0),.63),.48);
  blob=smin(blob,sphere(q-vec3(-1.1,-.50,.25),.70),.40);
  blob+=sin(q.x*5.+t*.46)*sin(q.y*4.-t*.36)*sin(q.z*4.5)*.035;
  // Displacement gradient <= .035 * length(vec3(5,4,4.5)); .78 is a
  // conservative distance bound, including the smooth union underneath.
  d=unite(d,vec2(blob*.78,3.));
  vec3 a=p-vec3(1.05,.1,1.4);a.xy=rot(-.4)*a.xy;a.yz=rot(PI*.5)*a.yz;
  d=unite(d,vec2(torus(a,vec2(1.55,.16)),3.));
  d=unite(d,vec2(sphere(p-vec3(-1.55,1.30,.25),.26),3.));
  d=unite(d,vec2(torus(p-vec3(0.,-1.71,0.),vec2(2.20,.035)),4.));
  return d;
 }
 if(uStyle<3.5){
  vec2 d=vec2((p.y-mountain(p.xz))*.44,5.);
  vec3 q=p-vec3(5.2,0.,15.);q.xz=rot(.16)*q.xz;
  d=unite(d,vec2(box(q-vec3(0.,3.6,0.),vec3(.42,5.8,.45)),2.));
  d=unite(d,vec2(box(q-vec3(2.5,2.,-.1),vec3(.30,4.5,.40)),2.));
  d=unite(d,vec2(box(q-vec3(1.25,6.9,0.),vec3(1.63,.12,.45)),4.));
  return d;
 }
 if(uStyle<4.5){
  vec3 q=p;q.z=mod(p.z+3.,6.)-3.;
  vec2 d=vec2(10000.,7.);
  d=unite(d,vec2(cylinder(vec3(abs(q.x)-3.25,q.y-1.2,q.z),.20,3.5),2.));
  vec3 arch=vec3(q.x,q.z,q.y-.5);float ring=torus(arch,vec2(3.3,.09));
  d=unite(d,vec2(ring,4.));
  d=unite(d,vec2(box(vec3(abs(p.x)-3.29,p.y+1.78,p.z),vec3(.06,.045,65.)),4.));
  vec3 altar=p-vec3(0.,-.42,19.);altar.xz=rot(t*.12)*altar.xz;
  d=unite(d,vec2(fork(altar)*.90,4.));
  return d;
 }
 if(uStyle<5.5){
  vec2 d=vec2(10000.,6.);
  vec3 f=p-vec3(0.,.30,1.4);f.xz=rot(.16*sin(t*.36))*f.xz;
  d=unite(d,vec2(fork(f/1.35)*1.35,2.));
  vec3 q=p;q.x=abs(p.x)-3.30;q.y=mod(p.y+1.55,1.60)-.8;
  d=unite(d,vec2(box(q-vec3(0.,0.,1.8),vec3(.87,.70,.58)),9.));
  for(int i=0;i<3;i++){vec3 a=p-vec3(0.,-.9,2.9+float(i)*.7);a.yz=rot(PI*.5)*a.yz;d=unite(d,vec2(torus(a,vec2(2.8+float(i)*.4,.04)),4.));}
  return d;
 }
 if(uStyle<6.5){
  vec3 q=p;q.xy=rot(p.z*.095+.12*sin(t*.17))*q.xy;q.z=mod(p.z+2.5,5.)-2.5;
  float outer=max(abs(q.x)-3.1,abs(q.y)-2.25);
  float frame=max(abs(outer)-.11,abs(q.z)-.22);
  vec2 d=vec2(frame*.73,7.);
  vec3 stair=q;stair.x=abs(stair.x);stair.y+=2.35;
  float stepH=.12+floor((q.z+2.5)*2.)*.12;
  d=unite(d,vec2(box(stair-vec3(2.35,stepH*.5,0.),vec3(.62,stepH*.5,2.5))*.73,7.));
  vec3 crossing=q;crossing.xy=rot(PI*.25)*crossing.xy;
  d=unite(d,vec2(box(crossing-vec3(0.,.15,0.),vec3(3.9,.055,.055))*.73,2.));
  d=unite(d,vec2(box(vec3(abs(q.x)-3.11,abs(q.y)-2.20,q.z),vec3(.025,.025,2.4))*.73,4.));
  return d;
 }
 // A camera inside an eightfold liquid chamber, with nested octahedra.
 vec3 q=p;float a=atan(q.y,q.x),r=length(q.xy);a=mod(a+PI/8.,PI/4.)-PI/8.;
 q.xy=vec2(cos(a),sin(a))*r;float wall=3.7+.42*sin(p.z*.53-t*.37)+.31*cos(a*8.+p.z*.4+t*.23)-r;
 vec2 d=vec2(wall*.72,8.);vec3 gem=p;gem.xy=rot(p.z*.24+t*.18)*gem.xy;gem.z=mod(p.z+3.,6.)-3.;
 gem.x=abs(gem.x)-1.95;gem.y=abs(gem.y)-.5;
 float oct=(abs(gem.x)+abs(gem.y)+abs(gem.z)-.85)*.577;
 d=unite(d,vec2(oct,8.));return d;
}

vec3 environment(vec3 rd){
 float up=sat(rd.y*.5+.5),horizon=pow(1.-abs(rd.y),5.);
 vec3 sky=mix(vec3(.018,.025,.052),vec3(.10,.16,.25),up);
 sky+=vec3(.36,.20,.09)*horizon*.45;
 float strip=pow(max(0.,cos(atan(rd.z,rd.x)*3.)),24.);
 sky+=vec3(.95,.79,.54)*strip*pow(sat(rd.y+.2),3.);
 sky+=vec3(.12,.62,.75)*pow(sat(1.-abs(rd.y-.12)*8.),8.);
 if(uStyle<.5){sky=mix(vec3(.12,.145,.17),vec3(.38,.41,.44),up);sky+=vec3(.16,.145,.12)*horizon;}
 if(uStyle>1.5&&uStyle<2.5){
  sky=mix(vec3(.54,.30,.21),vec3(.85,.71,.56),up);
  sky+=vec3(.38,.55,.46)*pow(sat(dot(rd,normalize(vec3(-.65,.35,.5)))),5.);
  sky+=vec3(1.7,1.55,1.22)*pow(sat(dot(rd,normalize(vec3(-.6,.75,-.3)))),14.);
 }
 if(uStyle>2.5&&uStyle<3.5){
  sky=mix(vec3(.38,.15,.22),vec3(.035,.05,.15),up);
  vec3 planetDir=normalize(vec3(-.70,.45,.8));float planet=dot(rd,planetDir);
  float disc=smoothstep(.940,.943,planet),bands=.72+.28*sin(rd.y*125.+rd.x*19.);
  sky=mix(sky,vec3(.50,.38,.47)*bands,disc);sky+=vec3(.49,.36,.50)*pow(sat(1.-abs(planet-.941)*170.),4.)*.5;
  sky+=vec3(.80,.40,.14)*pow(sat(dot(rd,normalize(vec3(.55,.13,1.)))),130.);
 }
 if(uStyle>3.5&&uStyle<4.5)sky=vec3(.01,.017,.034)+vec3(.12,.06,.22)*horizon;
 if(uStyle>4.5&&uStyle<5.5)sky=vec3(.045,.006,.01)+vec3(.37,.033,.006)*horizon;
 if(uStyle>5.5&&uStyle<6.5)sky=mix(vec3(.023,.025,.036),vec3(.28,.29,.32),up);
 if(uStyle>6.5)sky=palette(rd.x*.3+rd.y*.17+uTime*.015)*(.16+horizon*.35);
 return sky;
}
// Analytical area lights are intentionally much brighter than the visible
// studio walls. These wide white bands make metal and glass read as materials.
vec3 studioReflection(vec3 rd,float filtering){
 float az=atan(rd.z,rd.x),el=rd.y;
 // Integrate the procedural area-light transition over the angular footprint
 // of a bevel pixel. This filters only reflected light, not image geometry.
 float panelA=(1.-smoothstep(.10,.25+filtering,abs(sin(az-.48))))*smoothstep(-.65,-.24,el);
 float panelB=(1.-smoothstep(.12,.33+filtering,abs(sin(az+1.14))))*(1.-smoothstep(.68,.97,abs(el)));
 float overhead=pow(sat(dot(rd,normalize(vec3(-.20,.92,-.32)))),7.);
 float slim=(1.-smoothstep(.025,.065+filtering*.8,abs(sin(az+2.1))))*smoothstep(-.7,.1,el);
 vec3 studio=vec3(.23,.26,.29)+vec3(3.8,3.85,3.9)*panelA+vec3(2.4,2.27,2.05)*panelB+vec3(2.7)*overhead+vec3(1.7,2.0,2.2)*slim;
 if(uStyle>1.5)studio=vec3(.51,.43,.33)+vec3(3.6,3.9,3.45)*panelA+vec3(2.35,1.3,.63)*panelB+vec3(2.3,2.65,2.7)*overhead+vec3(.55,2.0,1.65)*slim;
 return studio;
}
vec3 normalAt(vec3 p,float footprint){
 // Symmetric samples avoid the systematic normal tilt of forward differences
 // at thin tine bevels, cylinder rims and smooth-union boundaries.
 float e=max(clamp(footprint*.18,.0012,.0045),max(length(p),1.)*TRACE_PRECISION_SCALE);
 vec3 n=vec3(scene(p+vec3(e,0.,0.)).x-scene(p-vec3(e,0.,0.)).x,
             scene(p+vec3(0.,e,0.)).x-scene(p-vec3(0.,e,0.)).x,
             scene(p+vec3(0.,0.,e)).x-scene(p-vec3(0.,0.,e)).x);
 float l=length(n);return l>.00001?n/l:vec3(0.,1.,0.);
}
vec3 lighting(vec3 p,vec3 n,vec3 rd,float material,float footprint){
 vec3 light=normalize(vec3(-.6,.85,-.65)),base=vec3(.27,.30,.34);
 float lambert=max(dot(n,light),0.),rim=pow(1.-max(dot(n,-rd),0.),3.);
 bool studio=uStyle<.5||(uStyle>1.5&&uStyle<2.5);
 float filtering=studio?clamp(footprint/.075,.045,.30):0.;
 float spec=pow(max(dot(reflect(-light,n),-rd),0.),48./(1.+filtering*4.));
 vec3 reflected=environment(reflect(rd,n));
 if(studio)reflected=studioReflection(reflect(rd,n),filtering);
 if(material<1.5){
  float seams=step(.965,fract(p.z*.25))*step(.12,abs(n.z));float rough=noise(p.xz*9.)*.10;
  base=vec3(.31,.29,.25)-rough-seams*.14;
  base*=.26+lambert*.74;base+=vec3(1.,.36,.09)*exp(-abs(p.y-.45)*1.2)*.16;
  base+=vec3(.23,.32,.37)*rim*.19;
 }else if(material<2.5){
  base=reflected*(.80+rim*.38)+vec3(1.,.88,.72)*spec*.8;
  base+=vec3(.07,.10,.12)*lambert;
  if(uStyle<.5)base=reflected*vec3(.94,.98,1.03)*(1.03+rim*.24)+vec3(1.35,1.30,1.24)*spec+vec3(.15,.17,.18)*rim;
 }else if(material<3.5){
  vec3 bend=refract(rd,n,.71),refracted=studioReflection(bend,filtering);
  vec3 chroma=vec3(studioReflection(refract(rd,n,.66),filtering).r,refracted.g,studioReflection(refract(rd,n,.77),filtering).b);
  float fresnel=.045+.955*pow(1.-max(dot(n,-rd),0.),5.);
  vec3 transmission=chroma*vec3(.76,1.,.90)*.95;
  base=mix(transmission,reflected,.08+fresnel*.86)+vec3(2.0,2.7,2.4)*spec;
  base+=vec3(.15,.78,.64)*pow(rim,1.8)*.73;
  float caustic=pow(.5+.5*sin((bend.x-bend.y)*17.+bend.z*11.),12.);
  base+=vec3(.6,.95,.73)*caustic*(.10+.24*rim);
 }else if(material<4.5){
  base=uStyle>4.5&&uStyle<5.5?vec3(2.7,.24,.025):mix(vec3(.11,1.5,2.1),vec3(1.7,.18,1.35),.5+.5*sin(p.z*.24+uTime*.1));
  base*=.90+.035*min(uSection,7.)+.12*uEnergy;
 }else if(material<5.5){
  float strata=.5+.5*sin(p.y*13.+noise(p.xz*.7)*3.);
  base=mix(vec3(.19,.12,.18),vec3(.53,.26,.20),strata*.54);
  base*=.27+lambert*.95;base+=vec3(.12,.17,.27)*rim*.28;
 }else if(material<6.5){
  float cracks=abs(sin(p.x*2.1+sin(p.z*.8))*sin(p.z*1.8+sin(p.x*.6)));
  float lava=1.-smoothstep(.014,.085,cracks);
  base=vec3(.065,.031,.026)*(.32+lambert*.7)+vec3(2.0,.24,.015)*lava*(.6+uEnergy*.7);
  base+=reflected*.13;
 }else if(material<7.5){
  float tiles=mod(floor(p.x*1.3)+floor(p.z*1.3),2.);
  base=mix(vec3(.075,.083,.105),vec3(.43,.40,.36),tiles);
  if(uStyle>5.5)base=mix(vec3(.48,.48,.45),vec3(.14,.16,.18),step(.97,fract(p.z*2.)));
  base*=.32+lambert*.64;base+=reflected*.16+spec*.15;
  if(uStyle<.5){base=vec3(.12,.145,.17)*(.60+lambert*.40)+reflected*.085;float pedestal=exp(-dot(p.xz,p.xz)*.19);base+=vec3(.17,.16,.14)*pedestal;}
  if(uStyle>1.5&&uStyle<2.5){float pool=exp(-dot(p.xz,p.xz)*.16);base=vec3(.49,.30,.205)*(.75+lambert*.28)+reflected*.055;float caustics=pow(.5+.5*sin(length(p.xz)*9.-uTime*.15+sin(p.x*4.)),10.);base+=vec3(.37,.52,.39)*caustics*pool*.5;}
 }else if(material<8.5){
  base=palette(p.z*.057+atan(p.y,p.x)*.32+uTime*.017);
  base*=.27+lambert*.48;base+=reflected*.30+vec3(.7)*spec*.5+palette(p.z*.1+uTime*.03)*rim*.55;
 }else{
  float grille=step(.43,fract(p.x*20.))*step(.43,fract(p.y*20.));
  base=vec3(.028,.023,.024)+vec3(.06)*grille*lambert;
  vec3 q=p;q.y=mod(p.y+1.55,1.6)-.8;float cone=abs(length(q.xy-vec2(sign(p.x)*3.3,0.))-.46);
  base+=vec3(.5,.055,.015)*exp(-cone*55.)*(.2+uEnergy*.5);
 }
 return max(base,vec3(0.));
}
vec2 analyticFloor(){
 if(uStyle<.5)return vec2(-1.75,7.);
 if(uStyle>1.5&&uStyle<2.5)return vec2(-1.85,7.);
 if(uStyle>3.5&&uStyle<4.5)return vec2(-2.10,7.);
 if(uStyle>4.5&&uStyle<5.5)return vec2(-1.65,6.);
 return vec2(-10000.,0.);
}
vec3 shadeRay(vec3 ro,vec3 rd,float pixelCone){
 bool studio=uStyle<.5||(uStyle>1.5&&uStyle<2.5);
 vec2 floorInfo=analyticFloor();float floorTravel=10000.;
 if(floorInfo.y>.5&&rd.y<-.0001)floorTravel=(floorInfo.x-ro.y)/rd.y;
 if(floorTravel<.0)floorTravel=10000.;
 float limit=min(65.,floorTravel),travel=.025,lastTravel=travel,lastDistance=10000.;
 float material=0.,dist=10000.,glow=0.,refineLo=0.,refineHi=0.;bool hit=false,floorHit=false,needsRefine=false;
 for(int i=0;i<48;i++){
  if(i>=32&&!studio)break;
  if(travel>=limit)break;
  vec2 sd=scene(ro+rd*travel);dist=sd.x;
  float footprint=max(.001,travel*pixelCone),epsilon=max(max(.0007,footprint*.065),travel*TRACE_PRECISION_SCALE);
  if(sd.y>3.5&&sd.y<4.5)glow+=exp(-abs(dist)*4.)*.026;
  if(dist<0.){
   if(lastDistance>0.&&travel>lastTravel){
    // Never shade an arbitrary point after an overshoot. Find the crossing
    // between the last free sample and the first interior sample instead.
    refineLo=lastTravel;refineHi=travel;needsRefine=true;hit=true;break;
   }
   // A camera initially inside a folded/terrain cell must leave it before
   // accepting an entry hit. This also avoids invalid back-facing normals.
   lastTravel=travel;lastDistance=dist;travel+=max(abs(dist)*.75,epsilon*2.);continue;
  }
  if(lastDistance<0.){lastTravel=travel;lastDistance=dist;travel+=max(dist,epsilon*4.);continue;}
  if(dist<=epsilon){hit=true;break;}
  lastTravel=travel;lastDistance=dist;
  // No fixed .012 minimum: it previously skipped features while close to
  // a surface. The only lower bound is a fraction of the subpixel epsilon.
  travel+=max(dist*(studio?.88:.82),epsilon*.25);
 }
 // Keep refinement outside the primary loop. WebGL 1 drivers may inline and
 // unroll nested loops; nesting these samples inside 48 steps inflated shader
 // compilation dramatically even though the branch only runs after a hit.
 if(needsRefine){
  for(int refine=0;refine<6;refine++){float mid=(refineLo+refineHi)*.5;if(scene(ro+rd*mid).x>0.)refineLo=mid;else refineHi=mid;}
  travel=(refineLo+refineHi)*.5;
 }
 if(!hit&&floorTravel<=65.){travel=floorTravel;material=floorInfo.y;hit=true;floorHit=true;}
 vec3 color=environment(rd);
 if(hit){
  vec3 pos=ro+rd*travel;float footprint=max(.001,travel*pixelCone);
  if(!floorHit)material=scene(pos).y;
  vec3 n=floorHit?vec3(0.,1.,0.):normalAt(pos,footprint);
  // Roundoff in a CSG crease may select the back-facing half of a bevel.
  // Face-forward only affects the shading normal, never the hit location.
  if(dot(n,rd)>0.)n=-n;
  color=lighting(pos,n,rd,material,footprint);
  float fog=1.-exp(-travel*(uStyle>2.5&&uStyle<3.5?.019:.012));color=mix(color,environment(rd),fog);
 }
 vec3 glowColor=uStyle>4.5&&uStyle<5.5?vec3(1.8,.13,.012):uStyle>3.5&&uStyle<4.5?vec3(.12,.48,1.1):vec3(.15,.48,.62);
 return color+glowColor*glow;
}
void main(){
 vec2 uv=(vUv*2.-1.)*vec2(uResolution.x/max(uResolution.y,1.),1.);
 float t=uTime;vec3 ro=vec3(4.0*sin(.16*sin(t*.17)),1.45,-6.4),ta=vec3(0.,-.05,0.);float lens=1.65;
 if(uStyle>.5&&uStyle<1.5){ro=vec3(.22*sin(t*.17),.38,-8.+mod(t*.53,4.));ta=ro+vec3(.08*sin(t*.14),.14,10.);lens=1.05;}
 if(uStyle>1.5&&uStyle<2.5){ro=vec3(4.*sin(t*.10),1.10,-5.8*cos(t*.10));ta=vec3(0.,-.05,.1);lens=1.45;}
 if(uStyle>2.5&&uStyle<3.5){ro=vec3(sin(t*.08)*2.,3.5,-9.+sin(t*.055)*3.);ta=vec3(2.,1.,15.);lens=1.20;}
 if(uStyle>3.5&&uStyle<4.5){ro=vec3(.38*sin(t*.18),-.08,-8.+mod(t*.48,6.));ta=ro+vec3(0.,.52,10.);lens=1.12;}
 if(uStyle>4.5&&uStyle<5.5){ro=vec3(sin(t*.21)*.55,.05,-6.2);ta=vec3(0.,.26,1.5);lens=1.14;}
 if(uStyle>5.5&&uStyle<6.5){ro=vec3(.23*sin(t*.19),.12,-8.+mod(t*.42,5.));ta=ro+vec3(.05,.1,10.);lens=1.02;}
 if(uStyle>6.5){ro=vec3(.22*sin(t*.19),.18*cos(t*.24),-7.+mod(t*.60,6.));ta=ro+vec3(.35*sin(t*.14),.2*cos(t*.11),9.);lens=1.0;uv=rot(.12*sin(t*.12))*uv;}
 vec3 f=normalize(ta-ro),r=normalize(cross(f,vec3(0.,1.,0.))),u=cross(r,f),rd=normalize(r*uv.x+u*uv.y+f*lens);
 float pixelCone=2./(max(uResolution.y,1.)*lens);
 vec3 color=shadeRay(ro,rd,pixelCone);
 if(uStyle>3.5&&uStyle<4.5){float shaft=pow(max(0.,sin(uv.x*9.+sin(uv.y*.7))),26.);color+=vec3(.035,.06,.13)*shaft*(.7+uv.y*.2);}
 if(uStyle>4.5&&uStyle<5.5){float smoke=fbm(uv*4.+vec2(t*.07,-t*.12));color+=vec3(.17,.013,.001)*pow(smoke,3.);}
 float vignette=1.-.22*dot(vUv-.5,vUv-.5);color*=vignette;
 if(uStyle<.5)color*=1.14;
 if(uStyle>1.5&&uStyle<2.5)color*=1.10;
 // Stable display transform. Audio alters local illumination, never flashes.
 color=color/(vec3(1.)+color);color=pow(max(color,vec3(0.)),vec3(.82));
 gl_FragColor=vec4(color,1.);
}`;

function sectionValue(section){if(typeof section==='number')return Number.isFinite(section)?section:0;let v=0,s=String(section||'');for(let i=0;i<s.length;i++)v=(v*31+s.charCodeAt(i))>>>0;return v%997;}
function init(canvas){
 const logs=[];let gl=null,program=null,buffer=null,locations=null,disposed=false,lost=false;
 const api={available:false,logs,styles:styles.slice(),error:null,render,dispose};
 if(!canvas||typeof canvas.getContext!=='function'){api.error='VilkaShaders.init requires a canvas.';logs.push(api.error);return api;}
 try{const opts={alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'high-performance'};gl=canvas.getContext('webgl',opts)||canvas.getContext('experimental-webgl',opts);}catch(error){logs.push(String(error));}
 if(!gl){api.error='WebGL 1 is unavailable on this canvas.';logs.push(api.error);return api;}
 function compile(kind,source,label){
  const shader=gl.createShader(kind);gl.shaderSource(shader,source);gl.compileShader(shader);
  const message=gl.getShaderInfoLog(shader);if(message&&message.trim())logs.push(label+': '+message.trim());
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;
 }
 function build(){
  let precision='mediump';try{const f=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT);if(f&&f.precision>0)precision='highp';}catch(error){logs.push('Precision query: '+String(error));}
  const vert=compile(gl.VERTEX_SHADER,vertexSource,'vertex');if(!vert)return false;
  const sourceFor=level=>fragmentSource.replace('__PRECISION__',level).replace('__TRACE_PRECISION_SCALE__',level==='highp'?'0.000001':'0.0015');
  let frag=compile(gl.FRAGMENT_SHADER,sourceFor(precision),'fragment '+precision);
  if(!frag&&precision==='highp')frag=compile(gl.FRAGMENT_SHADER,sourceFor('mediump'),'fragment mediump fallback');
  if(!frag){gl.deleteShader(vert);return false;}
  program=gl.createProgram();gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);gl.deleteShader(vert);gl.deleteShader(frag);
  const message=gl.getProgramInfoLog(program);if(message&&message.trim())logs.push('link: '+message.trim());
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);program=null;return false;}
  buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  locations={position:gl.getAttribLocation(program,'aPosition'),resolution:gl.getUniformLocation(program,'uResolution'),time:gl.getUniformLocation(program,'uTime'),style:gl.getUniformLocation(program,'uStyle'),energy:gl.getUniformLocation(program,'uEnergy'),section:gl.getUniformLocation(program,'uSection')};
  gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);return true;
 }
 try{api.available=build();}catch(error){logs.push('initialization: '+String(error));}
 if(!api.available){api.error='Procedural shader initialization failed. Inspect .logs for compiler diagnostics.';if(root.console&&root.console.warn)root.console.warn('VilkaShaders:',api.error,logs);}
 function onLost(event){event.preventDefault();lost=true;api.available=false;logs.push('WebGL context lost. Waiting for restoration.');}
 function onRestored(){if(disposed)return;lost=false;try{api.available=build();api.error=api.available?null:'Shader rebuild after context restoration failed.';}catch(error){api.available=false;api.error=String(error);logs.push(api.error);}}
 if(canvas.addEventListener){canvas.addEventListener('webglcontextlost',onLost,false);canvas.addEventListener('webglcontextrestored',onRestored,false);}
 function render(t,styleId,energy,section){
  if(disposed||lost||!api.available)return false;
  const sec=Number(t),id=Number(styleId),amp=Number(energy);
  gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(locations.position);gl.vertexAttribPointer(locations.position,2,gl.FLOAT,false,0,0);
  gl.uniform2f(locations.resolution,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.uniform1f(locations.time,Number.isFinite(sec)?sec:0);gl.uniform1f(locations.style,Number.isFinite(id)?((Math.floor(id)%8)+8)%8:0);gl.uniform1f(locations.energy,Number.isFinite(amp)?Math.max(0,Math.min(1,amp)):0);gl.uniform1f(locations.section,sectionValue(section));
  gl.drawArrays(gl.TRIANGLES,0,6);return true;
 }
 function dispose(){
  if(disposed)return;disposed=true;api.available=false;
  if(canvas.removeEventListener){canvas.removeEventListener('webglcontextlost',onLost,false);canvas.removeEventListener('webglcontextrestored',onRestored,false);}
  if(gl&&!lost){if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);}buffer=null;program=null;
 }
 return api;
}
root.VilkaShaders={init,styles:styles.slice()};
if(typeof module!=='undefined'&&module.exports)module.exports=root.VilkaShaders;
})(typeof window!=='undefined'?window:globalThis);
