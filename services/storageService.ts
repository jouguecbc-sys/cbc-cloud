
import { supabase } from './supabase';
<<<<<<< HEAD
import { Task, Scheduling, InverterConfig, Installation, Refund, Reminder, AppUser, UserRole, Client } from '../types';
=======
import { Task, Scheduling, InverterConfig, Installation, AppUser, UserRole } from '../types';
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8

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
    return { success: false, error: 'Modo demonstração: use admin/cbc2024. Configure suas chaves no arquivo services/supabase.ts para usar o banco de dados.' };
  }

  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('id, role, password')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Login error (DB):', JSON.stringify(error, null, 2));
      if (error.code === 'PGRST116') return { success: false, error: 'Usuário não encontrado.' };
<<<<<<< HEAD
      if (error.code === 'PGRST205') return { success: false, error: 'Tabela de usuários não encontrada. Execute o script SQL.' };
      return { success: false, error: 'Erro de conexão com banco de dados.' };
=======
      return { success: false, error: 'Erro de conexão com banco de dados. Verifique a internet ou as tabelas.' };
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
    }

    if (!data) {
      return { success: false, error: 'Usuário não encontrado.' };
    }

    if (data.password === pass) {
      return { success: true, role: data.role as UserRole, id: data.id };
    } else {
      return { success: false, error: 'Senha incorreta.' };
    }
  } catch (err: any) {
    console.error('Unexpected login error:', err);
    return { success: false, error: 'Erro inesperado no login.' };
  }
};

export const verifyCurrentPassword = async (id: string, passwordToCheck: string): Promise<boolean> => {
  if (!isSupabaseConfigured) return true; // Demo mode always true

  const { data, error } = await supabase
    .from('app_users')
    .select('password')
    .eq('id', id)
    .single();

  if (error || !data) {
    if (error) console.error('Error verifying password:', JSON.stringify(error, null, 2));
    return false;
  }
  return data.password === passwordToCheck;
};

export const getUsers = async (): Promise<AppUser[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('app_users').select('id, username, role, created_at').order('username');
  if (error) {
    console.error('Error fetching users:', JSON.stringify(error, null, 2));
    return [];
  }
  return data as AppUser[];
};

export const createUser = async (user: Omit<AppUser, 'id' | 'created_at'>): Promise<{ success: boolean, msg?: string }> => {
  if (!isSupabaseConfigured) return { success: false, msg: "Banco de dados não configurado" };
  const { error } = await supabase.from('app_users').insert(user);
  if (error) {
    console.error('Error creating user:', JSON.stringify(error, null, 2));
    if (error.code === '23505') return { success: false, msg: 'Nome de usuário já existe.' };
    return { success: false, msg: error.message };
  }
  return { success: true };
};

export const updateUserPassword = async (id: string, newPass: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('app_users').update({ password: newPass }).eq('id', id);
  if (error) console.error('Error updating password:', JSON.stringify(error, null, 2));
};

export const deleteUser = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('app_users').delete().eq('id', id);
  if (error) console.error('Error deleting user:', JSON.stringify(error, null, 2));
};


<<<<<<< HEAD
// --- CLIENTS (Supabase: clients) ---

export const getClients = async (): Promise<Client[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('clients').select('*').order('name');
  if (error) {
    if (error.code === 'PGRST205' || error.code === '42P01') {
      console.warn('Tabela "clients" não encontrada.');
      return [];
    }
    console.error('Supabase error fetch clients:', JSON.stringify(error, null, 2));
    return [];
  }
  return data || [];
};

export const saveClient = async (client: Client): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { ...payload } = client;
  const { error } = await supabase.from('clients').upsert(payload, { onConflict: 'name' });
  if (error) console.error('Error saving client:', JSON.stringify(error, null, 2));
};

export const updateClientCascading = async (client: Client, oldName?: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  
  // 1. Update/Insert the client record
  await saveClient(client);

  // 2. Cascade updates to other tables if name matches (or oldName if provided)
  const targetName = oldName || client.name;
  
  // Update Schedulings
  await supabase.from('schedulings').update({ 
    phone: client.phone, 
    location: client.location 
  }).eq('client', targetName);

  // Update Inverters
  await supabase.from('inverter_configs').update({ 
    phone: client.phone, 
    location: client.location 
  }).eq('client', targetName);

  // Update Installations
  await supabase.from('installations').update({ 
    location: client.location 
  }).eq('client', targetName);
};

export const deleteClient = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) console.error('Error deleting client:', JSON.stringify(error, null, 2));
};


=======
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
// --- SCHEDULINGS (Supabase: schedulings) ---

export const getSchedulings = async (): Promise<Scheduling[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('schedulings')
    .select('*')
<<<<<<< HEAD
    .order('orderNumber', { ascending: false });
=======
    .order('orderNumber', { ascending: false }); // Ensure sorting by orderNumber string usually works if padded
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8

  if (error) {
    console.error('Supabase error fetch schedulings:', JSON.stringify(error, null, 2));
    return [];
  }
  return data || [];
};

export const saveScheduling = async (scheduling: Scheduling): Promise<void> => {
  if (!isSupabaseConfigured) return;
  
<<<<<<< HEAD
  const { ...payload } = scheduling;
  const { error } = await supabase.from('schedulings').upsert(payload);
  if (error) console.error('Error saving scheduling:', JSON.stringify(error, null, 2));
=======
  // Create a clean payload removing any UI-only props if they exist
  const { ...payload } = scheduling;
  
  // Check existence
  const { data } = await supabase.from('schedulings').select('id').eq('id', scheduling.id).single();
  
  if (data) {
    const { error } = await supabase.from('schedulings').update(payload).eq('id', scheduling.id);
    if (error) console.error('Error updating scheduling:', JSON.stringify(error, null, 2));
  } else {
    const { error } = await supabase.from('schedulings').insert(payload);
    if (error) console.error('Error inserting scheduling:', JSON.stringify(error, null, 2));
  }
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
};

export const saveSchedulings = async (schedulings: Scheduling[]): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('schedulings').upsert(schedulings);
  if (error) console.error('Error saving schedulings batch:', JSON.stringify(error, null, 2));
};

export const deleteScheduling = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('schedulings').delete().eq('id', id);
  if (error) console.error('Error deleting scheduling:', JSON.stringify(error, null, 2));
};


// --- INVERTER CONFIGURATIONS (Supabase: inverter_configs) ---

export const getInverterConfigs = async (): Promise<InverterConfig[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('inverter_configs')
    .select('*')
    .order('orderNumber', { ascending: false });

  if (error) {
    console.error('Supabase error fetch inverters:', JSON.stringify(error, null, 2));
    return [];
  }
  return data || [];
};

export const saveInverterConfig = async (config: InverterConfig): Promise<void> => {
  if (!isSupabaseConfigured) return;
<<<<<<< HEAD
  const { ...payload } = config;
  const { error } = await supabase.from('inverter_configs').upsert(payload);
  if (error) console.error('Error saving inverter:', JSON.stringify(error, null, 2));
=======
  
  const { ...payload } = config;

  const { data } = await supabase.from('inverter_configs').select('id').eq('id', config.id).single();
  
  if (data) {
    const { error } = await supabase.from('inverter_configs').update(payload).eq('id', config.id);
    if (error) console.error('Error updating inverter:', JSON.stringify(error, null, 2));
  } else {
    const { error } = await supabase.from('inverter_configs').insert(payload);
    if (error) console.error('Error inserting inverter:', JSON.stringify(error, null, 2));
  }
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
};

export const deleteInverterConfig = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('inverter_configs').delete().eq('id', id);
  if (error) console.error('Error deleting inverter:', JSON.stringify(error, null, 2));
};

// --- INSTALLATIONS (Supabase: installations) ---

export const getInstallations = async (): Promise<Installation[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('installations')
    .select('*')
    .order('orderNumber', { ascending: false });

  if (error) {
    console.error('Supabase error fetch installations:', JSON.stringify(error, null, 2));
    return [];
  }
  return data || [];
};

export const saveInstallation = async (install: Installation): Promise<void> => {
  if (!isSupabaseConfigured) return;
<<<<<<< HEAD
  const { ...payload } = install;
  const { error } = await supabase.from('installations').upsert(payload);
  if (error) console.error('Error saving installation:', JSON.stringify(error, null, 2));
=======
  
  const { ...payload } = install;

  const { data } = await supabase.from('installations').select('id').eq('id', install.id).single();
  
  if (data) {
    const { error } = await supabase.from('installations').update(payload).eq('id', install.id);
    if (error) console.error('Error updating installation:', JSON.stringify(error, null, 2));
  } else {
    const { error } = await supabase.from('installations').insert(payload);
    if (error) console.error('Error inserting installation:', JSON.stringify(error, null, 2));
  }
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
};

export const deleteInstallation = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('installations').delete().eq('id', id);
  if (error) console.error('Error deleting installation:', JSON.stringify(error, null, 2));
};

<<<<<<< HEAD
// --- REFUNDS (Supabase: refunds) ---

export const getRefunds = async (): Promise<Refund[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('refunds')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    if (error.code === 'PGRST205' || error.code === '42P01') {
      console.warn('Tabela "refunds" não encontrada.');
      return [];
    }
    console.error('Supabase error fetch refunds:', JSON.stringify(error, null, 2));
    return [];
  }
  return data || [];
};

export const saveRefund = async (refund: Refund): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { ...payload } = refund;
  const { error } = await supabase.from('refunds').upsert(payload);
  if (error) console.error('Error saving refund:', JSON.stringify(error, null, 2));
};

export const deleteRefund = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('refunds').delete().eq('id', id);
  if (error) console.error('Error deleting refund:', JSON.stringify(error, null, 2));
};

// --- REMINDERS / POST-ITS (Supabase: reminders) ---

export const getReminders = async (): Promise<Reminder[]> => {
  if (!isSupabaseConfigured) return [];
  // Order by date ASC, then time ASC to show urgent first
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) {
    if (error.code === 'PGRST205' || error.code === '42P01') {
      console.warn('Tabela "reminders" não encontrada.');
      return [];
    }
    console.error('Supabase error fetch reminders:', JSON.stringify(error, null, 2));
    return [];
  }
  return data || [];
};

export const saveReminder = async (reminder: Reminder): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { ...payload } = reminder;
  const { error } = await supabase.from('reminders').upsert(payload);
  if (error) console.error('Error saving reminder:', JSON.stringify(error, null, 2));
};

export const deleteReminder = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('reminders').delete().eq('id', id);
  if (error) console.error('Error deleting reminder:', JSON.stringify(error, null, 2));
};

=======
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8

// --- LISTS (Settings Table in Supabase: app_settings { key, value }) ---

const getListFromSupabase = async (key: string, defaultList: string[]): Promise<string[]> => {
  if (!isSupabaseConfigured) return defaultList;
  try {
    const { data, error } = await supabase.from('app_settings').select('value').eq('key', key).single();
<<<<<<< HEAD
    if (error) return defaultList;
=======
    
    if (error) {
      // If error is row not found (PGRST116), just return default, don't log as error
      if (error.code !== 'PGRST116') {
         console.error(`Error fetching list ${key}:`, JSON.stringify(error, null, 2));
      }
      return defaultList;
    }
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
    return data?.value as string[] || defaultList;
  } catch (err) {
    console.error(`Unexpected error fetching list ${key}:`, err);
    return defaultList;
  }
};

const saveListToSupabase = async (key: string, list: string[]): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('app_settings').upsert({ key, value: list });
  if (error) console.error(`Error saving list ${key}:`, JSON.stringify(error, null, 2));
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
