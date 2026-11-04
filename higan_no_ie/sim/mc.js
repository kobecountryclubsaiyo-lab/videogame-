const {chromium}=require('playwright');
const FILE=process.argv[2]||'file:///home/user/videogame-/higan_no_ie/index.html';
const RUNS=+(process.argv[3]||20000);
(async()=>{
 const b=await chromium.launch();const pg=await b.newPage();
 const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>{errs.push('dialog:'+d.message());d.accept()});
 await pg.goto(FILE);
 const res=await pg.evaluate((RUNS)=>{
  render=()=>{};
  const COOP=new Set("introduce show_all letter_all ledger_all back near readpaper showpaper go_hall open open_read open_kimono confess prep share_diary room_read room_kimono showpaper_all search hanare noise rescue offer call shout".split(" "));
  const SECRET=new Set("hide watch block take burn restrain door nothing esc stay".split(" "));
  const PERS=["random","coop","secret"];
  const out={endings:{},goals:{},issues:{},issueEx:{},coverage:{},stats:{},missing:{},runs:0};
  const inc=(o,k,v=1)=>o[k]=(o[k]||0)+v;
  const issue=(k,ex)=>{inc(out.issues,k);if(!out.issueEx[k])out.issueEx[k]=ex};
  function pick(p,list,pers){
   if(pers==="random")return list[Math.floor(Math.random()*list.length)];
   const pref=pers==="coop"?COOP:SECRET;const good=list.filter(c=>pref.has(c.id));
   const L=(good.length&&Math.random()<0.8)?good:list;return L[Math.floor(Math.random()*L.length)];
  }
  for(let run=0;run<RUNS;run++){
   const n=4+(run%3);$("count").value=String(n);startGame();
   const mode=["allRandom","allCoop","allSecret","mixed","mixed"][run%5];
   const pers=S.players.map(()=>mode==="allRandom"?"random":mode==="allCoop"?"coop":mode==="allSecret"?"secret":PERS[Math.floor(Math.random()*3)]);
   let g=0,restrained=null,surechigai=false,introCount=0,introInfo="使わず";
   while(S.phase!=="end"&&g++<400){
    const ph=S.phase;
    if(ph==="intro")afterIntro();
    else if(ph==="talk")setQueue(S.turn===5?"pre":"select",S.players.map(p=>p.id));
    else if(ph==="preReveal"){const q=S.players.filter(isFree).map(p=>p.id);if(!q.length){issue("投票者0人",{n});break}setQueue("vote",q)}
    else if(S.qi<S.queue.length){
     const p=cur();
     if(ph==="private"){flush(p);nextInQueue()}
     else if(ph==="vote"){const ps_=pers[p.id];p.vote=ps_==="coop"?(Math.random()<.8?"okuri":"exit"):["okuri","exit","stay"][Math.floor(Math.random()*3)];nextInQueue()}
     else{const l=getChoices(p);if(!l.length){issue("選択肢なし",{role:p.role,ph,T:S.turn});break}
      const c=pick(p,l,pers[p.id]);p.choice=c;inc(out.coverage,"T"+(ph==="pre"?"5前半":ph==="owner"?"4a":S.turn)+" "+p.role+" "+c.id);
      if(ph==="owner"){flush(p);if(c.id==="restrain")restrained=c.t}
      if(c.id==="introduce"){introCount++;const pr=[S.players[c.t].role,S.players[c.t2].role].sort().join("+");introInfo=(S.phase==="pre"?"T5":"T"+S.turn)+"|"+pr}
      // 4bで大家が自分の閉じ込めた相手を助けに行く
      if(ph==="select"&&S.turn===4&&p.role==="大家"&&c.id==="hanare"&&restrained!=null)issue("大家が自分で閉じ込めた相手をすぐ助けに行ける",{});
      const before=S.players.filter(x=>!isFree(x)).length;
      nextInQueue();
     }
    } else {issue("進行停止",{ph});break}
   }
   if(S.phase!=="end"){issue("終わらない",{});continue}
   out.runs++;
   const f=S.f,w=byRole("妻"),h=byRole("夫");
   // 矛盾チェック
   if(!isFree(w)&&/妻が敷居をまたごうとした/.test(f.ending))issue("閉じ込められた妻が玄関の敷居をまたぐ描写になる",{policy:f.policy});
   if(!isFree(w)&&/妻の方を振り返った/.test(f.ending))issue("送り成功時、離れにいる妻を篠が振り返る描写になる",{});
   if(f.husbandHold&&isFree(h)&&h.outcome!==w.outcome&&!f.success)issue("夫が手を離さないのに妻と結末が違う",{h:h.outcome,w:w.outcome,policy:f.policy});
   if(false)issue("票割れのとき『手を離さない』が効かない（夫婦とも飲み込まれる）",{});
   if(f.wifeAnswer&&!f.success&&w.outcome!=="stay")issue("妻が『母の声に応える』を選んでも票割れでは『飲み込まれる』扱い",{});
   S.players.forEach(p=>{
    if(!f.success&&!isFree(p)&&p.outcome==="escape")issue("閉じ込められた人が脱出扱い",{role:p.role});
    if(p.outcome==="left"&&isFree(p))issue("自由なのに取り残され扱い",{role:p.role});
    const txt=p.notes.join("\n");
    if(n<6&&/友人B/.test(txt))issue("いない友人Bが文章に出る",{});
    if(n<5&&/友人A/.test(txt))issue("いない友人Aが文章に出る",{});
   });
   if(introCount>1)issue("引き合わせが2回以上使えた",{introCount});
   const A=byRole("友人A");if(A){const ok=goalMet(A);const pairOK=/妻\+尋ね人|尋ね人\+妻/.test(introInfo)?"妻と尋ね人":introInfo==="使わず"?"使わず":"別の組";inc(out.stats,"A|"+pairOK+"|試行");if(ok)inc(out.stats,"A|"+pairOK+"|達成");if(pairOK==="妻と尋ね人"){const tt=introInfo.split("|")[0];inc(out.stats,"A時期|"+tt+"|試行");if(ok)inc(out.stats,"A時期|"+tt+"|達成")}
    inc(out.stats,"A|妻kin",has(byRole("妻"),"kin")?1:0);inc(out.stats,"A|尋ねkin",has(byRole("尋ね人"),"kin")?1:0);inc(out.stats,"A|A人数",1)}
   // 派生の取りこぼし
   const keysBefore=S.players.map(p=>p.keys.size);derive();if(S.players.some((p,i)=>p.keys.size!==keysBefore[i]))issue("終了時点で推理の反映漏れ（派生の遅れ）",{});
   if(f.offered&&f.offerer!=null&&!isFree(S.players[f.offerer])&&false)issue("x",{});
   if(f.prepared&&!f.preparers.every(i=>has(S.players[i],"method")))issue("方法を知らない人が支度",{});
   // 統計
   const key=n+"人|"+mode+"|"+(f.success?"送り成功":{okuri:"送り失敗",exit:"このまま出る",stay:"残る",split:"票割れ"}[f.policy]);
   inc(out.endings,key);
   S.players.forEach(p=>{inc(out.goals,n+"人|"+p.role+"|試行");if(goalMet(p))inc(out.goals,n+"人|"+p.role+"|達成")});
   inc(out.stats,"壁が開いた",f.wallOpen?1:0);inc(out.stats,"訳が語られた",f.truthPublic?1:0);
   inc(out.stats,"日記が燃やされた",f.diaryBurned?1:0);
   inc(out.stats,"妻が自分の正体を知った",has(w,"identity")?1:0);
   inc(out.stats,"すれ違い発生",S.pub.some(x=>/すれ違い/.test(x))?1:0);
   inc(out.stats,"最後まで閉じ込められた人がいた",S.players.some(p=>p.outcome==="left")?1:0);
   if(f.policy==="okuri"&&!f.success){const nameOK=f.called||[f.offerer,...f.preparers].filter(x=>x!=null).some(i=>has(S.players[i],"name"));
     const m=[!f.prepared&&"支度",!f.offered&&"写真",!nameOK&&"名",!f.truthPublic&&"訳"].filter(Boolean).join("+");inc(out.missing,n+"人|"+m)}
  }
  return out;
 },RUNS);
 console.log(JSON.stringify({errs:errs.slice(0,5),...res}));
 await b.close();
})();
