
import React, { useState } from 'react';
import { Scheduling, SchedulingStatus, InverterConfig, SchedulingPriority, Installation } from '../types';
import { Calendar, MapPin, User, CheckCircle, AlertCircle, PlayCircle, Briefcase, FileText, Download, FileSpreadsheet, Settings, Cpu, Zap, Wrench } from 'lucide-react';

interface DashboardProps {
  schedulings: Scheduling[];
  inverterConfigs: InverterConfig[];
  installations: Installation[];
  onStatusChange: (id: string, currentStatus: SchedulingStatus) => void;
  onInverterStatusChange: (id: string, currentStatus: SchedulingStatus) => void;
  onInstallationStatusChange: (id: string, currentStatus: SchedulingStatus) => void;
  onPriorityChange: (id: string, currentPriority: SchedulingPriority) => void;
  onInverterPriorityChange: (id: string, currentPriority: SchedulingPriority) => void;
  onInstallationPriorityChange: (id: string, currentPriority: SchedulingPriority) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  schedulings, 
  inverterConfigs, 
  installations,
  onStatusChange, 
  onInverterStatusChange,
  onInstallationStatusChange,
  onPriorityChange,
  onInverterPriorityChange,
  onInstallationPriorityChange
}) => {
  const [activeTab, setActiveTab] = useState<'scheduling' | 'inverter' | 'installation'>('scheduling');

  // --- Sorting Logic ---
  const sortItems = (items: any[]) => {
    return [...items].sort((a, b) => {
      // 1. Separar Resolvidos de Ativos (Resolvidos vão para o final)
      const isResolvedA = a.status === SchedulingStatus.RESOLVED;
      const isResolvedB = b.status === SchedulingStatus.RESOLVED;

      if (isResolvedA && !isResolvedB) return 1; // A (resolvido) vai para baixo
      if (!isResolvedA && isResolvedB) return -1; // B (resolvido) vai para baixo

      // 2. Classificar por Prioridade (URGENTE > ALTA > MÉDIA > BAIXA)
      const priorityOrder = {
        [SchedulingPriority.URGENT]: 0,
        [SchedulingPriority.HIGH]: 1,
        [SchedulingPriority.MEDIUM]: 2,
        [SchedulingPriority.LOW]: 3,
        [undefined as any]: 2
      };

      const pA = priorityOrder[a.priority || SchedulingPriority.MEDIUM];
      const pB = priorityOrder[b.priority || SchedulingPriority.MEDIUM];

      if (pA !== pB) {
        return pA - pB; // Menor número (maior prioridade) primeiro
      }

      // 3. Ordem de Registro (Fila: 01, 02, 03...) - Crescente
      // "Primeiros registros no topo"
      const orderA = parseInt(a.orderNumber) || 0;
      const orderB = parseInt(b.orderNumber) || 0;

      return orderA - orderB; // Crescente (1, 2, 3...)
    });
  };

  const sortedSchedulings = sortItems(schedulings);
  const sortedInverters = sortItems(inverterConfigs);
  const sortedInstallations = sortItems(installations);

  // --- Style Logic ---
  const getStatusStyles = (status: SchedulingStatus, type: 'scheduling' | 'inverter' | 'installation') => {
    
    switch(status) {
      case SchedulingStatus.PENDING: 
        return {
          card: 'bg-red-100 border-red-300 shadow-sm hover:shadow-md hover:shadow-red-200',
          text: 'text-red-900',
          badge: 'bg-red-600 text-white border-red-700 hover:bg-red-700',
          icon: 'text-red-700',
          subtext: 'text-red-800',
          divider: 'border-red-200'
        };
      case SchedulingStatus.IN_PROGRESS: 
        return {
          card: 'bg-orange-100 border-orange-300 shadow-sm hover:shadow-md hover:shadow-orange-200',
          text: 'text-orange-900',
          badge: 'bg-orange-600 text-white border-orange-700 hover:bg-orange-700',
          icon: 'text-orange-700',
          subtext: 'text-orange-800',
          divider: 'border-orange-200'
        };
      case SchedulingStatus.RESOLVED: 
        if (type === 'inverter') {
          return { // Blue Theme for Resolved Inverters
            card: 'bg-blue-100 border-blue-300 shadow-sm hover:shadow-md hover:shadow-blue-200 opacity-60',
            text: 'text-blue-900',
            badge: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
            icon: 'text-blue-700',
            subtext: 'text-blue-800',
            divider: 'border-blue-200'
          };
        } else if (type === 'installation') {
          return { // Yellow Theme for Resolved Installations
            card: 'bg-yellow-100 border-yellow-300 shadow-sm hover:shadow-md hover:shadow-yellow-200 opacity-60',
            text: 'text-yellow-900',
            badge: 'bg-yellow-600 text-white border-yellow-700 hover:bg-yellow-700',
            icon: 'text-yellow-700',
            subtext: 'text-yellow-800',
            divider: 'border-yellow-200'
          };
        }
        return { // Green Theme for Resolved Schedulings
          card: 'bg-green-100 border-green-300 shadow-sm hover:shadow-md hover:shadow-green-200 opacity-60',
          text: 'text-green-900',
          badge: 'bg-green-600 text-white border-green-700 hover:bg-green-700',
          icon: 'text-green-700',
          subtext: 'text-green-800',
          divider: 'border-green-200'
        };
    }
  };

  const getPriorityStyles = (priority: SchedulingPriority) => {
    switch(priority) {
      case SchedulingPriority.URGENT:
        return 'bg-red-600 text-white border-red-700 animate-pulse font-black shadow-lg shadow-red-500/30 ring-2 ring-red-400';
      case SchedulingPriority.HIGH:
        return 'bg-orange-500 text-white border-orange-600 font-bold hover:bg-orange-600';
      case SchedulingPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 font-bold hover:bg-yellow-200';
      case SchedulingPriority.LOW:
        return 'bg-blue-100 text-blue-800 border-blue-200 font-medium hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 font-medium';
    }
  };

  const getPriorityLabel = (priority: SchedulingPriority) => {
    switch(priority) {
      case SchedulingPriority.URGENT: return 'URGENTE';
      case SchedulingPriority.HIGH: return 'ALTA';
      case SchedulingPriority.MEDIUM: return 'MÉDIA';
      case SchedulingPriority.LOW: return 'BAIXA';
      default: return 'NORMAL';
    }
  };

  const formatDateFull = (dateString?: string) => {
    if (!dateString) return 'DATA A DEFINIR';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // --- Export Functions ---
  const handleExportPDF = () => {
    // @ts-ignore
    if (!window.jspdf) { alert('Biblioteca PDF carregando...'); return; }
    // @ts-ignore
    const doc = new window.jspdf.jsPDF();
    
    let title = '';
    let data: any[] = [];
    let headers: any[] = [];
    let headColor = [46, 139, 87];

    if (activeTab === 'scheduling') {
      title = 'Monitor de Agendamentos';
      data = sortedSchedulings;
      headers = ["Ordem", "Prio.", "Cliente", "Serviço", "Data", "Status"];
      headColor = [46, 139, 87];
    } else if (activeTab === 'inverter') {
      title = 'Monitor de Inversores';
      data = sortedInverters;
      headers = ["Ordem", "Prio.", "Cliente", "Modelo", "Data", "Status"];
      headColor = [59, 130, 246];
    } else {
      title = 'Monitor de Instalações';
      data = sortedInstallations;
      headers = ["Ordem", "Prio.", "Cliente", "Sistema", "Agendada", "Status"];
      headColor = [234, 179, 8];
    }

    doc.setFontSize(22);
    doc.text(`${title} - CBC Solar`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28);

    const tableRows = data.map(item => {
      let desc = '';
      if (activeTab === 'scheduling') desc = item.service;
      else if (activeTab === 'inverter') desc = item.inverterModel;
      else desc = `${item.kwp} kWp`;

      let statusLabel = '';
      if (item.status === SchedulingStatus.RESOLVED) {
         if (activeTab === 'inverter') statusLabel = 'Configurado';
         else if (activeTab === 'installation') statusLabel = 'Concluído';
         else statusLabel = 'Resolvido';
      } else if (item.status === SchedulingStatus.IN_PROGRESS) {
         statusLabel = 'Andamento';
      } else {
         statusLabel = 'Pendente';
      }

      return [
        item.orderNumber,
        getPriorityLabel(item.priority || SchedulingPriority.MEDIUM),
        item.client,
        desc,
        formatDateFull(item.scheduledDate),
        statusLabel
      ];
    });

    // @ts-ignore
    doc.autoTable({
      head: [headers],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: headColor }
    });

    doc.save(`dashboard_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportTXT = () => {
    let data: any[] = [];
    let title = '';

    if (activeTab === 'scheduling') {
      data = sortedSchedulings;
      title = 'MONITOR DE AGENDAMENTOS';
    } else if (activeTab === 'inverter') {
      data = sortedInverters;
      title = 'MONITOR DE INVERSORES';
    } else {
      data = sortedInstallations;
      title = 'MONITOR DE INSTALAÇÕES';
    }

    let content = "================================================\n";
    content += `           ${title}              \n`;
    content += `           DATA: ${new Date().toLocaleString()} \n`;
    content += "================================================\n\n";

    data.forEach(item => {
      content += `ORDEM #${item.orderNumber} [${getPriorityLabel(item.priority || SchedulingPriority.MEDIUM)}] - ${item.status.toUpperCase()}\n`;
      content += `CLIENTE: ${item.client}\n`;
      
      if (activeTab === 'scheduling') content += `SERVIÇO: ${(item as Scheduling).service}\n`;
      else if (activeTab === 'inverter') content += `MODELO:  ${(item as InverterConfig).inverterModel}\n`;
      else content += `SISTEMA: ${(item as Installation).kwp} kWp (${(item as Installation).panelQuantity} Placas)\n`;

      content += `DATA:    ${formatDateFull(item.scheduledDate)}\n`;
      content += "------------------------------------------------\n";
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dashboard_${activeTab}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportXLS = () => {
    const XLSX = (window as any).XLSX;
    if (!XLSX) { alert('Biblioteca Excel carregando...'); return; }
    
    let data: any[] = [];
    if (activeTab === 'scheduling') data = sortedSchedulings;
    else if (activeTab === 'inverter') data = sortedInverters;
    else data = sortedInstallations;

    const ws = XLSX.utils.json_to_sheet(data.map(item => ({
      Ordem: item.orderNumber,
      Prioridade: getPriorityLabel(item.priority || SchedulingPriority.MEDIUM),
      Status: item.status,
      Cliente: item.client,
      Descricao: activeTab === 'scheduling' ? (item as Scheduling).service : activeTab === 'inverter' ? (item as InverterConfig).inverterModel : `${(item as Installation).kwp} kWp`,
      Data: formatDateFull(item.scheduledDate),
      Equipe: item.team,
      Vendedor: item.salesperson
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monitor");
    XLSX.writeFile(wb, `monitor_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // --- Render List Helper ---
  const renderList = (items: any[], type: 'scheduling' | 'inverter' | 'installation') => {
     if (items.length === 0) {
        return (
           <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <div className="bg-white p-8 rounded-full mb-6 shadow-sm">
                {type === 'inverter' ? <Settings size={80} className="text-gray-300" /> : 
                 type === 'installation' ? <Wrench size={80} className="text-gray-300" /> : 
                 <Calendar size={80} className="text-gray-300" />}
              </div>
              <p className="text-4xl font-bold mb-2 text-gray-300">Sem Itens na Fila</p>
           </div>
        );
     }

     return items.map(item => {
        const styles = getStatusStyles(item.status, type);
        const priority = item.priority || SchedulingPriority.MEDIUM;
        const prioStyle = getPriorityStyles(priority);
        
        let mainDesc = '';
        let icon = null;

        if (type === 'inverter') {
           mainDesc = (item as InverterConfig).inverterModel;
           icon = <Cpu size={20} />;
        } else if (type === 'installation') {
           mainDesc = `${(item as Installation).kwp} kWp (${(item as Installation).panelQuantity} Placas)`;
           icon = <Zap size={20} />;
        } else {
           mainDesc = (item as Scheduling).service;
           icon = <Briefcase size={20} />;
        }

        const handleStatusClick = () => {
           if (type === 'inverter') onInverterStatusChange(item.id, item.status);
           else if (type === 'installation') onInstallationStatusChange(item.id, item.status);
           else onStatusChange(item.id, item.status);
        };

        const handlePriorityClick = (e: React.MouseEvent) => {
           e.stopPropagation();
           if (type === 'inverter') onInverterPriorityChange(item.id, priority);
           else if (type === 'installation') onInstallationPriorityChange(item.id, priority);
           else onPriorityChange(item.id, priority);
        };

        const statusLabel = item.status === SchedulingStatus.RESOLVED 
           ? (type === 'inverter' ? 'CONFIGURADO' : type === 'installation' ? 'CONCLUÍDO' : 'RESOLVIDO') 
           : item.status === SchedulingStatus.IN_PROGRESS 
           ? 'ANDAMENTO' 
           : 'PENDENTE';

        return (
          <div key={item.id} className={`rounded-xl p-0 shadow-lg border-l-8 transition-all duration-300 hover:translate-x-1 ${styles.card} flex flex-col lg:flex-row items-stretch lg:items-center relative overflow-hidden mb-4`}>
             
             {/* Background Icon Decoration */}
             <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                {item.status === SchedulingStatus.RESOLVED ? <CheckCircle size={100} /> : item.status === SchedulingStatus.IN_PROGRESS ? <PlayCircle size={100} /> : <AlertCircle size={100} />}
             </div>

             {/* Left: Order # & Priority */}
             <div className={`p-4 lg:w-36 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r ${styles.divider} shrink-0 bg-white/20 relative`}>
               
               <span className={`text-5xl font-black leading-none mb-3 ${styles.text}`}>#{item.orderNumber}</span>

               {/* Priority Badge (Clickable) */}
               <button 
                 onClick={handlePriorityClick}
                 className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider border w-full text-center transition-all transform active:scale-95 shadow-sm hover:shadow-md cursor-pointer ${prioStyle}`}
                 title="Clique para alterar prioridade"
               >
                 {getPriorityLabel(priority)}
               </button>
             </div>

             {/* Middle: Details */}
             <div className="flex-1 p-4 lg:pl-6 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-3 mb-1">
                   <h3 className={`text-2xl font-black leading-tight ${styles.text}`}>
                     {item.client}
                   </h3>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className={`flex items-center gap-2 text-lg font-bold ${styles.subtext}`}>
                      {icon}
                      {mainDesc}
                    </div>
                    <div className={`flex items-center gap-2 text-base font-bold opacity-80 ${styles.subtext}`}>
                      <MapPin size={18} />
                      <span className="truncate max-w-xs">{item.location || 'Local não informado'}</span>
                    </div>
                </div>
             </div>

             {/* Right: Date & Action */}
             <div className={`p-4 lg:w-80 flex flex-col lg:items-end justify-center gap-3 border-t lg:border-t-0 lg:border-l ${styles.divider} bg-white/10 relative z-10`}>
                <div className={`${styles.subtext} lg:text-right`}>
                   <div className="flex items-center lg:justify-end gap-2 font-black text-xl">
                      <Calendar size={22} />
                      {formatDateFull(item.scheduledDate)}
                   </div>
                   <div className="text-sm font-bold opacity-70 mt-1 uppercase flex items-center lg:justify-end gap-1">
                      <User size={14}/>
                      {item.team || item.salesperson || 'Sem Equipe'}
                   </div>
                </div>

                <button 
                   onClick={handleStatusClick}
                   className={`w-full lg:w-auto px-6 py-2 rounded-lg font-black text-sm uppercase tracking-widest shadow-md transform active:scale-95 transition-all ${styles.badge}`}
                 >
                   {statusLabel}
                </button>
             </div>

          </div>
        );
     });
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-green-50 flex flex-col">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        
        {/* TAB SWITCHER */}
        <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto max-w-full">
           <button 
             onClick={() => setActiveTab('scheduling')}
             className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'scheduling' ? 'bg-white text-cbc-green shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Briefcase size={20} /> Fila Agendamentos
           </button>
           <button 
             onClick={() => setActiveTab('installation')}
             className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'installation' ? 'bg-white text-yellow-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Wrench size={20} /> Fila Instalações
           </button>
           <button 
             onClick={() => setActiveTab('inverter')}
             className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'inverter' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Settings size={20} /> Fila Inversores
           </button>
        </div>

        <div className="flex gap-2">
           <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-bold border border-red-200">
             <FileText size={20} /> PDF
           </button>
           <button onClick={handleExportXLS} className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors font-bold border border-green-200">
             <FileSpreadsheet size={20} /> XLS
           </button>
           <button onClick={handleExportTXT} className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-bold border border-blue-200">
             <Download size={20} /> TXT
           </button>
        </div>
      </div>
      
      {/* CONTENT AREA */}
      <div className="flex flex-col gap-4 pb-20">
         {activeTab === 'scheduling' 
            ? renderList(sortedSchedulings, 'scheduling') 
            : activeTab === 'installation'
            ? renderList(sortedInstallations, 'installation')
            : renderList(sortedInverters, 'inverter')
         }
      </div>
    </div>
  );
};

export default Dashboard;
