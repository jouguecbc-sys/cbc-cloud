
import React, { useState } from 'react';
import { Sun, Lock, User, ArrowRight, Loader2, Zap } from 'lucide-react';

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

    setTimeout(async () => {
      const success = await onLogin(username, password);
      if (!success) {
        setError('Acesso negado. Verifique usuário e senha.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden bg-slate-50">
      
      {/* Background Ambient Light Effects (Solar Theme) */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-green-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-[400px] overflow-hidden animate-in fade-in zoom-in duration-500 z-10 relative border border-white/50 ring-1 ring-gray-100">
        
        {/* Header Section */}
        <div className="pt-12 pb-6 flex flex-col items-center justify-center text-center px-8 relative">
          
          {/* Logo Container */}
          <div className="relative mb-6 group">
             <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-500"></div>
             <div className="bg-white p-4 rounded-2xl shadow-xl relative border border-orange-100 transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                <Sun size={42} className="text-[#FF8C00]" strokeWidth={2.5} />
                <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1.5 border-4 border-white shadow-sm">
                  <Zap size={10} fill="currentColor" />
                </div>
             </div>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            CBC <span className="text-[#2E8B57]">SOLAR</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Acesso ao Sistema de Gestão</p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-10 pt-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Usuário</label>
              <div className="relative group transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2E8B57] transition-colors">
                  <User size={20} strokeWidth={2} />
                </div>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#2E8B57]/20 focus:bg-white focus:ring-4 focus:ring-[#2E8B57]/10 outline-none transition-all text-gray-800 placeholder:text-gray-400 font-semibold shadow-inner"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Senha</label>
              <div className="relative group transition-all duration-300 focus-within:scale-[1.02]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2E8B57] transition-colors">
                  <Lock size={20} strokeWidth={2} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#2E8B57]/20 focus:bg-white focus:ring-4 focus:ring-[#2E8B57]/10 outline-none transition-all text-gray-800 placeholder:text-gray-400 font-semibold shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-300 bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 animate-pulse"></div>
                <p className="text-xs font-bold text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#2E8B57] to-[#3CB371] hover:to-[#2E8B57] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-900/10 hover:shadow-xl hover:shadow-green-900/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-6 group overflow-hidden relative"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin text-white" />
              ) : (
                <>
                  <span className="relative z-10 tracking-wide">ENTRAR</span>
                  <div className="bg-white/20 p-1.5 rounded-full relative z-10 group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={16} strokeWidth={3} />
                  </div>
                </>
              )}
              {/* Shine Effect */}
              <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] group-hover:animate-[shine_1s_ease-in-out_infinite]"></div>
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-semibold hover:text-gray-600 transition-colors cursor-default">
              &copy; {new Date().getFullYear()} Sistema CBC Solar
            </p>
          </div>
        </div>

      </div>
      
      {/* Shine Animation Keyframes */}
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
