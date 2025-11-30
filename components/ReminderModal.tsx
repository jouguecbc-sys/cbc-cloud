
import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';
import { X, Save, Clock, Calendar } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: any) => void;
  reminderToEdit?: Reminder | null;
}

const COLORS = [
  { hex: '#ff7eb9', name: 'Rosa' },
  { hex: '#7afcff', name: 'Azul' },
  { hex: '#feff9c', name: 'Amarelo' },
  { hex: '#fff740', name: 'Amarelo Vivo' },
  { hex: '#98ff98', name: 'Verde' },
  { hex: '#e3d7ff', name: 'Lilás' },
  { hex: '#ffcc99', name: 'Laranja' },
  { hex: '#ffffff', name: 'Branco' },
];

const ReminderModal: React.FC<ReminderModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  reminderToEdit 
}) => {
  const initialFormState = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    color: '#ff7eb9',
    is_completed: false,
    is_archived: false
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (reminderToEdit) {
      setFormData({
        ...reminderToEdit,
        time: reminderToEdit.time || ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [reminderToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: reminderToEdit?.id
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-4 flex justify-between items-center text-gray-800 border-b shrink-0" style={{ backgroundColor: formData.color }}>
          <h2 className="text-xl font-bold font-hand text-gray-900 tracking-wide">
            {reminderToEdit ? 'Editar Post-it' : 'Novo Lembrete'}
          </h2>
          <button onClick={onClose} className="hover:bg-black/10 p-2 rounded-full transition-colors text-gray-900">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="space-y-4">
            
            {/* Color Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cor do Post-it</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c.hex })}
                    className={`w-8 h-8 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-110 ${formData.color === c.hex ? 'ring-2 ring-gray-800 scale-110' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-white text-gray-900 font-hand text-xl placeholder-gray-400"
                placeholder="Ex: Ligar para Cliente"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      required
                      className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-white text-gray-900 text-sm"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alarme (Opcional)</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="time"
                      className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-white text-gray-900 text-sm"
                      value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Anotações</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none resize-none bg-white text-gray-900 font-hand text-xl leading-relaxed placeholder-gray-400"
                placeholder="Detalhes..."
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
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-black flex items-center gap-2 font-medium shadow-md transition-colors"
          >
            <Save size={18} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
