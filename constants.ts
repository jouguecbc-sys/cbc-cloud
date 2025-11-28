import { Task, TaskCategory, TaskPriority, TaskStatus } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Reunião com Cliente Solar',
    description: 'Apresentação do projeto residencial zona sul.',
    category: TaskCategory.WORK,
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING,
    createdAt: new Date().toISOString(),
    dueDate: new Date().toISOString().split('T')[0],
    alarmTime: '14:30',
    assignee: 'João Silva',
    tags: ['vendas', 'reunião']
  },
  {
    id: '2',
    title: 'Comprar EPIs',
    description: 'Renovar estoque de capacetes e luvas.',
    category: TaskCategory.TEAM,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.IN_PROGRESS,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    alarmTime: '09:00',
    assignee: 'Logística',
    tags: ['compras', 'segurança']
  },
  {
    id: '3',
    title: 'Dentista',
    description: 'Consulta de rotina.',
    category: TaskCategory.PERSONAL,
    priority: TaskPriority.LOW,
    status: TaskStatus.COMPLETED,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    alarmTime: '18:00',
    assignee: 'Eu',
    tags: ['saúde']
  }
];

export const COLORS = {
  primary: '#2E8B57',
  secondary: '#3CB371',
  accent: '#FF8C00',
  accentHover: '#FFA500',
  white: '#FFFFFF',
  gray: '#6B7280',
  dark: '#1F2937'
};