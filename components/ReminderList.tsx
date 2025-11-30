
import React, { useState } from 'react';
import { Reminder } from '../types';
import { Search, Plus, Trash2, Edit2, Archive, CheckCircle, RotateCcw, StickyNote, Clock } from 'lucide-react';

interface ReminderListProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, status: boolean) => void;
  onToggleArchive: (id: string, status: boolean) => void;
  onNew: () => void;
}

const ReminderList: React.FC<ReminderListProps> = ({ 
  reminders, 
  onEdit, 
  onDelete, 
  onToggleComplete,
  onToggleArchive,
  onNew
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filtered = reminders.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchive = showArchived ? item.is_archived : !item.is_archived;
    return matchesSearch && matchesArchive;
  });

  const formatDate = (date: string) => {
    if(!date) return '';
    return date.split('-').reverse().join('/');
  };

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col bg-stone-100 font-sans relative">
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cork-board.png')]"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0 relative z-10">
        <div>
           <h2 className="text-3xl font-extrabold text-gray-800 uppercase tracking-tight flex items-center gap-2">
             <StickyNote size={32} className="text-pink-500" />
             Quadro de Lembretes
           </h2>
           <p className="text-gray-500 mt-1 font-hand text-xl">
             {showArchived ? 'Arquivo Morto' : 'Suas notas adesivas virtuais'}
           </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input
                type="text"
                placeholder="Buscar nota..."
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           
           <button 
             onClick={() => setShowArchived(!showArchived)}
             className={`px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border ${showArchived ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
           >
             <Archive size={18} />
             {showArchived ? 'Ver Ativos' : 'Arquivo'}
           </button>

           {!showArchived && (
             <button 
               onClick={onNew}
               className="px-4 py-2 bg-pink-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-600 shadow-md transition-transform hover:-translate-y-0.5"
             >
               <Plus size={18} />
               Novo Post-it
             </button>
           )}
        </div>
      </div>

      {/* Grid of Post-its */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20 relative z-10">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
            <StickyNote size={64} className="mb-4" />
            <p className="text-xl font-bold font-hand text-2xl">Nenhum lembrete aqui...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {filtered.map((item) => (
              <div 
                key={item.id} 
                className={`relative p-6 shadow-[2px_4px_8px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_8px_12px_rgba(0,0,0,0.2)] flex flex-col aspect-square min-h-[300px] overflow-hidden group`}
                style={{ 
                  backgroundColor: item.color,
                  transform: `rotate(${Math.random() * 2 - 1}deg)` // Subtle random rotation
                }}
              >
                {/* Pin Effect */}
                <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-4 h-8 bg-black/10 blur-[1px] rounded-full"></div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-800 shadow-sm border border-red-900 z-20"></div>

                {/* Content */}
                <div className="mt-4 flex-1 flex flex-col font-hand">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-3xl font-bold leading-tight text-gray-800 ${item.is_completed ? 'line-through decoration-2 decoration-gray-600 opacity-60' : ''}`}>
                        {item.title}
                      </h3>
                   </div>
                   
                   <p className={`text-xl text-gray-700 leading-relaxed flex-1 whitespace-pre-wrap ${item.is_completed ? 'line-through opacity-50' : ''}`}>
                     {item.description}
                   </p>

                   {/* Metadata Footer */}
                   <div className="mt-4 pt-3 border-t border-black/10 flex flex-col gap-1 text-sm font-sans text-gray-700/70 font-bold">
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-1">
                           {formatDate(item.date)}
                         </span>
                         {item.time && (
                           <span className="flex items-center gap-1 bg-black/5 px-2 py-0.5 rounded-md">
                             <Clock size={12} /> {item.time}
                           </span>
                         )}
                      </div>
                      {item.is_completed && (
                        <span className="text-xs text-green-800 mt-1">
                           Concluído em: {formatDate(item.completion_date || '')}
                        </span>
                      )}
                   </div>
                </div>

                {/* Actions Overlay (Visible on Hover) */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                   <button 
                     onClick={() => onEdit(item)}
                     className="p-2 bg-white/50 hover:bg-white rounded-full shadow-sm text-gray-700 backdrop-blur-sm transition-all"
                     title="Editar"
                   >
                     <Edit2 size={16} />
                   </button>
                   <button 
                     onClick={() => onDelete(item.id)}
                     className="p-2 bg-white/50 hover:bg-red-500 hover:text-white rounded-full shadow-sm text-red-600 backdrop-blur-sm transition-all"
                     title="Excluir"
                   >
                     <Trash2 size={16} />
                   </button>
                   <button 
                     onClick={() => onToggleArchive(item.id, !item.is_archived)}
                     className="p-2 bg-white/50 hover:bg-blue-500 hover:text-white rounded-full shadow-sm text-blue-600 backdrop-blur-sm transition-all"
                     title={item.is_archived ? "Desarquivar" : "Arquivar"}
                   >
                     {item.is_archived ? <RotateCcw size={16}/> : <Archive size={16} />}
                   </button>
                </div>

                {/* Main Check Action (Bottom Right) */}
                <button 
                  onClick={() => onToggleComplete(item.id, !item.is_completed)}
                  className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all transform active:scale-90 z-20
                    ${item.is_completed ? 'bg-green-600 text-white' : 'bg-white/50 hover:bg-white text-gray-500 hover:text-green-600'}`}
                  title={item.is_completed ? "Reabrir" : "Concluir"}
                >
                  <CheckCircle size={24} className={item.is_completed ? 'fill-current' : ''} />
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderList;
