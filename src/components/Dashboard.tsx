/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { format } from "date-fns";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileText, 
  UserCheck, 
  CheckCircle, 
  ShieldCheck, 
  Plus, 
  Settings, 
  Printer,
  History,
  Trash2,
  Building2,
  ClipboardList
} from "lucide-react";
import { LetterData, LETTER_TYPES, LetterType, SchoolInfo, DEFAULT_SCHOOL } from "@/src/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LetterForm from "./LetterForm";
import LetterPreview from "./LetterPreview";
import SettingsForm from "./SettingsForm";
import { toast } from "sonner";

const ICON_MAP: any = {
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  UserCheck,
  CheckCircle,
  ShieldCheck,
  ClipboardList,
};

export default function Dashboard() {
  const [activeView, setActiveView] = React.useState<"menu" | "form" | "preview">("menu");
  const [activeTab, setActiveTab] = React.useState<string>("buat");
  const [selectedType, setSelectedType] = React.useState<LetterType | null>(null);
  const [currentLetter, setCurrentLetter] = React.useState<LetterData | null>(null);
  const [schoolInfo, setSchoolInfo] = React.useState<SchoolInfo>(DEFAULT_SCHOOL);
  const [history, setHistory] = React.useState<LetterData[]>([]);
  const [filterType, setFilterType] = React.useState<string>("all");
  const [filterMonth, setFilterMonth] = React.useState<string>("all");

  const [autoPrint, setAutoPrint] = React.useState(false);

  // Auto-print effect
  React.useEffect(() => {
    if (activeView === "preview" && autoPrint) {
      const timer = setTimeout(() => {
        window.print();
        setAutoPrint(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeView, autoPrint]);

  // Load history from localStorage
  React.useEffect(() => {
    const savedHistory = localStorage.getItem("letter_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    const savedSchool = localStorage.getItem("school_info");
    if (savedSchool) {
      setSchoolInfo(JSON.parse(savedSchool));
    }
  }, []);

  const saveToHistory = (letter: LetterData) => {
    const newHistory = [letter, ...history];
    setHistory(newHistory);
    localStorage.setItem("letter_history", JSON.stringify(newHistory));
  };

  const handleUpdateSchool = (newInfo: SchoolInfo) => {
    setSchoolInfo(newInfo);
    localStorage.setItem("school_info", JSON.stringify(newInfo));
    toast.success("Informasi sekolah berhasil diperbarui!");
  };

  const handleCreateNew = (type: LetterType) => {
    setSelectedType(type);
    setActiveView("form");
  };

  const handleFormSubmit = (data: any) => {
    const letterData: LetterData = {
      id: crypto.randomUUID(),
      type: selectedType!,
      ...data
    };
    setCurrentLetter(letterData);
    setActiveView("preview");
    saveToHistory(letterData);
    toast.success("Surat berhasil dibuat!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem("letter_history", JSON.stringify(newHistory));
    toast.info("Surat dihapus dari riwayat");
  };

  const handleViewFromHistory = (letter: LetterData) => {
    setCurrentLetter(letter);
    setActiveView("preview");
    setAutoPrint(true);
  };

  const getAvailableMonths = () => {
    const months = new Set<string>();
    history.forEach(item => {
      // For CKH, we use the 'month' field. For others, we extract month from 'date'
      if (item.type === "ckh" && item.content.month) {
        months.add(item.content.month);
      } else if (item.date) {
        try {
          const date = new Date(item.date);
          const monthLabel = format(date, "MMMM yyyy");
          months.add(monthLabel);
        } catch (e) {
          // ignore
        }
      }
    });
    return Array.from(months).sort();
  };

  const filteredHistory = React.useMemo(() => {
    return history.filter(item => {
      const typeMatch = filterType === "all" || item.type === filterType;
      
      let monthMatch = filterMonth === "all";
      if (!monthMatch) {
        if (item.type === "ckh" && item.content.month === filterMonth) {
          monthMatch = true;
        } else if (item.date) {
          try {
            const dateStr = format(new Date(item.date), "MMMM yyyy");
            if (dateStr === filterMonth) monthMatch = true;
          } catch (e) {}
        }
      }
      
      return typeMatch && monthMatch;
    });
  }, [history, filterType, filterMonth]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20 print:p-0 print:bg-white relative overflow-x-hidden">
      {/* Background Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-transparent mb-8 print:hidden pt-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">E-Surat {schoolInfo.name.split(' ')[0]} Pro</h1>
            <p className="text-slate-400 text-sm">{schoolInfo.name} • Admin Panel</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold uppercase text-white leading-none overflow-hidden">
                <img src={schoolInfo.logo} className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-[11px] truncate max-w-[120px]">{schoolInfo.principalName}</p>
                <p className="opacity-60 text-[10px]">Kepala Sekolah</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setActiveTab("pengaturan")}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 print:p-0 grid grid-cols-12 gap-10">
        {/* Sidebar-like Navigation */}
        <aside className="col-span-3 flex flex-col gap-6 print:hidden">
          <div className="glass-card p-5 space-y-6">
            <div>
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Layanan Utama</h2>
              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveTab("buat"); setActiveView("menu"); setSelectedType(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm group ${activeTab === "buat" && (selectedType !== "ckh" || activeView === "menu") ? "bg-indigo-600/20 text-white border border-indigo-500/30" : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
                >
                  <Plus className={`w-5 h-5 ${activeTab === "buat" && (selectedType !== "ckh" || activeView === "menu") ? "text-indigo-400" : "text-slate-500"}`} />
                  <span className="font-semibold">Buat Surat Baru</span>
                </button>
                <button 
                  onClick={() => { setActiveTab("buat"); handleCreateNew("ckh" as LetterType); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm group ${activeTab === "buat" && selectedType === "ckh" && activeView === "form" ? "bg-amber-600/20 text-white border border-amber-500/30" : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
                >
                  <ClipboardList className={`w-5 h-5 ${activeTab === "buat" && selectedType === "ckh" && activeView === "form" ? "text-amber-400" : "text-slate-500"}`} />
                  <span className="font-semibold">Input CKH Harian</span>
                </button>
              </nav>
            </div>

            <div>
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Manajemen</h2>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab("riwayat")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm group ${activeTab === "riwayat" ? "bg-indigo-600/20 text-white border border-indigo-500/30" : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
                >
                  <History className={`w-5 h-5 ${activeTab === "riwayat" ? "text-indigo-400" : "text-slate-500"}`} />
                  <span className="font-semibold">Arsip & Riwayat</span>
                </button>
                <button 
                  onClick={() => setActiveTab("pengaturan")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm group ${activeTab === "pengaturan" ? "bg-indigo-600/20 text-white border border-indigo-500/30" : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
                >
                  <Building2 className={`w-5 h-5 ${activeTab === "pengaturan" ? "text-indigo-400" : "text-slate-500"}`} />
                  <span className="font-semibold">Profil Sekolah</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-4">Total Dokumen</p>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-bold text-white">{history.length}</span>
                <p className="text-[10px] text-indigo-200/60 mt-1 uppercase">Surat Tersimpan</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="col-span-9 space-y-6 print:p-0 print:col-span-12">
          {activeTab === "buat" && (
            <>
              {activeView === "menu" && (
                <div className="space-y-10">
                  <section>
                    <div className="flex items-center gap-3 mb-6 px-1">
                      <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daftar Format Surat</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {LETTER_TYPES.filter(t => t.id !== "ckh").map((type) => {
                        const Icon = ICON_MAP[type.icon];
                        const colorClasses: any = {
                          mutasi_masuk: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                          mutasi_keluar: "bg-orange-500/10 text-orange-400 border-orange-500/20",
                          surat_tugas: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          rekomendasi_siswa: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                          keterangan_aktif: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                          kelakuan_baik: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                        };

                        return (
                          <button 
                            key={type.id} 
                            className="group glass-card p-6 text-left hover:bg-white/10 transition-all border-white/5 hover:border-white/20 hover:-translate-y-1 shadow-xl shadow-black/20"
                            onClick={() => handleCreateNew(type.id as LetterType)}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-all group-hover:scale-110 ${colorClasses[type.id]}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tight leading-tight">{type.label}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Klik untuk mulai mengisi draf surat {type.label.toLowerCase()} sekolah secara resmi.</p>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6 px-1">
                      <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                      <h2 className="text-sm font-bold text-amber-500/70 uppercase tracking-widest">Kinerja Pegawai</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {LETTER_TYPES.filter(t => t.id === "ckh").map((type) => {
                        const Icon = ICON_MAP[type.icon];
                        return (
                          <button 
                            key={type.id} 
                            className="group glass-card p-6 text-left hover:bg-amber-500/5 transition-all border-amber-500/10 hover:border-amber-500/30 hover:-translate-y-1 shadow-xl shadow-black/20"
                            onClick={() => handleCreateNew(type.id as LetterType)}
                          >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-amber-500/10 text-amber-400 border border-amber-500/20 transition-all group-hover:scale-110">
                              <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2 group-hover:text-amber-400 transition-colors uppercase tracking-tight leading-tight">{type.label}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Catat dan cetak laporan kinerja harian pegawai madrasah secara resmi.</p>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}

              {activeView === "form" && selectedType && (
                <div className="glass-card">
                  <div className="p-6 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white">Format {LETTER_TYPES.find(t => t.id === selectedType)?.label}</h2>
                    <p className="text-xs text-slate-400">Lengkapi data di bawah ini untuk membuat surat.</p>
                  </div>
                  <div className="p-6">
                    <LetterForm 
                      type={selectedType} 
                      school={schoolInfo}
                      onSubmit={handleFormSubmit} 
                      onCancel={() => setActiveView("menu")} 
                    />
                  </div>
                </div>
              )}

              {activeView === "preview" && currentLetter && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center glass-card p-4 sticky top-4 z-50 print:hidden">
                    <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setActiveView("menu")}>Kembali</Button>
                    <div className="flex flex-col items-end gap-1">
                      <Button onClick={handlePrint} className="bg-indigo-600 text-white hover:bg-indigo-500 border-none shadow-lg shadow-indigo-600/20">
                        <Printer className="w-4 h-4 mr-2" /> Download PDF / Cetak
                      </Button>
                      <p className="text-[9px] text-slate-500 italic">Pilih "Save as PDF" di menu printer untuk mendownload</p>
                    </div>
                  </div>
                  <LetterPreview data={currentLetter} school={schoolInfo} />
                </div>
              )}
            </>
          )}

          {activeTab === "riwayat" && (
            <div className="glass-card overflow-hidden flex flex-col min-h-[400px]">
              <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Arsip Surat</h3>
                  <p className="text-[10px] text-slate-500">Ditemukan {filteredHistory.length} dokumen dalam arsip.</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-indigo-500/50 transition-colors"
                  >
                    <option value="all">Semua Jenis</option>
                    {LETTER_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>

                  <select 
                    value={filterMonth} 
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-indigo-500/50 transition-colors"
                  >
                    <option value="all">Semua Bulan</option>
                    {getAvailableMonths().map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  {(filterType !== "all" || filterMonth !== "all") && (
                    <Button 
                      variant="ghost" 
                      onClick={() => { setFilterType("all"); setFilterMonth("all"); }}
                      className="h-8 text-[10px] hover:text-rose-400"
                    >
                      Reset Filter
                    </Button>
                  )}
                </div>
              </div>
              
              {filteredHistory.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500">
                  <History className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">Tidak ada data yang cocok dengan filter.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase text-slate-500 border-b border-white/5">
                        <th className="p-4 font-bold">Nomor Surat</th>
                        <th className="p-4 font-bold">Jenis</th>
                        <th className="p-4 font-bold">Periode / Subjek</th>
                        <th className="p-4 text-right font-bold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredHistory.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                          <td className="p-4">
                            <p className="font-mono text-[11px] text-slate-400 leading-tight">{item.number}</p>
                            <p className="text-[9px] text-slate-600 mt-0.5">{item.date}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter ${item.type === 'ckh' ? 'bg-amber-500/20 text-amber-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                              {LETTER_TYPES.find(t => t.id === item.type)?.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-200">
                                {item.type === 'ckh' ? item.content.staffName : (item.content.studentName || item.content.staffName || "-")}
                              </span>
                              {item.type === 'ckh' && item.content.month && (
                                <span className="text-[10px] text-indigo-400 font-bold">{item.content.month}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" className="h-7 px-3 text-[11px] bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20" onClick={() => handleViewFromHistory(item)}>
                                Download / Cetak
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => handleDeleteHistory(item.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "pengaturan" && (
            <div className="glass-card">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Konfigurasi Profil Sekolah</h2>
                <p className="text-xs text-slate-400">Pengaturan ini akan berlaku untuk seluruh format Kop Surat.</p>
              </div>
              <div className="p-6">
                <SettingsForm initialData={schoolInfo} onSave={handleUpdateSchool} />
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="relative z-10 mt-12 max-w-6xl mx-auto px-4 flex justify-between items-center text-[10px] text-slate-500 print:hidden">
        <p>© 2026 {schoolInfo.name} • Departemen Administrasi</p>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> System Online</span>
          <span>Cloud Storage Enabled</span>
        </div>
      </footer>
    </div>
  );
}
