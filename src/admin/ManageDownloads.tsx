import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaDownload, FaSearch, FaFileAlt, FaFilePdf } from 'react-icons/fa';
import Modal, { ConfirmDialog } from './Modal';
import { notify } from './Notification';
import { useDownloads } from './useStore';
import type { DownloadItem, DownloadCategory } from './db';

const CATEGORIES: DownloadCategory[] = ['Admissions', 'Academic', 'General', 'Past Papers', 'Circulars', 'Other'];
const PAGE_SIZE = 10;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function readFile(file: File): Promise<{ base64: string; size: string }> {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res({ base64: e.target?.result as string, size: formatBytes(file.size) });
    r.readAsDataURL(file);
  });
}

const emptyForm = (): Omit<DownloadItem, 'id'> => ({
  title: '',
  description: '',
  category: 'General',
  fileBase64: '',
  fileName: '',
  fileSize: '',
  fileType: '',
  downloads: 0,
  uploadedAt: new Date().toISOString().slice(0, 10),
});

export default function ManageDownloads({ openCreate }: { openCreate?: boolean }) {
  const { items, add, update, remove, incrementDownload } = useDownloads();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<'All' | DownloadCategory>('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(openCreate ?? false);
  const [editing, setEditing] = useState<DownloadItem | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || d.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAdd() { setEditing(null); setForm(emptyForm()); setModalOpen(true); }

  function openEdit(d: DownloadItem) {
    setEditing(d);
    setForm({ title: d.title, description: d.description, category: d.category, fileBase64: d.fileBase64, fileName: d.fileName, fileSize: d.fileSize, fileType: d.fileType, downloads: d.downloads, uploadedAt: d.uploadedAt });
    setModalOpen(true);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip-compressed'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx?|zip)$/i)) {
      notify.error('Only PDF, DOCX, and ZIP files are allowed');
      return;
    }
    const { base64, size } = await readFile(file);
    setForm(f => ({ ...f, fileBase64: base64, fileName: file.name, fileSize: size, fileType: file.type }));
    notify.info(`File ready: ${file.name} (${size})`);
  }

  function handleSave() {
    if (!form.title.trim()) { notify.error('Title is required'); return; }
    if (!editing && !form.fileBase64) { notify.error('Please upload a file'); return; }
    if (editing) {
      update({ ...editing, ...form });
      notify.success('Download updated');
    } else {
      add(form);
      notify.success('Download added');
    }
    setModalOpen(false);
  }

  function handleDownload(item: DownloadItem) {
    incrementDownload(item.id);
    const link = document.createElement('a');
    link.href = item.fileBase64;
    link.download = item.fileName;
    link.click();
  }

  function doDelete() {
    if (!deleteId) return;
    remove(deleteId);
    setDeleteId(null);
    notify.success('Download deleted');
  }

  const fileIcon = (type: string) => {
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" size={16} />;
    return <FaFileAlt className="text-blue-500" size={16} />;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <FaSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search downloads…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => { setFilterCat(e.target.value as typeof filterCat); setPage(1); }}
          className="py-2.5 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none"
        >
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus size={12} /> Add Download
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">File</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Size</th>
                <th className="px-5 py-3 text-left">Downloads</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paged.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400">No downloads yet</td></tr>
              ) : paged.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {fileIcon(d.fileType)}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{d.title}</p>
                        {d.description && <p className="text-xs text-slate-400 line-clamp-1">{d.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">{d.category}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{d.fileSize || '—'}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <FaDownload size={10} className="text-slate-400" /> {d.downloads}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{d.uploadedAt}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {d.fileBase64 && (
                        <button onClick={() => handleDownload(d)} className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Download"><FaDownload size={13} /></button>
                      )}
                      <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><FaEdit size={13} /></button>
                      <button onClick={() => setDeleteId(d.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FaTrash size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500">{filtered.length} files</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-7 h-7 text-xs rounded-lg transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Download' : 'Add Download'}
        size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as DownloadCategory }))} className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{editing ? 'Replace File (optional)' : 'Upload File *'}</label>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors">
              <FaFileAlt size={20} className="text-slate-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{form.fileName || 'Click to choose a file'}</p>
                {form.fileSize && <p className="text-xs text-slate-400">{form.fileSize}</p>}
              </div>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.zip" onChange={handleFileChange} className="hidden" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        message="Permanently delete this download?"
        onConfirm={doDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </motion.div>
  );
}
