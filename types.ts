
export enum TaskCategory {
  WORK = 'trabalho',
  PERSONAL = 'pessoal',
  TEAM = 'equipe'
}

export enum TaskPriority {
  HIGH = 'alta',
  MEDIUM = 'media',
  LOW = 'baixa'
}

export enum TaskStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em_andamento',
  COMPLETED = 'concluida'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string; // ISO Date string
  dueDate: string; // YYYY-MM-DD
  alarmTime: string; // HH:mm
  assignee: string;
  tags: string[];
}

// Novos tipos para Agendamentos
export enum SchedulingStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em_andamento',
  RESOLVED = 'resolvido'
}

export enum SchedulingPriority {
  LOW = 'baixa',
  MEDIUM = 'media',
  HIGH = 'alta',
  URGENT = 'urgente'
}

export interface Scheduling {
  id: string;
  orderNumber: string; // Começa em 01, automatico
  registrationDate: string; // Data e hora do registro
  client: string;
  phone: string; // Novo campo Telefone
  salesperson: string;
  location: string;
  service: string;
  team: string;
  observation: string;
  scheduledDate: string; // Data agendada
  scheduledTime: string; // Hora agendada (opcional, separado para facilitar input)
  value: number;
  status: SchedulingStatus;
  priority: SchedulingPriority; // Novo campo Prioridade
  completionDate?: string; // Inserir data quando status for resolvido
}

// Novos tipos para Configuração de Inversor (Duplicado de Agendamento)
export interface InverterConfig {
  id: string;
  orderNumber: string;
  registrationDate: string;
  client: string;
  phone: string;
  salesperson: string; // Vendedor/Responsável
  location: string;
  inverterModel: string; // Equivalente a 'service'
  team: string; // Técnico
  observation: string;
  scheduledDate: string;
  scheduledTime: string;
  value: number; // Custo ou Valor do serviço
  status: SchedulingStatus; // Reutilizando o enum de status
  priority: SchedulingPriority; // Novo campo Prioridade
  completionDate?: string;
}

// Novo tipo para Instalação
export interface Installation {
  id: string;
  orderNumber: string;
  registrationDate: string;
  client: string;
  location: string;
  salesperson: string;
  contractDate: string; // Data do contrato
  deadlineDate: string; // Data limite (Contrato + 90 dias)
  arrivalDate: string; // Chegada das placas
  panelQuantity: number;
  kwp: number;
  scheduledDate: string; // Data agendada da instalação
  completionDate?: string; // Data conclusão
  team: string;
  status: SchedulingStatus;
  priority: SchedulingPriority;
  observation: string;
}

<<<<<<< HEAD
// Novo tipo para Clientes
export interface Client {
  id: string;
  name: string;
  phone: string;
  location: string;
  salesperson: string;
  notes: string;
  created_at?: string;
}

// Novo tipo para Reembolso (Financeiro)
export interface Refund {
  id: string;
  team: string;
  date: string;
  description: string;
  value: number;
  created_at?: string;
}

// Novo tipo para Lembretes (Post-its)
export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  color: string; // Hex code or class
  is_completed: boolean;
  completion_date?: string;
  is_archived: boolean;
  created_at?: string;
}

=======
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
export interface StatisticsData {
  name: string;
  value: number;
  fill: string;
}

<<<<<<< HEAD
export type ViewMode = 'dashboard' | 'scheduling' | 'inverter_config' | 'installation' | 'refund' | 'reminder' | 'clients' | TaskCategory;
=======
export type ViewMode = 'dashboard' | 'scheduling' | 'inverter_config' | 'installation' | TaskCategory;
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8

// --- AUTH TYPES ---
export type UserRole = 'admin' | 'user';

export interface AppUser {
  id: string;
  username: string;
  role: UserRole;
  created_at?: string;
  password?: string; // Only used for creation/update payloads, not always returned
}
