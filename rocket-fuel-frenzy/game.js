const canvas=document.getElementById('c');
const ctx=canvas.getContext('2d');
let W=0,H=0,D=1,playing=false,paused=false,score=0,best=+localStorage.getItem('best_'+CFG.id)||0,last=0,startT=0,choice=0;
let state={},objects=[],particles=[],keys={},pointer={down:false,x:0,y:0,sx:0,sy:0,px:0,py:0,tx:0,ty:0};
let combo=0,maxCombo=0,streak=0,lastLaneMove=0,ended=false,muted=false;
const $=id=>document.getElementById(id);
const scoreEl=$('score'),bestEl=$('best'),timeEl=$('time'),modeEl=$('mode'),overlay=$('overlay'),toast=$('toast');
bestEl.textContent=best;

function resize(){
  D=Math.min(2,devicePixelRatio||1);
  W=Math.max(320,innerWidth);
  H=Math.max(520,innerHeight);
  canvas.width=W*D;
  canvas.height=H*D;
  ctx.setTransform(D,0,0,D,0,0);
}
addEventListener('resize',resize);
resize();

CFG.choices.forEach((c,i)=>{
  let b=document.createElement('button');
  b.className='choice'+(i?'':' active');
  b.innerHTML='<b>'+c.name+'</b><span>'+c.desc+'</span>';
  b.onclick=()=>{
    choice=i;
    document.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    modeEl.textContent=c.short||'GR8';
  };
  $('choices').appendChild(b);
});
modeEl.textContent=CFG.choices[0].short||'GR8';
$('how').onclick=()=>{$('help').style.display=$('help').style.display==='none'?'block':'none'};
$('start').onclick=start;

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function choiceCfg(){return CFG.choices[choice]||{}}
function nowRun(){return Math.floor((performance.now()-startT)/1000)}
function add(n,label){
  const gain=Math.max(1,Math.round(n*(choiceCfg().bonus||1)));
  score+=gain;
  scoreEl.textContent=score;
  if(score>best){
    best=score;
    bestEl.textContent=best;
    localStorage.setItem('best_'+CFG.id,best);
  }
  if(label) show(label);
}
function show(t){
  if(muted)return;
  toast.textContent=t;
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
}
function burst(x,y,color='#35ff8d',count=12){
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2,sp=60+Math.random()*210;
    particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:.35+Math.random()*.45,color,r:2+Math.random()*3});
  }
}
function postResult(reason){
  const result={
    source:'GR8_GAMZ',
    type:'score',
    game:CFG.id,
    score,
    best,
    mode:choiceCfg().short||choiceCfg().name||'GR8',
    streak,
    combo:maxCombo||combo,
    survival:nowRun(),
    reason
  };
  try{parent.postMessage(result,'*')}catch(e){}
}
function end(t){
  if(ended)return;
  ended=true;
  playing=false;
  paused=false;
  if(score>best){best=score;localStorage.setItem('best_'+CFG.id,best);bestEl.textContent=best}
  postResult(t);
  overlay.style.display='grid';
  overlay.querySelector('h1').textContent=t;
  overlay.querySelector('p').textContent='Score '+score+' • Best '+best+' • '+nowRun()+'s run • ready for one more go?';
  $('start').textContent='Play again';
}
function start(){
  overlay.style.display='none';
  score=0;combo=0;maxCombo=0;streak=0;ended=false;paused=false;
  scoreEl.textContent=0;
  objects=[];particles=[];
  state={t:0,spawn:0};
  pointer.down=false;
  startT=last=performance.now();
  playing=true;
  init();
}
addEventListener('message',e=>{
  const data=e.data||{};
  if(data.source!=='GR8_GAMZ_HOST')return;
  if(data.type==='pause')paused=true;
  if(data.type==='resume')paused=false;
  if(data.type==='mute')muted=!!data.muted;
});

addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  keys[k]=true;
  if(['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s',' '].includes(k))e.preventDefault();
  if(e.key===' '&&!playing)start();
  if(CFG.mode==='lane'&&playing){
    if(k==='arrowleft'||k==='a')moveLane(-1);
    if(k==='arrowright'||k==='d')moveLane(1);
  }
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});

canvas.onpointerdown=e=>{
  pointer={down:true,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,px:e.clientX,py:e.clientY,tx:e.clientX,ty:e.clientY};
  down(e);
};
canvas.onpointermove=e=>{
  pointer.px=pointer.x; pointer.py=pointer.y;
  pointer.x=e.clientX; pointer.y=e.clientY;
  pointer.tx=e.clientX; pointer.ty=e.clientY;
};
canvas.onpointerup=e=>{
  pointer.down=false;
  up(e);
};
addEventListener('touchmove',e=>{if(playing)e.preventDefault()},{passive:false});

const leftBtn=$('leftBtn'),rightBtn=$('rightBtn');
if(leftBtn)leftBtn.addEventListener('pointerdown',e=>{e.preventDefault();moveLane(-1)});
if(rightBtn)rightBtn.addEventListener('pointerdown',e=>{e.preventDefault();moveLane(1)});

function moveLane(dir){
  if(!state.player||!playing)return;
  const next=clamp(state.player.lane+dir,0,2);
  if(next!==state.player.lane){
    state.player.lane=next;
    lastLaneMove=performance.now();
    burst(state.lanes[next],state.player.y,'#35ff8d',8);
    show('LANE '+(next+1));
  }
}

function init(){
  const m=CFG.mode,c=choiceCfg();
  if(m==='breakout'){
    const rows=5,cols=8,gap=9;
    state.p={x:W/2,y:H-76,w:clamp(128*(c.size||1),104,190),h:16,target:W/2};
    state.b={x:W/2,y:H*.62,r:10,vx:190+(c.speed?45:0),vy:-255};
    state.br=[];
    const margin=50,bw=(W-margin*2-(cols-1)*gap)/cols;
    for(let r=0;r<rows;r++)for(let col=0;col<cols;col++){
      state.br.push({x:margin+col*(bw+gap),y:92+r*36,w:bw,h:24,hit:false,life:1+(r>2?1:0)});
    }
  }
  if(m==='basket'){
    state.ball={x:W/2,y:H-110,r:18,vx:0,vy:0,shot:false};
    state.hoop={x:W*.72,y:H*.28,r:40,dir:1};
    state.miss=0;state.made=0;
  }
  if(m==='lane'){
    state.lanes=[W*.25,W*.5,W*.75];
    state.player={lane:1,y:H-108,r:24};
    state.lastHazard=-1;state.safeGap=0;
  }
  if(m==='tapgrid'){
    state.grid=[];
    state.left=60;
    makeGrid();
  }
  if(m==='hockey'){
    state.p={x:W/2,y:H-90,r:30,vx:0,vy:0};
    state.ai={x:W/2,y:88,r:30};
    state.pk={x:W/2,y:H/2,r:14,vx:160*(Math.random()<.5?-1:1),vy:245};
    state.cpu=0;state.playerGoals=0;state.cool=0;
  }
  if(m==='shooter'){
    state.ship={x:W/2,y:H-80,r:22};
    state.fire=0;state.wave=1;state.spawn=.4;
  }
  if(m==='doors'){
    state.level=1;state.lives=2;rollDoor();
  }
  if(m==='traffic'){
    state.cars=[];state.spawn=.45;state.safeTimer=0;
  }
  if(m==='rocket'){
    state.rocket={x:W/2,y:H/2,r:22,vx:0,vy:0};
    state.fuel=100;state.spawn=.2;state.near=0;
  }
}
function makeGrid(){
  const palette=['#35ff8d','#ff2f7d','#44eaff','#fbbf24','#9b5cff'];
  state.grid=[];
  for(let y=0;y<7;y++){
    for(let x=0;x<7;x++){
      const near=state.grid.find(c=>c.x===x-1&&c.y===y);
      const above=state.grid.find(c=>c.x===x&&c.y===y-1);
      let color=Math.random()<.48&&near?near.c:palette[Math.floor(Math.random()*palette.length)];
      if(Math.random()<.22&&above)color=above.c;
      state.grid.push({x,y,c:color,alive:true,scale:1});
    }
  }
}
function rollDoor(){
  state.safe=Math.floor(Math.random()*3);
  state.clue=Math.max(0,Math.min(2,state.safe+(Math.random()<.72?0:(Math.random()<.5?-1:1))));
}

function update(dt){
  if(paused)return;
  const m=CFG.mode,c=choiceCfg();
  state.t+=dt;
  if(m==='breakout')updateBreakout(dt,c);
  if(m==='basket')updateBasket(dt,c);
  if(m==='lane')updateLane(dt,c);
  if(m==='tapgrid'){state.left-=dt;if(state.left<=0)return end('TIME UP');timeEl.textContent=Math.ceil(state.left)+'s'}
  if(m==='hockey')updateHockey(dt,c);
  if(m==='shooter')updateShooter(dt,c);
  if(m==='traffic')updateTraffic(dt,c);
  if(m==='rocket')updateRocket(dt,c);
  for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;p.life-=dt}
  particles=particles.filter(p=>p.life>0);
}
function updateBreakout(dt,c){
  let p=state.p,b=state.b;
  if(pointer.down)p.target=pointer.x;
  if(keys.arrowleft||keys.a)p.target-=540*dt;
  if(keys.arrowright||keys.d)p.target+=540*dt;
  p.target=clamp(p.target,p.w/2,W-p.w/2);
  p.x+=(p.target-p.x)*Math.min(1,dt*14);
  b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)}
  if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)}
  if(b.y<b.r){b.y=b.r;b.vy=Math.abs(b.vy)}
  if(b.y>H+30)return end('BREAK LOST');
  if(Math.abs(b.x-p.x)<p.w/2+b.r&&Math.abs(b.y-p.y)<26&&b.vy>0){
    const hit=(b.x-p.x)/(p.w/2);
    b.vy=-Math.abs(b.vy)*(1.018+(c.speed||0)*.12);
    b.vx=clamp(b.vx+hit*170,-430,430);
    b.y=p.y-20; combo++;maxCombo=Math.max(maxCombo,combo);add(10+combo*2,'REBOUND');burst(b.x,b.y,'#44eaff',8);
  }
  for(let br of state.br){
    if(br.hit)continue;
    if(b.x>br.x-b.r&&b.x<br.x+br.w+b.r&&b.y>br.y-b.r&&b.y<br.y+br.h+b.r){
      br.life--; if(br.life<=0)br.hit=true;
      b.vy*=-1; combo++;maxCombo=Math.max(maxCombo,combo);add(45+combo*4,'BRICK');burst(b.x,b.y,'#ff2f7d',12); break;
    }
  }
  if(state.br.every(x=>x.hit)){add(500,'CLEAR');burst(W/2,H/2,'#35ff8d',30);init()}
}
function updateBasket(dt,c){
  let b=state.ball,h=state.hoop;
  h.x+=h.dir*dt*(22+state.made*8); if(h.x<W*.58||h.x>W*.82)h.dir*=-1;
  if(!b.shot&&!pointer.down){b.x=W/2;b.y=H-105}
  if(b.shot){
    b.vy+=500*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(b.vy>0&&Math.hypot(b.x-h.x,b.y-h.y)<h.r){
      state.made++;streak++;combo=streak;maxCombo=Math.max(maxCombo,combo);add(150+streak*35,'SWISH');burst(h.x,h.y,'#f97316',24);b.shot=false;b.x=W/2;b.y=H-105;
    }
    if(b.y>H+80||b.x<-80||b.x>W+80){
      b.shot=false;streak=0;combo=0;state.miss++;show('MISS '+state.miss+'/5');
      b.x=W/2;b.y=H-105;
      if(state.miss>=5)return end('SHOT CLOCK');
    }
  }
}
function updateLane(dt,c){
  const now=performance.now();
  if((keys.arrowleft||keys.a)&&now-lastLaneMove>155)moveLane(-1);
  if((keys.arrowright||keys.d)&&now-lastLaneMove>155)moveLane(1);
  state.spawn-=dt;
  let speed=270+state.t*11+(c.speed||0)*90;
  if(state.spawn<=0){
    state.spawn=clamp(.78-state.t*.006,.42,.78);
    let lane=Math.floor(Math.random()*3),type=Math.random()<.28?'good':'bad';
    if(type==='bad'&&lane===state.lastHazard)lane=(lane+1+Math.floor(Math.random()*2))%3;
    state.lastHazard=type==='bad'?lane:state.lastHazard;
    objects.push({lane,y:-46,type,r:type==='good'?15:24});
  }
  for(let o of objects){
    o.y+=speed*dt;
    if(o.lane===state.player.lane&&Math.abs(o.y-state.player.y)<o.r+state.player.r*.82){
      if(o.type==='bad')return end('OVERRUN');
      streak++;combo=streak;maxCombo=Math.max(maxCombo,combo);add(85+streak*8,'BATTERY');burst(state.lanes[o.lane],o.y,'#fbbf24',14);o.dead=true;
    }
    if(o.y>H+70){o.dead=true;if(o.type==='bad')add(8)}
  }
  objects=objects.filter(o=>!o.dead);
}
function updateHockey(dt,c){
  const p=state.p,ai=state.ai,pk=state.pk;
  const old={x:p.x,y:p.y};
  if(pointer.down){p.x+=((pointer.x)-p.x)*Math.min(1,dt*18);p.y+=(clamp(pointer.y,H/2+35,H-42)-p.y)*Math.min(1,dt*18)}
  if(keys.arrowleft||keys.a)p.x-=480*dt;if(keys.arrowright||keys.d)p.x+=480*dt;if(keys.arrowup||keys.w)p.y-=480*dt;if(keys.arrowdown||keys.s)p.y+=480*dt;
  p.x=clamp(p.x,p.r,W-p.r);p.y=clamp(p.y,H/2+32,H-p.r);
  p.vx=(p.x-old.x)/Math.max(dt,.001);p.vy=(p.y-old.y)/Math.max(dt,.001);
  ai.x+=(pk.x-ai.x)*dt*(2.4+state.playerGoals*.12);ai.y+=(clamp(pk.y,42,H/2-35)-ai.y)*dt*2.3;
  pk.x+=pk.vx*dt;pk.y+=pk.vy*dt;pk.vx*=.999;pk.vy*=.999;
  if(pk.x<pk.r||pk.x>W-pk.r){pk.x=clamp(pk.x,pk.r,W-pk.r);pk.vx*=-1}
  for(const P of [p,ai]){
    const d=Math.hypot(pk.x-P.x,pk.y-P.y);
    if(d<pk.r+P.r){
      const a=Math.atan2(pk.y-P.y,pk.x-P.x);
      const sp=clamp(Math.hypot(pk.vx,pk.vy)*1.06+90,320,720);
      pk.vx=Math.cos(a)*sp+(P.vx||0)*.18;pk.vy=Math.sin(a)*sp+(P.vy||0)*.18;
      pk.x=P.x+Math.cos(a)*(pk.r+P.r+2);pk.y=P.y+Math.sin(a)*(pk.r+P.r+2);
      add(4,'HIT');burst(pk.x,pk.y,'#44eaff',5);
    }
  }
  if(pk.y<0){state.playerGoals++;add(300,'GOAL');burst(W/2,40,'#35ff8d',28);resetPuck(1)}
  if(pk.y>H){state.cpu++;show('CPU '+state.cpu+'/5');resetPuck(-1);if(state.cpu>=5)return end('ARENA LOST')}
}
function resetPuck(dir){state.pk.x=W/2;state.pk.y=H/2;state.pk.vx=160*(Math.random()<.5?-1:1);state.pk.vy=260*dir}
function updateShooter(dt,c){
  let s=state.ship;
  if(pointer.down){s.x+=(pointer.x-s.x)*Math.min(1,dt*16);s.y+=(clamp(pointer.y,H*.45,H-45)-s.y)*Math.min(1,dt*16)}
  if(keys.arrowleft||keys.a)s.x-=460*dt;if(keys.arrowright||keys.d)s.x+=460*dt;if(keys.arrowup||keys.w)s.y-=460*dt;if(keys.arrowdown||keys.s)s.y+=460*dt;
  s.x=clamp(s.x,s.r,W-s.r);s.y=clamp(s.y,H*.42,H-s.r);
  state.fire-=dt;
  if(state.fire<=0){state.fire=.14;objects.push({x:s.x,y:s.y-24,vy:-590,type:'laser',r:4})}
  state.spawn-=dt;
  if(state.spawn<=0){
    state.spawn=clamp(.62-state.t*.005,.28,.62);
    objects.push({x:40+Math.random()*(W-80),y:-40,vy:115+Math.random()*95+state.t*3,type:'alien',r:20+Math.random()*8});
  }
  for(let o of objects){
    o.y+=o.vy*dt;
    if(o.type==='alien'&&Math.hypot(o.x-s.x,o.y-s.y)<o.r+s.r*.78)return end('SWARM HIT');
    if(o.y<-90||o.y>H+90)o.dead=true;
  }
  const lasers=objects.filter(o=>o.type==='laser'),aliens=objects.filter(o=>o.type==='alien');
  for(let l of lasers)for(let a of aliens){
    if(!l.dead&&!a.dead&&Math.hypot(l.x-a.x,l.y-a.y)<a.r){
      l.dead=a.dead=true;streak++;combo=streak;maxCombo=Math.max(maxCombo,combo);add(115+streak*7,'BLAST');burst(a.x,a.y,'#ff2f7d',16);
    }
  }
  objects=objects.filter(o=>!o.dead);
}
function updateTraffic(dt,c){
  state.spawn-=dt;
  if(state.spawn<=0){
    state.spawn=clamp(1.05-state.t*.006,.58,1.05);
    const horizontal=Math.random()<.5;
    const laneOffset=(Math.random()<.5?-1:1)*28;
    state.cars.push({x:horizontal?86:W/2+laneOffset,y:horizontal?H/2+laneOffset:86,h:horizontal,go:false,s:150+state.t*5,color:Math.random()<.5?'#35ff8d':'#ff2f7d'});
  }
  for(let car of state.cars){
    if(car.go){if(car.h)car.x+=car.s*dt;else car.y+=car.s*dt}
    if(car.x>W+80||car.y>H+80){car.dead=true;add(70,'CLEAR')}
  }
  const moving=state.cars.filter(c=>c.go);
  for(let i=0;i<moving.length;i++)for(let j=i+1;j<moving.length;j++){
    const a=moving[i],b=moving[j];
    if(Math.abs(a.x-b.x)<36&&Math.abs(a.y-b.y)<36)return end('TRAFFIC CRASH');
  }
  state.cars=state.cars.filter(c=>!c.dead);
}
function updateRocket(dt,c){
  const r=state.rocket;
  let ax=0,ay=0;
  if(pointer.down){r.x+=(pointer.x-r.x)*Math.min(1,dt*12);r.y+=(pointer.y-r.y)*Math.min(1,dt*12)}
  if(keys.arrowleft||keys.a)ax-=1;if(keys.arrowright||keys.d)ax+=1;if(keys.arrowup||keys.w)ay-=1;if(keys.arrowdown||keys.s)ay+=1;
  r.vx=(r.vx||0)*.86+ax*60;r.vy=(r.vy||0)*.86+ay*60;r.x+=r.vx*dt*12;r.y+=r.vy*dt*12;
  r.x=clamp(r.x,r.r,W-r.r);r.y=clamp(r.y,r.r,H-r.r);
  state.fuel-=dt*(8+(c.speed||0)*2);
  if(state.fuel<=0)return end('OUT OF FUEL');
  state.spawn-=dt;
  if(state.spawn<=0){
    state.spawn=clamp(.62-state.t*.004,.33,.62);
    objects.push({x:W+44,y:90+Math.random()*(H-160),vx:-(190+state.t*7),type:Math.random()<.36?'fuel':'haz',r:18});
  }
  for(let o of objects){
    o.x+=o.vx*dt;
    const d=Math.hypot(o.x-r.x,o.y-r.y);
    if(d<o.r+r.r*.86){
      if(o.type==='haz')return end('ROCKET DOWN');
      state.fuel=Math.min(100,state.fuel+24);streak++;add(105+streak*8,'FUEL');burst(o.x,o.y,'#35ff8d',16);o.dead=true;
    } else if(o.type==='haz'&&d<o.r+r.r+28){state.near++}
    if(o.x<-70)o.dead=true;
  }
  objects=objects.filter(o=>!o.dead);
  timeEl.textContent=Math.round(state.fuel)+'%';
}
function down(e){
  if(!playing)return;
  const m=CFG.mode;
  if(m==='doors'){
    const col=clamp(Math.floor(e.clientX/(W/3)),0,2);
    if(col===state.safe){
      streak++;add(120*state.level+streak*25,'TREASURE');
      burst(col*W/3+W/6,H*.48,'#fbbf24',24);
      state.level++;rollDoor();
    }else{
      state.lives--;burst(col*W/3+W/6,H*.48,'#ff2f7d',18);show('TRAP');
      if(state.lives<0)return end('TRAP TRIGGERED');
      rollDoor();
    }
  }
  if(m==='traffic'){
    const car=state.cars.find(c=>!c.go&&Math.abs(c.x-e.clientX)<90&&Math.abs(c.y-e.clientY)<90);
    if(car){car.go=true;burst(car.x,car.y,'#35ff8d',8);show('GO')}
  }
}
function up(e){
  if(CFG.mode==='basket'&&playing&&!state.ball.shot){
    let b=state.ball,dx=pointer.sx-e.clientX,dy=pointer.sy-e.clientY;
    const power=clamp(Math.hypot(dx,dy),30,250);
    const scale=2.1+(power/250)*.55;
    b.vx=dx*scale;b.vy=dy*scale;b.shot=true;
  }
  if(CFG.mode==='lane'&&playing){
    let dx=e.clientX-pointer.sx;
    if(Math.abs(dx)>24)moveLane(dx>0?1:-1);
  }
}
canvas.addEventListener('click',e=>{
  if((CFG.mode!=='tapgrid')||!playing)return;
  let s=Math.min(W,H)*.095,ox=W/2-s*3,oy=H/2-s*3;
  let gx=Math.floor((e.clientX-ox+s/2)/s),gy=Math.floor((e.clientY-oy+s/2)/s);
  let cell=state.grid.find(c=>c.alive&&c.x===gx&&c.y===gy);
  if(!cell)return;
  let group=[],seen=new Set(),stack=[cell];
  while(stack.length){
    let c=stack.pop(),k=c.x+','+c.y;
    if(seen.has(k)||!c.alive||c.c!==cell.c)continue;
    seen.add(k);group.push(c);
    state.grid.forEach(n=>{if(n.alive&&Math.abs(n.x-c.x)+Math.abs(n.y-c.y)===1)stack.push(n)});
  }
  if(group.length>=2){
    combo++;maxCombo=Math.max(maxCombo,combo);
    group.forEach(c=>{c.alive=false;burst(ox+c.x*s,oy+c.y*s,c.c,5)});
    add(group.length*group.length*20+combo*25,'CHAIN '+group.length);
  } else {combo=0;show('PAIR NEEDED')}
  if(state.grid.filter(c=>c.alive).length<10)makeGrid();
});

function gridBg(){
  ctx.fillStyle='#050507';ctx.fillRect(0,0,W,H);
  const g=ctx.createRadialGradient(W*.48,H*.38,20,W*.48,H*.38,Math.max(W,H));
  g.addColorStop(0,'rgba(68,234,255,.16)');g.addColorStop(.45,'rgba(53,255,141,.08)');g.addColorStop(1,'rgba(255,47,125,.08)');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();
  ctx.globalAlpha=.22;ctx.strokeStyle='#35ff8d';
  for(let x=0;x<W;x+=44){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(W/2,H*.48);ctx.stroke()}
  for(let y=H*.5;y<H;y+=34){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  ctx.restore();
}
function glow(x,y,r,c){
  let g=ctx.createRadialGradient(x,y,0,x,y,r*2.7);
  g.addColorStop(0,c);g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*2.7,0,7);ctx.fill();
  ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
}
function rounded(x,y,w,h,r,c){
  ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();
}
function draw(){
  gridBg();
  ctx.shadowBlur=18;ctx.shadowColor='#35ff8d';
  if(!playing){
    ctx.globalAlpha=.18;ctx.fillStyle='#35ff8d';ctx.font='900 110px Arial';ctx.textAlign='center';ctx.fillText(CFG.name,W/2,H/2);ctx.globalAlpha=1;return;
  }
  const m=CFG.mode;
  if(m==='breakout')drawBreakout();
  if(m==='basket')drawBasket();
  if(m==='lane')drawLane();
  if(m==='tapgrid')drawTapgrid();
  if(m==='hockey')drawHockey();
  if(m==='shooter')drawShooter();
  if(m==='doors')drawDoors();
  if(m==='traffic')drawTraffic();
  if(m==='rocket')drawRocket();
  for(const p of particles){ctx.globalAlpha=Math.max(0,p.life);glow(p.x,p.y,p.r,p.color);ctx.globalAlpha=1}
  if(paused){
    ctx.fillStyle='rgba(0,0,0,.48)';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#35ff8d';ctx.font='900 52px Arial';ctx.textAlign='center';ctx.fillText('PAUSED',W/2,H/2);
  }
}
function drawBreakout(){
  const p=state.p,b=state.b;
  rounded(p.x-p.w/2,p.y,p.w,p.h,9,'#35ff8d');glow(b.x,b.y,b.r,'#44eaff');
  const colors=['#35ff8d','#44eaff','#9b5cff','#ff2f7d','#fbbf24'];
  for(let br of state.br)if(!br.hit){rounded(br.x,br.y,br.w-2,br.h,8,colors[(Math.floor(br.y/36)+Math.floor(br.x/90))%colors.length])}
}
function drawBasket(){
  let b=state.ball,h=state.hoop;
  ctx.strokeStyle='#44eaff';ctx.lineWidth=6;ctx.strokeRect(h.x-72,h.y-68,144,86);
  ctx.strokeStyle='#35ff8d';ctx.lineWidth=8;ctx.beginPath();ctx.arc(h.x,h.y,h.r,0,7);ctx.stroke();
  if(pointer.down&&!b.shot){ctx.strokeStyle='#ff2f7d';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(pointer.x,pointer.y);ctx.stroke()}
  glow(b.x,b.y,b.r,'#f97316');
}
function drawLane(){
  state.lanes.forEach((x,i)=>{ctx.strokeStyle=i===state.player.lane?'rgba(53,255,141,.65)':'rgba(68,234,255,.28)';ctx.lineWidth=i===state.player.lane?5:2;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()});
  glow(state.lanes[state.player.lane],state.player.y,state.player.r,'#35ff8d');
  objects.forEach(o=>{const x=state.lanes[o.lane]; if(o.type==='good'){glow(x,o.y,14,'#fbbf24')}else{glow(x,o.y,24,'#ff2f7d');ctx.fillStyle='#050507';ctx.fillRect(x-10,o.y-4,20,8)}});
}
function drawTapgrid(){
  let s=Math.min(W,H)*.095,ox=W/2-s*3,oy=H/2-s*3;
  ctx.strokeStyle='rgba(255,255,255,.11)';ctx.strokeRect(ox-s/2,oy-s/2,s*7,s*7);
  state.grid.forEach(c=>{if(c.alive)glow(ox+c.x*s,oy+c.y*s,s*.31,c.c)});
}
function drawHockey(){
  ctx.strokeStyle='#35ff8d';ctx.lineWidth=4;ctx.strokeRect(W*.14,22,W*.72,H-44);ctx.beginPath();ctx.moveTo(W*.14,H/2);ctx.lineTo(W*.86,H/2);ctx.stroke();
  glow(state.p.x,state.p.y,state.p.r,'#35ff8d');glow(state.ai.x,state.ai.y,state.ai.r,'#ff2f7d');glow(state.pk.x,state.pk.y,state.pk.r,'#44eaff');
}
function drawShooter(){
  glow(state.ship.x,state.ship.y,state.ship.r,'#44eaff');
  objects.forEach(o=>glow(o.x,o.y,o.r,o.type==='laser'?'#35ff8d':'#ff2f7d'));
}
function drawDoors(){
  ['LEFT','MIDDLE','RIGHT'].forEach((n,i)=>{
    let x=i*W/3;ctx.fillStyle=i===state.clue?'rgba(251,191,36,.12)':'rgba(255,255,255,.055)';ctx.fillRect(x+20,H*.26,W/3-40,H*.46);
    ctx.strokeStyle=i===state.clue?'#fbbf24':'#35ff8d';ctx.lineWidth=4;ctx.strokeRect(x+20,H*.26,W/3-40,H*.46);
    ctx.fillStyle='#fff';ctx.font='900 28px Arial';ctx.textAlign='center';ctx.fillText(n,x+W/6,H*.52);
  });
  ctx.font='900 38px Arial';ctx.fillStyle='#35ff8d';ctx.fillText('Level '+state.level+' • Lives '+Math.max(0,state.lives+1),W/2,H*.15);
  ctx.font='800 20px Arial';ctx.fillStyle='#fbbf24';ctx.fillText('Clue glow marks the likely safe door',W/2,H*.2);
}
function drawTraffic(){
  ctx.strokeStyle='#44eaff';ctx.lineWidth=44;ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();
  ctx.fillStyle='#fbbf24';ctx.font='900 28px Arial';ctx.textAlign='center';ctx.fillText('TAP WAITING CARS TO GO',W/2,70);
  state.cars.forEach(c=>{rounded(c.x-27,c.y-17,54,34,9,c.go?c.color:'#fbbf24');ctx.fillStyle='#050507';ctx.font='900 16px Arial';ctx.fillText(c.h?'→':'↓',c.x,c.y+6)});
}
function drawRocket(){
  const r=state.rocket;glow(r.x,r.y,r.r,'#44eaff');
  ctx.fillStyle='rgba(53,255,141,.14)';ctx.fillRect(16,H-24,(W-32)*state.fuel/100,10);ctx.strokeStyle='#35ff8d';ctx.strokeRect(16,H-24,W-32,10);
  objects.forEach(o=>{if(o.type==='fuel'){rounded(o.x-15,o.y-24,30,48,8,'#35ff8d')}else{glow(o.x,o.y,o.r,'#ff2f7d')}});
}
function loop(t){
  let dt=Math.min(.033,(t-last)/1000||.016);last=t;
  if(playing&&!paused){timeEl.textContent=CFG.mode==='rocket'?Math.round(state.fuel||100)+'%':nowRun()+'s';update(dt)}
  draw();requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
