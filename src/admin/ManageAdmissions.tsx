import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes,
  FaEye, FaPrint, FaChevronDown,
} from 'react-icons/fa';
import Modal, { ConfirmDialog } from './Modal';
import { notify } from './Notification';
import { useAdmissions, useDashboardStats } from './useStore';
import type { Admission, ApplicationStatus } from './db';

const CLASSES = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const STATUSES: ApplicationStatus[] = ['Pending', 'Under Review', 'Accepted', 'Rejected'];
const PAGE_SIZE = 10;

const statusColors: Record<ApplicationStatus, string> = {
  Pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  'Under Review': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Accepted: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  Rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
};

const emptyForm = (): Omit<Admission, 'id'> => ({
  studentName: '',
  gender: 'Male',
  dob: '',
  desiredClass: 'S1',
  previousSchool: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  parentRelationship: 'Father',
  address: '',
  applicationDate: new Date().toISOString().slice(0, 10),
  status: 'Pending',
  rejectionReason: '',
  admissionNumber: '',
  notes: '',
});

export default function ManageAdmissions() {
  const { items, add, update, remove, accept, reject, setUnderReview } = useAdmissions();
  const stats = useDashboardStats();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | ApplicationStatus>('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Admission | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [viewApp, setViewApp] = useState<Admission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = items.filter(a => {
    const matchSearch = a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.parentName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const F = (field: keyof typeof form, val: unknown) => setForm(f => ({ ...f, [field]: val }));

  function openAdd() { setEditing(null); setForm(emptyForm()); setModalOpen(true); }
  function openEdit(a: Admission) { setEditing(a); setForm({ ...a }); setModalOpen(true); }

  function handleSave() {
    if (!form.studentName.trim()) { notify.error('Student name is required'); return; }
    if (!form.parentPhone.trim()) { notify.error('Parent phone is required'); return; }
    if (editing) {
      update({ ...editing, ...form });
      notify.success('Application updated');
    } else {
      add(form);
      notify.success('Application added');
    }
    stats.refresh();
    setModalOpen(false);
  }

  function handleAccept(id: string, name: string) {
    const admNum = accept(id);
    stats.refresh();
    notify.success(`${name} accepted! Admission No: ${admNum}`);
  }

  function handleReview(id: string) {
    setUnderReview(id);
    stats.refresh();
    notify.info('Moved to Under Review');
  }

  function openReject(id: string) { setRejectId(id); setRejectReason(''); }
  function doReject() {
    if (!rejectId) return;
    reject(rejectId, rejectReason);
    stats.refresh();
    setRejectId(null);
    notify.warning('Application rejected');
  }

  function doDelete() {
    if (!deleteId) return;
    remove(deleteId);
    stats.refresh();
    setDeleteId(null);
    notify.success('Application deleted');
  }

  function handlePrint(a: Admission) {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Application — ${a.studentName}</title>
      <style>body{font-family:sans-serif;padding:24px;color:#1e293b}h1{font-size:20px;margin-bottom:16px}table{width:100%;border-collapse:collapse}td{padding:8px;border:1px solid #e2e8f0;font-size:14px}td:first-child{font-weight:600;width:200px;background:#f8fafc}</style>
      </head><body>
      <h1>Nyenga Victory High School — Admission Application</h1>
      <table>
        <tr><td>Application Date</td><td>${a.applicationDate}</td></tr>
        <tr><td>Status</td><td>${a.status}</td></tr>
        ${a.admissionNumber ? `<tr><td>Admission Number</td><td>${a.admissionNumber}</td></tr>` : ''}
        <tr><td>Student Name</td><td>${a.studentName}</td></tr>
        <tr><td>Gender</td><td>${a.gender}</td></tr>
        <tr><td>Date of Birth</td><td>${a.dob}</td></tr>
        <tr><td>Desired Class</td><td>${a.desiredClass}</td></tr>
        <tr><td>Previous School</td><td>${a.previousSchool}</td></tr>
        <tr><td>Parent / Guardian</td><td>${a.parentName} (${a.parentRelationship})</td></tr>
        <tr><td>Parent Phone</td><td>${a.parentPhone}</td></tr>
        <tr><td>Parent Email</td><td>${a.parentEmail || '—'}</td></tr>
        <tr><td>Address</td><td>${a.address}</td></tr>
        ${a.rejectionReason ? `<tr><td>Rejection Reason</td><td>${a.rejectionReason}</td></tr>` : ''}
        ${a.notes ? `<tr><td>Notes</td><td>${a.notes}</td></tr>` : ''}
      </table>
      </body></html>
    `);
    w.print();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['All', ...STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => { setFilterStatus(s); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600'}`}
          >
            {s} {s !== 'All' && `(${items.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <FaSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name…" className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus size={12} /> New Application
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Applicant</th>
                <th className="px-5 py-3 text-left">Gender</th>
                <th className="px-5 py-3 text-left">Class</th>
                <th className="px-5 py-3 text-left">Parent</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">No applications found</td></tr>
              ) : paged.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900 dark:text-white">{a.studentName}</p>
                    {a.admissionNumber && <p className="text-xs text-emerald-600">{a.admissionNumber}</p>}
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{a.gender}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{a.desiredClass}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                    <p>{a.parentName}</p>
                    <p className="text-xs text-slate-400">{a.parentPhone}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{a.applicationDate}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status]}`}>{a.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button onClick={() => setViewApp(a)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View"><FaEye size={13} /></button>
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Edit"><FaEdit size={13} /></button>
                      {a.status !== 'Accepted' && a.status !== 'Rejected' && (
                        <>
                          <button onClick={() => handleReview(a.id)} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors">Review</button>
                          <button onClick={() => handleAccept(a.id, a.studentName)} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs hover:bg-emerald-200 transition-colors flex items-center gap-1"><FaCheck size={9} />Accept</button>
                          <button onClick={() => openReject(a.id)} className="px-2 py-0.5 bg-red-100 text-red-700 rounded-lg text-xs hover:bg-red-200 transition-colors flex items-center gap-1"><FaTimes size={9} />Reject</button>
                        </>
                      )}
                      <button onClick={() => handlePrint(a)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Print"><FaPrint size={13} /></button>
                      <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FaTrash size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500">{filtered.length} applications</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-7 h-7 text-xs rounded-lg transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Application' : 'New Application'} size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save</button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Student Information</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name *</label>
              <input value={form.studentName} onChange={e => F('studentName', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Gender</label>
              <select value={form.gender} onChange={e => F('gender', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
                <option>Male</option><option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Date of Birth</label>
              <input type="date" value={form.dob} onChange={e => F('dob', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Desired Class</label>
              <select value={form.desiredClass} onChange={e => F('desiredClass', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Previous School</label>
              <input value={form.previousSchool} onChange={e => F('previousSchool', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 pt-2">Parent / Guardian</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Name *</label>
              <input value={form.parentName} onChange={e => F('parentName', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Relationship</label>
              <select value={form.parentRelationship} onChange={e => F('parentRelationship', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
                {['Father', 'Mother', 'Guardian', 'Other'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Phone *</label>
              <input value={form.parentPhone} onChange={e => F('parentPhone', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email</label>
              <input type="email" value={form.parentEmail} onChange={e => F('parentEmail', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Address</label>
              <input value={form.address} onChange={e => F('address', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
            <select value={form.status} onChange={e => F('status', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => F('notes', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none" />
          </div>
        </div>
      </Modal>

      {/* View modal */}
      <Modal open={!!viewApp} onClose={() => setViewApp(null)} title="Application Details" size="md"
        footer={
          <>
            <button onClick={() => viewApp && handlePrint(viewApp)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-2"><FaPrint size={12} />Print</button>
            <button onClick={() => setViewApp(null)} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">Close</button>
          </>
        }
      >
        {viewApp && (
          <div className="space-y-3 text-sm">
            {[
              ['Application Date', viewApp.applicationDate],
              ['Status', viewApp.status],
              ...(viewApp.admissionNumber ? [['Admission Number', viewApp.admissionNumber]] : []),
              ['Student Name', viewApp.studentName],
              ['Gender', viewApp.gender],
              ['Date of Birth', viewApp.dob],
              ['Desired Class', viewApp.desiredClass],
              ['Previous School', viewApp.previousSchool],
              ['Parent Name', `${viewApp.parentName} (${viewApp.parentRelationship})`],
              ['Parent Phone', viewApp.parentPhone],
              ['Parent Email', viewApp.parentEmail || '—'],
              ['Address', viewApp.address],
              ...(viewApp.rejectionReason ? [['Rejection Reason', viewApp.rejectionReason]] : []),
              ...(viewApp.notes ? [['Notes', viewApp.notes]] : []),
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3 pb-2 border-b border-slate-100 dark:border-slate-700">
                <span className="w-40 flex-shrink-0 text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                <span className="text-slate-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Reject reason modal */}
      <Modal open={!!rejectId} onClose={() => setRejectId(null)} title="Reject Application" size="sm"
        footer={
          <>
            <button onClick={() => setRejectId(null)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={doReject} className="px-4 py-2 text-sm rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors">Reject</button>
          </>
        }
      >
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Reason for rejection</label>
          <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Provide a reason (optional)…" className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-red-400 resize-none" />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="Permanently delete this application?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} danger />
    </motion.div>
  );
}
