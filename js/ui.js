/* ================= HELPERS ================= */
const $=s=>document.querySelector(s);
const instName=id=>(institutions.find(i=>i.id===id)||{}).name||"";
const mt=n=>n+" "+CONFIG.currency;
// Build the WhatsApp purchase link (one place only)
function waLink(p){
 const msg=`Olá! Quero comprar o material ${p.title} (${instName(p.institutionId)}) do MOZ STUDENT HUB. Preço: ${mt(p.price)}.`;
 return "https://wa.me/"+CONFIG.whatsapp+"?text="+encodeURIComponent(msg);
}
function productCard(p){
 return `<article class="card">
  <div class="row"><span class="tag">${p.subject}</span>${p.demo?'<span class="tag d">DEMO/EXEMPLO</span>':""}</div>
  <h3><a href="#/material/${p.id}">${p.title}</a></h3>
  <p>${instName(p.institutionId)} · ${p.type}</p>
  <div class="price">${mt(p.price)}</div>
  <div class="row"><a class="btn sm" href="${waLink(p)}" target="_blank" rel="noopener">Comprar</a><a class="btn sm s" href="#/material/${p.id}">Detalhes</a></div>
 </article>`;
}
const head=(t,s)=>`<h1>${t}</h1><p style="color:var(--mut);max-width:40rem">${s}</p>`;
const empty=m=>`<div class="empty">${m}</div>`;

/* ================= PAGES (each returns [title, html, afterRender]) ================= */
const pages={
 home:()=>["",`
 <div class="hero"><div class="w"><div>
  <h1>MOZ STUDENT HUB</h1>
  <p style="font-size:1.25rem;font-weight:600">Tudo o que precisas para estudar, preparar-te e avançar.</p>
  <p>Encontra materiais de preparação, exames anteriores, simulados, oportunidades e recursos educativos, num só lugar.</p>
  <div class="row"><a class="btn" href="#/materiais">Explorar materiais</a><a class="btn s" href="#/instituicoes">Ver instituições</a></div>
 </div>
 <div class="fl" aria-hidden="true">${products.slice(0,3).map(p=>`<div class="fc"><b>${p.title}</b><small>${mt(p.price)} · DEMO</small></div>`).join("")}</div></div></div>
 <section><div class="w"><h2>Procura por disciplina</h2>
  <div class="cats">${categories.map(c=>`<a href="#/materiais?s=${encodeURIComponent(c)}">${c}</a>`).join("")}</div></div></section>
 <section><div class="w"><h2>Como comprar</h2><ol class="steps">
  <li class="card"><h3>Escolhe o material</h3><p>Filtra por instituição e disciplina.</p></li>
  <li class="card"><h3>Clica em Comprar</h3><p>Abre-se uma mensagem pronta no WhatsApp.</p></li>
  <li class="card"><h3>Combina o pagamento</h3><p>Falas diretamente com o vendedor.</p></li></ol>
  <p class="note">Todos os materiais mostrados nesta versão são exemplos (DEMO). Não são documentos oficiais.</p></div></section>`],
 instituicoes:()=>["Instituições",`<section><div class="w">${head("Instituições","Escolhe uma instituição e vê os materiais ligados a ela.")}
  <div class="tools"><input id="q" type="search" placeholder="Pesquisar instituição" aria-label="Pesquisar instituição"></div>
  <div id="list" class="grid" aria-live="polite"></div></div></section>`,()=>{
  const draw=()=>{const v=$("#q").value.trim().toLowerCase();
   const r=institutions.filter(i=>i.name.toLowerCase().includes(v));
   $("#list").innerHTML=r.length?r.map(i=>`<article class="card"><span class="tag">${i.category}</span><h3>${i.name}</h3><p>${i.description}</p>
    <a class="btn sm s" href="#/materiais?i=${i.id}">Ver materiais</a></article>`).join(""):empty("Nenhuma instituição encontrada. Tenta outro nome.");};
  $("#q").oninput=draw;draw();}],
 materiais:(qs)=>["Materiais",`<section><div class="w">${head("Materiais","Materiais de estudo e preparação a preços acessíveis.")}
  <p class="note">Versão de demonstração: os produtos são exemplos (DEMO).</p>
  <div class="tools"><input id="q" type="search" placeholder="Pesquisar material" aria-label="Pesquisar material">
  <select id="fi" aria-label="Instituição"><option value="">Todas as instituições</option>${institutions.map(i=>`<option value="${i.id}">${i.name}</option>`).join("")}</select>
  <select id="fs" aria-label="Disciplina"><option value="">Todas as disciplinas</option>${categories.map(c=>`<option>${c}</option>`).join("")}</select>
  <select id="fp" aria-label="Preço"><option value="">Qualquer preço</option><option value="100">Até 100 MT</option><option value="150">Até 150 MT</option></select></div>
  <div id="list" class="grid" aria-live="polite"></div></div></section>`,()=>{
  $("#fi").value=qs.get("i")||"";$("#fs").value=qs.get("s")||"";
  const draw=()=>{const v=$("#q").value.trim().toLowerCase(),i=$("#fi").value,s=$("#fs").value,pr=+$("#fp").value||1e9;
   const r=products.filter(p=>(!v||p.title.toLowerCase().includes(v))&&(!i||p.institutionId===i)&&(!s||p.subject===s)&&p.price<=pr);
   $("#list").innerHTML=r.length?r.map(productCard).join(""):empty("Nenhum material encontrado. Limpa os filtros e tenta de novo.");};
  ["#q","#fi","#fs","#fp"].forEach(x=>$(x).oninput=draw);draw();}],
 material:(qs,id)=>{const p=products.find(x=>x.id===id);
  if(!p)return["Material não encontrado",`<section><div class="w">${empty('Este material não existe. <a href="#/materiais">Ver todos os materiais</a>')}</div></section>`];
  return[p.title,`<section><div class="w two"><div>
  <a href="#/materiais">‹ Todos os materiais</a>
  <div class="row" style="margin-top:.8rem"><span class="tag">${p.subject}</span>${p.demo?'<span class="tag d">DEMO/EXEMPLO</span>':""}</div>
  <h1>${p.title}</h1><p>${instName(p.institutionId)} · ${p.type}</p><p>${p.description}</p>
  <h2 style="font-size:1.2rem">O que inclui</h2><ul>${p.includes.map(x=>`<li>${x}</li>`).join("")}</ul></div>
  <aside class="card"><div class="price" style="font-size:2rem">${mt(p.price)}</div>
   <a class="btn wa" href="${waLink(p)}" target="_blank" rel="noopener">Comprar pelo WhatsApp</a>
   <p>Compra simples: abre o WhatsApp com a mensagem pronta e falas direto com o vendedor.</p></aside></div></section>`];},
 simulados:()=>["Simulados",`<section><div class="w">${head("Simulados","Em breve: simulados online para treinares com tempo, perguntas e correção. Esta área ainda não está ativa.")}
  <div class="grid" style="margin-top:1.4rem">${quizzes.map(q=>`<article class="card"><span class="tag d">DEMO · Em breve</span><h3>${q.t}</h3><p>${q.q} (exemplo)</p><button class="btn sm s" disabled>Em breve</button></article>`).join("")}</div></div></section>`],
 oportunidades:()=>["Oportunidades",`<section><div class="w">${head("Oportunidades","Bolsas, candidaturas, cursos e estágios, num só sítio. Por agora, apenas entradas de exemplo.")}
  <div class="grid" style="margin-top:1.4rem">${opportunities.map(o=>`<article class="card"><div class="row"><span class="tag">${o.kind}</span><span class="tag d">DEMO/EXEMPLO</span></div><h3>${o.title}</h3><p>${o.text}</p></article>`).join("")}</div></div></section>`],
 sobre:()=>["Sobre",`<section><div class="w" style="max-width:720px">${head("Sobre o MOZ STUDENT HUB","")}
  <h2>O que é</h2><p>Uma plataforma para estudantes moçambicanos encontrarem materiais de estudo, preparação e oportunidades num só lugar.</p>
  <h2>Para quem é</h2><p>Para quem prepara exames de ingresso, estuda no ensino secundário ou procura caminhos para continuar a estudar.</p>
  <h2>Porque existe</h2><p>Encontrar bons materiais não devia ser difícil nem caro. Começamos simples, com compra pelo WhatsApp, e vamos crescer com o que os estudantes precisarem.</p></div></section>`],
 contactos:()=>["Contactos",`<section><div class="w">${head("Contactos","Fala connosco. Respondemos pelo WhatsApp.")}
  <div class="grid" style="margin-top:1.4rem">
  <article class="card"><h3>WhatsApp</h3><p>Dúvidas e compras.</p><a class="btn wa" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre o MOZ STUDENT HUB.")}" target="_blank" rel="noopener">Falar no WhatsApp</a></article>
  <article class="card"><h3>Facebook</h3><p>Novidades e avisos.</p><a class="btn s" href="${CONFIG.facebook}" target="_blank" rel="noopener">Abrir Facebook</a></article>
  <article class="card"><h3>Email</h3><p>${CONFIG.email} (exemplo)</p><a class="btn s" href="mailto:${CONFIG.email}">Enviar email</a></article></div></div></section>`]
};

