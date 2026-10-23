"use strict";
(function(){
const SHOP=[
{name:"木质音乐盒",price:2800,detail:"木色盒身，放在书桌刚好",notes:[659.25,783.99,880,783.99,659.25,587.33,659.25,523.25]},
{name:"玻璃音乐盒",price:3900,detail:"浅蓝透明外壳，声音清亮",notes:[783.99,987.77,1174.66,987.77,880,783.99,659.25,783.99]},
{name:"小型音乐挂件",price:1200,detail:"轻巧，适合放进随身包",notes:[523.25,659.25,783.99,659.25,587.33,523.25,440,523.25]}
];
const FRAMES=["原始画面","靠近一点","保留更多背景"];
let gestureX=null,audioContext=null;
const item=(s)=>SHOP[Math.max(0,Math.min(2,Number(s.shopPick)||0))];
function boarding(s,e){
return '<div class="boarding-page"><div class="boarding-background"></div><div class="boarding-top"><span>DEPARTURE · 北海道</span><span>BOARDING 01 / 07</span></div><div class="boarding-inner"><div class="board-head">有一张机票，<br>上面写着你的名字。</div><p class="board-blurb">每次出发都有不同的故事。<br>把登机牌向右滑动，进入第一章。</p><div class="boarding-ticket" data-swipe="boarding" aria-label="向右滑动登机牌"><div class="ticket-title"><span>HOKKAIDO / WINTER</span><span>✈ 0723</span></div><div class="ticket-route"><div>PEK<small>BEIJING</small></div><div class="ticket-flight">──────── ✈ ────────</div><div>CTS<small>JAPAN</small></div></div><div class="ticket-fields"><span>TRAVELER<b>'+e(s.name)+'</b></span><span>DEPARTURE<b>DEC 19</b></span><span>TRIP<b>7 DAYS</b></span></div><div class="ticket-foot">BOARDING PASS · 19—25 DEC <span>NO. 0001</span></div></div><div class="swipe-caption">　<span>→</span> 向右滑动票面登机</div><button class="primary light" data-act="board">登机 · 开始故事　↗</button><small class="board-footer">触控不便也可以点击按钮 · 虚构旅行票</small></div></div>';
}
function view(s,state,renderBeat){
  // Original narrative WeChat mode: render all scripted bubbles immediately.
  // Retain old chatProgress in saves, but don't use it to gate reading.
  const active=s.beats.filter(b=>!b.when||b.when(state));
  return {html:active.map((b,i)=>renderBeat(b,i)).join(""),done:true};
}

function shop(s,e){
const a=item(s),solo=s.current==="solo_musicbox",pending=s.shopStep==="confirm";
return '<div class="divider"></div><div class="label-caps">MUSIC BOX SHOP · OTARU</div><h2 class="shop-title">试听与挑选</h2><p class="tiny">轻触 ▶ 试听游戏原创合成短旋律。商品和金额为虚构的玩法示例。</p><div class="shop-wallet"><span>纪念品试玩预算</span><b>¥'+Number(s.budget??10000).toLocaleString()+'</b></div><div class="shop-grid">'+SHOP.map((b,i)=>'<button class="shop-item '+(i===Number(s.shopPick||0)?"on":"")+'" data-act="shop-select" data-index="'+i+'"><span class="shop-mark">♫</span><span class="shop-item-info"><b>'+e(b.name)+'</b><small>'+e(b.detail)+'</small></span><span class="shop-price">¥'+b.price.toLocaleString()+'</span></button>').join("")+'</div><div class="shop-listen"><div class="listen-disc">♫</div><div class="listen-copy"><b>'+e(a.name)+'</b><small>原创八音旋律 · 约 3 秒</small></div><button class="listen-button" data-act="shop-listen" aria-label="试听音乐盒旋律">▶</button></div>'+(pending?'<div class="shop-purchase"><b>要把 '+e(a.name)+' 带回去吗？</b><p>确认后扣除 ¥'+a.price.toLocaleString()+' 虚拟纪念品预算，并收进旅行背包。</p><div class="clickrow"><button class="primary" data-act="shop-confirm">确认购买</button><button class="ghost" data-act="shop-cancel">再看看</button></div></div>':'<div class="options"><button class="option" data-act="shop-buy"><span class="index">01</span><span><span class="option-main">购买这只音乐盒</span><span class="option-note">¥'+a.price.toLocaleString()+' · 记入旅行背包</span></span><span class="option-arrow">↗</span></button><button class="option" data-act="shop-note"><span class="index">02</span><span class="option-main">只记下这段旋律，不购买</span><span class="option-arrow">↗</span></button><button class="option" data-act="shop-other"><span class="index">03</span><span class="option-main">'+(solo?"听完离开，不买纪念品":"问张极为什么喜欢那首")+'</span><span class="option-arrow">↗</span></button></div>')+'<p class="shop-note">本商店没有实际付款功能。其他章节的物品暂未采用这套预算。</p>';
}
function camera(s,scenes,jpg,e){
const p=s.pendingPhoto;if(!p)return "";
const choice=scenes[p.scene]?.choices[p.index],photo=choice?.fx?.photo;
if(!photo)return '<div class="section"><button class="primary" data-act="camera-discard">返回剧情</button></div>';
const frame=Number(p.frame)||0;
return '<div class="camera-app"><div class="camera-header"><span>CAPTURE · '+e(photo.title)+'</span><span>● '+(p.taken?"PREVIEW":"LIVE")+'</span></div><div class="camera-view frame-'+frame+'" style="--camera-photo:url(&quot;'+jpg(photo.type)+'&quot;)"><div class="viewfinder-lines"><i></i><i></i><i></i><i></i></div><div class="focus-dot">+</div><span class="cam-date">DEC '+photo.day+' · HOKKAIDO</span></div><div class="camera-body">'+(p.taken?'<div class="camera-feedback">拍好了 · '+e(FRAMES[frame])+'</div><div class="clickrow"><button class="primary" data-act="camera-keep">保留照片</button><button class="ghost" data-act="camera-retake">重拍</button></div><button class="small-btn" data-act="camera-discard">删除照片，继续剧情</button>':'<div class="frame-choices">'+FRAMES.map((t,i)=>'<button class="frame-option '+(frame===i?"on":"")+'" data-act="camera-frame" data-index="'+i+'">'+e(t)+'</button>').join("")+'</div><button class="shutter" data-act="camera-shutter" aria-label="拍摄"><span></span></button><button class="small-btn" data-act="camera-discard">不拍照，继续剧情</button>')+'<div class="camera-disclaimer">氛围图片仅作游戏画面示意，不调用真实手机摄像头。</div>'+(window.PortraitStudio?window.PortraitStudio.referenceStrip(s,e,photo):"")+'</div></div>';
}
function prepareFx(s,scene,index,opts,fx){
let out=Object.assign({},fx||{});
if((scene.id==="musicbox"||scene.id==="solo_musicbox")&&index===0){
  const a=item(s);if(Number(s.budget??10000)<a.price)return null;
  out.item={name:a.name,desc:a.detail+" · 小樽音乐盒堂",price:a.price};
  out.memory="在音乐盒堂买了"+a.name;
}
if(opts?.finishPhoto){const p=s.pendingPhoto;out.photo=opts.keepPhoto&&out.photo?Object.assign({},out.photo,{composition:FRAMES[p?.frame||0]}):undefined;}
return out;
}
function audio(s,notify){const C=window.AudioContext||window.webkitAudioContext;if(!C){notify("当前浏览器暂不支持试听");return;}try{if(audioContext)audioContext.close();const ctx=new C();audioContext=ctx;if(ctx.state==="suspended")ctx.resume();item(s).notes.forEach((freq,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),at=ctx.currentTime+.04+i*.26;osc.type="sine";osc.frequency.setValueAtTime(freq,at);gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.1,at+.015);gain.gain.exponentialRampToValueAtTime(.0001,at+.48);osc.connect(gain);gain.connect(ctx.destination);osc.start(at);osc.stop(at+.5);});notify("正在试听原创八音旋律");}catch(ex){notify("试听不可用，仍可继续挑选");}}
function bindGesture(root,context){
root.addEventListener("pointerdown",ev=>{if(ev.target.closest("[data-swipe='boarding']"))gestureX=ev.clientX;});
root.addEventListener("pointerup",ev=>{if(gestureX===null)return;const diff=ev.clientX-gestureX;gestureX=null;if(diff>65&&!context.state.boarded){context.state.boarded=true;context.state.journal.push("滑动登机牌，旅程正式开始");context.persist();context.render();context.scrollTopMain();}});
}
function action(act,button,ctx){
const s=ctx.state,finish=()=>{const prev=document.getElementById("main-screen"),y=prev?prev.scrollTop:0;ctx.persist();ctx.render();const next=document.getElementById("main-screen");if(next)next.scrollTop=y;};
if(act==="board"){s.boarded=true;s.journal.push("拿到了写着自己名字的旅行票");finish();return true;}
if(act==="next-message"||act==="all-messages"){const beats=ctx.currentScene().beats.filter(b=>!b.when||b.when(s)),max=beats.filter(b=>b.t==="m").length;s.chatProgress[ctx.currentScene().id]=act==="all-messages"?max:Math.min(max,(s.chatProgress[ctx.currentScene().id]||0)+1);finish();const el=document.getElementById("main-screen");if(el)el.scrollTop=el.scrollHeight;return true;}
if(act==="shop-select"){s.shopPick=Number(button.dataset.index);s.shopStep="browse";finish();return true;}
if(act==="shop-listen"){audio(s,ctx.toast);return true;}
if(act==="shop-buy"){s.shopStep="confirm";finish();return true;}
if(act==="shop-cancel"){s.shopStep="browse";finish();return true;}
if(act==="shop-confirm"){s.shopStep="browse";ctx.choose(0);return true;}
if(act==="shop-note"){ctx.choose(1);return true;}
if(act==="shop-other"){ctx.choose(2);return true;}
if(act==="camera-frame"&&s.pendingPhoto){s.pendingPhoto.frame=Number(button.dataset.index);finish();return true;}
if(act==="camera-shutter"&&s.pendingPhoto){s.pendingPhoto.taken=true;finish();return true;}
if(act==="camera-retake"&&s.pendingPhoto){s.pendingPhoto.taken=false;finish();return true;}
if((act==="camera-keep"||act==="camera-discard")&&s.pendingPhoto){ctx.choose(s.pendingPhoto.index,{finishPhoto:true,keepPhoto:act==="camera-keep"});return true;}
return false;
}
window.TravelUX={boarding,view,shop,camera,prepareFx,bindGesture,action};
})();