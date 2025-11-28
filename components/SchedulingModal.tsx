
import React, { useState, useEffect } from 'react';
import { Scheduling, SchedulingStatus, SchedulingPriority } from '../types';
import { X, Save, Plus, Calendar, MapPin, User, FileText, Briefcase, Phone, AlertTriangle } from 'lucide-react';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduling: any, newItems?: { service?: string; salesperson?: string; team?: string }) => void;
  schedulingToEdit?: Scheduling | null;
  availableServices: string[];
  availableSalespeople: string[];
  availableTeams: string[];
  nextOrderNumber: string;
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  schedulingToEdit, 
  availableServices,
  availableSalespeople,
  availableTeams,
  nextOrderNumber 
}) => {
  const initialFormState = {
    client: '',
    phone: '',
    salesperson: '',
    location: '',
    service: '',
    team: '',
    observation: '',
    scheduledDate: '',
    scheduledTime: '',
    value: '' as any,
    status: SchedulingStatus.PENDING,
    priority: SchedulingPriority.MEDIUM,
    completionDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  
  // States for adding new items dynamically
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');

  const [isAddingSalesperson, setIsAddingSalesperson] = useState(false);
  const [newSalespersonName, setNewSalespersonName] = useState('');

  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    if (schedulingToEdit) {
      setFormData({
        ...schedulingToEdit,
        phone: schedulingToEdit.phone || '',
        value: schedulingToEdit.value || '',
        completionDate: schedulingToEdit.completionDate || '',
        priority: schedulingToEdit.priority || SchedulingPriority.MEDIUM
      });
    } else {
      setFormData(initialFormState);
    }
    // Reset add states
    setIsAddingService(false); setNewServiceName('');
    setIsAddingSalesperson(false); setNewSalespersonName('');
    setIsAddingTeam(false); setNewTeamName('');
  }, [schedulingToEdit, isOpen]);

  // Handle status change to auto-set completion date
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
    
    // Logic to handle new items addition
    let finalService = formData.service;
    let serviceToAdd = undefined;
    if (isAddingService && newServiceName.trim()) {
      finalService = newServiceName.trim();
      serviceToAdd = newServiceName.trim();
    }

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
      service: finalService,
      salesperson: finalSalesperson,
      team: finalTeam,
      value: Number(formData.value) || 0,
      id: schedulingToEdit?.id,
    };

    onSave(payload, { 
      service: serviceToAdd, 
      salesperson: salespersonToAdd, 
      team: teamToAdd 
    });
    onClose();
  };

  if (!isOpen) return null;

  // Helper to render Select or Input for dynamic fields
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-gray-900 shadow-sm"
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
            className="p-2 bg-cbc-green text-white rounded-lg hover:bg-cbc-lightGreen transition-colors shadow-sm"
            title={`Adicionar ${label}`}
          >
            <Plus size={20} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-cbc-green ring-1 ring-cbc-green rounded-lg focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 shadow-sm"
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
        <div className="bg-gradient-to-r from-cbc-green to-cbc-lightGreen p-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={24} />
              {schedulingToEdit ? `Editar Agendamento #${schedulingToEdit.orderNumber}` : `Novo Agendamento #${nextOrderNumber}`}
            </h2>
            <p className="text-xs text-white/80 opacity-90 mt-1">
               {schedulingToEdit 
                 ? `Registrado em: ${new Date(schedulingToEdit.registrationDate).toLocaleString()}` 
                 : `Registro Automático: ${new Date().toLocaleString()}`}
            </p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Coluna 1: Informações do Cliente e Local */}
            <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3 flex items-center gap-2">
                <User size={18} className="text-cbc-orange"/> Dados Principais
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-gray-900 shadow-sm"
                  placeholder="Nome do Cliente"
                  value={formData.client}
                  onChange={e => setFormData({ ...formData, client: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Telefone / WhatsApp</label>
                <div className="relative">
                   <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-gray-900 shadow-sm"
                    placeholder="(XX) 9XXXX-XXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
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
                "Novo Vendedor (Salvará na lista)"
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Local</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-gray-900 shadow-sm"
                    placeholder="Endereço ou Local de Instalação"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Valor (R$)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-gray-900 shadow-sm"
                      placeholder="0,00"
                      value={formData.value}
                      onChange={e => setFormData({ ...formData, value: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                     <AlertTriangle size={14} className="text-cbc-orange"/> Prioridade
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
            </div>

            {/* Coluna 2: Detalhes do Serviço */}
            <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3 flex items-center gap-2">
                <Briefcase size={18} className="text-cbc-orange"/> Detalhes do Serviço
              </h3>

              {renderDynamicField(
                "Serviço", 
                formData.service, 
                (val) => setFormData({...formData, service: val}), 
                availableServices, 
                isAddingService, 
                setIsAddingService, 
                newServiceName, 
                setNewServiceName, 
                "Novo Serviço (Salvará na lista)"
              )}

              {renderDynamicField(
                "Equipe Responsável", 
                formData.team, 
                (val) => setFormData({...formData, team: val}), 
                availableTeams, 
                isAddingTeam, 
                setIsAddingTeam, 
                newTeamName, 
                setNewTeamName, 
                "Nova Equipe (Salvará na lista)"
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Data Agendada</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-gray-900 shadow-sm"
                    value={formData.scheduledDate}
                    onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Hora</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-gray-900 shadow-sm"
                    value={formData.scheduledTime}
                    onChange={e => setFormData({ ...formData, scheduledTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-gray-900 shadow-sm"
                    value={formData.status}
                    onChange={e => handleStatusChange(e.target.value as SchedulingStatus)}
                  >
                    <option value={SchedulingStatus.PENDING}>Pendente</option>
                    <option value={SchedulingStatus.IN_PROGRESS}>Em Andamento</option>
                    <option value={SchedulingStatus.RESOLVED}>Resolvido</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-600 mb-1">Data Conclusão</label>
                   <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white text-gray-900 shadow-sm"
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
              <FileText size={16} /> Observações
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cbc-green outline-none resize-none bg-white text-gray-900 shadow-sm"
              placeholder="Detalhes adicionais sobre o agendamento..."
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
            className="px-6 py-2 bg-cbc-green text-white rounded-lg hover:bg-cbc-lightGreen flex items-center gap-2 font-medium shadow-md transition-colors"
          >
            <Save size={18} />
            Salvar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulingModal;
