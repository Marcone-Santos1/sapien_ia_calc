export interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  keywords: string[];
}

export const articles: Article[] = [
  {
    slug: "como-a-inteligencia-artificial-esta-revolucionando-a-resolucao-de-questoes-de-exatas",
    title: "Como a Inteligência Artificial Está Revolucionando a Resolução de Questões de Exatas",
    description: "Descubra como tutores de IA e resolutores de questões por imagem ajudam estudantes de exatas, matemática e física a aprenderem de verdade, passo a passo.",
    date: "2026-05-23",
    author: "Prof. Arthur Antunes",
    category: "Tecnologia na Educação",
    readTime: "5 min",
    keywords: ["resolutor de questões", "IA para matemática", "estudar exatas", "tutor de física", "inteligência artificial exatas"],
    content: `
      <p>Estudar matérias de exatas, como Matemática, Física e Química, sempre foi um grande desafio para a maioria dos estudantes. A tradicional decoreba de fórmulas muitas vezes não é suficiente para resolver problemas complexos em provas de vestibular, exames universitários ou concursos públicos. No entanto, o surgimento de ferramentas modernas baseadas em <strong>Inteligência Artificial (IA)</strong> está transformando completamente essa dinâmica.</p>

      <h2>O Fim das Resoluções Frias e Sem Explicação</h2>
      <p>Quem nunca passou horas tentando resolver um exercício de cálculo integral ou geometria analítica e, ao consultar o gabarito oficial, deparou-se apenas com a alternativa correta ou com uma equação direta, sem nenhuma linha de raciocínio explicada? Esse é um dos maiores gargalos no aprendizado.</p>
      <p>Os novos resolutores de questões por IA, como o <strong>Sapienia</strong>, agem de forma diferente. Em vez de apenas entregar a resposta final, a IA analisa a estrutura lógica do problema — seja ele enviado por texto ou por uma captura de tela (print) — e gera uma explicação detalhada passo a passo.</p>

      <h2>Como Funciona a Resolução Visual por IA (Vision/OCR)?</h2>
      <p>As redes neurais de visão computacional atuais conseguem decodificar elementos que antes eram impossíveis para um leitor de tela comum, como:</p>
      <ul>
        <li>Equações matemáticas com frações, limites e derivadas.</li>
        <li>Diagramas geométricos, círculos trigonométricos e triângulos.</li>
        <li>Gráficos cartesianos e tabelas de dados experimentais.</li>
      </ul>
      <p>Ao tirar um print da tela com a extensão para o Chrome, a imagem é lida instantaneamente pelo modelo de linguagem de grande porte (LLM), que identifica a questão, busca a teoria relacionada e redige uma explicação didática do problema.</p>

      <h2>Tutor de IA: O Futuro da Educação Personalizada</h2>
      <p>Ter um tutor particular disponível 24 horas por dia costumava ser um privilégio de poucos. Com a IA acadêmica, qualquer aluno pode ter acesso a explicações personalizadas no seu próprio ritmo. Se você não entendeu a passagem de uma linha da equação para a outra, a IA detalha a regra matemática aplicada (como a regra da cadeia, báscara ou fatoração).</p>
      <p><strong>Dica de ouro:</strong> Use a tecnologia a favor do seu aprendizado ativo. Tente resolver o problema sozinho primeiro. Caso trave em alguma etapa, utilize o resolutor por print para identificar exatamente qual conceito ou fórmula você esqueceu de aplicar.</p>
    `
  },
  {
    slug: "dicas-praticas-para-passar-no-vestibular-e-enem-estudando-por-questoes-com-ia",
    title: "Dicas Práticas para Passar no Vestibular e ENEM Estudando por Questões com IA",
    description: "Estudar por questões anteriores é o método mais eficaz para o ENEM. Aprenda a acelerar seus estudos usando extensões de IA no Google Chrome.",
    date: "2026-05-22",
    author: "Dra. Carolina Mendes",
    category: "Dicas de Estudo",
    readTime: "6 min",
    keywords: ["estudar por questões", "gabaritar vestibular", "extensão chrome enem", "como estudar para enem", "resolutor de provas"],
    content: `
      <p>A preparação para grandes exames nacionais, como o ENEM, Fuvest e vestibulares estaduais, exige muito mais do que apenas assistir a videoaulas passivamente. Diversos estudos científicos sobre técnicas de aprendizagem demonstram que a <strong>prática ativa (Active Recall)</strong> e a <strong>repetição espaçada</strong> são as formas mais eficientes de fixar conteúdo na memória de longo prazo.</p>
      <p>E a melhor maneira de praticar ativamente é resolvendo provas e simulados anteriores. Neste artigo, vamos te mostrar como integrar Inteligência Artificial para tornar esse processo até 3x mais rápido e produtivo.</p>

      <h2>Por que Estudar por Questões Anteriores Funciona Tanto?</h2>
      <p>Quando você resolve uma questão antiga do ENEM, você não está apenas testando seu conhecimento, mas também se familiarizando com a linguagem da banca examinadora e aprendendo a gerenciar o tempo de prova. Além disso, você ativa a memória de esforço, sinalizando ao cérebro que aquele conhecimento é importante.</p>

      <h2>O Passo a Passo do Estudo Eficiente com Extensões de Chrome</h2>
      <p>Para otimizar o seu tempo de estudos na frente do computador, seguir um fluxo otimizado é essencial:</p>
      <ol>
        <li><strong>Faça o Simulado:</strong> Abra uma prova anterior em PDF ou no portal de simulados do seu cursinho online.</li>
        <li><strong>Tente Resolver sem Ajuda:</strong> Force sua mente a lembrar das fórmulas e conceitos por pelo menos 3 a 5 minutos.</li>
        <li><strong>Use a Extensão de IA no Erro:</strong> Se você errar a questão ou não souber nem por onde começar, abra a extensão do <strong>Sapienia</strong> no painel lateral do Chrome, selecione a área da questão e solte.</li>
        <li><strong>Estude a Resolução Didática:</strong> Em vez de apenas ver qual era a letra correta, leia a explicação detalhada de por que as outras alternativas estão erradas.</li>
        <li><strong>Crie seu Caderno de Erros:</strong> Salve as resoluções das questões que você errou para revisá-las no final da semana.</li>
      </ol>

      <h2>Benefícios de Usar a Extensão Sapienia nos Seus Estudos</h2>
      <p>Com um clique, a extensão abre no seu painel lateral e lê a tela do seu navegador, seja um PDF do ENEM ou um site de questões. Seus créditos gratuitos iniciais te ajudam a testar e sentir a diferença de ter explicações dinâmicas estruturadas na hora.</p>
      <p>Comece a aplicar esse método hoje mesmo e veja sua pontuação nos simulados subir consistentemente!</p>
    `
  },
  {
    slug: "tutor-de-ia-vs-resolucoes-frias-o-que-realmente-funciona-no-aprendizado",
    title: "Tutor de IA vs. Resoluções Frias: O que Realmente Funciona no Aprendizado?",
    description: "Saiba por que ver apenas a resposta final atrasa a sua aprovação e entenda a importância das explicações detalhadas em fórmulas matematicas.",
    date: "2026-05-20",
    author: "Felipe S. Rocha",
    category: "Pedagogia Moderna",
    readTime: "4 min",
    keywords: ["tutor de fisica", "explicador de calculo", "aprender matematica passo a passo", "IA educacional", "metodologia de estudo"],
    content: `
      <p>Muitos estudantes cometem o erro de achar que "estudar exatas" é colecionar respostas certas. Eles abrem listas de exercícios, olham o gabarito no final do livro e dão o assunto por encerrado caso batam o resultado. Mas o que acontece quando a questão na prova real muda apenas um detalhe da fórmula ou propõe um contexto diferente? O aluno trava. Isso ocorre devido ao aprendizado baseado em resoluções frias.</p>

      <h2>O que é uma Resolução Fria?</h2>
      <p>Resoluções frias são aquelas que te dão apenas o resultado matemático direto ou pulam várias etapas lógicas do cálculo. Elas assumem que o estudante já domina todos os passos intermediários, o que raramente é verdade para quem está aprendendo uma matéria difícil como Limites, Derivadas ou Eletromagnetismo.</p>
      <p>Estudar com resoluções frias causa uma falsa sensação de competência: você acha que entendeu porque o gabarito fez sentido visualmente, mas não seria capaz de reproduzir o raciocínio do zero.</p>

      <h2>A Abordagem do Tutor de IA</h2>
      <p>Um tutor de IA moderno age de forma socrática e explicativa. O objetivo principal do <strong>Sapienia</strong> não é fazer a sua tarefa por você, mas sim te ensinar a pensar sobre o problema. Veja a diferença de uma resposta gerada por IA:</p>
      <ul>
        <li><strong>Passo 1: Identificação de Dados:</strong> O tutor lista quais informações o enunciado forneceu e o que ele está pedindo.</li>
        <li><strong>Passo 2: Conceito Teórico:</strong> Explica qual lei da física ou teorema matemático rege aquela situação.</li>
        <li><strong>Passo 3: Desenvolvimento Passo a Passo:</strong> Mostra cada substituição de valores e isolamento de variáveis de forma didática.</li>
        <li><strong>Passo 4: Gabarito Comentado:</strong> Apresenta a conclusão e a interpretação do resultado.</li>
      </ul>

      <h2>Conclusão: Invista no Aprendizado de Longo Prazo</h2>
      <p>Para gabaritar provas de exatas em vestibulares e concursos, seu foco deve estar em entender os <strong>processos</strong>, e não em decorar respostas prontas. O uso inteligente de ferramentas de IA serve como um atalho pedagógico de altíssimo nível, removendo a frustração de ficar "travado" em um exercício por horas sem saber o que fazer.</p>
    `
  }
];
