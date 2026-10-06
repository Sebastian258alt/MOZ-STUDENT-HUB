// Quiz list + quiz runner. Demo questions only.
pages.simulados=()=>["Simulados",`<section><div class="w">${head("Simulados","Treina com perguntas de exemplo (DEMO). Não são exames oficiais.")}
 <div class="grid" style="margin-top:1.4rem">${quizzes.length?quizzes.map(q=>`<article class="card"><span class="tag d">DEMO</span><h3>${q.title}</h3><p>${q.subject||""} · ${q.duration_minutes} min</p><a class="btn sm" href="#/simulado/${q.id}">Começar simulado</a></article>`).join(""):empty("Ainda não há simulados disponíveis.")}</div></div></section>`];
pages.simulado=(qs,id)=>{const q=quizzes.find(x=>x.id===id);
 if(!q)return["Simulado",`<section><div class="w">${empty('Este simulado não existe. <a href="#/simulados">Ver simulados</a>')}</div></section>`];
 return[q.title,`<section><div class="w"><a href="#/simulados">‹ Simulados</a><div id="qz" style="margin-top:1rem"><div class="sk"></div></div></div></section>`,()=>runQuiz(q)];};
async function runQuiz(q){
 let qs=q.questions; // local demo quizzes carry their own questions
 if(!qs){const r=await sb.from("questions").select("*").eq("quiz_id",q.id).order("order_number");
  if(r.error||!r.data.length){$("#qz").innerHTML=empty(r.error?"Não foi possível carregar as perguntas. Tenta de novo.":"Este simulado ainda não tem perguntas.");return;}
  qs=r.data;}
 const L=["a","b","c","d"];let i=0,ans=[],t0=new Date();
 const start=()=>{i=0;ans=[];$("#qz").innerHTML=`<h1>${q.title}</h1><p>${q.description||""}</p><p>${qs.length} perguntas · ${q.duration_minutes} min (tempo de referência)</p><button class="btn" id="go">Começar simulado</button>`;$("#go").onclick=()=>{t0=new Date();show();};};
 const show=()=>{const x=qs[i];
  $("#qz").innerHTML=`<p>Pergunta ${i+1} de ${qs.length}</p><fieldset style="border:0;padding:0"><legend><h2>${x.question}</h2></legend>${L.map(l=>`<label class="opt"><input type="radio" name="o" value="${l}" ${ans[i]===l?"checked":""}><span>${x["option_"+l]}</span></label>`).join("")}</fieldset>
  <div class="row" style="margin-top:1rem">${i?'<button class="btn s" id="pv">Anterior</button>':""}<button class="btn" id="nx">${i<qs.length-1?"Seguinte":"Ver resultado"}</button></div><p id="qm" role="alert"></p>`;
  document.querySelectorAll("[name=o]").forEach(r=>r.onchange=()=>{ans[i]=r.value;});
  if(i)$("#pv").onclick=()=>{i--;show();};
  $("#nx").onclick=()=>{if(!ans[i]){$("#qm").textContent="Escolhe uma resposta para continuar.";return;}i<qs.length-1?(i++,show()):finish();};};
 const finish=async()=>{
  const score=qs.filter((x,k)=>ans[k]===x.correct_option).length,pct=Math.round(score*100/qs.length),save=currentUser&&catalogSource==="db";
  $("#qz").innerHTML=`<h1>${score} de ${qs.length} (${pct}%)</h1><p id="sv">${save?"A guardar o resultado...":'Entra na tua conta para guardar os resultados. <a href="#/entrar">Entrar</a>'}</p>
  ${qs.map((x,k)=>{const ok=ans[k]===x.correct_option;return `<div class="card" style="margin:.8rem 0"><b>${k+1}. ${x.question}</b><p>A tua resposta: ${x["option_"+ans[k]]} ${ok?"✔":"✘"}</p>${ok?"":`<p>Resposta certa: ${x["option_"+x.correct_option]}</p>`}<p>${x.explanation||""}</p></div>`;}).join("")}
  <div class="row"><button class="btn" id="rs">Recomeçar</button><a class="btn s" href="#/simulados">Outros simulados</a></div>`;
  $("#rs").onclick=start;
  if(save){const sv=$("#sv"),{error}=await sb.from("quiz_attempts").insert({user_id:currentUser.id,quiz_id:q.id,score,total_questions:qs.length,started_at:t0.toISOString()});
   sv.textContent=error?"Não foi possível guardar o resultado. Tenta de novo mais tarde.":"Resultado guardado no teu painel.";}};
 start();
}
