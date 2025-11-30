<<<<<<< HEAD

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Bell, User as UserIcon, Trash2, Briefcase, User, Users, Calendar, Settings, Loader2, Wrench, Menu, DollarSign, StickyNote, UserCheck } from 'lucide-react';
=======
import React, { useState, useEffect } from 'react';
import { Plus, Bell, User as UserIcon, Trash2, Briefcase, User, Users, Calendar, Settings, Loader2, Wrench, Menu } from 'lucide-react';
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SchedulingList from './components/SchedulingList'; 
import SchedulingModal from './components/SchedulingModal'; 
import InverterConfigList from './components/InverterConfigList';
import InverterConfigModal from './components/InverterConfigModal';
import InstallationList from './components/InstallationList';
import InstallationModal from './components/InstallationModal';
<<<<<<< HEAD
import RefundList from './components/RefundList'; 
import RefundModal from './components/RefundModal';
import ReminderList from './components/ReminderList'; 
import ReminderModal from './components/ReminderModal';
import ClientList from './components/ClientList';
import ClientModal from './components/ClientModal';
import BackupModal from './components/BackupModal';
import UserManagementModal from './components/UserManagementModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import { Task, ViewMode, TaskCategory, TaskStatus, Scheduling, SchedulingStatus, InverterConfig, Installation, UserRole, SchedulingPriority, Refund, Reminder, Client } from './types';
=======
import BackupModal from './components/BackupModal';
import LoginScreen from './components/LoginScreen';
import UserManagementModal from './components/UserManagementModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import { Task, ViewMode, TaskCategory, TaskStatus, Scheduling, SchedulingStatus, InverterConfig, Installation, UserRole, SchedulingPriority } from './types';
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
import { 
  getTasks, saveTasks, 
  getSchedulings, saveScheduling, deleteScheduling,
  getInverterConfigs, saveInverterConfig, deleteInverterConfig,
  getInstallations, saveInstallation, deleteInstallation,
<<<<<<< HEAD
  getRefunds, saveRefund, deleteRefund,
  getReminders, saveReminder, deleteReminder, 
  getClients, saveClient, deleteClient, updateClientCascading,
  getServicesList, saveServicesList, 
  getSalespeopleList, saveSalespeopleList, 
  getTeamsList, saveTeamsList
=======
  getServicesList, saveServicesList, 
  getSalespeopleList, saveSalespeopleList, 
  getTeamsList, saveTeamsList,
  authLogin 
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
} from './services/storageService';

// --- Custom Delete Modal (Generic) ---
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
<<<<<<< HEAD
  type: 'tarefa' | 'agendamento' | 'inverter' | 'installation' | 'refund' | 'reminder' | 'client';
=======
  type: 'tarefa' | 'agendamento' | 'inverter' | 'installation';
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  categoryLabel?: string;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, title, type, categoryLabel }) => {
  if (!isOpen) return null;
  
  const getIcon = () => {
    if (type === 'agendamento') return <Calendar size={24} />;
    if (type === 'inverter') return <Settings size={24} />;
    if (type === 'installation') return <Wrench size={24} />;
<<<<<<< HEAD
    if (type === 'refund') return <DollarSign size={24} />;
    if (type === 'reminder') return <StickyNote size={24} />;
    if (type === 'client') return <UserCheck size={24} />;
=======
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
    if (categoryLabel === 'Trabalho') return <Briefcase size={24} />;
    if (categoryLabel === 'Equipe') return <Users size={24} />;
    return <User size={24} />;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 border-4 border-red-100">
            <Trash2 size={28} />
          </div>
          
          {categoryLabel && (
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 flex items-center gap-2
              ${categoryLabel === 'Trabalho' ? 'bg-blue-100 text-blue-700' : 
                categoryLabel === 'Equipe' ? 'bg-orange-100 text-orange-700' : 
                categoryLabel === 'Pessoal' ? 'bg-purple-100 text-purple-700' : 
                type === 'inverter' ? 'bg-blue-100 text-blue-700' : 
<<<<<<< HEAD
                type === 'installation' ? 'bg-yellow-100 text-yellow-700' : 
                type === 'refund' ? 'bg-emerald-100 text-emerald-700' : 
                type === 'reminder' ? 'bg-pink-100 text-pink-700' : 
                type === 'client' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
=======
                type === 'installation' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
               {getIcon()} {categoryLabel}
            </span>
          )}

          <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmar Exclusão?</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Você vai apagar: <br/>
            <span className="font-bold text-gray-800 text-base">"{title}"</span>
            <br/><span className="text-xs text-red-500 mt-2 block">Esta ação é irreversível.</span>
          </p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold shadow-md hover:shadow-lg transition-all"
            >
              Sim, Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
<<<<<<< HEAD
  // Auth State - BYPASSED FOR NOW
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const [userRole, setUserRole] = useState<UserRole>('admin'); 
  const [currentUserId, setCurrentUserId] = useState<string>('bypass-id');
=======
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8

  // Loading State
  const [isLoading, setIsLoading] = useState(true);

<<<<<<< HEAD
  // State for Entities
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);
  const [inverterConfigs, setInverterConfigs] = useState<InverterConfig[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]); 
  const [clients, setClients] = useState<Client[]>([]);
  
  // State for Lists
=======
  // State for Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  // State for Schedulings
  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);
  // State for Inverter Configs
  const [inverterConfigs, setInverterConfigs] = useState<InverterConfig[]>([]);
  // State for Installations
  const [installations, setInstallations] = useState<Installation[]>([]);
  
  // State for Lists (Select options)
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  const [services, setServices] = useState<string[]>([]);
  const [salespeople, setSalespeople] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  
<<<<<<< HEAD
=======
  // Mobile Sidebar State
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Modals State
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [isInverterModalOpen, setIsInverterModalOpen] = useState(false);
  const [isInstallationModalOpen, setIsInstallationModalOpen] = useState(false);
<<<<<<< HEAD
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false); 
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
=======
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  const [editingScheduling, setEditingScheduling] = useState<Scheduling | null>(null);
  const [editingInverterConfig, setEditingInverterConfig] = useState<InverterConfig | null>(null);
  const [editingInstallation, setEditingInstallation] = useState<Installation | null>(null);
<<<<<<< HEAD
  const [editingRefund, setEditingRefund] = useState<Refund | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null); 
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [itemToDelete, setItemToDelete] = useState<{ id: string, title: string, type: 'tarefa' | 'agendamento' | 'inverter' | 'installation' | 'refund' | 'reminder' | 'client', categoryLabel?: string } | null>(null);
  
  const [activeAlarm, setActiveAlarm] = useState<string | null>(null);

  const handleLogout = () => {
    alert("Login desativado temporariamente neste modo.");
=======
  
  // Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<{ id: string, title: string, type: 'tarefa' | 'agendamento' | 'inverter' | 'installation', categoryLabel?: string } | null>(null);
  
  // Alarm State
  const [activeAlarm, setActiveAlarm] = useState<string | null>(null);

  // Check Auth on Mount
  useEffect(() => {
    const auth = localStorage.getItem('cbc_auth_token');
    const role = localStorage.getItem('cbc_auth_role') as UserRole;
    const userId = localStorage.getItem('cbc_auth_id');
    
    if (auth === 'logged_in') {
      setIsAuthenticated(true);
      if (role) setUserRole(role);
      if (userId) setCurrentUserId(userId);
    }
    setIsAuthChecking(false);
  }, []);

  const handleLogin = async (user: string, pass: string): Promise<boolean> => {
    // Authenticate via Supabase DB
    const res = await authLogin(user, pass);
    
    if (res.success && res.role) {
      localStorage.setItem('cbc_auth_token', 'logged_in');
      localStorage.setItem('cbc_auth_role', res.role);
      if (res.id) {
         localStorage.setItem('cbc_auth_id', res.id);
         setCurrentUserId(res.id);
      }
      setUserRole(res.role);
      setIsAuthenticated(true);
      return true;
    } else {
      // Allow legacy admin login fallback if DB fails or is empty for first setup
      if (user === 'admin' && pass === 'cbc2024') {
        localStorage.setItem('cbc_auth_token', 'logged_in');
        localStorage.setItem('cbc_auth_role', 'admin');
        setUserRole('admin');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cbc_auth_token');
    localStorage.removeItem('cbc_auth_role');
    localStorage.removeItem('cbc_auth_id');
    setIsAuthenticated(false);
    setCurrentUserId('');
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  };

  // --- Initial Load (Async Supabase) ---
  useEffect(() => {
<<<<<<< HEAD
    const loadData = async () => {
      setIsLoading(true);
      try {
        setTasks(getTasks()); 
        setSchedulings(await getSchedulings());
        setInverterConfigs(await getInverterConfigs());
        setInstallations(await getInstallations());
        setRefunds(await getRefunds());
        setReminders(await getReminders());
        setClients(await getClients());
        setServices(await getServicesList());
        setSalespeople(await getSalespeopleList());
        setTeams(await getTeamsList());
=======
    if (!isAuthenticated) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        setTasks(getTasks()); // Local
        
        const dbSchedulings = await getSchedulings();
        setSchedulings(dbSchedulings);

        const dbInverters = await getInverterConfigs();
        setInverterConfigs(dbInverters);

        const dbInstallations = await getInstallations();
        setInstallations(dbInstallations);

        const dbServices = await getServicesList();
        setServices(dbServices);

        const dbSalespeople = await getSalespeopleList();
        setSalespeople(dbSalespeople);

        const dbTeams = await getTeamsList();
        setTeams(dbTeams);

>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
<<<<<<< HEAD
  }, []);

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  // --- Alarm Logic ---
  useEffect(() => {
=======
  }, [isAuthenticated]);

  // Tasks are still local, so we keep that one:
  useEffect(() => { saveTasks(tasks); }, [tasks]);


  // --- Alarm Logic ---
  useEffect(() => {
    if (!isAuthenticated) return;
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const today = now.toISOString().split('T')[0];

<<<<<<< HEAD
      const tasksToNotify = tasks.filter(t => t.status !== TaskStatus.COMPLETED && t.dueDate === today && t.alarmTime === currentTime);
      const remindersToNotify = reminders.filter(r => !r.is_completed && !r.is_archived && r.date === today && r.time === currentTime);

      if (tasksToNotify.length > 0) triggerAlarm(`Tarefa: ${tasksToNotify[0].title}`);
      else if (remindersToNotify.length > 0) triggerAlarm(`Lembrete: ${remindersToNotify[0].title}`);
      else setActiveAlarm(null);
    };

    const triggerAlarm = (msg: string) => {
        setActiveAlarm(msg);
        if ("Notification" in window && Notification.permission === "granted") new Notification("Alarme CBC Solar", { body: msg });
    };

    const interval = setInterval(checkAlarms, 60000); 
    if ("Notification" in window && Notification.permission !== "denied") Notification.requestPermission();
    return () => clearInterval(interval);
  }, [tasks, reminders]);

  // --- AUTO-SAVE CLIENT HELPER ---
  const checkAndSaveClient = async (name: string, phone: string, location: string, salesperson: string) => {
      if (!name) return;
      const existing = clients.find(c => c.name.toLowerCase() === name.toLowerCase());
      
      if (!existing) {
          // New Client
          const newClient: Client = { id: crypto.randomUUID(), name, phone, location, salesperson, notes: '' };
          setClients(prev => [...prev, newClient]);
          await saveClient(newClient);
      } else if (existing.phone !== phone || existing.location !== location) {
          // Update existing if data is newer (simple overwrite for now)
          const updated = { ...existing, phone: phone || existing.phone, location: location || existing.location };
          setClients(prev => prev.map(c => c.id === existing.id ? updated : c));
          await saveClient(updated);
      }
  };

  // --- HANDLERS ---
  
  const handleCreateScheduling = async (data: any, newItems?: any) => {
=======
      const tasksToNotify = tasks.filter(t => 
        t.status !== TaskStatus.COMPLETED &&
        t.dueDate === today &&
        t.alarmTime === currentTime
      );

      if (tasksToNotify.length > 0) {
        setActiveAlarm(`Alarme: ${tasksToNotify[0].title}`);
        if ("Notification" in window && Notification.permission === "granted") {
           new Notification("Lembrete CBC Solar", { body: tasksToNotify[0].title });
        }
      } else {
         setActiveAlarm(null);
      }
    };
    const interval = setInterval(checkAlarms, 60000); 
    if ("Notification" in window && Notification.permission !== "denied") Notification.requestPermission();
    return () => clearInterval(interval);
  }, [tasks, isAuthenticated]);

  // --- Scheduling Handlers ---
  const handleCreateScheduling = async (data: any, newItems?: { service?: string; salesperson?: string; team?: string }) => {
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
    let nextNum = 1;
    if (schedulings.length > 0) {
      const maxOrder = Math.max(...schedulings.map(s => parseInt(s.orderNumber) || 0));
      nextNum = maxOrder + 1;
    }
    const orderNumberStr = nextNum.toString().padStart(2, '0');
<<<<<<< HEAD
    const newScheduling: Scheduling = { ...data, id: crypto.randomUUID(), registrationDate: new Date().toISOString(), orderNumber: orderNumberStr };
    setSchedulings(prev => [newScheduling, ...prev]);
    await saveScheduling(newScheduling);
    await checkAndSaveClient(data.client, data.phone, data.location, data.salesperson);
    handleNewListsItems(newItems);
  };
  
  const handleUpdateScheduling = async (data: any, newItems?: any) => {
    setSchedulings(prev => prev.map(s => s.id === data.id ? data : s)); setEditingScheduling(null); await saveScheduling(data); await checkAndSaveClient(data.client, data.phone, data.location, data.salesperson); handleNewListsItems(newItems);
  };

  // ... (Status Change Handlers kept same as previous)
  const handleSchedulingStatusChange = async (id: string, currentStatus: SchedulingStatus) => {
    let newStatus = currentStatus === SchedulingStatus.PENDING ? SchedulingStatus.IN_PROGRESS : currentStatus === SchedulingStatus.IN_PROGRESS ? SchedulingStatus.RESOLVED : SchedulingStatus.PENDING;
    const item = schedulings.find(s => s.id === id); if(!item) return;
    const completionDate = newStatus === SchedulingStatus.RESOLVED ? new Date().toISOString().split('T')[0] : '';
    const updated = { ...item, status: newStatus, completionDate };
    setSchedulings(prev => prev.map(s => s.id === id ? updated : s)); await saveScheduling(updated);
  };
  const handleSchedulingPriorityChange = async (id: string, currentPriority: SchedulingPriority) => {
    const priorityOrder = [SchedulingPriority.LOW, SchedulingPriority.MEDIUM, SchedulingPriority.HIGH, SchedulingPriority.URGENT];
    const nextPriority = priorityOrder[(priorityOrder.indexOf(currentPriority || SchedulingPriority.MEDIUM) + 1) % priorityOrder.length];
    const updated = { ...schedulings.find(s => s.id === id)!, priority: nextPriority };
    setSchedulings(prev => prev.map(s => s.id === id ? updated : s)); await saveScheduling(updated);
  };

  const handleCreateInverter = async (data: any, newItems?: any) => {
    let nextNum = 1;
    if (inverterConfigs.length > 0) { const max = Math.max(...inverterConfigs.map(s => parseInt(s.orderNumber) || 0)); nextNum = max + 1; }
    const newConfig: InverterConfig = { ...data, id: crypto.randomUUID(), registrationDate: new Date().toISOString(), orderNumber: nextNum.toString().padStart(2, '0') };
    setInverterConfigs(prev => [newConfig, ...prev]); await saveInverterConfig(newConfig); await checkAndSaveClient(data.client, data.phone, data.location, data.salesperson); handleNewListsItems(newItems);
  };
  const handleUpdateInverter = async (data: any, newItems?: any) => {
    setInverterConfigs(prev => prev.map(s => s.id === data.id ? data : s)); setEditingInverterConfig(null); await saveInverterConfig(data); await checkAndSaveClient(data.client, data.phone, data.location, data.salesperson); handleNewListsItems(newItems);
  };
  const handleInverterStatusChange = async (id: string, currentStatus: SchedulingStatus) => {
    let newStatus = currentStatus === SchedulingStatus.PENDING ? SchedulingStatus.IN_PROGRESS : currentStatus === SchedulingStatus.IN_PROGRESS ? SchedulingStatus.RESOLVED : SchedulingStatus.PENDING;
    const item = inverterConfigs.find(s => s.id === id); if(!item) return;
    const completionDate = newStatus === SchedulingStatus.RESOLVED ? new Date().toISOString().split('T')[0] : '';
    const updated = { ...item, status: newStatus, completionDate };
    setInverterConfigs(prev => prev.map(s => s.id === id ? updated : s)); await saveInverterConfig(updated);
  };
  const handleInverterPriorityChange = async (id: string, currentPriority: SchedulingPriority) => {
    const priorityOrder = [SchedulingPriority.LOW, SchedulingPriority.MEDIUM, SchedulingPriority.HIGH, SchedulingPriority.URGENT];
    const nextPriority = priorityOrder[(priorityOrder.indexOf(currentPriority || SchedulingPriority.MEDIUM) + 1) % priorityOrder.length];
    const updated = { ...inverterConfigs.find(s => s.id === id)!, priority: nextPriority };
    setInverterConfigs(prev => prev.map(s => s.id === id ? updated : s)); await saveInverterConfig(updated);
  };

  const handleCreateInstallation = async (data: any, newItems?: any) => {
    let nextNum = 1;
    if (installations.length > 0) { const max = Math.max(...installations.map(s => parseInt(s.orderNumber) || 0)); nextNum = max + 1; }
    const newInstall: Installation = { ...data, id: crypto.randomUUID(), registrationDate: new Date().toISOString(), orderNumber: nextNum.toString().padStart(2, '0') };
    setInstallations(prev => [newInstall, ...prev]); await saveInstallation(newInstall); await checkAndSaveClient(data.client, '', data.location, data.salesperson); handleNewListsItems(newItems);
  };
  const handleUpdateInstallation = async (data: any, newItems?: any) => {
    setInstallations(prev => prev.map(s => s.id === data.id ? data : s)); setEditingInstallation(null); await saveInstallation(data); await checkAndSaveClient(data.client, '', data.location, data.salesperson); handleNewListsItems(newItems);
  };
  
  // Post-sales Logic
  const handleInstallationStatusChange = async (id: string, currentStatus: SchedulingStatus) => {
    let newStatus = currentStatus === SchedulingStatus.PENDING ? SchedulingStatus.IN_PROGRESS : currentStatus === SchedulingStatus.IN_PROGRESS ? SchedulingStatus.RESOLVED : SchedulingStatus.PENDING;
    const item = installations.find(s => s.id === id); if(!item) return;
    const completionDate = newStatus === SchedulingStatus.RESOLVED ? new Date().toISOString().split('T')[0] : '';
    if (newStatus === SchedulingStatus.RESOLVED && window.confirm(`Obra ${item.client} Concluída!\nDeseja criar um lembrete automático de Limpeza/Manutenção para daqui a 6 meses?`)) {
       const future = new Date(); future.setMonth(future.getMonth() + 6);
       await handleCreateReminder({
          id: crypto.randomUUID(), title: `MANUTENÇÃO: ${item.client}`, description: `Oferta de limpeza.\nPotência: ${item.kwp} kWp`,
          date: future.toISOString().split('T')[0], time: '09:00', color: '#7afcff', is_completed: false, is_archived: false, created_at: new Date().toISOString()
       });
       alert('Lembrete criado!');
    }
    const updated = { ...item, status: newStatus, completionDate };
    setInstallations(prev => prev.map(s => s.id === id ? updated : s)); await saveInstallation(updated);
  };
  const handleInstallationPriorityChange = async (id: string, currentPriority: SchedulingPriority) => {
    const priorityOrder = [SchedulingPriority.LOW, SchedulingPriority.MEDIUM, SchedulingPriority.HIGH, SchedulingPriority.URGENT];
    const nextPriority = priorityOrder[(priorityOrder.indexOf(currentPriority || SchedulingPriority.MEDIUM) + 1) % priorityOrder.length];
    const updated = { ...installations.find(s => s.id === id)!, priority: nextPriority };
    setInstallations(prev => prev.map(s => s.id === id ? updated : s)); await saveInstallation(updated);
  };

  const handleCreateRefund = async (data: any, newItems?: any) => {
    const newRefund: Refund = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    setRefunds(prev => [newRefund, ...prev]); await saveRefund(newRefund); handleNewListsItems(newItems);
  };
  const handleUpdateRefund = async (data: any, newItems?: any) => {
    setRefunds(prev => prev.map(r => r.id === data.id ? data : r)); setEditingRefund(null); await saveRefund(data); handleNewListsItems(newItems);
  };

  const handleCreateReminder = async (data: any) => {
    const newReminder: Reminder = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    setReminders(prev => [newReminder, ...prev]); await saveReminder(newReminder);
  };
  const handleUpdateReminder = async (data: any) => {
    setReminders(prev => prev.map(r => r.id === data.id ? data : r)); setEditingReminder(null); await saveReminder(data);
  };
  const handleToggleReminderComplete = async (id: string, status: boolean) => {
    const item = reminders.find(r => r.id === id); if (!item) return;
    const updated = { ...item, is_completed: status, completion_date: status ? new Date().toISOString().split('T')[0] : '' };
    setReminders(prev => prev.map(r => r.id === id ? updated : r)); await saveReminder(updated);
  };
  const handleToggleReminderArchive = async (id: string, status: boolean) => {
    const item = reminders.find(r => r.id === id); if (!item) return;
    const updated = { ...item, is_archived: status };
    setReminders(prev => prev.map(r => r.id === id ? updated : r)); await saveReminder(updated);
  };

  const handleCreateClient = async (data: any) => {
      const newClient: Client = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
      setClients(prev => [...prev, newClient]);
      await saveClient(newClient);
  };
  
  const handleUpdateClient = async (data: any) => {
      // Find old name to check if we need to cascade
      const oldClient = clients.find(c => c.id === data.id);
      const oldName = oldClient?.name !== data.name ? oldClient?.name : undefined;

      setClients(prev => prev.map(c => c.id === data.id ? data : c));
      setEditingClient(null);
      
      await updateClientCascading(data, oldName);
      
      // Refresh other lists to reflect changes
      setSchedulings(await getSchedulings());
      setInverterConfigs(await getInverterConfigs());
      setInstallations(await getInstallations());
  };

  const handleNewListsItems = async (newItems?: { service?: string; salesperson?: string; team?: string }) => {
    if (newItems?.service && !services.includes(newItems.service)) { const newList = [...services, newItems.service!]; setServices(newList); await saveServicesList(newList); }
    if (newItems?.salesperson && !salespeople.includes(newItems.salesperson)) { const newList = [...salespeople, newItems.salesperson!]; setSalespeople(newList); await saveSalespeopleList(newList); }
    if (newItems?.team && !teams.includes(newItems.team)) { const newList = [...teams, newItems.team!]; setTeams(newList); await saveTeamsList(newList); }
  };

  const handleDeleteRequest = (id: string, type: 'tarefa' | 'agendamento' | 'inverter' | 'installation' | 'refund' | 'reminder' | 'client') => {
    if (type === 'tarefa') { const item = tasks.find(t => t.id === id); if (item) setItemToDelete({ id, title: item.title, type, categoryLabel: item.category }); }
    else if (type === 'agendamento') { const item = schedulings.find(s => s.id === id); if (item) setItemToDelete({ id, title: `Ordem #${item.orderNumber}`, type, categoryLabel: 'Agendamento' }); }
    else if (type === 'inverter') { const item = inverterConfigs.find(s => s.id === id); if (item) setItemToDelete({ id, title: `Config #${item.orderNumber}`, type, categoryLabel: 'Inversor' }); }
    else if (type === 'installation') { const item = installations.find(s => s.id === id); if (item) setItemToDelete({ id, title: `Obra #${item.orderNumber}`, type, categoryLabel: 'Instalação' }); }
    else if (type === 'refund') { const item = refunds.find(r => r.id === id); if (item) setItemToDelete({ id, title: `R$${item.value}`, type, categoryLabel: 'Reembolso' }); }
    else if (type === 'reminder') { const item = reminders.find(r => r.id === id); if (item) setItemToDelete({ id, title: item.title, type, categoryLabel: 'Lembrete' }); }
    else if (type === 'client') { const item = clients.find(c => c.id === id); if (item) setItemToDelete({ id, title: item.name, type, categoryLabel: 'Cliente' }); }
=======

    const newScheduling: Scheduling = {
      ...data,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      registrationDate: new Date().toISOString(),
      orderNumber: orderNumberStr
    };

    // Optimistic Update
    setSchedulings(prev => [newScheduling, ...prev]);
    await saveScheduling(newScheduling);
    
    // Handle new lists
    handleNewListsItems(newItems);
  };

  const handleUpdateScheduling = async (data: any, newItems?: { service?: string; salesperson?: string; team?: string }) => {
    setSchedulings(prev => prev.map(s => s.id === data.id ? data : s));
    setEditingScheduling(null);
    await saveScheduling(data);
    handleNewListsItems(newItems);
  };

  const handleSchedulingStatusChange = async (id: string, currentStatus: SchedulingStatus) => {
    let newStatus = SchedulingStatus.PENDING;
    if (currentStatus === SchedulingStatus.PENDING) newStatus = SchedulingStatus.IN_PROGRESS;
    else if (currentStatus === SchedulingStatus.IN_PROGRESS) newStatus = SchedulingStatus.RESOLVED;
    else if (currentStatus === SchedulingStatus.RESOLVED) newStatus = SchedulingStatus.PENDING;

    // Find and update locally first
    const itemToUpdate = schedulings.find(s => s.id === id);
    if (!itemToUpdate) return;

    let completionDate = itemToUpdate.completionDate;
    if (newStatus === SchedulingStatus.RESOLVED && !completionDate) {
      completionDate = new Date().toISOString().split('T')[0];
    } else if (newStatus !== SchedulingStatus.RESOLVED) {
      completionDate = '';
    }

    const updatedItem = { ...itemToUpdate, status: newStatus, completionDate };
    
    setSchedulings(prev => prev.map(s => s.id === id ? updatedItem : s));
    await saveScheduling(updatedItem);
  };
  
  const handleSchedulingPriorityChange = async (id: string, currentPriority: SchedulingPriority) => {
    const priorityOrder = [
      SchedulingPriority.LOW,
      SchedulingPriority.MEDIUM,
      SchedulingPriority.HIGH,
      SchedulingPriority.URGENT
    ];
    
    const currentIndex = priorityOrder.indexOf(currentPriority || SchedulingPriority.MEDIUM);
    const nextPriority = priorityOrder[(currentIndex + 1) % priorityOrder.length];

    const itemToUpdate = schedulings.find(s => s.id === id);
    if (!itemToUpdate) return;

    const updatedItem = { ...itemToUpdate, priority: nextPriority };
    setSchedulings(prev => prev.map(s => s.id === id ? updatedItem : s));
    await saveScheduling(updatedItem);
  };

  // --- Inverter Config Handlers ---
  const handleCreateInverter = async (data: any, newItems?: { service?: string; salesperson?: string; team?: string }) => {
    let nextNum = 1;
    if (inverterConfigs.length > 0) {
      const maxOrder = Math.max(...inverterConfigs.map(s => parseInt(s.orderNumber) || 0));
      nextNum = maxOrder + 1;
    }
    const orderNumberStr = nextNum.toString().padStart(2, '0');

    const newConfig: InverterConfig = {
      ...data,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      registrationDate: new Date().toISOString(),
      orderNumber: orderNumberStr
    };

    setInverterConfigs(prev => [newConfig, ...prev]);
    await saveInverterConfig(newConfig);
    handleNewListsItems(newItems);
  };

  const handleUpdateInverter = async (data: any, newItems?: { service?: string; salesperson?: string; team?: string }) => {
    setInverterConfigs(prev => prev.map(s => s.id === data.id ? data : s));
    setEditingInverterConfig(null);
    await saveInverterConfig(data);
    handleNewListsItems(newItems);
  };

  const handleInverterStatusChange = async (id: string, currentStatus: SchedulingStatus) => {
    let newStatus = SchedulingStatus.PENDING;
    if (currentStatus === SchedulingStatus.PENDING) newStatus = SchedulingStatus.IN_PROGRESS;
    else if (currentStatus === SchedulingStatus.IN_PROGRESS) newStatus = SchedulingStatus.RESOLVED;
    else if (currentStatus === SchedulingStatus.RESOLVED) newStatus = SchedulingStatus.PENDING;

    const itemToUpdate = inverterConfigs.find(s => s.id === id);
    if (!itemToUpdate) return;

    let completionDate = itemToUpdate.completionDate;
    if (newStatus === SchedulingStatus.RESOLVED && !completionDate) {
      completionDate = new Date().toISOString().split('T')[0];
    } else if (newStatus !== SchedulingStatus.RESOLVED) {
      completionDate = '';
    }

    const updatedItem = { ...itemToUpdate, status: newStatus, completionDate };

    setInverterConfigs(prev => prev.map(s => s.id === id ? updatedItem : s));
    await saveInverterConfig(updatedItem);
  };

  const handleInverterPriorityChange = async (id: string, currentPriority: SchedulingPriority) => {
    const priorityOrder = [
      SchedulingPriority.LOW,
      SchedulingPriority.MEDIUM,
      SchedulingPriority.HIGH,
      SchedulingPriority.URGENT
    ];
    
    const currentIndex = priorityOrder.indexOf(currentPriority || SchedulingPriority.MEDIUM);
    const nextPriority = priorityOrder[(currentIndex + 1) % priorityOrder.length];

    const itemToUpdate = inverterConfigs.find(s => s.id === id);
    if (!itemToUpdate) return;

    const updatedItem = { ...itemToUpdate, priority: nextPriority };
    setInverterConfigs(prev => prev.map(s => s.id === id ? updatedItem : s));
    await saveInverterConfig(updatedItem);
  };

  // --- Installation Handlers ---
  const handleCreateInstallation = async (data: any, newItems?: { salesperson?: string; team?: string }) => {
    let nextNum = 1;
    if (installations.length > 0) {
      const maxOrder = Math.max(...installations.map(s => parseInt(s.orderNumber) || 0));
      nextNum = maxOrder + 1;
    }
    const orderNumberStr = nextNum.toString().padStart(2, '0');

    const newInstall: Installation = {
      ...data,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      registrationDate: new Date().toISOString(),
      orderNumber: orderNumberStr
    };

    setInstallations(prev => [newInstall, ...prev]);
    await saveInstallation(newInstall);
    handleNewListsItems(newItems);
  };

  const handleUpdateInstallation = async (data: any, newItems?: { salesperson?: string; team?: string }) => {
    setInstallations(prev => prev.map(s => s.id === data.id ? data : s));
    setEditingInstallation(null);
    await saveInstallation(data);
    handleNewListsItems(newItems);
  };

  const handleInstallationStatusChange = async (id: string, currentStatus: SchedulingStatus) => {
    let newStatus = SchedulingStatus.PENDING;
    if (currentStatus === SchedulingStatus.PENDING) newStatus = SchedulingStatus.IN_PROGRESS;
    else if (currentStatus === SchedulingStatus.IN_PROGRESS) newStatus = SchedulingStatus.RESOLVED;
    else if (currentStatus === SchedulingStatus.RESOLVED) newStatus = SchedulingStatus.PENDING;

    const itemToUpdate = installations.find(s => s.id === id);
    if (!itemToUpdate) return;

    let completionDate = itemToUpdate.completionDate;
    if (newStatus === SchedulingStatus.RESOLVED && !completionDate) {
      completionDate = new Date().toISOString().split('T')[0];
    } else if (newStatus !== SchedulingStatus.RESOLVED) {
      completionDate = '';
    }

    const updatedItem = { ...itemToUpdate, status: newStatus, completionDate };

    setInstallations(prev => prev.map(s => s.id === id ? updatedItem : s));
    await saveInstallation(updatedItem);
  };

  // Helper for lists
  const handleNewListsItems = async (newItems?: { service?: string; salesperson?: string; team?: string }) => {
    if (newItems?.service && !services.includes(newItems.service)) {
      const newList = [...services, newItems.service!];
      setServices(newList);
      await saveServicesList(newList);
    }
    if (newItems?.salesperson && !salespeople.includes(newItems.salesperson)) {
      const newList = [...salespeople, newItems.salesperson!];
      setSalespeople(newList);
      await saveSalespeopleList(newList);
    }
    if (newItems?.team && !teams.includes(newItems.team)) {
      const newList = [...teams, newItems.team!];
      setTeams(newList);
      await saveTeamsList(newList);
    }
  };

  // --- Delete Logic ---
  const handleDeleteRequest = (id: string, type: 'tarefa' | 'agendamento' | 'inverter' | 'installation') => {
    if (type === 'tarefa') {
      const item = tasks.find(t => t.id === id);
      if (item) setItemToDelete({ id, title: item.title, type, categoryLabel: item.category });
    } else if (type === 'agendamento') {
      const item = schedulings.find(s => s.id === id);
      if (item) setItemToDelete({ id, title: `Ordem #${item.orderNumber} - ${item.client}`, type, categoryLabel: 'Agendamento' });
    } else if (type === 'inverter') {
      const item = inverterConfigs.find(s => s.id === id);
      if (item) setItemToDelete({ id, title: `Config #${item.orderNumber} - ${item.client}`, type, categoryLabel: 'Configuração Inversor' });
    } else if (type === 'installation') {
      const item = installations.find(s => s.id === id);
      if (item) setItemToDelete({ id, title: `Obra #${item.orderNumber} - ${item.client}`, type, categoryLabel: 'Instalação' });
    }
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
<<<<<<< HEAD
    if (itemToDelete.type === 'tarefa') setTasks(prev => prev.filter(t => t.id !== itemToDelete.id));
    else if (itemToDelete.type === 'agendamento') { setSchedulings(prev => prev.filter(s => s.id !== itemToDelete.id)); await deleteScheduling(itemToDelete.id); }
    else if (itemToDelete.type === 'inverter') { setInverterConfigs(prev => prev.filter(s => s.id !== itemToDelete.id)); await deleteInverterConfig(itemToDelete.id); }
    else if (itemToDelete.type === 'installation') { setInstallations(prev => prev.filter(s => s.id !== itemToDelete.id)); await deleteInstallation(itemToDelete.id); }
    else if (itemToDelete.type === 'refund') { setRefunds(prev => prev.filter(r => r.id !== itemToDelete.id)); await deleteRefund(itemToDelete.id); }
    else if (itemToDelete.type === 'reminder') { setReminders(prev => prev.filter(r => r.id !== itemToDelete.id)); await deleteReminder(itemToDelete.id); }
    else if (itemToDelete.type === 'client') { setClients(prev => prev.filter(c => c.id !== itemToDelete.id)); await deleteClient(itemToDelete.id); }
    setItemToDelete(null);
  };

  // UI Helpers
  const openSchedulingModal = (item?: Scheduling) => { setEditingScheduling(item || null); setIsSchedulingModalOpen(true); };
  const openInverterModal = (item?: InverterConfig) => { setEditingInverterConfig(item || null); setIsInverterModalOpen(true); };
  const openInstallationModal = (item?: Installation) => { setEditingInstallation(item || null); setIsInstallationModalOpen(true); };
  const openRefundModal = (item?: Refund) => { setEditingRefund(item || null); setIsRefundModalOpen(true); };
  const openReminderModal = (item?: Reminder) => { setEditingReminder(item || null); setIsReminderModalOpen(true); };
  const openClientModal = (item?: Client) => { setEditingClient(item || null); setIsClientModalOpen(true); };

  const getNextOrderNumber = () => { if (schedulings.length === 0) return '01'; const max = Math.max(...schedulings.map(s => parseInt(s.orderNumber) || 0)); return (max + 1).toString().padStart(2, '0'); };
  const getNextInverterOrderNumber = () => { if (inverterConfigs.length === 0) return '01'; const max = Math.max(...inverterConfigs.map(s => parseInt(s.orderNumber) || 0)); return (max + 1).toString().padStart(2, '0'); };
  const getNextInstallationOrderNumber = () => { if (installations.length === 0) return '01'; const max = Math.max(...installations.map(s => parseInt(s.orderNumber) || 0)); return (max + 1).toString().padStart(2, '0'); };

=======
    
    if (itemToDelete.type === 'tarefa') {
      setTasks(prev => prev.filter(t => t.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'agendamento') {
      setSchedulings(prev => prev.filter(s => s.id !== itemToDelete.id));
      await deleteScheduling(itemToDelete.id);
    } else if (itemToDelete.type === 'inverter') {
      setInverterConfigs(prev => prev.filter(s => s.id !== itemToDelete.id));
      await deleteInverterConfig(itemToDelete.id);
    } else if (itemToDelete.type === 'installation') {
      setInstallations(prev => prev.filter(s => s.id !== itemToDelete.id));
      await deleteInstallation(itemToDelete.id);
    }
    setItemToDelete(null);
  };

  // --- UI Helpers ---
  const openSchedulingModal = (scheduling?: Scheduling) => {
    setEditingScheduling(scheduling || null);
    setIsSchedulingModalOpen(true);
  };

  const openInverterModal = (config?: InverterConfig) => {
    setEditingInverterConfig(config || null);
    setIsInverterModalOpen(true);
  };

  const openInstallationModal = (install?: Installation) => {
    setEditingInstallation(install || null);
    setIsInstallationModalOpen(true);
  };

  const getNextOrderNumber = () => {
    if (schedulings.length === 0) return '01';
    const maxOrder = Math.max(...schedulings.map(s => parseInt(s.orderNumber) || 0));
    return (maxOrder + 1).toString().padStart(2, '0');
  };

  const getNextInverterOrderNumber = () => {
    if (inverterConfigs.length === 0) return '01';
    const maxOrder = Math.max(...inverterConfigs.map(s => parseInt(s.orderNumber) || 0));
    return (maxOrder + 1).toString().padStart(2, '0');
  };

  const getNextInstallationOrderNumber = () => {
    if (installations.length === 0) return '01';
    const maxOrder = Math.max(...installations.map(s => parseInt(s.orderNumber) || 0));
    return (maxOrder + 1).toString().padStart(2, '0');
  };

  // --- Derived State ---
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  const taskCounts = {
    [TaskCategory.WORK]: tasks.filter(t => t.category === TaskCategory.WORK && t.status !== TaskStatus.COMPLETED).length,
    [TaskCategory.PERSONAL]: tasks.filter(t => t.category === TaskCategory.PERSONAL && t.status !== TaskStatus.COMPLETED).length,
    [TaskCategory.TEAM]: tasks.filter(t => t.category === TaskCategory.TEAM && t.status !== TaskStatus.COMPLETED).length,
  };

<<<<<<< HEAD
  const renderContent = () => {
    if (isLoading) return <div className="flex flex-col items-center justify-center h-full text-cbc-green"><Loader2 size={64} className="animate-spin mb-4" /><p>Carregando Sistema...</p></div>;
    if (currentView === 'dashboard') return <Dashboard schedulings={schedulings} onStatusChange={handleSchedulingStatusChange} inverterConfigs={inverterConfigs} onInverterStatusChange={handleInverterStatusChange} installations={installations} onInstallationStatusChange={handleInstallationStatusChange} onPriorityChange={handleSchedulingPriorityChange} onInverterPriorityChange={handleInverterPriorityChange} onInstallationPriorityChange={handleInstallationPriorityChange} />;
    if (currentView === 'inverter_config') return <InverterConfigList configs={inverterConfigs} onEdit={openInverterModal} onDelete={(id) => handleDeleteRequest(id, 'inverter')} onStatusChange={handleInverterStatusChange} />;
    if (currentView === 'installation') return <InstallationList installations={installations} onEdit={openInstallationModal} onDelete={(id) => handleDeleteRequest(id, 'installation')} onStatusChange={handleInstallationStatusChange} />;
    if (currentView === 'refund') return <RefundList refunds={refunds} onEdit={openRefundModal} onDelete={(id) => handleDeleteRequest(id, 'refund')} />;
    if (currentView === 'reminder') return <ReminderList reminders={reminders} onEdit={openReminderModal} onDelete={(id) => handleDeleteRequest(id, 'reminder')} onToggleComplete={handleToggleReminderComplete} onToggleArchive={handleToggleReminderArchive} onNew={() => openReminderModal()}/>;
    if (currentView === 'clients') return <ClientList clients={clients} onEdit={openClientModal} onDelete={(id) => handleDeleteRequest(id, 'client')} />;
    return <SchedulingList schedulings={schedulings} onEdit={openSchedulingModal} onDelete={(id) => handleDeleteRequest(id, 'agendamento')} onStatusChange={handleSchedulingStatusChange} onPriorityChange={handleSchedulingPriorityChange} />;
=======
  // --- View Rendering ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-cbc-green">
          <Loader2 size={64} className="animate-spin mb-4" />
          <p className="text-xl font-bold">Carregando Sistema...</p>
          <p className="text-sm mt-2 opacity-70">Conectando ao banco de dados...</p>
        </div>
      );
    }

    if (currentView === 'dashboard') {
      return (
        <Dashboard 
          schedulings={schedulings} 
          onStatusChange={handleSchedulingStatusChange}
          inverterConfigs={inverterConfigs}
          onInverterStatusChange={handleInverterStatusChange}
          onPriorityChange={handleSchedulingPriorityChange}
          onInverterPriorityChange={handleInverterPriorityChange}
        />
      );
    }
    if (currentView === 'inverter_config') {
      return <InverterConfigList 
        configs={inverterConfigs} 
        onEdit={openInverterModal} 
        onDelete={(id) => handleDeleteRequest(id, 'inverter')} 
        onStatusChange={handleInverterStatusChange}
      />;
    }
    if (currentView === 'installation') {
      return <InstallationList 
        installations={installations} 
        onEdit={openInstallationModal} 
        onDelete={(id) => handleDeleteRequest(id, 'installation')} 
        onStatusChange={handleInstallationStatusChange}
      />;
    }
    // Default to scheduling list
    return <SchedulingList 
      schedulings={schedulings} 
      onEdit={openSchedulingModal} 
      onDelete={(id) => handleDeleteRequest(id, 'agendamento')} 
      onStatusChange={handleSchedulingStatusChange}
      onPriorityChange={handleSchedulingPriorityChange}
    />;
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  };

  // Clock
  const [time, setTime] = useState(new Date());
<<<<<<< HEAD
  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []);
=======
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- AUTH CHECK ---
  if (isAuthChecking) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-100"><Loader2 className="animate-spin text-cbc-green" size={48} /></div>;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8

  return (
    <div className="flex h-screen w-screen bg-green-50 overflow-hidden font-sans">
      <Sidebar 
<<<<<<< HEAD
        currentView={currentView} onChangeView={setCurrentView} taskCounts={taskCounts}
        onOpenBackup={() => setIsBackupModalOpen(true)} onOpenUsers={() => setIsUsersModalOpen(true)}
        onChangePassword={() => setIsChangePasswordModalOpen(true)} onLogout={handleLogout} userRole={userRole}
        isOpenMobile={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)}
=======
        currentView={currentView} 
        onChangeView={setCurrentView} 
        taskCounts={taskCounts}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenUsers={() => setIsUsersModalOpen(true)}
        onChangePassword={() => setIsChangePasswordModalOpen(true)}
        onLogout={handleLogout}
        userRole={userRole}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm shrink-0 z-10">
          <div className="flex items-center gap-4">
<<<<<<< HEAD
             <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Menu size={24} /></button>
             <h2 className="text-lg lg:text-xl font-bold text-gray-800 truncate max-w-[150px] lg:max-w-none">
               {currentView === 'dashboard' ? 'Dashboard' : 
                currentView === 'inverter_config' ? 'Config. Inversores' : 
                currentView === 'installation' ? 'Instalações' : 
                currentView === 'refund' ? 'Financeiro' : 
                currentView === 'reminder' ? 'Lembretes' : 
                currentView === 'clients' ? 'Clientes' : 'Agendamentos'}
=======
             {/* Mobile Menu Toggle */}
             <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu size={24} />
             </button>

             <h2 className="text-lg lg:text-xl font-bold text-gray-800 truncate max-w-[150px] lg:max-w-none">
               {currentView === 'dashboard' ? 'Dashboard' : 
                currentView === 'inverter_config' ? 'Config. Inversores' : 
                currentView === 'installation' ? 'Instalações' : 'Agendamentos'}
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
             </h2>
             <span className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></span>
             <p className="text-sm text-gray-500 font-medium capitalize hidden sm:block">
               {time.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
             </p>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <p className="text-lg lg:text-2xl font-light text-cbc-green">
              {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-cbc-orange transition-colors">
                <Bell size={20} />
                {activeAlarm && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-700 capitalize">{userRole}</p>
                  <p className="text-xs text-gray-500">CBC Solar</p>
                </div>
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white
                  ${userRole === 'admin' ? 'bg-purple-600' : 'bg-cbc-green'}`}>
                  <UserIcon size={18} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          {renderContent()}

<<<<<<< HEAD
=======
          {/* Floating Action Button */}
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
          <button
            onClick={() => 
              currentView === 'inverter_config' ? openInverterModal() : 
              currentView === 'installation' ? openInstallationModal() :
<<<<<<< HEAD
              currentView === 'refund' ? openRefundModal() :
              currentView === 'reminder' ? openReminderModal() :
              currentView === 'clients' ? openClientModal() :
=======
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
              openSchedulingModal()
            }
            className={`absolute bottom-6 right-6 lg:bottom-8 lg:right-8 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 z-20 flex items-center gap-2 group
              ${currentView === 'inverter_config' ? 'bg-blue-600 hover:bg-blue-500' : 
                currentView === 'installation' ? 'bg-yellow-500 hover:bg-yellow-400' :
<<<<<<< HEAD
                currentView === 'refund' ? 'bg-emerald-600 hover:bg-emerald-500' :
                currentView === 'reminder' ? 'bg-pink-500 hover:bg-pink-400' :
                currentView === 'clients' ? 'bg-indigo-600 hover:bg-indigo-500' :
                'bg-cbc-orange hover:bg-cbc-lightOrange'}`}
            title="Novo Item"
=======
                'bg-cbc-orange hover:bg-cbc-lightOrange'}`}
            title={
              currentView === 'inverter_config' ? "Nova Configuração" : 
              currentView === 'installation' ? "Nova Instalação" : 
              "Novo Agendamento"
            }
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
          >
            <Plus size={32} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-medium pr-2 hidden lg:block">
              {currentView === 'inverter_config' ? "Nova Configuração" : 
               currentView === 'installation' ? "Nova Instalação" : 
<<<<<<< HEAD
               currentView === 'refund' ? "Novo Reembolso" :
               currentView === 'reminder' ? "Novo Lembrete" :
               currentView === 'clients' ? "Novo Cliente" :
=======
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
               "Novo Agendamento"}
            </span>
          </button>

<<<<<<< HEAD
=======
          {/* Toast Notification */}
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
          {activeAlarm && (
            <div className="absolute top-4 right-4 bg-white border-l-4 border-cbc-orange shadow-xl p-4 rounded-md flex items-center gap-3 animate-slide-in z-50 max-w-sm">
               <div className="bg-orange-100 p-2 rounded-full text-cbc-orange">
                 <Bell size={20} />
               </div>
               <div>
<<<<<<< HEAD
                 <h4 className="font-bold text-gray-800">Alarme</h4>
=======
                 <h4 className="font-bold text-gray-800">Lembrete</h4>
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
                 <p className="text-sm text-gray-600">{activeAlarm}</p>
               </div>
               <button onClick={() => setActiveAlarm(null)} className="ml-auto text-gray-400 hover:text-gray-600">
                 <Plus size={16} className="rotate-45" />
               </button>
            </div>
          )}
        </main>
      </div>

<<<<<<< HEAD
      <SchedulingModal isOpen={isSchedulingModalOpen} onClose={() => setIsSchedulingModalOpen(false)} onSave={editingScheduling ? handleUpdateScheduling : handleCreateScheduling} schedulingToEdit={editingScheduling} availableServices={services} availableSalespeople={salespeople} availableTeams={teams} nextOrderNumber={getNextOrderNumber()} knownClients={clients} />
      <InverterConfigModal isOpen={isInverterModalOpen} onClose={() => setIsInverterModalOpen(false)} onSave={editingInverterConfig ? handleUpdateInverter : handleCreateInverter} configToEdit={editingInverterConfig} availableModels={services} availableSalespeople={salespeople} availableTeams={teams} nextOrderNumber={getNextInverterOrderNumber()} knownClients={clients} />
      <InstallationModal isOpen={isInstallationModalOpen} onClose={() => setIsInstallationModalOpen(false)} onSave={editingInstallation ? handleUpdateInstallation : handleCreateInstallation} installationToEdit={editingInstallation} availableSalespeople={salespeople} availableTeams={teams} nextOrderNumber={getNextInstallationOrderNumber()} />
      <RefundModal isOpen={isRefundModalOpen} onClose={() => setIsRefundModalOpen(false)} onSave={editingRefund ? handleUpdateRefund : handleCreateRefund} refundToEdit={editingRefund} availableTeams={teams} />
      <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} onSave={editingReminder ? handleUpdateReminder : handleCreateReminder} reminderToEdit={editingReminder} />
      <ClientModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} onSave={editingClient ? handleUpdateClient : handleCreateClient} clientToEdit={editingClient} availableSalespeople={salespeople} />

      <DeleteConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={confirmDelete} title={itemToDelete?.title || ''} type={itemToDelete?.type || 'tarefa'} categoryLabel={itemToDelete?.categoryLabel} />
      <BackupModal isOpen={isBackupModalOpen} onClose={() => setIsBackupModalOpen(false)} />
      <UserManagementModal isOpen={isUsersModalOpen} onClose={() => setIsUsersModalOpen(false)} currentUserRole={userRole} />
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} currentUserId={currentUserId} />
=======
      <SchedulingModal
        isOpen={isSchedulingModalOpen}
        onClose={() => setIsSchedulingModalOpen(false)}
        onSave={editingScheduling ? handleUpdateScheduling : handleCreateScheduling}
        schedulingToEdit={editingScheduling}
        availableServices={services}
        availableSalespeople={salespeople}
        availableTeams={teams}
        nextOrderNumber={getNextOrderNumber()}
      />

      <InverterConfigModal
        isOpen={isInverterModalOpen}
        onClose={() => setIsInverterModalOpen(false)}
        onSave={editingInverterConfig ? handleUpdateInverter : handleCreateInverter}
        configToEdit={editingInverterConfig}
        availableModels={services} 
        availableSalespeople={salespeople}
        availableTeams={teams}
        nextOrderNumber={getNextInverterOrderNumber()}
      />

      <InstallationModal
        isOpen={isInstallationModalOpen}
        onClose={() => setIsInstallationModalOpen(false)}
        onSave={editingInstallation ? handleUpdateInstallation : handleCreateInstallation}
        installationToEdit={editingInstallation}
        availableSalespeople={salespeople}
        availableTeams={teams}
        nextOrderNumber={getNextInstallationOrderNumber()}
      />

      <DeleteConfirmationModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title={itemToDelete?.title || ''}
        type={itemToDelete?.type || 'tarefa'}
        categoryLabel={itemToDelete?.categoryLabel}
      />
      
      <BackupModal 
        isOpen={isBackupModalOpen} 
        onClose={() => setIsBackupModalOpen(false)} 
      />

      <UserManagementModal
        isOpen={isUsersModalOpen}
        onClose={() => setIsUsersModalOpen(false)}
        currentUserRole={userRole}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        currentUserId={currentUserId}
      />
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
    </div>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
