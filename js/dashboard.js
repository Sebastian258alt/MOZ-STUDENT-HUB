// Student dashboard: favourites, order requests, quiz stats.
pages.dashboard=()=>["Painel",`<section><div class="w"><h1 id="dh">Bem-vindo de volta</h1><div id="db" class="grid"><div class="sk"></div><div class="sk"></div><div class="sk"></div><div class="sk"></div></div></div></section>`,async()=>{
 $("#dh").innerHTML="Bem-vindo de volta, "+esc((profile?.full_name||currentUser.email||"").split(" ")[0]);
 // RLS makes every query below return only this user's rows
 const r=await Promise.all([
  sb.from("orders").select("status,created_at,products(title)").order("created_at",{ascending:false}).limit(20),
  sb.from("favorites").select("product_id").order("created_at",{ascending:false}),
  sb.from("quiz_attempts").select("score,total_questions,percentage,completed_at,quizzes(title)").order("completed_at",{ascending:false}).limit(50),
  sb.from("user_progress").select("subject,quizzes_completed,average_score")]);
 if(r.some(x=>x.error)){$("#db").outerHTML=empty("Não foi possível carregar o teu painel. Atualiza a página e tenta de novo.");return;}
 const [o,f,a,p]=r.map(x=>x.data),pc=a.map(x=>+x.percentage),st={pending:"Pedido pendente",confirmed:"Confirmado",cancelled:"Cancelado"};
 const fav=f.map(x=>products.find(y=>y.id===x.product_id)).filter(Boolean),rec=products.filter(x=>!favs.has(x.id)).slice(0,3);
 const stat=(i,t,v)=>`<div class="card"><span aria-hidden="true">${i}</span><div class="stat">${v}</div><p>${t}</p></div>`;
 const ul=(l,m)=>l.length?`<ul>${l.map(x=>`<li>${x}</li>`).join("")}</ul>`:`<p>${m}</p>`;
 const act=[...o.map(x=>({d:x.created_at,t:`${st[x.status]}: ${x.products?.title||"material"}`})),...a.map(x=>({d:x.completed_at,t:`Simulado ${x.quizzes?.title||""}: ${x.score}/${x.total_questions}`}))].sort((x,y)=>y.d>x.d?1:-1).slice(0,5).map(x=>x.t);
 const avg=pc.length?Math.round(pc.reduce((s,x)=>s+x,0)/pc.length)+"%":"–";
 $("#db").outerHTML=`<div class="grid">${stat("📚","Meus materiais (confirmados)",o.filter(x=>x.status==="confirmed").length)}${stat("🧠","Meus simulados",a.length)}${stat("❤️","Favoritos",fav.length)}${stat("📊","Meu progresso (média)",avg)}</div>
 <div class="row" style="margin:1.5rem 0"><a class="btn" href="#/materiais">Ver materiais</a><a class="btn s" href="#/simulados">Começar simulado</a><a class="btn s" href="#/perfil">Editar perfil</a></div>
 <h2>Atividade recente</h2>${ul(act,"Ainda não tens atividade.")}
 <h2>Meu progresso</h2><p>Último: ${pc.length?Math.round(pc[0])+"%":"–"} · Melhor: ${pc.length?Math.round(Math.max(...pc))+"%":"–"} · Concluídos: ${a.length}</p>${ul(p.map(x=>`${esc(x.subject)}: ${x.quizzes_completed} simulado(s), média ${Math.round(x.average_score)}%`),"Faz um simulado para ver o teu progresso.")}
 <h2>Favoritos</h2>${fav.length?`<div class="grid">${fav.map(productCard).join("")}</div>`:"<p>Ainda não guardaste nenhum material.</p>"}
 <h2 style="margin-top:1.5rem">Meus pedidos</h2>${ul(o.map(x=>`${esc(x.products?.title||"Material")}: ${st[x.status]}`),"Ainda não fizeste pedidos.")}
 <h2 style="margin-top:1.5rem">Recomendados</h2><div class="grid">${rec.map(productCard).join("")}</div>`;
}];
