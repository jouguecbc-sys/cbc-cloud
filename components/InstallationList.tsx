
import React, { useState } from 'react';
import { Installation, SchedulingStatus, SchedulingPriority } from '../types';
import { Search, Filter, Trash2, Edit2, Calendar, MapPin, CheckCircle, Clock, User, FileText, FileSpreadsheet, Image as ImageIcon, Briefcase, PlayCircle, AlertCircle, Timer, Wrench, Zap, Share2, Printer, Camera } from 'lucide-react';

interface InstallationListProps {
  installations: Installation[];
  onEdit: (install: Installation) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, currentStatus: SchedulingStatus) => void;
}

const InstallationList: React.FC<InstallationListProps> = ({ installations, onEdit, onDelete, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SchedulingStatus>('all');

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
          card: 'bg-yellow-100 border-yellow-300 shadow-sm hover:shadow-yellow-200',
          text: 'text-yellow-900',
          badge: 'bg-yellow-600 text-white border-yellow-700 hover:bg-yellow-700',
          subtext: 'text-yellow-800',
          divider: 'border-yellow-200',
          icon: 'text-yellow-700',
          overlay: 'bg-white/40'
        };
    }
  };

  const filtered = installations.filter(item => {
    const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
    const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => {
      return (
        item.client.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.orderNumber.toLowerCase().includes(term) ||
        (item.team && item.team.toLowerCase().includes(term)) ||
        (item.salesperson && item.salesperson.toLowerCase().includes(term))
      );
    });
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDateFull = (dateString?: string) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const calculateDaysSinceContract = (contractDate: string) => {
    if (!contractDate) return 0;
    const start = new Date(contractDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

<<<<<<< HEAD
  // Actions
=======
  // --- Export Functions ---
  const handleExportPDF = () => {
    // @ts-ignore
    if (!window.jspdf) { alert('Biblioteca PDF carregando...'); return; }
    // @ts-ignore
    const doc = new window.jspdf.jsPDF('l'); // Landscape for more columns
    
    doc.setFontSize(18);
    doc.text('Relatório de Instalações - CBC Solar', 14, 22);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28);

    const tableColumn = ["Ordem", "Cliente", "Local", "Contrato", "Prazo Limite", "Placas", "kWp", "Status"];
    const tableRows = filtered.map(item => [
      item.orderNumber,
      item.client,
      item.location,
      formatDateFull(item.contractDate),
      formatDateFull(item.deadlineDate),
      item.panelQuantity,
      item.kwp,
      item.status.toUpperCase()
    ]);

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [234, 179, 8] } // Yellow-ish
    });

    doc.save(`instalacoes_cbc_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportXLS = () => {
    const XLSX = (window as any).XLSX;
    if (!XLSX) { alert('Biblioteca Excel carregando...'); return; }
    
    const ws = XLSX.utils.json_to_sheet(filtered.map(item => ({
      Ordem: item.orderNumber,
      Cliente: item.client,
      Local: item.location,
      Contrato: formatDateFull(item.contractDate),
      Prazo_Limite: formatDateFull(item.deadlineDate),
      Agendada_Para: formatDateFull(item.scheduledDate),
      Qtd_Placas: item.panelQuantity,
      Potencia_KWp: item.kwp,
      Status: item.status,
      Equipe: item.team,
      Vendedor: item.salesperson,
      Observacao: item.observation
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Instalacoes");
    XLSX.writeFile(wb, `instalacoes_cbc_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportTXT = () => {
    let content = "╔════════════════════════════════════════════════╗\n";
    content += "║      RELATÓRIO DE INSTALAÇÕES - CBC SOLAR      ║\n";
    content += `║      DATA: ${new Date().toLocaleString().padEnd(35)} ║\n`;
    content += "╚════════════════════════════════════════════════╝\n\n";

    filtered.forEach(item => {
      content += `🏗️ ORDEM Nº ${item.orderNumber} [${item.status.toUpperCase()}]\n`;
      content += `👤 CLIENTE:  ${item.client.toUpperCase()}\n`;
      content += `📍 LOCAL:    ${item.location}\n`;
      content += `📅 CONTRATO: ${formatDateFull(item.contractDate)} (Decorridos: ${calculateDaysSinceContract(item.contractDate)} dias)\n`;
      content += `⏳ PRAZO:    ${formatDateFull(item.deadlineDate)}\n`;
      content += `⚡ SISTEMA:  ${item.panelQuantity} Placas | ${item.kwp} kWp\n`;
      content += `👷 EQUIPE:   ${item.team || 'Não definida'}\n`;
      if (item.observation) content += `📝 OBS:      ${item.observation}\n`;
      content += "──────────────────────────────────────────────────\n\n";
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `instalacoes_cbc.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPNG = async () => {
    // @ts-ignore
    const html2canvas = window.html2canvas;
    if (!html2canvas) { alert('Biblioteca de Imagem carregando...'); return; }

    const element = document.getElementById('installation-list-container');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = `lista_instalacoes_${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao gerar imagem", error);
      alert("Erro ao gerar imagem.");
    }
  };

  // --- Individual Card Actions ---

>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  const handleShare = (item: Installation) => {
    const text = `🏗️ *ORDEM DE INSTALAÇÃO CBC SOLAR #${item.orderNumber}*\n\n` +
      `👤 *Cliente:* ${item.client}\n` +
      `📍 *Local:* ${item.location}\n` +
      `⚡ *Sistema:* ${item.kwp} kWp (${item.panelQuantity} placas)\n` +
      `📅 *Contrato:* ${formatDateFull(item.contractDate)}\n` +
      `⏳ *Prazo:* ${formatDateFull(item.deadlineDate)}\n` +
      `👷 *Equipe:* ${item.team || 'Não definida'}\n` +
      `📋 *Obs:* ${item.observation || 'Nenhuma'}`;

    navigator.clipboard.writeText(text).then(() => {
      alert('📋 Informações copiadas! Pronto para enviar no WhatsApp.');
    });
  };

<<<<<<< HEAD
  const openMaps = (location?: string) => {
    if(!location) return alert("Sem endereço.");
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

=======
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  const handleCardPDF = (item: Installation) => {
    // @ts-ignore
    if (!window.jspdf) return;
    // @ts-ignore
    const doc = new window.jspdf.jsPDF();
<<<<<<< HEAD
    doc.setFontSize(22);
    doc.text(`Ordem de Instalação #${item.orderNumber}`, 105, 20, { align: 'center' });
    // ... rest of PDF logic (abbreviated for update) ...
    doc.save(`instalacao_${item.orderNumber}.pdf`);
  };

  const handleExportXLS = () => { /* ... existing ... */ };
  const handleExportPNG = () => { /* ... existing ... */ };
  const handleExportTXT = () => { /* ... existing ... */ };
  const handleExportPDF = () => { /* ... existing ... */ };
=======
    
    doc.setFontSize(22);
    doc.text(`Ordem de Instalação #${item.orderNumber}`, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`CBC SOLAR PROJETOS - Departamento de Obras`, 105, 30, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    let y = 50;
    const addLine = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 70, y);
      y += 10;
    };

    addLine("Cliente:", item.client);
    addLine("Local:", item.location);
    addLine("Potência:", `${item.kwp} kWp`);
    addLine("Qtd. Placas:", String(item.panelQuantity));
    addLine("Data Contrato:", formatDateFull(item.contractDate));
    addLine("Prazo Limite:", formatDateFull(item.deadlineDate));
    addLine("Equipe:", item.team || '-');
    addLine("Vendedor:", item.salesperson || '-');
    addLine("Status:", item.status.toUpperCase());
    
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Observações:", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const splitObs = doc.splitTextToSize(item.observation || "Sem observações.", 170);
    doc.text(splitObs, 20, y);

    doc.save(`instalacao_${item.orderNumber}_${item.client}.pdf`);
  };

  const handleCardTXT = (item: Installation) => {
    const content = `╔══════════════════════════════════════╗\n` +
      `║      INSTALAÇÃO #${item.orderNumber}              ║\n` +
      `╚══════════════════════════════════════╝\n` +
      `👤 CLIENTE: ${item.client}\n` +
      `📍 LOCAL:   ${item.location}\n` +
      `⚡ SISTEMA: ${item.kwp} kWp (${item.panelQuantity} Placas)\n` +
      `📅 CONTRATO: ${formatDateFull(item.contractDate)}\n` +
      `⏳ PRAZO:    ${formatDateFull(item.deadlineDate)}\n` +
      `👷 EQUIPE:   ${item.team}\n` +
      `📝 OBS:      ${item.observation || '-'}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `instalacao_${item.orderNumber}.txt`;
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
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = `instalacao_${orderNum}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar imagem do card.");
    }
  };
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col bg-green-50 font-sans">
      {/* Header and Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 shrink-0 gap-6">
        <div>
           <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 uppercase tracking-tight">Instalações</h2>
           <p className="text-gray-500 mt-2 text-lg">{filtered.length} obras registradas</p>
        </div>
      
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
           {/* Global Export Buttons */}
           <div className="flex bg-gray-100 p-1 rounded-lg">
<<<<<<< HEAD
              <button onClick={handleExportPDF} className="p-2 hover:bg-white hover:text-red-600 rounded-md transition-colors text-gray-600" title="Lista PDF"><FileText size={20} /></button>
              <button onClick={handleExportXLS} className="p-2 hover:bg-white hover:text-green-600 rounded-md transition-colors text-gray-600" title="Lista Excel"><FileSpreadsheet size={20} /></button>
              <button onClick={handleExportTXT} className="p-2 hover:bg-white hover:text-blue-600 rounded-md transition-colors text-gray-600" title="Lista TXT"><FileText size={20} className="rotate-90"/></button>
              <button onClick={handleExportPNG} className="p-2 hover:bg-white hover:text-purple-600 rounded-md transition-colors text-gray-600" title="Foto da Lista"><ImageIcon size={20} /></button>
=======
              <button onClick={handleExportPDF} className="p-2 hover:bg-white hover:text-red-600 rounded-md transition-colors text-gray-600" title="Lista PDF">
                <FileText size={20} />
              </button>
              <button onClick={handleExportXLS} className="p-2 hover:bg-white hover:text-green-600 rounded-md transition-colors text-gray-600" title="Lista Excel">
                <FileSpreadsheet size={20} />
              </button>
              <button onClick={handleExportTXT} className="p-2 hover:bg-white hover:text-blue-600 rounded-md transition-colors text-gray-600" title="Lista TXT">
                <FileText size={20} className="rotate-90"/>
              </button>
              <button onClick={handleExportPNG} className="p-2 hover:bg-white hover:text-purple-600 rounded-md transition-colors text-gray-600" title="Foto da Lista">
                <ImageIcon size={20} />
              </button>
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
           </div>
           
           <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block"></div>
          
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
<<<<<<< HEAD
            <input type="text" placeholder="Buscar obra..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none sm:w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="relative flex-1 sm:flex-none">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <select className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none appearance-none bg-white cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
=======
            <input
              type="text"
              placeholder="Buscar obra..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-1 sm:flex-none">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <select
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none appearance-none bg-white cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
              <option value="all">Todos Status</option>
              <option value={SchedulingStatus.PENDING}>Pendentes</option>
              <option value={SchedulingStatus.IN_PROGRESS}>Em Andamento</option>
              <option value={SchedulingStatus.RESOLVED}>Concluídos</option>
            </select>
          </div>
        </div>
      </div>

      <div id="installation-list-container" className="flex-1 overflow-y-auto pr-2 pb-20 p-2">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
<<<<<<< HEAD
            <div className="bg-gray-100 p-6 rounded-full mb-4"><Wrench size={48} /></div>
=======
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Wrench size={48} />
            </div>
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
            <p className="text-xl font-bold">Nenhuma instalação encontrada.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map(item => {
              const styles = getStatusStyles(item.status);
              const cardId = `card-inst-${item.id}`;
              const daysSince = calculateDaysSinceContract(item.contractDate);

              return (
<<<<<<< HEAD
                <div key={item.id} id={cardId} className={`relative rounded-3xl p-0 shadow-lg border-4 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row overflow-hidden ${styles.card}`}>
=======
                <div 
                  key={item.id}
                  id={cardId}
                  className={`relative rounded-3xl p-0 shadow-lg border-4 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row overflow-hidden ${styles.card}`}
                >
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
                  {/* Left Block: ORDER NUMBER */}
                  <div className={`w-full md:w-40 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r ${styles.divider} ${styles.overlay} shrink-0`}>
                     <div className="text-center">
                       <span className={`block text-xs font-black uppercase tracking-widest mb-2 opacity-70 ${styles.text}`}>Obra</span>
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
<<<<<<< HEAD
                        <div className={`flex items-center gap-3 text-lg font-bold opacity-90 ${styles.subtext} group/map cursor-pointer`} onClick={() => openMaps(item.location)} title="Abrir GPS">
                           <MapPin size={20} />
                           <span className="truncate group-hover/map:underline">{item.location}</span>
=======
                        <div className={`flex items-center gap-3 text-lg font-bold opacity-90 ${styles.subtext}`}>
                           <MapPin size={20} />
                           <span className="truncate">{item.location}</span>
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
                        </div>
                        
                        {/* Info Técnica */}
                        <div className={`flex items-center gap-3 text-xl font-bold ${styles.subtext}`}>
                           <Zap size={22} />
                           <span>{item.kwp} kWp ({item.panelQuantity} Placas)</span>
                        </div>

                        {/* Dates */}
                        <div className={`flex items-center gap-3 text-base font-bold opacity-80 ${styles.subtext}`}>
                           <FileText size={20} />
                           <span>Contrato: {formatDateFull(item.contractDate)}</span>
                        </div>
                        <div className={`flex items-center gap-3 text-base font-bold opacity-80 text-red-700`}>
                           <Clock size={20} />
                           <span>Limite: {formatDateFull(item.deadlineDate)}</span>
                        </div>
                     </div>
                     
                     <div className="mt-4 flex gap-2">
                        <div className="px-3 py-1 bg-white/50 rounded-lg text-xs font-bold uppercase text-gray-700 flex items-center gap-2">
                          <Timer size={14}/> {daysSince} Dias Decorridos
                        </div>
                        {item.team && (
                          <div className="px-3 py-1 bg-white/50 rounded-lg text-xs font-bold uppercase text-gray-700 flex items-center gap-2">
                            <User size={14}/> {item.team}
                          </div>
                        )}
                     </div>

                     {item.observation && (
                        <div className={`mt-4 text-sm font-bold p-3 rounded-xl border italic ${styles.overlay} ${styles.divider} ${styles.subtext}`}>
                           Obs: {item.observation}
                        </div>
                     )}
                  </div>

                  {/* Right Block: ACTIONS */}
                  <div className={`w-full md:w-64 p-6 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l ${styles.divider} ${styles.overlay} shrink-0`}>
                     
                     {/* Mini Toolbar for Individual Actions */}
                     <div className="flex gap-2 mb-4 bg-white/50 p-1 rounded-lg backdrop-blur-sm shadow-sm">
<<<<<<< HEAD
                        <button onClick={() => handleShare(item)} className="p-2 text-gray-700 hover:text-green-600 hover:bg-white rounded transition-colors" title="Copiar para WhatsApp"><Share2 size={18} /></button>
                        <button onClick={() => handleExportPDF()} className="p-2 text-gray-700 hover:text-red-600 hover:bg-white rounded transition-colors" title="Gerar PDF"><Printer size={18} /></button>
                        <button onClick={() => handleExportPNG()} className="p-2 text-gray-700 hover:text-purple-600 hover:bg-white rounded transition-colors" title="Salvar Imagem"><Camera size={18} /></button>
=======
                        <button onClick={() => handleShare(item)} className="p-2 text-gray-700 hover:text-green-600 hover:bg-white rounded transition-colors" title="Copiar para WhatsApp">
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
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
                     </div>
                     
                     <button
                        onClick={() => onStatusChange(item.id, item.status)}
                        className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs mb-3 shadow-md hover:shadow-lg transition-all active:scale-95 border-2 ${styles.badge}`}
                     >
                        {item.status === SchedulingStatus.RESOLVED ? 'CONCLUÍDO' : item.status === SchedulingStatus.IN_PROGRESS ? 'ANDAMENTO' : 'PENDENTE'}
                     </button>

                     <div className="flex gap-3 w-full justify-end">
<<<<<<< HEAD
                        <button onClick={() => onEdit(item)} className="flex-1 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center justify-center shadow-sm font-bold"><Edit2 size={18} /></button>
                        <button onClick={() => onDelete(item.id)} className="flex-1 py-2 bg-white hover:bg-red-50 text-red-500 rounded-lg transition-colors flex items-center justify-center shadow-sm font-bold"><Trash2 size={18} /></button>
=======
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
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
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

export default InstallationList;
