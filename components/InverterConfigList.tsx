
import React, { useState } from 'react';
import { InverterConfig, SchedulingStatus, SchedulingPriority } from '../types';
import { Search, Filter, Trash2, Edit2, Calendar, MapPin, CheckCircle, Clock, User, FileText, FileSpreadsheet, Image as ImageIcon, Briefcase, PlayCircle, AlertCircle, Share2, Printer, Camera, Phone, Settings, Cpu, MessageCircle } from 'lucide-react';

interface InverterConfigListProps {
  configs: InverterConfig[];
  onEdit: (config: InverterConfig) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, currentStatus: SchedulingStatus) => void;
}

const InverterConfigList: React.FC<InverterConfigListProps> = ({ configs, onEdit, onDelete, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SchedulingStatus>('all');

  // Styles adapted for Inverter Config (Blue Theme)
  const getStatusStyles = (status: SchedulingStatus) => {
    switch(status) {
      case SchedulingStatus.PENDING: 
        return {
          card: 'bg-red-100 border-red-300 shadow-sm hover:shadow-red-200',
          text: 'text-red-900',
          badge: 'bg-red-600 text-white border-red-700 hover:bg-red-700',
          subtext: 'text-red-800',
          divider: 'border-red-200',
          icon: 'text-red-700',
          overlay: 'bg-white/40'
        };
      case SchedulingStatus.IN_PROGRESS: 
        return {
          card: 'bg-orange-100 border-orange-300 shadow-sm hover:shadow-orange-200',
          text: 'text-orange-900',
          badge: 'bg-orange-600 text-white border-orange-700 hover:bg-orange-700',
          subtext: 'text-orange-800',
          divider: 'border-orange-200',
          icon: 'text-orange-700',
          overlay: 'bg-white/40'
        };
      case SchedulingStatus.RESOLVED: 
        return {
          card: 'bg-blue-100 border-blue-300 shadow-sm hover:shadow-blue-200', // Blue for Resolved Inverter
          text: 'text-blue-900',
          badge: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
          subtext: 'text-blue-800',
          divider: 'border-blue-200',
          icon: 'text-blue-700',
          overlay: 'bg-white/40'
        };
    }
  };

  const getPriorityStyles = (priority: SchedulingPriority) => {
    switch(priority) {
      case SchedulingPriority.URGENT:
        return 'bg-red-600 text-white border-red-700 animate-pulse font-black shadow-lg shadow-red-500/30';
      case SchedulingPriority.HIGH:
        return 'bg-orange-500 text-white border-orange-600 font-bold';
      case SchedulingPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 font-bold';
      case SchedulingPriority.LOW:
        return 'bg-blue-100 text-blue-800 border-blue-200 font-medium';
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

  const filtered = configs.filter(item => {
    const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
    const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => {
      return (
        item.client.toLowerCase().includes(term) ||
        item.inverterModel.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.orderNumber.toLowerCase().includes(term) ||
        (item.phone && item.phone.toLowerCase().includes(term)) ||
        (item.team && item.team.toLowerCase().includes(term)) ||
        (item.salesperson && item.salesperson.toLowerCase().includes(term)) ||
        (item.observation && item.observation.toLowerCase().includes(term))
      );
    });
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDateFull = (dateString?: string) => {
    if (!dateString) return 'Data a definir';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const openWhatsApp = (phone?: string) => {
    if(!phone) return alert("Sem telefone cadastrado.");
    const num = phone.replace(/\D/g, '');
    if(num.length < 10) return alert("Número inválido.");
    window.open(`https://wa.me/55${num}`, '_blank');
  };

  const openMaps = (location?: string) => {
    if(!location) return alert("Sem endereço.");
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const handleShare = (item: InverterConfig) => {
    const text = `🔌 *CONFIGURAÇÃO INVERSOR CBC SOLAR #${item.orderNumber}*\n` +
      `👤 *Cliente:* ${item.client}\n` +
      `📍 *Local:* ${item.location}\n` +
      `⚙️ *Modelo:* ${item.inverterModel}\n` +
      `📅 *Data:* ${formatDateFull(item.scheduledDate)}\n` +
      `👷 *Técnico:* ${item.team || 'Não definido'}`;
    navigator.clipboard.writeText(text).then(() => alert('Copiado!'));
  };

  // Simplified export calls
  const handleExportPDF = () => { /* ... existing ... */ };
  const handleExportXLS = () => { /* ... existing ... */ };
  const handleExportTXT = () => { /* ... existing ... */ };
  const handleExportPNG = () => { /* ... existing ... */ };
  const handleCardPDF = (item: any) => { /* ... existing ... */ };
  const handleCardTXT = (item: any) => { /* ... existing ... */ };
  const handleCardPNG = (id: any, order: any) => { /* ... existing ... */ };

  return (
    <div className="p-8 h-full flex flex-col bg-green-50">
      {/* Header and Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 shrink-0 gap-6">
        <div>
           <h2 className="text-4xl font-extrabold text-gray-800 uppercase tracking-tight">Configuração de Inversores</h2>
           <p className="text-gray-500 mt-2 text-lg">{configs.length} configurações registradas</p>
        </div>
      
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
           {/* Global Export Buttons */}
           <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={handleExportPDF} className="p-2 hover:bg-white hover:text-red-600 rounded-md transition-colors text-gray-600" title="Lista PDF"><FileText size={20} /></button>
              <button onClick={handleExportXLS} className="p-2 hover:bg-white hover:text-green-600 rounded-md transition-colors text-gray-600" title="Lista Excel"><FileSpreadsheet size={20} /></button>
              <button onClick={handleExportTXT} className="p-2 hover:bg-white hover:text-blue-600 rounded-md transition-colors text-gray-600" title="Lista TXT"><FileText size={20} className="rotate-90"/></button>
              <button onClick={handleExportPNG} className="p-2 hover:bg-white hover:text-purple-600 rounded-md transition-colors text-gray-600" title="Foto da Lista"><ImageIcon size={20} /></button>
           </div>

           <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block"></div>

          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Buscar (Cliente + Modelo...)" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none sm:w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="relative flex-1 sm:flex-none">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <select className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
              <option value="all">Todos Status</option>
              <option value={SchedulingStatus.PENDING}>Pendentes</option>
              <option value={SchedulingStatus.IN_PROGRESS}>Em Andamento</option>
              <option value={SchedulingStatus.RESOLVED}>Configurados</option>
            </select>
          </div>
        </div>
      </div>

      <div id="inverter-list-container" className="flex-1 overflow-y-auto pr-2 pb-20 p-2">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="bg-gray-100 p-6 rounded-full mb-4"><Settings size={48} /></div>
            <p className="text-xl font-bold">Nenhuma configuração encontrada.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map(item => {
              const styles = getStatusStyles(item.status);
              const cardId = `card-inv-${item.id}`;
              const priority = item.priority || SchedulingPriority.MEDIUM;
              const prioStyle = getPriorityStyles(priority);

              return (
                <div key={item.id} id={cardId} className={`relative rounded-3xl p-0 shadow-lg border-4 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row overflow-hidden ${styles.card}`}>
                  
                  {/* Left Block: ORDER NUMBER */}
                  <div className={`w-full md:w-40 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r ${styles.divider} ${styles.overlay} shrink-0`}>
                     <div className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider border mb-2 w-full text-center ${prioStyle}`}>
                       {getPriorityLabel(priority)}
                     </div>
                     <div className="text-center">
                       <span className={`block text-xs font-black uppercase tracking-widest mb-2 opacity-70 ${styles.text}`}>Config</span>
                       <span className={`block text-6xl font-black leading-none ${styles.text}`}>#{item.orderNumber}</span>
                     </div>
                  </div>

                  {/* Center Block: DETAILS */}
                  <div className={`flex-1 p-6 flex flex-col justify-center`}>
                     <div className="flex flex-wrap justify-between items-start mb-2">
                        <h3 className={`font-black text-3xl leading-tight mb-2 flex items-center gap-3 ${styles.text}`}>
                           {item.client}
                           {item.status === SchedulingStatus.RESOLVED ? <CheckCircle className={styles.icon} size={28} /> : 
                            item.status === SchedulingStatus.IN_PROGRESS ? <PlayCircle className={styles.icon} size={28} /> : 
                            <AlertCircle className={styles.icon} size={28} />}
                        </h3>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-8 mt-2">
                        {item.phone && (
                          <div className={`flex items-center gap-3 text-lg font-bold opacity-90 ${styles.subtext} group/phone cursor-pointer`} onClick={() => openWhatsApp(item.phone)} title="Chamar no WhatsApp">
                             <MessageCircle size={20} className="text-green-600" />
                             <span className="group-hover/phone:underline">{item.phone}</span>
                          </div>
                        )}

                        <div className={`flex items-center gap-3 text-xl font-bold ${styles.subtext}`}>
                           <Cpu size={22} />
                           <span>{item.inverterModel}</span>
                        </div>

                        <div className={`flex items-center gap-3 text-xl font-bold ${styles.subtext}`}>
                           <Calendar size={22} />
                           <span>{formatDateFull(item.scheduledDate)}</span>
                        </div>
                        
                        <div className={`flex items-center gap-3 text-lg font-bold opacity-80 ${styles.subtext} group/map cursor-pointer`} onClick={() => openMaps(item.location)} title="Abrir GPS">
                           <MapPin size={20} />
                           <span className="truncate group-hover/map:underline">{item.location}</span>
                        </div>
                        
                        <div className={`flex items-center gap-3 text-lg font-bold opacity-80 ${styles.subtext}`}>
                           <User size={20} />
                           <span>{item.team || 'Téc. não definido'}</span>
                        </div>
                     </div>
                     
                     {item.observation && (
                        <div className={`mt-4 text-sm font-bold p-3 rounded-xl border italic ${styles.overlay} ${styles.divider} ${styles.subtext}`}>
                           Obs: {item.observation}
                        </div>
                     )}
                  </div>

                  {/* Right Block: ACTIONS */}
                  <div className={`w-full md:w-72 p-6 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l ${styles.divider} ${styles.overlay} shrink-0`}>
                     <div className="flex gap-2 mb-4 bg-white/50 p-1 rounded-lg backdrop-blur-sm shadow-sm">
                        <button onClick={() => handleShare(item)} className="p-2 text-gray-700 hover:text-green-600 hover:bg-white rounded transition-colors"><Share2 size={18} /></button>
                        <button onClick={() => handleCardPDF(item)} className="p-2 text-gray-700 hover:text-red-600 hover:bg-white rounded transition-colors"><Printer size={18} /></button>
                         <button onClick={() => handleCardTXT(item)} className="p-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded transition-colors"><FileText size={18} /></button>
                        <button onClick={() => handleCardPNG(cardId, item.orderNumber)} className="p-2 text-gray-700 hover:text-purple-600 hover:bg-white rounded transition-colors"><Camera size={18} /></button>
                     </div>

                     <div className="w-full text-right mb-4">
                        <div className={`text-4xl font-black ${styles.text}`}>
                           <span className="text-xl font-bold mr-1 opacity-70">R$</span>
                           {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                     </div>

                     <button onClick={() => onStatusChange(item.id, item.status)} className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs mb-3 shadow-md hover:shadow-lg transition-all active:scale-95 border-2 ${styles.badge}`}>
                        {item.status === SchedulingStatus.RESOLVED ? 'CONFIGURADO' : item.status === SchedulingStatus.IN_PROGRESS ? 'ANDAMENTO' : 'PENDENTE'}
                     </button>

                     <div className="flex gap-3 w-full justify-end">
                        <button onClick={() => onEdit(item)} className="flex-1 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center justify-center shadow-sm font-bold"><Edit2 size={18} /></button>
                        <button onClick={() => onDelete(item.id)} className="flex-1 py-2 bg-white hover:bg-red-50 text-red-500 rounded-lg transition-colors flex items-center justify-center shadow-sm font-bold"><Trash2 size={18} /></button>
                     </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InverterConfigList;
