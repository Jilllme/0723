"use strict";
(function(){
const KEY="ashita_nanji_v1";
const root=document.getElementById("app");
const PHOTO={
 winter:"https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1100&q=82",
 night:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1100&q=82",
 snow:"https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1100&q=82",
 city:"https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1100&q=82",
 warm:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1100&q=82",
 books:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1100&q=82",
 cafe:"https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1100&q=82",
 train:"https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1100&q=82",
 sea:"https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1100&q=82",
 streets:"https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1100&q=82",
 lake:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=82",
 paper:"https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1100&q=82",
 cityNight:"https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1100&q=82"
};
const IC={
read:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 7v12M7 8h2m-2 4h2m5-4h3m-3 4h3"/>',
map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
photos:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
bag:'<rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/>',
save:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v6h10V3M7 21v-8h10v8"/>'
};
const icon=(name)=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">'+IC[name]+'</svg>';
const n=(t)=>({t:"n",text:t}), m=(s,t)=>({t:"m",who:s,text:t}), p=(t)=>({t:"m",who:"我",text:t}), d=(t)=>({t:"d",text:t}), notice=(t)=>({t:"notice",text:t});
const cond=(fn,b)=>Object.assign({},b,{when:fn});
const c=(text,to,fx={},sub="",when=null)=>({text,to,fx,sub,when});
const scenes={};
function def(id,day,time,place,title,photo,beats,question,choices){scenes[id]={id,day,time,place,title,photo,beats,question,choices};}
const f=(key,val)=>(s)=>s.flags[key]===val;
const inF=(key,values)=>(s)=>values.includes(s.flags[key]);
const paired=(s)=>["both","trial","otaru"].includes(s.flags.meet_plan);
const joint=(s)=>["accepted","one_day"].includes(s.flags.continue_intent);
const solo=(s)=>!joint(s);
const NEXT_DAY2=(s)=>s.flags.otaru_plan==="together"||s.flags.otaru_plan==="late"?"station":"day2_choice";
const CONTINUE_ROUTE=(s)=>s.flags.continue_intent==="pending"?"ask_toya":joint(s)?"transport":"day2_end";
const TRANSPORT_RESULT=(s)=>joint(s)?"toya_begin":"toya_solo";
function sceneOptions(choices,s){return choices.filter(x=>!x.when||x.when(s))}
def("office",17,"21:16","北京 · 写字楼","最后一份文件","night",[
n("办公区的灯关了一半。打印机旁放着几只没来得及收走的纸杯，会议室门口的电子屏还停留在下午四点的预约记录。"),
n("电脑右下角弹出“上传成功”。最后一份市场表现补充报告已经提交。这轮融资项目的资料对接，暂时告一段落。"),
m("品牌战略项目群（12）· 周璇 21:13","今天的资料已经全部提交，后续如果需要补充再统一协调。大家辛苦。"),
m("张极 21:16","收到，谢谢。"),
n("过去几个月，你们见过四次面。微信上聊得最多的是附件、会议和数据口径。"),
n("手机再次亮起。是原本要和你去北海道的林蔓。"),
m("林蔓 21:22","我刚跟领导确认完，真的走不了。你那边酒店是不是已经不能退了？\n对不起啊，明明几个月前就说好了。"),
m("林蔓 21:25","你不会因为我不去，就不去了吧？"),
p("不会，假都请好了。酒店我明天联系一下，你先忙你的。"),
n("你的机票仍然有效，酒店也已经订好。十二月十九日至二十五日，札幌、小樽、洞爷湖、函馆。七天六夜。"),
],"临时少了一位旅伴，你打算怎么办？",[
c("发朋友圈，看看有没有同日期去北海道的人","post_find",{set:{post_mode:"find"}},"主动寻找可以约饭、逛街的人"),
c("只发旅行动态，不主动找人","post_update",{set:{post_mode:"update"}},"照常出发，也可以收些推荐"),
c("不发朋友圈，按原计划一个人去","post_silent",{set:{post_mode:"silent",meet_plan:"none"}},"保留完整独立旅行路线")
]);
def("post_find",17,"21:46","北京 · 地铁","一个临时的邀约","train",[
n("地铁里人不算多。你找到靠门的位置站好，打开朋友圈，选了一张之前保存的北海道雪景。"),
n("最终发布内容："),
notice("朋友圈 · 21:46\n19号到北海道，原本同行的朋友临时走不开了。\n有没有那几天也在札幌、小樽的朋友？可以约饭或者一起逛逛，行程不用完全一样。"),
n("同事在下面推荐餐厅，还有人问你能不能帮忙代买。列车驶入地下区间，信号断断续续。"),
n("十点过后，一个不常在私人消息里出现的名字，停在了聊天列表上方。"),
m("张极 22:07","你十九号去北海道？\n我刚看到你朋友圈。")
],"怎么回复？",[
c("对，你也是出去玩？","dm_find",{set:{dm_reply:"direct",zhangji_contacted:true}}),
c("这么巧？你去几天？","dm_find",{set:{dm_reply:"dates",zhangji_contacted:true}}),
c("本来和朋友去的，现在就我一个人。","dm_find",{set:{dm_reply:"solo",zhangji_contacted:true}})
]);
def("post_update",17,"21:46","北京 · 地铁","行程照旧","cityNight",[
n("你在朋友圈编辑框里打了几行字，又删掉了大半。"),
notice("朋友圈 · 21:46\n原本的双人旅行变成单人旅行了。19号照常出发，有札幌、小樽好吃的可以推荐给我。"),
n("林蔓第一个点了赞，在评论里发了个哭脸。你回她一个句号。"),
n("过了一会儿，张极发来微信。"),
m("张极 22:07","你也是十九号走？\n刚看到你朋友圈。")
],"你怎么回复？",[
c("对，你也去北海道？","dm_update",{set:{zhangji_contacted:true}}),
c("我十九号到札幌，你呢？","dm_update",{set:{zhangji_contacted:true}})
]);
def("post_silent",17,"21:50","北京 · 地铁","一个人的计划","cityNight",[
n("朋友圈页面停在编辑框里。你看着那行还没发出去的文字，最后按了返回。"),
n("地铁到站后，你顺着人流出了闸机。林蔓共享的地图收藏夹里，还存着四十多个地点。"),
m("林蔓 21:57","我把路线重新整理了一下。你一个人也不用赶我的行程。\n到了给我报个平安。"),
p("好。"),
n("你在便利店买了点东西，回家取下行李箱。这趟旅行没有取消，只是接下来要按自己的节奏走。")
],"继续准备出发",[
c("检查行李与证件","pack",{set:{meet_plan:"none",otaru_plan:"separate"}})
]);
def("dm_find",17,"22:09","北京 · 微信","工作联系人","night",[
cond(f("dm_reply","direct"),p("对，你也是出去玩？")),
cond(f("dm_reply","dates"),p("这么巧？你去几天？")),
cond(f("dm_reply","solo"),p("本来和朋友去的，现在就我一个人。")),
m("张极 22:09","嗯，休假。我十九号到札幌，二十号打算去小樽。"),
p("这么巧，我也是十九号到，小樽也安排在二十号。"),
m("张极 22:11","那时间还挺重合。\n我原来就准备自己去，后面几天还没排完。"),
n("你往上翻了几条。上一次私聊还是十二月初，他问一份附件能否重新发送。"),
m("张极 22:16","你明天还上班吗？"),
p("不上了，明天开始休假。"),
m("张极 22:17","那行，明天聊。我先收拾东西去了。")
],"明天再继续聊",[
c("回家整理行李","invite")
]);
def("dm_update",17,"22:09","北京 · 微信","刚好同一天","night",[
p("对，你也去北海道？"),
m("张极 22:09","嗯。十九号到札幌，二十号去小樽。"),
p("好巧，我也差不多这个安排。"),
m("张极 22:11","我本来就准备一个人去。后面的时间还没排完。"),
m("张极 22:13","你朋友圈说朋友不去了？"),
p("对，临时请不了假。我还是按原来的安排走。"),
m("张极 22:14","明白。那你应该有不少现成的攻略。\n我现在连吃什么都没想好。"),
n("你回了个笑的表情。张极没有再继续聊下去。")
],"第二天晚上",[
c("继续","invite")
]);
def("invite",18,"19:46","北京 · 家中","出发前一天","paper",[
n("床上摊着几件厚衣服。洗漱包还没装，充电器散在床头。你正在找转换插头，微信响了。"),
m("张极 19:46","我二十号打算去小樽。你那天有安排吗？"),
p("有，本来准备去音乐盒堂和运河那边。"),
m("张极 19:47","我也想去那边。不过没打算一天赶很多地方。"),
m("张极 19:49","你十九号晚上有安排吗？\n要不先在札幌吃顿饭？二十号如果你愿意，也可以一起去小樽。\n不用非得全程一起走。"),
n("这是他第一次单独约你吃饭。昨天你们的私聊还停留在市场数据和附件版本。")
],"你怎么答复？",[
c("十九号晚饭，二十号小樽也一起","agree_both",{set:{meet_plan:"both",otaru_plan:"together"}}),
c("先吃一顿饭，小樽之后再定","agree_trial",{set:{meet_plan:"trial",otaru_plan:"pending"}}),
c("十九号自己逛，只约二十号小樽","agree_otaru",{set:{meet_plan:"otaru",otaru_plan:"together"}}),
c("后面还是想先一个人走","agree_none",{set:{meet_plan:"none",otaru_plan:"separate"}})
]);
def("agree_both",18,"19:52","北京 · 微信","约好了","night",[
p("十九号晚上可以一起吃饭，二十号小樽也一起吧。"),
m("张极 19:52","行。你住札幌站附近？"),
p("对，走过去没多远。"),
m("张极 19:53","我住大通那边。\n那我们各自先到酒店，等你安顿好再联系。"),
p("好，晚饭到时候再选？"),
m("张极 19:55","可以。我只有一个要求，别选那种得排一个多小时的。\n我落地应该挺饿。"),
n("你翻出收藏的餐厅，顺手发了一份简短攻略。"),
p("我把地址发你了，有问题随时沟通。"),
m("张极 20:01","好的。"),
m("张极 20:04","我们出去了应该不用每天开会吧？")
],"你怎么回他？",[
c("哈哈哈不用，明天见","pack",{set:{chat_style:"joke"}}),
c("收到，张老师","pack",{set:{chat_style:"work"}})
]);
def("agree_trial",18,"19:52","北京 · 微信","先吃一顿饭","night",[
p("十九号先一起吃饭吧，小樽我想到了再决定。"),
m("张极 19:52","行。那先吃一顿。"),
p("毕竟我原来还有自己的安排。"),
m("张极 19:53","明白。我也没准备一直跟着一个固定行程走。"),
m("张极 19:54","我住大通。明天到了之后再联系吧。\n要是落地太晚，我们再改。"),
p("好。"),
n("稍后，他发来一家餐厅的地图链接。"),
m("张极 20:03","这家我之前存的。不过我也没吃过，不知道怎么样。"),
p("那明天看看。"),
m("张极 20:04","行，明天见。")
],"继续准备行李",[
c("收好证件和外套","pack")
]);
def("agree_otaru",18,"19:52","北京 · 微信","后天见","night",[
p("十九号我想先自己逛，二十号可以一起去小樽。"),
m("张极 19:52","可以。那你十九号按自己的计划走。"),
p("刚到日本估计也挺累的。"),
m("张极 19:53","我也没打算一下飞机就开始赶景点。\n小樽那天我想稍微晚点出发，你呢？"),
p("我也不想太早。"),
m("张极 19:55","行，那挺合适。明天到了札幌再对一下时间？"),
p("好。"),
m("张极 19:56","那后天见。"),
n("你的第一晚仍然可以自由安排。")
],"继续准备行李",[
c("整理出发物品","pack")
]);
def("agree_none",18,"19:52","北京 · 微信","各自出发","night",[
p("我还是打算先一个人走，暂时不约啦。"),
m("张极 19:52","行，没问题。\n那你按自己原来的行程玩。"),
p("嗯，谢谢你邀请。"),
m("张极 19:53","客气什么。旅途顺利。"),
p("你也是。"),
n("聊天结束。他没有再次提出同行。你继续把充电器和转换插头收进行李袋。")
],"行李还没收完",[
c("继续收拾","pack")
]);
def("pack",18,"22:08","北京 · 家中","最后一件行李","paper",[
n("行李箱竖在墙边，拉链还没完全拉好。床上放着护照、耳机、充电宝，还有一只没装进袋子的转换插头。"),
n("周璇把假期交接文件发在工作群里。你回复收到，随后把消息设成免打扰。"),
m("林蔓 21:57","落地发我个消息。还有你得替我看看小樽的音乐盒。"),
p("好，你早点下班。"),
n("你打开抽屉，拿出那台很久没带出门的相机。电池只有一格电，存储卡里还有一些以前拍的照片。")
],"这次旅行带上相机吗？",[
c("带上相机，今晚给电池充电","reason",{set:{camera:true},item:{name:"随身相机",desc:"旅行摄影 · 相机模式"}}),
c("只带手机，行李轻一点","reason",{set:{camera:false}},"依然可以拍照，不影响故事")
]);
def("reason",18,"22:23","北京 · 卧室","为什么出发","paper",[
n("你确认了酒店入住人数、机票和保险信息，给第二天设好闹钟。"),
n("桌上摊开林蔓共享的攻略。你重新看了一遍，删去几项不合适的安排。现在这份行程表已经变成你自己的了。")
],"你最期待这趟旅行的什么？",[
c("终于能休息一阵","prologue_end",{set:{travel_reason:"想休息"}}),
c("想看看冬天的海和雪","prologue_end",{set:{travel_reason:"想看冬天的海"}}),
c("就是想离开北京几天","prologue_end",{set:{travel_reason:"想出门"}})
]);
def("prologue_end",18,"23:11","北京 · 出发前夜","明天几点出发？","night",[
n("外套搭在椅背上，行李箱终于拉好。你站在窗边看了一眼楼下，停车场里还有几盏车灯亮着。"),
cond((s)=>["both","trial"].includes(s.flags.meet_plan),m("张极 · 昨晚","那明天见。")),
cond(f("meet_plan","otaru"),m("张极 · 昨晚","那后天见。")),
cond(f("meet_plan","none"),n("手机上只有林蔓的旅行叮嘱。明天抵达札幌后，可以直接按自己的安排走。")),
n("你把护照塞进随身包内侧，关掉床头灯。十二月十九日，北海道。")
],"CHAPTER 00 · END",[
c("开始第一天 · 札幌","arrival",{memory:"12月18日 · 收拾好行李，准备出发"})
]);
def("arrival",19,"傍晚","札幌 · 酒店","抵达札幌","city",[
n("车窗上起了一层薄雾。你擦出一小块地方，外面的街道正在下雪。积雪被清到人行道两侧，便利店的灯牌亮得很早。"),
m("林蔓","到了没？"),
p("到了，在去酒店的路上。"),
m("林蔓","那就好。我还在公司，嫉妒了。\n你去吃好吃的记得拍给我。"),
n("房间比预订页面看着小一点，但行李箱可以完全摊开。窗外是另一栋楼，楼下有家便利店。"),
n("你把厚外套挂在门口，手机接上充电线。"),
cond((s)=>["both","trial"].includes(s.flags.meet_plan),m("张极","我到酒店了。你呢？")),
cond(f("meet_plan","otaru"),n("昨晚已经说好明天去小樽。今夜没有约定，你可以先按自己的想法探索札幌。")),
cond(f("meet_plan","none"),n("没有必须赶往的集合地点。札幌的第一晚，就从你自己的选择开始。"))
],"第一晚怎么安排？",[
c("和张极确认今晚的晚饭","dinner_check",{}, "",(s)=>["both","trial"].includes(s.flags.meet_plan)),
c("先独自逛逛札幌","otaru_night",{},"明天在小樽碰面",f("meet_plan","otaru")),
c("开始个人旅行路线","solo_night",{},"独自逛街、吃饭或休息",f("meet_plan","none"))
]);
def("dinner_check",19,"傍晚","札幌 · 微信","到了吗？","cityNight",[
p("我也刚到，在收拾东西。"),
m("张极","行。我看了几家餐厅，你昨天发的那家也在附近。你还想去吗？"),
n("你点开他发的地图。一家是你和林蔓收藏的汤咖喱店，一家是他找的拉面店。")
],"今晚还能出去吗？",[
c("按原计划见面","dinner_meet",{set:{dinner_status:"confirmed"}}),
c("晚半小时，让自己休息一下","dinner_meet",{set:{dinner_status:"delayed"}}),
c("今天太累，改成各自吃饭","dinner_cancel",{set:{dinner_status:"cancelled"}},"明天的约定不会因此自动取消")
]);
def("dinner_cancel",19,"傍晚","札幌 · 微信","今晚先休息","night",[
p("今天有点累，可能不太想出门了。"),
m("张极","那今天就算了。刚到确实挺折腾的。"),
cond(f("meet_plan","both"),m("张极","明天小樽的事还照旧吗？")),
cond(f("meet_plan","trial"),m("张极","那今天你好好休息，后面到了再说。")),
n("你收起手机，准备在酒店周围解决晚饭。")
],"明天怎么办？",[
c("小樽还是照约定一起去","otaru_night",{set:{otaru_plan:"together"}},"明天十点半左右集合",f("meet_plan","both")),
c("明天想晚一点再出发","otaru_night",{set:{otaru_plan:"late"}},"改到十一点半",f("meet_plan","both")),
c("小樽也改成独自探索","solo_night",{set:{otaru_plan:"separate"}},"明确取消同行约定",f("meet_plan","both")),
c("今晚休息，明天再决定","solo_night",{set:{otaru_plan:"separate"}},"此前只约定过今晚吃饭",f("meet_plan","trial"))
]);
def("dinner_meet",19,"入夜","札幌 · 酒店门口","第一次在旅行中见面","cityNight",[
n("张极说自己已经到了一楼。你乘电梯下去，在落地窗旁看见了他。"),
n("黑色羽绒服，灰色长裤，脚边放着一只背包。他低头看手机，手里拿着一瓶刚买的水。"),
d("“嗨。”\n“嗨。”\n“行李放好了？”\n“放好了。”"),
n("他把背包背到肩上，推开酒店门。雪比你刚到时下得密了一点。"),
d("“你收藏的店走过去十几分钟，另一家更近。”\n“你想吃哪个？”")
],"第一顿晚饭去哪儿？",[
c("去收藏了三个月的汤咖喱店","soup_wait",{set:{restaurant:"汤咖喱"}}),
c("去张极找到的拉面店","ramen",{set:{restaurant:"拉面"}}),
c("先沿着街道找一家","street_food",{set:{restaurant:"街边小店"}})
]);
def("soup_wait",19,"晚上","札幌 · 汤咖喱店","需要等二十五分钟","warm",[
n("店门口有几个人在等位。服务员出来确认人数，告诉你们大概要等二十五分钟。"),
d("张极看了眼手表：“二十五分钟。”\n“你很想吃这家吗？”"),
n("你翻出收藏记录。九月份，林蔓在店名后面加了一句：一定要吃。"),
d("“这是谁写的？”\n“我朋友。”\n“那她还挺坚定的。”")
],"等位期间做什么？",[
c("留下等，请他帮忙带杯热茶","dinner_talk",{item:{name:"热茶",desc:"第一晚等位时买的热饮"},memory:"第一次一起等位，张极买到了一杯意外很苦的咖啡"}),
c("一起逛旁边的便利店","dinner_talk",{set:{store_event:true},item:{name:"便利店饮料",desc:"小店里随手挑的，味道出人意料"},memory:"便利店里，张极说「你选另一个是对的」"}),
c("不想等，改去拉面店","ramen",{set:{restaurant:"拉面"}})
]);
def("ramen",19,"晚上","札幌 · 拉面店","靠吧台的两个座位","warm",[
n("店里只剩吧台的两个座位。张极把羽绒服挂在椅背上，看了一眼菜单，很快就选好了。"),
d("“你这么快？”\n“我刚在外面就想好了。”"),
n("热气从碗里冒出来。张极吃得比你快，吃完也没有催你，给自己的杯子续了水。"),
d("“还行，比我想的好吃。”\n“你那个辣吗？”"),
n("外面仍在下雪，窗上已经起了雾。")
],"吃完以后",[
c("聊点工作以外的事","dinner_talk",{memory:"札幌的第一顿晚饭：拉面"})
]);
def("street_food",19,"晚上","札幌 · 街边","随便走走再决定","warm",[
n("你们沿着街道走了一段。路口有一家居酒屋，再往前是一家乌冬店。"),
d("张极停下：“我现在是真的有点饿。”\n“那不要再走太远。”\n“这个建议我同意。”"),
n("两家店看着都可以。")
],"最后吃什么？",[
c("热乌冬","dinner_talk",{set:{restaurant:"乌冬"},memory:"第一次晚饭没有去攻略上的店，临时选了热乌冬"}),
c("居酒屋的热食","dinner_talk",{set:{restaurant:"居酒屋"},memory:"第一晚在路边找了一家居酒屋"})
]);
def("dinner_talk",19,"晚上","札幌 · 餐厅","工作以外的话题","warm",[
n("餐厅里渐渐热闹起来。张极喝了口水，隔着玻璃看了眼外面。"),
d("“你这几天行程都已经定好了？”\n“差不多，九月份就开始做了。”\n“那确实早。”"),
n("他把杯子放下，看着你。")
],"你想聊什么？",[
c("你为什么来北海道？","talk_travel",{set:{talk_topic:"trip"}}),
c("上次项目的三个最终版附件","talk_work",{set:{talk_topic:"work"}}),
c("你一个人出来不会无聊吗？","talk_solo",{set:{talk_topic:"solo"}})
]);
def("talk_travel",19,"晚上","札幌 · 餐厅","原来早就想来了","warm",[
p("你怎么想来北海道的？"),
m("张极","之前就想来，一直没找到时间。\n这次想找个地方待几天，顺便拍点照片。"),
p("你也喜欢拍照？"),
m("张极","喜欢。不过拍得一般。"),
n("他拿出手机，给你看一张以前拍的街景。自行车靠在墙边，车把上挂着购物袋。"),
d("“这张我挺喜欢。”\n“确实不错。”\n“那谢谢。”")
],"晚饭快结束了",[
c("结账后出去走走","after_dinner",{set:{photo_talk:true}})
]);
def("talk_work",19,"晚上","札幌 · 餐厅","三个最终版","warm",[
p("之前一直以为你工作的时候就那个样子。"),
m("张极","哪个样子？"),
p("开会特别认真，问题还特别多。"),
m("张极","不问清楚回去不是还得开会？\n你上次发的附件，文件名后面连着三个最终版。"),
n("你想起来了。那是融资材料交付前的最后一个星期。"),
d("“别提了。”\n“行，不提工作了。”"),
n("他笑了笑，继续吃饭。")
],"晚饭快结束了",[
c("结账后出去走走","after_dinner",{set:{work_joke:true}})
]);
def("talk_solo",19,"晚上","札幌 · 餐厅","旅行不用开会","warm",[
p("一个人出来，你不会觉得无聊吗？"),
m("张极","还好。想去哪儿就去哪儿，不用一直商量。"),
p("那现在突然多一个人，会不会不习惯？"),
m("张极","我们这不是才吃第一顿饭吗？\n而且想自己逛就自己逛，又不是非得一直待在一起。"),
n("他把账单翻过来，确认了一遍各自点的东西。")
],"晚饭快结束了",[
c("结账","after_dinner",{set:{independent_talk:true}})
]);
def("after_dinner",19,"晚上","札幌 · 街头","晚饭之后","cityNight",[
n("两个人分别结清账单，合点的食物平分。张极把收据折起来放进钱包。"),
d("“你还记账吗？”\n“记，回头整理。”\n“行，共用的那部分我已经算好了。”"),
n("餐厅外的灯亮着，路边的人踩着积雪慢慢走。"),
cond(f("work_joke",true),m("张极","这次不用写用餐反馈报告了吧？"))
],"接下来做什么？",[
c("去附近的灯饰旁拍照","photo_night",{}, "有体力才去"),
c("再逛一次便利店","dinner_end",{item:{name:"饭团",desc:"第二天备用早餐"},memory:"第一晚吃完饭，又去了一次便利店"}),
c("直接回酒店休息","dinner_end",{},"不影响第二天的邀约")
]);
def("photo_night",19,"夜","札幌 · 街道","第一张旅行照片","cityNight",[
n("路边的树缠着小灯。有人拿着纸杯从你们身边走过，围巾遮住半张脸。"),
d("张极停下：“这里拍出来应该还行。你要拍吗？”"),
n("他等你决定，没有先举起相机对准你。")
],"要拍什么？",[
c("请他给自己拍一张","dinner_end",{photo:{title:"札幌 · 第一晚的照片",type:"cityNight",day:19}}),
c("只拍街景","dinner_end",{photo:{title:"札幌的夜灯",type:"night",day:19}}),
c("今天不拍了，先回去","dinner_end")
]);
def("dinner_end",19,"21:30","札幌 · 酒店","回到房间","cityNight",[
n("酒店房间里有些闷。你把外套挂好，林蔓发来三条消息。"),
m("林蔓","怎么样？吃什么了？有没有遇到什么好玩的？"),
p("今天跟张极一起吃了晚饭。"),
m("林蔓","？？？哪个张极？\n你不是说你们不熟吗？"),
p("之前工作认识的那个。确实不熟，刚好行程重合。"),
m("林蔓","行吧哈哈哈哈，回来再跟我讲。"),
m("张极 21:41","到酒店了。今天吃的那家还不错。"),
cond(f("work_joke",true),m("张极 21:42","这次不用发正式反馈吧？")),
cond((s)=>!s.flags.work_joke,m("张极 21:42","你那个收藏夹看来还挺有用。"))
],"明天的小樽怎么安排？",[
c("按约定一起去，十点半见","day2_open",{set:{otaru_plan:"together"}},"此前已约小樽",f("meet_plan","both")),
c("晚一点出发，十一点半见","day2_open",{set:{otaru_plan:"late"}},"此前已约小樽",f("meet_plan","both")),
c("想改成自己逛","day2_open",{set:{otaru_plan:"separate"}},"取消共同小樽行程",f("meet_plan","both")),
c("问他要不要一起去小樽","day2_open",{set:{otaru_plan:"together"}},"临时确定同行",f("meet_plan","trial")),
c("先自己逛，下午再碰面","day2_open",{set:{otaru_plan:"afternoon"}},"不改变上午的个人行程",f("meet_plan","trial")),
c("二十号还是想一个人逛","day2_open",{set:{otaru_plan:"separate"}},"礼貌拒绝",f("meet_plan","trial"))
]);
def("otaru_night",19,"夜","札幌 · 一个人的晚上","第一晚的安排","books",[
n("昨晚你们已经说好只约二十号的小樽。今天张极没有突然来找你。"),
n("你重新打开札幌的收藏夹：书店、汤咖喱，还有酒店楼下的便利店。")
],"怎么度过第一晚？",[
c("去书店看看日本摄影集","otaru_confirm",{memory:"第一晚独自去了书店"}),
c("去吃林蔓推荐的汤咖喱","otaru_confirm",{item:{name:"汤咖喱打卡票",desc:"林蔓收藏的札幌餐厅"},memory:"一个人去吃林蔓推荐的汤咖喱"}),
c("在便利店买晚饭，早点回去","otaru_confirm",{set:{rest_bonus:true},memory:"抵达第一晚选择休息"})
]);
def("otaru_confirm",19,"21:38","札幌 · 微信","后天见过的约定","night",[
m("张极","我看了明天去小樽的交通。\n我们十点半左右在札幌站碰面可以吗？"),
n("他问的是二十号的集合时间，没有把十九号的独处当成临时改约。")
],"确定集合安排",[
c("可以，十点半见","day2_open",{set:{otaru_plan:"together"}}),
c("十一点半出发可以吗？","day2_open",{set:{otaru_plan:"late"}}),
c("想了想，明天还是自己逛","day2_open",{set:{otaru_plan:"separate"}})
]);
def("solo_night",19,"夜","札幌 · 城市里","一个人的札幌","books",[
n("你没有和任何人约好晚饭。手机相册里有几张抵达时拍的照片：车窗外的雪、酒店门口的街道。"),
m("林蔓","你是不是已经出去玩了？去吃好吃的！"),
n("你换好鞋，准备出门。")
],"独自旅行的第一晚",[
c("去吃饭，再沿街散步","solo_end",{memory:"第一晚独自吃饭、散步"}),
c("逛书店和杂货店","solo_end",{memory:"第一晚逛书店"}),
c("买好晚饭，早些休息","solo_end",{set:{rest_bonus:true},item:{name:"便利店饭团",desc:"独自旅行的第一份晚饭"}})
]);
def("solo_end",19,"夜","札幌 · 房间","明天想去哪儿？","night",[
n("回房间后，你把充电线接上，翻看林蔓整理好的攻略。"),
n("二十号原本安排去小樽。今天虽然有点累，但明天还有一整天。")
],"第二天的安排",[
c("按照原计划去小樽","day2_open",{set:{day2_plan:"otaru",otaru_plan:"separate"}}),
c("留在札幌多逛一天","day2_open",{set:{day2_plan:"sapporo",otaru_plan:"separate"}}),
c("睡醒以后再决定","day2_open",{set:{day2_plan:"undecided",otaru_plan:"separate"}})
]);
def("day2_open",20,"早上","札幌 · 酒店","原本只到这里","train",[
n("窗帘没有拉严，外面的光照进来。昨晚洗过的袜子还搭在浴室门边。"),
m("林蔓 08:43","明天……不对，今天是小樽吧？\n记得看音乐盒！"),
p("知道啦。"),
n("今天不用退房。行李可以留在札幌，随身带好必需品就行。"),
cond((s)=>["together","late"].includes(s.flags.otaru_plan),m("张极","我出门前再跟你说。车站见。")),
cond(f("otaru_plan","afternoon"),n("上午没有集合安排。你可以先独自逛店，下午再决定要不要碰面。"))
],"今天从哪里开始？",[
c("去札幌站与张极会合","station",{},"小樽共同旅行",inF("otaru_plan",["together","late"])),
c("独自出发，下午再联系","otaru_solo_morning",{},"保留下午碰面的可能",f("otaru_plan","afternoon")),
c("独自前往小樽","otaru_solo_morning",{},"今天没有同行安排",(s)=>s.flags.otaru_plan==="separate"&&s.flags.day2_plan!=="sapporo"&&s.flags.day2_plan!=="undecided"),
c("留在札幌","sapporo_day",{},"一整天的城市探索",f("day2_plan","sapporo")),
c("决定去小樽","otaru_solo_morning",{set:{day2_plan:"otaru"}},"今天早上才决定",f("day2_plan","undecided")),
c("决定留在札幌","sapporo_day",{set:{day2_plan:"sapporo"}},"今天早上才决定",f("day2_plan","undecided"))
]);
def("station",20,"10:30 / 11:30","札幌站","车站里的人","train",[
n("车站里人很多。有人拖着两个大箱子经过，轮子在地砖接缝上发出一串响声。"),
n("张极站在自动售票机附近，手里拎着咖啡。看见你，他抬了抬手。"),
d("“早。”\n“早。”\n“今天没迟到。”\n“你昨天不是说不喜欢早起吗？”\n“我是不喜欢，没说我起不来。”"),
n("他指了指检票口。两个人各自确认票价、买好车票。"),
n("上车以后，窗外慢慢出现海。张极拿出手机拍了一张，照片里刚好有根电线杆。"),
d("“拍早了。”\n他翻回相册看了一眼，又笑着删掉。")
],"到了小樽之后怎么逛？",[
c("先一起逛店，下午再决定","musicbox",{set:{otaru_pace:"flexible"}}),
c("上午各自逛，午饭再碰面","split_shops",{set:{otaru_pace:"split"}}),
c("今天尽量一起逛","musicbox",{set:{otaru_pace:"together"}})
]);
def("split_shops",20,"上午","小樽 · 堺町通","各自的一小时","books",[
n("下车后，张极打算去玻璃店拍照，你想先看杂货。"),
d("“那中午在这家咖啡店碰面？”\n“可以。”\n“时间不用卡得太死，提前走完了就发消息。”"),
n("杂货店里摆着布包、瓷杯和手工装饰品。你给林蔓拍了两张照片。"),
n("中午在咖啡店重新见面时，张极把早上拍的照片拿给你看。其中一张角落里拍到了他自己的手套。"),
d("“怎么手套也拍进去了？”\n“……我真没注意。”")
],"碰面之后",[
c("一起去音乐盒堂","musicbox",{memory:"小樽上午各自逛店，中午在咖啡店碰面"})
]);
def("musicbox",20,"中午","小樽 · 音乐盒堂","听听这首","books",[
n("木质货架摆着各式各样的音乐盒。有玻璃的、木质的，也有旋转木马样式的。"),
d("张极看了一圈：“比我想的多。我以为就是那种小盒子。”"),
n("他在一组木质音乐盒前停下，听了两遍旋律。"),
d("“这个挺好听。”\n“你喜欢这首？”\n“嗯，之前在演出里听过有点像的。”"),
n("你转向另一排展示柜。旁边还有一首你更熟悉的曲子。")
],"你想怎么选音乐盒？",[
c("买一只自己喜欢的","canal",{item:{name:"小樽音乐盒",desc:"十二月二十日 · 为自己选的旋律"},memory:"在音乐盒堂买了自己喜欢的旋律"}, "获得音乐盒物品"),
c("只记下曲名，不购买","canal",{item:{name:"音乐盒曲目便签",desc:"试听过的旋律，不产生购物支出"},memory:"在音乐盒堂记住了一段旋律"}),
c("问张极为什么喜欢那首","canal",{set:{song_link:true},memory:"张极答应回去分享演出时听过的曲子"})
]);
def("canal",20,"下午","小樽 · 运河","运河边的照片","sea",[
n("石造仓库上落着雪，桥上有很多举着手机的游客。"),
d("“这边人挺多。”\n“大家都是来拍运河的。”"),
n("张极站在桥边找了一会儿角度，终于放下手机。"),
d("“算了，先给你拍吧。”\n“你想怎么拍？”")
],"留下什么照片？",[
c("请他拍一张单人照","north_choice",{photo:{title:"小樽运河 · 单人旅行照",type:"sea",day:20}}),
c("拍一张合照","couple_photo",{}, "合照距离可以自己决定"),
c("只拍运河和旧仓库","north_choice",{photo:{title:"小樽运河 · 雪中的仓库",type:"sea",day:20}}),
c("不拍照，先散步","north_choice")
]);
def("couple_photo",20,"下午","小樽 · 运河","站近一点？","sea",[
n("张极请路过的游客帮忙拍一张合照。第一张照片里，你们中间隔着一段距离。"),
n("他看了眼屏幕，笑了一下。"),
d("“要不要站近一点？刚才看着像碰巧路过的。”"),
n("帮忙拍照的游客仍然在等，你可以决定是否重新拍。")
],"合照距离",[
c("稍微站近一些，再拍一张","north_choice",{photo:{title:"小樽运河 · 合照",type:"sea",day:20},set:{photo_distance:"near"}}),
c("这样就挺好，保留原来的照片","north_choice",{photo:{title:"小樽运河 · 第一张合照",type:"sea",day:20,alreadyTaken:true},set:{photo_distance:"normal"}}),
c("还是各自拍吧","north_choice",{set:{photo_distance:"none"}})
]);
def("north_choice",20,"下午","小樽 · 运河","还往前吗？","sea",[
n("游客渐渐少了一些。张极把围巾往上拉了拉。"),
d("“前面还有一段北运河，人应该少点。不过得再走一会儿。”\n“你想去吗？”")
],"下午剩下的时间",[
c("去北运河看看","north_canal"),
c("太冷了，找家咖啡店","north_cafe",{item:{name:"小樽咖啡店小票",desc:"运河附近 · 热饮"}}),
c("今天已经逛得够多了，回札幌","return_train")
]);
def("north_canal",20,"下午","小樽 · 北运河","旧仓库旁边","winter",[
n("往北走以后，游客少了。河岸边有旧仓库，雪落在屋檐上。"),
n("张极走到桥边拍了一张照片，回来后把屏幕转给你看。"),
d("“这个角度比刚才好。”\n“你还拍到鸟了。”\n“主要还是我拍得好。”"),
n("他自己先笑了。走到下一座桥附近，张极问起你后半程的行程。"),
d("“你明天是不是要去洞爷湖？”\n“嗯，住两个晚上。”\n“我之前也在看那边，本来想往南走走。”")
],"聊聊后面的安排",[
c("先拍一张北运河，再聊后面的安排","invite_continue",{photo:{title:"北运河 · 冬日旧仓库",type:"winter",day:20}}),
c("不拍照，听他接着说","invite_continue")
]);
def("north_cafe",20,"下午","小樽 · 咖啡店","窗边的热饮","cafe",[
n("咖啡店靠窗还有一张双人桌。张极点了咖啡，你自己选了热饮。"),
d("“刚才是不是走太久了？”\n“还好，就是冷。”\n“我刚才也没想到后面那段风这么大。”"),
n("他翻看今天的照片，把几张模糊的删掉。你们聊着今天各自喜欢的店，话题慢慢转到明天。"),
d("“你明天是不是去洞爷湖？”\n“对。”\n“我也想去那边。”")
],"聊聊后面的安排",[
c("听他接着说","invite_continue")
]);
def("return_train",20,"傍晚","小樽 → 札幌","回程的车上","train",[
n("列车里暖气很足。张极把围巾摘下来，搭在背包上。"),
n("你在相册里看见一张他的背影。照片角落还拍进了一只垃圾桶。"),
d("“这是我？”\n“刚好拍进来了。”\n“你这构图，主要拍的是垃圾桶吧。”"),
n("他笑着把手机收回口袋。车窗外的光慢慢暗下来。"),
d("“对了，你明天去洞爷湖？”\n“嗯。”\n“我后面也想往南走走。”")
],"聊聊后面的安排",[
c("继续对话","invite_continue")
]);
def("invite_continue",20,"傍晚","小樽 · 返程前","原本只到这里","winter",[
n("张极把手机放回口袋。"),
d("“我本来后面也想去洞爷湖，酒店还没完全订好。”\n“今天逛下来感觉还挺合得来。”"),
d("“你要是不介意，要不要后面继续一起走？”"),
n("他没有立刻讨论同住或者替你改变订单。你们原来只约到小樽，接下来的时间仍然需要两个人各自决定。")
],"你愿意继续同行吗？",[
c("可以，一起去洞爷湖待两天","transport",{set:{continue_intent:"accepted"}}),
c("先同行一天，之后再决定","transport",{set:{continue_intent:"one_day"}}),
c("为什么想继续一起走？","why_continue"),
c("后面还是想自己旅行","day2_end",{set:{continue_intent:"declined",transport_mode:"solo"}})
]);
def("why_continue",20,"傍晚","小樽 · 街边","为什么是我？","winter",[
p("你不是本来打算自己玩吗？"),
m("张极","对啊。"),
p("那怎么又想一起了？"),
m("张极","因为这两天相处还行啊。行程也差不多。\n有人一起吃饭也挺方便。不过不想一起也没事，我原来的安排又没取消。"),
n("他说完便等你回答，没有继续劝你。")
],"你的决定",[
c("那一起去吧","transport",{set:{continue_intent:"accepted"}}),
c("先一起走一天","transport",{set:{continue_intent:"one_day"}}),
c("我晚上考虑一下","ask_toya",{set:{continue_intent:"pending"}}),
c("我还是想自己走","day2_end",{set:{continue_intent:"declined",transport_mode:"solo"}})
]);
def("ask_toya",20,"21:41","札幌 · 微信","还没决定","night",[
n("回到酒店以后，张极没有催问。直到晚上，他发来两条消息。"),
m("张极","我看了一下，明天往洞爷湖方向走还来得及安排。\n你考虑好了吗？我今晚得确定自己的住宿。")
],"最后确认",[
c("想好了，可以一起去","transport",{set:{continue_intent:"accepted"}}),
c("先同行一天吧","transport",{set:{continue_intent:"one_day"}}),
c("还是想一个人旅行","day2_end",{set:{continue_intent:"declined",transport_mode:"solo"}}),
c("不用等我，后面各自安排","day2_end",{set:{continue_intent:"deferred",transport_mode:"solo"}})
]);
def("transport",20,"晚上","札幌 · 微信","明天怎么走？","night",[
m("张极","你原来准备怎么去洞爷湖？"),
p("本来考虑租车，后来还没完全定。"),
m("张极","我也考虑过，但冬天路况得先确认，证件、租车和驾驶资格也要核对。\n如果不合适就坐车过去。"),
m("张极","你原来的酒店不用改。我自己订房间，订好了告诉你大概位置。")
],"出发方案",[
c("一起乘公共交通","travel_pace",{set:{transport_mode:"public"},memory:"和张极约好共同乘公共交通去洞爷湖"}),
c("想租车，但先检查资格和路况","rental_check",{set:{transport_mode:"rental_check"}},"不满足条件将改乘公共交通"),
c("各自过去，到湖边再碰面","travel_pace",{set:{transport_mode:"separate_arrival"},memory:"决定各自抵达洞爷湖"})
]);
def("rental_check",20,"晚上","札幌 · 行前确认","冬季道路确认","winter",[
n("你们查看了租车条款、当地认可的驾照文件、冬季驾驶要求和天气信息。"),
n("这份剧本没有预先设定你或张极具备当地合法驾驶资格，也不会凭一次选择就让角色完成租车。"),
m("张极","证件和雪地驾驶条件没确认好，不直接订车了。我们先按公共交通走。"),
p("行，安全一点。")
],"确定替代方案",[
c("改乘公共交通","travel_pace",{set:{transport_mode:"public"},memory:"冬季租车条件未确认，改用公共交通"})
]);
def("travel_pace",20,"22:01","札幌 · 微信","先确认自己的节奏","night",[
m("张极","明天主要是移动和换酒店，别排太满。\n你有没有特别想看的地方？"),
n("你翻开原来的攻略，洞爷湖一页贴了几张湖畔照片。")
],"明天想怎么安排？",[
c("想去一个观景点，发给他看看","day2_end",{set:{day03_preference:"viewpoint"}}),
c("早点到酒店休息","day2_end",{set:{day03_preference:"rest"}}),
c("都可以，你安排吧","day2_end",{set:{day03_preference:"vague"}}),
c("我想自己抵达后再联系","day2_end",{set:{transport_mode:"separate_arrival",day03_preference:"rest"}})
]);
def("otaru_solo_morning",20,"上午","小樽 · 街道","自己的小樽","streets",[
n("下车以后，街边的积雪比札幌厚。今天上午没有必须按时到达的集合点。"),
m("林蔓","到小樽了没？替我看看音乐盒！"),
p("刚到。"),
n("堺町通已经热闹起来，你先打开地图，确认想去的几个地方。")
],"第一站想去哪儿？",[
c("音乐盒堂，试听不同的旋律","solo_musicbox",{set:{solo_activity:"musicbox"}}),
c("玻璃小店，看看手工杯子","solo_afternoon",{set:{solo_activity:"glass"}}),
c("沿着街道走走，拍雪和房子","solo_afternoon",{set:{solo_activity:"photowalk"},photo:{title:"小樽街边",type:"streets",day:20}})
]);
def("solo_musicbox",20,"上午","小樽 · 音乐盒堂","挑一首自己喜欢的","books",[
n("你一个人走进音乐盒堂。木质展示台上摆着不同大小的音乐盒。"),
n("你想起林蔓说过想看看这边。试听区有好几段曲子，你可以挑一段喜欢的。")
],"今天想带走什么？",[
c("买下喜欢的音乐盒","solo_afternoon",{item:{name:"小樽音乐盒",desc:"在店里挑的纪念品"},memory:"独自挑了一只音乐盒"}),
c("只记下曲名","solo_afternoon",{item:{name:"音乐盒曲目便签",desc:"试听喜欢的旋律，没买东西"},memory:"独自试听了一段音乐盒旋律"}),
c("不购买，继续逛","solo_afternoon",{memory:"在音乐盒堂试听，没有买纪念品"})
]);
def("solo_afternoon",20,"下午","小樽 · 午后","还没逛完","streets",[
n("中午过后，雪又开始飘。你已经逛了几个小时，脚有点酸。"),
cond(f("otaru_plan","afternoon"),m("张极","我准备去运河那边了。你现在在哪儿？")),
cond((s)=>s.flags.otaru_plan!=="afternoon",n("手机上没有新的集合消息。你可以继续逛，也可以早点返回札幌。"))
],"下午怎么安排？",[
c("去运河和张极见面","afternoon_meet",{}, "下午才开始共同游览",f("otaru_plan","afternoon")),
c("今天还是各自逛","solo_walk",{set:{otaru_plan:"separate"}},"取消下午会合",f("otaru_plan","afternoon")),
c("沿着运河独自散步","solo_walk",{}, "给自己拍几张照片",(s)=>s.flags.otaru_plan!=="afternoon"),
c("提前回札幌休息","day2_end",{set:{continue_intent:"none",transport_mode:"solo"}})
]);
def("afternoon_meet",20,"下午","小樽 · 运河","下午见","sea",[
n("张极站在服务点附近看照片，脖子上的黑色围巾几乎遮住了下巴。"),
d("“来了。”\n“你等很久了？”\n“没有，刚拍完。”"),
n("他打开相册，给你看上午拍的街景和雪里的自行车。"),
d("“你怎么都拍这些？”\n“觉得好看就拍了。”"),
n("走到运河边，张极指了指前面的路。"),
d("“往前走一点？或者找家店坐着也行。”")
],"下午想怎么过？",[
c("一起去运河边拍照","invite_continue",{photo:{title:"小樽 · 下午的运河",type:"sea",day:20},memory:"下午和张极在运河边碰面"}),
c("找家咖啡店坐着聊聊","invite_continue",{memory:"下午才碰面，一起坐在咖啡店里聊了很久"}),
c("带他去上午发现的玻璃店","invite_continue",{memory:"带张极看上午自己发现的小店"})
]);
def("solo_walk",20,"下午","小樽 · 运河","自己的下午","sea",[
n("你沿运河走了一段，桥上不断有人停下来拍照。"),
n("有一位游客请你帮忙拍合照。拍完后，对方问要不要也帮你拍，你可以决定。"),
n("天色慢慢暗下来。你不需要等任何人的返程时间。")
],"今天留下什么？",[
c("请对方帮自己拍一张","day2_end",{photo:{title:"小樽 · 个人旅行照",type:"sea",day:20},set:{continue_intent:"none",transport_mode:"solo"}}),
c("只拍一张运河风景","day2_end",{photo:{title:"小樽 · 运河",type:"sea",day:20},set:{continue_intent:"none",transport_mode:"solo"}}),
c("收好手机，直接回札幌","day2_end",{set:{continue_intent:"none",transport_mode:"solo"}})
]);
def("sapporo_day",20,"上午","札幌","多留一天","books",[
n("今天不用赶去车站。你吃完早餐才慢慢换衣服，街道两边还有昨天没化的雪。"),
n("大通附近有书店和商场，酒店周边也有几家还没去过的餐厅。")
],"怎么安排一整天？",[
c("逛书店、摄影杂志和唱片","day2_end",{set:{continue_intent:"none",transport_mode:"solo"},item:{name:"摄影杂志",desc:"札幌书店 · 冬天的照片"},memory:"没有去小樽，选择留在札幌逛书店"}),
c("去街上拍雪和城市灯饰","day2_end",{set:{continue_intent:"none",transport_mode:"solo"},photo:{title:"札幌 · 冬日街道",type:"city",day:20},memory:"留在札幌拍下冬天的街景"}),
c("休息半天，再吃一顿好的","day2_end",{set:{continue_intent:"none",transport_mode:"solo",rest_bonus:true},memory:"留在札幌好好休息了一天"})
]);
def("day2_end",20,"夜","札幌 · 酒店","原本只到这里","night",[
n("房间里开着暖气。你把今天买的东西摆到桌上，检查是否落下购物小票。明天要退房去洞爷湖。"),
m("林蔓","今天怎么样？明天是不是要去洞爷湖？"),
p("嗯，明天换酒店。"),
m("林蔓","行，多拍点照片给我。"),
cond(joint,m("张极","我查好明天的交通了。你原来的酒店不用改，我自己订房间。\n那明天见。")),
cond(solo,n("你确认了自己的交通和酒店。今天没有和张极约定同行的情况下，明天依然可以独立前往洞爷湖。")),
n("你把充电器接上，把第二天要穿的外套放在椅背上。")
],"CHAPTER 02 · END",[
c("出发前往洞爷湖","toya_begin")
]);
def("toya_begin",21,"早上","札幌 · 退房","你可以直接告诉我","winter",[
n("昨天买的明信片差点落在桌上。你检查了抽屉，把充电器拔下来，将房卡放进口袋。"),
n("酒店走廊里有人推着清洁车。退房时，前台把结算单递给你。"),
m("林蔓 09:12","今天要去洞爷湖了？"),
p("嗯，刚退房。"),
m("林蔓","多睡会儿，帮我看看湖长什么样。"),
cond(joint,m("张极","我这边也准备好了。按昨晚说的走，路上不用赶。")),
cond(solo,n("你按自己的预订和交通安排出发。车站里旅客不少，但今天不用和任何人协调时间。"))
],"选择今天的出发方式",[
c("一起坐车出发","toya_public",{}, "共同移动", (s)=>joint(s)&&s.flags.transport_mode==="public"),
c("各自出发，到洞爷湖再联系","toya_separate",{}, "各自安排交通", (s)=>joint(s)&&s.flags.transport_mode==="separate_arrival"),
c("按公共交通备选方案出发","toya_public",{set:{transport_mode:"public"}},"租车资格尚未确认", (s)=>joint(s)&&s.flags.transport_mode!=="public"&&s.flags.transport_mode!=="separate_arrival"),
c("独自前往洞爷湖","toya_solo",{},"独立旅行路线", solo)
]);
def("toya_public",21,"上午","札幌 → 洞爷湖","路上","train",[
n("出发前你们各自确认了车票与行李。张极把背包放到脚边，坐下来以后拿出耳机。"),
d("“我想听会儿歌，你介意吗？”\n“不介意。”"),
n("他把音量调低。窗外的房屋逐渐变少，远处出现白色的山坡。"),
d("“你之前说喜欢看雪。”\n“嗯。”\n“等到湖边应该能看到更开阔的。”"),
n("车内有些暖。你们没有一直说话。张极偶尔低头看手机上的交通信息。")
],"路上想聊什么？",[
c("听听他旅行时的歌单","toya_arrival",{set:{car_playlist:"shared"},memory:"在去洞爷湖的路上交换了歌单"}),
c("问问他拍照和户外活动的事","toya_arrival",{set:{outdoor_talk:true},memory:"路上聊了骑行、露营和攀冰"}),
c("闭眼休息一会儿","toya_arrival",{set:{day3_rest:true},memory:"路上安静地休息，没有刻意找话题"})
]);
def("toya_separate",21,"下午","洞爷湖 · 湖畔","各自抵达","lake",[
n("你按自己的时间抵达湖边，把行李先寄放在住处。周围很安静，远处能看见山的轮廓。"),
m("张极","我也到这边了，刚放好东西。\n你想现在出来走走，还是先休息？"),
n("你们之前只约定在洞爷湖碰面，没有约定必须共同度过整个下午。")
],"怎么回复？",[
c("傍晚在湖边碰面","toya_arrival",{set:{meet_toya:true}}),
c("今天想先休息，明天再联系","toya_end",{set:{meet_toya:false}}),
c("各自吃饭，晚上再看情况","toya_end",{set:{meet_toya:false}})
]);
def("toya_solo",21,"下午","洞爷湖 · 湖畔","抵达湖边","lake",[
n("从札幌出发到洞爷湖，今天大半天都花在移动上。抵达后，你先办好入住，把行李放在房间。"),
n("窗外能看见湖的一角。岸边的树枝上压着雪，远处有一层淡淡的雾。"),
m("林蔓","到洞爷湖了吗？"),
p("到了，刚放好东西。"),
m("林蔓","有照片吗！"),
n("你走到窗边，抬起手机。")
],"第一天下午",[
c("到湖边走一小段，拍张照片","toya_end",{photo:{title:"洞爷湖 · 第一次看见湖",type:"lake",day:21},memory:"独自抵达后去湖边散步"}),
c("到湖边走走，但不拍照","toya_end",{memory:"独自到湖边散步，没有拍照"}),
c("泡杯热茶，先在房间休息","toya_end",{set:{day3_rest:true},memory:"到洞爷湖后选择休息"}),
c("在旅馆附近找吃的","toya_end",{item:{name:"洞爷湖餐饮记录",desc:"抵达日的热餐"},memory:"独自到旅馆附近找了晚饭"})
]);
def("toya_arrival",21,"下午","洞爷湖 · 旅馆附近","先放好行李","lake",[
n("抵达洞爷湖附近时，天色已经比早上暗了不少。张极查看了一下自己订的旅馆位置。"),
d("“我们先各自放行李吧。你那边入住时间应该也差不多了。”"),
n("你们没有住在同一个房间，也不需要交出各自的房卡。"),
cond(f("day03_preference","viewpoint"),n("你昨晚提过想去观景点。张极重新查看地图，确认这个时间段有没有合适的交通和开放条件。")),
cond(f("day03_preference","rest"),n("你昨晚说想先休息。两人照着商量好的节奏，优先完成入住。")),
cond(f("day03_preference","vague"),n("昨晚你回复了“都可以”，张极便按照最直接的路线安排，准备先去住处。你原来收藏的观景点还没安排进去。"))
],"抵达后的安排",[
c("想先去看看湖边，时间合适就去","toya_viewpoint",{}, "",f("day03_preference","viewpoint")),
c("按原定节奏，先休息","toya_end",{}, "",f("day03_preference","rest")),
c("其实我也想去观景点","toya_misunderstanding",{}, "把之前没说清的事告诉他",f("day03_preference","vague")),
c("今天就先休息","toya_end",{}, "明天再安排湖边活动",f("day03_preference","vague")),
c("抵达后先各自休息","toya_end",{}, "",(s)=>!["viewpoint","rest","vague"].includes(s.flags.day03_preference))
]);
def("toya_misunderstanding",21,"下午","洞爷湖 · 路边","把话说清楚","lake",[
p("其实我也想去昨天发你的那个观景点。"),
m("张极","我以为你不太在意。昨天你说都可以，我就按最省事的安排了。"),
n("他看了看时间和地图。"),
m("张极","我也有点累，刚才理解得太快了。\n如果今天赶不上，就看看明天合不合适。"),
n("你们站在方便停留的地方，没有在匆忙移动中继续争论。")
],"你想怎么说？",[
c("我想去，但怕你觉得麻烦","toya_end",{set:{viewpoint_tomorrow:true},memory:"第一次把旅途中真实想法直接说出来"}),
c("我没表达清楚，明天再看","toya_end",{set:{viewpoint_tomorrow:true},memory:"和张极协调了次日的观景安排"}),
c("今天先休息，我自己在附近走走","toya_end",{set:{viewpoint_tomorrow:false},memory:"表达了希望独自休息的需求"})
]);
def("toya_viewpoint",21,"下午","洞爷湖 · 湖畔","先看一眼湖","lake",[
n("你们核对了实际开放时间和可到达的范围，没有额外安排很远的绕路。"),
n("在湖边可步行的路段，风吹得围巾不停往一边跑。远处的湖面颜色很深，岸边积着雪。"),
d("“这地方比照片上大。”\n“嗯，之前收藏时看不出来。”"),
n("张极拍了张湖面的照片，你也拿起手机。过了几分钟，你们各自返回住处休息。")
],"留下这张照片吗？",[
c("保存湖畔的照片","toya_end",{photo:{title:"洞爷湖 · 初见",type:"lake",day:21}}),
c("只看一会儿，不拍照","toya_end")
]);
def("toya_end",21,"晚上","洞爷湖 · 住处","住在湖边的第一晚","lake",[
n("房间的暖气开得很足。你把外套挂好，将随身带着的东西从背包里取出来。"),
n("晚上没有安排必须完成的景点。今天需要移动、退房和入住，已经够忙了。"),
cond(joint,m("张极","今天先到这儿吧。明天看天气再决定怎么玩。")),
cond(joint,p("好，明天联系。")),
cond(solo,m("林蔓","第一张湖的照片呢？有空记得发我。")),
n("洗漱前，你翻开旅行册。北京、札幌、小樽，已经过去三天。明天还会留在洞爷湖。")
],"已完成的正式剧本",[
c("查看旅行档案","_archive",{memory:"12月21日抵达洞爷湖"}),
c("留在本章结尾","_finish",{memory:"12月21日 · 洞爷湖第一晚"})
]);
function initial(){return {started:false,boarded:false,name:"",current:"office",flags:{},photos:[],items:[],journal:[],choices:[],history:[],page:"story",chatProgress:{},pendingPhoto:null,shopPick:0,shopStep:"browse",budget:10000};}
let state=initial(),openPhoto=null,toastTimer=null,saveError=false;
try{const raw=localStorage.getItem(KEY);if(raw){const q=JSON.parse(raw);if(q&&typeof q==="object"&&scenes[q.current]){state=Object.assign(initial(),q,{page:"story"});if(state.started&&!Object.prototype.hasOwnProperty.call(q,"boarded"))state.boarded=true;}}}catch(e){saveError=true;}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(Object.assign({},state,{page:"story"})));saveError=false;}catch(e){saveError=true;}}
function e(t){return String(t==null?"":t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
function fmt(t){return e(String(t).replace(/\{name\}/g,state.name)).replace(/\n/g,"<br>");}
function jpg(key){return PHOTO[key]||PHOTO.winter;}
function currentScene(){return scenes[state.current]||scenes.office;}
function sceneName(){let s=currentScene();return "12月"+s.day+"日 · "+s.place;}
function toast(t){clearTimeout(toastTimer);const el=document.createElement("div");el.className="toast";el.textContent=t;root.querySelector(".app")?.appendChild(el);toastTimer=setTimeout(()=>el.remove(),2500);}
function renderCover(){return '<div class="cover"><div class="cover-top"><span>JAPAN, IN WINTER / 0723</span></div><div class="cover-space"></div><div class="cover-kicker">AN INTERACTIVE WINTER FILM</div><div class="cover-title">明天几点<br>出发？</div><div class="cover-en">ASHITA, NANJI NI DEMASU KA?<br>北海道 / 七天六夜 / 12.19—12.25</div><div class="cover-line"></div><p class="cover-desc">从北京出发。一场原本两个人的旅行，<br>临时只剩下你。<br>后来的故事，由每一次选择慢慢改变。</p><div class="cover-actions"><button class="primary light" data-act="open-login">开始旅程　↗</button></div><div class="cover-footer"><span>STORY · TRAVEL · POLAROID</span><span>CHAPTER 00 — 03</span></div></div>'+(window.__loginOpen?renderLogin():"");}
function renderLogin(){return '<div class="overlay"><div class="entry"><div class="label-caps">TRAVEL RECORD / ENTRY 001</div><h2>旅客登记</h2><p>这次旅行会把你的名字写进旅行档案。只需要填写昵称，不用注册账号，也不需要密码。存档保留在当前浏览器。</p><label for="player-name">你的名字 / NAME</label><input id="player-name" maxlength="16" placeholder="例如：小满" autocomplete="off" aria-label="玩家名字"><div class="error" id="name-error"></div><button class="primary" data-act="begin">领取旅行票，开始游戏　→</button><button class="small-btn" style="display:block;margin:12px auto 0" data-act="close-login">返回封面</button></div></div>';}
function renderBeat(b,i){if(b.when&&!b.when(state))return "";const delay=Math.min(i*0.055,.6);if(b.t==="n")return '<p class="beat narr" style="animation-delay:'+delay+'s">'+fmt(b.text)+'</p>';if(b.t==="d")return '<div class="beat dialogue" style="animation-delay:'+delay+'s">'+fmt(b.text)+'</div>';if(b.t==="notice")return '<div class="beat notice" style="animation-delay:'+delay+'s">'+fmt(b.text)+'</div>';if(b.t==="m"){const mine=b.who==="我";return '<div class="beat chat '+(mine?"me":"them")+'" style="animation-delay:'+delay+'s"><span class="chat-label">'+e(b.who)+'</span><div class="bubble">'+fmt(b.text)+'</div></div>';}return "";}
function renderStory(){
const s=currentScene(),cs=sceneOptions(s.choices,state),isEnd=s.id==="toya_end",paced=window.TravelUX.view(s,state,renderBeat);
const head='<div class="story-tools"><button class="tool" data-act="back">← 上一场</button><span class="label-caps">CHAPTER '+(s.day===17||s.day===18?"00":String(s.day-18).padStart(2,"0"))+'</span><button class="tool" data-act="open-archive">存档 · 档案 ↗</button></div><div class="scene-photo" style="--photo:url(&quot;'+jpg(s.photo)+'&quot;)"><span class="scene-stamp">DEC '+s.day+' / HOKKAIDO FILM</span><div class="scene-location"><small>'+e(s.time)+' · '+e(s.place)+'</small><h2>'+e(s.title)+'</h2></div></div><div class="story-body"><div class="eyebrow">明天几点出发？</div><div class="chapter-label">旅行人 · '+e(state.name)+'　/　'+e(sceneName())+'</div>'+paced.html;
let options='';
if(paced.done){if(s.id==="musicbox"||s.id==="solo_musicbox"){options=window.TravelUX.shop(state,e);}else{options='<div class="divider"></div><div class="question">'+e(s.question)+'</div><div class="options">'+cs.map((ch,i)=>'<button class="option" data-act="pick" data-index="'+s.choices.indexOf(ch)+'"><span class="index">'+String(i+1).padStart(2,"0")+'</span><span><span class="option-main">'+e(ch.text)+'</span>'+(ch.sub?'<div class="option-note">'+e(ch.sub)+'</div>':"")+'</span><span class="option-arrow">↗</span></button>').join("")+'</div>';}}
return head+options+(isEnd?'<div class="chapter-end"><span class="label-caps">TO BE CONTINUED</span><h3>湖边的第二天</h3><p>已写剧本制作至12月21日。接下来12月22—25日的正式篇章尚未接入，不会由AI临时生成内容。</p></div>':"")+'<div class="footer-text">WINTER, AS IT HAPPENS · 2026 EDITION</div></div>';}
const DAYS=[["19","札幌","抵达、酒店、第一顿晚饭"],["20","小樽 / 札幌","音乐盒、运河、自由活动"],["21","洞爷湖","移动、入住、湖畔"],["22","洞爷湖","湖边休息与摄影（待制作）"],["23","函馆","前往函馆（待制作）"],["24","函馆","平安夜（待制作）"],["25","返程","旅行册与返京（待制作）"]];
function renderMap(){const highest=currentScene().day;return '<div class="section"><div class="label-caps">ROUTE JOURNAL / HOKKAIDO</div><h1 class="section-title">七日行程</h1><p class="section-sub">札幌住两晚，洞爷湖两晚，函馆两晚。你可以查看路线，后续未写成游戏的章节暂时锁定。</p><div class="book-spread"><div class="label-caps">TRIP ROUTE · DEC 19 — 25</div><h3>札幌 → 洞爷湖 → 函馆</h3><p>从北京出发，按实际交通和当天的精力调整行程。不强制同行或共享住宿。</p><div class="progress"><span style="width:'+Math.max(0,Math.min(100,(highest-18)/7*100))+'%"></span></div></div><div class="route-line">'+DAYS.map((a,i)=>'<div class="route-day '+(highest>=19+i?"passed":"")+'"><div class="route-date">DECEMBER '+a[0]+'　'+(i<=2?(highest>=19+i?"旅程记录":"尚未到达"):"后续未制作")+'</div><h3 class="route-place">'+a[1]+'</h3><div class="route-descr">'+a[2]+'</div></div>').join("")+'</div><div class="tile"><div class="label-caps">YOUR CHOICES</div><p>旅行同行：'+e(relationship())+'</p><p>去洞爷湖交通：'+e(transportLabel())+'</p><p>出发理由：'+e(state.flags.travel_reason||"还没填写")+'</p></div></div>';}
function relationship(){const x=state.flags.continue_intent;if(x==="accepted")return"已约定继续同行";if(x==="one_day")return"先同行一天";if(["declined","deferred","none"].includes(x))return"独立旅行";const m=state.flags.meet_plan;return m==="both"?"已约札幌晚饭和小樽":m==="trial"?"已约札幌晚饭":m==="otaru"?"只约小樽":"独自旅行";}
function transportLabel(){const m=state.flags.transport_mode;return m==="public"?"公共交通":m==="separate_arrival"?"各自抵达":m==="rental_check"?"租车待核验（默认改公共交通）":"尚未确定";}
function renderPhotos(){return '<div class="section"><div class="label-caps">PHOTO ARCHIVE</div><h1 class="section-title">旅行相册</h1><p class="section-sub">只有你实际选择拍摄或保留的照片才会收进相册。这些为氛围示意图，并非实际拍摄的照片。</p>'+(state.photos.length?'<div class="gallery">'+state.photos.map((p,i)=>'<button class="photo" data-act="photo" data-index="'+i+'" aria-label="查看'+e(p.title)+'"><img src="'+jpg(p.type)+'" alt="" loading="lazy"><span>DEC '+p.day+'<br>'+e(p.title)+'</span></button>').join("")+'</div>':'<div class="empty">FILM 00 / NO PHOTOS YET<br>照片还没拍。<br>继续旅行，在选项中选择拍照。</div>')+'</div>';}
function renderBag(){return '<div class="section"><div class="label-caps">SMALL THINGS, BIG DAYS</div><h1 class="section-title">随身物品</h1><p class="section-sub">购物只在你点击购买或领取后入袋。音乐盒、餐饮票据、摄影杂志都可以在这里查看。</p><div class="ticket"><div class="serial">BOARDING PASS · PERSONAL</div><h3>'+e(state.name)+' 的旅行票</h3><p>BEIJING → HOKKAIDO<br>DEC 19 — DEC 25 · 7D6N</p><span class="pill">只属于你的冬天</span></div>'+(state.items.length?state.items.map((t,i)=>'<div class="tile"><div class="label-caps">ITEM '+String(i+1).padStart(3,"0")+'</div><h3>'+e(t.name)+'</h3><p>'+e(t.desc)+'</p></div>').join(""):'<div class="empty">行李箱暂时还很空。<br>故事中获得的物品会出现在这里。</div>')+'</div>';}
function renderSave(){const played=state.choices.length;return '<div class="section"><div class="label-caps">PERSONAL JOURNAL</div><h1 class="section-title">'+e(state.name)+' 的旅行档案</h1><p class="section-sub">这是当前设备的本地存档。关闭页面后再打开，可以继续刚才的场景。不同浏览器或无痕模式不会自动同步。</p><div class="statrow"><span>目前场景</span><strong>'+e(currentScene().title)+'</strong></div><div class="statrow"><span>已作出的选择</span><strong>'+played+' 次</strong></div><div class="statrow"><span>保留的照片</span><strong>'+state.photos.length+' 张</strong></div><div class="statrow"><span>收集的物品</span><strong>'+state.items.length+' 件</strong></div><div class="statrow"><span>存档状态</span><strong>'+(!saveError?"已保存在本机":"浏览器存储不可用")+'</strong></div><div class="spacer"></div><button class="primary" data-act="back-to-story">继续当前剧情 →</button><div class="spacer"></div><div class="clickrow"><button class="ghost" data-act="export">导出存档 JSON ↓</button><button class="ghost" data-act="rename">修改称呼</button></div><div class="spacer"></div><label class="mini-btn" style="display:block;text-align:center" for="import-save">从 JSON 存档导入</label><input type="file" id="import-save" accept=".json,application/json" style="position:absolute;opacity:0;pointer-events:none;width:1px"><div class="divider"></div><div class="label-caps">TRAVEL NOTES / 已发生的片段</div>'+(state.journal.length?'<ol class="journal">'+state.journal.slice(-16).reverse().map(x=>'<li>'+e(x)+'</li>').join("")+'</ol>':'<p class="section-sub">故事开始以后，你的选择会被记在这里。</p>')+'<div class="divider"></div><button class="ghost" data-act="restart">重新开始（会清除本机存档）</button><p class="tiny">不会重置其他 GitHub 项目或网站。重开后名字需要重新输入。</p></div>';}
function navigation(){const tabs=[["story","剧情","read"],["map","行程","map"],["photos","相册","photos"],["bag","背包","bag"],["save","档案","save"]];return '<nav class="bottom" aria-label="游戏导航">'+tabs.map(([id,label,ic])=>'<button class="tab '+(state.page===id?"active":"")+'" data-act="tab" data-tab="'+id+'">'+icon(ic)+'<span>'+label+'</span></button>').join("")+'</nav>';}
function render(){if(!state.started){root.innerHTML='<div class="app">'+renderCover()+'</div>';return;}if(!state.boarded){root.innerHTML='<div class="app">'+window.TravelUX.boarding(state,e)+'</div>';return;}const screen=state.page==="story"?(state.pendingPhoto?window.TravelUX.camera(state,scenes,jpg,e):renderStory()):state.page==="map"?renderMap():state.page==="photos"?renderPhotos():state.page==="bag"?renderBag():renderSave();root.innerHTML='<div class="app"><header class="header"><div><div class="hdr-sub">HOKKAIDO / WINTER FILM</div><div class="brand">明天几点出发？</div></div><button class="small-btn" data-act="cover-info">ⓘ 说明</button></header><main class="screen" id="main-screen">'+screen+'</main>'+(state.pendingPhoto?"":navigation())+(openPhoto?'<div class="modal"><div class="modal-card"><button class="close" data-act="close-photo">✕ 关闭</button><img src="'+jpg(openPhoto.type)+'" alt="'+e(openPhoto.title)+'"><p>DEC '+openPhoto.day+' · '+e(openPhoto.title)+'</p><div class="tiny">视觉氛围图，仅作剧情照片示意。</div></div></div>':"")+'</div>';}
function storeSnapshot(){state.history.push({current:state.current,flags:JSON.parse(JSON.stringify(state.flags)),photos:state.photos.slice(),items:state.items.slice(),journal:state.journal.slice(),choices:state.choices.slice(),budget:state.budget});if(state.history.length>180)state.history.shift();}
function applyFX(fx){if(!fx)return;if(fx.set)Object.assign(state.flags,fx.set);if(fx.item&&!state.items.some(x=>x.name===fx.item.name&&x.desc===fx.item.desc)){if(fx.item.price){if(state.budget<fx.item.price)return;state.budget-=fx.item.price;}state.items.push(fx.item);}if(fx.photo&&!state.photos.some(x=>x.title===fx.photo.title))state.photos.push(fx.photo);if(fx.memory)state.journal.push(fx.memory);}
function choose(index,opts={}){const s=currentScene(),option=s.choices[index];if(!option||option.when&&!option.when(state))return;
if(!opts.finishPhoto&&option.fx?.photo&&!option.fx.photo.alreadyTaken){state.pendingPhoto={scene:s.id,index,frame:0,taken:false};persist();render();scrollTopMain();return;}
const fx=window.TravelUX.prepareFx(state,s,index,opts,option.fx);if(fx===null){toast("纪念品试玩预算不足");return;}
if(opts.finishPhoto)state.pendingPhoto=null;
storeSnapshot();applyFX(fx);state.choices.push({scene:s.id,text:option.text,date:"12月"+s.day+"日"});if(!fx?.memory)state.journal.push("12月"+s.day+"日 · "+option.text);
let to=typeof option.to==="function"?option.to(state):option.to;
if(to==="_archive"){state.page="save";state.current="toya_end";}else if(to==="_finish"){state.page="story";state.current="toya_end";}else if(scenes[to]){state.current=to;state.page="story";}
persist();render();scrollTopMain();}
function scrollTopMain(){const box=document.getElementById("main-screen");if(box)box.scrollTop=0;window.scrollTo(0,0);}
function goBack(){if(state.page!=="story"){state.page="story";render();return;}if(!state.history.length){toast("已经是序章开头");return;}const last=state.history.pop();Object.assign(state,{current:last.current,flags:last.flags,photos:last.photos,items:last.items,journal:last.journal,choices:last.choices,budget:last.budget??state.budget,pendingPhoto:null,page:"story"});persist();render();scrollTopMain();}
function doStart(){const el=document.getElementById("player-name");let name=(el?.value||"").trim().replace(/\s+/g," ");if(!name||name.length>16){const err=document.getElementById("name-error");if(err)err.textContent="请输入 1—16 个字的昵称";return;}state=initial();state.name=name;state.started=true;state.boarded=false;state.page="story";window.__loginOpen=false;state.journal.push(name+" 的北海道旅行开始了");persist();render();}
function exportSave(){const blob=new Blob([JSON.stringify(Object.assign({},state,{page:"story"}),null,2)],{type:"application/json;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="明天几点出发-存档.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),800);toast("存档已导出");}
function validateSave(z){return z&&typeof z.name==="string"&&z.name.length>0&&typeof z.current==="string"&&Boolean(scenes[z.current])&&Array.isArray(z.choices)&&Array.isArray(z.items)&&Array.isArray(z.photos)&&z.flags&&typeof z.flags==="object";}
root.addEventListener("click",(ev)=>{const button=ev.target.closest("[data-act]");if(!button)return;const act=button.dataset.act;if(window.TravelUX.action(act,button,{state,currentScene,persist,render,choose,toast}))return;if(act==="open-login"){window.__loginOpen=true;render();setTimeout(()=>document.getElementById("player-name")?.focus(),30);}else if(act==="close-login"){window.__loginOpen=false;render();}else if(act==="begin")doStart();else if(act==="pick")choose(Number(button.dataset.index));else if(act==="back")goBack();else if(act==="tab"){state.page=button.dataset.tab;render();scrollTopMain();}else if(act==="back-to-story"){state.page="story";render();}else if(act==="open-archive"){state.page="save";render();}else if(act==="photo"){openPhoto=state.photos[Number(button.dataset.index)];render();}else if(act==="close-photo"){openPhoto=null;render();}else if(act==="export")exportSave();else if(act==="rename"){const name=prompt("修改旅行册中的称呼（1—16字）",state.name);if(name&&name.trim()&&name.trim().length<=16){state.name=name.trim();persist();render();toast("旅行者名字已更新");}}else if(act==="restart"){if(confirm("重新开始会清除当前设备的游戏进度。建议先导出存档。确定继续吗？")){try{localStorage.removeItem(KEY);}catch(e){}state=initial();openPhoto=null;window.__loginOpen=true;render();}}else if(act==="cover-info"){alert("《明天几点出发？》固定剧情试玩版\n\n已接入：序章、12月19日札幌、12月20日小樽、12月21日洞爷湖开场与分支。\n12月22—25日尚未制作。\n\n没有AI自由生成。每条消息和选项均来自预设脚本；存档存在当前浏览器。");}});
window.TravelUX.bindGesture(root,{get state(){return state;},persist,render,scrollTopMain});
root.addEventListener("keydown",(ev)=>{if(ev.key==="Enter"&&document.activeElement?.id==="player-name"){ev.preventDefault();doStart();}if(ev.key==="Escape"&&openPhoto){openPhoto=null;render();}});
root.addEventListener("change",async(ev)=>{if(ev.target.id!=="import-save")return;const file=ev.target.files?.[0];if(!file)return;try{const z=JSON.parse(await file.text());if(!validateSave(z))throw Error("无效存档");if(!confirm("确定导入存档？当前本机进度会被替换。"))return;state=Object.assign(initial(),z,{started:true,boarded:true,page:"save",name:z.name.slice(0,16)});persist();render();toast("存档导入成功");}catch(e){toast("无法导入：存档文件无效");}});
render();
})();