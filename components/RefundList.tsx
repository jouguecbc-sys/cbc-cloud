
import React, { useState } from 'react';
import { Refund } from '../types';
import { Search, Filter, Trash2, Edit2, Download, FileSpreadsheet, FileText, Printer, Calendar, Users, DollarSign, Image as ImageIcon } from 'lucide-react';

interface RefundListProps {
  refunds: Refund[];
  onEdit: (refund: Refund) => void;
  onDelete: (id: string) => void;
}

const RefundList: React.FC<RefundListProps> = ({ refunds, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // Extract Unique Teams for Filter
  const uniqueTeams = Array.from(new Set(refunds.map(r => r.team).filter(Boolean)));

  const filtered = refunds.filter(item => {
    const terms = searchTerm.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0);
    const matchesSearch = terms.length === 0 || terms.every(term => 
      item.description.toLowerCase().includes(term) ||
      item.team.toLowerCase().includes(term)
    );

    const matchesTeam = filterTeam === 'all' || item.team === filterTeam;

    let matchesDate = true;
    if (dateStart) matchesDate = matchesDate && item.date >= dateStart;
    if (dateEnd) matchesDate = matchesDate && item.date <= dateEnd;

    return matchesSearch && matchesTeam && matchesDate;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // --- Export Functions ---

  const handleGenerateReceipt = (item: Refund) => {
    // @ts-ignore
    if (!window.jspdf) { alert('Biblioteca PDF carregando...'); return; }
    // @ts-ignore
    const doc = new window.jspdf.jsPDF();

    doc.setLineWidth(1);
    doc.rect(20, 20, 170, 100);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("RECIBO DE REEMBOLSO", 105, 35, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("CBC SOLAR PROJETOS", 105, 42, { align: "center" });

    doc.setFillColor(230, 255, 230);
    doc.rect(130, 50, 50, 15, 'F');
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`R$ ${item.value.toFixed(2)}`, 155, 60, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    let y = 70;
    const addLine = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 30, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, 60, y);
        y += 10;
    };

    addLine("Equipe:", item.team);
    addLine("Data:", formatDate(item.date));
    
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Referente a:", 30, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(item.description, 150);
    doc.text(splitDesc, 30, y);

    y += 30;
    doc.line(30, y, 100, y);
    doc.setFontSize(10);
    doc.text("Assinatura do Responsável", 30, y + 5);

    doc.line(120, y, 180, y);
    doc.text("Aprovado por", 120, y + 5);

    doc.save(`recibo_${item.team.replace(/\s+/g, '_')}_${item.date}.pdf`);
  };

  const handleExportXLS = () => {
    const XLSX = (window as any).XLSX;
    if (!XLSX) return;
    
    const ws = XLSX.utils.json_to_sheet(filtered.map(item => ({
      Data: formatDate(item.date),
      Equipe: item.team,
      Descrição: item.description,
      Valor: item.value
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reembolsos");
    XLSX.writeFile(wb, `reembolsos_cbc_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportPNG = async () => {
    // @ts-ignore
    const html2canvas = window.html2canvas;
    if (!html2canvas) return;
    const element = document.getElementById('refund-list-container');
    if (element) {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#f0fdf4' });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `lista_reembolsos.png`;
        link.click();
    }
  };

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col bg-green-50 font-sans">
      
      {/* Header and Advanced Filters */}
      <div className="flex flex-col gap-6 mb-8 shrink-0">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center">
           <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-emerald-900 uppercase tracking-tight flex items-center gap-2">
                 <DollarSign size={36} className="text-emerald-600"/> Reembolsos
              </h2>
              <div className="mt-2 text-lg text-emerald-700 font-medium">
                 Total Listado: <span className="font-bold">R$ {filtered.reduce((acc, curr) => acc + curr.value, 0).toFixed(2)}</span>
              </div>
           </div>

           <div className="flex bg-white p-1 rounded-lg border border-emerald-100 shadow-sm mt-4 xl:mt-0">
              <button onClick={handleExportXLS} className="p-2 hover:bg-emerald-50 text-emerald-700 rounded-md transition-colors" title="Exportar Lista (Excel)">
                <FileSpreadsheet size={20} />
              </button>
              <button onClick={handleExportPNG} className="p-2 hover:bg-purple-50 text-purple-700 rounded-md transition-colors" title="Foto da Lista">
                <ImageIcon size={20} />
              </button>
           </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex flex-col md:flex-row gap-4 items-end">
           <div className="flex-1 w-full">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Buscar</label>
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input
                    type="text"
                    placeholder="Descrição ou Equipe..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="w-full md:w-48">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Equipe</label>
              <select
                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
                 value={filterTeam}
                 onChange={(e) => setFilterTeam(e.target.value)}
              >
                 <option value="all">Todas</option>
                 {uniqueTeams.map((team, idx) => (
                    <option key={idx} value={team}>{team}</option>
                 ))}
              </select>
           </div>

           <div className="flex gap-2 w-full md:w-auto">
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">De</label>
                 <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" value={dateStart} onChange={e => setDateStart(e.target.value)} />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Até</label>
                 <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
              </div>
           </div>
        </div>
      </div>

      <div id="refund-list-container" className="flex-1 overflow-y-auto pr-2 pb-20 p-2">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
            <DollarSign size={64} className="mb-4" />
            <p className="text-xl font-bold">Nenhum reembolso encontrado.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50 border-b border-emerald-100 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <th className="p-4 w-32">Data</th>
                  <th className="p-4 w-48">Equipe</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4 text-right">Valor</th>
                  <th className="p-4 text-center w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 text-gray-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-emerald-400"/>
                        {formatDate(item.date)}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-emerald-400"/>
                        {item.team}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 italic">
                      {item.description}
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-700">
                      R$ {item.value.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleGenerateReceipt(item)}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="Recibo PDF"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundList;
