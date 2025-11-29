
import React, { useState } from 'react';
import { X, Lock, Save, Loader2 } from 'lucide-react';
import { verifyCurrentPassword, updateUserPassword } from '../services/storageService';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, currentUserId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('A nova senha e a confirmação não coincidem.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 4) {
        setError('A nova senha deve ter pelo menos 4 caracteres.');
        setIsLoading(false);
        return;
    }

    try {
      // 1. Verify old password
      const isValid = await verifyCurrentPassword(currentUserId, currentPassword);
      if (!isValid) {
        setError('A senha atual está incorreta.');
        setIsLoading(false);
        return;
      }

      // 2. Update to new password
      await updateUserPassword(currentUserId, newPassword);
      
      alert('Senha alterada com sucesso!');
      onClose();
      // Reset fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      setError('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Lock size={20} className="text-cbc-orange" />
            </div>
            <h2 className="text-lg font-bold">Alterar Minha Senha</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-gray-50">
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha Atual</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
            />
          </div>

          <div className="h-px bg-gray-200 my-2"></div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nova Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Nova senha"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmar Nova Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cbc-green outline-none bg-white"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <span className="block w-2 h-2 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2 bg-cbc-green text-white rounded-lg hover:bg-cbc-lightGreen font-bold flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar Nova Senha
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
