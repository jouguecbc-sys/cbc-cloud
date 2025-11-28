import React, { useState } from 'react';
import { Scheduling, SchedulingStatus } from '../types';
import { Search, Filter, Trash2, Edit2, Calendar, MapPin, CheckCircle, Clock, User, FileText, Download, FileSpreadsheet, Image as ImageIcon, Briefcase, PlayCircle, AlertCircle, Share2, Printer, Camera, Copy, Phone } from 'lucide-react';

interface SchedulingListProps {
  schedulings: Scheduling[];
  onEdit: (scheduling: Scheduling) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, currentStatus: SchedulingStatus) => void;
}

const SchedulingList: React.FC<SchedulingListProps> = ({ schedulings, onEdit, onDelete, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SchedulingStatus>('all');

  // Styles adapted from Dashboard for consistent "Monitoring" look
  const getStatusStyles = (status: SchedulingStatus) => {
    switch(status) {
      case SchedulingStatus.PENDING: 
        return {
          card: 'bg-red-100 border-red-300 shadow-sm hover:shadow-red-200',
          text: 'text-red-900',
          badge: 'bg-red-600 text-white border-red-700 hover:bg-red-700',
          subtext: 'text-red-800',
          divider: 'border-red-200',
          icon: 'text-red-700',
          overlay: 'bg-white/40'
        };
      case SchedulingStatus.IN_PROGRESS: 
        return {
          card: 'bg-orange-100 border-orange-300 shadow-sm hover:shadow-orange-200',
          text: 'text-orange-900',
          badge: 'bg-orange-600 text-white border-orange-700 hover:bg-orange-700',
          subtext: 'text-orange-800',
          divider: 'border-orange-200',
          icon: 'text-orange-700',
          overlay: 'bg-white/40'
        };
      case SchedulingStatus.RESOLVED: 
        return {
          card: 'bg-green-100 border-green-300 shadow-sm hover:shadow-green-200',
          text: 'text-green-900',
          badge: 'bg-green-600 text-white border-green-700 hover:bg-green-700',
          subtext: 'text-green-800',
          divider: 'border-green-200',
          icon: 'text-green-700',
          overlay: 'bg-white/40'
        };
    }
  };

  const filtered = schedulings.filter(item => {
    // Advanced Search Logic: Split by spaces to allow "Client Service" search pattern
    const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
    
    // Check if item matches ALL search terms (AND logic for terms)
    // Each term can be in ANY field (OR logic for fields)
    const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => {
      return (
        item.client.toLowerCase().includes(term) ||
        item.service.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.orderNumber.toLowerCase().includes(term) ||
        (item.phone && item.phone.toLowerCase().includes(term)) ||
        (item.team && item.team.toLowerCase().includes(term)) ||
        (item.salesperson && item.salesperson.toLowerCase().includes(term)) ||
        (item.observation && item.observation.toLowerCase().includes(term))
      );
    });
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Helpers ---
  const formatDateFull = (dateString?: string) => {
    if (!dateString) return 'Data a definir';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // --- Global Export Functions ---
  const handleExportPDF = () => {
    // @ts-ignore
    if (!window.jspdf) { alert('Biblioteca PDF carregando...'); return; }
    // @ts-ignore
    const doc = new window.jspdf.jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório de Agendamentos - CBC Solar', 14, 22);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28);

    const tableColumn = ["Ordem", "Cliente", "Contato", "Serviço", "Data", "Status"];
    const tableRows = filtered.map(item => [
      item.orderNumber,
      item.client,
      item.phone || '-',
      item.service,
      formatDateFull(item.scheduledDate),
      item.status === SchedulingStatus.RESOLVED ? 'Resolvido' : item.status === SchedulingStatus.IN_PROGRESS ? 'Andamento' : 'Pendente'
    ]);

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [46, 139, 87] } // CBC Green
    });

    doc.save(`agendamentos_cbc_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportXLS = () => {
    const XLSX = (window as any).XLSX;
    if (!XLSX) { alert('Biblioteca Excel carregando...'); return; }
    
    const ws = XLSX.utils.json_to_sheet(filtered.map(item => ({
      Ordem: item.orderNumber,
      Cliente: item.client,
      Telefone: item.phone,
      Serviço: item.service,
      Local: item.location,
      Data_Agendada: formatDateFull(item.scheduledDate),
      Hora: item.scheduledTime,
      Valor: item.value,
      Status: item.status,
      Equipe: item.team,
      Vendedor: item.salesperson,
      Observacao: item.observation
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agendamentos");
    XLSX.writeFile(wb, `agendamentos_cbc_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportTXT = () => {
    let content = "╔════════════════════════════════════════════════╗\n";
    content += "║      RELATÓRIO DE AGENDAMENTOS - CBC SOLAR     ║\n";
    content += `║      DATA: ${new Date().toLocaleString().padEnd(35)} ║\n`;
    content += "╚════════════════════════════════════════════════╝\n\n";

    filtered.forEach(item => {
      content += `🔶 ORDEM Nº ${item.orderNumber}  [ ${item.status.toUpperCase()} ]\n`;
      content += `👤 CLIENTE:  ${item.client.toUpperCase()}\n`;
      if(item.phone) content += `📞 CONTATO:  ${item.phone}\n`;
      content += `🛠️ SERVIÇO:  ${item.service}\n`;
      content += `📍 LOCAL:    ${item.location}\n`;
      content += `📅 DATA:     ${formatDateFull(item.scheduledDate)} - ${item.scheduledTime || ''}\n`;
      content += `💰 VALOR:    R$ ${item.value.toFixed(2)}\n`;
      content += `👷 EQUIPE:   ${item.team || 'Não definida'}\n`;
      if (item.observation) content += `📝 OBS:      ${item.observation}\n`;
      content += "──────────────────────────────────────────────────\n\n";
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `agendamentos_cbc_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPNG = async () => {
    // @ts-ignore
    const html2canvas = window.html2canvas;
    if (!html2canvas) { alert('Biblioteca de Imagem carregando...'); return; }

    const element = document.getElementById('scheduling-list-container');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = `lista_agendamentos_${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao gerar imagem", error);
      alert("Erro ao gerar imagem.");
    }
  };

  // --- Individual Card Actions ---

  const handleShare = (item: Scheduling) => {
    const text = `👷 *ORDEM DE SERVIÇO CBC SOLAR #${item.orderNumber}*\n\n` +
      `👤 *Cliente:* ${item.client}\n` +
      (item.phone ? `📞 *Tel:* ${item.phone}\n` : '') +
      `📍 *Local:* ${item.location}\n` +
      `🛠 *Serviço:* ${item.service}\n` +
      `📅 *Data:* ${formatDateFull(item.scheduledDate)} - 🕐 ${item.scheduledTime || 'Sem hora'}\n` +
      `📋 *Obs:* ${item.observation || 'Nenhuma'}\n\n` +
      `📞 *Equipe:* ${item.team || 'Não definida'}`;

    navigator.clipboard.writeText(text).then(() => {
      alert('📋 Informações copiadas! Pronto para enviar no WhatsApp.');
    });
  };

  const handleCardPDF = (item: Scheduling) => {
    // @ts-ignore
    if (!window.jspdf) return;
    // @ts-ignore
    const doc = new window.jspdf.jsPDF();
    
    doc.setFontSize(22);
    doc.text(`Ordem de Serviço #${item.orderNumber}`, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`CBC SOLAR PROJETOS`, 105, 30, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    let y = 50;
    const addLine = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 60, y);
      y += 10;
    };

    addLine("Cliente:", item.client);
    if(item.phone) addLine("Telefone:", item.phone);
    addLine("Endereço:", item.location);
    addLine("Serviço:", item.service);
    addLine("Data:", formatDateFull(item.scheduledDate));
    addLine("Hora:", item.scheduledTime || '-');
    addLine("Equipe:", item.team || '-');
    addLine("Status:", item.status.toUpperCase());
    
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Observações:", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const splitObs = doc.splitTextToSize(item.observation || "Sem observações.", 170);
    doc.text(splitObs, 20, y);

    doc.save(`os_${item.orderNumber}_${item.client}.pdf`);
  };

  const handleCardTXT = (item: Scheduling) => {
    const content = `╔══════════════════════════════════════╗\n` +
      `║      ORDEM DE SERVIÇO #${item.orderNumber}        ║\n` +
      `╚══════════════════════════════════════╝\n` +
      `👤 CLIENTE: ${item.client}\n` +
      (item.phone ? `📞 CONTATO: ${item.phone}\n` : '') +
      `📍 LOCAL:   ${item.location}\n` +
      `🛠️ SERVIÇO: ${item.service}\n` +
      `📅 DATA:    ${formatDateFull(item.scheduledDate)} ${item.scheduledTime || ''}\n` +
      `👷 EQUIPE:  ${item.team}\n` +
      `📝 OBS:     ${item.observation || '-'}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `os_${item.orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCardPNG = async (id: string, orderNum: string) => {
    // @ts-ignore
    const html2canvas = window.html2canvas;
    if (!html2canvas) return;
    const element = document.getElementById(id);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: null }); // null keeps transparency or original bg
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = `os_${orderNum}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar imagem do card.");
    }
  };

  return (
    <div className="p-8 h-full flex flex-col bg-green-50">
      {/* Header and Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 shrink-0 gap-6">
        <div>
           <h2 className="text-4xl font-extrabold text-gray-800 uppercase tracking-tight">Agendamentos</h2>
           <p className="text-gray-500 mt-2 text-lg">{schedulings.length} ordens de serviço registradas</p>
        </div>
      
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
           {/* Global Export Buttons */}
           <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={handleExportPDF} className="p-2 hover:bg-white hover:text-red-600 rounded-md transition-colors text-gray-600" title="Lista Completa em PDF">
                <FileText size={20} />
              </button>
              <button onClick={handleExportXLS} className="p-2 hover:bg-white hover:text-green-600 rounded-md transition-colors text-gray-600" title="Lista Completa em Excel">
                <FileSpreadsheet size={20} />
              </button>
              <button onClick={handleExportTXT} className="p-2 hover:bg-white hover:text-blue-600 rounded-md transition-colors text-gray-600" title="Lista Completa em TXT (Com Ícones)">
                <FileText size={20} className="rotate-90"/>
              </button>
              <button onClick={handleExportPNG} className="p-2 hover:bg-white hover:text-purple-600 rounded-md transition-colors text-gray-600" title="Foto da Lista (PNG)">
                <ImageIcon size={20} />
              </button>
           </div>

           <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block"></div>

          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar (Cliente + Serviço...)"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cbc-green focus:border-transparent outline-none sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-1 sm:flex-none">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <select
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cbc-green outline-none appearance-none bg-white cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos Status</option>
              <option value={SchedulingStatus.PENDING}>Pendentes</option>
              <option value={SchedulingStatus.IN_PROGRESS}>Em Andamento</option>
              <option value={SchedulingStatus.RESOLVED}>Resolvidos</option>
            </select>
          </div>
        </div>
      </div>

      <div id="scheduling-list-container" className="flex-1 overflow-y-auto pr-2 pb-20 p-2">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Calendar size={48} />
            </div>
            <p className="text-xl font-bold">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map(item => {
              const styles = getStatusStyles(item.status);
              const cardId = `card-${item.id}`;
              
              return (
                <div 
                  key={item.id}
                  id={cardId}
                  className={`relative rounded-3xl p-0 shadow-lg border-4 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row overflow-hidden ${styles.card}`}
                >
                  
                  {/* Left Block: ORDER NUMBER */}
                  <div className={`w-full md:w-40 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r ${styles.divider} ${styles.overlay} shrink-0`}>
                     <div className="text-center">
                       <span className={`block text-xs font-black uppercase tracking-widest mb-2 opacity-70 ${styles.text}`}>Ordem</span>
                       <span className={`block text-6xl font-black leading-none ${styles.text}`}>#{item.orderNumber}</span>
                     </div>
                  </div>

                  {/* Center Block: DETAILS */}
                  <div className={`flex-1 p-6 flex flex-col justify-center`}>
                     <div className="flex flex-wrap justify-between items-start mb-2">
                        <h3 className={`font-black text-3xl leading-tight mb-2 flex items-center gap-3 ${styles.text}`}>
                           {item.client}
                           {item.status === SchedulingStatus.RESOLVED ? <CheckCircle className={styles.icon} size={28} /> : 
                            item.status === SchedulingStatus.IN_PROGRESS ? <PlayCircle className={styles.icon} size={28} /> : 
                            <AlertCircle className={styles.icon} size={28} />}
                        </h3>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-8 mt-2">
                        {item.phone && (
                          <div className={`flex items-center gap-3 text-lg font-bold opacity-90 ${styles.subtext}`}>
                             <Phone size={20} />
                             <span>{item.phone}</span>
                          </div>
                        )}

                        <div className={`flex items-center gap-3 text-xl font-bold ${styles.subtext}`}>
                           <Briefcase size={22} />
                           <span>{item.service}</span>
                        </div>

                        {/* Date Restored as Text */}
                        <div className={`flex items-center gap-3 text-xl font-bold ${styles.subtext}`}>
                           <Calendar size={22} />
                           <span>
                              {formatDateFull(item.scheduledDate)}
                           </span>
                        </div>
                        
                        {item.scheduledTime && (
                           <div className={`flex items-center gap-3 text-lg font-bold opacity-80 ${styles.subtext}`}>
                              <Clock size={20} />
                              <span>{item.scheduledTime}</span>
                           </div>
                        )}

                        <div className={`flex items-center gap-3 text-lg font-bold opacity-80 ${styles.subtext}`}>
                           <MapPin size={20} />
                           <span className="truncate">{item.location}</span>
                        </div>
                        
                        <div className={`flex items-center gap-3 text-lg font-bold opacity-80 ${styles.subtext}`}>
                           <User size={20} />
                           <span>{item.team || item.salesperson || 'Sem equipe'}</span>
                        </div>
                     </div>
                     
                     {item.observation && (
                        <div className={`mt-4 text-sm font-bold p-3 rounded-xl border italic ${styles.overlay} ${styles.divider} ${styles.subtext}`}>
                           Obs: {item.observation}
                        </div>
                     )}
                  </div>

                  {/* Right Block: ACTIONS & VALUE */}
                  <div className={`w-full md:w-72 p-6 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l ${styles.divider} ${styles.overlay} shrink-0`}>
                     
                     {/* Mini Toolbar for Individual Actions */}
                     <div className="flex gap-2 mb-4 bg-white/50 p-1 rounded-lg backdrop-blur-sm shadow-sm">
                        <button onClick={() => handleShare(item)} className="p-2 text-gray-700 hover:text-green-600 hover:bg-white rounded transition-colors" title="Copiar para Funcionário (WhatsApp)">
                           <Share2 size={18} />
                        </button>
                        <button onClick={() => handleCardPDF(item)} className="p-2 text-gray-700 hover:text-red-600 hover:bg-white rounded transition-colors" title="Gerar PDF Individual">
                           <Printer size={18} />
                        </button>
                         <button onClick={() => handleCardTXT(item)} className="p-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded transition-colors" title="Gerar TXT Individual">
                           <FileText size={18} />
                        </button>
                        <button onClick={() => handleCardPNG(cardId, item.orderNumber)} className="p-2 text-gray-700 hover:text-purple-600 hover:bg-white rounded transition-colors" title="Salvar Card como Imagem">
                           <Camera size={18} />
                        </button>
                     </div>

                     <div className="w-full text-right mb-4">
                        <div className={`text-4xl font-black ${styles.text}`}>
                           <span className="text-xl font-bold mr-1 opacity-70">R$</span>
                           {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                     </div>

                     <button
                        onClick={() => onStatusChange(item.id, item.status)}
                        className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs mb-3 shadow-md hover:shadow-lg transition-all active:scale-95 border-2 ${styles.badge}`}
                     >
                        {item.status === SchedulingStatus.RESOLVED ? 'RESOLVIDO' : item.status === SchedulingStatus.IN_PROGRESS ? 'ANDAMENTO' : 'PENDENTE'}
                     </button>

                     <div className="flex gap-3 w-full justify-end">
                        <button 
                           onClick={() => onEdit(item)}
                           className="flex-1 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center justify-center shadow-sm font-bold"
                           title="Editar"
                        >
                           <Edit2 size={18} />
                        </button>
                        <button 
                           onClick={() => onDelete(item.id)}
                           className="flex-1 py-2 bg-white hover:bg-red-50 text-red-500 rounded-lg transition-colors flex items-center justify-center shadow-sm font-bold"
                           title="Excluir"
                        >
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulingList;