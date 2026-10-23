"use strict";
(function(){
/* 可编辑的原创2D冬季头像；不使用人脸识别、网络生图或照片上传。 */
const OPTIONS={
 skin:[["奶油白","#f5dccd"],["暖杏","#eec7ac"],["蜜桃","#e6b997"],["小麦","#c99574"],["深蜜","#9c684f"]],
 face:[["软圆脸",0],["鹅蛋脸",1],["小尖脸",2]],
 eyes:[["圆圆眼",0],["微笑眼",1],["细长眼",2],["下垂眼",3]],
 eyeColor:[["深棕","#46332e"],["琥珀","#79503b"],["墨黑","#262528"],["灰绿","#667069"]],
 hair:[["短发",0],["齐肩",1],["长发",2],["双马尾",3],["低马尾",4]],
 bangs:[["空气刘海",0],["中分",1],["斜刘海",2],["露额头",3]],
 hairColor:[["黑茶","#302a2a"],["深棕","#54403a"],["栗棕","#805343"],["亚麻","#ab876b"],["暖粉棕","#a27074"]],
 mouth:[["淡淡笑",0],["猫咪嘴",1],["小圆嘴",2]],
 blush:[["自然",0],["淡粉",1],["莓粉",2]],
 coat:[["雾绿","#798a78"],["奶油","#e7dfcf"],["咖棕","#776157"],["深蓝","#4c596b"],["莓红","#9c6770"]],
 scarf:[["不戴",0],["奶白","#eee3d4"],["格调绿","#7e9487"],["砖红","#bb746c"],["燕麦","#bea78c"]],
 hat:[["不戴",0],["针织帽",1],["贝雷帽",2]],
 hairstyle:[["自然碎发",0],["干净短发",1],["微分短发",2]],
 manCoat:[["黑色羽绒服","#33383e"],["灰绿大衣","#65766f"],["棕色夹克","#776459"],["藏蓝外套","#3e505f"]],
 manScarf:[["深灰围巾","#50545a"],["米白围巾","#d7d0be"],["棕色围巾","#8d7965"],["不戴",0]],
 manHat:[["不戴",0],["黑色针织帽",1],["灰色针织帽",2]]
};
const DEFAULTS={heroine:{skin:1,face:0,eyes:0,eyeColor:0,hair:2,bangs:0,hairColor:1,mouth:0,blush:1,coat:0,scarf:1,hat:0},zhangji:{hairstyle:0,manCoat:0,manScarf:0,manHat:0}};
const CATS={
 heroine:[["脸部","skin","face","eyes","eyeColor","mouth","blush"],["发型","hair","bangs","hairColor"],["冬装","coat","scarf","hat"]],
 zhangji:[["发型","hairstyle"],["冬装","manCoat","manScarf","manHat"]]
};
const LABELS={skin:"肤色",face:"脸型",eyes:"眼型",eyeColor:"瞳色",mouth:"嘴型",blush:"腮红",hair:"发长",bangs:"刘海",hairColor:"发色",coat:"外套",scarf:"围巾",hat:"帽子",hairstyle:"发型",manCoat:"外套",manScarf:"围巾",manHat:"帽子"};
function saneIndex(value,key,fallback){const len=(OPTIONS[key]||[]).length;const num=Number(value);return Number.isInteger(num)&&num>=0&&num<len?num:fallback;}
function data(state,role){
 const raw=state&&state.avatars&&typeof state.avatars==="object"?state.avatars[role]:null;
 const defaults=DEFAULTS[role];const out={};
 for(const k of Object.keys(defaults))out[k]=saneIndex(raw&&raw[k],k,defaults[k]);
 return out;
}
function init(state){if(!state.avatars||typeof state.avatars!=="object")state.avatars={};for(const role of ["heroine","zhangji"])state.avatars[role]=data(state,role);}
function clr(key,id){return OPTIONS[key][id][1]}
function dot(x,y,r,color,opacity){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+color+'" opacity="'+(opacity??1)+'"/>'}
function svg(state,role="heroine",size="standard"){
 const person=role==="heroine"?data(state,"heroine"):data(state,"zhangji");
 const girl=role==="heroine",v=person;
 const skin=girl?clr("skin",v.skin):"#e4bea3";
 const shadow=girl?"#c48d76":"#ba8a70";
 const hair=girl?clr("hairColor",v.hairColor):"#282a2c";
 const iris=girl?clr("eyeColor",v.eyeColor):"#332f2e";
 const bg=girl?"#e5ebe1":"#e0e7e5";
 const coat=girl?clr("coat",v.coat):clr("manCoat",v.manCoat);
 const scarf=girl?clr("scarf",v.scarf):clr("manScarf",v.manScarf);
 const hat=girl?v.hat:v.manHat;
 let out='<svg class="avatar-art avatar-art-'+size+'" viewBox="0 0 240 290" role="img" aria-label="'+(girl?"原创可爱风旅行者头像":"原创卡通张极形象")+'" xmlns="http://www.w3.org/2000/svg">';
 out+='<rect width="240" height="290" rx="22" fill="'+bg+'"/><circle cx="191" cy="57" r="65" fill="#ffffff" opacity=".24"/><path d="M0 225 Q67 205 137 237T240 207V290H0Z" fill="#d0ddd3" opacity=".55"/>';
 for(const [x,y,r] of [[30,46,3],[206,126,2.5],[61,105,2],[170,29,2.5],[40,184,2.1]])out+=dot(x,y,r,"white",.78);
 const longHair=girl?[false,true,true,true,true][v.hair]:false;
 if(longHair){out+='<path d="M68 111Q61 43 121 39Q185 41 178 119L197 261Q186 274 164 261L151 165H89L75 265Q54 271 47 258Z" fill="'+hair+'"/>';if(v.hair===3){out+='<path d="M66 105Q24 99 27 166Q34 196 52 193L71 146Z" fill="'+hair+'"/><path d="M174 105Q218 99 213 166Q206 196 188 193L169 146Z" fill="'+hair+'"/>';}}
 else out+='<path d="M67 123Q55 46 120 38Q190 40 177 130L164 165Q135 177 111 167L77 165Z" fill="'+hair+'"/>';
 // Coat and cuffs; face remains above garments.
 out+='<path d="M47 290L51 245Q62 221 96 217L145 217Q185 219 191 247L198 290Z" fill="'+coat+'" stroke="#ffffff" stroke-opacity=".2" stroke-width="2"/>';
 out+='<path d="M96 217L120 245L143 217L134 290H106Z" fill="'+(girl?"#f1eee5":"#d6d7d0")+'"/>';
 out+='<path d="M89 216L119 245L104 258L79 225M152 215L120 245L136 258L161 225" fill="none" stroke="#eae7dc" stroke-opacity=".65" stroke-width="5" stroke-linejoin="round"/>';
 out+='<rect x="109" y="185" width="23" height="44" rx="10" fill="'+skin+'"/>';
 const facePath=girl?v.face===0?"M120 63C79 62 73 100 75 140Q75 196 119 207Q163 199 166 142C170 102 159 64 120 63Z":v.face===1?"M120 63C82 63 74 99 78 144Q82 187 120 207Q158 191 162 143C168 99 158 64 120 63Z":"M120 63C79 65 76 106 79 142Q83 183 120 213Q157 183 161 142C166 103 159 65 120 63Z":"M120 62C81 62 74 102 79 141Q82 185 119 203Q158 185 162 141C167 100 156 61 120 62Z";
 out+='<path d="'+facePath+'" fill="'+skin+'" stroke="'+shadow+'" stroke-opacity=".24" stroke-width="1.3"/>';
 out+='<path d="M83 137Q75 132 75 143Q76 154 84 154M158 137Q166 132 165 143Q165 154 157 154" fill="'+skin+'" stroke="'+shadow+'" stroke-width="1.3" opacity=".9"/>';
 // Hair silhouette. Boy's natural outline stays fixed, only locks/parting change.
 out+='<path d="M72 112Q65 68 88 54Q117 33 145 52Q170 55 174 113L164 124Q161 96 144 85Q117 101 87 87Q84 112 78 123Z" fill="'+hair+'"/>';
 if(girl){
 if(v.bangs===0)out+='<path d="M80 93Q93 98 93 113L104 88Q109 104 117 112L125 86Q137 109 149 104L158 87Q153 119 164 111Q164 63 119 55Q80 59 80 93Z" fill="'+hair+'"/>';
 if(v.bangs===1)out+='<path d="M80 107Q82 55 119 55Q112 88 97 96L82 117Z M120 55Q162 57 163 112L146 103Q132 89 120 55Z" fill="'+hair+'"/>';
 if(v.bangs===2)out+='<path d="M77 97Q80 63 108 55Q146 51 164 80Q138 113 85 118Z" fill="'+hair+'"/>';
 if(v.bangs===3)out+='<path d="M79 88Q88 48 125 54Q160 56 166 97Q143 89 137 76Q110 83 79 88Z" fill="'+hair+'"/>';
 if(v.hair===0)out+='<path d="M72 107Q64 141 74 162Q87 174 91 166L84 135Z M168 106Q177 138 166 160Q155 174 149 163L156 132Z" fill="'+hair+'"/>';
 if(v.hair===1)out+='<path d="M70 120L62 195Q78 203 89 185L88 121Z M169 120L179 196Q163 201 151 185L151 124Z" fill="'+hair+'"/>';
 if(v.hair===3)out+='<path d="M57 105L75 112L72 129L56 119Z M182 105L165 112L170 129L184 120Z" fill="#e9d9ca"/>';
 if(v.hair===4)out+='<path d="M157 87Q193 118 186 176Q183 220 170 229L159 207Q176 166 157 107Z" fill="'+hair+'"/>';
 }else{
 if(v.hairstyle===0)out+='<path d="M78 95Q75 67 91 64L87 49Q104 57 113 49L130 45L145 56Q159 53 166 80L161 98Q146 82 131 82Q109 91 93 80Z" fill="'+hair+'"/>';
 if(v.hairstyle===1)out+='<path d="M81 96Q76 66 102 57Q140 42 161 73L164 97Q145 88 131 82Q110 90 82 98Z" fill="'+hair+'"/>';
 if(v.hairstyle===2)out+='<path d="M79 100Q75 68 99 56Q124 46 134 68Q143 54 155 68Q162 78 163 98L142 98L124 72Q107 96 79 100Z" fill="'+hair+'"/>';
 }
 // brows, eyes
 const eyes=girl?v.eyes:2;
 out+='<path d="M90 132Q101 126 109 132M131 132Q140 126 151 132" fill="none" stroke="'+hair+'" stroke-width="2.8" stroke-linecap="round" opacity=".7"/>';
 if(eyes===1){out+='<path d="M88 151Q99 160 110 150M130 150Q141 160 153 150" fill="none" stroke="'+iris+'" stroke-width="3" stroke-linecap="round"/>';}
 else{const ry=eyes===2?4.1:eyes===3?5.1:7.0;
 for(const x of [100,141]){out+='<ellipse cx="'+x+'" cy="151" rx="'+(eyes===2?7.4:8.4)+'" ry="'+ry+'" fill="#fffaf5"/><ellipse cx="'+x+'" cy="'+(eyes===3?153:151)+'" rx="'+(eyes===2?5.4:5.8)+'" ry="'+(eyes===2?3.3:5.9)+'" fill="'+iris+'"/>'+dot(x+2,148.5,1.9,"#fff")+'<path d="M'+(x-9)+' 150Q'+x+' '+(eyes===3?148:142)+' '+(x+9)+' 149" fill="none" stroke="'+iris+'" stroke-width="2" stroke-linecap="round"/>';}}
 out+='<path d="M118 158Q114 171 119 174" stroke="'+shadow+'" stroke-width="1.4" opacity=".37" stroke-linecap="round" fill="none"/>';
 if(girl&&v.blush!==0){const alpha=v.blush===2?.42:.27,bc=v.blush===2?"#c9687d":"#dd8790";out+='<ellipse cx="87" cy="174" rx="12" ry="5.9" fill="'+bc+'" opacity="'+alpha+'"/><ellipse cx="152" cy="174" rx="12" ry="5.9" fill="'+bc+'" opacity="'+alpha+'"/>';}
 if(girl&&v.mouth===1)out+='<path d="M108 188Q114 193 120 186Q126 193 132 188" stroke="#985d64" stroke-width="2" fill="none" stroke-linecap="round"/>';
 else if(girl&&v.mouth===2)out+='<ellipse cx="120" cy="190" rx="3.5" ry="4.6" fill="#9c6061"/>';
 else out+='<path d="M111 188Q120 194 129 188" stroke="#9f6466" stroke-width="2" stroke-linecap="round" fill="none"/>';
 if(scarf!==0){out+='<path d="M83 217Q120 238 157 217L154 233Q125 252 88 236Z" fill="'+scarf+'" stroke="#fff" stroke-opacity=".23" stroke-width="2"/><path d="M142 232Q155 243 151 288L129 288L130 243Z" fill="'+scarf+'"/><path d="M134 243L150 243" stroke="#ffffff" stroke-opacity=".26" stroke-width="2"/>';}
 if(hat){const hatColor=girl?(hat===1?"#e7d7bf":"#7d8981"):hat===1?"#3c4145":"#7f8587";
 if(hat===1)out+='<path d="M78 90Q73 46 103 33Q123 24 143 40Q167 55 163 90Z" fill="'+hatColor+'"/><rect x="75" y="80" width="91" height="18" rx="8" fill="'+hatColor+'" stroke="#ffffff" stroke-opacity=".3" stroke-width="2"/>'+dot(120,31,7,hatColor);
 else out+='<path d="M79 79Q79 51 105 39Q132 29 150 54Q155 65 156 78Z" fill="'+hatColor+'"/><path d="M70 82Q124 74 169 84" stroke="'+hatColor+'" stroke-width="12" stroke-linecap="round" fill="none"/>';}
 out+='<path d="M20 265h25M197 265h20" stroke="#ffffff" stroke-opacity=".6" stroke-width="1.5"/>';
 out+='</svg>';
 return out;
}
function avatarChip(state,role,e,label){return '<span class="avatar-chip '+role+'" title="'+(role==="heroine"?"我的旅行形象":"张极卡通形象")+'">'+svg(state,role,"tiny")+'</span>';}
function render(state,e,onboarding){
 const role=state.avatarEditorRole==="zhangji"?"zhangji":"heroine",cat=Math.min(CATS[role].length-1,Math.max(0,Number(state.avatarEditorCat)||0));
 const keys=CATS[role][cat].slice(1),selected=data(state,role);
 let html='<div class="avatar-studio"><div class="avatar-studio-eyebrow">CHARACTER MAKER / HOKKAIDO</div><h1>'+(onboarding?"出发之前，先认识你。":"旅行人物形象")+'</h1><p class="avatar-lede">'+(onboarding?"为这趟旅行捏一个属于你的可爱头像。以后也能从旅行档案更换。":"为故事中的两个人制作原创 2D 头像。张极的脸部设定固定，只能换发型与冬装。")+'</p>';
 html+='<div class="avatar-stage"><div class="avatar-stage-top"><span>'+e(role==="heroine"?state.name||"旅行者":"张极")+'</span><span>'+(role==="heroine"?"YOU / 01":"ZHANG JI / 02")+'</span></div>'+svg(state,role,"large")+'<div class="avatar-stage-foot">DEC 19 — 25 · HOKKAIDO / CHARACTER ID</div></div>';
 html+='<div class="avatar-roles"><button class="'+(role==="heroine"?"active":"")+'" data-act="avatar-role" data-role="heroine">我的形象</button><button class="'+(role==="zhangji"?"active":"")+'" data-act="avatar-role" data-role="zhangji">张极 · 换装</button></div>';
 html+='<div class="avatar-cats">'+CATS[role].map((group,i)=>'<button class="'+(i===cat?"active":"")+'" data-act="avatar-cat" data-index="'+i+'">'+group[0]+'</button>').join("")+'</div>';
 for(const key of keys){html+='<div class="avatar-field"><div class="avatar-field-name">'+LABELS[key]+'</div><div class="avatar-choice-scroll" role="group" aria-label="'+LABELS[key]+'">'+OPTIONS[key].map((v,i)=>'<button type="button" class="avatar-choice '+(selected[key]===i?"active":"")+'" aria-pressed="'+(selected[key]===i)+'" data-act="avatar-pick" data-key="'+key+'" data-index="'+i+'">'+((typeof v[1]==="string")?'<span class="avatar-swatch" style="background:'+v[1]+'"></span>':"")+'<span>'+v[0]+'</span></button>').join("")+'</div></div>';}
 html+='<div class="avatar-actions"><button class="ghost" data-act="avatar-random">随机搭配'+(role==="heroine"?"":"冬装")+'</button><button class="ghost" data-act="avatar-reset">恢复默认</button></div>';
 html+='<div class="avatar-finish"><p>形象保存在当前浏览器；不需要上传照片。这里的张极是固定风格的原创卡通示意，不会自动还原真人长相。</p><button class="primary" data-act="'+(onboarding?"avatar-done":"avatar-back")+'">'+(onboarding?"保存形象，领取登机牌 →":"保存形象，返回档案 →")+'</button></div></div>';
 return html;
}
function handle(act,button,ctx){
 if(!act.startsWith("avatar-"))return false;
 const {state,persist,render,toast}=ctx;init(state);
 if(act==="avatar-done"){state.avatarOnboarding=false;state.avatarEditorRole="heroine";persist();render();return true;}
 if(act==="avatar-back"){state.page=state.avatarReturnPage||"save";persist();render();return true;}
 const role=state.avatarEditorRole==="zhangji"?"zhangji":"heroine";
 if(act==="avatar-role"){state.avatarEditorRole=button.dataset.role==="zhangji"?"zhangji":"heroine";state.avatarEditorCat=0;}
 if(act==="avatar-cat"){state.avatarEditorCat=Math.max(0,Math.min(CATS[role].length-1,Number(button.dataset.index)||0));}
 if(act==="avatar-pick"){const key=button.dataset.key;if(Object.prototype.hasOwnProperty.call(DEFAULTS[role],key))state.avatars[role][key]=saneIndex(button.dataset.index,key,DEFAULTS[role][key]);}
 if(act==="avatar-reset"){state.avatars[role]=Object.assign({},DEFAULTS[role]);}
 if(act==="avatar-random"){for(const key of Object.keys(DEFAULTS[role])){if(role==="zhangji"&&key==="hairstyle")continue;state.avatars[role][key]=Math.floor(Math.random()*OPTIONS[key].length);}}
 persist();
 const old=document.getElementById("main-screen"),scroll=old?old.scrollTop:0;render();const next=document.getElementById("main-screen");if(next)next.scrollTop=scroll;
 return true;
}
window.AvatarStudio={init,svg,avatarChip,render,handle,defaults:()=>JSON.parse(JSON.stringify(DEFAULTS))};
})();