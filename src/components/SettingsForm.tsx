/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SchoolInfo } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SettingsFormProps {
  initialData: SchoolInfo;
  onSave: (data: SchoolInfo) => void;
}

export default function SettingsForm({ initialData, onSave }: SettingsFormProps) {
  const [formData, setFormData] = React.useState<SchoolInfo>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran logo maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const labelClass = "text-slate-400 text-[10px] uppercase font-bold tracking-widest";
  const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9 transition-all focus:border-indigo-500 focus:bg-white/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
            Identitas Sekolah
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className={labelClass}>Nama Kementerian</Label>
              <Input name="kementerian" value={formData.kementerian} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Nama Sekolah</Label>
              <Input name="name" value={formData.name} onChange={handleChange} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className={labelClass}>Provinsi</Label>
                <Input name="provinsi" value={formData.provinsi} onChange={handleChange} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label className={labelClass}>Kabupaten/Kota</Label>
                <Input name="kabupaten" value={formData.kabupaten} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Alamat Lengkap Sekolah</Label>
              <Input name="address" value={formData.address} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Logo & Contact Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
            Logo & Kontak
          </h3>
          <div className="space-y-4">
             <div className="flex items-center gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-20 h-20 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Upload className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div className="flex-grow space-y-2">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="bg-indigo-600 hover:bg-indigo-500 text-xs text-white px-3 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
                      <Upload className="w-3 h-3" /> Unggah Logo Baru
                    </div>
                  </Label>
                  <Input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoUpload} 
                  />
                  <p className="text-[10px] text-slate-500">PNG/JPG, Maks 2MB. Disarankan background transparan.</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={labelClass}>Nomor Telepon</Label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelClass}>Email Sekolah</Label>
                  <Input name="email" value={formData.email} onChange={handleChange} className={inputClass} />
                </div>
             </div>
             <div className="space-y-1.5">
              <Label className={labelClass}>Website Sekolah</Label>
              <Input name="website" value={formData.website} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Principal Section */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
            Tanda Tangan (Kepala Sekolah)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={labelClass}>Nama Kepala Sekolah (Lengkap dengan Gelar)</Label>
              <Input name="principalName" value={formData.principalName} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>NIP Kepala Sekolah</Label>
              <Input name="principalNip" value={formData.principalNip} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-lg shadow-indigo-500/20 px-10">
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
