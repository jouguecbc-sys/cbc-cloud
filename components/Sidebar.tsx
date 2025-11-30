
import React from 'react';
<<<<<<< HEAD
import { Database, Sun, LayoutDashboard, Settings, LogOut, Users, Key, Wrench, CalendarRange, X, ChevronRight, ShieldCheck, DollarSign, StickyNote, UserCheck } from 'lucide-react';
=======
import { Database, Sun, LayoutDashboard, Settings, LogOut, Users, Key, Wrench, CalendarRange, X, ChevronRight, ShieldCheck } from 'lucide-react';
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
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
  isOpenMobile: boolean; // New prop for mobile state
  onCloseMobile: () => void; // New prop to close mobile menu
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  onOpenBackup, 
  onOpenUsers, 
  onChangePassword, 
  onLogout, 
  userRole,
  isOpenMobile,
  onCloseMobile
}) => {
  
  // Base classes for sidebar container - Dark Enterprise Theme
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-[#0f291e] to-[#05140e] text-white shadow-2xl transform transition-transform duration-300 ease-in-out font-sans flex flex-col border-r border-white/5
    ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'} 
    lg:translate-x-0 lg:static lg:flex-shrink-0
  `;

  // Overlay for mobile
  const overlayClasses = `
    fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300
    ${isOpenMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `;

  const handleNavClick = (view: ViewMode) => {
    onChangeView(view);
    onCloseMobile();
  };

  // Helper component for Navigation Links
  const NavItem = ({ view, icon: Icon, label, activeColorClass }: { view: ViewMode, icon: any, label: string, activeColorClass: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => handleNavClick(view)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden
          ${isActive 
            ? 'bg-white/10 text-white shadow-lg border-l-4 border-cbc-orange' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
      >
        <div className="flex items-center gap-3 relative z-10">
          <Icon size={18} className={`transition-colors duration-300 ${isActive ? activeColorClass : 'group-hover:text-white'}`} />
          <span className="font-medium tracking-wide text-sm">{label}</span>
        </div>
        {isActive && <ChevronRight size={14} className="text-white/50 animate-pulse" />}
        
        {/* Subtle hover shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div className={overlayClasses} onClick={onCloseMobile} aria-hidden="true" />

      {/* Sidebar Content */}
      <div className={sidebarClasses}>
        
        {/* Brand Header - Compacted */}
        <div className="h-20 flex items-center px-5 border-b border-white/5 bg-white/5 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cbc-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex items-center gap-3 z-10">
            <div className="bg-gradient-to-br from-cbc-green to-emerald-800 p-2 rounded-xl text-white shadow-lg border border-white/10">
              <Sun size={22} strokeWidth={2.5} fill="currentColor" className="text-cbc-orange" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight text-white">CBC SOLAR</h1>
              <p className="text-[9px] text-cbc-lightGreen uppercase tracking-[0.2em] mt-1 font-semibold">Enterprise System</p>
            </div>
          </div>
          {/* Close Button (Mobile Only) */}
          <button onClick={onCloseMobile} className="lg:hidden absolute right-4 text-white/50 hover:text-white p-2">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
          
          {/* Section: MONITORAMENTO */}
          <div>
            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-3 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-cbc-orange"></span> Monitoramento
            </h3>
            <div className="space-y-0.5">
              <NavItem view="dashboard" icon={LayoutDashboard} label="Central de Controle" activeColorClass="text-cbc-orange" />
            </div>
          </div>

          {/* Section: OPERACIONAL */}
          <div>
            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-3 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-cbc-green"></span> Operacional
            </h3>
            <div className="space-y-0.5">
              <NavItem view="scheduling" icon={CalendarRange} label="Agendamentos" activeColorClass="text-green-400" />
              <NavItem view="installation" icon={Wrench} label="Gestão de Instalações" activeColorClass="text-yellow-400" />
              <NavItem view="inverter_config" icon={Settings} label="Config. Inversores" activeColorClass="text-blue-400" />
<<<<<<< HEAD
              <NavItem view="reminder" icon={StickyNote} label="Lembretes" activeColorClass="text-pink-400" />
            </div>
          </div>

          {/* Section: GESTÃO */}
          <div>
            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-3 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-indigo-500"></span> Gestão
            </h3>
            <div className="space-y-0.5">
              <NavItem view="clients" icon={UserCheck} label="Clientes" activeColorClass="text-indigo-400" />
              <NavItem view="refund" icon={DollarSign} label="Reembolso de Equipe" activeColorClass="text-emerald-400" />
=======
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
            </div>
          </div>

        </nav>

        {/* Footer Section: SYSTEM - Compacted */}
        <div className="p-3 bg-black/20 backdrop-blur-md border-t border-white/5 space-y-1">
           
           <div className="mb-2 px-1">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">Administração</p>
              
              <button 
                onClick={() => { onOpenBackup(); onCloseMobile(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-xs group"
              >
                  <Database size={16} className="group-hover:text-blue-400 transition-colors"/>
                  Banco de Dados
              </button>

              {/* Admin Only Button */}
              {userRole === 'admin' && (
                <button 
                  onClick={() => { onOpenUsers(); onCloseMobile(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-xs group"
                >
                    <Users size={16} className="group-hover:text-purple-400 transition-colors"/>
                    Usuários
                </button>
              )}
           </div>

           <div className="border-t border-white/5 pt-3 mt-1">
             <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onChangePassword}>
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-inner
                      ${userRole === 'admin' ? 'bg-gradient-to-br from-purple-600 to-indigo-700' : 'bg-gradient-to-br from-gray-600 to-gray-700'}`}>
                      <ShieldCheck size={16} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-white capitalize">{userRole}</p>
                      <p className="text-[9px] text-gray-400 flex items-center gap-1">
                        <Key size={10} /> Alterar Senha
                      </p>
                   </div>
                </div>
                
                <button 
                  onClick={onLogout}
                  className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Sair do Sistema"
                >
                    <LogOut size={16} />
                </button>
             </div>
           </div>
           
           <div className="mt-2 text-[8px] text-center text-gray-600 font-mono tracking-tighter">
              v2.5.2 Enterprise • CBC Solar
           </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
