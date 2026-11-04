const {chromium}=require('playwright');
const FILE=process.argv[2];
(async()=>{
 const b=await chromium.launch();const pg=await b.newPage();pg.on('pageerror',e=>console.log('ERR',e.message));
 await pg.goto(FILE);
 const res=await pg.evaluate(()=>{
  render=()=>{};
  const OWN=["協力","隠す","持ち出して燃やす","妻を閉じ込める","尋ね人を閉じ込める"];
  const BOUND=["esc","wait","noise"];
  const RESC=["救出に行く","救出に行かない"];
  const rows=[];
  for(const n of [4,5,6])for(const ov of OWN)for(const bc of BOUND)for(const rs of RESC){
   $("count").value=String(n);startGame();let g=0;
   const pickO=(p,l)=>{const T=S.turn,ph=S.phase,f=(...ids)=>{for(const id of ids){const c=l.find(c=>c.id===id&&(c.t==null||!c.want||true));if(c)return c}return l[l.length-1]};
    if(ph==="owner"){
     if(ov==="協力")return f("confess");
     if(ov==="妻を閉じ込める")return l.find(c=>c.id==="restrain"&&S.players[c.t].role==="妻");
     if(ov==="尋ね人を閉じ込める")return l.find(c=>c.id==="restrain"&&S.players[c.t].role==="尋ね人");
     if(ov==="持ち出して燃やす")return f("burn","nothing");
     return f("nothing");}
    if(ph==="pre")return ov==="協力"?f("prep","call","nothing"):f("nothing");
    if(T===1)return f(ov==="協力"?"ledger_all":"watch");
    if(T===2)return f(ov==="協力"?"go_hall":"block");
    if(T===3)return f(ov==="協力"?"open":ov==="持ち出して燃やす"?"take":"block");
    if(T===4)return f(ov==="協力"&&has(p,"method")?"prep":"watch");
   };
   const pickP=(p,l)=>{const T=S.turn,ph=S.phase,f=(...ids)=>{for(const id of ids){const c=l.find(c=>c.id===id);if(c)return c}return l.find(c=>c.id==="watch"||c.id==="nothing")||l[0]};
    const r=p.role,anyBound=S.players.some(x=>!isFree(x));
    if(T===1&&ph==="select")return r==="妻"?f("show_all"):r==="尋ね人"?f("letter_all"):r==="夫"?f("near"):r==="友人A"?f("butsuma"):f("readpaper");
    if(T===2)return f("go_hall");
    if(T===3)return r==="妻"?f("open_kimono"):f("open_read");
    if(T===4&&ph==="select"){
     if(!isFree(p))return f(bc);
     // 救出担当：夫（妻が閉じ込められたら）、それ以外は友人A→夫
     const rescuer=(rs==="救出に行く")&&anyBound&&(r===(byRole("妻").status!=="free"?"夫":(byRole("友人A")?"友人A":"夫")));
     if(rescuer)return f("hanare");
     return f("share_diary","share_note","prep","room_read","room_kimono","search","showpaper_all","watch");
    }
    if(ph==="pre"){
     if(!isFree(p))return f("shout");
     const free=S.players.filter(isFree);
     if(anyBound&&rs==="救出に行く"&&p===free.find(x=>x.role!=="大家"&&S.f.photoHolder!==x.id))return f("rescue");
     if(S.f.photoHolder===p.id)return f("offer");
     return f("share_diary","share_note","prep","call","nothing");
    }
   };
   while(S.phase!=="end"&&g++<400){const ph=S.phase;
    if(ph==="intro")afterIntro();else if(ph==="talk")setQueue(S.turn===5?"pre":"select",S.players.map(p=>p.id));
    else if(ph==="preReveal")setQueue("vote",S.players.filter(isFree).map(p=>p.id));
    else{const p=cur();if(ph==="private"){flush(p);nextInQueue()}else if(ph==="vote"){p.vote=(p.role==="大家"&&ov!=="協力")?"exit":"okuri";nextInQueue()}
     else{const l=getChoices(p);p.choice=(p.role==="大家"?pickO:pickP)(p,l)||l[0];if(ph==="owner")flush(p);nextInQueue()}}}
   const f=S.f,nameOK=f.called||[f.offerer,...f.preparers].filter(x=>x!=null).some(i=>has(S.players[i],"name"));
   const miss=[!f.prepared&&"支度",!f.offered&&"写真",!nameOK&&"名",!f.truthPublic&&"訳"].filter(Boolean).join("+");
   rows.push([n+"人",ov,bc,rs,f.success?"成功":"失敗("+(miss||f.policy)+")",S.players.map(p=>p.role[0]+(p.outcome==="escape"?"○":"×")+(goalMet(p)?"★":"")).join(" ")]);
  }
  return rows;
 });
 const seen=new Map();res.forEach(r=>{const k=[r[0],r[1],r[4]].join("|");seen.set(k,(seen.get(k)||[]).concat(r[2]+"/"+r[3]))});
 for(const [k,v] of seen)console.log(k.padEnd(40),v.length+"通り");
})().then(()=>process.exit());
