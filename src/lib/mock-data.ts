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

// Função para buscar canais com configuração
export function getChannelsWithConfig(): SlackChannel[] {
  return mockChannels.filter((channel) => channel.hasConfiguration);
}

// Função para buscar canais disponíveis (sem configuração)
export function getAvailableChannels(): SlackChannel[] {
  return mockChannels.filter((channel) => !channel.hasConfiguration);
}
