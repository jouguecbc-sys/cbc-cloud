import React, { useState } from 'react';
import { Sun, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: string, pass: string) => Promise<boolean>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simula um pequeno delay para sensação de processamento
    setTimeout(async () => {
      const success = await onLogin(username, password);
      if (!success) {
        setError('Usuário ou senha incorretos.');
        setIsLoading(false);
      }
      // Se sucesso, o componente pai desmontará esta tela
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        
        {/* Lado Visual / Logo */}
        <div className="bg-gradient-to-br from-cbc-green to-cbc-lightGreen p-8 flex flex-col items-center justify-center text-white md:w-2/5">
          <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm shadow-inner">
            <Sun size={48} className="text-cbc-orange drop-shadow-md" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-center">CBC SOLAR</h1>
          <p className="text-xs text-white/80 uppercase tracking-widest mt-1">Sistema</p>
        </div>

        {/* Formulário */}
        <div className="p-8 flex-1 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Bem-vindo</h2>
          <p className="text-sm text-gray-500 mb-6">Insira suas credenciais para acessar.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">Usuário</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cbc-green focus:border-transparent outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">Senha</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cbc-green focus:border-transparent outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                  placeholder="••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-cbc-orange hover:bg-cbc-lightOrange text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 group"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Entrar no Sistema <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-400">CBC Solar Projetos &copy; {new Date().getFullYear()}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;