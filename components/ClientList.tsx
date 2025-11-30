
import React, { useState } from 'react';
import { Client } from '../types';
import { Search, Edit2, Trash2, Phone, MapPin, MessageCircle, User } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="p-4 lg:p-8 h-full flex flex-col bg-indigo-50 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
        <div>
           <h2 className="text-3xl font-extrabold text-indigo-900 uppercase tracking-tight">Gestão de Clientes</h2>
           <p className="text-gray-500 mt-1">{clients.length} clientes cadastrados</p>
        </div>
        <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => (
            <div key={client.id} className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{client.name}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <User size={10}/> {client.salesperson || 'Sem vendedor'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(client)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                        <button onClick={() => onDelete(client.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                    </div>
                </div>

                <div className="space-y-2 mt-4">
                    {client.phone && (
                        <div onClick={() => openWhatsApp(client.phone)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 cursor-pointer transition-colors p-1.5 hover:bg-green-50 rounded-lg -ml-1.5">
                            <MessageCircle size={16} />
                            <span className="font-medium">{client.phone}</span>
                        </div>
                    )}
                    {client.location && (
                        <div onClick={() => openMaps(client.location)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors p-1.5 hover:bg-blue-50 rounded-lg -ml-1.5">
                            <MapPin size={16} />
                            <span className="truncate">{client.location}</span>
                        </div>
                    )}
                </div>
                
                {client.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 italic">
                        "{client.notes}"
                    </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientList;
