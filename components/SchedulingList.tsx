
import React, { useState } from 'react';
import { Scheduling, SchedulingStatus, SchedulingPriority } from '../types';
import { Search, Filter, Trash2, Edit2, Calendar, MapPin, CheckCircle, Clock, User, FileText, Download, FileSpreadsheet, Image as ImageIcon, Briefcase, PlayCircle, AlertCircle, Share2, Printer, Camera, Phone, MessageCircle, Map } from 'lucide-react';

interface SchedulingListProps {
  schedulings: Scheduling[];
  onEdit: (scheduling: Scheduling) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, currentStatus: SchedulingStatus) => void;
  onPriorityChange: (id: string, currentPriority: SchedulingPriority) => void;
}

const SchedulingList: React.FC<SchedulingListProps> = ({ schedulings, onEdit, onDelete, onStatusChange, onPriorityChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SchedulingStatus>('all');

  const getPriorityLabel = (priority: SchedulingPriority) => {
    switch(priority) {
      case SchedulingPriority.URGENT: return 'URGENTE';
      case SchedulingPriority.HIGH: return 'ALTA';
      case SchedulingPriority.MEDIUM: return 'MÉDIA';
      case SchedulingPriority.LOW: return 'BAIXA';
      default: return 'NORMAL';
    }
  };

  const getPriorityColor = (priority: SchedulingPriority) => {
    switch(priority) {
      case SchedulingPriority.URGENT: return 'text-red-600 bg-red-50 border-red-200';
      case SchedulingPriority.HIGH: return 'text-orange-600 bg-orange-50 border-orange-200';
      case SchedulingPriority.MEDIUM: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case SchedulingPriority.LOW: return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filtered = schedulings.filter(item => {
    const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
    
    const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => {
      return (
        item.client.toLowerCase().includes(term) ||
        item.service.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.orderNumber.toLowerCase().includes(term) ||
        (item.phone && item.phone.toLowerCase().includes(term)) ||
        (item.team && item.team.toLowerCase().includes(term)) ||
        (item.salesperson && item.salesperson.toLowerCase().includes(term))
      );
    });
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDateFull = (dateString?: string) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // --- Actions ---
  const handleShare = (item: Scheduling) => {
    const text = `👷 *OS #${item.orderNumber}* - ${item.client}\n📍 ${item.location}\n🛠 ${item.service}\n📅 ${formatDateFull(item.scheduledDate)} ${item.scheduledTime || ''}\n📞 ${item.phone || ''}\n📋 ${item.observation || ''}`;
    navigator.clipboard.writeText(text).then(() => alert('Copiado!'));
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

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col bg-green-50 font-sans">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 shrink-0">
        <div>
           <h2 className="text-3xl font-extrabold text-gray-800 uppercase tracking-tight">Agendamentos</h2>
           <p className="text-gray-500 mt-1">{schedulings.length} ordens registradas</p>
        </div>
      
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos</option>
              <option value={SchedulingStatus.PENDING}>Pendentes</option>
              <option value={SchedulingStatus.IN_PROGRESS}>Andamento</option>
              <option value={SchedulingStatus.RESOLVED}>Resolvidos</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4 w-20">Ordem</th>
                <th className="p-4 w-32">Prioridade</th>
                <th className="p-4">Cliente / Local</th>
                <th className="p-4">Serviço / Equipe</th>
                <th className="p-4 w-32">Data</th>
                <th className="p-4 w-32 text-center">Status</th>
                <th className="p-4 w-32 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-green-50/50 transition-colors group">
                  <td className="p-4 font-bold text-gray-700">#{item.orderNumber}</td>
                  
                  <td className="p-4">
                    <button 
                      onClick={() => {
                         const next = item.priority === SchedulingPriority.URGENT ? SchedulingPriority.LOW : 
                                      item.priority === SchedulingPriority.HIGH ? SchedulingPriority.URGENT :
                                      item.priority === SchedulingPriority.MEDIUM ? SchedulingPriority.HIGH : SchedulingPriority.MEDIUM;
                         onPriorityChange(item.id, next);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-bold border uppercase w-24 text-center transition-all hover:opacity-80 ${getPriorityColor(item.priority || SchedulingPriority.MEDIUM)}`}
                    >
                      {getPriorityLabel(item.priority || SchedulingPriority.MEDIUM)}
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-gray-800">{item.client}</div>
                    
                    {/* Actionable Location */}
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 group/loc">
                       <MapPin size={10} /> 
                       <span 
                         onClick={() => openMaps(item.location)}
                         className="hover:text-blue-600 hover:underline cursor-pointer" 
                         title="Abrir no Google Maps"
                       >
                         {item.location || 'Sem endereço'}
                       </span>
                    </div>

                    {/* Actionable Phone */}
                    {item.phone && (
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 group/phone">
                            <MessageCircle size={10} className="text-green-500" />
                            <span 
                                onClick={() => openWhatsApp(item.phone)}
                                className="hover:text-green-600 hover:underline cursor-pointer"
                                title="Chamar no WhatsApp"
                            >
                                {item.phone}
                            </span>
                        </div>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-gray-700">{item.service}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 uppercase">
                       <User size={10} /> {item.team || '---'}
                    </div>
                  </td>

                  <td className="p-4 text-gray-600">
                    <div className="flex flex-col">
                       <span className="font-bold">{formatDateFull(item.scheduledDate)}</span>
                       <span className="text-xs">{item.scheduledTime || '-'}</span>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <button
                        onClick={() => onStatusChange(item.id, item.status)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all active:scale-95
                          ${item.status === SchedulingStatus.RESOLVED ? 'bg-green-100 text-green-700 border-green-200' : 
                            item.status === SchedulingStatus.IN_PROGRESS ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                            'bg-red-100 text-red-700 border-red-200'}`}
                     >
                        {item.status === SchedulingStatus.RESOLVED ? 'Resolvido' : item.status === SchedulingStatus.IN_PROGRESS ? 'Andamento' : 'Pendente'}
                     </button>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleShare(item)} className="p-1.5 hover:bg-green-100 text-gray-500 hover:text-green-700 rounded" title="Copiar"><Share2 size={16}/></button>
                      <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-blue-100 text-gray-500 hover:text-blue-700 rounded" title="Editar"><Edit2 size={16}/></button>
                      <button onClick={() => onDelete(item.id)} className="p-1.5 hover:bg-red-100 text-gray-500 hover:text-red-700 rounded" title="Excluir"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchedulingList;