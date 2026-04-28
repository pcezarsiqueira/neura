export type Option = { text: string; score: number };
export type Question = { id: string; text: string; options: Option[] };
export type Dimension = {
  key: string;
  name: string;
  icon: string;
  short: string;
  questions: Question[];
};

const opts = (arr: [string, number][]): Option[] =>
  arr.map(([text, score]) => ({ text, score }));

export const DIMENSIONS: Dimension[] = [
  {
    key: "alinhamento",
    name: "Alinhamento Estratégico",
    icon: "◎",
    short: "Conexão entre desenvolvimento e estratégia.",
    questions: [
      { id: "a1", text: "Os treinamentos realizados nos últimos 12 meses foram definidos a partir de metas estratégicas da empresa?", options: opts([
        ["Sim — cada programa tem uma meta de negócio clara associada", 4],
        ["A maioria sim, mas alguns são por demanda pontual", 3],
        ["Metade por estratégia, metade por solicitação dos gestores", 2],
        ["Geralmente reagimos a demandas sem conexão clara com estratégia", 1],
        ["Não temos esse processo de alinhamento", 0],
      ])},
      { id: "a2", text: "A liderança sênior participa da definição das prioridades de desenvolvimento?", options: opts([
        ["Sim, C-level e diretores participam ativamente", 4],
        ["Participa em alguns programas mais estratégicos", 3],
        ["Participa na aprovação de budget mas não na definição", 2],
        ["Raramente — T&D decide e informa a liderança", 1],
        ["Não há participação da liderança nesse processo", 0],
      ])},
      { id: "a3", text: "Existe um plano de desenvolvimento conectado ao planejamento estratégico?", options: opts([
        ["Sim, integrado ao planejamento anual com revisões trimestrais", 4],
        ["Temos um plano mas revisado com pouca frequência", 3],
        ["Existe informalmente mas não está documentado", 2],
        ["Estamos construindo esse processo", 1],
        ["Não existe plano integrado", 0],
      ])},
      { id: "a4", text: "Quando um problema de performance aparece, qual é o primeiro movimento?", options: opts([
        ["Diagnóstico de causa raiz antes de qualquer intervenção", 4],
        ["Consultamos RH para avaliar se é gap de competência", 3],
        ["Tendemos a pedir treinamento como primeira solução", 2],
        ["O gestor decide a solução sem processo formal", 1],
        ["Não temos processo definido para isso", 0],
      ])},
      { id: "a5", text: "Você consegue dizer quais competências sua empresa precisa desenvolver nos próximos 2 anos?", options: opts([
        ["Sim, temos mapeamento de competências futuras documentado", 4],
        ["Temos ideia mas não está formalizado", 3],
        ["Sabemos o presente — o futuro é incerto", 2],
        ["Não temos visibilidade sobre isso", 1],
        ["Nunca pensamos nesse horizonte", 0],
      ])},
    ],
  },
  {
    key: "diagnostico",
    name: "Diagnóstico de Necessidades",
    icon: "⊕",
    short: "Como identificar a real causa antes de agir.",
    questions: [
      { id: "d1", text: "Como a empresa identifica que um treinamento é necessário?", options: opts([
        ["Processo formal com análise de gap de competência e comportamento", 4],
        ["Pesquisa com gestores e colaboradores antes de qualquer decisão", 3],
        ["Combinação de solicitação do gestor e avaliação de desempenho", 2],
        ["Principalmente por solicitação dos gestores ou colaboradores", 1],
        ["Compramos o que o mercado oferece ou o que outras empresas fazem", 0],
      ])},
      { id: "d2", text: "Antes de contratar um treinamento, a empresa define qual comportamento específico deve mudar?", options: opts([
        ["Sempre — está na especificação do programa", 4],
        ["Na maioria dos programas estratégicos sim", 3],
        ["Às vezes — depende do gestor responsável", 2],
        ["Raramente chegamos a esse nível de especificidade", 1],
        ["Nunca pensamos em termos de comportamento a mudar", 0],
      ])},
      { id: "d3", text: "Você distingue entre gap de conhecimento, gap de habilidade e gap de motivação antes de escolher a solução?", options: opts([
        ["Sim, temos metodologia para isso", 4],
        ["Fazemos de forma intuitiva mas sem processo formal", 3],
        ["Raramente — geralmente assumimos que é gap de conhecimento", 2],
        ["Não fazemos essa distinção", 1],
        ["Não conhecia essa diferenciação", 0],
      ])},
      { id: "d4", text: "A empresa já contratou treinamento que depois percebeu que não era o problema real?", options: opts([
        ["Nunca — nosso diagnóstico evita isso", 4],
        ["Raramente — aconteceu mas não é frequente", 3],
        ["Algumas vezes isso aconteceu", 2],
        ["Com certa frequência isso ocorre", 1],
        ["É mais a regra do que a exceção", 0],
      ])},
      { id: "d5", text: "As avaliações de desempenho alimentam as decisões de desenvolvimento?", options: opts([
        ["Sim, são a principal fonte para nosso plano de desenvolvimento", 4],
        ["Parcialmente — usamos alguns dados mas não sistematicamente", 3],
        ["A avaliação existe mas o T&D não acessa os dados regularmente", 2],
        ["A avaliação e o T&D funcionam em silos separados", 1],
        ["Não temos avaliação de desempenho estruturada", 0],
      ])},
    ],
  },
  {
    key: "design",
    name: "Design de Aprendizagem",
    icon: "▦",
    short: "Como o programa é estruturado para mudar comportamento.",
    questions: [
      { id: "ds1", text: "Como a empresa decide o formato do treinamento?", options: opts([
        ["Por evidência de qual formato é mais eficaz para o comportamento alvo", 4],
        ["Por combinação de custo, disponibilidade e preferência dos participantes", 3],
        ["Geralmente replicamos o que funcionou antes", 2],
        ["O fornecedor propõe e aceitamos", 1],
        ["Não temos critério definido para isso", 0],
      ])},
      { id: "ds2", text: "Os treinamentos incluem prática real e simulação de situações do trabalho?", options: opts([
        ["Sempre — é parte obrigatória do design", 4],
        ["Na maioria dos programas sim", 3],
        ["Em alguns programas mais práticos", 2],
        ["Raramente — a maioria é expositiva", 1],
        ["Nossos treinamentos são principalmente expositivos", 0],
      ])},
      { id: "ds3", text: "Existe diferença entre como vocês treinam conhecimento técnico e comportamento?", options: opts([
        ["Sim, temos abordagens diferentes para cada tipo", 4],
        ["Temos consciência da diferença mas aplicamos de forma similar", 3],
        ["Não diferenciamos na prática", 2],
        ["Nunca pensamos nisso", 1],
        ["Não sei responder", 0],
      ])},
      { id: "ds4", text: "A liderança participa como facilitadora ou apenas como patrocinadora?", options: opts([
        ["A liderança facilita e reforça o aprendizado no dia a dia", 4],
        ["Participam de abertura e encerramento como patrocinadores", 3],
        ["Participam pontualmente quando solicitados", 2],
        ["Geralmente delegam completamente para o RH", 1],
        ["A liderança não participa dos treinamentos", 0],
      ])},
      { id: "ds5", text: "Os treinamentos têm objetivos de aprendizagem claros e mensuráveis definidos antes de começar?", options: opts([
        ["Sempre — com indicadores de sucesso definidos", 4],
        ["Na maioria dos programas estratégicos", 3],
        ["Em alguns programas", 2],
        ["Raramente de forma estruturada", 1],
        ["Não definimos objetivos mensuráveis previamente", 0],
      ])},
    ],
  },
  {
    key: "engajamento",
    name: "Engajamento e Adesão",
    icon: "◈",
    short: "O quanto as pessoas realmente entram no processo.",
    questions: [
      { id: "e1", text: "Como você mediria o engajamento real dos participantes?", options: opts([
        ["Temos múltiplos indicadores além de presença e avaliação de reação", 4],
        ["Usamos avaliação de reação (satisfação) como principal indicador", 3],
        ["Medimos presença e entrega de atividades", 2],
        ["Medimos principalmente presença", 1],
        ["Não medimos engajamento", 0],
      ])},
      { id: "e2", text: "Os colaboradores buscam os treinamentos voluntariamente ou precisam ser convocados?", options: opts([
        ["A maioria busca ativamente — temos lista de espera", 4],
        ["Equilíbrio entre voluntários e convocados", 3],
        ["Maioria convocada mas com boa adesão", 2],
        ["Maioria convocada e com resistência frequente", 1],
        ["É difícil engajar as pessoas mesmo nos obrigatórios", 0],
      ])},
      { id: "e3", text: "O que acontece quando um colaborador-chave falta a um treinamento crítico?", options: opts([
        ["Existe processo de recuperação e acompanhamento estruturado", 4],
        ["O gestor é notificado e define a próxima ação", 3],
        ["Registramos a falta mas raramente há consequência", 2],
        ["Normalmente não há consequência formal", 1],
        ["Não temos processo para isso", 0],
      ])},
      { id: "e4", text: "Os gestores reforçam a importância dos treinamentos antes e depois?", options: opts([
        ["Sim, fazem briefing antes e follow-up estruturado depois", 4],
        ["Fazem de forma espontânea mas sem processo definido", 3],
        ["Alguns gestores fazem, outros não", 2],
        ["Raramente os gestores se envolvem", 1],
        ["Os gestores não participam desse processo", 0],
      ])},
      { id: "e5", text: "Há espaço para os participantes questionarem, praticarem e errarem durante os treinamentos?", options: opts([
        ["Sempre — é parte do design pedagógico", 4],
        ["Na maioria dos programas sim", 3],
        ["Em alguns programas mais interativos", 2],
        ["A maioria dos treinamentos é expositiva", 1],
        ["Não há espaço formal para isso", 0],
      ])},
    ],
  },
  {
    key: "transferencia",
    name: "Transferência para a Prática",
    icon: "↯",
    short: "O que sai da sala e vira comportamento no trabalho.",
    questions: [
      { id: "t1", text: "Após um treinamento, como a empresa garante que o aprendizado é aplicado?", options: opts([
        ["Plano de ação individual + acompanhamento estruturado do gestor", 4],
        ["Plano de ação mas sem acompanhamento sistemático", 3],
        ["Esperamos que o colaborador aplique por conta própria", 2],
        ["Não temos processo formal de transferência", 1],
        ["Nunca pensamos em transferência como responsabilidade da empresa", 0],
      ])},
      { id: "t2", text: "Os gestores são preparados para apoiar a aplicação do que foi aprendido?", options: opts([
        ["Sim, recebem orientação específica sobre como reforçar", 4],
        ["Alguns gestores fazem isso naturalmente", 3],
        ["Geralmente não são preparados para isso", 2],
        ["Os gestores não sabem o que foi ensinado no treinamento", 1],
        ["Não vemos isso como papel do gestor", 0],
      ])},
      { id: "t3", text: "Existe acompanhamento 30, 60 ou 90 dias após o treinamento?", options: opts([
        ["Sim, temos processo formal de follow-up estruturado", 4],
        ["Fazemos em programas mais estratégicos", 3],
        ["Raramente — dependendo do gestor", 2],
        ["Quase nunca", 1],
        ["Nunca fazemos follow-up estruturado", 0],
      ])},
      { id: "t4", text: "Quando o aprendizado não é aplicado, a empresa investiga o motivo?", options: opts([
        ["Sempre — é parte do nosso processo de melhoria contínua", 4],
        ["Às vezes, quando o resultado é muito abaixo do esperado", 3],
        ["Raramente — geralmente culpamos o participante", 2],
        ["Não temos esse processo", 1],
        ["Nunca investigamos", 0],
      ])},
      { id: "t5", text: "O ambiente após o treinamento favorece a aplicação do que foi aprendido?", options: opts([
        ["Sim, geramos condições para que a aplicação aconteça", 4],
        ["Parcialmente — alguns líderes apoiam, outros não", 3],
        ["O ambiente é neutro — nem apoia nem dificulta", 2],
        ["Às vezes o ambiente dificulta a aplicação", 1],
        ["O ambiente frequentemente contradiz o que foi ensinado", 0],
      ])},
    ],
  },
  {
    key: "medicao",
    name: "Medição de Resultado",
    icon: "◧",
    short: "Como o impacto é provado em números.",
    questions: [
      { id: "m1", text: "Como você mede o impacto dos treinamentos nos resultados do negócio?", options: opts([
        ["Temos indicadores de negócio vinculados a cada programa", 4],
        ["Medimos mudança de comportamento e algumas métricas de negócio", 3],
        ["Medimos satisfação e aprendizado (níveis 1 e 2 de Kirkpatrick)", 2],
        ["Medimos apenas satisfação dos participantes", 1],
        ["Não medimos resultado — apenas realizamos o treinamento", 0],
      ])},
      { id: "m2", text: "Você consegue dizer qual foi o ROI de algum treinamento no último ano?", options: opts([
        ["Sim, calculamos ROI de nossos principais programas", 4],
        ["Calculamos impacto em alguns indicadores mas não ROI formal", 3],
        ["Temos percepção qualitativa mas não dados quantitativos", 2],
        ["Não calculamos — seria difícil de mensurar", 1],
        ["Nunca tentamos calcular", 0],
      ])},
      { id: "m3", text: "Os KPIs de T&D estão conectados aos KPIs do negócio?", options: opts([
        ["Sim, nossos indicadores derivam dos indicadores estratégicos", 4],
        ["Parcialmente — alguns programas têm essa conexão", 3],
        ["Temos KPIs de T&D mas independentes dos KPIs de negócio", 2],
        ["Nossos KPIs são operacionais (horas de treinamento, cobertura)", 1],
        ["Não temos KPIs de T&D definidos", 0],
      ])},
      { id: "m4", text: "A liderança sênior recebe relatórios de impacto dos investimentos em desenvolvimento?", options: opts([
        ["Sim, relatório trimestral com impacto em indicadores de negócio", 4],
        ["Relatório anual com dados de cobertura e satisfação", 3],
        ["Apresentamos dados pontualmente quando solicitado", 2],
        ["A liderança não recebe dados de T&D regularmente", 1],
        ["Nunca apresentamos dados de impacto à liderança", 0],
      ])},
      { id: "m5", text: "Você saberia dizer qual treinamento gerou mais resultado nos últimos 2 anos?", options: opts([
        ["Sim, com dados concretos de impacto", 4],
        ["Temos percepção mas sem dados para comprovar", 3],
        ["Temos intuição mas não dados", 2],
        ["Não saberia responder com base em dados", 1],
        ["Nunca pensamos em comparar o impacto entre programas", 0],
      ])},
    ],
  },
  {
    key: "comunicacao",
    name: "Comunicação Interna",
    icon: "≋",
    short: "Como a informação vira ação na organização.",
    questions: [
      { id: "c1", text: "Os líderes da sua empresa comunicam de forma que gera ação — ou apenas informação?", options: opts([
        ["Geram ação — a comunicação resulta em comportamento mensurável", 4],
        ["Na maioria dos casos sim", 3],
        ["Depende muito do líder — grande variação", 2],
        ["Geralmente informam bem mas têm dificuldade em gerar ação", 1],
        ["Comunicar para gerar ação é um gap reconhecido na liderança", 0],
      ])},
      { id: "c2", text: "Quando há mudança importante, a empresa consegue engajar as pessoas genuinamente?", options: opts([
        ["Sim, temos processo de gestão de mudança com alto engajamento", 4],
        ["Na maioria das mudanças sim", 3],
        ["Depende da mudança e de quem a lidera", 2],
        ["Frequentemente encontramos resistência e baixo engajamento", 1],
        ["Gestão de mudança é um dos nossos maiores desafios", 0],
      ])},
      { id: "c3", text: "Os feedbacks dados pelos líderes realmente mudam comportamento?", options: opts([
        ["Sim, nossos líderes são eficazes em dar feedback transformador", 4],
        ["A maioria dos líderes é razoavelmente eficaz", 3],
        ["Há muita variação — alguns líderes são muito mais eficazes que outros", 2],
        ["Feedback é dado mas raramente muda comportamento", 1],
        ["Feedback é um gap significativo na nossa liderança", 0],
      ])},
      { id: "c4", text: "Reuniões na sua empresa terminam com ações claras e responsáveis definidos?", options: opts([
        ["Sempre — é parte da cultura de reuniões", 4],
        ["Na maioria das vezes sim", 3],
        ["Depende do facilitador da reunião", 2],
        ["Raramente — reuniões terminam sem definição clara", 1],
        ["Reuniões improdutivas são um problema reconhecido", 0],
      ])},
      { id: "c5", text: "A empresa treina líderes especificamente em comunicação que gera resultado?", options: opts([
        ["Sim, temos programa específico e contínuo para isso", 4],
        ["Já fizemos algum treinamento nessa área", 3],
        ["Está nos planos mas ainda não executamos", 2],
        ["Não vemos isso como prioridade de treinamento", 1],
        ["Nunca treinamos comunicação de liderança formalmente", 0],
      ])},
    ],
  },
  {
    key: "cultura",
    name: "Cultura de Aprendizagem",
    icon: "⊗",
    short: "O quanto aprender está no DNA da operação.",
    questions: [
      { id: "cu1", text: "Aprender é visto como responsabilidade do colaborador, da empresa ou de ambos?", options: opts([
        ["De ambos — há expectativa e suporte claros dos dois lados", 4],
        ["Principalmente da empresa — oferecemos e esperamos participação", 3],
        ["Principalmente do colaborador — oferecemos mas a iniciativa é deles", 2],
        ["Da empresa quando é estratégico, do colaborador no restante", 1],
        ["Não há cultura clara sobre isso", 0],
      ])},
      { id: "cu2", text: "Errar e aprender com o erro é aceito e encorajado na sua empresa?", options: opts([
        ["Sim, faz parte da cultura e os líderes modelam esse comportamento", 4],
        ["Em algumas áreas e com alguns líderes sim", 3],
        ["Toleramos o erro mas não encorajamos ativamente", 2],
        ["O erro tende a ser punido ou evitado", 1],
        ["Há medo de errar que inibe aprendizado e inovação", 0],
      ])},
      { id: "cu3", text: "Os colaboradores compartilham conhecimento entre si espontaneamente?", options: opts([
        ["Sim, temos práticas formais e informais de compartilhamento", 4],
        ["Acontece em algumas áreas mais colaborativas", 3],
        ["Depende muito das pessoas — não é sistemático", 2],
        ["Conhecimento tende a ser retido individualmente", 1],
        ["Silos de conhecimento são um problema na empresa", 0],
      ])},
      { id: "cu4", text: "O que foi aprendido nos treinamentos é reforçado no dia a dia pela liderança?", options: opts([
        ["Sempre — os líderes são os principais reforçadores", 4],
        ["Na maioria dos casos e com a maioria dos líderes", 3],
        ["Em alguns times e com alguns líderes", 2],
        ["Raramente — o treinamento acaba e a rotina absorve tudo", 1],
        ["O que foi aprendido raramente sobrevive à rotina", 0],
      ])},
      { id: "cu5", text: "A empresa investe em desenvolvimento mesmo em períodos de pressão orçamentária?", options: opts([
        ["Sim — desenvolvimento é visto como investimento estratégico", 4],
        ["Investimos nos programas essenciais mas cortamos os demais", 3],
        ["Geralmente o T&D é um dos primeiros a ser cortado", 2],
        ["T&D é frequentemente sacrificado em períodos difíceis", 1],
        ["T&D é visto como custo, não como investimento", 0],
      ])},
    ],
  },
  {
    key: "transformacao",
    name: "Transformação Organizacional",
    icon: "✦",
    short: "A dimensão central — onde tudo se prova.",
    questions: [
      { id: "tr1", text: "Você consegue apontar um comportamento específico que mudou na empresa por causa de um treinamento?", options: opts([
        ["Sim, com dados e casos documentados", 4],
        ["Temos percepção clara mas sem dados formais", 3],
        ["Acreditamos que mudou mas não conseguimos apontar especificamente", 2],
        ["É difícil atribuir mudança de comportamento a um treinamento específico", 1],
        ["Nunca pensamos em medir mudança de comportamento", 0],
      ])},
      { id: "tr2", text: "A empresa diferencia \"treinar\" de \"transformar comportamento\"?", options: opts([
        ["Sim — e isso orienta todas as nossas decisões de T&D", 4],
        ["Temos consciência mas ainda aplicamos de forma similar", 3],
        ["Usamos os termos de forma intercambiável", 2],
        ["Não fazíamos essa distinção antes desta pergunta", 1],
        ["É uma distinção nova para mim", 0],
      ])},
      { id: "tr3", text: "Os resultados dos treinamentos são visíveis para quem não participou deles?", options: opts([
        ["Sim — as mudanças são percebidas por toda a organização", 4],
        ["Por quem trabalha diretamente com os participantes", 3],
        ["Raramente — o impacto fica restrito a quem participou", 2],
        ["Não é perceptível externamente", 1],
        ["Nunca medimos isso", 0],
      ])},
      { id: "tr4", text: "A organização aprende como sistema — ou apenas os indivíduos aprendem?", options: opts([
        ["A organização aprende — processos e cultura evoluem com os aprendizados", 4],
        ["Alguns times aprendem como sistema", 3],
        ["Principalmente os indivíduos aprendem mas o sistema pouco muda", 2],
        ["O conhecimento fica nas pessoas — se saem, leva junto", 1],
        ["Nunca pensamos nessa distinção", 0],
      ])},
      { id: "tr5", text: "Se parar todos os treinamentos amanhã, o comportamento da empresa mudaria significativamente?", options: opts([
        ["Sim — porque criamos cultura que independe de treinamentos pontuais", 4],
        ["Parcialmente — alguns comportamentos resistiriam", 3],
        ["Os comportamentos voltariam ao padrão anterior em poucos meses", 2],
        ["Voltaria rapidamente — dependemos dos treinamentos para manter o padrão", 1],
        ["Honestamente não sei responder", 0],
      ])},
    ],
  },
];

export const TOTAL_QUESTIONS = DIMENSIONS.reduce((s, d) => s + d.questions.length, 0);
