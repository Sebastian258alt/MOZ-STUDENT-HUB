/* ================= ROUTER (hash based, no reload) ================= */
function route(){
 const [path,query=""]=(location.hash.slice(1)||"/").split("?");
 const parts=path.split("/").filter(Boolean),key=parts[0]||"home";
 const page=pages[key]||pages.home;
 const [title,html,after]=page(new URLSearchParams(query),parts[1]);
 $("#app").innerHTML=html;
 document.title=title?title+" | MOZ STUDENT HUB":"MOZ STUDENT HUB | Materiais e Recursos para Estudantes em Moçambique";
 if(after)after();
 document.querySelectorAll("nav a:not(.btn)").forEach(a=>a.getAttribute("href")==="#/"+(key==="home"?"":key==="material"?"materiais":key)?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));
 $("#nav").classList.remove("o");$("#mb").setAttribute("aria-expanded","false");
 window.scrollTo(0,0);
}
$("#mb").onclick=()=>{const o=$("#nav").classList.toggle("o");$("#mb").setAttribute("aria-expanded",o)};
addEventListener("hashchange",route);route();
