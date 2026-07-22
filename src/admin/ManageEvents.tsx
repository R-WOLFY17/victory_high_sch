import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaImage } from 'react-icons/fa';
import Modal, { ConfirmDialog } from './Modal';
import { notify } from './Notification';
import { useEvents } from './useStore';
import type { SchoolEvent } from './db';

const CATEGORIES = ['Academic', 'Parents', 'Sports', 'Arts', 'Spiritual', 'Community', 'General'];
const PAGE_SIZE = 10;

const emptyForm = (): Omit<SchoolEvent, 'id'> => ({
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  time: '09:00',
  location: '',
  organizer: '',
  posterBase64: '',
  category: 'Academic',
});

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

export default function ManageEvents({ openCreate }: { openCreate?: boolean }) {
  const { items, thisMonthCount, add, update, remove } = useEvents();
  const [modalOpen, setModalOpen] = useState(openCreate ?? false);
  const [editing, setEditing] = useState<SchoolEvent | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState('All');
  const [page, setPage] = useState(1);
  const posterRef = useRef<HTMLInputElement>(null);

  const F = (field: keyof typeof form, val: unknown) => setForm(f => ({ ...f, [field]: val }));

  const filtered = filterCat === 'All' ? items : items.filter(e => e.category === filterCat);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Sort by date
  const sorted = [...paged].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  function openAdd() { setEditing(null); setForm(emptyForm()); setModalOpen(true); }
  function openEdit(e: SchoolEvent) { setEditing(e); setForm({ ...e }); setModalOpen(true); }

  async function handlePoster(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const base64 = await readFileAsDataURL(file);
    setForm(f => ({ ...f, posterBase64: base64 }));
  }

  function handleSave() {
    if (!form.title.trim()) { notify.error('Event title is required'); return; }
    if (!form.date) { notify.error('Event date is required'); return; }
    if (editing) {
      update({ ...editing, ...form });
      notify.success('Event updated');
    } else {
      add(form);
      notify.success('Event added');
    }
    setModalOpen(false);
  }

  function doDelete() {
    if (!deleteId) return;
    remove(deleteId);
    setDeleteId(null);
    notify.success('Event deleted');
  }

  const now = new Date();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* This month banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl px-5 py-3 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-blue-600" size={18} />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
            {thisMonthCount} event{thisMonthCount !== 1 ? 's' : ''} this month
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2 flex-1 flex-wrap">
          {(['All', ...CATEGORIES] as const).map(c => (
            <button key={c} onClick={() => { setFilterCat(c); setPage(1); }} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterCat === c ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600'}`}>{c}</button>
          ))}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus size={12} /> Add Event
        </button>
      </div>

      {/* Event cards */}
      {sorted.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center shadow-sm">
          <FaCalendarAlt size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500">No events found. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map(evt => {
            const evtDate = new Date(evt.date);
            const isPast = evtDate < now;
            const isToday = evtDate.toDateString() === now.toDateString();
            return (
              <div key={evt.id} className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm ${isPast && !isToday ? 'opacity-60' : ''}`}>
                {evt.posterBase64 ? (
                  <img src={evt.posterBase64} alt={evt.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                    <FaCalendarAlt size={24} className="text-white/60" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{evt.title}</h3>
                      {isToday && <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">Today</span>}
                    </div>
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs flex-shrink-0">{evt.category}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-3">
                    <p>📅 {evt.date} at {evt.time}</p>
                    <p>📍 {evt.location || '—'}</p>
                    <p>👤 {evt.organizer || '—'}</p>
                    {evt.description && <p className="text-slate-400 line-clamp-2">{evt.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(evt)} className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-600 flex items-center justify-center gap-1 transition-colors"><FaEdit size={11} />Edit</button>
                    <button onClick={() => setDeleteId(evt.id)} className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 flex items-center justify-center gap-1 transition-colors"><FaTrash size={11} />Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end mt-4 gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-7 h-7 text-xs rounded-lg transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{i + 1}</button>
          ))}
        </div>
      )}

      {/* Form modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Event' : 'New Event'} size="md"
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
            <input value={form.title} onChange={e => F('title', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Date *</label>
              <input type="date" value={form.date} onChange={e => F('date', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Time</label>
              <input type="time" value={form.time} onChange={e => F('time', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location</label>
              <input value={form.location} onChange={e => F('location', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Organizer</label>
              <input value={form.organizer} onChange={e => F('organizer', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
            <select value={form.category} onChange={e => F('category', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => F('description', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Event Poster</label>
            <div onClick={() => posterRef.current?.click()} className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors">
              {form.posterBase64 ? (
                <img src={form.posterBase64} alt="Poster preview" className="h-20 rounded-lg object-cover" />
              ) : (
                <>
                  <FaImage size={20} className="text-slate-400" />
                  <p className="text-xs text-slate-500">Click to upload poster image</p>
                </>
              )}
            </div>
            <input ref={posterRef} type="file" accept="image/*" onChange={handlePoster} className="hidden" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="Permanently delete this event?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} danger />
    </motion.div>
  );
}
