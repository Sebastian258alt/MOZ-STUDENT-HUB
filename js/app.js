/* ================= ROUTER (hash based, no reload) ================= */
const protectedPages=["dashboard","perfil"]; // need a logged-in user (data is also protected by RLS)
const ready=Promise.all([loadCatalog(),initAuth()]);
let routeId=0,warned=false;
async function route(){
 const my=++routeId;
 const [path,query=""]=(location.hash.slice(1)||"/").split("?");
 const parts=path.split("/").filter(Boolean),key=parts[0]||"home";
 $("#app").innerHTML='<section><div class="w"><div class="grid"><div class="sk"></div><div class="sk"></div><div class="sk"></div></div></div></section>';
 await ready; if(my!==routeId)return; // a newer navigation took over
 if(catalogSource==="error"&&!warned){warned=true;toast("Não foi possível ligar ao servidor. A mostrar materiais de exemplo.");}
 if(protectedPages.includes(key)&&!currentUser){toast("Entra na tua conta para ver esta página.");location.hash="#/entrar";return;}
 const page=pages[key]||pages.home;
 const [title,html,after]=page(new URLSearchParams(query),parts[1]);
 $("#app").innerHTML=html;
 document.title=title?title+" | MOZ STUDENT HUB":"MOZ STUDENT HUB | Materiais e Recursos para Estudantes em Moçambique";
 if(after)after();
 const cur=({home:"",material:"materiais",simulado:"simulados"}[key]??key);
 document.querySelectorAll("nav a:not(.btn)").forEach(a=>a.getAttribute("href")==="#/"+cur?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));
 $("#nav").classList.remove("o");$("#mb").setAttribute("aria-expanded","false");
 window.scrollTo(0,0);
}
$("#mb").onclick=()=>{const o=$("#nav").classList.toggle("o");$("#mb").setAttribute("aria-expanded",o)};
addEventListener("hashchange",route);route();
