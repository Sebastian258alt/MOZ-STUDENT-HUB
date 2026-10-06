-- DEMO seed data. Nothing here is official.
insert into institutions(name,slug,category,description) values
('UEM','uem','Universidade','Universidade Eduardo Mondlane. Informação oficial em breve. Texto de exemplo.'),
('UP','up','Universidade','Universidade Pedagógica. Informação oficial em breve. Texto de exemplo.'),
('UJC','ujc','Universidade','Universidade Joaquim Chissano. Informação oficial em breve. Texto de exemplo.'),
('ISCISA','iscisa','Instituto superior','Instituto Superior de Ciências de Saúde. Informação oficial em breve. Texto de exemplo.'),
('IFP','ifp','Formação','Informação oficial em breve. Texto de exemplo.'),
('ETP','etp','Ensino técnico','Informação oficial em breve. Texto de exemplo.'),
('ISPM','ispm','Instituto superior','Informação oficial em breve. Texto de exemplo.'),
('ACIPOL','acipol','Academia','Academia de Ciências Policiais. Informação oficial em breve. Texto de exemplo.'),
('UniLúrio','unilurio','Universidade','Universidade Lúrio. Informação oficial em breve. Texto de exemplo.'),
('UniRovuma','unirovuma','Universidade','Universidade Rovuma. Informação oficial em breve. Texto de exemplo.'),
('UniZambeze','unizambeze','Universidade','Universidade Zambeze. Informação oficial em breve. Texto de exemplo.'),
('UniLicungo','unilicungo','Universidade','Universidade Licungo. Informação oficial em breve. Texto de exemplo.');
insert into categories(name,sort) values('Matemática',1),('Física',2),('Português',3),('Inglês',4),('História',5),('Química',6),('Biologia',7),('Outros',8);
insert into products(title,slug,institution_id,subject,description,price,type,includes)
select v.t,v.s,i.id,v.sub,'Produto de exemplo (DEMO). Ficheiro real ainda não ligado.',v.p,v.ty,v.inc from (values
('Guia de Matemática: revisão de base','demo-matematica','uem','Matemática',150,'Guia PDF',array['Resumo da matéria','Exercícios resolvidos (exemplo)']),
('Caderno de exercícios de Física','demo-fisica','up','Física',120,'Exercícios',array['Exercícios por tema','Soluções (exemplo)']),
('Português: gramática e interpretação','demo-portugues','ujc','Português',100,'Resumo',array['Resumo de gramática','Textos de treino (exemplo)']),
('English Prep: vocabulário essencial','demo-ingles','unilurio','Inglês',100,'Guia PDF',array['Listas de vocabulário','Exercícios de prática (exemplo)']),
('História: linha do tempo e resumos','demo-historia','unirovuma','História',90,'Resumo',array['Resumos por período (exemplo)']),
('Química: tabela e exercícios base','demo-quimica','iscisa','Química',130,'Exercícios',array['Revisão de conceitos','Exercícios (exemplo)']),
('Biologia: resumos para o ingresso','demo-biologia','iscisa','Biologia',140,'Resumo',array['Resumos ilustrados (exemplo)']),
('Plano de estudo para candidatos','demo-plano','unizambeze','Outros',80,'Guia PDF',array['Modelo de horário semanal','Dicas de organização'])
) v(t,s,islug,sub,p,ty,inc) join institutions i on i.slug=v.islug;
insert into quizzes(title,description,subject,duration_minutes) values
('DEMO: Matemática básica','Perguntas de exemplo, não oficiais.','Matemática',10),
('DEMO: Inglês básico','Perguntas de exemplo, não oficiais.','Inglês',10);
insert into questions(quiz_id,question,option_a,option_b,option_c,option_d,correct_option,explanation,order_number)
select q.id,v.*  from quizzes q join (values
('DEMO: Matemática básica','Quanto é 12 × 5?','50','60','55','65','b','12 × 5 = 60.',1),
('DEMO: Matemática básica','Quanto é 3/4 de 20?','12','16','15','18','c','20 ÷ 4 = 5 e 5 × 3 = 15.',2),
('DEMO: Matemática básica','Quanto é 2³?','8','6','9','12','a','2 × 2 × 2 = 8.',3),
('DEMO: Inglês básico','She ___ to school every day.','go','goes','going','gone','b','Com "she" usa-se "goes".',1),
('DEMO: Inglês básico','The opposite of "big" is ___.','small','tall','wide','long','a','O contrário de "big" é "small".',2),
('DEMO: Inglês básico','I ___ a student.','is','are','am','be','c','Com "I" usa-se "am".',3)
) v(t,question,option_a,option_b,option_c,option_d,correct_option,explanation,order_number) on q.title=v.t;
