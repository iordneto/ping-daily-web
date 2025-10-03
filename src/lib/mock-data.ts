// Tipos para os dados mockados
export interface SlackUser {
  id: string;
  name: string;
  displayName: string;
  avatar?: string;
  email: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  displayName: string;
  memberCount: number;
  isPrivate: boolean;
  hasConfiguration: boolean;
}

export interface DailyStandupConfig {
  id: string;
  channelId: string;
  message: string;
  frequency: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[];
  time: string; // formato HH:MM
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyStandupResponse {
  userId: string;
  message: string;
  timestamp: string;
  status: "completed" | "partial" | "missed";
}

export interface DailyStandupHistory {
  id: string;
  channelId: string;
  configId: string;
  date: string;
  sentAt: string;
  responseRate: number; // 0-100
  totalMembers: number;
  responses: DailyStandupResponse[];
  compiledMessage?: string;
}

// Dados mockados
export const mockUsers: SlackUser[] = [
  {
    id: "U01234567",
    name: "john.doe",
    displayName: "John Doe",
    email: "john.doe@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "U01234568",
    name: "jane.smith",
    displayName: "Jane Smith",
    email: "jane.smith@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  {
    id: "U01234569",
    name: "mike.wilson",
    displayName: "Mike Wilson",
    email: "mike.wilson@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
  },
  {
    id: "U01234570",
    name: "sarah.jones",
    displayName: "Sarah Jones",
    email: "sarah.jones@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: "U01234571",
    name: "carlos.rodriguez",
    displayName: "Carlos Rodriguez",
    email: "carlos.rodriguez@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
  },
];

export const mockChannels: SlackChannel[] = [
  {
    id: "C01234567",
    name: "development-team",
    displayName: "#development-team",
    memberCount: 8,
    isPrivate: false,
    hasConfiguration: true,
  },
  {
    id: "C01234568",
    name: "product-team",
    displayName: "#product-team",
    memberCount: 5,
    isPrivate: false,
    hasConfiguration: true,
  },
  {
    id: "C01234569",
    name: "design-team",
    displayName: "#design-team",
    memberCount: 4,
    isPrivate: false,
    hasConfiguration: false,
  },
  {
    id: "C01234570",
    name: "marketing",
    displayName: "#marketing",
    memberCount: 6,
    isPrivate: false,
    hasConfiguration: true,
  },
  {
    id: "C01234571",
    name: "executive-team",
    displayName: "#executive-team",
    memberCount: 3,
    isPrivate: true,
    hasConfiguration: false,
  },
];

export const mockConfigs: DailyStandupConfig[] = [
  {
    id: "CONFIG001",
    channelId: "C01234567",
    message:
      "🌅 Bom dia, equipe! Hora do daily standup:\n\n1. **O que você fez ontem?**\n2. **No que vai trabalhar hoje?**\n3. **Algum impedimento ou bloqueio?**\n\nPor favor, respondam até às 10h! 🚀",
    frequency: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    time: "09:00",
    timezone: "America/Sao_Paulo",
    isActive: true,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "CONFIG002",
    channelId: "C01234568",
    message:
      "📊 Daily check-in time!\n\n• What did you accomplish yesterday?\n• What are your priorities today?\n• Any blockers or help needed?\n\nLet's keep the momentum going! 💪",
    frequency: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    time: "09:30",
    timezone: "America/Sao_Paulo",
    isActive: true,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T14:15:00Z",
  },
  {
    id: "CONFIG003",
    channelId: "C01234570",
    message:
      "🎯 Weekly sync time!\n\n1. Key achievements this week\n2. Priorities for next week\n3. Support needed from other teams\n\nThanks team! 📈",
    frequency: ["friday"],
    time: "16:00",
    timezone: "America/Sao_Paulo",
    isActive: true,
    createdAt: "2024-01-08T12:00:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
  },
];

export const mockHistory: DailyStandupHistory[] = [
  {
    id: "HIST001",
    channelId: "C01234567",
    configId: "CONFIG001",
    date: "2024-01-25",
    sentAt: "2024-01-25T12:00:00Z",
    responseRate: 87,
    totalMembers: 8,
    responses: [
      {
        userId: "U01234567",
        message:
          "Ontem: Finalizei a API de autenticação\nHoje: Vou trabalhar na integração com frontend\nBloqueios: Nenhum",
        timestamp: "2024-01-25T12:15:00Z",
        status: "completed",
      },
      {
        userId: "U01234568",
        message:
          "Ontem: Code review e testes unitários\nHoje: Nova feature de notificações\nBloqueios: Aguardando design da UI",
        timestamp: "2024-01-25T12:22:00Z",
        status: "completed",
      },
      {
        userId: "U01234569",
        message:
          "Ontem: Bugfix no módulo de pagamentos\nHoje: Continuando com o refactor do database",
        timestamp: "2024-01-25T13:30:00Z",
        status: "partial",
      },
    ],
    compiledMessage:
      "📋 **Daily Standup Summary - 25/01/2024**\n\n**Taxa de resposta:** 87% (7/8 membros)\n\n**Principais atividades:**\n• Finalização da API de autenticação ✅\n• Code reviews e testes unitários ✅\n• Bugfix no módulo de pagamentos ✅\n\n**Próximas prioridades:**\n• Integração frontend com API\n• Feature de notificações\n• Refactor do database\n\n**Bloqueios identificados:**\n• Aguardando design da UI para notificações\n\n---\n*Resumo gerado automaticamente pelo Ping Daily*",
  },
  {
    id: "HIST002",
    channelId: "C01234567",
    configId: "CONFIG001",
    date: "2024-01-24",
    sentAt: "2024-01-24T12:00:00Z",
    responseRate: 100,
    totalMembers: 8,
    responses: [
      {
        userId: "U01234567",
        message:
          "Ontem: Setup do ambiente de desenvolvimento\nHoje: Implementação da autenticação JWT\nBloqueios: Nenhum",
        timestamp: "2024-01-24T12:05:00Z",
        status: "completed",
      },
      {
        userId: "U01234568",
        message:
          "Ontem: Análise de requisitos\nHoje: Criação dos testes unitários\nBloqueios: Nenhum",
        timestamp: "2024-01-24T12:12:00Z",
        status: "completed",
      },
    ],
    compiledMessage:
      "📋 **Daily Standup Summary - 24/01/2024**\n\n**Taxa de resposta:** 100% (8/8 membros)\n\n**Principais atividades:**\n• Setup do ambiente de desenvolvimento ✅\n• Análise de requisitos ✅\n\n**Próximas prioridades:**\n• Implementação da autenticação JWT\n• Criação dos testes unitários\n\n**Bloqueios identificados:**\n• Nenhum bloqueio reportado\n\n---\n*Resumo gerado automaticamente pelo Ping Daily*",
  },
  {
    id: "HIST003",
    channelId: "C01234568",
    configId: "CONFIG002",
    date: "2024-01-25",
    sentAt: "2024-01-25T12:30:00Z",
    responseRate: 60,
    totalMembers: 5,
    responses: [
      {
        userId: "U01234570",
        message:
          "Yesterday: Product roadmap review\nToday: User research interviews\nBlockers: None",
        timestamp: "2024-01-25T12:45:00Z",
        status: "completed",
      },
      {
        userId: "U01234571",
        message:
          "Yesterday: Competitive analysis\nToday: Feature specifications",
        timestamp: "2024-01-25T14:20:00Z",
        status: "partial",
      },
    ],
    compiledMessage:
      "📋 **Daily Standup Summary - 25/01/2024**\n\n**Taxa de resposta:** 60% (3/5 membros)\n\n**Principais atividades:**\n• Product roadmap review ✅\n• Competitive analysis ✅\n\n**Próximas prioridades:**\n• User research interviews\n• Feature specifications\n\n**Bloqueios identificados:**\n• Nenhum bloqueio reportado\n\n---\n*Resumo gerado automaticamente pelo Ping Daily*",
  },
];

// Função para buscar canais com configuração
export function getChannelsWithConfig(): SlackChannel[] {
  return mockChannels.filter((channel) => channel.hasConfiguration);
}

// Função para buscar canais disponíveis (sem configuração)
export function getAvailableChannels(): SlackChannel[] {
  return mockChannels.filter((channel) => !channel.hasConfiguration);
}

// Função para buscar histórico por ID do canal
export function getHistoryByChannelId(
  channelId: string
): DailyStandupHistory[] {
  return mockHistory
    .filter((history) => history.channelId === channelId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
