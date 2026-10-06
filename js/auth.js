// Authentication, favourites and order requests.
let currentUser=null,profile=null,favs=new Set();
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),3500);}
const authMsg=e=>({"Invalid login credentials":"Email ou palavra-passe incorretos.","User already registered":"Já existe uma conta com este email.","Email not confirmed":"Confirma o teu email antes de entrar."}[e.message]||(/password/i.test(e.message)?"A palavra-passe deve ter pelo menos 6 caracteres.":"Algo correu mal. Tenta de novo."));
function renderAuthNav(){$("#authnav").innerHTML=!sb?"":currentUser?'<a href="#/dashboard">Painel</a> <a href="#/perfil">Perfil</a> <a href="#" id="lo">Terminar sessão</a>':'<a href="#/entrar">Entrar</a>';}
async function loadUserData(){
 const [f,p]=await Promise.all([sb.from("favorites").select("product_id"),sb.from("profiles").select("*").eq("id",currentUser.id).maybeSingle()]);
 favs=new Set((f.data||[]).map(x=>x.product_id));profile=p.data;
}
async function initAuth(){
 if(!sb){renderAuthNav();return;}
 try{const {data}=await sb.auth.getSession();currentUser=data.session?.user||null;if(currentUser)await loadUserData();}catch(e){console.error(e);}
 renderAuthNav();
 // setTimeout avoids calling Supabase inside its own auth callback (can deadlock)
 sb.auth.onAuthStateChange((ev,s)=>setTimeout(async()=>{
  const was=currentUser;currentUser=s?.user||null;
  if(ev==="SIGNED_IN"&&!was){await loadUserData();renderAuthNav();location.hash==="#/entrar"?location.hash="#/dashboard":route();}
  if(ev==="SIGNED_OUT"){favs=new Set();profile=null;renderAuthNav();toast("Sessão terminada.");location.hash==="#/"?route():location.hash="#/";}
 },0));
}
function buyNote(){return currentUser?"O teu pedido fica guardado no painel. Não é um pagamento: combinas o pagamento com o vendedor.":'Podes comprar sem conta. <a href="#/entrar">Entra</a> para acompanhar o teu pedido.';}
function favBtn(id){const on=favs.has(id);return `<button class="fav" data-fav="${id}" aria-pressed="${on}">${on?"Guardado":"Guardar"}</button>`;}
async function toggleFav(id,btn){
 if(!currentUser){toast("Entra na tua conta para guardar favoritos.");return;}
 if(catalogSource!=="db"){toast("Favoritos ficam disponíveis quando o servidor estiver ligado.");return;}
 const on=favs.has(id);btn.disabled=true;
 const {error}=on?await sb.from("favorites").delete().eq("user_id",currentUser.id).eq("product_id",id):await sb.from("favorites").insert({user_id:currentUser.id,product_id:id});
 btn.disabled=false;
 if(error&&error.code!=="23505"){toast("Não foi possível guardar. Tenta de novo.");return;}
 on?favs.delete(id):favs.add(id);
 document.querySelectorAll(`[data-fav="${id}"]`).forEach(b=>{b.setAttribute("aria-pressed",!on);b.textContent=!on?"Guardado":"Guardar";});
}
// Records a purchase REQUEST (not a payment). The WhatsApp link opens regardless of the result.
async function createOrder(id){
 if(!currentUser||catalogSource!=="db")return;
 const p=products.find(x=>x.id===id);
 const {error}=await sb.from("orders").insert({user_id:currentUser.id,product_id:id,amount:p.price});
 toast(error?"Não foi possível registar o pedido, mas podes continuar no WhatsApp.":"Pedido registado no teu painel.");
}
document.addEventListener("click",e=>{
 const f=e.target.closest("[data-fav]");if(f){toggleFav(f.dataset.fav,f);return;}
 const b=e.target.closest("[data-buy]");if(b)createOrder(b.dataset.buy);
 if(e.target.id==="lo"){e.preventDefault();sb.auth.signOut();}
});

pages.entrar=()=>["Entrar",`<section><div class="w">${head("Entrar ou criar conta","Podes ver os materiais sem conta. Com conta, guardas favoritos, acompanhas pedidos e vês o teu progresso.")}
 ${sb?`<div class="form" style="margin-top:1.2rem"><button class="btn s" id="g" type="button">Continuar com Google</button>
 <form class="form" id="af"><label>Nome (para criar conta)<input id="an" autocomplete="name"></label><label>Email<input id="ae" type="email" required autocomplete="email"></label><label>Palavra-passe<input id="ap" type="password" minlength="6" required autocomplete="current-password"></label>
 <div class="row"><button class="btn" type="submit">Entrar</button><button class="btn s" id="reg" type="button">Criar conta</button></div></form><p id="am" role="alert"></p></div>`:empty("A conta ainda não está configurada. Falta ligar o Supabase (ver SETUP.md).")}</div></section>`,()=>{
 if(!sb)return;
 const msg=t=>$("#am").textContent=t,busy=b=>document.querySelectorAll("#af button,#g").forEach(x=>x.disabled=b);
 const back=location.origin+location.pathname+"#/dashboard";
 $("#g").onclick=async()=>{busy(true);const {error}=await sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:back}});if(error){msg(authMsg(error));busy(false);}};
 $("#af").onsubmit=async e=>{e.preventDefault();busy(true);msg("A entrar...");const {error}=await sb.auth.signInWithPassword({email:$("#ae").value,password:$("#ap").value});busy(false);msg(error?authMsg(error):"");};
 $("#reg").onclick=async()=>{if(!$("#af").reportValidity())return;busy(true);msg("A criar conta...");
  const {data,error}=await sb.auth.signUp({email:$("#ae").value,password:$("#ap").value,options:{data:{full_name:$("#an").value.trim()},emailRedirectTo:back}});
  busy(false);msg(error?authMsg(error):data.session?"":"Conta criada. Vê o teu email para confirmar e depois entra.");};
}];

pages.perfil=()=>["Perfil",`<section><div class="w">${head("O teu perfil","")}<form class="form" id="pf" style="margin-top:1rem"><div id="av"></div>
 <label>Nome<input id="pn" required></label><label>Email<input id="pe" disabled></label>
 <label>Instituição<select id="pi"><option value="">Nenhuma</option>${institutions.map(i=>`<option value="${i.id}">${i.name}</option>`).join("")}</select></label>
 <button class="btn" type="submit">Guardar</button></form></div></section>`,()=>{
 $("#pn").value=profile?.full_name||"";$("#pe").value=currentUser.email||"";$("#pi").value=profile?.institution_id||"";
 if(/^https:\/\//.test(profile?.avatar_url||""))$("#av").innerHTML=`<img src="${esc(profile.avatar_url)}" alt="A tua foto de perfil" width="64" height="64" style="border-radius:50%" referrerpolicy="no-referrer" loading="lazy">`;
 $("#pf").onsubmit=async e=>{e.preventDefault();const b=e.submitter,v={full_name:$("#pn").value.trim(),institution_id:$("#pi").value||null};b.disabled=true;
  const {error}=await sb.from("profiles").update(v).eq("id",currentUser.id);b.disabled=false;
  if(!error)profile={...profile,...v};toast(error?"Não foi possível guardar o perfil. Tenta de novo.":"Perfil guardado.");};
}];
