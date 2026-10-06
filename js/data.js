/* ================= DATA (later: replace with Supabase queries) ================= */
// Central contact config. Change ONLY here.
const CONFIG={whatsapp:"258840000000",facebook:"https://www.facebook.com/",email:"ola@exemplo.co.mz",currency:"MT"};
const PLACEHOLDER="Informação oficial em breve. Texto de exemplo.";
let institutions=[
 {id:"uem",name:"UEM",category:"Universidade",description:"Universidade Eduardo Mondlane. "+PLACEHOLDER},
 {id:"up",name:"UP",category:"Universidade",description:"Universidade Pedagógica. "+PLACEHOLDER},
 {id:"ujc",name:"UJC",category:"Universidade",description:"Universidade Joaquim Chissano. "+PLACEHOLDER},
 {id:"iscisa",name:"ISCISA",category:"Instituto superior",description:"Instituto Superior de Ciências de Saúde. "+PLACEHOLDER},
 {id:"ifp",name:"IFP",category:"Formação",description:PLACEHOLDER},
 {id:"etp",name:"ETP",category:"Ensino técnico",description:PLACEHOLDER},
 {id:"ispm",name:"ISPM",category:"Instituto superior",description:PLACEHOLDER},
 {id:"acipol",name:"ACIPOL",category:"Academia",description:"Academia de Ciências Policiais. "+PLACEHOLDER},
 {id:"unilurio",name:"UniLúrio",category:"Universidade",description:"Universidade Lúrio. "+PLACEHOLDER},
 {id:"unirovuma",name:"UniRovuma",category:"Universidade",description:"Universidade Rovuma. "+PLACEHOLDER},
 {id:"unizambeze",name:"UniZambeze",category:"Universidade",description:"Universidade Zambeze. "+PLACEHOLDER},
 {id:"unilicungo",name:"UniLicungo",category:"Universidade",description:"Universidade Licungo. "+PLACEHOLDER}
];
let categories=["Matemática","Física","Português","Inglês","História","Química","Biologia","Outros"];
// All products are DEMO. They are NOT official papers.
const D="Produto de exemplo (DEMO). Ficheiro real ainda não ligado.";
let products=[
 {id:"p1",title:"Guia de Matemática: revisão de base",institutionId:"uem",subject:"Matemática",description:D,price:150,type:"Guia PDF",includes:["Resumo da matéria","Exercícios resolvidos (exemplo)"],demo:true,available:true},
 {id:"p2",title:"Caderno de exercícios de Física",institutionId:"up",subject:"Física",description:D,price:120,type:"Exercícios",includes:["Exercícios por tema","Soluções (exemplo)"],demo:true,available:true},
 {id:"p3",title:"Português: gramática e interpretação",institutionId:"ujc",subject:"Português",description:D,price:100,type:"Resumo",includes:["Resumo de gramática","Textos de treino (exemplo)"],demo:true,available:true},
 {id:"p4",title:"English Prep: vocabulário essencial",institutionId:"unilurio",subject:"Inglês",description:D,price:100,type:"Guia PDF",includes:["Listas de vocabulário","Exercícios de prática (exemplo)"],demo:true,available:true},
 {id:"p5",title:"História: linha do tempo e resumos",institutionId:"unirovuma",subject:"História",description:D,price:90,type:"Resumo",includes:["Resumos por período (exemplo)"],demo:true,available:true},
 {id:"p6",title:"Química: tabela e exercícios base",institutionId:"iscisa",subject:"Química",description:D,price:130,type:"Exercícios",includes:["Revisão de conceitos","Exercícios (exemplo)"],demo:true,available:true},
 {id:"p7",title:"Biologia: resumos para o ingresso",institutionId:"iscisa",subject:"Biologia",description:D,price:140,type:"Resumo",includes:["Resumos ilustrados (exemplo)"],demo:true,available:true},
 {id:"p8",title:"Plano de estudo para candidatos",institutionId:"unizambeze",subject:"Outros",description:D,price:80,type:"Guia PDF",includes:["Modelo de horário semanal","Dicas de organização"],demo:true,available:true}
];
const opportunities=[
 {title:"Bolsa de estudo (exemplo)",kind:"Bolsas",text:"Entrada de demonstração. Dados reais serão adicionados."},
 {title:"Candidatura a curso (exemplo)",kind:"Candidaturas",text:"Entrada de demonstração. Sem datas reais."},
 {title:"Curso online gratuito (exemplo)",kind:"Cursos",text:"Entrada de demonstração. Sem fonte real ligada."},
 {title:"Estágio para estudantes (exemplo)",kind:"Estágios",text:"Entrada de demonstração. Sem empresa real."}
];
const mkQ=(question,a,b,c,d,correct_option,explanation)=>({question,option_a:a,option_b:b,option_c:c,option_d:d,correct_option,explanation});
// Local DEMO quizzes: used when Supabase is not connected. Not official questions.
let quizzes=[
 {id:"demo-mat",title:"DEMO: Matemática básica",description:"Perguntas de exemplo, não oficiais.",subject:"Matemática",duration_minutes:10,questions:[mkQ("Quanto é 12 × 5?","50","60","55","65","b","12 × 5 = 60."),mkQ("Quanto é 3/4 de 20?","12","16","15","18","c","20 ÷ 4 = 5 e 5 × 3 = 15."),mkQ("Quanto é 2³?","8","6","9","12","a","2 × 2 × 2 = 8.")]},
 {id:"demo-ing",title:"DEMO: Inglês básico",description:"Perguntas de exemplo, não oficiais.",subject:"Inglês",duration_minutes:10,questions:[mkQ("She ___ to school every day.","go","goes","going","gone","b","Com \"she\" usa-se \"goes\"."),mkQ("The opposite of \"big\" is ___.","small","tall","wide","long","a","O contrário de \"big\" é \"small\"."),mkQ("I ___ a student.","is","are","am","be","c","Com \"I\" usa-se \"am\".")]}
];

