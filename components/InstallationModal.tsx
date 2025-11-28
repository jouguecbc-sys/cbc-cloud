
import React, { useState, useEffect } from 'react';
import { Installation, SchedulingStatus, SchedulingPriority } from '../types';
import { X, Save, Plus, MapPin, User, FileText, Wrench, AlertTriangle, Zap, Calendar } from 'lucide-react';

interface InstallationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (install: any, newItems?: { salesperson?: string; team?: string }) => void;
  installationToEdit?: Installation | null;
  availableSalespeople: string[];
  availableTeams: string[];
  nextOrderNumber: string;
}

const InstallationModal: React.FC<InstallationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  installationToEdit, 
  availableSalespeople,
  availableTeams,
  nextOrderNumber 
}) => {
  const initialFormState = {
    client: '',
    salesperson: '',
    location: '',
    contractDate: '',
    deadlineDate: '', // Calculated
    arrivalDate: '',
    panelQuantity: 0,
    kwp: 0,
    scheduledDate: '',
    team: '',
    observation: '',
    status: SchedulingStatus.PENDING,
    priority: SchedulingPriority.MEDIUM,
    completionDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  
  // Dynamic add states
  const [isAddingSalesperson, setIsAddingSalesperson] = useState(false);
  const [newSalespersonName, setNewSalespersonName] = useState('');

  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    if (installationToEdit) {
      setFormData({
        ...installationToEdit,
        panelQuantity: installationToEdit.panelQuantity || 0,
        kwp: installationToEdit.kwp || 0,
        completionDate: installationToEdit.completionDate || '',
        priority: installationToEdit.priority || SchedulingPriority.MEDIUM,
        deadlineDate: installationToEdit.deadlineDate || ''
      });
    } else {
      setFormData(initialFormState);
    }
    // Reset add states
    setIsAddingSalesperson(false); setNewSalespersonName('');
    setIsAddingTeam(false); setNewTeamName('');
  }, [installationToEdit, isOpen]);

  // Auto calculate deadline (Contract + 90 days)
  useEffect(() => {
    if (formData.contractDate && !installationToEdit) {
      const contract = new Date(formData.contractDate);
      if (!isNaN(contract.getTime())) {
        const deadline = new Date(contract);
        deadline.setDate(contract.getDate() + 90);
        setFormData(prev => ({ ...prev, deadlineDate: deadline.toISOString().split('T')[0] }));
      }
    }
  }, [formData.contractDate]);

  const handleStatusChange = (status: SchedulingStatus) => {
    let completion = formData.completionDate;
    if (status === SchedulingStatus.RESOLVED && !completion) {
      completion = new Date().toISOString().split('T')[0];
    } else if (status !== SchedulingStatus.RESOLVED) {
      completion = '';
    }
    setFormData({ ...formData, status, completionDate: completion });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalSalesperson = formData.salesperson;
    let salespersonToAdd = undefined;
    if (isAddingSalesperson && newSalespersonName.trim()) {
      finalSalesperson = newSalespersonName.trim();
      salespersonToAdd = newSalespersonName.trim();
    }

    let finalTeam = formData.team;
    let teamToAdd = undefined;
    if (isAddingTeam && newTeamName.trim()) {
      finalTeam = newTeamName.trim();
      teamToAdd = newTeamName.trim();
    }

    const payload = {
      ...formData,
      salesperson: finalSalesperson,
      team: finalTeam,
      panelQuantity: Number(formData.panelQuantity),
      kwp: Number(formData.kwp),
      id: installationToEdit?.id,
    };

    onSave(payload, { 
      salesperson: salespersonToAdd, 
      team: teamToAdd 
    });
    onClose();
  };

  if (!isOpen) return null;

  const renderDynamicField = (
    label: string, 
    value: string, 
    onChange: (val: string) => void,
    options: string[],
    isAdding: boolean,
    setIsAdding: (val: boolean) => void,
    newValue: string,
    setNewValue: (val: string) => void,
    placeholderNew: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {!isAdding ? (
        <div className="flex gap-2">
          <select
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
            value={value}
            onChange={e => onChange(e.target.value)}
          >
            <option value="">Selecione...</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
          <button 
            type="button"
            onClick={() => setIsAdding(true)}
            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-sm"
            title={`Adicionar ${label}`}
          >
            <Plus size={20} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-yellow-500 ring-1 ring-yellow-500 rounded-lg focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 shadow-sm"
            placeholder={placeholderNew}
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            autoFocus
          />
          <button 
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
            title="Cancelar"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl transform transition-all overflow-hidden flex flex-col max-h-[95vh]">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-400 p-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wrench size={24} />
              {installationToEdit ? `Editar Instalação #${installationToEdit.orderNumber}` : `Nova Instalação #${nextOrderNumber}`}
            </h2>
            <p className="text-xs text-white/80 opacity-90 mt-1">
               {installationToEdit 
                 ? `Registrado em: ${new Date(installationToEdit.registrationDate).toLocaleString()}` 
                 : `Registro Automático: ${new Date().toLocaleString()}`}
            </p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Coluna 1: Cliente e Contrato */}
            <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3 flex items-center gap-2">
                <User size={18} className="text-yellow-600"/> Dados do Projeto
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
                  placeholder="Nome do Cliente"
                  value={formData.client}
                  onChange={e => setFormData({ ...formData, client: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Local</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
                    placeholder="Endereço da Obra"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              {renderDynamicField(
                "Vendedor", 
                formData.salesperson, 
                (val) => setFormData({...formData, salesperson: val}), 
                availableSalespeople, 
                isAddingSalesperson, 
                setIsAddingSalesperson, 
                newSalespersonName, 
                setNewSalespersonName, 
                "Novo Vendedor"
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Data Contrato</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
                    value={formData.contractDate}
                    onChange={e => setFormData({ ...formData, contractDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data Limite (90d)</label>
                  <input
                    type="date"
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed shadow-sm"
                    value={formData.deadlineDate}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">*Calculado automaticamente</p>
                </div>
              </div>
            </div>

            {/* Coluna 2: Detalhes Técnicos e Execução */}
            <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3 flex items-center gap-2">
                <Zap size={18} className="text-yellow-600"/> Detalhes Técnicos
              </h3>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Qtd. Placas</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
                      placeholder="0"
                      value={formData.panelQuantity}
                      onChange={e => setFormData({ ...formData, panelQuantity: Number(e.target.value) })}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Potência (kWp)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
                      placeholder="0.00"
                      value={formData.kwp}
                      onChange={e => setFormData({ ...formData, kwp: Number(e.target.value) })}
                    />
                 </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Chegada das Placas</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
                    value={formData.arrivalDate}
                    onChange={e => setFormData({ ...formData, arrivalDate: e.target.value })}
                  />
              </div>

              {renderDynamicField(
                "Equipe de Instalação", 
                formData.team, 
                (val) => setFormData({...formData, team: val}), 
                availableTeams, 
                isAddingTeam, 
                setIsAddingTeam, 
                newTeamName, 
                setNewTeamName, 
                "Nova Equipe"
              )}

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Agendada Para</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
                      value={formData.scheduledDate}
                      onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                       <AlertTriangle size={14} className="text-yellow-600"/> Prioridade
                    </label>
                    <select
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none bg-white text-gray-900 shadow-sm font-bold
                        ${formData.priority === SchedulingPriority.URGENT ? 'text-red-600 border-red-300 focus:ring-red-500' : 
                          formData.priority === SchedulingPriority.HIGH ? 'text-orange-600' : 'text-gray-700'}`}
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: e.target.value as SchedulingPriority })}
                    >
                      <option value={SchedulingPriority.LOW}>Baixa</option>
                      <option value={SchedulingPriority.MEDIUM}>Média</option>
                      <option value={SchedulingPriority.HIGH}>Alta</option>
                      <option value={SchedulingPriority.URGENT}>⚠️ URGENTE</option>
                    </select>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
                    value={formData.status}
                    onChange={e => handleStatusChange(e.target.value as SchedulingStatus)}
                  >
                    <option value={SchedulingStatus.PENDING}>Pendente</option>
                    <option value={SchedulingStatus.IN_PROGRESS}>Em Andamento</option>
                    <option value={SchedulingStatus.RESOLVED}>Concluído</option>
                  </select>
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-1">Data Conclusão</label>
                   <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900 shadow-sm"
                    value={formData.completionDate}
                    onChange={e => setFormData({ ...formData, completionDate: e.target.value })}
                    disabled={formData.status !== SchedulingStatus.RESOLVED}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
              <FileText size={16} /> Observações da Obra
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none resize-none bg-white text-gray-900 shadow-sm"
              placeholder="Detalhes de acesso, telhado, etc..."
              value={formData.observation}
              onChange={e => setFormData({ ...formData, observation: e.target.value })}
            />
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
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2 font-medium shadow-md transition-colors"
          >
            <Save size={18} />
            Salvar Instalação
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallationModal;
