
import { supabase } from './supabase';
import { Task, Scheduling, InverterConfig, AppUser, UserRole } from '../types';

// Check if Supabase is properly configured to avoid errors in demo mode
// @ts-ignore
import { isSupabaseConfigured } from './supabase';

// --- TASKS (Mantido LocalStorage por enquanto ou migrado se tabela existir) ---
const TASKS_KEY = 'cbc_solar_tasks_v1';
const INITIAL_TASKS: Task[] = []; 

export const getTasks = (): Task[] => {
  const stored = localStorage.getItem(TASKS_KEY);
  return stored ? JSON.parse(stored) : INITIAL_TASKS;
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// --- AUTHENTICATION & USERS (Supabase: app_users) ---

export const authLogin = async (username: string, pass: string): Promise<{ success: boolean, role?: UserRole, id?: string, error?: string }> => {
  if (!isSupabaseConfigured) {
    // Fallback for demo mode without keys
    if (username === 'admin' && pass === 'cbc2024') return { success: true, role: 'admin', id: 'demo-admin' };
    return { success: false, error: 'Modo demonstração: use admin/cbc2024' };
  }

  // Simple plain-text password check for this MVP internal tool. 
  // In production, use Supabase Auth or Hash passwords.
  const { data, error } = await supabase
    .from('app_users')
    .select('id, role, password')
    .eq('username', username)
    .single();

  if (error || !data) {
    console.error('Login error:', error);
    return { success: false, error: 'Usuário não encontrado.' };
  }

  if (data.password === pass) {
    return { success: true, role: data.role as UserRole, id: data.id };
  } else {
    return { success: false, error: 'Senha incorreta.' };
  }
};

export const verifyCurrentPassword = async (id: string, passwordToCheck: string): Promise<boolean> => {
  if (!isSupabaseConfigured) return true; // Demo mode always true

  const { data, error } = await supabase
    .from('app_users')
    .select('password')
    .eq('id', id)
    .single();

  if (error || !data) return false;
  return data.password === passwordToCheck;
};

export const getUsers = async (): Promise<AppUser[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('app_users').select('id, username, role, created_at').order('username');
  if (error) {
    console.error('Error fetching users:', JSON.stringify(error));
    return [];
  }
  return data as AppUser[];
};

export const createUser = async (user: Omit<AppUser, 'id' | 'created_at'>): Promise<{ success: boolean, msg?: string }> => {
  if (!isSupabaseConfigured) return { success: false, msg: "Banco de dados não configurado" };
  const { error } = await supabase.from('app_users').insert(user);
  if (error) {
    if (error.code === '23505') return { success: false, msg: 'Nome de usuário já existe.' };
    return { success: false, msg: error.message };
  }
  return { success: true };
};

export const updateUserPassword = async (id: string, newPass: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  await supabase.from('app_users').update({ password: newPass }).eq('id', id);
};

export const deleteUser = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  await supabase.from('app_users').delete().eq('id', id);
};


// --- SCHEDULINGS (Supabase) ---

export const getSchedulings = async (): Promise<Scheduling[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('schedulings')
    .select('*')
    .order('orderNumber', { ascending: false });

  if (error) {
    console.error('Supabase error fetch schedulings:', JSON.stringify(error));
    return [];
  }
  return data || [];
};

export const saveScheduling = async (scheduling: Scheduling): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.from('schedulings').select('id').eq('id', scheduling.id).single();
  
  if (data) {
    const { error } = await supabase.from('schedulings').update(scheduling).eq('id', scheduling.id);
    if (error) console.error('Error updating scheduling:', JSON.stringify(error));
  } else {
    const { error } = await supabase.from('schedulings').insert(scheduling);
    if (error) console.error('Error inserting scheduling:', JSON.stringify(error));
  }
};

export const saveSchedulings = async (schedulings: Scheduling[]): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('schedulings').upsert(schedulings);
  if (error) console.error('Error saving schedulings batch:', JSON.stringify(error));
};

export const deleteScheduling = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('schedulings').delete().eq('id', id);
  if (error) console.error('Error deleting scheduling:', JSON.stringify(error));
};


// --- INVERTER CONFIGURATIONS (Supabase) ---

export const getInverterConfigs = async (): Promise<InverterConfig[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('inverter_configs')
    .select('*')
    .order('orderNumber', { ascending: false });

  if (error) {
    console.error('Supabase error fetch inverters:', JSON.stringify(error));
    return [];
  }
  return data || [];
};

export const saveInverterConfig = async (config: InverterConfig): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.from('inverter_configs').select('id').eq('id', config.id).single();
  
  if (data) {
    await supabase.from('inverter_configs').update(config).eq('id', config.id);
  } else {
    await supabase.from('inverter_configs').insert(config);
  }
};

export const deleteInverterConfig = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  await supabase.from('inverter_configs').delete().eq('id', id);
};


// --- LISTS (Settings Table in Supabase: app_settings { key, value }) ---

const getListFromSupabase = async (key: string, defaultList: string[]): Promise<string[]> => {
  if (!isSupabaseConfigured) return defaultList;
  const { data, error } = await supabase.from('app_settings').select('value').eq('key', key).single();
  if (error || !data) return defaultList;
  return data.value as string[];
};

const saveListToSupabase = async (key: string, list: string[]): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('app_settings').upsert({ key, value: list });
  if (error) console.error(`Error saving list ${key}:`, JSON.stringify(error));
};

export const getServicesList = async (): Promise<string[]> => {
  return getListFromSupabase('services', ['Instalação Solar', 'Manutenção', 'Limpeza']);
};
export const saveServicesList = async (list: string[]) => saveListToSupabase('services', list);

export const getSalespeopleList = async (): Promise<string[]> => {
  return getListFromSupabase('salespeople', ['Carlos', 'Ana']);
};
export const saveSalespeopleList = async (list: string[]) => saveListToSupabase('salespeople', list);

export const getTeamsList = async (): Promise<string[]> => {
  return getListFromSupabase('teams', ['Equipe Alpha', 'Técnico João']);
};
export const saveTeamsList = async (list: string[]) => saveListToSupabase('teams', list);
