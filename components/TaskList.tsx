import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Search, Filter, Trash2, Edit2, CheckCircle, Clock, Calendar, Tag, FileText, Download } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
  title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleStatus, title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');

  // Full Color Card Styles
  const statusStyles = {
    [TaskStatus.COMPLETED]: 'bg-green-50 border-green-200 text-green-900',
    [TaskStatus.IN_PROGRESS]: 'bg-orange-50 border-orange-200 text-orange-900',
    [TaskStatus.PENDING]: 'bg-gray-50 border-gray-200 text-gray-900',
  };

  const priorityBadges = {
    [TaskPriority.HIGH]: 'bg-red-200 text-red-900 border-red-300',
    [TaskPriority.MEDIUM]: 'bg-orange-200 text-orange-900 border-orange-300',
    [TaskPriority.LOW]: 'bg-blue-200 text-blue-900 border-blue-300',
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportPDF = () => {
    // @ts-ignore
    if (!window.jspdf) { alert('Biblioteca PDF carregando...'); return; }
    // @ts-ignore
    const doc = new window.jspdf.jsPDF();
    
    doc.setFontSize(18);
    doc.text(`Lista de Tarefas - ${title}`, 14, 22);
    
    const tableColumn = ["Tarefa", "Prioridade", "Vencimento", "Status", "Responsável"];
    const tableRows = filteredTasks.map(task => [
      task.title,
      task.priority.toUpperCase(),
      task.dueDate,
      task.status === TaskStatus.COMPLETED ? 'CONCLUÍDA' : task.status === TaskStatus.IN_PROGRESS ? 'ANDAMENTO' : 'PENDENTE',
      task.assignee || '-'
    ]);

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save(`tarefas_${title.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportTXT = () => {
    let content = `LISTA DE TAREFAS - ${title.toUpperCase()}\n`;
    content += "========================================\n\n";

    filteredTasks.forEach(task => {
      content += `[${task.status === TaskStatus.COMPLETED ? 'X' : ' '}] ${task.title.toUpperCase()}\n`;
      content += `   Prioridade: ${task.priority}\n`;
      content += `   Vencimento: ${task.dueDate}\n`;
      content += `   Obs: ${task.description}\n`;
      content += "----------------------------------------\n";
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tarefas_${title.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 h-full flex flex-col bg-white">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 shrink-0 gap-6">
        <div>
           <h2 className="text-4xl font-extrabold text-gray-800 uppercase tracking-tight">{title}</h2>
           <p className="text-gray-500 mt-2 text-lg">{tasks.length} tarefas totais nesta categoria</p>
        </div>
      
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          {/* Export */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={handleExportPDF} className="p-2 hover:bg-white hover:text-red-600 rounded-md transition-colors text-gray-600" title="Exportar PDF">
                <FileText size={20} />
              </button>
              <button onClick={handleExportTXT} className="p-2 hover:bg-white hover:text-blue-600 rounded-md transition-colors text-gray-600" title="Exportar TXT">
                <Download size={20} />
              </button>
           </div>
           
           <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block"></div>

          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cbc-green focus:border-transparent outline-none sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-1 sm:flex-none">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <select
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cbc-green outline-none appearance-none bg-white cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos Status</option>
              <option value={TaskStatus.PENDING}>Pendentes</option>
              <option value={TaskStatus.IN_PROGRESS}>Em Andamento</option>
              <option value={TaskStatus.COMPLETED}>Concluídas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        {filteredTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <CheckCircle size={48} />
            </div>
            <p className="text-xl font-bold">Nenhuma tarefa encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`group rounded-2xl p-6 shadow-sm border-2 hover:shadow-lg transition-all duration-200 flex flex-col ${statusStyles[task.status]} ${task.status === TaskStatus.COMPLETED ? 'opacity-80 grayscale-[0.5]' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${priorityBadges[task.priority]}`}>
                    {task.priority}
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                      className="p-2 bg-white/40 hover:bg-white text-inherit rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                      className="p-2 bg-white/40 hover:bg-red-500 hover:text-white text-inherit rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className={`font-black text-2xl mb-2 leading-tight ${task.status === TaskStatus.COMPLETED ? 'line-through opacity-70' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-base opacity-80 mb-6 line-clamp-3 flex-grow font-medium">{task.description}</p>

                <div className="space-y-4 mt-auto">
                  <div className="flex items-center gap-4 text-sm font-semibold opacity-80">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>{task.dueDate}</span>
                    </div>
                    {task.alarmTime && (
                       <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span>{task.alarmTime}</span>
                      </div>
                    )}
                  </div>

                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-xs font-bold bg-white/40 px-2 py-1 rounded-md uppercase">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                     <span className="font-bold text-sm uppercase tracking-wide opacity-90">
                        {task.status === TaskStatus.COMPLETED ? 'Concluída' : task.status === TaskStatus.IN_PROGRESS ? 'Em Andamento' : 'Pendente'}
                     </span>
                     
                     <button 
                        onClick={(e) => { e.stopPropagation(); onToggleStatus(task); }}
                        className={`p-3 rounded-full transition-transform active:scale-90 ${task.status === TaskStatus.COMPLETED ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:text-green-600 shadow-sm'}`}
                        title={task.status === TaskStatus.COMPLETED ? "Reabrir" : "Concluir"}
                     >
                        <CheckCircle size={24} className={task.status === TaskStatus.COMPLETED ? 'fill-current' : ''} />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;