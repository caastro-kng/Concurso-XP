export interface UserProfile {
  id: string;
  name: string;
  email: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  horasDiarias: number; // 1, 2, 3, 4 (ou mais)
  horasSemana?: number;
  dataInicio?: string;
  concursosSalvos?: string[];
  protocoloOficial?: string;
  xp?: number;
  streakDias?: number;
  questoesFeitas?: number;
  questoesAcertos?: number;
}

export type MainAppSection = 'trilha' | 'revisoes' | 'tutor';

export interface StampData {
  id: string;
  title: string; // e.g. "HOMOLOGADO", "META CUMPRIDA", "DEFERIDO"
  subtitle?: string; // e.g. "Protocolo ConcursoXP • +120 XP"
  badgeType?: 'aprovado' | 'deferido' | 'meta' | 'conquista' | 'xp';
  colorTheme?: 'vermelho' | 'verde' | 'dourado';
}


export interface ConcursoIdentificado {
  concurso_identificado: string;
  orgao: string;
  cargo: string;
  banca: string;
  status: string;
  ano_edital: string;
  escolaridade?: string;
  remuneracao?: string;
  resumo_rapido?: string;
  mensagem_confirmacao: string;
  confiabilidade: 'alta' | 'media' | 'baixa';
  necessita_mais_detalhes?: boolean;
  perguntas_complementares?: string[];
}

export interface DisciplinaPlano {
  id: string;
  nome: string;
  peso: 'alto' | 'medio' | 'baixo';
  peso_pontuacao: string;
  ordem_importancia: number;
  porcentagem_tempo_estudo: number;
  horas_por_dia?: string;
  horas_diarias_sugeridas?: string;
  horas_semanais_sugeridas?: number;
  topicos: string[];
  topicosConcluidos?: string[];
  video_youtube_busca?: string;
  video_youtube_busca_fallback?: string;
  video_youtube?: string;
  video_titulo?: string;
  canal_sugerido?: string;
  busca_youtube_termo?: string;
  por_que_importa?: string;
  estrategia_estudo?: string;
}

export interface ResumoEdital {
  total_vagas?: string;
  salario_inicial?: string;
  escolaridade?: string;
  estrutura_prova?: string;
  data_provavel?: string;
  destaques_importantes?: string[];
}

export interface DiaCiclo {
  dia: string;
  disciplinas: string[];
  foco: string;
}

export interface CicloSugerido {
  metodologia: string;
  distribuicao_dias: DiaCiclo[];
}

export interface FlashcardItem {
  id: string;
  disciplina?: string;
  topico?: string;
  frente: string;
  verso: string;
  dica_mnemonica?: string;
  grau_cobranca?: string;
  intervalo?: '24h' | '7d' | '30d';
  proximaRevisao?: string;
}

export interface PlanoEstudoCompleto {
  id: string;
  dataCriacao: string;
  concurso: string;
  cargo: string;
  banca: string;
  ano_edital: string;
  resumo_edital?: ResumoEdital;
  disciplinas: DisciplinaPlano[];
  flashcards?: FlashcardItem[];
  ciclo_sugerido?: CicloSugerido;
  mensagem_mentor?: string;
  fontes?: Array<{ title: string; uri: string }>;
  horas_disponiveis_por_dia?: string;
  horasDiariasPlanejadas?: number;
  horasSemanaPlanejadas?: number;
}

export interface QuestaoBanca {
  id: string;
  enunciado: string;
  tipo: 'multipla_escolha' | 'certo_errado';
  alternativas?: Array<{ id: string; texto: string }>;
  gabarito: string;
  explicacao_detalhada: string;
  pegadinha_da_banca?: string;
  fonte?: string;
  disciplina?: string;
  topico?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  fontes?: Array<{ title: string; uri: string }>;
}
