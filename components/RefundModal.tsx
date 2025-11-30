
import React, { useState, useEffect } from 'react';
import { Refund } from '../types';
import { X, Save, Plus, DollarSign, Calendar, Users, FileText } from 'lucide-react';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (refund: any, newItems?: { team?: string }) => void;
  refundToEdit?: Refund | null;
  availableTeams: string[];
}

const RefundModal: React.FC<RefundModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  refundToEdit, 
  availableTeams
}) => {
  const initialFormState = {
    team: '',
    date: new Date().toISOString().split('T')[0],
    value: '' as any,
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    if (refundToEdit) {
      setFormData({
        ...refundToEdit,
        value: refundToEdit.value || ''
      });
    } else {
      setFormData(initialFormState);
    }
    setIsAddingTeam(false); setNewTeamName('');
  }, [refundToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalTeam = formData.team;
    let teamToAdd = undefined;
    if (isAddingTeam && newTeamName.trim()) {
      finalTeam = newTeamName.trim();
      teamToAdd = newTeamName.trim();
    }

    const payload = {
      ...formData,
      team: finalTeam,
      value: Number(formData.value) || 0,
      id: refundToEdit?.id,
    };

    onSave(payload, { team: teamToAdd });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <DollarSign size={24} />
              {refundToEdit ? 'Editar Reembolso' : 'Novo Reembolso'}
            </h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="space-y-4">
            
            {/* Equipe */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                 <Users size={16} className="text-emerald-600"/> Equipe
              </label>
              {!isAddingTeam ? (
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900 shadow-sm"
                    value={formData.team}
                    onChange={e => setFormData({ ...formData, team: e.target.value })}
                    required
                  >
                    <option value="">Selecione a equipe...</option>
                    {availableTeams.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={() => setIsAddingTeam(true)}
                    className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                    title="Adicionar Nova Equipe"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-emerald-500 ring-1 ring-emerald-500 rounded-lg focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 shadow-sm"
                    placeholder="Nome da Nova Equipe"
                    value={newTeamName}
                    onChange={e => setNewTeamName(e.target.value)}
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => setIsAddingTeam(false)}
                    className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                    title="Cancelar"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                     <Calendar size={16} className="text-emerald-600"/> Data
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900 shadow-sm"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                     <DollarSign size={16} className="text-emerald-600"/> Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900 shadow-sm font-bold text-emerald-700"
                    placeholder="0.00"
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                  />
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                <FileText size={16} className="text-emerald-600"/> Descrição do Gasto
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none bg-white text-gray-900 shadow-sm"
                placeholder="Ex: Combustível, Alimentação, Material..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
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
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 font-medium shadow-md transition-colors"
          >
            <Save size={18} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
