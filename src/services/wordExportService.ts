import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, PageOrientation } from "docx";
import { saveAs } from "file-saver";
import { LetterData, SchoolInfo } from "../types";

export const exportToWord = async (letter: LetterData, school: SchoolInfo) => {
  const { type, content } = letter;

  const sections = [];

  // Helper for Kop Surat (Header)
  const createHeader = () => {
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "KEMENTERIAN AGAMA REPUBLIK INDONESIA", bold: true, size: 24 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: school.name.toUpperCase(), bold: true, size: 28 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: school.address, size: 20 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: `Telepon: ${school.phone} | Website: ${school.website}`, size: 20 }),
        ],
      }),
      new Paragraph({
        border: {
          bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 },
        },
        children: [],
      }),
      new Paragraph({ children: [] }), // Spacer
    ];
  };

  if (type === "ckh") {
    const tableHeader = new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: "2E7D32" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tanggal", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: "2E7D32" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Kegiatan Bulanan", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: "2E7D32" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Catatan Kinerja Harian", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: "2E7D32" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Vol", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: "2E7D32" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Satuan", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })], shading: { fill: "2E7D32" } }),
      ],
    });

    const rows = (content.activities || []).map((act: any, idx: number) => (
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (idx + 1).toString() })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: act.activityDate })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: act.monthlyActivity })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: act.dailyNote })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: act.volume || "1" })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: act.unit || "Kegiatan" })], alignment: AlignmentType.CENTER })] }),
        ],
      })
    ));

    const activitiesTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [tableHeader, ...rows],
    });

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
          },
        },
        children: [
          ...createHeader(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "CATATAN KINERJA HARIAN (CKH)", bold: true, underline: {}, size: 28 })],
          }),
          new Paragraph({ children: [] }),
          new Paragraph({
            children: [
              new TextRun({ text: "Nama: ", bold: true }),
              new TextRun({ text: content.staffName }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "NIP: ", bold: true }),
              new TextRun({ text: content.nip }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Jabatan: ", bold: true }),
              new TextRun({ text: content.position }),
            ],
          }),
          new Paragraph({ children: [] }),
          activitiesTable,
          new Paragraph({ children: [] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: "Mengetahui," })] }),
                      new Paragraph({ children: [new TextRun({ text: content.approverTitle || "Kepala Madrasah" })] }),
                      new Paragraph({ children: [], spacing: { before: 800 } }),
                      new Paragraph({ children: [new TextRun({ text: content.approverName || "...", bold: true, underline: {} })] }),
                      new Paragraph({ children: [new TextRun({ text: `NIP. ${content.approverNip || "..."}` })] }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: `${school.kabupaten}, ${letter.date}` })], alignment: AlignmentType.RIGHT }),
                      new Paragraph({ children: [new TextRun({ text: "Yang Membuat," })], alignment: AlignmentType.RIGHT }),
                      new Paragraph({ children: [], spacing: { before: 800 } }),
                      new Paragraph({ children: [new TextRun({ text: content.staffName, bold: true, underline: {} })], alignment: AlignmentType.RIGHT }),
                      new Paragraph({ children: [new TextRun({ text: `NIP. ${content.nip}` })], alignment: AlignmentType.RIGHT }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${type}_${letter.id}.docx`);
    return;
  } else if (type === "surat_tugas" || type === "keterangan_aktif" || type === "mutasi_masuk" || type === "mutasi_keluar" || type === "rekomendasi_siswa" || type === "kelakuan_baik") {
    const titleMap: any = {
      surat_tugas: "SURAT TUGAS",
      keterangan_aktif: "SURAT KETERANGAN AKTIF BELAJAR",
      mutasi_masuk: "SURAT KETERANGAN MUTASI MASUK",
      mutasi_keluar: "SURAT KETERANGAN MUTASI KELUAR",
      rekomendasi_siswa: "SURAT REKOMENDASI",
      kelakuan_baik: "SURAT KETERANGAN KELAKUAN BAIK"
    };

    const paragraphs: (Paragraph | Table)[] = [
      ...createHeader(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: titleMap[type] || "SURAT KETERANGAN", bold: true, underline: {}, size: 28 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `Nomor: ${letter.number}`, size: 22 })],
      }),
      new Paragraph({ children: [] }),
    ];

    if (type === "surat_tugas") {
      paragraphs.push(
        new Paragraph({ children: [new TextRun({ text: "Menimbang :", bold: true })] }),
        new Paragraph({
          indent: { left: 720 },
          children: [new TextRun({ text: "Bahwa yang namanya tercantum dalam surat ini dianggap layak dan mampu untuk melaksanakan tugas dan fungsi pencapaian target rencana kegiatan dimaksud;" })]
        }),
        new Paragraph({ children: [] }),
        new Paragraph({ children: [new TextRun({ text: "Dasar :", bold: true })] }),
        ...content.reference.split("\n").map((line: string, i: number) => (
          new Paragraph({
            indent: { left: 720 },
            children: [new TextRun({ text: `${i + 1}. ${line}` })]
          })
        )),
        new Paragraph({ children: [], spacing: { before: 200 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "MEMERINTAHKAN:", bold: true, size: 24 })]
        }),
        new Paragraph({ children: [] }),
        new Paragraph({
          children: [
            new TextRun({ text: "Kepada : ", bold: true }),
            new TextRun({ text: content.staffName })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "NIP : ", bold: true }),
            new TextRun({ text: content.nip })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Jabatan : ", bold: true }),
            new TextRun({ text: content.position })
          ]
        }),
        new Paragraph({ children: [] }),
        new Paragraph({
          children: [
            new TextRun({ text: "Untuk : ", bold: true }),
            new TextRun({ text: content.purpose })
          ]
        })
      );
    } else {
      // General format for student-related letters
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "Kepala Madrasah dengan ini menerangkan bahwa:" })]
        }),
        new Paragraph({ children: [] }),
        new Paragraph({
          indent: { left: 720 },
          children: [
            new TextRun({ text: "Nama : ", bold: true }),
            new TextRun({ text: content.studentName })
          ]
        }),
        new Paragraph({
          indent: { left: 720 },
          children: [
            new TextRun({ text: "Tempat, Tgl Lahir : ", bold: true }),
            new TextRun({ text: `${content.birthPlace}, ${content.birthDate}` })
          ]
        }),
        new Paragraph({
          indent: { left: 720 },
          children: [
            new TextRun({ text: "NIS/NISN : ", bold: true }),
            new TextRun({ text: `${content.nis || "-"} / ${content.nisn || "-"}` })
          ]
        }),
        new Paragraph({
          indent: { left: 720 },
          children: [
            new TextRun({ text: "Kelas : ", bold: true }),
            new TextRun({ text: content.classLevel })
          ]
        }),
        new Paragraph({ children: [] }),
        new Paragraph({
          children: [new TextRun({ text: content.notes || "Demikian surat keterangan ini diberikan untuk dapat dipergunakan sebagaimana mestinya." })],
          alignment: AlignmentType.BOTH
        })
      );
    }

    // Footer signature
    paragraphs.push(
      new Paragraph({ children: [] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [] }),
              new TableCell({
                children: [
                  new Paragraph({ children: [new TextRun({ text: `${school.kabupaten}, ${letter.date}` })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [new TextRun({ text: "Kepala Madrasah," })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [], spacing: { before: 800 } }),
                  new Paragraph({ children: [new TextRun({ text: school.principalName, bold: true, underline: {} })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [new TextRun({ text: `NIP. ${school.principalNip}` })], alignment: AlignmentType.CENTER }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    const doc = new Document({
      sections: [{ children: paragraphs as any }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${type}_${letter.id}.docx`);
    return;
  } else {
    // Generic simple format for others (placeholder)
    const doc = new Document({
      sections: [{
        children: [
          ...createHeader(),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: (type as string).toUpperCase().replace("_", " "), bold: true, size: 28 })],
          }),
          new Paragraph({ children: [] }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Format export untuk tipe surat ini sedang disempurnakan. Silakan gunakan cetak PDF untuk hasil terbaik sementara waktu.",
                italics: true,
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${type}_${letter.id}.docx`);
    return;
  }
};

