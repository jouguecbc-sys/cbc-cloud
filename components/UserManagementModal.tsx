
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, Key, Shield, User as UserIcon, Save } from 'lucide-react';
import { AppUser, UserRole } from '../types';
import { getUsers, createUser, deleteUser, updateUserPassword } from '../services/storageService';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose, currentUserRole }) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // New User Form
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('user');

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    if (isOpen) loadUsers();
  }, [isOpen]);

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await getUsers();
    setUsers(data);
    setIsLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    const res = await createUser({
      username: newUsername,
      password: newPassword,
      role: newRole
    });

    if (res.success) {
      alert('Usuário criado com sucesso!');
      setIsCreating(false);
      setNewUsername('');
      setNewPassword('');
      loadUsers();
    } else {
      alert('Erro ao criar: ' + res.msg);
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) return;
    await deleteUser(id);
    loadUsers();
  };

  const handleUpdatePassword = async (id: string) => {
    if (!editPassword) return;
    await updateUserPassword(id, editPassword);
    alert('Senha atualizada com sucesso!');
    setEditingId(null);
    setEditPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Shield size={24} className="text-cbc-orange" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Gerenciamento de Usuários</h2>
              <p className="text-xs text-gray-300">Acesso Restrito ao Administrador</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {/* Create User Section */}
          {!isCreating ? (
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-cbc-green hover:text-cbc-green hover:bg-green-50 transition-all flex items-center justify-center gap-2 font-bold mb-6"
            >
              <UserPlus size={20} /> Cadastrar Novo Usuário
            </button>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 animate-in slide-in-from-top-4">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <UserPlus size={18} /> Novo Usuário
              </h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Login</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cbc-green outline-none"
                      placeholder="usuario"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cbc-green outline-none"
                      placeholder="senha123"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Permissão</label>
                    <select 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white"
                      value={newRole}
                      onChange={e => setNewRole(e.target.value as UserRole)}
                    >
                      <option value="user">Usuário Comum</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                   <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                   <button type="submit" className="px-6 py-2 bg-cbc-green text-white rounded-lg hover:bg-cbc-lightGreen font-bold">Salvar</button>
                </div>
              </form>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-3">
            {isLoading ? (
               <p className="text-center text-gray-400 py-8">Carregando usuários...</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                   <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg
                        ${user.role === 'admin' ? 'bg-purple-600' : 'bg-gray-400'}`}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 flex items-center gap-2">
                           {user.username}
                           <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide border
                             ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                             {user.role}
                           </span>
                        </p>
                        <p className="text-xs text-gray-400">Criado em: {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</p>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex items-center gap-2">
                      {editingId === user.id ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                           <input 
                              type="text" 
                              placeholder="Nova senha"
                              className="w-32 px-3 py-1.5 border rounded-lg text-sm outline-none focus:border-cbc-green"
                              value={editPassword}
                              onChange={e => setEditPassword(e.target.value)}
                           />
                           <button onClick={() => handleUpdatePassword(user.id)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Salvar Senha">
                              <Save size={16} />
                           </button>
                           <button onClick={() => { setEditingId(null); setEditPassword(''); }} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Cancelar">
                              <X size={16} />
                           </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setEditingId(user.id)}
                          className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-gray-200"
                        >
                           <Key size={16} /> Alterar Senha
                        </button>
                      )}

                      {/* Delete Button (Can't delete self) */}
                      {user.username !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir Usuário"
                        >
                           <Trash2 size={18} />
                        </button>
                      )}
                   </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;
