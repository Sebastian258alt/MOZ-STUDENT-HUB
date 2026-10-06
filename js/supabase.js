// Supabase client + catalogue loading.
// If Supabase is not configured or unreachable, the app keeps working with the local demo data in data.js.
const sb=(SUPABASE_URL&&SUPABASE_ANON_KEY&&window.supabase)?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{flowType:"pkce"}}):null;
let catalogSource="local"; // "local" | "db" | "error"
// file_url is never requested: it is not readable from the browser.
const PRODUCT_COLS="id,title,slug,institution_id,subject,description,price,type,includes,demo,cover_url,created_at";
async function loadCatalog(){
 if(!sb)return;
 try{
  const r=await Promise.all([
   sb.from("institutions").select("id,name,slug,category,description").eq("active",true).order("name"),
   sb.from("products").select(PRODUCT_COLS).eq("active",true).order("created_at"),
   sb.from("categories").select("name").order("sort"),
   sb.from("quizzes").select("id,title,description,subject,duration_minutes").eq("active",true)]);
  const bad=r.find(x=>x.error); if(bad)throw bad.error;
  institutions=r[0].data.map(x=>({id:x.id,name:x.name,category:x.category,description:x.description}));
  products=r[1].data.map(x=>({id:x.id,title:x.title,institutionId:x.institution_id,subject:x.subject,description:x.description,price:+x.price,type:x.type,includes:x.includes||[],demo:x.demo}));
  if(r[2].data.length)categories=r[2].data.map(x=>x.name);
  quizzes=r[3].data;
  catalogSource="db";
 }catch(e){console.error("Catalogue error",e);catalogSource="error";}
}
