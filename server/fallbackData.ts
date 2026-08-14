// Curated knowledge base for Brazilian public tenders to ensure 100% resilience against quota/network errors
// Helper to create resilient formatted search URLs (spaces replaced by +, no extra words)
export function formatYouTubeSearchFallback(disciplinaOuTopico: string, concurso: string = ""): string {
  const query = `${disciplinaOuTopico} ${concurso}`.trim();
  const clean = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, "+")
    .trim();
  return `https://www.youtube.com/results?search_query=${clean}`;
}

export interface FallbackConcursoData {
  concurso_identificado: string;
  orgao: string;
  cargo: string;
  banca: string;
  status: string;
  ano_edital: string;
  escolaridade: string;
  remuneracao: string;
  resumo_rapido: string;
  mensagem_confirmacao: string;
  confiabilidade: "alta" | "media" | "baixa";
  necessita_mais_detalhes: boolean;
  perguntas_complementares: string[];
}

export interface FallbackPlanoData {
  concurso: string;
  cargo: string;
  banca: string;
  ano_edital: string;
  horas_disponiveis_por_dia: string;
  resumo_edital: {
    total_vagas: string;
    salario_inicial: string;
    escolaridade: string;
    estrutura_prova: string;
    data_provavel: string;
    destaques_importantes: string[];
  };
  disciplinas: Array<{
    id: string;
    nome: string;
    peso: "alto" | "medio" | "baixo";
    peso_pontuacao: string;
    ordem_importancia: number;
    porcentagem_tempo_estudo: number;
    horas_por_dia: string;
    horas_diarias_sugeridas: string;
    horas_semanais_sugeridas: number;
    topicos: string[];
    video_youtube: string;
    video_youtube_busca_fallback: string;
    video_titulo: string;
    canal_sugerido: string;
    busca_youtube_termo: string;
    por_que_importa: string;
    estrategia_estudo: string;
  }>;
  ciclo_sugerido: {
    metodologia: string;
    distribuicao_dias: Array<{
      dia: string;
      disciplinas: string[];
      foco: string;
    }>;
  };
  mensagem_mentor: string;
}

export const POPULAR_CONCURSOS: Record<string, { info: FallbackConcursoData; getPlano: (dailyHours: number) => FallbackPlanoData }> = {
  inss: {
    info: {
      concurso_identificado: "INSS - Instituto Nacional do Seguro Social",
      orgao: "Instituto Nacional do Seguro Social",
      cargo: "Técnico do Seguro Social",
      banca: "Cebraspe",
      status: "Último Edital Homologado / Novo Concurso Solicitado",
      ano_edital: "2022/2024",
      escolaridade: "Ensino Médio / Superior",
      remuneracao: "R$ 5.905,79 a R$ 9.109,20",
      resumo_rapido: "O concurso do INSS é um dos mais concorridos do Brasil. O Direito Previdenciário representa mais de 55% da prova objetiva (70 de 120 itens).",
      mensagem_confirmacao: "Encontrei o edital do INSS para Técnico do Seguro Social (Banca Cebraspe, estilo Certo/Errado). Posso estruturar seu plano focado no Direito Previdenciário?",
      confiabilidade: "alta",
      necessita_mais_detalhes: false,
      perguntas_complementares: [],
    },
    getPlano: (dailyHours: number) => {
      const h1 = dailyHours >= 3 ? "1h30" : "1h00";
      const h2 = dailyHours >= 3 ? "45min" : "30min";
      return {
        concurso: "INSS - Técnico do Seguro Social",
        cargo: "Técnico do Seguro Social",
        banca: "Cebraspe",
        ano_edital: "2022/2024",
        horas_disponiveis_por_dia: `${dailyHours} horas por dia`,
        resumo_edital: {
          total_vagas: "1.000 vagas imediatas + CR",
          salario_inicial: "R$ 5.905,79",
          escolaridade: "Nível Médio Completo",
          estrutura_prova: "120 itens Cebraspe (50 Conhecimentos Básicos + 70 Específicos)",
          data_provavel: "Concurso regular",
          destaques_importantes: [
            "Direito Previdenciário (Seguridade Social) é responsável por mais de 58% dos pontos da prova.",
            "Metodologia Cebraspe: uma resposta errada anula uma resposta certa.",
            "Língua Portuguesa e Regime Jurídico Único (Lei 8.112) são fundamentais para o desempate.",
          ],
        },
        disciplinas: [
          {
            id: "seguridade-social",
            nome: "Direito Previdenciário / Seguridade Social",
            peso: "alto",
            peso_pontuacao: "70 itens (~58% da nota da prova)",
            ordem_importancia: 1,
            porcentagem_tempo_estudo: 50,
            horas_por_dia: h1,
            horas_diarias_sugeridas: h1,
            horas_semanais_sugeridas: Math.round(dailyHours * 3),
            topicos: [
              "Seguridade Social: Origem, evolução legislativa no Brasil e princípios constitucionais (Art. 194 e 195 da CF/88)",
              "Legislação Previdenciária: Lei 8.212/1991 (Custeio) e Lei 8.213/1991 (Benefícios)",
              "Regime Geral de Previdência Social (RGPS): Segurados obrigatórios e facultativos",
              "Manutenção e perda da qualidade de segurado (Período de Graça)",
              "Prestações em Geral: Aposentadorias, auxílio por incapacidade temporária, pensão por morte e salário-maternidade",
              "Decreto 3.048/1999 atualizado pelo Decreto 10.410/2020",
            ],
            video_youtube: "https://www.youtube.com/watch?v=kYJqD0q3f3k",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Direito Previdenciario INSS Cebraspe aula completa"),
            video_titulo: "Direito Previdenciário do Zero para o INSS - Aula Completa",
            canal_sugerido: "Estratégia Concursos",
            busca_youtube_termo: "Direito Previdenciario INSS Cebraspe aula completa",
            por_que_importa: "É a espinha dorsal do concurso. Quem não atinge 85%+ em Seguridade Social fica fora das vagas.",
            estrategia_estudo: "Lei Seca diária da Lei 8.213 e resolução de baterias de 50 itens diários do Cebraspe.",
          },
          {
            id: "portugues",
            nome: "Língua Portuguesa",
            peso: "alto",
            peso_pontuacao: "15 itens (~12.5% da nota)",
            ordem_importancia: 2,
            porcentagem_tempo_estudo: 20,
            horas_por_dia: h2,
            horas_diarias_sugeridas: h2,
            horas_semanais_sugeridas: Math.round(dailyHours * 1.5),
            topicos: [
              "Compreensão e interpretação de textos de gêneros variados",
              "Reescritura de frases e paráfrase (estilo clássico Cebraspe)",
              "Sintaxe da oração e do período: Concordância verbal e nominal",
              "Regência verbal e crase",
              "Pontuação (emprego da vírgula)",
              "Manual de Redação da Presidência da República",
            ],
            video_youtube: "https://www.youtube.com/watch?v=sM34y4x4uG8",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Portugues Cebraspe INSS aula completa"),
            video_titulo: "Português Cebraspe - Principais Pegadinhas",
            canal_sugerido: "Gran Concursos",
            busca_youtube_termo: "Portugues Cebraspe INSS aula completa",
            por_que_importa: "Responsável pelo maior índice de erros na parte básica e critério de desempate.",
            estrategia_estudo: "Foco absoluto em resolver provas anteriores recentes do Cebraspe.",
          },
          {
            id: "direito-administrativo",
            nome: "Direito Administrativo & Ética",
            peso: "medio",
            peso_pontuacao: "12 itens (~10% da nota)",
            ordem_importancia: 3,
            porcentagem_tempo_estudo: 15,
            horas_por_dia: "30min",
            horas_diarias_sugeridas: "30min",
            horas_semanais_sugeridas: Math.round(dailyHours * 1),
            topicos: [
              "Regime Jurídico Único: Lei 8.112/1990 (Deveres, proibições e penalidades)",
              "Decreto 1.171/1994 (Código de Ética Profissional do Servidor Público Federal)",
              "Atos Administrativos: requisitos, atributos, anulação e revogação",
              "Poderes Administrativos e Responsabilidade Civil do Estado",
            ],
            video_youtube: "https://www.youtube.com/watch?v=9g0e2hR7d2I",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Direito Administrativo Lei 8112 INSS"),
            video_titulo: "Lei 8.112/90 Esquematizada para Concursos",
            canal_sugerido: "Direção Concursos",
            busca_youtube_termo: "Direito Administrativo Lei 8112 INSS",
            por_que_importa: "Matéria com alto índice de acerto entre os primeiros colocados, não se pode perder pontos aqui.",
            estrategia_estudo: "Mnemônicos dos atos administrativos e leitura integral do Decreto 1.171/94.",
          },
          {
            id: "direito-constitucional",
            nome: "Direito Constitucional",
            peso: "medio",
            peso_pontuacao: "8 itens (~7% da nota)",
            ordem_importancia: 4,
            porcentagem_tempo_estudo: 10,
            horas_por_dia: "25min",
            horas_diarias_sugeridas: "25min",
            horas_semanais_sugeridas: 1,
            topicos: [
              "Direitos e Garantias Fundamentais (Art. 5º da CF/88)",
              "Direitos Sociais (Art. 6º ao 11)",
              "Administração Pública (Art. 37 ao 41)",
              "Da Ordem Social: Seguridade Social (Art. 194 a 204)",
            ],
            video_youtube: "https://www.youtube.com/watch?v=1VqJbL8M9nQ",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Direito Constitucional Artigo 5 CF88 Cebraspe"),
            video_titulo: "Artigo 5º da CF/88 para Concursos Públicos",
            canal_sugerido: "QConcursos",
            busca_youtube_termo: "Direito Constitucional Artigo 5 CF88 Cebraspe",
            por_que_importa: "Fornece a base doutrinária para o Direito Previdenciário e Administrativo.",
            estrategia_estudo: "Leitura dos artigos 5º e 37 da Constituição com marcação de palavras-chave.",
          },
          {
            id: "raciocinio-logico",
            nome: "Raciocínio Lógico & Informática",
            peso: "baixo",
            peso_pontuacao: "15 itens somados (~12.5% da nota)",
            ordem_importancia: 5,
            porcentagem_tempo_estudo: 5,
            horas_por_dia: "20min",
            horas_diarias_sugeridas: "20min",
            horas_semanais_sugeridas: 1,
            topicos: [
              "Proposições lógicas, tabela-verdade e equivalências",
              "Noções de Segurança da Informação e Nuvem",
              "Sistemas Operacionais e Pacote Office/LibreOffice",
            ],
            video_youtube: "https://www.youtube.com/watch?v=xZ4q9e5d9K0",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Raciocinio Logico Proposicoes Cebraspe"),
            video_titulo: "Raciocínio Lógico Tabela Verdade Fácil",
            canal_sugerido: "Alfacon",
            busca_youtube_termo: "Raciocinio Logico Proposicoes Cebraspe",
            por_que_importa: "Serve para somar pontos mínimos e não ser desclassificado na prova básica.",
            estrategia_estudo: "Aprender as tabelas verdades dos conectivos lógicos (SE... ENTÃO, E, OU).",
          },
        ],
        ciclo_sugerido: {
          metodologia: `Ciclo Diário de ${dailyHours}h/dia (Foco Previdenciário)`,
          distribuicao_dias: [
            {
              dia: "Segunda-feira",
              disciplinas: [`Direito Previdenciário (${Math.round(dailyHours * 0.6 * 60)}min)`, `Português (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "Lei 8.213/91 Benefícios + 20 questões Cebraspe",
            },
            {
              dia: "Terça-feira",
              disciplinas: [`Direito Previdenciário (${Math.round(dailyHours * 0.6 * 60)}min)`, `Direito Administrativo (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "Custeio e Segurados + Lei 8.112",
            },
            {
              dia: "Quarta-feira",
              disciplinas: [`Direito Previdenciário (${Math.round(dailyHours * 0.6 * 60)}min)`, `Direito Constitucional (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "Art. 194 a 204 CF/88 + Art. 5º",
            },
            {
              dia: "Quinta-feira",
              disciplinas: [`Direito Previdenciário (${Math.round(dailyHours * 0.6 * 60)}min)`, `Português (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "Reescritura de Frases + Período de Graça",
            },
            {
              dia: "Sexta-feira",
              disciplinas: [`Direito Previdenciário (${Math.round(dailyHours * 0.6 * 60)}min)`, `Raciocínio Lógico (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "Equivalências Lógicas + Pensão por Morte",
            },
            {
              dia: "Sábado",
              disciplinas: [`Simulado Cebraspe INSS (${dailyHours}h)`],
              foco: "Simulado 120 itens + Correção detalhada",
            },
            {
              dia: "Domingo",
              disciplinas: [`Revisão Espaçada (${Math.round(dailyHours * 0.5 * 60)}min)`],
              foco: "Flashcards de prazos do RGPS e descanso ativo",
            },
          ],
        },
        mensagem_mentor: "O concurso do INSS é vencido na constância diária em Direito Previdenciário. Dedique 50% da sua rotina a essa matéria e faça no mínimo 30 itens Cebraspe todos os dias!",
      };
    },
  },
  banco_do_brasil: {
    info: {
      concurso_identificado: "Banco do Brasil - Escriturário (Agente Comercial / TI)",
      orgao: "Banco do Brasil S.A.",
      cargo: "Escriturário - Agente Comercial",
      banca: "Fundação Cesgranrio",
      status: "Concurso Nacional Homologado / Ciclo Bianual",
      ano_edital: "2023/2025",
      escolaridade: "Nível Médio Completo",
      remuneracao: "R$ 3.622,23 + R$ 1.813,84 (VA/VR) + PLR",
      resumo_rapido: "Maior concurso bancário do país. Conhecimentos Bancários, Vendas e Negociação e Informática respondem por mais de 65% da pontuação.",
      mensagem_confirmacao: "Encontrei o edital do Banco do Brasil para Escriturário com banca Cesgranrio. Deseja avançar para o plano de estudos ordenado por peso?",
      confiabilidade: "alta",
      necessita_mais_detalhes: false,
      perguntas_complementares: [],
    },
    getPlano: (dailyHours: number) => {
      const h1 = dailyHours >= 3 ? "1h15" : "50min";
      const h2 = dailyHours >= 3 ? "45min" : "30min";
      return {
        concurso: "Banco do Brasil - Escriturário",
        cargo: "Escriturário (Agente Comercial)",
        banca: "Fundação Cesgranrio",
        ano_edital: "2023/2025",
        horas_disponiveis_por_dia: `${dailyHours} horas por dia`,
        resumo_edital: {
          total_vagas: "4.000 a 6.000 vagas",
          salario_inicial: "R$ 3.622,23 + R$ 1.900 benefícios + PLR",
          escolaridade: "Nível Médio",
          estrutura_prova: "70 questões de múltipla escolha (A, B, C, D, E) + Redação",
          data_provavel: "Ciclo regular",
          destaques_importantes: [
            "Conhecimentos Bancários + Vendas & Negociação somam 45 pontos (45% da prova).",
            "Informática tem peso 1.5 e exige domínio de ferramentas digitais e dados.",
            "Redação é eliminatória (mínimo 70 pontos para aprovação).",
          ],
        },
        disciplinas: [
          {
            id: "conhecimentos-bancarios",
            nome: "Conhecimentos Bancários",
            peso: "alto",
            peso_pontuacao: "15 questões (Peso 1.5) - 22.5 pontos",
            ordem_importancia: 1,
            porcentagem_tempo_estudo: 30,
            horas_por_dia: h1,
            horas_diarias_sugeridas: h1,
            horas_semanais_sugeridas: Math.round(dailyHours * 2.5),
            topicos: [
              "Sistema Financeiro Nacional: CMN, Banco Central, CVM e Instituições Financeiras",
              "Mercado Financeiro: Mercado Monetário, de Crédito, de Capitais e Cambial",
              "Produtos Bancários: CDB, RDB, LCI, LCA, Poupança, PGBL/VGBL e Fundos de Investimento",
              "Pix, Open Finance, Moedas Digitais (DREX) e Meios de Pagamento Eletrônicos",
              "Garantias do Sistema Financeiro: Aval, Fiança, Penhor, Hipoteca e Alienação Fiduciária",
              "Prevenção à Lavagem de Dinheiro (Lei 9.613/98 e Resoluções COAF)",
            ],
            video_youtube: "https://www.youtube.com/watch?v=jW90kG7yNlU",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Conhecimentos Bancarios Banco do Brasil Cesgranrio"),
            video_titulo: "Conhecimentos Bancários para Banco do Brasil - Aula Completa",
            canal_sugerido: "Gran Concursos",
            busca_youtube_termo: "Conhecimentos Bancarios Banco do Brasil Cesgranrio",
            por_que_importa: "Matéria central da carreira bancária, com conceitos específicos de regulação financeira.",
            estrategia_estudo: "Compreender o organograma do SFN e as atribuições do CMN e BACEN.",
          },
          {
            id: "vendas-e-negociacao",
            nome: "Vendas e Negociação",
            peso: "alto",
            peso_pontuacao: "15 questões (Peso 1.5) - 22.5 pontos",
            ordem_importancia: 2,
            porcentagem_tempo_estudo: 30,
            horas_por_dia: h1,
            horas_diarias_sugeridas: h1,
            horas_semanais_sugeridas: Math.round(dailyHours * 2.5),
            topicos: [
              "Técnicas de Vendas e Negociação comercial consultiva",
              "Gatilhos mentais, objeções de clientes e fechamento de negócios",
              "Código de Defesa do Consumidor (Lei 8.078/90) aplicado aos bancos",
              "LGPD (Lei Geral de Proteção de Dados - Lei 13.709/18)",
              "Marketing de Relacionamento e Experiência do Cliente (Customer Success)",
              "Ética e Conduta no Setor Bancário",
            ],
            video_youtube: "https://www.youtube.com/watch?v=d_xV5m8h9yI",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Vendas e Negociacao Banco do Brasil Cesgranrio"),
            video_titulo: "Vendas e Negociação para Concursos Bancários",
            canal_sugerido: "Estratégia Concursos",
            busca_youtube_termo: "Vendas e Negociacao Banco do Brasil Cesgranrio",
            por_que_importa: "Possui exatamente a mesma pontuação de Bancários e exige leitura atenta de casos práticos da Cesgranrio.",
            estrategia_estudo: "Resolução de casos práticos de atendimento e domínio do CDC bancário.",
          },
          {
            id: "informatica",
            nome: "Informática & Tecnologia",
            peso: "alto",
            peso_pontuacao: "15 questões (Peso 1.5) - 22.5 pontos",
            ordem_importancia: 3,
            porcentagem_tempo_estudo: 20,
            horas_por_dia: h2,
            horas_diarias_sugeridas: h2,
            horas_semanais_sugeridas: Math.round(dailyHours * 1.5),
            topicos: [
              "Segurança da Informação: Phishing, Ransomware, MFA e Criptografia",
              "Ferramentas de Escritório e Colaboração (Excel / Google Sheets e fórmulas)",
              "Conceitos de Banco de Dados, Big Data e Inteligência Artificial",
              "Redes de Computadores e Computação em Nuvem",
            ],
            video_youtube: "https://www.youtube.com/watch?v=wQ3b9e4a8zE",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Informatica Cesgranrio Banco do Brasil aula completa"),
            video_titulo: "Informática Cesgranrio Banco do Brasil",
            canal_sugerido: "Alfacon",
            busca_youtube_termo: "Informatica Cesgranrio Banco do Brasil aula completa",
            por_que_importa: "A Cesgranrio cobra informática prática e moderna voltada ao ecossistema digital dos bancos.",
            estrategia_estudo: "Praticar fórmulas do Excel e entender ataques modernos de engenharia social.",
          },
          {
            id: "lingua-portuguesa",
            nome: "Língua Portuguesa",
            peso: "medio",
            peso_pontuacao: "10 questões (Peso 1.0) - 10 pontos",
            ordem_importancia: 4,
            porcentagem_tempo_estudo: 10,
            horas_por_dia: "25min",
            horas_diarias_sugeridas: "25min",
            horas_semanais_sugeridas: 1,
            topicos: [
              "Interpretação e inferência textual (textos longos e densos da Cesgranrio)",
              "Crase, Regência e Concordância",
              "Pontuação e coesão referencial",
              "Semântica e vocabulário contextual",
            ],
            video_youtube: "https://www.youtube.com/watch?v=7X1l9k8Y2mZ",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Portugues Cesgranrio Banco do Brasil"),
            video_titulo: "Português Cesgranrio para Bancos",
            canal_sugerido: "QConcursos",
            busca_youtube_termo: "Portugues Cesgranrio Banco do Brasil",
            por_que_importa: "Ajuda a garantir nota máxima na prova básica e alavanca o desempenho na Redação.",
            estrategia_estudo: "Treinar interpretação com crônicas e editoriais do estilo Cesgranrio.",
          },
          {
            id: "matematica-financeira",
            nome: "Matemática Financeira",
            peso: "medio",
            peso_pontuacao: "5 questões (Peso 1.5) - 7.5 pontos",
            ordem_importancia: 5,
            porcentagem_tempo_estudo: 10,
            horas_por_dia: "20min",
            horas_diarias_sugeridas: "20min",
            horas_semanais_sugeridas: 1,
            topicos: [
              "Juros Simples e Juros Compostos",
              "Taxas proporcionais, equivalentes e nominais",
              "Sistemas de Amortização (SAC e Tabela Price)",
              "Fluxo de Caixa e Descontos",
            ],
            video_youtube: "https://www.youtube.com/watch?v=5V9c7x2n1mK",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Matematica Financeira Cesgranrio Juros Compostos SAC"),
            video_titulo: "Matemática Financeira Descomplicada para Concurso Bancário",
            canal_sugerido: "Direção Concursos",
            busca_youtube_termo: "Matematica Financeira Cesgranrio Juros Compostos SAC",
            por_que_importa: "Questões com fórmulas exatas que garantem pontos fáceis quando bem dominadas.",
            estrategia_estudo: "Decorar as fórmulas de montante composto e tabela Price sem calculadora.",
          },
        ],
        ciclo_sugerido: {
          metodologia: `Ciclo Diário Banco do Brasil (${dailyHours}h/dia)`,
          distribuicao_dias: [
            {
              dia: "Segunda-feira",
              disciplinas: [`Conhecimentos Bancários (${Math.round(dailyHours * 0.6 * 60)}min)`, `Português (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "SFN + 15 questões Cesgranrio",
            },
            {
              dia: "Terça-feira",
              disciplinas: [`Vendas e Negociação (${Math.round(dailyHours * 0.6 * 60)}min)`, `Informática (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "Técnicas de Vendas + Segurança Digital",
            },
            {
              dia: "Quarta-feira",
              disciplinas: [`Conhecimentos Bancários (${Math.round(dailyHours * 0.6 * 60)}min)`, `Matemática Financeira (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "Produtos Bancários + Juros Compostos",
            },
            {
              dia: "Quinta-feira",
              disciplinas: [`Vendas e Negociação (${Math.round(dailyHours * 0.6 * 60)}min)`, `Informática (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "LGPD e CDC + Excel e Nuvem",
            },
            {
              dia: "Sexta-feira",
              disciplinas: [`Conhecimentos Bancários (${Math.round(dailyHours * 0.5 * 60)}min)`, `Redação Dissertativa (${Math.round(dailyHours * 0.5 * 60)}min)`],
              foco: "Redação de tema bancário + Lavagem de Dinheiro",
            },
            {
              dia: "Sábado",
              disciplinas: [`Simulado 70 questões Cesgranrio (${dailyHours}h)`],
              foco: "Treino de tempo de prova",
            },
            {
              dia: "Domingo",
              disciplinas: [`Revisão e Flashcards (${Math.round(dailyHours * 0.5 * 60)}min)`],
              foco: "Flashcards de taxas e produtos bancários",
            },
          ],
        },
        mensagem_mentor: "O segredo do Banco do Brasil é gabaritar Vendas e Conhecimentos Bancários. Mantenha seu ritmo diário e treine uma redação por semana!",
      };
    },
  },
  pcdf: {
    info: {
      concurso_identificado: "PCDF - Polícia Civil do Distrito Federal",
      orgao: "Polícia Civil do Distrito Federal",
      cargo: "Agente de Polícia Civil",
      banca: "Cebraspe",
      status: "Edital Consolidado / Concurso Referência Nacional",
      ano_edital: "2021/2024",
      escolaridade: "Nível Superior em Qualquer Área",
      remuneracao: "R$ 11.105,00 a R$ 18.417,51",
      resumo_rapido: "Uma das melhores polícias civis do Brasil. Contabilidade e Informática respondem por mais de 50% dos itens da prova.",
      mensagem_confirmacao: "Encontrei o edital da PCDF para Agente de Polícia com banca Cebraspe (120 itens C/E). Posso gerar seu plano de estudos estratégico?",
      confiabilidade: "alta",
      necessita_mais_detalhes: false,
      perguntas_complementares: [],
    },
    getPlano: (dailyHours: number) => {
      const h1 = dailyHours >= 3 ? "1h20" : "50min";
      const h2 = dailyHours >= 3 ? "40min" : "30min";
      return {
        concurso: "PCDF - Agente de Polícia Civil",
        cargo: "Agente de Polícia",
        banca: "Cebraspe",
        ano_edital: "2021/2024",
        horas_disponiveis_por_dia: `${dailyHours} horas por dia`,
        resumo_edital: {
          total_vagas: "1.800 vagas (600 imediatas + 1.200 CR)",
          salario_inicial: "R$ 11.105,00 + auxílios",
          escolaridade: "Nível Superior Completo + CNH B",
          estrutura_prova: "120 itens Cebraspe (50 Básicos + 70 Específicos) + Discursiva + TAF",
          data_provavel: "Vigente",
          destaques_importantes: [
            "Informática (Banco de Dados, Redes, Python/R) tem peso colossal (30 a 35 itens).",
            "Contabilidade Geral representa 10 a 15 itens decisivos.",
            "Língua Portuguesa com 20 a 25 itens essenciais no Cebraspe.",
          ],
        },
        disciplinas: [
          {
            id: "informatica-ti",
            nome: "Informática & Ciência de Dados",
            peso: "alto",
            peso_pontuacao: "30 a 35 itens (~28% da prova)",
            ordem_importancia: 1,
            porcentagem_tempo_estudo: 35,
            horas_por_dia: h1,
            horas_diarias_sugeridas: h1,
            horas_semanais_sugeridas: Math.round(dailyHours * 2.5),
            topicos: [
              "Banco de Dados Relacional, SQL, Modelo Entidade-Relacionamento e NoSQL",
              "Conceitos de Big Data, Mineração de Dados e Aprendizado de Máquina",
              "Redes de Computadores: Protocolos TCP/IP, DNS, DHCP, Roteamento e Segurança",
              "Segurança da Informação: Ataques cibernéticos, SIEM e Criptografia",
              "Noções de Linguagens de Programação (Python e R)",
            ],
            video_youtube: "https://www.youtube.com/watch?v=3g8qP1k1Y2A",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Informatica PCDF Cebraspe Banco de Dados Python"),
            video_titulo: "Informática PCDF e Polícia Federal - Aula Completa",
            canal_sugerido: "Gran Concursos",
            busca_youtube_termo: "Informatica PCDF Cebraspe Banco de Dados Python",
            por_que_importa: "É a disciplina que define a aprovação na PCDF e na PF moderna.",
            estrategia_estudo: "Praticar comandos SQL e conceitos de banco de dados e redes todos os dias.",
          },
          {
            id: "contabilidade",
            nome: "Contabilidade Geral",
            peso: "alto",
            peso_pontuacao: "10 a 15 itens (~10% da prova)",
            ordem_importancia: 2,
            porcentagem_tempo_estudo: 25,
            horas_por_dia: h1,
            horas_diarias_sugeridas: h1,
            horas_semanais_sugeridas: Math.round(dailyHours * 2),
            topicos: [
              "Conceitos, objetivos e finalidades da Contabilidade",
              "Patrimônio: Ativo, Passivo e Patrimônio Líquido (Equação Fundamental)",
              "Fatos Contábeis: Permutativos, Modificativos e Mistos",
              "Escrituração: Método das Partidas Dobradas, Razonetes e Lançamentos",
              "Demonstrações Contábeis: Balanço Patrimonial e DRE",
            ],
            video_youtube: "https://www.youtube.com/watch?v=9g0e2hR7d2I",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Contabilidade Geral PCDF Cebraspe aula completa"),
            video_titulo: "Contabilidade do Zero para Carreiras Policiais",
            canal_sugerido: "Estratégia Concursos",
            busca_youtube_termo: "Contabilidade Geral PCDF Cebraspe aula completa",
            por_que_importa: "Maioria dos concorrentes negligencia essa matéria por receio de cálculos.",
            estrategia_estudo: "Focar na lógica de débito e crédito (Origens e Aplicações de recursos).",
          },
          {
            id: "portugues",
            nome: "Língua Portuguesa",
            peso: "alto",
            peso_pontuacao: "20 a 25 itens (~18% da prova)",
            ordem_importancia: 3,
            porcentagem_tempo_estudo: 20,
            horas_por_dia: h2,
            horas_diarias_sugeridas: h2,
            horas_semanais_sugeridas: Math.round(dailyHours * 1.5),
            topicos: [
              "Interpretação e Tipologia Textual no estilo Cebraspe",
              "Sintaxe de Regência, Concordância e Crase",
              "Pontuação e Reescritura de Frases",
              "Manual de Redação da Presidência da República",
            ],
            video_youtube: "https://www.youtube.com/watch?v=sM34y4x4uG8",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Portugues Cebraspe Policia Civil"),
            video_titulo: "Português Cebraspe - Reta Final Carreiras Policiais",
            canal_sugerido: "Alfacon",
            busca_youtube_termo: "Portugues Cebraspe Policia Civil",
            por_que_importa: "Pontuação básica com peso alto na classificação final e redação discursiva.",
            estrategia_estudo: "Resolução contínua de provas anteriores da PCDF e PF.",
          },
          {
            id: "direito-penal-processo",
            nome: "Direito Penal & Processual Penal",
            peso: "medio",
            peso_pontuacao: "15 itens (~12% da prova)",
            ordem_importancia: 4,
            porcentagem_tempo_estudo: 12,
            horas_por_dia: "30min",
            horas_diarias_sugeridas: "30min",
            horas_semanais_sugeridas: 1,
            topicos: [
              "Teoria do Crime: Fato Típico, Ilicitude e Culpabilidade",
              "Crimes contra a Pessoa, contra o Patrimônio e contra a Administração Pública",
              "Inquérito Policial (características e prazos)",
              "Prisão em Flagrante, Prisão Preventiva e Temporária (Lei 7.960/89)",
              "Legislação Especial: Lei de Drogas (11.343), Abuso de Autoridade (13.869) e Armas (10.826)",
            ],
            video_youtube: "https://www.youtube.com/watch?v=1VqJbL8M9nQ",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Direito Penal Inquerito Policial PCDF Cebraspe"),
            video_titulo: "Direito Penal e Processo Penal Esquematizado PCDF",
            canal_sugerido: "Direção Concursos",
            busca_youtube_termo: "Direito Penal Inquerito Policial PCDF Cebraspe",
            por_que_importa: "Diretamente ligado ao trabalho policial diário.",
            estrategia_estudo: "Leitura da Lei Seca dos crimes e súmulas do STF/STJ.",
          },
          {
            id: "administrativo-constitucional",
            nome: "Direito Administrativo & Constitucional",
            peso: "medio",
            peso_pontuacao: "15 itens (~12% da prova)",
            ordem_importancia: 5,
            porcentagem_tempo_estudo: 8,
            horas_por_dia: "20min",
            horas_diarias_sugeridas: "20min",
            horas_semanais_sugeridas: 1,
            topicos: [
              "Direitos e Garantias Fundamentais (Art. 5º)",
              "Segurança Pública (Art. 144 da CF/88)",
              "Poderes Administrativos e Responsabilidade Civil do Estado",
              "Lei Orgânica do DF (LODF) e Lei 8.112/90",
            ],
            video_youtube: "https://www.youtube.com/watch?v=9g0e2hR7d2I",
            video_youtube_busca_fallback: formatYouTubeSearchFallback("Seguranca Publica Artigo 144 CF88 PCDF Cebraspe"),
            video_titulo: "Artigo 144 Segurança Pública CF88",
            canal_sugerido: "QConcursos",
            busca_youtube_termo: "Seguranca Publica Artigo 144 CF88 PCDF Cebraspe",
            por_que_importa: "Questões literais onde não se pode perder pontos fáceis.",
            estrategia_estudo: "Esquematizar o Art. 144 da CF e os órgãos de segurança.",
          },
        ],
        ciclo_sugerido: {
          metodologia: `Ciclo Diário PCDF Agente (${dailyHours}h/dia)`,
          distribuicao_dias: [
            {
              dia: "Segunda-feira",
              disciplinas: [`Informática & Banco de Dados (${Math.round(dailyHours * 0.6 * 60)}min)`, `Português (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "SQL e Redes + 20 questões Cebraspe",
            },
            {
              dia: "Terça-feira",
              disciplinas: [`Contabilidade Geral (${Math.round(dailyHours * 0.6 * 60)}min)`, `Direito Penal (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "Lançamentos e Balanço + Teoria do Crime",
            },
            {
              dia: "Quarta-feira",
              disciplinas: [`Informática & Python (${Math.round(dailyHours * 0.6 * 60)}min)`, `Processo Penal (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "Noções de Programação + Inquérito e Prisões",
            },
            {
              dia: "Quinta-feira",
              disciplinas: [`Contabilidade Geral (${Math.round(dailyHours * 0.6 * 60)}min)`, `Direito Administrativo (${Math.round(dailyHours * 0.4 * 60)}min)`],
              foco: "DRE e Razonetes + Poder de Polícia",
            },
            {
              dia: "Sexta-feira",
              disciplinas: [`Informática & Segurança (${Math.round(dailyHours * 0.5 * 60)}min)`, `Redação Discursiva (${Math.round(dailyHours * 0.5 * 60)}min)`],
              foco: "Treino de texto temático para Cebraspe",
            },
            {
              dia: "Sábado",
              disciplinas: [`Simulado 120 itens Cebraspe PCDF (${dailyHours}h)`],
              foco: "Simulado com penalização 1 errada anula 1 certa",
            },
            {
              dia: "Domingo",
              disciplinas: [`Revisão Espaçada e TAF (${Math.round(dailyHours * 0.5 * 60)}min)`],
              foco: "Flashcards de TI e treino físico leve",
            },
          ],
        },
        mensagem_mentor: "A PCDF é conquistada na dobradinha Informática + Contabilidade. Domine SQL e débito/crédito enquanto mantém o português afiado!",
      };
    },
  },
};

// Generic dynamic synthesizer that builds a structured edital study plan for ANY Brazilian contest when API is busy
export function buildDynamicFallbackPlan(concursoName: string, cargoName: string, bancaName: string, dailyHours: number): FallbackPlanoData {
  const cName = concursoName || "Concurso Público Selecionado";
  const cargo = cargoName || "Cargo Efetivo Principal";
  const banca = bancaName || "Banca Oficial (Cebraspe / FGV / FCC / Vunesp)";
  const h1 = dailyHours >= 3 ? "1h15 por dia" : "45min por dia";
  const h2 = dailyHours >= 3 ? "45min por dia" : "30min por dia";
  const h3 = "20min por dia";

  return {
    concurso: cName,
    cargo,
    banca,
    ano_edital: "Mais Recente / Vigente",
    horas_disponiveis_por_dia: `${dailyHours} horas por dia`,
    resumo_edital: {
      total_vagas: "Vagas imediatas + Cadastro de Reserva",
      salario_inicial: "Remuneração compatível com a carreira pública",
      escolaridade: "Conforme requisitos do cargo",
      estrutura_prova: `Prova Objetiva de Alta Relevância (${banca}) + Avaliação de Títulos/Discursiva`,
      data_provavel: "Cronograma oficial do edital",
      destaques_importantes: [
        "Plano estratégico ordenado estritamente por peso e índice de cobrança da banca.",
        "Divisão diária balanceada para evitar sobrecarga e garantir revisões 24/7/30.",
        "Aulas e termos de busca recomendados no YouTube para cada tópico.",
      ],
    },
    disciplinas: [
      {
        id: "conhecimentos-especificos-1",
        nome: `Conhecimentos Específicos de ${cargo}`,
        peso: "alto",
        peso_pontuacao: "35% a 45% do peso total da prova",
        ordem_importancia: 1,
        porcentagem_tempo_estudo: 40,
        horas_por_dia: h1,
        horas_diarias_sugeridas: h1,
        horas_semanais_sugeridas: Math.round(dailyHours * 2.5),
        topicos: [
          `Legislação e normas aplicadas ao órgão e ao cargo de ${cargo}`,
          "Doutrina específica, conceitos fundamentais e resoluções vigentes",
          "Rotinas operacionais, procedimentos padrão e estudo de casos práticos da banca",
          "Jurisprudência e súmulas dos tribunais superiores pertinentes",
        ],
        video_youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cName} ${cargo} conhecimentos especificos aula completa`)}`,
        video_youtube_busca_fallback: formatYouTubeSearchFallback(`${cName} ${cargo} conhecimentos especificos aula completa`),
        video_titulo: `Curso Completo: Específicas de ${cargo}`,
        canal_sugerido: "Gran Concursos / Estratégia",
        busca_youtube_termo: `${cName} ${cargo} conhecimentos especificos aula completa`,
        por_que_importa: "Possui o maior peso na pontuação final e o maior número de critérios de desempate.",
        estrategia_estudo: "Leitura atenta da legislação específica e resolução intensiva de questões anteriores.",
      },
      {
        id: "lingua-portuguesa",
        nome: "Língua Portuguesa",
        peso: "alto",
        peso_pontuacao: "20% a 25% da nota total",
        ordem_importancia: 2,
        porcentagem_tempo_estudo: 25,
        horas_por_dia: h2,
        horas_diarias_sugeridas: h2,
        horas_semanais_sugeridas: Math.round(dailyHours * 1.5),
        topicos: [
          `Interpretação de textos e inferência contextual no perfil da ${banca}`,
          "Sintaxe: Concordância verbal e nominal, Regência e Emprego do sinal de crase",
          "Pontuação, reescritura de orações e paralelismo sintático",
          "Ortografia oficial e acentuação gráfica",
        ],
        video_youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(`Portugues para concursos ${banca} aula completa`)}`,
        video_youtube_busca_fallback: formatYouTubeSearchFallback(`Portugues para concursos ${banca} aula completa`),
        video_titulo: `Português Focado na Banca ${banca}`,
        canal_sugerido: "QConcursos / Alfacon",
        busca_youtube_termo: `Portugues ${banca} aula completa`,
        por_que_importa: "Disciplina eliminatória presente em todos os cargos que define a nota de corte.",
        estrategia_estudo: "Resolver no mínimo 20 questões por dia da banca para mapear o estilo de enunciados.",
      },
      {
        id: "direito-administrativo-constitucional",
        nome: "Direito Administrativo & Constitucional",
        peso: "medio",
        peso_pontuacao: "15% a 20% da nota",
        ordem_importancia: 3,
        porcentagem_tempo_estudo: 20,
        horas_por_dia: h2,
        horas_diarias_sugeridas: h2,
        horas_semanais_sugeridas: Math.round(dailyHours * 1),
        topicos: [
          "Princípios da Administração Pública (LIMPE) e Organização do Estado",
          "Atos Administrativos: Requisitos, atributos, anulação e revogação",
          "Direitos e Garantias Fundamentais (Art. 5º da CF/88)",
          "Regime Jurídico dos Servidores e Lei de Improbidade Administrativa (Lei 8.429/92 atualizada)",
        ],
        video_youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(`Direito Administrativo e Constitucional ${banca} resumo`)}`,
        video_youtube_busca_fallback: formatYouTubeSearchFallback(`Direito Administrativo e Constitucional ${banca} aula completa`),
        video_titulo: "Direito Administrativo e Constitucional Esquematizado",
        canal_sugerido: "Direção Concursos",
        busca_youtube_termo: `Direito Administrativo ${banca} aula completa`,
        por_que_importa: "Garante base jurídica sólida para todas as questões da prova objetiva.",
        estrategia_estudo: "Apostar em mnemônicos e mapas mentais para fixação rápida dos prazos e requisitos.",
      },
      {
        id: "raciocinio-logico-informatica",
        nome: "Raciocínio Lógico & Informática Básica",
        peso: "baixo",
        peso_pontuacao: "10% a 15% da nota",
        ordem_importancia: 4,
        porcentagem_tempo_estudo: 15,
        horas_por_dia: h3,
        horas_diarias_sugeridas: h3,
        horas_semanais_sugeridas: 1,
        topicos: [
          "Lógica proposicional, equivalências e negações lógicas",
          "Noções de Segurança da Informação, senhas seguras e nuvem",
          "Sistemas operacionais e manipulação de planilhas/documentos",
        ],
        video_youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(`Raciocinio Logico e Informatica ${banca} para concursos`)}`,
        video_youtube_busca_fallback: formatYouTubeSearchFallback(`Raciocinio Logico e Informatica ${banca} para concursos`),
        video_titulo: "Raciocínio Lógico e Informática Prática",
        canal_sugerido: "Gran Concursos",
        busca_youtube_termo: `Raciocinio Logico ${banca} aula completa`,
        por_que_importa: "Assegura os pontos necessários para atingir os mínimos exigidos em cada bloco do edital.",
        estrategia_estudo: "Treinar tabela-verdade e conectivos lógicos com exercícios diários.",
      },
    ],
    ciclo_sugerido: {
      metodologia: `Ciclo Diário Estratégico (${dailyHours}h/dia) + Método 24/7/30`,
      distribuicao_dias: [
        {
          dia: "Segunda-feira",
          disciplinas: [`Conhecimentos Específicos (${Math.round(dailyHours * 0.6 * 60)}min)`, `Língua Portuguesa (${Math.round(dailyHours * 0.4 * 60)}min)`],
          foco: "Teoria da matéria principal + 20 questões comentadas",
        },
        {
          dia: "Terça-feira",
          disciplinas: [`Direito Administrativo & Constitucional (${Math.round(dailyHours * 0.6 * 60)}min)`, `Conhecimentos Específicos (${Math.round(dailyHours * 0.4 * 60)}min)`],
          foco: "Leitura de legislação seca + Fixação",
        },
        {
          dia: "Quarta-feira",
          disciplinas: [`Língua Portuguesa (${Math.round(dailyHours * 0.5 * 60)}min)`, `Raciocínio Lógico / Informática (${Math.round(dailyHours * 0.5 * 60)}min)`],
          foco: "Resolução de exercícios práticos da banca",
        },
        {
          dia: "Quinta-feira",
          disciplinas: [`Conhecimentos Específicos (${Math.round(dailyHours * 0.6 * 60)}min)`, `Direito Administrativo (${Math.round(dailyHours * 0.4 * 60)}min)`],
          foco: "Estudo de pegadinhas e jurisprudência",
        },
        {
          dia: "Sexta-feira",
          disciplinas: [`Revisão Semanal dos Tópicos (${Math.round(dailyHours * 0.5 * 60)}min)`, `Bateria de 30 Questões (${Math.round(dailyHours * 0.5 * 60)}min)`],
          foco: "Mapeamento dos pontos com maior índice de erros",
        },
        {
          dia: "Sábado",
          disciplinas: [`Simulado Completo no Perfil da ${banca} (${dailyHours}h)`],
          foco: "Treinamento cronometrado de prova real",
        },
        {
          dia: "Domingo",
          disciplinas: [`Revisão Espaçada e Flashcards (${Math.round(dailyHours * 0.5 * 60)}min)`],
          foco: "Descanso ativo e fixação mnemônica",
        },
      ],
    },
    mensagem_mentor: `Você tem em mãos um plano cirúrgico para o concurso de ${cName}. Mantenha sua meta diária de ${dailyHours}h com constância, resolva muitas questões da banca e a vaga será sua!`,
  };
}

export function matchPopularConcurso(query: string) {
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (q.includes("inss") || q.includes("seguro social") || q.includes("previdenciario")) {
    return POPULAR_CONCURSOS.inss;
  }
  if (q.includes("banco do brasil") || q.includes("bb") || q.includes("escriturario") || q.includes("agente comercial")) {
    return POPULAR_CONCURSOS.banco_do_brasil;
  }
  if (q.includes("pcdf") || q.includes("policia civil do distrito") || (q.includes("policia civil") && q.includes("df"))) {
    return POPULAR_CONCURSOS.pcdf;
  }
  return null;
}
