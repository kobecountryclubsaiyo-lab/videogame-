// 個人目的の候補条件を、同じ試行の中で比較する
const {chromium}=require('playwright');
const FILE=process.argv[2],RUNS=+(process.argv[3]||12000),PS=process.argv.slice(4).map(Number);
(async()=>{const b=await chromium.launch();const pg=await b.newPage();await pg.goto(FILE);
for(const P of PS){
const r=await pg.evaluate(([RUNS,P])=>{render=()=>{};
 const COOP=new Set("introduce show_all letter_all ledger_all back near readpaper showpaper go_hall open open_read open_kimono confess prep share_diary share_note room_read room_kimono showpaper_all search hanare noise wait rescue offer call".split(" "));
 const grp=o=>o==="escape"?"外":o==="lost"?"飲":"家";
 const C={
  "大家O13":(p,f)=>f.success||(p.outcome==="escape"&&!f.truthPublic)||(p.outcome==="escape"&&f.ownerConfessed&&!f.ownerRestrained&&f.prepared),
  "大家O19 先に自白版":(p,f)=>f.success||(p.outcome==="escape"&&!f.truthPublic)||(p.outcome==="escape"&&f.confessEarly&&!f.ownerRestrained&&f.prepared),
  "大家O20 自白&閉込なし&支度&取残なし":(p,f)=>f.success||(p.outcome==="escape"&&!f.truthPublic)||(p.outcome==="escape"&&f.ownerConfessed&&!f.ownerRestrained&&f.prepared&&f.called),
  "夫H22 同じ|(娘の名&篠&そば/手)":(p,f,w)=>grp(p.outcome)===grp(w.outcome)||(has(p,"yukiName")&&has(p,"name")&&p.history.some(h=>/妻のそば|妻の手/.test(h))),
  "夫H23 同じ|(娘の名&篠&妻が取残されず&第4か5でそば/手)":(p,f,w)=>grp(p.outcome)===grp(w.outcome)||(has(p,"yukiName")&&has(p,"name")&&w.outcome!=="left"&&p.history.some(h=>/第[45].*(妻のそば|妻の手)/.test(h))),
 };
 const roleOf={"大家":"大家","妻":"妻","尋":"尋ね人","夫":"夫","B":"友人B","A":"友人A"};
 const g={},inc=k=>g[k]=(g[k]||0)+1;
 for(let run=0;run<RUNS;run++){const n=4+run%3;$("count").value=String(n);startGame();let k=0;
  while(S.phase!=="end"&&k++<400){const ph=S.phase;if(ph==="intro")afterIntro();else if(ph==="talk")setQueue(S.turn===5?"pre":"select",S.players.map(p=>p.id));else if(ph==="preReveal")setQueue("vote",S.players.filter(isFree).map(p=>p.id));
   else{const p=cur();if(ph==="private"){flush(p);nextInQueue()}else if(ph==="vote"){p.vote=Math.random()<P?"okuri":["okuri","exit","stay"][Math.floor(Math.random()*3)];nextInQueue()}
   else{let l=getChoices(p);if(Math.random()<P){const intro=l.filter(c=>c.id==="introduce"&&[S.players[c.t].role,S.players[c.t2].role].sort().join()==["妻","尋ね人"].sort().join());l=l.filter(c=>c.id!=="introduce").concat(intro);const gd=l.filter(c=>COOP.has(c.id));if(gd.length)l=gd}
    p.choice=l[Math.floor(Math.random()*l.length)];if(ph==="owner")flush(p);nextInQueue()}}}
  inc(n+"|runs");const w=byRole("妻");
  for(const [name,fn] of Object.entries(C)){const pref=name.startsWith("大家")?"大家":name[0]==="妻"?"妻":name[0]==="尋"?"尋":name[0]==="夫"?"夫":name[0];const p=byRole(roleOf[pref]);if(p&&fn(p,S.f,w))inc(n+"|"+name)}}
 return {g,names:Object.keys(C)};},[RUNS,P]);
 console.log("== 協力度 p="+P);
 for(const nm of r.names)console.log(nm.padEnd(30),[4,5,6].map(n=>{const t=r.g[n+"|runs"];const v=r.g[n+"|"+nm];return n+"人 "+(v==null?(nm[0]==="A"&&n<5||nm[0]==="B"&&n<6?" -":"0%"):Math.round(100*v/t)+"%")}).join("  "));
}
await b.close();})();
