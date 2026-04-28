/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { LetterData, LetterType, SchoolInfo } from "@/src/types";
import KopSurat from "./KopSurat";

interface LetterPreviewProps {
  data: LetterData;
  school: SchoolInfo;
}

const LETTER_TITLES: Record<LetterType, string> = {
  mutasi_masuk: "SURAT KETERANGAN PINDAH MASUK",
  mutasi_keluar: "SURAT KETERANGAN PINDAH KELUAR",
  surat_tugas: "SURAT TUGAS",
  rekomendasi_siswa: "SURAT REKOMENDASI",
  keterangan_aktif: "SURAT KETERANGAN AKTIF SISWA",
  kelakuan_baik: "SURAT KETERANGAN BERKELAKUAN BAIK",
  ckh: "CATATAN KINERJA HARIAN (CKH)",
};

export default function LetterPreview({ data, school }: LetterPreviewProps) {
  const renderContent = () => {
    const { content } = data;
    
    switch (data.type) {
      case "ckh":
        return (
          <div className="space-y-6 text-[12px]">
            <div className="space-y-1">
              <div className="grid grid-cols-[100px_20px_1fr]">
                <span>Nama</span>
                <span>:</span>
                <span>{content.staffName}</span>
              </div>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <span>NIP</span>
                <span>:</span>
                <span>{content.nip}</span>
              </div>
              <div className="grid grid-cols-[100px_20px_1fr]">
                <span>Jabatan</span>
                <span>:</span>
                <span>{content.position}</span>
              </div>
            </div>

            <table className="w-full border-collapse border border-black mb-10">
              <thead>
                <tr className="bg-[#2e7d32] text-white">
                  <th className="border border-black p-1 w-8">No</th>
                  <th className="border border-black p-1 w-24">Tanggal</th>
                  <th className="border border-black p-1 w-32">Kegiatan Bulanan</th>
                  <th className="border border-black p-1">Catatan Kinerja Harian</th>
                  <th className="border border-black p-1 w-12">Vol</th>
                  <th className="border border-black p-1 w-20">Satuan</th>
                </tr>
              </thead>
              <tbody>
                {content.activities && content.activities.length > 0 ? (
                  content.activities.map((act: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border border-black p-2 text-center">{idx + 1}</td>
                      <td className="border border-black p-2 text-center">{act.activityDate}</td>
                      <td className="border border-black p-2">{act.monthlyActivity}</td>
                      <td className="border border-black p-2 text-justify">{act.dailyNote}</td>
                      <td className="border border-black p-2 text-center">{act.volume}</td>
                      <td className="border border-black p-2 text-center">{act.unit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-black p-2 text-center">1</td>
                    <td className="border border-black p-2 text-center">{content.activityDate || "-"}</td>
                    <td className="border border-black p-2">{content.monthlyActivity || "-"}</td>
                    <td className="border border-black p-2 text-justify">{content.dailyNote || "-"}</td>
                    <td className="border border-black p-2 text-center">{content.volume || "-"}</td>
                    <td className="border border-black p-2 text-center">{content.unit || "-"}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="grid grid-cols-2 mt-8">
              <div className="text-center space-y-16">
                <div>
                  <p>Mengetahui,</p>
                  <p>{content.approverTitle || "Kepala Madrasah"},</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">{content.approverName || "............................................"}</p>
                  <p>NIP. {content.approverNip || "........................................"}</p>
                </div>
              </div>
              <div className="text-center space-y-16">
                <div>
                  <p>{school.kabupaten}, {format(new Date(data.date), "d MMMM yyyy", { locale: id })}</p>
                  <p>{content.position},</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">{content.staffName}</p>
                  <p>NIP. {content.nip}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "kelakuan_baik":
        return (
          <div className="space-y-8 text-[13px] leading-relaxed">
            <div className="space-y-4">
              <p>Yang bertanda tangan di bawah ini :</p>
              <div className="pl-6 space-y-1">
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>N a m a</span>
                  <span>:</span>
                  <span className="font-bold">{school.principalName}</span>
                </div>
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>NIP</span>
                  <span>:</span>
                  <span>{school.principalNip}</span>
                </div>
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>Jabatan</span>
                  <span>:</span>
                  <span>Kepala {school.name}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p>menerangkan dengan sesungguhnya bahwa :</p>
              <div className="pl-6 space-y-1">
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>N a m a</span>
                  <span>:</span>
                  <span className="font-bold uppercase">{content.studentName}</span>
                </div>
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>Tempat, Tgl. Lahir</span>
                  <span>:</span>
                  <span>{content.placeOfBirth}, {content.dateOfBirth}</span>
                </div>
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>NISN</span>
                  <span>:</span>
                  <span>{content.nisn}</span>
                </div>
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>K e l a s</span>
                  <span>:</span>
                  <span>{content.grade}</span>
                </div>
              </div>
            </div>
            
            <p className="text-justify indent-0">
              Sepanjang pengetahuan kami, siswa/i tersebut selama dalam pendidikan berakhlaq baik / berkelakuan baik 
              dan tidak terlibat dalam penyalahgunaan obat-obatan terlarang / Narkoba.
            </p>

            <p>Demikian keterangan ini dibuat untuk diketahui dan dipergunakan sebagaimana mestinya.</p>
          </div>
        );

      case "keterangan_aktif":
        return (
          <div className="space-y-8 text-[13px] leading-relaxed">
            <div className="space-y-4">
              <p>Yang bertanda tangan di bawah ini :</p>
              <div className="pl-6 space-y-1">
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>N a m a</span>
                  <span>:</span>
                  <span className="font-bold">{school.principalName}</span>
                </div>
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>NIP</span>
                  <span>:</span>
                  <span>{school.principalNip}</span>
                </div>
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>Jabatan</span>
                  <span>:</span>
                  <span>Kepala {school.name}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p>menerangkan dengan bahwa siswa dibawah ini:</p>
              <div className="pl-6 space-y-1">
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>N a m a</span>
                  <span>:</span>
                  <span className="font-bold uppercase">{content.studentName}</span>
                </div>
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>Tempat, Tgl. Lahir</span>
                  <span>:</span>
                  <span>{content.placeOfBirth}, {content.dateOfBirth}</span>
                </div>
                <div className="grid grid-cols-[120px_20px_1fr]">
                  <span>NISN</span>
                  <span>:</span>
                  <span>{content.nisn}</span>
                </div>
              </div>
            </div>
            
            <p className="indent-0">
              adalah benar siswa {school.name} Kelas {content.grade} Tahun Pelajaran {content.academicYear}
            </p>

            <p>Demikianlah keterangan ini kami buat untuk dipergunakan sebagaimana mestinya.</p>
          </div>
        );

      case "rekomendasi_siswa":
        return (
          <div className="space-y-6 text-sm leading-relaxed">
            <p>Yang bertanda tangan di bawah ini Kepala {school.name}, menerangkan bahwa:</p>
            <div className="pl-6 space-y-1">
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Nama</span>
                <span>:</span>
                <span className="font-bold uppercase">{content.studentName}</span>
              </div>
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>NIS / NISN</span>
                <span>:</span>
                <span>{content.nis} / {content.nisn}</span>
              </div>
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Tempat, Tanggal Lahir</span>
                <span>:</span>
                <span>{content.placeOfBirth}, {content.dateOfBirth}</span>
              </div>
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Jenis Kelamin</span>
                <span>:</span>
                <span>{content.gender}</span>
              </div>
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Kelas</span>
                <span>:</span>
                <span>{content.grade}</span>
              </div>
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Alamat</span>
                <span>:</span>
                <span>{content.address}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <p>Memberikan rekomendasi kepada siswa tersebut untuk:</p>
              <p className="font-bold underline italic text-center">{content.recommendationPurpose}</p>
              <p>{content.additionalNote}</p>
            </div>

            <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
          </div>
        );

      case "surat_tugas":
        return (
          <div className="space-y-4 text-[12px] leading-relaxed">
            <div className="grid grid-cols-[100px_20px_1fr] gap-y-2">
              <span className="font-bold">Menimbang</span>
              <span>:</span>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span>a.</span>
                  <p className="text-justify">Bahwa yang namanya tercantum dalam surat ini dianggap layak dan mampu untuk melaksanakan tugas dan fungsi pencapaian target rencana kegiatan dimaksud;</p>
                </div>
                <div className="flex gap-2">
                  <span>b.</span>
                  <p className="text-justify">Bahwa berdasarkan pertimbangan sebagaimana dimaksud pada huruf a di atas perlu menerbitkan surat tugas.</p>
                </div>
              </div>

              <span className="font-bold">Dasar</span>
              <span>:</span>
              <div className="space-y-1">
                {content.reference ? (
                  content.reference
                    .split('\n')
                    .filter((line: string) => {
                      const trimmed = line.trim().toLowerCase();
                      return trimmed !== "" && !trimmed.includes("menimbang") && !trimmed.startsWith("dasar");
                    })
                    .map((ref: string, idx: number) => {
                      const hasNumbering = /^\d+\./.test(ref.trim());
                      return (
                        <div key={idx} className="flex gap-2">
                          {!hasNumbering && <span className="min-w-[15px]">{idx + 1}.</span>}
                          <p className="text-justify">{ref}</p>
                        </div>
                      );
                    })
                ) : (
                  <>
                    <div className="flex gap-2">
                      <span>1.</span>
                      <p className="text-justify">Peraturan Menteri Agama Nomor 13 Tahun 2012 tentang Organisasi dan Tata Kerja Instansi Vertikal Kementerian Agama;</p>
                    </div>
                    <div className="flex gap-2">
                      <span>2.</span>
                      <p className="text-justify">Keputusan Menteri Agama RI Nomor 9 Tahun 2016 tentang Naskah Dinas pada Kementerian Agama.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <h3 className="text-center font-bold text-sm my-4">MEMBERI TUGAS</h3>

            <div className="grid grid-cols-[100px_20px_1fr] gap-y-1">
              <span className="font-bold">Kepala</span>
              <span>:</span>
              <div className="space-y-1">
                <div className="grid grid-cols-[100px_15px_1fr]">
                  <span>Nama</span>
                  <span>:</span>
                  <span className="font-bold">{content.staffName}</span>
                </div>
                <div className="grid grid-cols-[100px_15px_1fr]">
                  <span>NIP</span>
                  <span>:</span>
                  <span>{content.nip}</span>
                </div>
                <div className="grid grid-cols-[100px_15px_1fr]">
                  <span>Jabatan</span>
                  <span>:</span>
                  <span>{content.position}</span>
                </div>
                <div className="grid grid-cols-[100px_15px_1fr]">
                  <span>Tempat Tugas</span>
                  <span>:</span>
                  <span>{content.taskPlace || school.name}</span>
                </div>
              </div>

              <span className="font-bold mt-4">Untuk</span>
              <span className="mt-4">:</span>
              <div className="space-y-2 mt-4">
                <div className="flex gap-2">
                  <span>1.</span>
                  <p>{content.taskType}</p>
                </div>
                <div className="flex gap-2">
                  <span>2.</span>
                  <div className="space-y-1">
                    <p>Waktu dan tempat pelaksanaan kegiatan</p>
                    <div className="grid grid-cols-[100px_15px_1fr] pl-4">
                      <span>Hari / Tanggal</span>
                      <span>:</span>
                      <span>{content.taskDate}</span>
                    </div>
                    <div className="grid grid-cols-[100px_15px_1fr] pl-4">
                      <span>Tempat</span>
                      <span>:</span>
                      <span>{content.taskPlaceDetail || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4">Demikian untuk dilaksanakan sebagaimana mestinya.</p>
          </div>
        );

      case "mutasi_keluar":
        return (
          <div className="space-y-6 text-sm leading-relaxed">
            <p>Kepala {school.name}, menerangkan bahwa:</p>
            <div className="pl-8 space-y-1">
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Nama</span>
                <span>:</span>
                <span className="font-bold uppercase">{content.studentName}</span>
              </div>
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>NIS / NISN</span>
                <span>:</span>
                <span>{content.nis} / {content.nisn}</span>
              </div>
            </div>
            <p>Telah mengajukan permohonan pindah sekolah dari {school.name} ke:</p>
            <div className="pl-8 space-y-1">
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Sekolah Tujuan</span>
                <span>:</span>
                <span className="font-bold">{content.targetSchool}</span>
              </div>
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Alamat Tujuan</span>
                <span>:</span>
                <span>{content.targetAddress}</span>
              </div>
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Alasan Pindah</span>
                <span>:</span>
                <span>{content.reason}</span>
              </div>
            </div>
            <p>Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
          </div>
        );

      case "mutasi_masuk":
        return (
          <div className="space-y-6 text-sm leading-relaxed">
            <p>Memperhatikan surat permohonan pindah masuk dari {content.originalSchool} tertanggal {content.requestDate}, maka Kepala {school.name} menyatakan:</p>
            <h3 className="text-center font-bold text-lg underline">MENERIMA</h3>
            <p>Siswa yang tersebut di bawah ini:</p>
            <div className="pl-8 space-y-1">
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>Nama</span>
                <span>:</span>
                <span className="font-bold uppercase">{content.studentName}</span>
              </div>
              <div className="grid grid-cols-[150px_20px_1fr]">
                <span>NIS / NISN</span>
                <span>:</span>
                <span>{content.nis} / {content.nisn}</span>
              </div>
            </div>
            <p>Untuk menjadi siswa di {school.name} pada Kelas {content.targetGrade} Semester {content.semester} Tahun Pelajaran {content.academicYear}.</p>
            <p>Surat keterangan ini berlaku sejak tanggal ditetapkan.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      id="printable-letter"
      className="bg-white p-[2cm] w-[21cm] min-h-[29.7cm] shadow-xl mx-auto border border-gray-200 print:shadow-none print:border-none font-serif text-black"
    >
      {data.type === "ckh" ? (
        <div className="text-center mb-10 leading-tight">
          <h1 className="text-[18px] font-bold uppercase">{LETTER_TITLES[data.type]}</h1>
          <h1 className="text-[18px] font-bold uppercase">{school.name}</h1>
          <p className="text-[14px] font-bold mt-1 uppercase">Bulan {data.content.month}</p>
        </div>
      ) : (
        <>
          <KopSurat school={school} />
          
          <div className="text-center mb-8">
            <h2 className="text-md font-bold underline decoration-1 underline-offset-4">{LETTER_TITLES[data.type]}</h2>
            <p className="text-sm">Nomor: {data.number}</p>
          </div>
        </>
      )}

      <div className={data.type === "ckh" ? "" : "min-h-[15cm]"}>
        {renderContent()}
      </div>

      {data.type !== "ckh" && (
        <div className="flex justify-end mt-12">
          <div className="w-[8cm] text-center space-y-20">
            <div>
              <p className="text-sm">{school.kabupaten}, {format(new Date(data.date), "dd MMMM yyyy", { locale: id })}</p>
              <p className="text-sm font-bold">Kepala Sekolah,</p>
            </div>
            
            <div>
              <p className="text-sm font-bold underline uppercase">{school.principalName}</p>
              <p className="text-sm">NIP. {school.principalNip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
