/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LetterType = 
  | "mutasi_masuk" 
  | "mutasi_keluar" 
  | "surat_tugas" 
  | "rekomendasi_siswa" 
  | "keterangan_aktif" 
  | "kelakuan_baik"
  | "ckh";

export interface SchoolInfo {
  name: string;
  kementerian: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  distrik: string;
  kabupaten: string;
  provinsi: string;
  principalName: string;
  principalNip: string;
}

export interface LetterData {
  id: string;
  type: LetterType;
  number: string;
  date: string;
  content: any;
}

export const DEFAULT_SCHOOL: SchoolInfo = {
  name: "SMA NEGERI PERCONTOHAN",
  kementerian: "Kementrian Pendidikan, Kebudayaan, Riset, dan Teknologi",
  address: "Jl. Pendidikan No. 123, Kel. Belajar, Kec. Pintar",
  phone: "(021) 1234567",
  email: "smanpercontohan@school.sch.id",
  website: "www.smanpercontohan.sch.id",
  logo: "https://api.dicebear.com/7.x/identicon/svg?seed=school",
  distrik: "Kecamatan Pintar",
  kabupaten: "Jakarta Pusat",
  provinsi: "DKI Jakarta",
  principalName: "Drs. H. Ahmad Siswanto, M.Pd",
  principalNip: "19700101 199501 1 001"
};

export const LETTER_TYPES = [
  { id: "mutasi_masuk", label: "Mutasi Masuk", icon: "ArrowDownLeft" },
  { id: "mutasi_keluar", label: "Mutasi Keluar", icon: "ArrowUpRight" },
  { id: "surat_tugas", label: "Surat Tugas", icon: "FileText" },
  { id: "rekomendasi_siswa", label: "Rekomendasi Siswa", icon: "UserCheck" },
  { id: "keterangan_aktif", label: "Surat Keterangan Siswa Aktif", icon: "CheckCircle" },
  { id: "kelakuan_baik", label: "Surat Keterangan Kelakuan Baik", icon: "ShieldCheck" },
  { id: "ckh", label: "Catatan Kinerja Harian (CKH)", icon: "ClipboardList" },
];
