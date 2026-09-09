// Master mock data for Working Templates, Consultant Working Papers, Detailed BIA, and System Config
import {
  WorkingTemplate,
  ConsultantWorkingPaper,
  InterviewWorksheet,
  DetailedBiaWorksheet,
  SystemParameterConfig,
  TemplateCategory
} from '@/types';

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Project Initiation Template",
  "Document Request List",
  "Document Review Worksheet",
  "Stakeholder Mapping",
  "Stakeholder Interview",
  "Business Process Identification",
  "Process Mapping",
  "BIA Questionnaire",
  "BIA Worksheet",
  "Dependency Assessment",
  "Resource Requirement",
  "Application Criticality",
  "Vendor Criticality",
  "Facility Criticality",
  "Business Continuity Risk Assessment",
  "Workshop Validation",
  "Gap Assessment",
  "Issue Register",
  "Action Plan",
  "Meeting Minutes",
  "Consultant Working Paper",
  "Management Interview",
  "BIA Consolidation",
  "Management Report",
  "BCM Strategy Worksheet",
  "BCP Worksheet",
  "Exercise / Testing Worksheet"
];

export const INITIAL_TEMPLATES: WorkingTemplate[] = [
  {
    "id": "TMP-01",
    "code": "TPL-BCM-PIT-01",
    "name": "Project Initiation Template",
    "category": "Project Initiation Template",
    "description": "Enterprise standard working template for Project Initiation Template compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "GLOBAL",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 14,
    "isDefault": true,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-0-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-0-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-0-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-0-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-0-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-0-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-0-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-0-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-0-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-0-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-0-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-0-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-0-1",
        "targetFieldId": "fld-0-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-0-1",
        "sourceFieldId": "fld-0-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-0-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-02",
    "code": "TPL-BCM-DRL-02",
    "name": "Document Request List",
    "category": "Document Request List",
    "description": "Template standar enterprise untuk daftar permintaan dan pengumpulan dokumen/data pendukung BCM (struktur organisasi, profil risiko, daftar aplikasi/sistem TI, kebijakan & prosedur, dan data operasional), beserta pelacakan status pengumpulan dan telaah kelengkapan (completeness review) oleh konsultan, sesuai ISO 22301:2019.",
    "framework": "ISO 22301:2019",
    "industry": "Banking & Financial Services",
    "scope": "INDUSTRY",
    "version": "2.0.0",
    "status": "Approved",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-06-10T10:00:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 16,
    "isDefault": true,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      },
      {
        "version": "2.0.0",
        "changedAt": "2024-06-10T10:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Penyempurnaan menyeluruh menjadi template Document Request List substantif: menambahkan section Identifikasi Kebutuhan Dokumen (mencakup kategori Struktur Organisasi, Profil Risiko, Daftar Aplikasi/Sistem TI, Kebijakan & Prosedur, Data Operasional, BCM/BCP Eksisting), Status Pengumpulan & Kelengkapan, serta Telaah & Temuan Konsultan. Menghapus formula/aturan kondisional lama yang tidak relevan (frm-1-1, cnd-1-1) dan menggantinya dengan aturan kondisional baru terkait status pengumpulan tidak lengkap/perlu klarifikasi dan sifat wajib dokumen.",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-1-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-1-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-1-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-1-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-1-4",
        "title": "Identifikasi Kebutuhan Dokumen",
        "description": "Rincian dokumen/data yang diminta dari unit kerja klien beserta cakupan dan penanggung jawab pemenuhannya",
        "order": 2,
        "fields": [
          {
            "id": "fld-1-10",
            "name": "document_title",
            "label": "Nama / Judul Dokumen yang Diminta",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Daftar Inventaris Aplikasi & Kekritisan Sistem TI",
            "displayOrder": 1
          },
          {
            "id": "fld-1-11",
            "name": "document_category",
            "label": "Kategori Dokumen",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Struktur Organisasi",
              "Profil Risiko",
              "Daftar Aplikasi/Sistem TI",
              "Kebijakan & Prosedur",
              "Data Operasional",
              "BCM/BCP Eksisting",
              "Lainnya"
            ]
          },
          {
            "id": "fld-1-12",
            "name": "document_description",
            "label": "Deskripsi / Cakupan Dokumen yang Diminta",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-1-13",
            "name": "responsible_unit_pic",
            "label": "Unit / PIC Penanggung Jawab Pemenuhan",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Divisi IT Infrastructure - Fajar Nugraha",
            "displayOrder": 4
          },
          {
            "id": "fld-1-14",
            "name": "mandatory_status",
            "label": "Sifat Dokumen",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 5,
            "options": [
              "Wajib",
              "Opsional"
            ]
          },
          {
            "id": "fld-1-15",
            "name": "confidentiality_level",
            "label": "Tingkat Kerahasiaan",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 6,
            "options": [
              "Public",
              "Internal",
              "Confidential",
              "Restricted"
            ]
          },
          {
            "id": "fld-1-16",
            "name": "target_collection_date",
            "label": "Target Tanggal Pengumpulan",
            "dataType": "Date",
            "mandatory": false,
            "helpText": "Wajib diisi apabila Sifat Dokumen = Wajib",
            "displayOrder": 7
          }
        ]
      },
      {
        "id": "sec-1-5",
        "title": "Status Pengumpulan & Kelengkapan",
        "description": "Pelacakan status pengumpulan dokumen beserta bukti unggah dan persentase kelengkapannya",
        "order": 3,
        "fields": [
          {
            "id": "fld-1-17",
            "name": "collection_status",
            "label": "Status Pengumpulan",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Belum Diminta",
              "Diminta",
              "Dalam Proses",
              "Diserahkan",
              "Sedang Ditelaah",
              "Tidak Lengkap",
              "Perlu Klarifikasi",
              "Diterima",
              "Kadaluarsa/Perlu Update",
              "Ditutup"
            ]
          },
          {
            "id": "fld-1-18",
            "name": "document_version",
            "label": "Versi Dokumen",
            "dataType": "Text Input",
            "mandatory": false,
            "placeholder": "1.0",
            "displayOrder": 2
          },
          {
            "id": "fld-1-19",
            "name": "uploaded_file_name",
            "label": "Bukti File yang Diunggah",
            "dataType": "Evidence",
            "mandatory": false,
            "displayOrder": 3
          },
          {
            "id": "fld-1-20",
            "name": "upload_date",
            "label": "Tanggal Unggah",
            "dataType": "Date",
            "mandatory": false,
            "displayOrder": 4
          },
          {
            "id": "fld-1-21",
            "name": "completeness_percentage",
            "label": "Persentase Kelengkapan",
            "dataType": "Percentage",
            "mandatory": false,
            "minimum": 0,
            "maximum": 100,
            "displayOrder": 5
          }
        ]
      },
      {
        "id": "sec-1-6",
        "title": "Telaah & Temuan Konsultan",
        "description": "Hasil telaah kelengkapan dan relevansi dokumen oleh konsultan BCM beserta temuan dan tindak lanjutnya",
        "order": 4,
        "fields": [
          {
            "id": "fld-1-22",
            "name": "document_relevance",
            "label": "Relevansi Dokumen",
            "dataType": "Dropdown",
            "mandatory": false,
            "displayOrder": 1,
            "options": [
              "High",
              "Medium",
              "Low"
            ]
          },
          {
            "id": "fld-1-23",
            "name": "key_findings",
            "label": "Temuan Utama",
            "dataType": "Long Text",
            "mandatory": false,
            "displayOrder": 2
          },
          {
            "id": "fld-1-24",
            "name": "gap_identified",
            "label": "Gap / Kekurangan yang Teridentifikasi",
            "dataType": "Long Text",
            "mandatory": false,
            "displayOrder": 3
          },
          {
            "id": "fld-1-25",
            "name": "follow_up_required",
            "label": "Tindak Lanjut yang Diperlukan",
            "dataType": "Long Text",
            "mandatory": false,
            "helpText": "Wajib diisi apabila Status Pengumpulan = Tidak Lengkap atau Perlu Klarifikasi",
            "displayOrder": 4
          },
          {
            "id": "fld-1-26",
            "name": "reviewer_name",
            "label": "Nama Reviewer",
            "dataType": "Text Input",
            "mandatory": false,
            "displayOrder": 5
          },
          {
            "id": "fld-1-27",
            "name": "review_date",
            "label": "Tanggal Telaah",
            "dataType": "Date",
            "mandatory": false,
            "displayOrder": 6
          }
        ]
      },
      {
        "id": "sec-1-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 5,
        "fields": [
          {
            "id": "fld-1-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-1-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [],
    "conditionalRules": [
      {
        "id": "cnd-1-2",
        "sourceFieldId": "fld-1-17",
        "operator": "EQUALS",
        "value": "Tidak Lengkap",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-1-25"
        ]
      },
      {
        "id": "cnd-1-3",
        "sourceFieldId": "fld-1-17",
        "operator": "EQUALS",
        "value": "Perlu Klarifikasi",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-1-25"
        ]
      },
      {
        "id": "cnd-1-4",
        "sourceFieldId": "fld-1-14",
        "operator": "EQUALS",
        "value": "Wajib",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-1-16"
        ]
      }
    ]
  },
  {
    "id": "TMP-03",
    "code": "TPL-BCM-DRW-03",
    "name": "Document Review Worksheet",
    "category": "Document Review Worksheet",
    "description": "Enterprise standard working template for Document Review Worksheet compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "CLIENT",
    "version": "1.2.0",
    "status": "Approved",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 18,
    "isDefault": true,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-2-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-2-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-2-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-2-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-2-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-2-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-2-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-2-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-2-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-2-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-2-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-2-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-2-1",
        "targetFieldId": "fld-2-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-2-1",
        "sourceFieldId": "fld-2-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-2-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-04",
    "code": "TPL-BCM-SM-04",
    "name": "Stakeholder Mapping",
    "category": "Stakeholder Mapping",
    "description": "Template standar enterprise untuk identifikasi dan pemetaan pemangku kepentingan (stakeholder) BCM internal maupun eksternal, mencakup penilaian tingkat pengaruh (power/influence) dan keterlibatan (interest), pemetaan kuadran engagement (Manage Closely/Keep Satisfied/Keep Informed/Monitor), serta strategi keterlibatan dan komunikasi, sesuai ISO 22301:2019 klausul 4.2 (Understanding the Needs and Expectations of Interested Parties).",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "PROJECT",
    "version": "2.0.0",
    "status": "Approved",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-06-10T10:00:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 20,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      },
      {
        "version": "2.0.0",
        "changedAt": "2024-06-10T10:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Penyempurnaan menyeluruh menjadi template Stakeholder Mapping substantif sesuai ISO 22301:2019 klausul 4.2: menambahkan section Identifikasi Stakeholder (internal/eksternal beserta jenis pihak eksternal), Penilaian Pengaruh & Keterlibatan (power/interest dengan kalkulasi skor dan kuadran engagement otomatis), serta Strategi Keterlibatan & Komunikasi. Menghapus formula/aturan kondisional lama yang tidak relevan (frm-3-1, cnd-3-1) dan menggantinya dengan formula skor engagement serta aturan kondisional baru terkait kategori eksternal dan status responden BIA.",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-3-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-3-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-3-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-3-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-3-10",
            "name": "mapping_officer_name",
            "label": "Nama Petugas Pemetaan / Fasilitator",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Nama lengkap konsultan fasilitator pemetaan stakeholder",
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-3-4",
        "title": "Identifikasi Stakeholder",
        "description": "Identifikasi pemangku kepentingan BCM baik internal maupun eksternal beserta data kontak dan perannya",
        "order": 2,
        "fields": [
          {
            "id": "fld-3-11",
            "name": "stakeholder_name",
            "label": "Nama Stakeholder",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Nama lengkap beserta gelar",
            "displayOrder": 1
          },
          {
            "id": "fld-3-12",
            "name": "stakeholder_organization",
            "label": "Organisasi / Unit Kerja",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Divisi Settlement & Kliring / PT Vendor ABC",
            "displayOrder": 2
          },
          {
            "id": "fld-3-13",
            "name": "stakeholder_position",
            "label": "Jabatan / Peran",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Head of Settlement & Clearing",
            "displayOrder": 3
          },
          {
            "id": "fld-3-14",
            "name": "stakeholder_category",
            "label": "Kategori Stakeholder",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 4,
            "options": [
              "Internal",
              "Eksternal"
            ]
          },
          {
            "id": "fld-3-15",
            "name": "external_party_type",
            "label": "Jenis Pihak Eksternal",
            "dataType": "Dropdown",
            "mandatory": false,
            "helpText": "Wajib diisi apabila Kategori Stakeholder = Eksternal",
            "displayOrder": 5,
            "options": [
              "Regulator/Otoritas",
              "Vendor/Penyedia Jasa Kritis",
              "Pelanggan/Nasabah",
              "Mitra Bisnis",
              "Media/Publik",
              "Lainnya"
            ]
          },
          {
            "id": "fld-3-16",
            "name": "stakeholder_email",
            "label": "Alamat Email",
            "dataType": "Text Input",
            "mandatory": false,
            "placeholder": "nama@organisasi.co.id",
            "displayOrder": 6
          },
          {
            "id": "fld-3-17",
            "name": "stakeholder_phone",
            "label": "Nomor Telepon / WhatsApp",
            "dataType": "Text Input",
            "mandatory": false,
            "placeholder": "+62 812-3456-7890",
            "displayOrder": 7
          },
          {
            "id": "fld-3-18",
            "name": "bcm_structure_role",
            "label": "Peran dalam Struktur BCM",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 8,
            "options": [
              "Process Owner",
              "BCM Coordinator",
              "Crisis Management Team",
              "Business Recovery Team",
              "IT DR Lead",
              "Executive Sponsor",
              "Risk & Compliance Assessor",
              "External Regulator/Key Vendor"
            ]
          }
        ]
      },
      {
        "id": "sec-3-5",
        "title": "Penilaian Pengaruh & Keterlibatan",
        "description": "Penilaian tingkat pengaruh (power) dan kepentingan (interest) stakeholder untuk menentukan kuadran engagement",
        "order": 3,
        "fields": [
          {
            "id": "fld-3-19",
            "name": "power_influence_level",
            "label": "Tingkat Pengaruh / Power",
            "dataType": "Rating",
            "mandatory": true,
            "minimum": 1,
            "maximum": 5,
            "helpText": "1 = Sangat Rendah, 5 = Sangat Tinggi",
            "displayOrder": 1
          },
          {
            "id": "fld-3-20",
            "name": "interest_level",
            "label": "Tingkat Kepentingan / Interest",
            "dataType": "Score",
            "mandatory": true,
            "minimum": 1,
            "maximum": 5,
            "helpText": "1 = Sangat Rendah, 5 = Sangat Tinggi",
            "displayOrder": 2
          },
          {
            "id": "fld-3-21",
            "name": "decision_authority",
            "label": "Kewenangan Pengambilan Keputusan",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 3,
            "options": [
              "Strategic",
              "Tactical",
              "Operational"
            ]
          },
          {
            "id": "fld-3-22",
            "name": "engagement_score",
            "label": "Skor Gabungan Power x Interest",
            "dataType": "Calculated Field",
            "mandatory": false,
            "readOnly": true,
            "formulaExpression": "power_influence_level * interest_level",
            "helpText": "Dihitung otomatis dari perkalian Tingkat Pengaruh x Tingkat Kepentingan (rentang 1-25)",
            "displayOrder": 4
          },
          {
            "id": "fld-3-23",
            "name": "engagement_quadrant",
            "label": "Kuadran Hasil Pemetaan",
            "dataType": "Read-only Field",
            "mandatory": false,
            "readOnly": true,
            "helpText": "Diturunkan otomatis: Power & Interest >= 4 = Manage Closely, Power >= 4 & Interest < 4 = Keep Satisfied, Power < 4 & Interest >= 4 = Keep Informed, selain itu = Monitor",
            "displayOrder": 5
          },
          {
            "id": "fld-3-24",
            "name": "recommended_bia_respondent",
            "label": "Direkomendasikan sebagai Responden BIA Kritis?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 6
          }
        ]
      },
      {
        "id": "sec-3-6",
        "title": "Strategi Keterlibatan & Komunikasi",
        "description": "Penyusunan pendekatan komunikasi dan keterlibatan yang sesuai dengan kuadran engagement stakeholder",
        "order": 4,
        "fields": [
          {
            "id": "fld-3-25",
            "name": "communication_strategy",
            "label": "Strategi / Pendekatan Komunikasi",
            "dataType": "Long Text",
            "mandatory": true,
            "helpText": "Jelaskan pendekatan keterlibatan yang sesuai dengan kuadran stakeholder (mis. konsultasi intensif untuk Manage Closely)",
            "displayOrder": 1
          },
          {
            "id": "fld-3-26",
            "name": "communication_frequency",
            "label": "Frekuensi Komunikasi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Real-time/Insidental",
              "Mingguan",
              "Bulanan",
              "Triwulanan",
              "Tahunan"
            ]
          },
          {
            "id": "fld-3-27",
            "name": "communication_method",
            "label": "Metode Komunikasi",
            "dataType": "Multi Select",
            "mandatory": true,
            "displayOrder": 3,
            "options": [
              "Rapat Tatap Muka",
              "Email",
              "Video Conference",
              "Laporan Tertulis",
              "Portal/Dashboard Online",
              "Panggilan Darurat/Call Tree"
            ]
          },
          {
            "id": "fld-3-28",
            "name": "internal_liaison_pic",
            "label": "PIC Internal Penghubung",
            "dataType": "Text Input",
            "mandatory": false,
            "helpText": "Wajib diisi apabila stakeholder direkomendasikan sebagai responden BIA kritis",
            "displayOrder": 4
          },
          {
            "id": "fld-3-29",
            "name": "engagement_risk_notes",
            "label": "Catatan Risiko Keterlibatan / Kekhawatiran Khusus",
            "dataType": "Long Text",
            "mandatory": false,
            "displayOrder": 5
          }
        ]
      },
      {
        "id": "sec-3-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 5,
        "fields": [
          {
            "id": "fld-3-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-3-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          },
          {
            "id": "fld-3-30",
            "name": "bcm_coordinator_approval",
            "label": "Tanda Tangan / Persetujuan BCM Coordinator",
            "dataType": "Signature",
            "mandatory": true,
            "helpText": "Persetujuan BCM Coordinator klien atas hasil identifikasi dan pemetaan stakeholder",
            "displayOrder": 3
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-3-2",
        "targetFieldId": "fld-3-22",
        "formulaExpression": "power_influence_level * interest_level",
        "variables": [
          "power_influence_level",
          "interest_level"
        ],
        "description": "Perhitungan skor gabungan power x interest sebagai dasar penentuan kuadran engagement stakeholder"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-3-2",
        "sourceFieldId": "fld-3-14",
        "operator": "EQUALS",
        "value": "Eksternal",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-3-15"
        ]
      },
      {
        "id": "cnd-3-3",
        "sourceFieldId": "fld-3-24",
        "operator": "EQUALS",
        "value": "Yes",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-3-28"
        ]
      }
    ]
  },
  {
    "id": "TMP-05",
    "code": "TPL-BCM-SI-05",
    "name": "Stakeholder Interview",
    "category": "Stakeholder Interview",
    "description": "Enterprise standard working template for Stakeholder Interview compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "GLOBAL",
    "version": "1.2.0",
    "status": "Approved",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 22,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-4-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-4-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-4-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-4-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-4-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-4-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-4-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-4-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-4-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-4-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-4-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-4-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-4-1",
        "targetFieldId": "fld-4-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-4-1",
        "sourceFieldId": "fld-4-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-4-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-06",
    "code": "TPL-BCM-BPI-06",
    "name": "Business Process Identification",
    "category": "Business Process Identification",
    "description": "Template standar enterprise untuk penyusunan daftar awal (initial inventory) proses bisnis utama per unit kerja sebagai basis pelaksanaan Business Impact Analysis (BIA), mencakup identifikasi pemilik proses, alur input-proses-output, volume & nilai transaksi, serta indikasi kekritisan awal, sesuai ISO 22301:2019 dan ISO 22317:2021 (Business Impact Analysis Guidance).",
    "framework": "ISO 22301:2019",
    "industry": "Banking & Financial Services",
    "scope": "INDUSTRY",
    "version": "2.0.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-06-10T10:00:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 24,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      },
      {
        "version": "2.0.0",
        "changedAt": "2024-06-10T10:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Penyempurnaan menyeluruh menjadi template Business Process Identification substantif selaras dengan Module Business Process Register: menambahkan section Identifikasi Proses Bisnis, Karakteristik Operasional, dan Indikasi Kekritisan Awal & Kesiapan BIA. Menghapus formula/aturan kondisional lama yang tidak relevan (frm-5-1, cnd-5-1) dan menggantinya dengan aturan kondisional baru terkait ketersediaan manual workaround dan indikasi kekritisan awal Mission Critical.",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-5-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-5-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-5-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-5-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-5-4",
        "title": "Identifikasi Proses Bisnis",
        "description": "Identifikasi dasar proses bisnis, kepemilikan, dan tujuan proses sebagai entri awal register proses bisnis",
        "order": 2,
        "fields": [
          {
            "id": "fld-5-10",
            "name": "process_name",
            "label": "Nama Proses Bisnis",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Pemrosesan Transaksi Settlement RTGS & BI-FAST",
            "displayOrder": 1
          },
          {
            "id": "fld-5-11",
            "name": "owning_unit",
            "label": "Unit Kerja / Divisi Pemilik",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Divisi Settlement & Kliring Pembayaran",
              "Divisi IT Infrastructure & Core Operations",
              "Divisi Treasury & Global Markets",
              "Divisi Manajemen Risiko & BCM",
              "Divisi Sumber Daya Manusia & Umum (HRGA)",
              "Lainnya"
            ]
          },
          {
            "id": "fld-5-12",
            "name": "process_hierarchy_level",
            "label": "Level Hierarki Proses",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 3,
            "options": [
              "Level 0 - Enterprise",
              "Level 1 - Business Function",
              "Level 2 - Business Process",
              "Level 3 - Sub-Process/Activity",
              "Level 4 - Task"
            ]
          },
          {
            "id": "fld-5-13",
            "name": "process_owner_name",
            "label": "Nama Pemilik Proses (Process Owner)",
            "dataType": "Text Input",
            "mandatory": true,
            "displayOrder": 4
          },
          {
            "id": "fld-5-14",
            "name": "process_description",
            "label": "Deskripsi Singkat Aktivitas",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 5
          },
          {
            "id": "fld-5-15",
            "name": "process_objective",
            "label": "Tujuan / Objective Proses",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 6
          },
          {
            "id": "fld-5-16",
            "name": "product_service",
            "label": "Produk / Layanan yang Dihasilkan",
            "dataType": "Text Input",
            "mandatory": false,
            "displayOrder": 7
          },
          {
            "id": "fld-5-17",
            "name": "customers",
            "label": "Pelanggan / Penerima Layanan",
            "dataType": "Text Input",
            "mandatory": false,
            "displayOrder": 8
          }
        ]
      },
      {
        "id": "sec-5-5",
        "title": "Karakteristik Operasional",
        "description": "Alur input-proses-output beserta parameter operasional, volume, dan nilai finansial proses bisnis",
        "order": 3,
        "fields": [
          {
            "id": "fld-5-18",
            "name": "key_inputs",
            "label": "Input Utama Proses",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-5-19",
            "name": "key_activities",
            "label": "Aktivitas Kunci (Key Activities)",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 2
          },
          {
            "id": "fld-5-20",
            "name": "key_outputs",
            "label": "Output Utama",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-5-21",
            "name": "frequency",
            "label": "Frekuensi Pelaksanaan",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 4,
            "options": [
              "Real-time/Kontinu",
              "Harian",
              "Mingguan",
              "Bulanan",
              "Triwulanan",
              "Tahunan",
              "Insidental"
            ]
          },
          {
            "id": "fld-5-22",
            "name": "operating_hours",
            "label": "Jam Operasional",
            "dataType": "Text Input",
            "mandatory": false,
            "placeholder": "08:00 - 17:00 WIB",
            "displayOrder": 5
          },
          {
            "id": "fld-5-23",
            "name": "peak_period",
            "label": "Periode Puncak (Peak Period)",
            "dataType": "Text Input",
            "mandatory": false,
            "displayOrder": 6
          },
          {
            "id": "fld-5-24",
            "name": "transaction_volume",
            "label": "Volume Transaksi",
            "dataType": "Text Input",
            "mandatory": false,
            "placeholder": "450.000 transaksi/hari",
            "displayOrder": 7
          },
          {
            "id": "fld-5-25",
            "name": "financial_value",
            "label": "Nilai Finansial per Hari/Bulan (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 8
          },
          {
            "id": "fld-5-26",
            "name": "sla_requirement",
            "label": "Persyaratan SLA",
            "dataType": "Long Text",
            "mandatory": false,
            "displayOrder": 9
          },
          {
            "id": "fld-5-27",
            "name": "regulatory_requirement",
            "label": "Persyaratan Regulasi Terkait",
            "dataType": "Long Text",
            "mandatory": false,
            "displayOrder": 10
          }
        ]
      },
      {
        "id": "sec-5-6",
        "title": "Indikasi Kekritisan Awal & Kesiapan BIA",
        "description": "Penilaian awal kekritisan proses dan kesiapan data pendukung sebelum pelaksanaan BIA formal",
        "order": 4,
        "fields": [
          {
            "id": "fld-5-28",
            "name": "manual_workaround_available",
            "label": "Ketersediaan Manual Workaround",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-5-29",
            "name": "manual_workaround_description",
            "label": "Keterangan Manual Workaround",
            "dataType": "Long Text",
            "mandatory": false,
            "helpText": "Wajib diisi apabila Ketersediaan Manual Workaround = Tidak, untuk menjelaskan justifikasi/mitigasi sementara",
            "displayOrder": 2
          },
          {
            "id": "fld-5-30",
            "name": "existing_bcp_available",
            "label": "Ketersediaan BCP Eksisting",
            "dataType": "Yes / No",
            "mandatory": false,
            "helpText": "Wajib diisi apabila Indikasi Kekritisan Awal = Mission Critical",
            "displayOrder": 3
          },
          {
            "id": "fld-5-31",
            "name": "existing_bcp_reference",
            "label": "Referensi Dokumen BCP Eksisting",
            "dataType": "Text Input",
            "mandatory": false,
            "placeholder": "BCP Divisi Settlement 2023 v2.1",
            "displayOrder": 4
          },
          {
            "id": "fld-5-32",
            "name": "initial_criticality_indication",
            "label": "Indikasi Kekritisan Awal",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 5,
            "options": [
              "Mission Critical",
              "Business Critical",
              "Non-Critical"
            ]
          },
          {
            "id": "fld-5-33",
            "name": "bia_readiness_status",
            "label": "Status Kesiapan untuk BIA",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 6,
            "options": [
              "Identified",
              "Ready for BIA",
              "In Assessment",
              "Validated",
              "Approved"
            ]
          },
          {
            "id": "fld-5-34",
            "name": "spof_indication",
            "label": "Indikasi Single Point of Failure (SPOF)",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 7
          }
        ]
      },
      {
        "id": "sec-5-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 5,
        "fields": [
          {
            "id": "fld-5-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-5-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [],
    "conditionalRules": [
      {
        "id": "cnd-5-2",
        "sourceFieldId": "fld-5-28",
        "operator": "EQUALS",
        "value": "No",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-5-29"
        ]
      },
      {
        "id": "cnd-5-3",
        "sourceFieldId": "fld-5-32",
        "operator": "EQUALS",
        "value": "Mission Critical",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-5-30"
        ]
      }
    ]
  },
  {
    "id": "TMP-07",
    "code": "TPL-BCM-PM-07",
    "name": "Process Mapping",
    "category": "Process Mapping",
    "description": "Enterprise standard working template for Process Mapping compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "CLIENT",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 26,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-6-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-6-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-6-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-6-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-6-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-6-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-6-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-6-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-6-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-6-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-6-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-6-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-6-1",
        "targetFieldId": "fld-6-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-6-1",
        "sourceFieldId": "fld-6-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-6-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-08",
    "code": "TPL-BCM-BIA-08",
    "name": "BIA Questionnaire",
    "category": "BIA Questionnaire",
    "description": "Enterprise standard working template for BIA Questionnaire compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "PROJECT",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 28,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-7-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-7-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-7-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-7-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-7-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-7-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-7-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-7-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-7-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-7-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-7-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-7-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-7-1",
        "targetFieldId": "fld-7-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-7-1",
        "sourceFieldId": "fld-7-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-7-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-09",
    "code": "TPL-BCM-BIA-09",
    "name": "BIA Worksheet",
    "category": "BIA Worksheet",
    "description": "Enterprise standard working template for BIA Worksheet compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "GLOBAL",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 30,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-8-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-8-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-8-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-8-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-8-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-8-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-8-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-8-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-8-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-8-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-8-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-8-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-8-1",
        "targetFieldId": "fld-8-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-8-1",
        "sourceFieldId": "fld-8-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-8-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-10",
    "code": "TPL-BCM-DA-10",
    "name": "Dependency Assessment",
    "category": "Dependency Assessment",
    "description": "Enterprise standard working template for Dependency Assessment compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "Banking & Financial Services",
    "scope": "INDUSTRY",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 32,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-9-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-9-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-9-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-9-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-9-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-9-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-9-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-9-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-9-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-9-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-9-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-9-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-9-1",
        "targetFieldId": "fld-9-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-9-1",
        "sourceFieldId": "fld-9-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-9-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-11",
    "code": "TPL-BCM-RR-11",
    "name": "Resource Requirement",
    "category": "Resource Requirement",
    "description": "Enterprise standard working template for Resource Requirement compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "CLIENT",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 34,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-10-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-10-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-10-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-10-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-10-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-10-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-10-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-10-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-10-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-10-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-10-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-10-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-10-1",
        "targetFieldId": "fld-10-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-10-1",
        "sourceFieldId": "fld-10-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-10-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-12",
    "code": "TPL-BCM-AC-12",
    "name": "Application Criticality",
    "category": "Application Criticality",
    "description": "Enterprise standard working template for Application Criticality compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "PROJECT",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 36,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-11-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-11-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-11-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-11-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-11-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-11-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-11-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-11-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-11-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-11-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-11-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-11-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-11-1",
        "targetFieldId": "fld-11-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-11-1",
        "sourceFieldId": "fld-11-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-11-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-13",
    "code": "TPL-BCM-VC-13",
    "name": "Vendor Criticality",
    "category": "Vendor Criticality",
    "description": "Enterprise standard working template for Vendor Criticality compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "GLOBAL",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 38,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-12-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-12-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-12-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-12-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-12-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-12-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-12-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-12-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-12-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-12-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-12-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-12-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-12-1",
        "targetFieldId": "fld-12-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-12-1",
        "sourceFieldId": "fld-12-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-12-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-14",
    "code": "TPL-BCM-FC-14",
    "name": "Facility Criticality",
    "category": "Facility Criticality",
    "description": "Enterprise standard working template for Facility Criticality compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "Banking & Financial Services",
    "scope": "INDUSTRY",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 40,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-13-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-13-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-13-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-13-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-13-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-13-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-13-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-13-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-13-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-13-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-13-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-13-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-13-1",
        "targetFieldId": "fld-13-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-13-1",
        "sourceFieldId": "fld-13-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-13-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-15",
    "code": "TPL-BCM-RA-15",
    "name": "Business Continuity Risk Assessment",
    "category": "Business Continuity Risk Assessment",
    "description": "Template standar enterprise untuk pelaksanaan Business Continuity Risk Assessment sesuai ISO 22301:2019 dan regulasi OJK, mencakup empat komponen inti: identifikasi risiko kontinuitas bisnis, penilaian efektivitas kontrol yang telah ada (existing control assessment), penyusunan strategi mitigasi, serta rencana pemulihan awal (initial recovery plan) untuk setiap risiko yang teridentifikasi.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "CLIENT",
    "version": "2.0.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-06-10T10:00:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 42,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      },
      {
        "version": "2.0.0",
        "changedAt": "2024-06-10T10:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Penyempurnaan menyeluruh menjadi Business Continuity Risk Assessment: menambahkan empat komponen inti metodologi ISO 22301:2019 - (1) Identifikasi Risiko dengan penilaian likelihood/impact inheren, (2) Existing Control Assessment dengan penilaian efektivitas desain & operasi kontrol serta risiko residual, (3) Strategi Mitigasi dengan opsi penanganan risiko dan rencana aksi, dan (4) Rencana Pemulihan Awal yang terhubung dengan BCP/DRP. Menambahkan formula kalkulasi skor risiko inheren dan residual beserta aturan kondisional terkait eskalasi risiko tinggi/kritikal.",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-14-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-14-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-14-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-14-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-14-10",
            "name": "assessor_name",
            "label": "Nama Asesor / Konsultan Pelaksana",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Nama lengkap asesor risiko",
            "displayOrder": 4
          },
          {
            "id": "fld-14-11",
            "name": "affected_process_name",
            "label": "Nama Proses Bisnis / Unit Utama Terdampak",
            "dataType": "Text Input",
            "mandatory": true,
            "helpText": "Proses bisnis atau unit kerja utama yang menjadi objek asesmen risiko kontinuitas ini",
            "placeholder": "Layanan Kliring dan Settlement Antar Bank",
            "displayOrder": 5
          }
        ]
      },
      {
        "id": "sec-14-4",
        "title": "Identifikasi Risiko",
        "description": "Identifikasi risiko kontinuitas bisnis beserta penilaian likelihood dan impact inheren (sebelum mempertimbangkan kontrol yang ada)",
        "order": 2,
        "fields": [
          {
            "id": "fld-14-12",
            "name": "risk_category",
            "label": "Kategori Risiko",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Operasional",
              "Teknologi Informasi/Siber",
              "Sumber Daya Manusia",
              "Bencana Alam",
              "Pemasok/Vendor Pihak Ketiga",
              "Regulasi/Kepatuhan",
              "Reputasi",
              "Keuangan",
              "Keamanan Fisik"
            ]
          },
          {
            "id": "fld-14-13",
            "name": "risk_description",
            "label": "Deskripsi Risiko",
            "dataType": "Long Text",
            "mandatory": true,
            "helpText": "Jelaskan peristiwa risiko yang dapat mengganggu kontinuitas proses bisnis secara spesifik",
            "displayOrder": 2
          },
          {
            "id": "fld-14-14",
            "name": "risk_source_cause",
            "label": "Penyebab / Sumber Ancaman",
            "dataType": "Long Text",
            "mandatory": true,
            "helpText": "Identifikasi akar penyebab atau sumber ancaman yang memicu terjadinya risiko",
            "displayOrder": 3
          },
          {
            "id": "fld-14-15",
            "name": "affected_business_process",
            "label": "Proses Bisnis Terdampak",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Rekonsiliasi Transaksi Harian",
            "displayOrder": 4
          },
          {
            "id": "fld-14-16",
            "name": "impact_area",
            "label": "Area Dampak Potensial",
            "dataType": "Multi Select",
            "mandatory": true,
            "displayOrder": 5,
            "options": [
              "Finansial",
              "Operasional",
              "Reputasi",
              "Legal/Regulasi",
              "Pelanggan"
            ]
          },
          {
            "id": "fld-14-17",
            "name": "inherent_likelihood",
            "label": "Likelihood Inheren",
            "dataType": "Rating",
            "mandatory": true,
            "minimum": 1,
            "maximum": 5,
            "helpText": "1 = Sangat Jarang Terjadi, 5 = Hampir Pasti Terjadi",
            "displayOrder": 6
          },
          {
            "id": "fld-14-18",
            "name": "inherent_impact",
            "label": "Impact Inheren",
            "dataType": "Rating",
            "mandatory": true,
            "minimum": 1,
            "maximum": 5,
            "helpText": "1 = Dampak Sangat Minor, 5 = Dampak Sangat Katastropik",
            "displayOrder": 7
          },
          {
            "id": "fld-14-19",
            "name": "inherent_risk_score",
            "label": "Skor Risiko Inheren",
            "dataType": "Calculated Field",
            "mandatory": false,
            "readOnly": true,
            "formulaExpression": "inherent_likelihood * inherent_impact",
            "helpText": "Dihitung otomatis dari perkalian Likelihood Inheren x Impact Inheren (rentang 1-25)",
            "displayOrder": 8
          },
          {
            "id": "fld-14-20",
            "name": "inherent_risk_level",
            "label": "Level Risiko Inheren",
            "dataType": "Read-only Field",
            "mandatory": false,
            "readOnly": true,
            "helpText": "Diturunkan otomatis dari Skor Risiko Inheren: 1-4 Low, 5-9 Medium, 10-15 High, 16-25 Critical",
            "displayOrder": 9
          }
        ]
      },
      {
        "id": "sec-14-5",
        "title": "Existing Control Assessment (Penilaian Kontrol yang Ada)",
        "description": "Penilaian atas kontrol yang telah diimplementasikan untuk mengelola risiko, termasuk efektivitas desain dan operasinya, guna menghasilkan penilaian risiko residual",
        "order": 3,
        "fields": [
          {
            "id": "fld-14-21",
            "name": "existing_control_description",
            "label": "Deskripsi Kontrol yang Sudah Ada",
            "dataType": "Long Text",
            "mandatory": true,
            "helpText": "Uraikan kontrol/mitigasi eksisting yang saat ini diterapkan untuk risiko ini",
            "displayOrder": 1
          },
          {
            "id": "fld-14-22",
            "name": "control_type",
            "label": "Jenis Kontrol",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Preventive",
              "Detective",
              "Corrective",
              "Directive"
            ]
          },
          {
            "id": "fld-14-23",
            "name": "control_nature",
            "label": "Sifat Kontrol",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 3,
            "options": [
              "Manual",
              "Otomatis",
              "Hybrid"
            ]
          },
          {
            "id": "fld-14-24",
            "name": "control_design_effectiveness",
            "label": "Efektivitas Desain Kontrol",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 4,
            "options": [
              "Efektif",
              "Cukup Efektif",
              "Kurang Efektif",
              "Tidak Efektif"
            ]
          },
          {
            "id": "fld-14-25",
            "name": "control_operating_effectiveness",
            "label": "Efektivitas Operasi Kontrol",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 5,
            "options": [
              "Efektif",
              "Cukup Efektif",
              "Kurang Efektif",
              "Tidak Efektif"
            ]
          },
          {
            "id": "fld-14-26",
            "name": "control_testing_evidence",
            "label": "Bukti Pengujian Kontrol",
            "dataType": "Evidence",
            "mandatory": false,
            "helpText": "Lampirkan dokumentasi hasil pengujian/walkthrough kontrol (log sistem, hasil sampling, dsb.)",
            "displayOrder": 6
          },
          {
            "id": "fld-14-27",
            "name": "control_gap_notes",
            "label": "Catatan Gap / Kelemahan Kontrol",
            "dataType": "Long Text",
            "mandatory": false,
            "displayOrder": 7
          },
          {
            "id": "fld-14-28",
            "name": "residual_likelihood",
            "label": "Likelihood Residual",
            "dataType": "Rating",
            "mandatory": true,
            "minimum": 1,
            "maximum": 5,
            "helpText": "Likelihood setelah mempertimbangkan efektivitas kontrol yang ada",
            "displayOrder": 8
          },
          {
            "id": "fld-14-29",
            "name": "residual_impact",
            "label": "Impact Residual",
            "dataType": "Rating",
            "mandatory": true,
            "minimum": 1,
            "maximum": 5,
            "helpText": "Impact setelah mempertimbangkan efektivitas kontrol yang ada",
            "displayOrder": 9
          },
          {
            "id": "fld-14-30",
            "name": "residual_risk_score",
            "label": "Skor Risiko Residual",
            "dataType": "Calculated Field",
            "mandatory": false,
            "readOnly": true,
            "formulaExpression": "residual_likelihood * residual_impact",
            "helpText": "Dihitung otomatis dari perkalian Likelihood Residual x Impact Residual (rentang 1-25)",
            "displayOrder": 10
          },
          {
            "id": "fld-14-31",
            "name": "residual_risk_level",
            "label": "Level Risiko Residual",
            "dataType": "Read-only Field",
            "mandatory": false,
            "readOnly": true,
            "helpText": "Diturunkan otomatis dari Skor Risiko Residual: 1-4 Low, 5-9 Medium, 10-15 High, 16-25 Critical",
            "displayOrder": 11
          }
        ]
      },
      {
        "id": "sec-14-6",
        "title": "Strategi Mitigasi",
        "description": "Penentuan opsi penanganan risiko dan rencana aksi tindak lanjut untuk menurunkan risiko residual ke level yang dapat diterima",
        "order": 4,
        "fields": [
          {
            "id": "fld-14-32",
            "name": "risk_treatment_option",
            "label": "Opsi Penanganan Risiko",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mitigasi/Kurangi",
              "Hindari",
              "Transfer/Asuransi",
              "Terima"
            ]
          },
          {
            "id": "fld-14-33",
            "name": "mitigation_action_plan",
            "label": "Rencana Aksi Mitigasi",
            "dataType": "Long Text",
            "mandatory": false,
            "helpText": "Wajib diisi apabila Level Risiko Residual berada pada kategori High atau Critical",
            "displayOrder": 2
          },
          {
            "id": "fld-14-34",
            "name": "mitigation_pic",
            "label": "Penanggung Jawab / PIC",
            "dataType": "Text Input",
            "mandatory": false,
            "displayOrder": 3
          },
          {
            "id": "fld-14-35",
            "name": "mitigation_target_date",
            "label": "Target Waktu Penyelesaian",
            "dataType": "Date",
            "mandatory": false,
            "displayOrder": 4
          },
          {
            "id": "fld-14-36",
            "name": "mitigation_budget_estimate",
            "label": "Estimasi Kebutuhan Sumber Daya / Anggaran (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "150000000",
            "displayOrder": 5
          },
          {
            "id": "fld-14-37",
            "name": "mitigation_priority",
            "label": "Prioritas Tindak Lanjut",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 6,
            "options": [
              "Urgent",
              "Tinggi",
              "Sedang",
              "Rendah"
            ]
          }
        ]
      },
      {
        "id": "sec-14-7",
        "title": "Rencana Pemulihan Awal",
        "description": "Tindakan pemulihan segera (immediate response) yang perlu diaktifkan apabila risiko terjadi, sebagai jembatan menuju BCP/DRP formal",
        "order": 5,
        "fields": [
          {
            "id": "fld-14-38",
            "name": "immediate_recovery_action",
            "label": "Tindakan Pemulihan Awal / Immediate Response",
            "dataType": "Long Text",
            "mandatory": true,
            "helpText": "Langkah-langkah segera yang harus diambil pada saat risiko terjadi, sebelum aktivasi BCP formal",
            "displayOrder": 1
          },
          {
            "id": "fld-14-39",
            "name": "estimated_recovery_time",
            "label": "Estimasi Waktu Pemulihan",
            "dataType": "Number",
            "mandatory": true,
            "unit": "Jam",
            "minimum": 0,
            "helpText": "Estimasi waktu yang dibutuhkan untuk memulihkan proses ke kondisi normal minimum (dalam jam)",
            "displayOrder": 2
          },
          {
            "id": "fld-14-40",
            "name": "recovery_resource_needed",
            "label": "Sumber Daya Pemulihan yang Dibutuhkan",
            "dataType": "Long Text",
            "mandatory": true,
            "helpText": "SDM, sistem, fasilitas, atau pihak ketiga yang diperlukan untuk pemulihan",
            "displayOrder": 3
          },
          {
            "id": "fld-14-41",
            "name": "escalation_contact",
            "label": "Kontak Eskalasi",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "Nama & nomor kontak PIC eskalasi krisis",
            "displayOrder": 4
          },
          {
            "id": "fld-14-42",
            "name": "temporary_workaround",
            "label": "Workaround Sementara",
            "dataType": "Long Text",
            "mandatory": false,
            "helpText": "Solusi sementara/manual yang dapat dijalankan selagi pemulihan penuh berlangsung",
            "displayOrder": 5
          },
          {
            "id": "fld-14-43",
            "name": "linked_to_bcp_drp",
            "label": "Keterkaitan dengan BCP/DRP yang Ada",
            "dataType": "Yes / No",
            "mandatory": true,
            "helpText": "Apakah rencana pemulihan awal ini sudah tercakup/selaras dengan dokumen BCP/DRP formal yang ada?",
            "displayOrder": 6
          }
        ]
      },
      {
        "id": "sec-14-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 6,
        "fields": [
          {
            "id": "fld-14-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-14-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          },
          {
            "id": "fld-14-44",
            "name": "risk_owner_approval",
            "label": "Tanda Tangan / Persetujuan Risk Owner",
            "dataType": "Signature",
            "mandatory": true,
            "helpText": "Persetujuan dari pemilik risiko (risk owner) atas hasil identifikasi risiko dan strategi mitigasi yang diusulkan",
            "displayOrder": 3
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-14-2",
        "targetFieldId": "fld-14-19",
        "formulaExpression": "inherent_likelihood * inherent_impact",
        "variables": [
          "inherent_likelihood",
          "inherent_impact"
        ],
        "description": "Perhitungan skor risiko inheren (sebelum kontrol) dari perkalian likelihood x impact"
      },
      {
        "id": "frm-14-3",
        "targetFieldId": "fld-14-30",
        "formulaExpression": "residual_likelihood * residual_impact",
        "variables": [
          "residual_likelihood",
          "residual_impact"
        ],
        "description": "Perhitungan skor risiko residual (setelah kontrol) dari perkalian likelihood x impact"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-14-2",
        "sourceFieldId": "fld-14-31",
        "operator": "EQUALS",
        "value": "High",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-14-33",
          "fld-14-34",
          "fld-14-35"
        ]
      },
      {
        "id": "cnd-14-3",
        "sourceFieldId": "fld-14-31",
        "operator": "EQUALS",
        "value": "Critical",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-14-33",
          "fld-14-34",
          "fld-14-35"
        ]
      }
    ]
  },
  {
    "id": "TMP-16",
    "code": "TPL-BCM-WV-16",
    "name": "Workshop Validation",
    "category": "Workshop Validation",
    "description": "Enterprise standard working template for Workshop Validation compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "PROJECT",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 44,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-15-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-15-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-15-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-15-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-15-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-15-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-15-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-15-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-15-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-15-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-15-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-15-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-15-1",
        "targetFieldId": "fld-15-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-15-1",
        "sourceFieldId": "fld-15-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-15-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-17",
    "code": "TPL-BCM-GA-17",
    "name": "Gap Assessment",
    "category": "Gap Assessment",
    "description": "Enterprise standard working template for Gap Assessment compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "GLOBAL",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 46,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-16-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-16-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-16-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-16-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-16-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-16-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-16-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-16-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-16-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-16-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-16-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-16-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-16-1",
        "targetFieldId": "fld-16-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-16-1",
        "sourceFieldId": "fld-16-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-16-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-18",
    "code": "TPL-BCM-IR-18",
    "name": "Issue Register",
    "category": "Issue Register",
    "description": "Enterprise standard working template for Issue Register compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "Banking & Financial Services",
    "scope": "INDUSTRY",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 48,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-17-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-17-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-17-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-17-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-17-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-17-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-17-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-17-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-17-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-17-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-17-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-17-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-17-1",
        "targetFieldId": "fld-17-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-17-1",
        "sourceFieldId": "fld-17-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-17-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-19",
    "code": "TPL-BCM-AP-19",
    "name": "Action Plan",
    "category": "Action Plan",
    "description": "Enterprise standard working template for Action Plan compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "CLIENT",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 50,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-18-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-18-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-18-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-18-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-18-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-18-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-18-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-18-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-18-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-18-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-18-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-18-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-18-1",
        "targetFieldId": "fld-18-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-18-1",
        "sourceFieldId": "fld-18-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-18-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-20",
    "code": "TPL-BCM-MM-20",
    "name": "Meeting Minutes",
    "category": "Meeting Minutes",
    "description": "Enterprise standard working template for Meeting Minutes compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "PROJECT",
    "version": "1.2.0",
    "status": "Published",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 52,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-19-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-19-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-19-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-19-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-19-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-19-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-19-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-19-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-19-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-19-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-19-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-19-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-19-1",
        "targetFieldId": "fld-19-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-19-1",
        "sourceFieldId": "fld-19-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-19-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-21",
    "code": "TPL-BCM-CWP-21",
    "name": "Consultant Working Paper",
    "category": "Consultant Working Paper",
    "description": "Enterprise standard working template for Consultant Working Paper compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "GLOBAL",
    "version": "1.2.0",
    "status": "Review",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 54,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-20-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-20-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-20-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-20-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-20-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-20-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-20-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-20-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-20-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-20-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-20-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-20-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-20-1",
        "targetFieldId": "fld-20-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-20-1",
        "sourceFieldId": "fld-20-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-20-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-22",
    "code": "TPL-BCM-MI-22",
    "name": "Management Interview",
    "category": "Management Interview",
    "description": "Enterprise standard working template for Management Interview compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "Banking & Financial Services",
    "scope": "INDUSTRY",
    "version": "1.2.0",
    "status": "Review",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 56,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-21-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-21-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-21-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-21-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-21-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-21-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-21-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-21-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-21-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-21-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-21-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-21-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-21-1",
        "targetFieldId": "fld-21-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-21-1",
        "sourceFieldId": "fld-21-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-21-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-23",
    "code": "TPL-BCM-BIA-23",
    "name": "BIA Consolidation",
    "category": "BIA Consolidation",
    "description": "Enterprise standard working template for BIA Consolidation compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "CLIENT",
    "version": "1.2.0",
    "status": "Review",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 58,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-22-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-22-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-22-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-22-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-22-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-22-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-22-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-22-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-22-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-22-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-22-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-22-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-22-1",
        "targetFieldId": "fld-22-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-22-1",
        "sourceFieldId": "fld-22-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-22-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-24",
    "code": "TPL-BCM-MR-24",
    "name": "Management Report",
    "category": "Management Report",
    "description": "Enterprise standard working template for Management Report compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "PROJECT",
    "version": "1.2.0",
    "status": "Review",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 60,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-23-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-23-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-23-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-23-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-23-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-23-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-23-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-23-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-23-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-23-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-23-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-23-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-23-1",
        "targetFieldId": "fld-23-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-23-1",
        "sourceFieldId": "fld-23-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-23-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-25",
    "code": "TPL-BCM-BCM-25",
    "name": "BCM Strategy Worksheet",
    "category": "BCM Strategy Worksheet",
    "description": "Enterprise standard working template for BCM Strategy Worksheet compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "GLOBAL",
    "version": "1.2.0",
    "status": "Review",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 62,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-24-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-24-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-24-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-24-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-24-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-24-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-24-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-24-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-24-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-24-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-24-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-24-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-24-1",
        "targetFieldId": "fld-24-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-24-1",
        "sourceFieldId": "fld-24-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-24-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-26",
    "code": "TPL-BCM-BCP-26",
    "name": "BCP Worksheet",
    "category": "BCP Worksheet",
    "description": "Enterprise standard working template for BCP Worksheet compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "Banking & Financial Services",
    "scope": "INDUSTRY",
    "version": "1.2.0",
    "status": "Review",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 64,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-25-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-25-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-25-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-25-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-25-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-25-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-25-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-25-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-25-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-25-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-25-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-25-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-25-1",
        "targetFieldId": "fld-25-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-25-1",
        "sourceFieldId": "fld-25-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-25-6"
        ]
      }
    ]
  },
  {
    "id": "TMP-27",
    "code": "TPL-BCM-ETW-27",
    "name": "Exercise / Testing Worksheet",
    "category": "Exercise / Testing Worksheet",
    "description": "Enterprise standard working template for Exercise / Testing Worksheet compliant with ISO 22301:2019 and OJK regulations.",
    "framework": "ISO 22301:2019",
    "industry": "All Industries",
    "scope": "CLIENT",
    "version": "1.2.0",
    "status": "Review",
    "owner": "Chief BCM Consultant",
    "createdDate": "2024-01-15T08:00:00Z",
    "lastUpdated": "2024-03-01T14:30:00Z",
    "effectiveDate": "2024-01-15",
    "createdBy": "Lead BCM Consultant JMA",
    "approvedBy": "Principal Advisor",
    "usageCount": 66,
    "isDefault": false,
    "versionHistory": [
      {
        "version": "1.0.0",
        "changedAt": "2024-01-15T08:00:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Initial baseline template creation from ISO 22301 standard",
        "approvalStatus": "Published"
      },
      {
        "version": "1.2.0",
        "changedAt": "2024-03-01T14:30:00Z",
        "changedBy": "Lead Consultant",
        "changeSummary": "Updated dynamic IDR financial thresholds and regulatory compliance fields",
        "approvalStatus": "Published"
      }
    ],
    "sections": [
      {
        "id": "sec-26-1",
        "title": "Informasi Umum & Identitas Dokumen",
        "description": "Metadata awal dan ruang lingkup pelaksanaan",
        "order": 1,
        "fields": [
          {
            "id": "fld-26-1",
            "name": "project_name",
            "label": "Nama Proyek / Entitas",
            "dataType": "Text Input",
            "mandatory": true,
            "placeholder": "PT Asuransi JMA Syariah Tbk",
            "displayOrder": 1
          },
          {
            "id": "fld-26-2",
            "name": "unit_name",
            "label": "Unit Kerja / Divisi",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Direktorat Teknologi Informasi",
              "Operasional & Settlement",
              "Treasury & Pasar Modal",
              "Risk & Compliance"
            ]
          },
          {
            "id": "fld-26-3",
            "name": "assessment_date",
            "label": "Tanggal Pelaksanaan",
            "dataType": "Date",
            "mandatory": true,
            "displayOrder": 3
          }
        ]
      },
      {
        "id": "sec-26-2",
        "title": "Detail Parameter & Analisis Penilaian",
        "description": "Komponen kriteria penilaian spesifik",
        "order": 2,
        "fields": [
          {
            "id": "fld-26-4",
            "name": "criticality_level",
            "label": "Tingkat Kritikalitas Operasional",
            "dataType": "Radio",
            "mandatory": true,
            "displayOrder": 1,
            "options": [
              "Mission Critical (RTO <= 4 Jam)",
              "Business Critical (RTO 4 - 24 Jam)",
              "Non-Critical (RTO > 24 Jam)"
            ]
          },
          {
            "id": "fld-26-5",
            "name": "financial_loss_est",
            "label": "Estimasi Kerugian Finansial per Hari (IDR)",
            "dataType": "Currency",
            "mandatory": false,
            "placeholder": "500000000",
            "displayOrder": 2
          },
          {
            "id": "fld-26-6",
            "name": "justification_notes",
            "label": "Catatan Justifikasi & Bukti Pendukung",
            "dataType": "Long Text",
            "mandatory": true,
            "displayOrder": 3
          },
          {
            "id": "fld-26-7",
            "name": "has_backup_system",
            "label": "Memiliki Sistem Cadangan / DRC?",
            "dataType": "Yes / No",
            "mandatory": true,
            "displayOrder": 4
          }
        ]
      },
      {
        "id": "sec-26-3",
        "title": "Verifikasi & Tanda Tangan Konsultan",
        "description": "Persetujuan dan otorisasi hasil pengisian template",
        "order": 3,
        "fields": [
          {
            "id": "fld-26-8",
            "name": "consultant_sign",
            "label": "Tanda Tangan Lead Konsultan",
            "dataType": "Signature",
            "mandatory": true,
            "displayOrder": 1
          },
          {
            "id": "fld-26-9",
            "name": "signoff_status",
            "label": "Status Otorisasi Klien",
            "dataType": "Dropdown",
            "mandatory": true,
            "displayOrder": 2,
            "options": [
              "Disetujui Tanpa Catatan",
              "Disetujui dengan Catatan Khusus",
              "Perlu Revisi Ulang"
            ]
          }
        ]
      }
    ],
    "calculatedFormulas": [
      {
        "id": "frm-26-1",
        "targetFieldId": "fld-26-5",
        "formulaExpression": "daily_transaction_vol * avg_fee_amount",
        "variables": [
          "daily_transaction_vol",
          "avg_fee_amount"
        ],
        "description": "Perhitungan estimasi kerugian finansial otomatis"
      }
    ],
    "conditionalRules": [
      {
        "id": "cnd-26-1",
        "sourceFieldId": "fld-26-5",
        "operator": "GREATER_THAN",
        "value": "1000000000",
        "action": "REQUIRE",
        "targetFieldIds": [
          "fld-26-6"
        ]
      }
    ]
  }
];

export const INITIAL_WORKING_PAPERS: ConsultantWorkingPaper[] = [
  {
    "id": "WP-001",
    "code": "WP-BIA-001",
    "title": "Document Review Worksheet: Core Banking SLA & DR Topology",
    "objective": "Verifikasi arsitektur DR Core Banking terhadap pemenuhan ketentuan POJK 11/2022",
    "scope": "Infrastruktur Data Center Utama dan Disaster Recovery Center (Cikarang)",
    "procedurePerformed": "Review topologi jaringan, konfigurasi Oracle Data Guard, dan hasil drill DR terakhir",
    "source": "Dokumen Topologi Jaringan & Hasil Uji Coba BCP 2023",
    "evidence": "DRL-001 / Laporan Uji Coba DR Triwulan IV 2023",
    "analysis": "Replikasi data berjalan sinkron dengan latency rata-rata 5 detik. RTO arsitektur terbukti 45 menit, berada di bawah batas regulasi 2 jam.",
    "finding": "Kapasitas bandwidth failover DRC belum pernah diuji pada beban penuh (100% real transaksi nasabah).",
    "consultantConclusion": "Arsitektur memenuhi standar ISO 22301 dan POJK 11/2022, dengan catatan perlunya drill beban penuh.",
    "recommendation": "Jadwalkan full-load simulated failover test pada kuartal 2 tahun berjalan.",
    "preparedBy": "Lead BCM Consultant JMA",
    "reviewedBy": "Principal Advisor",
    "date": "2024-02-28",
    "status": "Final",
    "crossRefs": {
      "projectId": "PRJ-2024-001",
      "projectCode": "PRJ-2024-001",
      "unitId": "IT",
      "unitName": "Direktorat Teknologi Informasi",
      "processId": "PROC-01",
      "processCode": "PROC-01",
      "processName": "Sistem Kliring & Real-Time Gross Settlement (RTGS)",
      "stakeholderId": "STK-01",
      "stakeholderName": "Bambang Sudarsono (Head of IT Operations)",
      "documentId": "DRL-001",
      "documentCode": "DRL-001",
      "documentName": "Dokumen Topologi Jaringan & DRC Data Center",
      "biaId": "BIA-PROC-01",
      "biaCode": "BIA-01",
      "issueId": "ISS-001",
      "issueCode": "ISS-001"
    }
  },
  {
    "id": "WP-002",
    "code": "WP-BIA-002",
    "title": "Stakeholder Interview Note: Head of IT Operations & Infrastructure",
    "objective": "Konfirmasi ketersediaan tim tanggap darurat dan redundansi sirkuit telekomunikasi",
    "scope": "Divisi Operasional TI dan Manajemen Jaringan",
    "procedurePerformed": "Wawancara semi-terstruktur menggunakan Interview Guide Template",
    "source": "Wawancara langsung dengan Head of IT Ops",
    "evidence": "Transkrip Rekaman & Lembar Konfirmasi Wawancara INT-2024-01",
    "analysis": "Dua penyedia jasa telekomunikasi (Telkom & Indosat) tersambung via jalur fisik kabel optik yang berbeda (dual entrance).",
    "finding": "Ketergantungan tunggal pada 2 personel pemegang otorisasi token konsol root cloud.",
    "consultantConclusion": "Kesiapan infrastruktur sangat baik, namun ada SPOF kepegawaian (personnel single point of failure).",
    "recommendation": "Terapkan prinsip four-eyes dan tambah otorisasi darurat untuk 2 personel cadangan.",
    "preparedBy": "Senior BCM Consultant",
    "reviewedBy": "Lead BCM Consultant JMA",
    "date": "2024-02-20",
    "status": "Reviewed",
    "crossRefs": {
      "processId": "PROC-02",
      "processCode": "PROC-02",
      "processName": "Digital Banking Engine & Mobile App Service",
      "stakeholderId": "STK-01",
      "stakeholderName": "Bambang Sudarsono"
    }
  },
  {
    "id": "WP-003",
    "code": "WP-BIA-003",
    "title": "Dependency & SPOF Matrix: Digital Payment Gateway",
    "objective": "Mengidentifikasi ketergantungan switching pihak ketiga terhadap transaksi QRIS & Debit",
    "scope": "Gerbang pembayaran dan integrasi mitra switching",
    "procedurePerformed": "Pemetaan alur data transaksi dan analisis kontrak kerja sama mitra",
    "source": "Perjanjian Kerja Sama (PKS) Switching & Log Transaksi",
    "evidence": "Arsip Kontrak Vendor No. PKS-2022-887",
    "analysis": "Outage pada switching partner akan langsung melumpuhkan 65% volume transaksi non-tunai nasabah.",
    "finding": "Tidak ada secondary switching partner yang berstatus active-active.",
    "consultantConclusion": "Ketergantungan pihak ketiga merupakan risiko tinggi dalam BIA.",
    "recommendation": "Koneksikan switching partner cadangan dengan automated circuit routing.",
    "preparedBy": "BCM Analyst JMA",
    "reviewedBy": "Lead BCM Consultant JMA",
    "date": "2024-02-25",
    "status": "Prepared",
    "crossRefs": {
      "processId": "PROC-02",
      "processCode": "PROC-02",
      "processName": "Digital Banking Engine & Mobile App Service",
      "issueId": "ISS-002",
      "issueCode": "ISS-002"
    }
  },
  {
    "id": "WP-004",
    "code": "WP-BIA-004",
    "title": "Workaround Strategy Evaluation: Treasury Settlement Manual Batching",
    "objective": "Evaluasi prosedur manual fallback settlement ketika jalur elektronik BI terganggu",
    "scope": "Divisi Treasury Operasional",
    "procedurePerformed": "Simulasi pengisian form instruksi tertulis dan otorisasi bertingkat",
    "source": "SOP Penanganan Keadaan Darurat Treasury (SOP-TR-09)",
    "evidence": "Formulir Faksimili Otorisasi Manual BI-Net",
    "analysis": "Prosedur manual memakan waktu 45 menit per transaksi, hanya mencakup maksimal 30 transaksi per hari.",
    "finding": "Coverage workaround hanya mampu menopang 15% dari total volume harian pasar uang.",
    "consultantConclusion": "Workaround manual hanya memadai untuk transaksi prioritas tinggi (high value).",
    "recommendation": "Prioritaskan pemulihan infrastruktur BI-Net DRC dengan target RTO maksimal 1 jam.",
    "preparedBy": "Junior BCM Consultant",
    "date": "2024-02-27",
    "status": "Draft",
    "crossRefs": {
      "processId": "PROC-01",
      "processCode": "PROC-01",
      "processName": "Sistem Kliring & Real-Time Gross Settlement (RTGS)"
    }
  },
  {
    "id": "WP-005",
    "code": "WP-BIA-005",
    "title": "Resource Time-Horizon Matrix: Lokasi Kerja Darurat (DRC Cikarang)",
    "objective": "Verifikasi kelayakan fasilitas ruang kerja alternatif untuk operasional kliring dan treasury",
    "scope": "Gedung DRC Cikarang Ruang 304",
    "procedurePerformed": "Inspeksi fisik tempat duduk, workstation PC, saluran telepon, dan genset backup",
    "source": "Berita Acara Kunjungan Lokasi Kerja Alternatif",
    "evidence": "Foto dokumentasi & checklist fasilitas DRC Cikarang",
    "analysis": "Tersedia 35 unit workstation PC yang telah terpasang aplikasi BI-Net, Reuters Eikon, dan SWIFT.",
    "finding": "Pasokan genset DRC mampu beroperasi mandiri selama 72 jam penuh tanpa suplai PLN.",
    "consultantConclusion": "Fasilitas memenuhi kriteria MBCO untuk 45% operasional inti.",
    "recommendation": "Lakukan uji login berkala setiap bulan bagi petugas settlement di DRC.",
    "preparedBy": "Lead BCM Consultant JMA",
    "reviewedBy": "Principal Advisor",
    "date": "2024-03-02",
    "status": "Final",
    "crossRefs": {
      "processId": "PROC-01",
      "processCode": "PROC-01",
      "processName": "Sistem Kliring & Real-Time Gross Settlement (RTGS)",
      "stakeholderId": "STK-02",
      "stakeholderName": "Ratna Kusuma Dewi (Head of Settlement)"
    }
  }
];

export const INITIAL_INTERVIEWS: InterviewWorksheet[] = [
  {
    "id": "INT-001",
    "code": "INT-2024-01",
    "stakeholderId": "STK-01",
    "stakeholderName": "Bambang Sudarsono",
    "unitId": "IT",
    "unitName": "Direktorat Teknologi Informasi",
    "role": "Head of IT Operations & Infrastructure",
    "date": "2024-02-18",
    "interviewer": "Lead BCM Consultant JMA",
    "topics": [
      {
        "id": "top-1",
        "topic": "Arsitektur Redundansi & Failover DRC",
        "questions": [
          "Berapa waktu aktual switchover dari Data Center Utama ke DRC?",
          "Apakah ada potensi kehilangan data (RPO) saat terjadi crash mendadak?"
        ],
        "responses": "Hasil simulasi drill terakhir membutuhkan waktu 45 menit untuk database switchover. Replikasi data asynchronous dengan latency 5-8 detik.",
        "keyFindings": "RTO aktual 45 menit aman di bawah batas POJK 2 jam. RPO tercapai < 15 menit."
      },
      {
        "id": "top-2",
        "topic": "Ketergantungan Link Komunikasi & Cloud",
        "questions": [
          "Berapa provider link komunikasi yang terhubung ke Data Center?"
        ],
        "responses": "Terdapat 2 provider (Telkom & Indosat) dengan jalur fiber optik terpisah (dual entrance).",
        "keyFindings": "Redundansi jaringan telekomunikasi memadai."
      }
    ],
    "issuesIdentified": [
      "Kapasitas bandwidth failover DRC belum pernah uji beban penuh",
      "Ketergantungan tunggal pada 2 personel pemegang token root cloud"
    ],
    "processesDiscovered": [
      {
        "code": "PROC-02",
        "name": "Digital Banking Engine & Mobile App Service",
        "description": "Layanan platform mobile banking dan transaksi online nasabah ritel",
        "sla": "99.9% Uptime 24/7",
        "isCritical": true
      }
    ],
    "identifiedApps": [
      "Oracle Core DB",
      "Kubernetes Cloud Engine",
      "Cloudflare WAF"
    ],
    "identifiedVendors": [
      "PT Telkom Indonesia",
      "PT Indosat Ooredoo",
      "Amazon Web Services"
    ],
    "followUp": "Kirim dokumen hasil uji coba DR terakhir dan daftar pemegang otorisasi root.",
    "evidence": "Rekaman audio wawancara dan lembar notulensi terverifikasi STK-01",
    "status": "Completed"
  },
  {
    "id": "INT-002",
    "code": "INT-2024-02",
    "stakeholderId": "STK-02",
    "stakeholderName": "Ratna Kusuma Dewi",
    "unitId": "OPS",
    "unitName": "Operasional & Settlement",
    "role": "Head of Settlement & Clearing",
    "date": "2024-02-19",
    "interviewer": "Senior BCM Consultant",
    "topics": [
      {
        "id": "top-3",
        "topic": "Cut-off Time & Dampak Keterlambatan Kliring",
        "questions": [
          "Apa batas waktu maksimal sistem boleh terhenti sebelum melanggar cut-off BI RTGS?"
        ],
        "responses": "Maksimal 2 jam (MTPD). Jika melewati batas pukul 16:30 WIB, terjadi kegagalan settlement dan dikenakan penalti bunga pasar uang.",
        "keyFindings": "MTPD ditetapkan 2 jam, RTO wajib diset maksimal 1 jam."
      }
    ],
    "issuesIdentified": [
      "Ketergantungan pada token fisik BI-Net yang hanya dipegang 2 personel"
    ],
    "processesDiscovered": [
      {
        "code": "PROC-01",
        "name": "Sistem Kliring & Real-Time Gross Settlement (RTGS)",
        "description": "Penyelesaian transaksi pembayaran antarbank bernilai besar dan kliring nasional",
        "sla": "Cut-off settlement BI 16:30 WIB harian",
        "isCritical": true
      }
    ],
    "identifiedApps": [
      "BI-Net Gateway",
      "SWIFT Alliance",
      "Core Banking GL"
    ],
    "identifiedVendors": [
      "Bank Indonesia",
      "SWIFT SCRL"
    ],
    "followUp": "Minta data rekapitulasi volume denda keterlambatan settlement 3 tahun terakhir.",
    "evidence": "Formulir checklist wawancara ditandatangani narasumber",
    "status": "Completed"
  },
  {
    "id": "INT-003",
    "code": "INT-2024-03",
    "stakeholderId": "STK-03",
    "stakeholderName": "Hendra Gunawan",
    "unitId": "CC",
    "unitName": "Divisi Layanan Nasabah & Contact Center",
    "role": "Head of Customer Care",
    "date": "2024-02-23",
    "interviewer": "BCM Analyst JMA",
    "topics": [
      {
        "id": "top-4",
        "topic": "Kapasitas Penanganan Lonjakan Panggilan Darurat",
        "questions": [
          "Berapa lonjakan volume incoming call saat mobile banking mengalami downtime?"
        ],
        "responses": "Volume panggilan melonjak hingga 400% dalam waktu 15 menit.",
        "keyFindings": "Dibutuhkan automated IVR broadcast notification untuk menahan lonjakan agen manual."
      }
    ],
    "issuesIdentified": [
      "Agen call center belum memiliki SOP resmi komunikasi krisis saat server down"
    ],
    "processesDiscovered": [],
    "identifiedApps": [
      "Avaya Contact Center CRM",
      "WhatsApp Business API"
    ],
    "identifiedVendors": [
      "Mitra Solusi Infokom"
    ],
    "followUp": "Penyusunan draft template FAQ penanganan gangguan layanan.",
    "evidence": "Notulensi rapat via Zoom meeting",
    "status": "Draft"
  }
];

export const INITIAL_DETAILED_BIA: DetailedBiaWorksheet[] = [
  {
    "id": "BIA-PROC-01",
    "code": "BIA-2024-01",
    "projectId": "PRJ-2024-001",
    "unitId": "OPS",
    "unitName": "Operasional & Settlement",
    "processId": "PROC-01",
    "processCode": "PROC-01",
    "processName": "Sistem Kliring & Real-Time Gross Settlement (RTGS)",
    "processOwnerName": "Ratna Kusuma Dewi",
    "respondentName": "Budi Hartono (Settlement Specialist)",
    "reviewerName": "Lead BCM Consultant JMA",
    "assessmentDate": "2024-02-26",
    "templateVersion": "1.2.0",
    "assessmentStatus": "Approved",
    "validationStatus": "Passed All Validation Rules (RTO <= MTPD)",
    "approvalStatus": "Approved by Steering Committee",
    "isLocked": true,
    "currentRevision": "Rev 2.0",
    "processProfile": {
      "description": "Proses pemrosesan instruksi transfer dana nilai besar (di atas Rp 100 Juta) dan kliring warkat antar bank via gerbang BI-Net Bank Indonesia.",
      "objective": "Memastikan seluruh setelmen kewajiban antarbank terselesaikan tepat waktu sebelum batas cut-off kliring harian Bank Indonesia.",
      "productService": "RTGS, SKNBI, BI-FAST, dan Kliring Warkat",
      "customer": "Nasabah Korporat, Institusi Finansial, dan Nasabah Ritel Prioritas",
      "operatingHours": "Senin - Jumat (07:30 - 17:00 WIB)",
      "peakPeriod": "Tanggal 25 - 28 (Payroll) dan Akhir Bulan (Close Book Settlement)",
      "transactionVolume": "3.500 transaksi per hari",
      "financialValue": "IDR 4,2 Triliun per hari",
      "sla": "Setelmen per transaksi maksimal 15 menit",
      "regulatoryReq": "PADG Bank Indonesia No. 21/18/PADG/2019 dan POJK 11/2022",
      "criticalPeriod": "Pukul 14:00 - 16:30 WIB (Menjelang cut-off Bank Indonesia)"
    },
    "activities": [
      {
        "id": "act-1",
        "subProcess": "Verifikasi & Validasi Warkat Kliring",
        "activityName": "Pemeriksaan tanda tangan dan saldo rekening debet nasabah",
        "responsibleRole": "Settlement Officer",
        "input": "Instruksi transfer cabang & warkat warkat",
        "output": "Batch kliring siap kirim",
        "application": "Core Banking & BI-Net Terminal",
        "duration": "10 menit",
        "dependency": "Koneksi database Core Banking"
      },
      {
        "id": "act-2",
        "subProcess": "Pengiriman Batch Settlement ke Bank Indonesia",
        "activityName": "Enkripsi dan transmisi pesan transfer via jaringan SWIFT / BI-Net",
        "responsibleRole": "BI-Net Operator & Dual Control Authorizer",
        "input": "Batch terverifikasi",
        "output": "Konfirmasi setelmen status ACK BI",
        "application": "BI-Net Secure Client",
        "duration": "5 menit",
        "dependency": "Leased line sirkuit Bank Indonesia & Token Otorisasi"
      }
    ],
    "impactMatrix": {
      "Financial": {
        "1 Jam": {
          "score": 2,
          "comment": "Beban bunga penundaan likuiditas minimal"
        },
        "4 Jam": {
          "score": 4,
          "comment": "Bunga overnight interbank call money melonjak signifikan"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Potensi sanksi denda BI dan gagal bayar kliring harian"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Dampak likuiditas masif pada rasio CAR bank"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Krisis likuiditas sistemik"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Pencabutan izin operasional kliring nasional"
        }
      },
      "Operational": {
        "1 Jam": {
          "score": 2,
          "comment": "Penumpukan antrian transaksi batch"
        },
        "4 Jam": {
          "score": 4,
          "comment": "Kekacauan rekonsiliasi akhir hari operasional"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Lumpuhnya seluruh aktivitas kliring perbankan"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Overload personil dan backlog transaksi > 10.000"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Kegagalan operasional total"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Tidak dapat dipulihkan secara manual"
        }
      },
      "Customer": {
        "1 Jam": {
          "score": 2,
          "comment": "Nasabah korporat menanyakan status dana"
        },
        "4 Jam": {
          "score": 4,
          "comment": "SLA transfer antar bank nasabah prioritas terlanggar"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Komplain massal dan tuntutan ganti rugi nasabah"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Migrasi nasabah korporat ke bank pesaing"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Litigasi perdata dari nasabah institusi"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Gugatan class action nasabah"
        }
      },
      "Regulatory": {
        "1 Jam": {
          "score": 1,
          "comment": "Toleransi kendala teknis singkat"
        },
        "4 Jam": {
          "score": 5,
          "comment": "Pelanggaran langsung batas cut-off settlement POJK & PADG"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Surat peringatan keras dan investigasi OJK/BI"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Sanksi denda administratif maksimal"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Pembekuan izin operasional kliring"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Pencabutan izin usaha perbankan"
        }
      },
      "Reputation": {
        "1 Jam": {
          "score": 1,
          "comment": "Belum terpublikasi ke publik"
        },
        "4 Jam": {
          "score": 4,
          "comment": "Keluhan nasabah korporat dan pemberitaan portal finansial"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Headline berita nasional dan penurunan indeks kepuasan"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Boikot nasabah korporat & penarikan dana massal"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Krisis reputasi reputasional parah"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Kehilangan kepercayaan permanen"
        }
      },
      "Legal": {
        "1 Jam": {
          "score": 1,
          "comment": "Belum timbul wanprestasi kontrak"
        },
        "4 Jam": {
          "score": 3,
          "comment": "Risiko default klausul SLA transaksi valas"
        },
        "24 Jam": {
          "score": 4,
          "comment": "Potensi somasi dari nasabah korporat"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Tuntutan hukum ganti rugi bunga"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Pelanggaran berat kontrak sindikasi"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Sengketa peradilan formal"
        }
      },
      "Human": {
        "1 Jam": {
          "score": 1,
          "comment": "Beban kerja normal"
        },
        "4 Jam": {
          "score": 3,
          "comment": "Staff lembur darurat di bawah stres tinggi"
        },
        "24 Jam": {
          "score": 4,
          "comment": "Kelelahan ekstrem tim operasional & IT settlement"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Kekurangan personel bersertifikat BI-Net"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Burnout total dan risiko kelalaian fatal manusia"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Eksodus karyawan spesialis"
        }
      },
      "Strategic": {
        "1 Jam": {
          "score": 1,
          "comment": "Tidak mempengaruhi sasaran strategis jangka panjang"
        },
        "4 Jam": {
          "score": 3,
          "comment": "Penundaan peluncuran produk treasury baru"
        },
        "24 Jam": {
          "score": 4,
          "comment": "Penurunan rating kesehatan bank dari regulator"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Evaluasi kelayakan kepesertaan kliring BI"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Pembatalan kerja sama sindikasi kredit"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Degradasi peringkat perbankan nasional"
        }
      }
    },
    "financialImpact": {
      "items": [
        {
          "category": "Fee Based Revenue Loss",
          "hourlyLoss": 25000000,
          "dailyLoss": 150000000,
          "weeklyLoss": 1050000000,
          "description": "Kehilangan fee transfer RTGS & SKNBI"
        },
        {
          "category": "Regulatory Fines & Penalty",
          "hourlyLoss": 50000000,
          "dailyLoss": 500000000,
          "weeklyLoss": 3500000000,
          "description": "Denda keterlambatan settlement Bank Indonesia"
        },
        {
          "category": "Overnight Interest Expense",
          "hourlyLoss": 40000000,
          "dailyLoss": 400000000,
          "weeklyLoss": 2800000000,
          "description": "Beban bunga pinjaman fasilitas likuiditas intrahari BI"
        }
      ],
      "totalFinancialImpact": 1050000000
    },
    "nonFinancialImpact": {
      "customerImpact": "Ratusan nasabah korporat tidak dapat mencairkan pembayaran vendor dan kewajiban payroll.",
      "regulatoryBreach": "Melanggar ketentuan cut-off transaksi kliring BI PADG No. 21/18/PADG/2019.",
      "reputationDamage": "Sorotan tajam media massa nasional dan penurunan rating kepuasan layanan perbankan.",
      "legalLiability": "Potensi tuntutan ganti rugi wanprestasi bunga keterlambatan pembayaran obligasi."
    },
    "mtpdAnalysis": {
      "suggestedMtpd": "2 Jam",
      "proposedMtpd": "2 Jam",
      "approvedMtpd": "2 Jam",
      "reasoning": "Cut-off RTGS BI ditutup tepat pukul 16:30 WIB. Downtime > 2 jam berakibat gagal setelmen hari berjalan dan pembekuan kliring kloter selanjutnya.",
      "intervals": [
        {
          "time": "1 Jam",
          "maxImpact": 2,
          "category": "Operational",
          "breached": false
        },
        {
          "time": "2 Jam",
          "maxImpact": 4,
          "category": "Regulatory",
          "breached": false
        },
        {
          "time": "4 Jam",
          "maxImpact": 5,
          "category": "Regulatory",
          "breached": true
        }
      ]
    },
    "rtoDetermination": {
      "mptdReference": "2 Jam",
      "suggestedRto": "1 Jam",
      "approvedRto": "1 Jam",
      "compliesWithMtpd": true,
      "justification": "RTO 1 jam memberikan buffer rekonsiliasi manual selama 1 jam sebelum cut-off kliring ditutup oleh Bank Indonesia. Aturan RTO <= MTPD terpenuhi sepenuhnya."
    },
    "rpoDetermination": {
      "requiredRpo": "15 Menit",
      "existingBackupRpo": "5 Menit",
      "hasGap": false,
      "gapDuration": "0 Menit",
      "mitigationStrategy": "Replikasi Oracle Data Guard sinkron aktif per 5 menit ke DRC Cikarang."
    },
    "mbcoAnalysis": {
      "normalCapacity": "3.500 transaksi per hari (IDR 4,2 Triliun)",
      "minimumRequiredCapacity": "1.400 transaksi prioritas bernilai > Rp 500 Juta",
      "minimumPercentage": 40,
      "minimumTransactions": "1.400 transaksi harian",
      "operatingMode": "Manual batch upload via terminal BI-Net di DRC Cikarang"
    },
    "resourceMatrix": [
      {
        "resourceType": "People",
        "normalCapacity": "18 orang staf settlement",
        "h0to2": "4 orang tim inti",
        "h2to4": "8 orang staf",
        "h4to8": "12 orang staf",
        "h8to24": "15 orang staf",
        "day2": "18 orang penuh",
        "day3": "18 orang penuh",
        "notes": "Wajib memiliki sertifikasi otorisasi token BI-Net"
      },
      {
        "resourceType": "Laptop / PC",
        "normalCapacity": "22 PC unit",
        "h0to2": "4 PC khusus",
        "h2to4": "8 PC khusus",
        "h4to8": "12 PC",
        "h8to24": "18 PC",
        "day2": "22 PC",
        "day3": "22 PC",
        "notes": "Terpasang sertifikat SSL client Bank Indonesia"
      },
      {
        "resourceType": "Application",
        "normalCapacity": "Core Banking, BI-Net, SWIFT, RTGS Gateway",
        "h0to2": "BI-Net & SWIFT",
        "h2to4": "BI-Net, SWIFT, Core GL",
        "h4to8": "Semua aplikasi aktif",
        "h8to24": "Semua aplikasi aktif",
        "day2": "Normal",
        "day3": "Normal",
        "notes": "Koneksi VPN dedicated DRC Cikarang"
      },
      {
        "resourceType": "Workspace",
        "normalCapacity": "Lantai 5 Gedung Kantor Pusat (25 seats)",
        "h0to2": "DRC Cikarang Ruang 304 (6 seats)",
        "h2to4": "DRC Cikarang (12 seats)",
        "h4to8": "DRC Cikarang (20 seats)",
        "h8to24": "DRC Cikarang (35 seats)",
        "day2": "DRC Cikarang",
        "day3": "DRC Cikarang",
        "notes": "Fasilitas command center darurat siap pakai"
      }
    ],
    "dependencies": {
      "applications": [
        {
          "name": "BI-Net Client",
          "criticality": "Mission Critical",
          "rto": "1 Jam",
          "isSpof": true
        },
        {
          "name": "SWIFT Alliance Access",
          "criticality": "Mission Critical",
          "rto": "1 Jam",
          "isSpof": false
        },
        {
          "name": "Oracle Settlement DB",
          "criticality": "Mission Critical",
          "rto": "1 Jam",
          "isSpof": false
        }
      ],
      "vendors": [
        {
          "name": "Bank Indonesia (Sistem Pembayaran)",
          "service": "RTGS & SKNBI Gateway",
          "sla": "99.95%",
          "hasBcp": true,
          "isCritical": true,
          "isSpof": true
        },
        {
          "name": "PT Telkom Indonesia",
          "service": "Leased Line Leased Circuit DC-DRC",
          "sla": "99.9%",
          "hasBcp": true,
          "isCritical": true,
          "isSpof": false
        }
      ],
      "facilities": [
        {
          "primary": "Kantor Pusat Sudirman Lt 5",
          "alternate": "DRC Cikarang Ruang 304",
          "minSeats": 20,
          "type": "Dedicated Hot Site"
        }
      ],
      "upstreamProcesses": [
        "PROC-02: Digital Banking Engine",
        "PROC-03: Branch Operations Cash Teller"
      ],
      "downstreamProcesses": [
        "PROC-04: Daily Accounting & Financial Ledger Reconciliation"
      ]
    },
    "workaround": {
      "available": true,
      "description": "Pengalihan transfer kliring prioritas menggunakan input manual formulir faksimili terenkripsi dan token otorisasi fisik via portal web BI-Net terminal DRC.",
      "maxDuration": "6 Jam",
      "capacityCoveragePercent": 70,
      "knownLimitations": "Kecepatan input terbatas maksimal 35 transaksi per jam, tidak memadai untuk transaksi massal retail.",
      "lastTested": "2023-11-14"
    },
    "recoveryCapability": {
      "requiredRto": "1 Jam",
      "existingCapabilityRto": "45 Menit",
      "rtoAssessment": "MET",
      "requiredRpo": "15 Menit",
      "existingCapabilityRpo": "5 Menit",
      "rpoAssessment": "MET",
      "requiredStaff": 4,
      "availableStaff": 4,
      "staffAssessment": "MET",
      "requiredWorkspace": "6 seats di DRC",
      "alternateCapacity": "35 seats tersedia",
      "workspaceAssessment": "MET"
    },
    "identifiedGaps": [
      {
        "id": "gap-1",
        "code": "GAP-BIA-001",
        "title": "Single Point of Failure Personil Token BI-Net",
        "gapType": "People & Organization",
        "severity": "High",
        "actionPlan": "Ajukan penambahan 2 token fisik baru ke Bank Indonesia dan latih 2 personil cadangan.",
        "owner": "Ratna Kusuma Dewi (Head of Settlement)",
        "targetDate": "2024-04-30"
      },
      {
        "id": "gap-2",
        "code": "GAP-BIA-002",
        "title": "Simulasi Beban Penuh DRC Belum Terlaksana",
        "gapType": "Technology & DR Drill",
        "severity": "Medium",
        "actionPlan": "Susun skenario disaster recovery test bersama Bank Indonesia pada kuartal II.",
        "owner": "Bambang Sudarsono (Head of IT Ops)",
        "targetDate": "2024-05-15"
      }
    ],
    "criticalityScore": 95,
    "criticalityTier": "Tier 1 — Mission Critical",
    "recoveryPriority": "P1",
    "consultantRecommendation": {
      "assessment": "Proses Sistem Kliring & RTGS merupakan proses dengan dampak paling kritikal terhadap solvabilitas finansial dan reputasi institusi.",
      "conclusion": "Target RTO 1 jam dan MTPD 2 jam telah realistis dan memenuhi ketentuan regulator Bank Indonesia & OJK.",
      "recommendedAction": "Kunci (lock) parameter BIA ini sebagai baseline rencana kelangsungan usaha (BCP) tahun berjalan.",
      "priority": "High",
      "targetDate": "2024-03-31"
    },
    "validationLog": [
      {
        "stage": "Input Validation",
        "date": "2024-02-26T10:00:00Z",
        "user": "Junior BCM Consultant",
        "action": "Draft Created",
        "comment": "Initial data populated from interview INT-2024-02"
      },
      {
        "stage": "RTO vs MTPD Check",
        "date": "2024-02-27T14:30:00Z",
        "user": "Lead BCM Consultant JMA",
        "action": "Rule Verification Passed",
        "comment": "RTO (1 hr) <= MTPD (2 hr). Validation passed with buffer 1 hr."
      },
      {
        "stage": "Steering Committee Approval",
        "date": "2024-03-01T11:00:00Z",
        "user": "Principal Advisor",
        "action": "Approved & Locked",
        "comment": "Worksheet finalized and locked for baseline project documentation."
      }
    ],
    "revisions": [
      {
        "revisionNumber": "Rev 1.0",
        "date": "2024-02-26",
        "changedBy": "Junior BCM Consultant",
        "changes": [
          {
            "field": "status",
            "prevValue": "None",
            "newValue": "Draft",
            "reason": "Initial submission"
          }
        ]
      },
      {
        "revisionNumber": "Rev 2.0",
        "date": "2024-03-01",
        "changedBy": "Lead BCM Consultant JMA",
        "changes": [
          {
            "field": "isLocked",
            "prevValue": "false",
            "newValue": "true",
            "reason": "Steering committee sign-off"
          }
        ]
      }
    ]
  },
  {
    "id": "BIA-PROC-02",
    "code": "BIA-2024-02",
    "projectId": "PRJ-2024-001",
    "unitId": "IT",
    "unitName": "Direktorat Teknologi Informasi",
    "processId": "PROC-02",
    "processCode": "PROC-02",
    "processName": "Digital Banking Engine & Mobile App Service",
    "processOwnerName": "Bambang Sudarsono",
    "respondentName": "Fahmi Idris (Cloud Infrastructure Lead)",
    "reviewerName": "Lead BCM Consultant JMA",
    "assessmentDate": "2024-02-27",
    "templateVersion": "1.2.0",
    "assessmentStatus": "Under Review",
    "validationStatus": "Passed (RTO 2 Jam <= MTPD 4 Jam)",
    "approvalStatus": "Pending Final Lead Review",
    "isLocked": false,
    "currentRevision": "Rev 1.1",
    "processProfile": {
      "description": "Layanan platform core digital perbankan yang melayani nasabah ritel via aplikasi smartphone iOS & Android.",
      "objective": "Menyediakan akses layanan transaksi perbankan 24 jam nonstop dengan SLA 99.9%.",
      "productService": "Mobile Banking, QRIS Payment, Topup E-Wallet, Transfer Antarbank",
      "customer": "1.200.000 Nasabah Ritel Aktif",
      "operatingHours": "24 Jam x 7 Hari (24/7)",
      "peakPeriod": "Pukul 11:30 - 13:30 (Makan siang) dan Pukul 18:00 - 21:00 WIB",
      "transactionVolume": "450.000 transaksi per hari",
      "financialValue": "IDR 85 Miliar per hari",
      "sla": "Availability 99.9% / Respon API < 1.5 detik",
      "regulatoryReq": "POJK No. 11/POJK.03/2022 tentang Manajemen Risiko TI",
      "criticalPeriod": "Tanggal gajian nasional (25 s.d 2 awal bulan)"
    },
    "activities": [
      {
        "id": "act-b2-1",
        "subProcess": "Otentikasi & Biometrik Nasabah",
        "activityName": "Verifikasi token JWT, sidik jari / FaceID, dan PIN transaksi nasabah",
        "responsibleRole": "Security API Gateway Service",
        "input": "Request login aplikasi smartphone",
        "output": "Sesi aman terotentikasi",
        "application": "OAuth2 Server & Redis Cluster",
        "duration": "0.8 detik",
        "dependency": "Koneksi server otentikasi"
      },
      {
        "id": "act-b2-2",
        "subProcess": "Pemrosesan Transaksi Finansial",
        "activityName": "Debet rekening, eksekusi transfer, dan pencatatan audit log",
        "responsibleRole": "Core Banking API Gateway",
        "input": "Instruksi pembayaran nasabah",
        "output": "Resit transaksi sukses & notifikasi push",
        "application": "Kubernetes Pods & PostgreSQL Cluster",
        "duration": "1.2 detik",
        "dependency": "Koneksi switching partner & database"
      }
    ],
    "impactMatrix": {
      "Financial": {
        "1 Jam": {
          "score": 2,
          "comment": "Penundaan transaksi QRIS dan topup e-wallet"
        },
        "4 Jam": {
          "score": 4,
          "comment": "Kehilangan fee transaksi digital Rp 200 Juta"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Total kerugian fee based dan biaya kompensasi nasabah"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Penurunan saldo tabungan nasabah retail"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Erosi dana pihak ketiga (DPK)"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Kerugian finansial masif"
        }
      },
      "Operational": {
        "1 Jam": {
          "score": 2,
          "comment": "Antrian lonjakan server backend"
        },
        "4 Jam": {
          "score": 4,
          "comment": "Call center mengalami antrian panggilan 500+"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Kapasitas layanan cabang fisik membludak"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Kegagalan operasional kanal digital"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Kelelahan personel IT pengembang"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Gangguan operasional menyeluruh"
        }
      },
      "Customer": {
        "1 Jam": {
          "score": 3,
          "comment": "Nasabah tidak dapat bertransaksi di merchant QRIS"
        },
        "4 Jam": {
          "score": 5,
          "comment": "Keluhan ratusan ribu nasabah ritel terhalang bayar"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Penutupan rekening dan penarikan saldo massal"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Kehilangan 15% basis nasabah aktif"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Eksodus nasabah ke neobank pesaing"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Kerusakan hubungan nasabah permanen"
        }
      },
      "Regulatory": {
        "1 Jam": {
          "score": 1,
          "comment": "Pelaporan insiden internal"
        },
        "4 Jam": {
          "score": 4,
          "comment": "Wajib lapor insiden TI ke OJK sesuai POJK 11/2022"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Audit kepatuhan khusus dari regulator"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Sanksi pembatasan izin produk digital baru"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Peringatan keras dewan komisioner OJK"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Pencabutan lisensi produk digital"
        }
      },
      "Reputation": {
        "1 Jam": {
          "score": 2,
          "comment": "Trending topik lokal di media sosial Twitter / X"
        },
        "4 Jam": {
          "score": 5,
          "comment": "Pemberitaan media nasional dan rating aplikasi anjlok"
        },
        "24 Jam": {
          "score": 5,
          "comment": "Krisis reputasi publik tingkat nasional"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Penarikan dana nasabah ritel skala besar"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Hilangnya kepercayaan segmen millennial"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Kerusakan brand jangka panjang"
        }
      },
      "Legal": {
        "1 Jam": {
          "score": 1,
          "comment": "Tidak ada konsekuensi legal langsung"
        },
        "4 Jam": {
          "score": 2,
          "comment": "Keluhan Lembaga Perlindungan Konsumen"
        },
        "24 Jam": {
          "score": 4,
          "comment": "Gugatan perlindungan konsumen transaksi gagal debet"
        },
        "72 Jam": {
          "score": 4,
          "comment": "Somasi dari mitra aggregator pembayaran"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Gugatan hukum perdata"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Pemeriksaan kepatuhan hukum perbankan"
        }
      },
      "Human": {
        "1 Jam": {
          "score": 1,
          "comment": "Tim DevOps standby"
        },
        "4 Jam": {
          "score": 3,
          "comment": "Tim Customer Service dan IT on-call lembur total"
        },
        "24 Jam": {
          "score": 4,
          "comment": "Stres psikologis dan ancaman kemarahan nasabah"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Kelelahan fisik teknisi infrastruktur"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Turnover personil tim digital engineering"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Krisis SDM teknologi"
        }
      },
      "Strategic": {
        "1 Jam": {
          "score": 1,
          "comment": "Strategi roadmap masih aman"
        },
        "4 Jam": {
          "score": 3,
          "comment": "Target akuisisi nasabah baru bulanan terhambat"
        },
        "24 Jam": {
          "score": 4,
          "comment": "Penurunan pamor digital brand bank"
        },
        "72 Jam": {
          "score": 5,
          "comment": "Kaji ulang investasi digital banking"
        },
        "1 Minggu": {
          "score": 5,
          "comment": "Kehilangan momentum kompetitif pasar ritel"
        },
        "2 Minggu +": {
          "score": 5,
          "comment": "Kegagalan transformasi digital perbankan"
        }
      }
    },
    "financialImpact": {
      "items": [
        {
          "category": "Fee Based Revenue Loss",
          "hourlyLoss": 15000000,
          "dailyLoss": 85000000,
          "weeklyLoss": 595000000,
          "description": "Fee transaksi transfer BI-Fast dan topup e-wallet"
        },
        {
          "category": "Customer Compensation",
          "hourlyLoss": 20000000,
          "dailyLoss": 120000000,
          "weeklyLoss": 840000000,
          "description": "Voucher ganti rugi transaksi gantung nasabah"
        }
      ],
      "totalFinancialImpact": 205000000
    },
    "nonFinancialImpact": {
      "customerImpact": "Nasabah panik tidak bisa membayar tagihan darurat, belanja makanan, atau transfer.",
      "regulatoryBreach": "Wajib menyampaikan laporan insiden kritikal TI ke OJK dalam kurun waktu 1x24 jam.",
      "reputationDamage": "Sentimen negatif di media sosial melonjak 800% dan rating app store turun drastis.",
      "legalLiability": "Kewajiban pengembalian saldo terpotong ganda sesuai regulasi perlindungan konsumen."
    },
    "mtpdAnalysis": {
      "suggestedMtpd": "4 Jam",
      "proposedMtpd": "4 Jam",
      "approvedMtpd": "4 Jam",
      "reasoning": "Outage kanal mobile banking melebihi 4 jam memicu kepanikan penarikan dana tunai (rush ATM) dan investigasi kepatuhan OJK.",
      "intervals": [
        {
          "time": "1 Jam",
          "maxImpact": 3,
          "category": "Customer",
          "breached": false
        },
        {
          "time": "2 Jam",
          "maxImpact": 3,
          "category": "Reputation",
          "breached": false
        },
        {
          "time": "4 Jam",
          "maxImpact": 5,
          "category": "Reputation",
          "breached": true
        }
      ]
    },
    "rtoDetermination": {
      "mptdReference": "4 Jam",
      "suggestedRto": "2 Jam",
      "approvedRto": "2 Jam",
      "compliesWithMtpd": true,
      "justification": "RTO 2 jam memungkinkan failover klaster Kubernetes aplikasi ke DRC. RTO <= MTPD terpenuhi."
    },
    "rpoDetermination": {
      "requiredRpo": "15 Menit",
      "existingBackupRpo": "10 Detik",
      "hasGap": false,
      "gapDuration": "0 Detik",
      "mitigationStrategy": "Streaming database replication multi-AZ cloud."
    },
    "mbcoAnalysis": {
      "normalCapacity": "450.000 transaksi per hari",
      "minimumRequiredCapacity": "225.000 transaksi layanan esensial (Cek saldo & transfer sesama)",
      "minimumPercentage": 50,
      "minimumTransactions": "225.000 transaksi per hari",
      "operatingMode": "Degraded mode dengan menonaktifkan fitur pihak ketiga non-esensial"
    },
    "resourceMatrix": [
      {
        "resourceType": "People",
        "normalCapacity": "12 personel DevOps & SRE",
        "h0to2": "5 personel inti",
        "h2to4": "8 personel",
        "h4to8": "10 personel",
        "h8to24": "12 personel penuh",
        "day2": "12 personel penuh",
        "day3": "12 personel penuh",
        "notes": "Dapat bekerja remote via VPN otentikasi hardware MFA"
      },
      {
        "resourceType": "Application",
        "normalCapacity": "Kubernetes Cluster Cloud & On-Premises",
        "h0to2": "Cloud DR Multi-Zone Cluster",
        "h2to4": "Full Cloud DRC",
        "h4to8": "Normal",
        "h8to24": "Normal",
        "day2": "Normal",
        "day3": "Normal",
        "notes": "DNS Anycast auto-routing"
      }
    ],
    "dependencies": {
      "applications": [
        {
          "name": "Core Mobile API Server",
          "criticality": "Mission Critical",
          "rto": "2 Jam",
          "isSpof": true
        },
        {
          "name": "Cloudflare WAF",
          "criticality": "Mission Critical",
          "rto": "30 Menit",
          "isSpof": false
        }
      ],
      "vendors": [
        {
          "name": "Cloud Service Provider (AWS / GCP)",
          "service": "Cloud Compute & Managed DB",
          "sla": "99.99%",
          "hasBcp": true,
          "isCritical": true,
          "isSpof": false
        },
        {
          "name": "Mitra Switching Nasional",
          "service": "QRIS & Interbank Gateway",
          "sla": "99.5%",
          "hasBcp": true,
          "isCritical": true,
          "isSpof": true
        }
      ],
      "facilities": [
        {
          "primary": "Virtual Cloud Multi-Zone",
          "alternate": "DRC On-Premises Cikarang",
          "minSeats": 5,
          "type": "Hybrid Virtual Hot Site"
        }
      ],
      "upstreamProcesses": [
        "PROC-05: Database Identity Master"
      ],
      "downstreamProcesses": [
        "PROC-01: Kliring & Settlement Antarbank"
      ]
    },
    "workaround": {
      "available": true,
      "description": "Mengarahkan nasabah bertransaksi melalui kanal alternatif ATM Bersama dan Web Internet Banking.",
      "maxDuration": "8 Jam",
      "capacityCoveragePercent": 65,
      "knownLimitations": "Nasabah tidak dapat melakukan scan pembayaran QRIS di toko fisik.",
      "lastTested": "2023-12-05"
    },
    "recoveryCapability": {
      "requiredRto": "2 Jam",
      "existingCapabilityRto": "1.5 Jam",
      "rtoAssessment": "MET",
      "requiredRpo": "15 Menit",
      "existingCapabilityRpo": "10 Detik",
      "rpoAssessment": "MET",
      "requiredStaff": 5,
      "availableStaff": 6,
      "staffAssessment": "MET",
      "requiredWorkspace": "Virtual Command Center WFA",
      "alternateCapacity": "Akses VPN 50 user aktif",
      "workspaceAssessment": "MET"
    },
    "identifiedGaps": [
      {
        "id": "gap-b2-1",
        "code": "GAP-BIA-003",
        "title": "DNS Failover TTL Propagasi Lambat",
        "gapType": "Technology & DR",
        "severity": "Medium",
        "actionPlan": "Ubah Cloudflare DNS TTL ke 60 detik dan uji dynamic healthcheck failover.",
        "owner": "Fahmi Idris (Cloud Infrastructure Lead)",
        "targetDate": "2024-04-10"
      }
    ],
    "criticalityScore": 91,
    "criticalityTier": "Tier 1 — Mission Critical",
    "recoveryPriority": "P1",
    "consultantRecommendation": {
      "assessment": "Layanan digital banking memiliki sensitivitas reputasi tertinggi di era perbankan modern.",
      "conclusion": "Target RTO 2 jam dan MTPD 4 jam selaras dengan kepatuhan POJK 11/2022.",
      "recommendedAction": "Finalisasi reviu internal dan ajukan ke Komite Pengarah BCM untuk persetujuan resmi.",
      "priority": "High",
      "targetDate": "2024-03-25"
    },
    "validationLog": [
      {
        "stage": "Input Validation",
        "date": "2024-02-27T14:00:00Z",
        "user": "Senior BCM Consultant",
        "action": "Draft Created",
        "comment": "Initial input completed"
      }
    ],
    "revisions": [
      {
        "revisionNumber": "Rev 1.0",
        "date": "2024-02-27",
        "changedBy": "Senior BCM Consultant",
        "changes": [
          {
            "field": "status",
            "prevValue": "None",
            "newValue": "Draft",
            "reason": "Initial entry"
          }
        ]
      }
    ]
  }
];

export const INITIAL_SYSTEM_CONFIG: SystemParameterConfig = {
  "general": {
    "systemName": "BCM JMA Consultant Management System",
    "companyName": "PT Asuransi JMA Syariah Tbk",
    "defaultLanguage": "id",
    "timeZone": "Asia/Jakarta (WIB)",
    "currency": "IDR",
    "dateFormat": "DD/MM/YYYY",
    "theme": "teal-enterprise"
  },
  "project": {
    "codeFormat": "PRJ-{YYYY}-{NNN}",
    "defaultStage": "Phase 2: Business Impact Analysis (BIA)",
    "stageWeightBia": 35,
    "defaultDurationDays": 180
  },
  "bcmMethodology": {
    "standardFramework": "ISO 22301:2019 Business Continuity Management",
    "regulatoryStandard": "POJK No. 11/POJK.03/2022 & PADG BI 21/2019",
    "criticalityWeights": {
      "financial": 0.3,
      "operational": 0.25,
      "customer": 0.2,
      "regulatory": 0.15,
      "reputation": 0.1
    },
    "impactThresholds": [
      {
        "level": 1,
        "name": "Negligible (Sangat Rendah)",
        "financialLimit": "< Rp 10.000.000",
        "operationalDisruption": "< 1 Jam",
        "customerLossCount": "< 100 Nasabah"
      },
      {
        "level": 2,
        "name": "Minor (Rendah)",
        "financialLimit": "Rp 10 Jt - Rp 100 Jt",
        "operationalDisruption": "1 - 4 Jam",
        "customerLossCount": "100 - 1.000 Nasabah"
      },
      {
        "level": 3,
        "name": "Moderate (Sedang)",
        "financialLimit": "Rp 100 Jt - Rp 500 Jt",
        "operationalDisruption": "4 - 24 Jam",
        "customerLossCount": "1.000 - 10.000 Nasabah"
      },
      {
        "level": 4,
        "name": "Major (Tinggi)",
        "financialLimit": "Rp 500 Jt - Rp 2,5 Miliar",
        "operationalDisruption": "24 - 72 Jam",
        "customerLossCount": "10.000 - 50.000 Nasabah"
      },
      {
        "level": 5,
        "name": "Catastrophic (Sangat Tinggi)",
        "financialLimit": "> Rp 2,5 Miliar",
        "operationalDisruption": "> 72 Jam",
        "customerLossCount": "> 50.000 Nasabah"
      }
    ],
    "rtoScaleOptions": [
      "30 Menit",
      "1 Jam",
      "2 Jam",
      "4 Jam",
      "8 Jam",
      "24 Jam",
      "72 Jam",
      "1 Minggu"
    ],
    "rpoScaleOptions": [
      "0 Menit (Zero Data Loss)",
      "15 Menit (Near Zero)",
      "1 Jam",
      "4 Jam",
      "24 Jam"
    ]
  },
  "workflow": {
    "stages": [
      {
        "id": "stg-1",
        "name": "Draft Pengisian Konsultan",
        "role": "BCM_CONSULTANT",
        "slaDays": 3,
        "escalationDays": 5
      },
      {
        "id": "stg-2",
        "name": "Reviu & Verifikasi Lead Konsultan",
        "role": "LEAD_CONSULTANT",
        "slaDays": 2,
        "escalationDays": 3
      },
      {
        "id": "stg-3",
        "name": "Verifikasi Pemilik Proses Klien",
        "role": "CLIENT_SPV",
        "slaDays": 3,
        "escalationDays": 5
      },
      {
        "id": "stg-4",
        "name": "Persetujuan Komite Pengarah (Final Lock)",
        "role": "STEERING_COMMITTEE",
        "slaDays": 4,
        "escalationDays": 7
      }
    ]
  },
  "notificationTemplates": [
    {
      "id": "notif-1",
      "event": "BIA_SUBMITTED_FOR_REVIEW",
      "subject": "Permintaan Reviu Lembar Kerja BIA: {{process_name}}",
      "body": "Lembar kerja BIA untuk proses {{process_name}} telah diajukan oleh {{author_name}} dan menunggu reviu Lead Konsultan."
    },
    {
      "id": "notif-2",
      "event": "RTO_BREACH_ALERT",
      "subject": "PERINGATAN ATURAN VALIDASI BCM: RTO Melebihi MTPD",
      "body": "Terdeteksi target RTO ({{rto}}) melebihi ambang toleransi MTPD ({{mtpd}}) pada proses {{process_name}}. Harap segera lakukan penyesuaian."
    },
    {
      "id": "notif-3",
      "event": "BIA_APPROVED_AND_LOCKED",
      "subject": "Lembar Kerja BIA Telah Disetujui & Dikunci: {{process_name}}",
      "body": "Lembar kerja BIA untuk {{process_name}} telah disetujui resmi oleh Komite Pengarah dan telah dikunci (Locked) dari perubahan tanpa revisi formal."
    }
  ]
};
