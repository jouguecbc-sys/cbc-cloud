
import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { X, Save, User, MapPin, Phone, FileText, Briefcase } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: any) => void;
  clientToEdit?: Client | null;
  availableSalespeople: string[];
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSave, clientToEdit, availableSalespeople }) => {
  const initialFormState = {
    name: '',
    phone: '',
    location: '',
    salesperson: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (clientToEdit) {
      setFormData(clientToEdit);
    } else {
      setFormData(initialFormState);
    }
  }, [clientToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: clientToEdit?.id });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User size={24} /> {clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 bg-gray-50 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: João da Silva" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Phone size={14}/> Telefone</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" 
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(99) 99999-9999" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Briefcase size={14}/> Vendedor</label>
                    <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 bg-white"
                        value={formData.salesperson} onChange={e => setFormData({...formData, salesperson: e.target.value})}>
                        <option value="">Selecione...</option>
                        {availableSalespeople.map((sp, idx) => <option key={idx} value={sp}>{sp}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPin size={14}/> Endereço</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" 
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Rua, Número, Bairro, Cidade" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FileText size={14}/> Notas</label>
                <textarea rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 resize-none" 
                    value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Observações sobre o cliente..." />
            </div>
        </form>

        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-100 text-gray-700">Cancelar</button>
            <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-bold shadow">
                <Save size={18} /> Salvar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
