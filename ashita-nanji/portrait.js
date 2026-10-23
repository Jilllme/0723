"use strict";
(function(){
/* Interactive photographic ID cards. No generated humans, no fabricated joint photos. */
const TYPES=["image/jpeg","image/png","image/webp","image/heic","image/heif"];
const VALID=/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const ROLES=[{id:"heroine",title:"我的照片",name:"旅行者",tag:"TRAVELER / 01",empty:"选择你想作为主角形象的照片"},{id:"zhangji",title:"张极的照片",name:"张极",tag:"TRAVEL COMPANION / 02",empty:"上传你认可的张极参考照片"}];
const FILTERS={original:{name:"原片",css:"none"},film:{name:"日系胶片",css:"saturate(.82) contrast(.94) sepia(.11)"},cold:{name:"冬日冷调",css:"saturate(.72) contrast(1.03) hue-rotate(8deg)"},mono:{name:"黑白底片",css:"grayscale(1) contrast(1.04)"}};
function safeImage(image){return typeof image==="string"&&image.length<1000000&&VALID.test(image)?image:null;}
function ensure(state){
 if(!state.portraits||typeof state.portraits!=="object")state.portraits={};
 for(const role of ROLES){
  let r=state.portraits[role.id];
  if(!r||typeof r!=="object")r={};
  const num=(v,min,max,d)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):d;
  state.portraits[role.id]={image:safeImage(r.image),notes:String(r.notes||"").slice(0,220),zoom:num(r.zoom,100,180,110),x:num(r.x,0,100,50),y:num(r.y,0,100,45),filter:FILTERS[r.filter]?r.filter:"film"};
 }
 if(state.portraitRole!=="zhangji")state.portraitRole="heroine";
 state.portraitFlipped=!!state.portraitFlipped;
}
function record(s,role){const raw=s&&s.portraits?.[role];return raw&&typeof raw==="object"?raw:{image:null,notes:"",zoom:110,x:50,y:45,filter:"film"};}
function contentImg(s,role,e,extra=""){
 const rec=record(s,role),src=safeImage(rec.image);
 if(!src)return '<div class="portrait-empty-icon"><span>✳</span><small>NO PHOTO</small></div>';
 const z=Math.max(1,Math.min(1.8,(Number(rec.zoom)||110)/100));
 const x=Math.max(0,Math.min(100,Number.isFinite(Number(rec.x))?Number(rec.x):50));
 const y=Math.max(0,Math.min(100,Number.isFinite(Number(rec.y))?Number(rec.y):45));
 const css=FILTERS[rec.filter]?.css||"none";
 return '<img '+extra+' class="photo-person-image" alt="'+(role==="heroine"?"旅行者个人参考照片":"张极个人参考照片")+'" src="'+e(src)+'" style="object-position:'+x+'% '+y+'%;transform:scale('+z+');filter:'+css+'"/>';
}
function mini(s,role,e){return '<span class="photo-person-avatar photo-person-'+role+'">'+(safeImage(record(s,role).image)?contentImg(s,role,e):'<span class="photo-person-initial">'+e(role==="heroine"?(s.name||"我").slice(0,1):"极")+'</span>')+'</span>';}
function profile(s,e,role){return '<div class="film-profile"><div class="film-profile-image">'+contentImg(s,role,e)+'</div><div class="film-profile-copy"><span class="label-caps">'+(role==="heroine"?"PLAYER PHOTO · 01":"COMPANION PHOTO · 02")+'</span><h3>'+e(role==="heroine"?s.name||"旅行者":"张极")+'</h3><p>'+ (safeImage(record(s,role).image)?"照片已设置 · 可以调整裁切与色调":"未设置照片 · 使用文字头像") +'</p></div></div>';}
function album(s,e){
 return '<div class="film-album-head"><div class="label-caps">PHOTO ID / CHARACTER ARCHIVE</div><div class="film-album-tile-grid">'+ROLES.map(role=>'<button class="film-album-person" data-act="open-portraits" data-role="'+role.id+'" aria-label="打开'+role.title+'设置"><div class="film-album-person-photo">'+contentImg(s,role.id,e)+'</div><span>'+e(role.id==="heroine"?s.name||"旅行者":role.name)+'</span><small>点击查看与编辑 ↗</small></button>').join("")+'</div><p class="film-footnote">人物照片来自你上传的原图，和剧情摄影示意画面分别保存，不会拼接成未经拍摄的合照。</p></div>';
}
function card(s,e,onboarding){
 const role=s.portraitRole==="zhangji"?"zhangji":"heroine",spec=ROLES.find(x=>x.id===role),r=record(s,role),has=!!safeImage(r.image),flip=!!s.portraitFlipped;
 const fn=(label,n)=>'<div class="film-field"><label>'+label+'</label><span>'+n+'</span></div>';
 return '<div class="film-person-stage"><div class="film-person-top"><span>冬日摄影档案</span><span>NO. 0'+(role==="heroine"?1:2)+'</span></div><button class="film-person-card '+(flip?"is-flipped":"")+'" data-act="portrait-flip" title="点击翻面" aria-label="翻转照片卡">'+(flip?'<div class="film-person-back"><span class="label-caps">BACK OF THE PHOTO</span><h3>'+e(role==="heroine"?s.name||spec.name:spec.name)+'</h3><p>'+e(r.notes||"还没有写下这张照片的故事。")+'</p><span>↶ 再翻回来</span></div>':'<div class="film-person-picture">'+contentImg(s,role,e)+'</div><div class="film-person-paper"><b>'+e(role==="heroine"?s.name||spec.name:spec.name)+'</b><span>DEC. WINTER / HOKKAIDO　↻</span></div>')+'</button><div class="film-person-caption">点击照片可以翻到背面，看看写下的备注。</div></div>';
}
function render(s,e,onboarding=false){
 ensure(s);const role=s.portraitRole,rec=record(s,role),has=!!safeImage(rec.image);
 let out='<div class="section film-editor"><div class="label-caps">WINTER FILM / PEOPLE</div><h1 class="section-title">'+(onboarding?"旅客照片登记":"两个人的照片档案")+'</h1><p class="section-sub">'+(onboarding?"可上传两个人的真人参考照片，也可以跳过，直接出发。":"保留你喜欢的真人照片，自己调整取景、色调与照片背面的文字。不会生成陌生的卡通脸。")+'</p>';
 out+='<div class="film-roles">'+ROLES.map(x=>'<button data-act="portrait-role" data-role="'+x.id+'" class="'+(x.id===role?"active":"")+'">'+x.title+'</button>').join("")+'</div>';
 out+=card(s,e,onboarding);
 out+='<label class="film-upload" for="portrait-file-'+role+'"><span>＋</span>'+(has?"更换照片":"从相册选择照片")+'</label><input class="portrait-file" id="portrait-file-'+role+'" data-role="'+role+'" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" aria-label="选择'+(role==="heroine"?"我的":"张极的")+'照片">';
 if(has){
 out+='<div class="film-editor-tools"><div class="label-caps">ADJUST THE FRAME</div>';
 const values=[["zoom","照片缩放",100,180],["x","水平位置",0,100],["y","垂直位置",0,100]];
 for(const [key,label,min,max] of values)out+='<div class="film-slider-row"><label for="film-'+key+'">'+label+'</label><input id="film-'+key+'" type="range" min="'+min+'" max="'+max+'" step="1" value="'+rec[key]+'" data-portrait-slider="'+key+'" aria-label="'+label+'"/><span>'+Math.round(rec[key])+(key==="zoom"?"%":"")+'</span></div>';
 out+='<div class="label-caps">COLOR TREATMENT</div><div class="film-filters">'+Object.entries(FILTERS).map(([id,v])=>'<button class="'+(rec.filter===id?"active":"")+'" data-act="portrait-filter" data-filter="'+id+'">'+v.name+'</button>').join("")+'</div></div>';
 }
 out+='<div class="film-annotation"><label for="portrait-note-'+role+'">照片背面的文字 · 选填</label><textarea id="portrait-note-'+role+'" maxlength="220" rows="3" placeholder="写一段关于这张照片的记录……">'+e(rec.notes||"")+'</textarea><button class="ghost" data-act="portrait-save-notes">保存背面文字</button></div>';
 if(has)out+='<button class="film-remove" data-act="portrait-clear" data-role="'+role+'">删除这张参考照片</button>';
 out+='<div class="film-editor-end"><p>人物照片只保存在当前浏览器。可以在旅行档案导出存档备份；导出的 JSON 也会包含照片。上传你有权使用的图片即可。</p><button class="primary" data-act="'+(onboarding?"portrait-done":"portrait-back")+'">'+(onboarding?"保存设置，领取登机牌 →":"返回游戏 →")+'</button>'+(onboarding?'<button class="ghost" data-act="portrait-done">先跳过，不上传照片</button>':"")+'</div></div>';
 return out;
}
function detail(s,e,role,flipped){
 const key=role==="zhangji"?"zhangji":"heroine",r=record(s,key),name=key==="heroine"?s.name||"旅行者":"张极";
 return '<div class="modal film-detail-shade"><div class="modal-card film-detail-dialog"><div class="film-detail-header"><span>PEOPLE IN THE STORY / 2026</span><button data-act="close-person-preview" aria-label="关闭人物照片">✕</button></div><button class="film-detail-photo" data-act="person-preview-flip" title="点击翻面">'+(flipped?'<div class="film-detail-back"><small>BACK OF THE PHOTO</small><h3>'+e(name)+'</h3><p>'+e(r.notes||"尚未留下文字。")+'</p></div>':contentImg(s,key,e))+'</button><div class="film-detail-footer"><div><h3>'+e(name)+'</h3><p>'+(flipped?"点击照片翻回正面":"轻触照片可以翻到背面")+'</p></div><button class="mini-btn" data-act="open-portraits" data-role="'+key+'">管理照片 ↗</button></div><p class="film-detail-note">人物参考照片由玩家提供，不代表剧情已经拍摄了这张照片。</p></div></div>';
}

function referenceStrip(s,e,photo){
 const t=String(photo?.title||""),who=/合照/.test(t)?"both":/单人|个人旅行照|第一晚的照片/.test(t)?"heroine":null;
 if(!who)return '<div class="portrait-camera-note">这是旅行场景的氛围示意照片；你可以从档案里查看人物参考照。</div>';
 return '<div class="film-camera-ids"><span class="label-caps">CHARACTER PHOTO REFERENCE</span><div class="film-camera-ids-row">'+mini(s,"heroine",e)+(who==="both"?mini(s,"zhangji",e):"")+'<div><strong>'+(who==="both"?"两人的独立参考照片":"旅行者参考照片")+'</strong><small>仅用于识别人物，并未生成合照</small></div></div></div>';
}
function compress(file){
 return new Promise((resolve,reject)=>{
  if(!file||!TYPES.includes(file.type)){reject(Error("请选择 JPG、PNG、WebP 或 HEIC 照片"));return;}
  if(file.size>12*1024*1024){reject(Error("照片超过 12MB，请换一张小一点的"));return;}
  const url=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{try{
   const ratio=Math.min(1,720/Math.max(img.naturalWidth,img.naturalHeight));
   const cv=document.createElement("canvas");cv.width=Math.max(1,Math.round(img.naturalWidth*ratio));cv.height=Math.max(1,Math.round(img.naturalHeight*ratio));
   const ctx=cv.getContext("2d");if(!ctx)throw Error("当前浏览器无法处理图片");
   ctx.fillStyle="#f4f1e9";ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(img,0,0,cv.width,cv.height);
   const image=cv.toDataURL("image/jpeg",.7);URL.revokeObjectURL(url);
   if(!safeImage(image))throw Error("照片过大，无法保存，请使用更小的照片");
   resolve(image);
  }catch(e){URL.revokeObjectURL(url);reject(e);}};
  img.onerror=()=>{URL.revokeObjectURL(url);reject(Error("照片读取失败，试试 JPG 或 PNG"));};
  img.src=url;
 });
}
function handle(act,button,ctx){
 const {state,persist,render,toast}=ctx;
 if(!["portrait-role","portrait-filter","portrait-flip","portrait-done","portrait-clear"].includes(act))return false;
 ensure(state);
 if(act==="portrait-done"){state.photoOnboarding=false;state.avatarOnboarding=false;state.portraitFlipped=false;persist();render();return true;}
 if(act==="portrait-role"){state.portraitRole=button.dataset.role==="zhangji"?"zhangji":"heroine";state.portraitFlipped=false;}
 if(act==="portrait-flip")state.portraitFlipped=!state.portraitFlipped;
 if(act==="portrait-filter"){const filter=button.dataset.filter;if(FILTERS[filter])state.portraits[state.portraitRole].filter=filter;}
 if(act==="portrait-clear"){const role=button.dataset.role;if(role==="heroine"||role==="zhangji")state.portraits[role].image=null;}
 const scroller=document.querySelector?.(".screen");const y=scroller?scroller.scrollTop:0;
 persist();render();const next=document.querySelector?.(".screen");if(next)next.scrollTop=y;return true;
}
window.PortraitStudio={render,referenceStrip,compress,roles:ROLES,safeImage,avatarChip:mini,profile,album,detail,ensure,handle,FILTERS};
})();