
import React from 'react';
import { CalendarRange, Database, Sun, LayoutDashboard, Settings, LogOut, Users, Key } from 'lucide-react';
import { ViewMode, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  taskCounts: Record<string, number>;
  onOpenBackup: () => void;
  onOpenUsers: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onOpenBackup, onOpenUsers, onChangePassword, onLogout, userRole }) => {
  
  return (
    <div className="h-full w-64 bg-cbc-green text-white flex flex-col shadow-xl flex-shrink-0 transition-all font-sans">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10 shrink-0">
        <div className="bg-white p-2 rounded-full text-cbc-green shadow-lg">
          <Sun size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wide">CBC Solar</h1>
          <p className="text-xs text-white/70 uppercase tracking-widest">Sistema</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        
        {/* Section: VISÃO GERAL */}
        <div>
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 px-2">Monitoramento</h3>
          <div className="space-y-1">
            <button
              onClick={() => onChangeView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium
                ${currentView === 'dashboard' 
                  ? 'bg-white text-cbc-green shadow-md translate-x-1' 
                  : 'text-white hover:bg-white/10'
                }`}
            >
              <LayoutDashboard size={20} className={currentView === 'dashboard' ? 'text-cbc-orange' : 'text-white/70'} />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Section: OPERACIONAL */}
        <div>
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 px-2">Operacional</h3>
          <div className="space-y-2">
            <button
              onClick={() => onChangeView('scheduling')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium
                ${currentView === 'scheduling' 
                  ? 'bg-white text-cbc-green shadow-md translate-x-1' 
                  : 'text-white hover:bg-white/10'
                }`}
            >
              <CalendarRange size={20} className={currentView === 'scheduling' ? 'text-cbc-orange' : 'text-white/70'} />
              <span>Agendamentos</span>
            </button>

            <button
              onClick={() => onChangeView('inverter_config')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium
                ${currentView === 'inverter_config' 
                  ? 'bg-white text-cbc-green shadow-md translate-x-1' 
                  : 'text-white hover:bg-white/10'
                }`}
            >
              <Settings size={20} className={currentView === 'inverter_config' ? 'text-blue-500' : 'text-white/70'} />
              <span>Config. Inversor</span>
            </button>
          </div>
        </div>

      </nav>

      {/* Footer Section: SYSTEM */}
      <div className="p-4 border-t border-white/10 bg-black/10 space-y-2">
         <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 px-2">Sistema</h3>
         
         <button 
           onClick={onOpenBackup}
           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white transition-all text-sm font-medium opacity-80 hover:opacity-100"
         >
            <Database size={18} />
            Banco de Dados
         </button>

         {/* Admin Only Button */}
         {userRole === 'admin' && (
           <button 
             onClick={onOpenUsers}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white transition-all text-sm font-medium opacity-80 hover:opacity-100"
           >
              <Users size={18} />
              Usuários
           </button>
         )}

         <button 
           onClick={onChangePassword}
           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white transition-all text-sm font-medium opacity-80 hover:opacity-100"
         >
            <Key size={18} />
            Alterar Senha
         </button>

         <button 
           onClick={onLogout}
           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-200 hover:text-red-100 transition-all text-sm font-medium"
         >
            <LogOut size={18} />
            Sair
         </button>
         
         <div className="mt-4 text-[10px] text-center text-white/40 font-mono">
            v2.4.0 &copy; CBC Solar
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
