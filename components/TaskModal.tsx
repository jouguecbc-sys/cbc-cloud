import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../types';
import { X, Save } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'> | Task) => void;
  taskToEdit?: Task | null;
  defaultCategory?: TaskCategory;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit, defaultCategory }) => {
  const initialFormState = {
    title: '',
    description: '',
    category: defaultCategory || TaskCategory.WORK,
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    dueDate: new Date().toISOString().split('T')[0],
    alarmTime: '09:00',
    assignee: '',
    tags: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        ...taskToEdit,
        tags: taskToEdit.tags.join(', '),
      });
    } else {
      setFormData({
        ...initialFormState,
        category: defaultCategory || TaskCategory.WORK
      });
    }
  }, [taskToEdit, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    const taskPayload = {
      ...formData,
      tags: tagArray,
      id: taskToEdit?.id,
      createdAt: taskToEdit?.createdAt
    };

    // @ts-ignore - ID and createdAt handled in parent for new tasks
    onSave(taskPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-cbc-green p-4 flex justify-between items-center text-white shrink-0">
          <h2 className="text-xl font-bold">{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título da Tarefa</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green focus:border-cbc-green transition-all bg-white text-gray-900"
                placeholder="Ex: Instalação Painéis Solares"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green bg-white text-gray-900"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                >
                  <option value={TaskCategory.WORK}>Trabalho</option>
                  <option value={TaskCategory.PERSONAL}>Pessoal</option>
                  <option value={TaskCategory.TEAM}>Equipe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green bg-white text-gray-900"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                >
                  <option value={TaskPriority.HIGH}>Alta</option>
                  <option value={TaskPriority.MEDIUM}>Média</option>
                  <option value={TaskPriority.LOW}>Baixa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green bg-white text-gray-900"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alarme (Hora)</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green bg-white text-gray-900"
                  value={formData.alarmTime}
                  onChange={e => setFormData({ ...formData, alarmTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green bg-white text-gray-900"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  >
                    <option value={TaskStatus.PENDING}>Pendente</option>
                    <option value={TaskStatus.IN_PROGRESS}>Em Andamento</option>
                    <option value={TaskStatus.COMPLETED}>Concluída</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                   <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green bg-white text-gray-900"
                    placeholder="Nome do responsável"
                    value={formData.assignee}
                    onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                  />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green bg-white text-gray-900"
                placeholder="Detalhes da tarefa..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etiquetas (separadas por vírgula)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green bg-white text-gray-900"
                placeholder="projeto, urgente, cliente"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>
        </form>

         <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-cbc-green text-white rounded-lg hover:bg-cbc-lightGreen flex items-center gap-2 font-medium shadow-md transition-colors"
            >
              <Save size={18} />
              Salvar Tarefa
            </button>
          </div>
      </div>
    </div>
  );
};

export default TaskModal;