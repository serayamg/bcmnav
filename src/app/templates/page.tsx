'use client';

import React, { useState } from 'react';
import { useBcm } from '@/lib/store';
import {
  WorkingTemplate,
  TemplateCategory,
  TemplateScope,
  TemplateStatus,
  FieldDataType,
  TemplateField,
  TemplateSection,
  ConditionalRule,
  CalculatedFormula
} from '@/types';
import { TEMPLATE_CATEGORIES } from '@/lib/mock-templates-data';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Copy,
  CheckCircle2,
  Clock,
  Archive,
  Layers,
  Sparkles,
  Eye,
  Edit3,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check,
  ChevronRight,
  Globe,
  Briefcase,
  Building,
  FolderGit2,
  Code,
  Tag,
  History,
  X,
  PlusCircle,
  HelpCircle,
  CheckSquare
} from 'lucide-react';

export default function TemplateManagementPage() {
  const { templates, saveTemplate, cloneTemplate, updateTemplateStatus } = useBcm();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedScope, setSelectedScope] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  
  // Builder & Modal States
  const [activeTemplate, setActiveTemplate] = useState<WorkingTemplate | null>(null);
  const [builderMode, setBuilderMode] = useState<'view' | 'edit' | 'builder' | 'preview'>('view');
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [targetCloneScope, setTargetCloneScope] = useState<TemplateScope>('PROJECT');
  const [templateToClone, setTemplateToClone] = useState<WorkingTemplate | null>(null);

  // New Section / Field inline state in Builder
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldDataType>('Text Input');
  const [newFieldMandatory, setNewFieldMandatory] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Filtering
  const filteredTemplates = templates.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchScope = selectedScope === 'ALL' || t.scope === selectedScope;
    const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchSearch && matchCategory && matchScope && matchStatus;
  });

  const getScopeBadge = (scope: TemplateScope) => {
    switch (scope) {
      case 'GLOBAL':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1"><Globe className="w-3 h-3" /> Global</span>;
      case 'INDUSTRY':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1"><Briefcase className="w-3 h-3" /> Industry</span>;
      case 'CLIENT':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1"><Building className="w-3 h-3" /> Client</span>;
      case 'PROJECT':
        return <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1"><FolderGit2 className="w-3 h-3" /> Project</span>;
    }
  };

  const getStatusBadge = (status: TemplateStatus) => {
    switch (status) {
      case 'Published':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Published</span>;
      case 'Approved':
        return <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Approved</span>;
      case 'Review':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Review</span>;
      case 'Draft':
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 text-xs px-2 py-0.5 rounded font-medium">Draft</span>;
      case 'Deprecated':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1"><Archive className="w-3 h-3" /> Deprecated</span>;
    }
  };

  const handleStartClone = (template: WorkingTemplate) => {
    setTemplateToClone(template);
    setTargetCloneScope(template.scope === 'GLOBAL' ? 'INDUSTRY' : (template.scope === 'INDUSTRY' ? 'CLIENT' : 'PROJECT'));
    setCloneModalOpen(true);
  };

  const handleExecuteClone = () => {
    if (!templateToClone) return;
    const cloned = cloneTemplate(templateToClone.id, targetCloneScope);
    setCloneModalOpen(false);
    if (cloned) {
      setActiveTemplate(cloned);
      setBuilderMode('builder');
    }
  };

  const handleAddField = (sectionId: string) => {
    if (!activeTemplate || !newFieldName.trim()) return;
    const newField: TemplateField = {
      id: `fld-${Date.now()}`,
      name: newFieldName.trim().toLowerCase().replace(/\s+/g, '_'),
      label: newFieldLabel.trim() || newFieldName.trim(),
      dataType: newFieldType,
      mandatory: newFieldMandatory,
      displayOrder: 99,
      options: ['Option 1', 'Option 2', 'Option 3']
    };

    const updatedSections = activeTemplate.sections.map((s) => {
      if (s.id === sectionId) {
        return { ...s, fields: [...s.fields, newField] };
      }
      return s;
    });

    const updated = { ...activeTemplate, sections: updatedSections };
    setActiveTemplate(updated);
    saveTemplate(updated);
    setNewFieldName('');
    setNewFieldLabel('');
    setNewFieldMandatory(false);
  };

  const handleAddSection = () => {
    if (!activeTemplate || !newSectionTitle.trim()) return;
    const newSection: TemplateSection = {
      id: `sec-${Date.now()}`,
      title: newSectionTitle.trim(),
      description: 'Custom added section',
      order: activeTemplate.sections.length + 1,
      fields: []
    };
    const updated = {
      ...activeTemplate,
      sections: [...activeTemplate.sections, newSection]
    };
    setActiveTemplate(updated);
    saveTemplate(updated);
    setNewSectionTitle('');
  };

  const handleDeleteField = (sectionId: string, fieldId: string) => {
    if (!activeTemplate) return;
    const updatedSections = activeTemplate.sections.map((s) => {
      if (s.id === sectionId) {
        return { ...s, fields: s.fields.filter((f) => f.id !== fieldId) };
      }
      return s;
    });
    const updated = { ...activeTemplate, sections: updatedSections };
    setActiveTemplate(updated);
    saveTemplate(updated);
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Module CK-CU — Working Template Management
            </span>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              Scope Inheritance Engine
            </span>
            <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
              27 Categories Supported
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Master Template Library & No-Code Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Kelola template kerja BCM yang parameterized, version-controlled, reusable, cloneable, dan editable tanpa coding.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => {
              const newTpl: WorkingTemplate = {
                id: `TMP-${Date.now().toString().slice(-4)}`,
                code: `TPL-BCM-NEW-${Date.now().toString().slice(-3)}`,
                name: 'New Custom Working Template',
                category: 'BIA Worksheet',
                description: 'Custom BCM working template crafted with no-code builder',
                framework: 'ISO 22301:2019',
                industry: 'Cross-Industry',
                scope: 'PROJECT',
                version: '1.0.0',
                status: 'Draft',
                owner: 'BCM Consultant',
                createdDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                effectiveDate: new Date().toISOString().slice(0, 10),
                createdBy: 'Lead BCM Consultant JMA',
                usageCount: 0,
                isDefault: false,
                versionHistory: [
                  {
                    version: '1.0.0',
                    changedAt: new Date().toISOString(),
                    changedBy: 'Lead Consultant',
                    changeSummary: 'Created via no-code builder',
                    approvalStatus: 'Draft'
                  }
                ],
                sections: [
                  {
                    id: `sec-${Date.now()}-1`,
                    title: 'Informasi Lembar Kerja',
                    description: 'Data pembuka',
                    order: 1,
                    fields: [
                      {
                        id: `fld-${Date.now()}-1`,
                        name: 'document_title',
                        label: 'Judul Dokumen Pelaksanaan',
                        dataType: 'Text Input',
                        mandatory: true,
                        displayOrder: 1
                      }
                    ]
                  }
                ],
                calculatedFormulas: [],
                conditionalRules: []
              };
              saveTemplate(newTpl);
              setActiveTemplate(newTpl);
              setBuilderMode('builder');
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Buat Template Baru
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Total Template Master</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{templates.length}</div>
          <span className="text-[11px] text-teal-600 font-semibold">27 Kategori ISO 22301</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Published & Aktif</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {templates.filter((t) => t.status === 'Published').length}
          </div>
          <span className="text-[11px] text-slate-500">Siap pakai di proyek</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Scope Global / Industry</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {templates.filter((t) => t.scope === 'GLOBAL' || t.scope === 'INDUSTRY').length}
          </div>
          <span className="text-[11px] text-slate-500">Standar acuan master</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Dalam Review / Draft</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {templates.filter((t) => t.status === 'Draft' || t.status === 'Review').length}
          </div>
          <span className="text-[11px] text-slate-500">Pembaruan berkala</span>
        </div>
      </div>

      {/* Main Content Area: Builder vs Library */}
      {builderMode === 'builder' && activeTemplate ? (
        /* NO-CODE TEMPLATE BUILDER */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {activeTemplate.code}
                </span>
                {getScopeBadge(activeTemplate.scope)}
                {getStatusBadge(activeTemplate.status)}
                <span className="text-xs text-slate-500 font-medium">v{activeTemplate.version}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1.5">{activeTemplate.name}</h2>
              <p className="text-xs text-slate-500">Kategori: {activeTemplate.category} • Framework: {activeTemplate.framework}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBuilderMode('preview')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4" /> Pratinjau Form
              </button>
              <button
                onClick={() => {
                  updateTemplateStatus(activeTemplate.id, 'Published');
                  setActiveTemplate({ ...activeTemplate, status: 'Published' });
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4" /> Terbitkan (Publish)
              </button>
              <button
                onClick={() => setBuilderMode('view')}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
              >
                Tutup Builder
              </button>
            </div>
          </div>

          {/* Builder Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Sections & Fields */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  Struktur Bagian (Sections) & Komponen ({activeTemplate.sections.length} Section)
                </h3>
              </div>

              {activeTemplate.sections.map((sec, secIdx) => (
                <div key={sec.id} className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                        {secIdx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{sec.title}</h4>
                        <p className="text-[11px] text-slate-500">{sec.description || 'Tidak ada deskripsi'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                      {sec.fields.length} Kolom Input
                    </span>
                  </div>

                  {/* Field list in section */}
                  <div className="space-y-2">
                    {sec.fields.map((fld, fldIdx) => (
                      <div
                        key={fld.id}
                        className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-slate-400 font-mono text-[10px]">#{fldIdx + 1}</span>
                          <div>
                            <span className="font-bold text-slate-800">{fld.label}</span>
                            <span className="text-slate-400 font-mono text-[10px] ml-1.5">({fld.name})</span>
                          </div>
                          {fld.mandatory && (
                            <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
                              Wajib
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded text-[10px]">
                            {fld.dataType}
                          </span>
                          <button
                            onClick={() => handleDeleteField(sec.id, fld.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Hapus field"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Field to Section Inline */}
                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      placeholder="Label Kolom (e.g. Nama Petugas)"
                      value={editingSectionIndex === secIdx ? newFieldLabel : ''}
                      onChange={(e) => {
                        setEditingSectionIndex(secIdx);
                        setNewFieldLabel(e.target.value);
                        setNewFieldName(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                      }}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 flex-1 focus:outline-teal-500 bg-white"
                    />
                    <select
                      value={editingSectionIndex === secIdx ? newFieldType : 'Text Input'}
                      onChange={(e) => {
                        setEditingSectionIndex(secIdx);
                        setNewFieldType(e.target.value as FieldDataType);
                      }}
                      className="text-xs px-2 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-teal-500"
                    >
                      <option value="Text Input">Text Input</option>
                      <option value="Long Text">Long Text / Textarea</option>
                      <option value="Number">Number</option>
                      <option value="Currency">Currency (IDR)</option>
                      <option value="Date">Date Picker</option>
                      <option value="Dropdown">Dropdown Single-Select</option>
                      <option value="Radio">Radio Options</option>
                      <option value="Yes / No">Yes / No Switch</option>
                      <option value="Signature">Digital Signature</option>
                      <option value="Calculated Field">Calculated Formula</option>
                    </select>

                    <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingSectionIndex === secIdx ? newFieldMandatory : false}
                        onChange={(e) => {
                          setEditingSectionIndex(secIdx);
                          setNewFieldMandatory(e.target.checked);
                        }}
                        className="rounded text-teal-600"
                      />
                      Wajib
                    </label>

                    <button
                      onClick={() => handleAddField(sec.id)}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Section */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Judul Bagian Baru (contoh: Kriteria Pemulihan BCP)"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="text-xs px-3 py-2 rounded-lg border border-slate-300 flex-1 focus:outline-teal-500"
                />
                <button
                  onClick={handleAddSection}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" /> Tambah Bagian Baru
                </button>
              </div>
            </div>

            {/* Right Column: Parameters, Formulas & Conditional Rules */}
            <div className="space-y-4">
              {/* Scope & Inheritance Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" /> Scope & Hirarki
                </h4>
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scope Tingkat:</span>
                    <span className="font-bold">{activeTemplate.scope}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Industri Terkait:</span>
                    <span className="font-bold">{activeTemplate.industry || 'Semua Industri'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status Versi:</span>
                    <span className="font-mono font-bold">v{activeTemplate.version}</span>
                  </div>
                </div>
              </div>

              {/* Formulas & Calculated Fields */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-600" /> Rumus Kalkulasi Dinamis
                </h4>
                {activeTemplate.calculatedFormulas.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Belum ada rumus terdaftar</p>
                ) : (
                  activeTemplate.calculatedFormulas.map((f) => (
                    <div key={f.id} className="p-2.5 bg-white rounded border border-slate-200 text-xs">
                      <div className="font-mono text-teal-700 font-bold text-[11px]">{f.formulaExpression}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{f.description}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Conditional Rules (IF / THEN) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" /> Aturan Kondisional (IF/THEN)
                </h4>
                {activeTemplate.conditionalRules.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Belum ada aturan kondisional</p>
                ) : (
                  activeTemplate.conditionalRules.map((c) => (
                    <div key={c.id} className="p-2.5 bg-white rounded border border-slate-200 text-xs">
                      <span className="font-semibold text-blue-800">IF</span> field {c.sourceFieldId} {c.operator} {c.value}{' '}
                      <span className="font-semibold text-emerald-800">THEN</span> {c.action} target fields
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : builderMode === 'preview' && activeTemplate ? (
        /* PREVIEW MODE */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Mode Simulasi Pengisian</span>
              <h2 className="text-xl font-bold text-slate-900">{activeTemplate.name}</h2>
            </div>
            <button
              onClick={() => setBuilderMode('builder')}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg"
            >
              Kembali ke Builder
            </button>
          </div>

          <div className="space-y-6">
            {activeTemplate.sections.map((sec, idx) => (
              <div key={sec.id} className="space-y-3">
                <div className="border-b border-slate-100 pb-1.5">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {sec.title}
                  </h3>
                  {sec.description && <p className="text-xs text-slate-500 ml-7">{sec.description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-7">
                  {sec.fields.map((fld) => (
                    <div key={fld.id} className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {fld.label} {fld.mandatory && <span className="text-rose-500">*</span>}
                      </label>
                      {fld.dataType === 'Text Input' && (
                        <input
                          type="text"
                          placeholder={fld.placeholder || 'Ketik data di sini...'}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-teal-500"
                        />
                      )}
                      {fld.dataType === 'Long Text' && (
                        <textarea
                          rows={3}
                          placeholder={fld.placeholder || 'Ketik penjelasan rinci...'}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-teal-500"
                        />
                      )}
                      {fld.dataType === 'Dropdown' && (
                        <select className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white">
                          <option value="">-- Pilih Opsi --</option>
                          {fld.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                      {fld.dataType === 'Date' && (
                        <input
                          type="date"
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
                        />
                      )}
                      {fld.dataType === 'Radio' && (
                        <div className="space-y-1 pt-1">
                          {fld.options?.map((opt, i) => (
                            <label key={i} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                              <input type="radio" name={fld.id} className="text-teal-600" />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                      {fld.dataType === 'Yes / No' && (
                        <div className="flex items-center gap-4 pt-1">
                          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                            <input type="radio" name={fld.id} value="YES" className="text-teal-600" /> Ya (Yes)
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                            <input type="radio" name={fld.id} value="NO" className="text-teal-600" /> Tidak (No)
                          </label>
                        </div>
                      )}
                      {fld.dataType === 'Signature' && (
                        <div className="h-16 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium">
                          [Area Tanda Tangan Digital Konsultan]
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TEMPLATE LIBRARY LISTING */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama atau kode template..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-teal-500"
                >
                  <option value="ALL">Semua Kategori (27 Standar)</option>
                  {TEMPLATE_CATEGORIES.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scope Filter */}
              <div>
                <select
                  value={selectedScope}
                  onChange={(e) => setSelectedScope(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-teal-500"
                >
                  <option value="ALL">Semua Scope (Global / Industry / Client / Project)</option>
                  <option value="GLOBAL">Global Template</option>
                  <option value="INDUSTRY">Industry Template</option>
                  <option value="CLIENT">Client Specific</option>
                  <option value="PROJECT">Project Specific</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-teal-500"
                >
                  <option value="ALL">Semua Status Siklus</option>
                  <option value="Published">Published (Aktif)</option>
                  <option value="Approved">Approved (Disetujui)</option>
                  <option value="Review">Review (Reviu)</option>
                  <option value="Draft">Draft</option>
                  <option value="Deprecated">Deprecated (Usang)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {tpl.code}
                    </span>
                    {getScopeBadge(tpl.scope)}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors line-clamp-1">
                    {tpl.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tpl.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Kategori: {tpl.category}</span>
                    <span className="font-mono">v{tpl.version}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>{getStatusBadge(tpl.status)}</div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartClone(tpl)}
                      className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Clone template to another scope"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTemplate(tpl);
                        setBuilderMode('preview');
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Pratinjau formulir"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTemplate(tpl);
                        setBuilderMode('builder');
                      }}
                      className="bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Buka Builder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLONE TEMPLATE MODAL */}
      {cloneModalOpen && templateToClone && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Copy className="w-4 h-4 text-teal-600" /> Clone Working Template
              </h3>
              <button onClick={() => setCloneModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Duplikasi template <strong>{templateToClone.name}</strong> ({templateToClone.code}) menjadi template baru
              dengan pewarisan struktur dan penyesuaian scope.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Target Scope Pewarisan:</label>
              <select
                value={targetCloneScope}
                onChange={(e) => setTargetCloneScope(e.target.value as TemplateScope)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
              >
                <option value="GLOBAL">GLOBAL (Master Organisasi Konsultan)</option>
                <option value="INDUSTRY">INDUSTRY (Spesifik Sektor Perbankan / Finansial)</option>
                <option value="CLIENT">CLIENT (Spesifik Asuransi JMA Syariah)</option>
                <option value="PROJECT">PROJECT (Spesifik Proyek Berjalan)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setCloneModalOpen(false)}
                className="text-xs font-semibold px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteClone}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Duplikasi & Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
