
import React, { useState } from 'react';
import { Scheduling, SchedulingStatus, InverterConfig, SchedulingPriority } from '../types';
import { Calendar, MapPin, User, CheckCircle, AlertCircle, PlayCircle, Briefcase, FileText, Download, FileSpreadsheet, Settings, Cpu, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  schedulings: Scheduling[];
  inverterConfigs: InverterConfig[];
  onStatusChange: (id: string, currentStatus: SchedulingStatus) => void;
  onInverterStatusChange: (id: string, currentStatus: SchedulingStatus) => void;
  onPriorityChange: (id: string, currentPriority: SchedulingPriority) => void;
  onInverterPriorityChange: (id: string, currentPriority: SchedulingPriority) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  schedulings, 
  inverterConfigs, 
  onStatusChange, 
  onInverterStatusChange,
  onPriorityChange,
  onInverterPriorityChange
}) => {
  const [activeTab, setActiveTab] = useState<'scheduling' | 'inverter'>('scheduling');

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

  // --- Style Logic ---
  const getStatusStyles = (status: SchedulingStatus, type: 'scheduling' | 'inverter') => {
    const isInverter = type === 'inverter';

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
        if (isInverter) {
          return { // Blue Theme for Resolved Inverters
            card: 'bg-blue-100 border-blue-300 shadow-sm hover:shadow-md hover:shadow-blue-200 opacity-60',
            text: 'text-blue-900',
            badge: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
            icon: 'text-blue-700',
            subtext: 'text-blue-800',
            divider: 'border-blue-200'
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
    
    const isInv = activeTab === 'inverter';
    const title = isInv ? 'Monitor de Inversores' : 'Monitor de Agendamentos';
    const data = isInv ? sortedInverters : sortedSchedulings;

    doc.setFontSize(22);
    doc.text(`${title} - CBC Solar`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28);

    const tableColumn = ["Ordem", "Prio.", "Cliente", isInv ? "Modelo" : "Serviço", "Data", "Status"];
    const tableRows = data.map(item => [
      item.orderNumber,
      getPriorityLabel(item.priority || SchedulingPriority.MEDIUM),
      item.client,
      isInv ? (item as InverterConfig).inverterModel : (item as Scheduling).service,
      formatDateFull(item.scheduledDate),
      item.status === SchedulingStatus.RESOLVED ? (isInv ? 'Configurado' : 'Resolvido') : item.status === SchedulingStatus.IN_PROGRESS ? 'Andamento' : 'Pendente'
    ]);

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: isInv ? [59, 130, 246] : [46, 139, 87] }
    });

    doc.save(`dashboard_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportTXT = () => {
    const isInv = activeTab === 'inverter';
    const data = isInv ? sortedInverters : sortedSchedulings;
    const title = isInv ? 'MONITOR DE INVERSORES' : 'MONITOR DE AGENDAMENTOS';

    let content = "================================================\n";
    content += `           ${title}              \n`;
    content += `           DATA: ${new Date().toLocaleString()} \n`;
    content += "================================================\n\n";

    data.forEach(item => {
      content += `ORDEM #${item.orderNumber} [${getPriorityLabel(item.priority || SchedulingPriority.MEDIUM)}] - ${item.status.toUpperCase()}\n`;
      content += `CLIENTE: ${item.client}\n`;
      content += isInv ? `MODELO:  ${(item as InverterConfig).inverterModel}\n` : `SERVIÇO: ${(item as Scheduling).service}\n`;
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
    
    const isInv = activeTab === 'inverter';
    const data = isInv ? sortedInverters : sortedSchedulings;

    const ws = XLSX.utils.json_to_sheet(data.map(item => ({
      Ordem: item.orderNumber,
      Prioridade: getPriorityLabel(item.priority || SchedulingPriority.MEDIUM),
      Status: item.status,
      Cliente: item.client,
      [isInv ? "Modelo" : "Servico"]: isInv ? (item as InverterConfig).inverterModel : (item as Scheduling).service,
      Data: formatDateFull(item.scheduledDate),
      Hora: item.scheduledTime,
      Equipe: item.team,
      Vendedor: item.salesperson
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monitor");
    XLSX.writeFile(wb, `monitor_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // --- Render List Helper ---
  const renderList = (items: any[], type: 'scheduling' | 'inverter') => {
     if (items.length === 0) {
        return (
           <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <div className="bg-white p-8 rounded-full mb-6 shadow-sm">
                {type === 'inverter' ? <Settings size={80} className="text-gray-300" /> : <Calendar size={80} className="text-gray-300" />}
              </div>
              <p className="text-4xl font-bold mb-2 text-gray-300">Sem Itens na Fila</p>
           </div>
        );
     }

     return items.map(item => {
        const styles = getStatusStyles(item.status, type);
        const itemDesc = type === 'inverter' ? (item as InverterConfig).inverterModel : (item as Scheduling).service;
        const priority = item.priority || SchedulingPriority.MEDIUM;
        const prioStyle = getPriorityStyles(priority);

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
                 onClick={(e) => {
                   e.stopPropagation();
                   type === 'inverter' 
                     ? onInverterPriorityChange(item.id, priority)
                     : onPriorityChange(item.id, priority);
                 }}
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
                      {type === 'inverter' ? <Cpu size={20} /> : <Briefcase size={20} />}
                      {itemDesc}
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
                   onClick={() => type === 'inverter' ? onInverterStatusChange(item.id, item.status) : onStatusChange(item.id, item.status)}
                   className={`w-full lg:w-auto px-6 py-2 rounded-lg font-black text-sm uppercase tracking-widest shadow-md transform active:scale-95 transition-all ${styles.badge}`}
                 >
                   {item.status === SchedulingStatus.RESOLVED ? (type === 'inverter' ? 'CONFIGURADO' : 'RESOLVIDO') : item.status === SchedulingStatus.IN_PROGRESS ? 'ANDAMENTO' : 'PENDENTE'}
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
        <div className="flex p-1 bg-gray-100 rounded-xl">
           <button 
             onClick={() => setActiveTab('scheduling')}
             className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'scheduling' ? 'bg-white text-cbc-green shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Briefcase size={20} /> Fila de Agendamentos
           </button>
           <button 
             onClick={() => setActiveTab('inverter')}
             className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'inverter' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Settings size={20} /> Fila de Inversores
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
            : renderList(sortedInverters, 'inverter')
         }
      </div>
    </div>
  );
};

export default Dashboard;
