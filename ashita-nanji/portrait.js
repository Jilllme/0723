"use strict";
(function(){
/* 人像档案 V1：本地参考图，不对外发送，也不宣称使用了 AI 生图。 */
const TYPES=["image/jpeg","image/png","image/webp","image/heic","image/heif"];
const VALID=/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const roles=[{id:"heroine",name:"旅行者",short:"YOU",description:"主角的形象由你设定，游戏不会默认指定她的外貌。",placeholder:"例如：深棕长发、齐刘海、黑色羊毛外套……"},{id:"zhangji",name:"张极",short:"ZHANG JI",description:"可上传你认可的张极形象参考照片，游戏不会自行猜测长相。",placeholder:"例如：发型、发色、冬季穿搭、镜头中的气质……"}];
function safeImage(image){return typeof image==="string"&&image.length<1000000&&VALID.test(image)?image:null;}
function record(s,role){const v=s.portraits&&typeof s.portraits==="object"?s.portraits[role]:null;return v&&typeof v==="object"?v:{};}
function portrait(s,e,role,small=false){
 const v=record(s,role),img=safeImage(v.image);
 return '<div class="face-preview'+(small?" mini":"")+'">'+(img?'<img src="'+e(img)+'" alt="人物参考图" loading="lazy">':'<div class="face-placeholder"><svg viewBox="0 0 64 64" width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="32" cy="22" r="12"/><path d="M10 56c0-12 10-20 22-20s22 8 22 20"/></svg><span>待设置</span></div>')+'</div>';
}
function render(s,e){
 return '<section class="section portrait-page"><div class="label-caps">CHARACTER REFERENCE / PERSONAL</div><h1 class="section-title">人物外貌档案</h1><p class="section-sub">为七天旅行建立固定的人物参考形象。照片只保存在当前浏览器，不会自动上传到服务器，也不会由游戏擅自生成或替换。</p><div class="portrait-intro"><span class="portrait-line"></span><span>外貌参考 · 不改变原有剧情与存档</span></div>'+roles.map(role=>{
 const v=record(s,role),has=!!safeImage(v.image);
 return '<section class="portrait-card"><div class="portrait-card-title"><div><span class="label-caps">'+role.short+' / PHOTO ID</span><h2>'+e(role.id==="heroine"?s.name||role.name:role.name)+'</h2></div><span class="portrait-state">'+(has?"已设置":"未设定")+'</span></div><div class="portrait-content">'+portrait(s,e,role.id)+'<div class="portrait-info"><p>'+e(role.description)+'</p><label class="portrait-upload" for="portrait-file-'+role.id+'">'+(has?"更换参考照片":"上传参考照片")+' <span>＋</span></label><input class="portrait-file" id="portrait-file-'+role.id+'" data-role="'+role.id+'" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" aria-label="上传'+e(role.name)+'的参考照片">'+(has?'<button class="portrait-clear" data-act="portrait-clear" data-role="'+role.id+'">清除照片</button>':'')+'</div></div><label class="portrait-note-label" for="portrait-note-'+role.id+'">固定外貌补充 / 选填</label><textarea class="portrait-notes" id="portrait-note-'+role.id+'" maxlength="220" placeholder="'+e(role.placeholder)+'">'+e(String(v.notes||"").slice(0,220))+'</textarea></section>';
 }).join("")+'<button class="primary" data-act="portrait-save-notes">保存两人的外貌描述</button><button class="ghost portrait-back" data-act="portrait-back">← 返回游戏</button><div class="portrait-privacy"><b>关于 AI 人像</b><p>此版本可固定参考照和外貌描述，并在对应拍照场景中供你核对。相机里的风景仍是示意图片，<b>不会自动合成人脸，也尚未接入 AI 图片生成服务</b>。如需真正生成连续剧情人像，后续需要图像生成后端与人物一致性方案。</p><p>请只使用你有权上传的照片。参考图和描述会随本地游戏存档一起保存；导出 JSON 时也会包含它们。</p></div></section>';
}
function referenceStrip(s,e,photo){
 const title=String(photo?.title||""),who=/合照/.test(title)?"both":/单人|个人旅行照|第一晚的照片/.test(title)?"heroine":null;
 if(!who)return '<div class="portrait-camera-note">本次取景为风景照。拍人物时可使用档案中的固定形象参考。</div><button class="portrait-camera-link" data-act="open-portraits">管理人物参考图 ↗</button>';
 const chosen=who==="both"?roles:roles.slice(0,1);
 return '<div class="portrait-camera-note">固定人物参考 · '+(who==="both"?"合照":"单人照")+'（仅用于核对长相，未合成至场景）</div><div class="portrait-camera-refs">'+chosen.map(v=>'<div class="portrait-camera-ref">'+portrait(s,e,v.id,true)+'<span>'+e(v.id==="heroine"?s.name||"旅行者":v.name)+'</span></div>').join("")+'</div><button class="portrait-camera-link" data-act="open-portraits">设置 / 更换参考照片 ↗</button>';
}
function compress(file){
 return new Promise((resolve,reject)=>{
  if(!file||!TYPES.includes(file.type)){reject(Error("请选择 JPG、PNG、WebP 或 HEIC 格式图片"));return;}
  if(file.size>12*1024*1024){reject(Error("图片不能超过 12MB"));return;}
  const url=URL.createObjectURL(file),img=new Image();
  img.onload=()=>{try{
    const ratio=Math.min(1,600/Math.max(img.naturalWidth,img.naturalHeight));
    const cv=document.createElement("canvas");cv.width=Math.max(1,Math.round(img.naturalWidth*ratio));cv.height=Math.max(1,Math.round(img.naturalHeight*ratio));
    const ctx=cv.getContext("2d");if(!ctx)throw Error("此浏览器不支持处理照片");
    ctx.fillStyle="#f6f6f2";ctx.fillRect(0,0,cv.width,cv.height);ctx.drawImage(img,0,0,cv.width,cv.height);
    const image=cv.toDataURL("image/jpeg",.73);
    URL.revokeObjectURL(url);
    if(!safeImage(image))throw Error("无法保存这张照片");
    resolve(image);
  }catch(e){URL.revokeObjectURL(url);reject(e);}};
  img.onerror=()=>{URL.revokeObjectURL(url);reject(Error("照片读取失败，请换一张 JPG 或 PNG"));};
  img.src=url;
 });
}
window.PortraitStudio={render,referenceStrip,compress,roles,safeImage};
})();