// 協力度 p（0=ランダム、1=常に協力的）で通しプレイし、人数×役割の達成率を出す
// 使い方: node mid.js <index.htmlのURL> <回数> <p...>
const {chromium}=require('playwright');
const FILE=process.argv[2],RUNS=+(process.argv[3]||12000),PS=(process.argv.slice(4).length?process.argv.slice(4):["0.5"]).map(Number);
(async()=>{const b=await chromium.launch();const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));await pg.goto(FILE);
for(const P of PS){
const r=await pg.evaluate(([RUNS,P])=>{render=()=>{};
 const COOP=new Set("introduce show_all letter_all ledger_all back near readpaper showpaper go_hall open open_read open_kimono confess prep share_diary share_note room_read room_kimono showpaper_all search hanare noise wait rescue offer call reveal".split(" "));
 const g={},inc=(k)=>g[k]=(g[k]||0)+1;
 for(let run=0;run<RUNS;run++){const n=4+run%3;$("count").value=String(n);startGame();let k=0;
  while(S.phase!=="end"&&k++<400){const ph=S.phase;if(ph==="intro")afterIntro();else if(ph==="talk")setQueue(S.turn===5?"pre":"select",S.players.map(p=>p.id));else if(ph==="preReveal")setQueue("vote",S.players.filter(isFree).map(p=>p.id));
   else{const p=cur();if(ph==="private"){flush(p);nextInQueue()}else if(ph==="vote"){p.vote=Math.random()<P?"okuri":["okuri","exit","stay"][Math.floor(Math.random()*3)];nextInQueue()}
   else{let l=getChoices(p);const coop=Math.random()<P;
    if(coop){const intro=l.filter(c=>c.id==="introduce"&&[S.players[c.t].role,S.players[c.t2].role].sort().join()==["妻","尋ね人"].sort().join());l=l.filter(c=>c.id!=="introduce").concat(intro);const gd=l.filter(c=>COOP.has(c.id));if(gd.length)l=gd}
    p.choice=l[Math.floor(Math.random()*l.length)];if(ph==="owner")flush(p);nextInQueue()}}}
  inc(n+"|runs");if(S.f.success)inc(n+"|success");S.players.forEach(p=>{if(goalMet(p))inc(n+"|"+p.role)});}
 return g;},[RUNS,P]);
 const R=["大家","夫","妻","尋ね人","友人A","友人B"];
 for(const n of [4,5,6]){const t=r[n+"|runs"];console.log("p="+P,n+"人",R.filter(x=>R.indexOf(x)<n).map(x=>x+" "+Math.round(100*(r[n+"|"+x]||0)/t)+"%").join("  ")," 送り成功 "+Math.round(100*(r[n+"|success"]||0)/t)+"%")}
}
if(errs.length)console.log("ERR",errs.slice(0,3));await b.close();})();
