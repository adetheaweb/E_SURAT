/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { format } from "date-fns";
import { LetterType, SchoolInfo } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface LetterFormProps {
  type: LetterType;
  school?: SchoolInfo;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function LetterForm({ type, school, onSubmit, onCancel }: LetterFormProps) {
  const [formData, setFormData] = React.useState<any>({
    number: `421.1/${Math.floor(Math.random() * 1000)}/SMANP/${new Date().getFullYear()}`,
    date: format(new Date(), "yyyy-MM-dd"),
    content: type === "ckh" ? {
      approverName: "", // Will be filled from school info if available
      approverNip: "",
      approverTitle: "Kepala Madrasah",
      activities: [{
        activityDate: format(new Date(), "yyyy-MM-dd"),
        monthlyActivity: "",
        dailyNote: "",
        volume: "1",
        unit: "Kegiatan"
      }]
    } : type === "surat_tugas" ? {
      reference: "Peraturan Menteri Agama Nomor 13 Tahun 2012 tentang Organisasi dan Tata Kerja Instansi Vertikal Kementerian Agama;\nPeraturan Menteri Agama RI Nomor 28 Tahun 2013 yang diubah dengan Peraturan Menteri Agama Nomor 45 Tahun 2015 tentang Disiplin Kehadiran Pegawai Negeri Sipil di Kementerian Agama;\nPeraturan Menteri Keuangan RI Nomor 113/PMK.05/2012 tentang Perjalanan Dinas;\nKeputusan Menteri Agama RI Nomor 9 Tahun 2016 tentang Naskah Dinas pada Kementerian Agama."
    } : {}
  });

  // Pre-fill approver info from school data when it's available
  React.useEffect(() => {
    if (type === "ckh" && !formData.content.approverName && school) {
      setFormData((prev: any) => ({
        ...prev,
        content: {
          ...prev.content,
          approverName: school.principalName,
          approverNip: school.principalNip,
        }
      }));
    }
  }, [school, type]);

  const handleActivityChange = (index: number, name: string, value: string) => {
    setFormData((prev: any) => {
      const newActivities = [...(prev.content.activities || [])];
      const oldActivity = newActivities[index] || {};
      
      const updatedActivity = { ...oldActivity, [name]: value };

      // Sync monthlyActivity to dailyNote as a template if dailyNote is empty or matches previous monthlyActivity
      if (name === "monthlyActivity") {
        if (!updatedActivity.dailyNote || updatedActivity.dailyNote === oldActivity.monthlyActivity) {
          updatedActivity.dailyNote = value;
        }
      }

      newActivities[index] = updatedActivity;
      return {
        ...prev,
        content: { ...prev.content, activities: newActivities }
      };
    });
  };

  const applyTemplate = (index: number, template: { activity: string; note: string }) => {
    setFormData((prev: any) => {
      const newActivities = [...(prev.content.activities || [])];
      newActivities[index] = {
        ...newActivities[index],
        monthlyActivity: template.activity,
        dailyNote: template.note
      };
      return {
        ...prev,
        content: { ...prev.content, activities: newActivities }
      };
    });
  };

  const CKH_TEMPLATES = [
    { 
      activity: "Melaksanakan Proses Pembelajaran", 
      note: "Melaksanakan kegiatan belajar mengajar sesuai jadwal kurikulum di kelas untuk memastikan penyampaian materi efektif." 
    },
    { 
      activity: "Penyusunan Perangkat Pembelajaran", 
      note: "Menyusun Program Tahunan (Prota), Program Semester (Promes), Silabus, dan Rencana Pelaksanaan Pembelajaran (RPP)." 
    },
    { 
      activity: "Evaluasi dan Penilaian Belajar", 
      note: "Melaksanakan penilaian harian, koreksi jawaban siswa, dan penginputan nilai ke buku nilai atau aplikasi raport." 
    },
    { 
      activity: "Melaksanakan Tugas Piket Guru", 
      note: "Melaksanakan tugas piket harian untuk menjaga kedisiplinan siswa dan ketertiban lingkungan operasional madrasah." 
    },
    { 
      activity: "Rapat Koordinasi & Evaluasi", 
      note: "Mengikuti rapat kerja guru dan staf untuk membahas program pengembangan madrasah dan evaluasi kinerja bulanan." 
    },
    { 
      activity: "Pembimbingan Ekstrakurikuler", 
      note: "Memberikan bimbingan teknis dan pelatihan kepada siswa dalam kegiatan minat bakat untuk pengembangan diri." 
    },
    { 
      activity: "Administrasi Wali Kelas", 
      note: "Mengelola administrasi kelas, bimbingan siswa, serta pengisian buku laporan hasil belajar (raport) siswa binaan." 
    },
    { 
      activity: "Pengembangan Diri / Workshop", 
      note: "Mengikuti kegiatan seminar, workshop, atau pelatihan peningkatan kompetensi pendidik (MGMP/KKG)." 
    },
  ];

  const addActivity = (template?: { activity: string; note: string }) => {
    setFormData((prev: any) => ({
      ...prev,
      content: {
        ...prev.content,
        activities: [
          ...(prev.content.activities || []),
          {
            activityDate: format(new Date(), "yyyy-MM-dd"),
            monthlyActivity: template?.activity || "",
            dailyNote: template?.note || "",
            volume: "1",
            unit: "Kegiatan"
          }
        ]
      }
    }));
  };

  const removeActivity = (index: number) => {
    setFormData((prev: any) => {
      const newActivities = [...(prev.content.activities || [])];
      if (newActivities.length > 1) {
        newActivities.splice(index, 1);
      }
      return {
        ...prev,
        content: { ...prev.content, activities: newActivities }
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "number" || name === "date") {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev: any) => {
        const newData = {
          ...prev,
          content: { ...prev.content, [name]: value }
        };

        // Special logic for CKH: Sync monthlyActivity to dailyNote as a template
        if (type === "ckh" && name === "monthlyActivity") {
          const currentDailyNote = prev.content.dailyNote || "";
          const previousMonthlyActivity = prev.content.monthlyActivity || "";
          
          // Only auto-fill if dailyNote is empty or was just matching the previous monthly activity
          if (!currentDailyNote || currentDailyNote === previousMonthlyActivity) {
            newData.content.dailyNote = value;
          }
        }

        return newData;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      content: { ...prev.content, [name]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderFields = () => {
    const labelClass = "text-slate-400 text-[10px] uppercase font-bold tracking-widest";
    const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9 transition-all focus:border-indigo-500 focus:bg-white/10";
    const textareaClass = "bg-white/5 border-white/10 text-white placeholder:text-slate-600 transition-all focus:border-indigo-500 focus:bg-white/10";

    switch (type) {
      case "keterangan_aktif":
      case "kelakuan_baik":
      case "rekomendasi_siswa":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="studentName" className={labelClass}>Nama Lengkap Siswa</Label>
              <Input id="studentName" name="studentName" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nis" className={labelClass}>NIS / NISN</Label>
              <Input id="nis" name="nis" placeholder="Contoh: 1234 / 00123456" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="placeOfBirth" className={labelClass}>Tempat Lahir</Label>
              <Input id="placeOfBirth" name="placeOfBirth" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dateOfBirth" className={labelClass}>Tanggal Lahir</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="text" placeholder="Contoh: 12 Januari 2010" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender" className={labelClass}>Jenis Kelamin</Label>
              <Select onValueChange={(v: string) => handleSelectChange("gender", v)}>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grade" className={labelClass}>Kelas</Label>
              <Input id="grade" name="grade" placeholder="Contoh: X MIPA 1" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="address" className={labelClass}>Alamat Orang Tua/Wali</Label>
              <Textarea id="address" name="address" required onChange={handleChange} className={textareaClass} />
            </div>
            {type === "keterangan_aktif" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="semester" className={labelClass}>Semester</Label>
                  <Select onValueChange={(v: string) => handleSelectChange("semester", v)}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                      <SelectItem value="Ganjil">Ganjil</SelectItem>
                      <SelectItem value="Genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="academicYear" className={labelClass}>Tahun Pelajaran</Label>
                  <Input id="academicYear" name="academicYear" placeholder="Contoh: 2023/2024" required onChange={handleChange} className={inputClass} />
                </div>
              </>
            )}
            {type === "rekomendasi_siswa" && (
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="recommendationPurpose" className={labelClass}>Tujuan Rekomendasi</Label>
                <Input id="recommendationPurpose" name="recommendationPurpose" placeholder="Contoh: Mengikuti Lomba OSN Tingkat Nasional" required onChange={handleChange} className={inputClass} />
              </div>
            )}
          </div>
        );

      case "surat_tugas":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="reference" className={labelClass}>Dasar Pelaksanaan (Cukup isi poin-poinnya saja)</Label>
              <Textarea 
                id="reference" 
                name="reference" 
                value={formData.content.reference || ""}
                placeholder="Contoh:&#10;Peraturan Menteri Agama Nomor 13 Tahun 2012...&#10;Keputusan Menteri Agama RI Nomor 9 Tahun 2016..." 
                required 
                onChange={handleChange} 
                className={textareaClass} 
                rows={6} 
              />
              <p className="text-[10px] text-indigo-400/60 italic mt-1">* Judul 'Menimbang' & 'Dasar' sudah otomatis ada. Cukup isi daftar aturannya.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staffName" className={labelClass}>Nama Petugas / Yang Diberi Tugas</Label>
              <Input id="staffName" name="staffName" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nip" className={labelClass}>NIP / Identitas Pegawai</Label>
              <Input id="nip" name="nip" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="position" className={labelClass}>Jabatan</Label>
              <Input id="position" name="position" placeholder="Contoh: Guru Madya / Staf Tata Usaha" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="taskPlace" className={labelClass}>Tempat Tugas Utama</Label>
              <Input id="taskPlace" name="taskPlace" placeholder="Contoh: MAN 1 Tasikmalaya" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="taskType" className={labelClass}>Tugas Yang Diberikan (Poin 1)</Label>
              <Textarea id="taskType" name="taskType" placeholder="Contoh: Mengikuti Sosialisasi Raport Digital..." required onChange={handleChange} className={textareaClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="taskDate" className={labelClass}>Hari / Tanggal Pelaksanaan</Label>
              <Input id="taskDate" name="taskDate" placeholder="Contoh: Sabtu, 28 April 2026" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="taskPlaceDetail" className={labelClass}>Tempat Pelaksanaan (Poin 2)</Label>
              <Input id="taskPlaceDetail" name="taskPlaceDetail" placeholder="Contoh: Gedung Serbaguna Kab. Tasik" required onChange={handleChange} className={inputClass} />
            </div>
          </div>
        );

      case "mutasi_keluar":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="studentName" className={labelClass}>Nama Siswa</Label>
              <Input id="studentName" name="studentName" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nis" className={labelClass}>NIS / NISN</Label>
              <Input id="nis" name="nis" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetSchool" className={labelClass}>Sekolah Tujuan</Label>
              <Input id="targetSchool" name="targetSchool" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetAddress" className={labelClass}>Alamat Sekolah Tujuan</Label>
              <Input id="targetAddress" name="targetAddress" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="reason" className={labelClass}>Alasan Pindah</Label>
              <Input id="reason" name="reason" placeholder="Contoh: Ikut Orang Tua Pindah Tugas" required onChange={handleChange} className={inputClass} />
            </div>
          </div>
        );

      case "mutasi_masuk":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="studentName" className={labelClass}>Nama Siswa</Label>
              <Input id="studentName" name="studentName" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nis" className={labelClass}>NIS / NISN</Label>
              <Input id="nis" name="nis" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="originalSchool" className={labelClass}>Sekolah Asal</Label>
              <Input id="originalSchool" name="originalSchool" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="requestDate" className={labelClass}>Tanggal Surat Permohonan</Label>
              <Input id="requestDate" name="requestDate" type="text" placeholder="Contoh: 15 April 2026" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetGrade" className={labelClass}>Kelas Tujuan</Label>
              <Input id="targetGrade" name="targetGrade" placeholder="Contoh: XI" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="semester" className={labelClass}>Semester</Label>
              <Input id="semester" name="semester" placeholder="Contoh: Genap" required onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="academicYear" className={labelClass}>Tahun Pelajaran</Label>
              <Input id="academicYear" name="academicYear" placeholder="Contoh: 2023/2024" required onChange={handleChange} className={inputClass} />
            </div>
          </div>
        );

      case "ckh":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="space-y-1.5">
                <Label htmlFor="month" className={labelClass}>Bulan</Label>
                <Input id="month" name="month" placeholder="Contoh: April 2026" value={formData.content.month || ""} required onChange={handleChange} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="staffName" className={labelClass}>Nama Pegawai</Label>
                <Input id="staffName" name="staffName" value={formData.content.staffName || ""} required onChange={handleChange} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nip" className={labelClass}>NIP Pegawai</Label>
                <Input id="nip" name="nip" value={formData.content.nip || ""} required onChange={handleChange} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="position" className={labelClass}>Jabatan Pegawai</Label>
                <Input id="position" name="position" value={formData.content.position || ""} required onChange={handleChange} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="approverTitle" className={labelClass}>Jabatan Penandatangan</Label>
                <Select 
                  value={formData.content.approverTitle || "Kepala Madrasah"} 
                  onValueChange={(v: string) => handleSelectChange("approverTitle", v)}
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Pilih Jabatan" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                    <SelectItem value="Kepala Madrasah">Kepala Madrasah</SelectItem>
                    <SelectItem value="Kaur TU">Kaur TU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="approverName" className={labelClass}>Nama Penandatangan</Label>
                <Input id="approverName" name="approverName" value={formData.content.approverName || ""} required onChange={handleChange} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="approverNip" className={labelClass}>NIP Penandatangan</Label>
                <Input id="approverNip" name="approverNip" value={formData.content.approverNip || ""} required onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 px-1 border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Daftar Kegiatan</h3>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={(v: string) => {
                        const tpl = CKH_TEMPLATES[parseInt(v)];
                        addActivity(tpl);
                      }}
                    >
                      <SelectTrigger className="h-7 bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 transition-all text-[10px] w-auto gap-2 px-3">
                        <Sparkles className="w-3 h-3" />
                        <span>Tambah dari Template</span>
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e293b] border-white/10 text-white max-w-[300px]">
                        {CKH_TEMPLATES.map((tpl, tIdx) => (
                          <SelectItem key={tIdx} value={tIdx.toString()} className="text-[11px] focus:bg-indigo-600 focus:text-white">
                            {tpl.activity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button 
                      type="button" 
                      onClick={() => addActivity()}
                      className="h-7 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] px-3"
                    >
                      + Baris Kosong
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[9px] text-slate-500 font-bold uppercase py-1 mr-1">Rekomendasi:</span>
                  {CKH_TEMPLATES.map((tpl, tIdx) => (
                    <button
                      key={tIdx}
                      type="button"
                      onClick={() => applyTemplate(formData.content.activities.length - 1, tpl)}
                      className="text-[9px] bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 border border-white/10 rounded-full px-2 py-0.5 transition-all"
                    >
                      {tpl.activity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Header for activities (Desktop only) */}
              <div className="hidden md:grid grid-cols-[100px_1fr_1fr_60px_80px_40px] gap-2 px-1 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                <div>Tanggal</div>
                <div>Kegiatan Bulanan</div>
                <div>Catatan Kinerja</div>
                <div>Vol</div>
                <div>Satuan</div>
                <div></div>
              </div>

              <div className="space-y-2">
                {(formData.content.activities || []).map((activity: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_60px_80px_40px] gap-2 items-start bg-white/5 p-2 md:p-1 rounded-lg border border-white/5 group">
                    <div className="md:contents">
                      <div className="space-y-1 md:space-y-0">
                        <Label className="md:hidden text-[9px] uppercase font-bold text-slate-500">Tanggal</Label>
                        <Input 
                          type="date" 
                          value={activity.activityDate || ""} 
                          required 
                          onChange={(e) => handleActivityChange(index, "activityDate", e.target.value)} 
                          className="h-8 text-[11px] bg-transparent border-white/10 [color-scheme:dark]" 
                        />
                      </div>
                      <div className="space-y-1 md:space-y-0">
                        <div className="flex items-center justify-between md:hidden">
                          <Label className="text-[9px] uppercase font-bold text-slate-500">Kegiatan</Label>
                        </div>
                        <div className="flex gap-1">
                          <div className="relative flex-1">
                            <Input 
                              placeholder="Kegiatan Bulanan..." 
                              value={activity.monthlyActivity || ""} 
                              required 
                              onChange={(e) => handleActivityChange(index, "monthlyActivity", e.target.value)} 
                              className="h-8 text-[11px] bg-transparent border-white/10" 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 md:space-y-0">
                        <Label className="md:hidden text-[9px] uppercase font-bold text-slate-500">Catatan</Label>
                        <Input 
                          placeholder="Detail kinerja..." 
                          value={activity.dailyNote || ""} 
                          required 
                          onChange={(e) => handleActivityChange(index, "dailyNote", e.target.value)} 
                          className="h-8 text-[11px] bg-transparent border-white/10" 
                        />
                      </div>
                      <div className="space-y-1 md:space-y-0">
                        <Label className="md:hidden text-[9px] uppercase font-bold text-slate-500">Vol</Label>
                        <Input 
                          placeholder="Vol" 
                          value={activity.volume || ""} 
                          required 
                          onChange={(e) => handleActivityChange(index, "volume", e.target.value)} 
                          className="h-8 text-[11px] bg-transparent border-white/10" 
                        />
                      </div>
                      <div className="space-y-1 md:space-y-0">
                        <Label className="md:hidden text-[9px] uppercase font-bold text-slate-500">Satuan</Label>
                        <Input 
                          placeholder="Satuan" 
                          value={activity.unit || ""} 
                          required 
                          onChange={(e) => handleActivityChange(index, "unit", e.target.value)} 
                          className="h-8 text-[11px] bg-transparent border-white/10" 
                        />
                      </div>
                      <div className="flex justify-end pt-2 md:pt-0">
                        <Button 
                          type="button"
                          variant="ghost"
                          onClick={() => removeActivity(index)}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10"
                          disabled={formData.content.activities.length <= 1}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type !== "ckh" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="space-y-2">
            <Label htmlFor="number" className="text-slate-400 text-xs uppercase font-bold tracking-wider">Nomor Surat</Label>
            <Input id="number" name="number" value={formData.number} onChange={handleChange} required className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-400 text-xs uppercase font-bold tracking-wider">Tanggal Surat</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required className="bg-white/5 border-white/10 text-white [color-scheme:dark] h-10" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {renderFields()}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
        <Button type="button" variant="ghost" className="text-slate-400 hover:text-white" onClick={onCancel}>Batal</Button>
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-lg shadow-indigo-500/20 px-8">Pratinjau & Cetak</Button>
      </div>
    </form>
  );
}
