import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserGraduate, FaPrint, FaArrowUp } from 'react-icons/fa';
import Modal, { ConfirmDialog } from './Modal';
import { notify } from './Notification';
import { useStudents } from './useStore';
import type { Student, StudentStatus } from './db';
import { studentsDB } from './db';

const CLASSES = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const STREAMS = ['', 'North', 'South', 'East', 'West', 'A', 'B', 'C'];
const STATUSES: StudentStatus[] = ['Active', 'Suspended', 'Transferred', 'Graduated'];
const PAGE_SIZE = 12;

const statusColors: Record<StudentStatus, string> = {
  Active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  Suspended: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  Transferred: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  Graduated: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
};

const emptyForm = (): Omit<Student, 'id'> => ({
  studentId: `STD${String(Date.now()).slice(-4)}`,
  admissionNumber: studentsDB.nextAdmissionNumber(),
  photoBase64: '',
  fullName: '',
  gender: 'Male',
  dob: '',
  class: 'S1',
  stream: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  address: '',
  status: 'Active',
  enrolledDate: new Date().toISOString().slice(0, 10),
});

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

export default function ManageStudents() {
  const { items, add, update, remove, promote, setStatus } = useStudents();
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'All' | StudentStatus>('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.fullName.toLowerCase().includes(q) || s.admissionNumber.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q);
    const matchClass = filterClass === 'All' || s.class === filterClass;
    const matchStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchSearch && matchClass && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const F = (field: keyof typeof form, val: unknown) => setForm(f => ({ ...f, [field]: val }));

  function openAdd() { setEditing(null); setForm(emptyForm()); setModalOpen(true); }
  function openEdit(s: Student) { setEditing(s); setForm({ ...s }); setModalOpen(true); }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const base64 = await readFileAsDataURL(file);
    setForm(f => ({ ...f, photoBase64: base64 }));
  }

  function handleSave() {
    if (!form.fullName.trim()) { notify.error('Full name is required'); return; }
    if (editing) {
      update({ ...editing, ...form });
      notify.success('Student updated');
    } else {
      add(form);
      notify.success('Student added');
    }
    setModalOpen(false);
  }

  function handlePromote(id: string, name: string) {
    promote(id);
    notify.success(`${name} promoted to next class`);
  }

  function handleStatusChange(id: string, status: StudentStatus) {
    setStatus(id, status);
    notify.info(`Student status changed to ${status}`);
  }

  function doDelete() {
    if (!deleteId) return;
    remove(deleteId);
    setDeleteId(null);
    notify.success('Student record deleted');
  }

  function exportCSV() {
    const headers = ['Admission Number', 'Student ID', 'Full Name', 'Gender', 'Class', 'Stream', 'Parent Name', 'Parent Phone', 'Status', 'Enrolled Date'];
    const rows = filtered.map(s => [s.admissionNumber, s.studentId, s.fullName, s.gender, s.class, s.stream, s.parentName, s.parentPhone, s.status, s.enrolledDate]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
    notify.success('CSV exported');
  }

  function printProfile(s: Student) {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Student Profile — ${s.fullName}</title>
      <style>body{font-family:sans-serif;padding:24px}h1{font-size:18px}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:8px;border:1px solid #e2e8f0;font-size:13px}td:first-child{font-weight:600;width:180px;background:#f8fafc}</style>
      </head><body>
      <h1>Nyenga Victory High School — Student Profile</h1>
      <table>
        <tr><td>Admission Number</td><td>${s.admissionNumber}</td></tr>
        <tr><td>Student ID</td><td>${s.studentId}</td></tr>
        <tr><td>Full Name</td><td>${s.fullName}</td></tr>
        <tr><td>Gender</td><td>${s.gender}</td></tr>
        <tr><td>Date of Birth</td><td>${s.dob}</td></tr>
        <tr><td>Class</td><td>${s.class} ${s.stream}</td></tr>
        <tr><td>Status</td><td>${s.status}</td></tr>
        <tr><td>Enrolled Date</td><td>${s.enrolledDate}</td></tr>
        <tr><td>Parent / Guardian</td><td>${s.parentName}</td></tr>
        <tr><td>Parent Phone</td><td>${s.parentPhone}</td></tr>
        <tr><td>Address</td><td>${s.address}</td></tr>
      </table>
      </body></html>
    `);
    w.print();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <FaSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search students…" className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
        </div>
        <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }} className="py-2.5 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none">
          <option>All</option>
          {CLASSES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as typeof filterStatus); setPage(1); }} className="py-2.5 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none">
          <option>All</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={exportCSV} className="px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors">Export CSV</button>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus size={12} /> Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Student</th>
                <th className="px-5 py-3 text-left">Admission No.</th>
                <th className="px-5 py-3 text-left">Class</th>
                <th className="px-5 py-3 text-left">Parent</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paged.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400">No students found</td></tr>
              ) : paged.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {s.photoBase64 ? (
                        <img src={s.photoBase64} alt={s.fullName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                          <FaUserGraduate size={14} className="text-slate-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{s.fullName}</p>
                        <p className="text-xs text-slate-400">{s.gender} · DOB: {s.dob}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs">{s.admissionNumber}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{s.class}{s.stream ? ` — ${s.stream}` : ''}</td>
                  <td className="px-5 py-3">
                    <p className="text-slate-600 dark:text-slate-300 text-xs">{s.parentName}</p>
                    <p className="text-slate-400 text-xs">{s.parentPhone}</p>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={s.status}
                      onChange={e => handleStatusChange(s.id, e.target.value as StudentStatus)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none ${statusColors[s.status]}`}
                    >
                      {STATUSES.map(st => <option key={st}>{st}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handlePromote(s.id, s.fullName)} className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Promote"><FaArrowUp size={12} /></button>
                      <button onClick={() => printProfile(s)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Print"><FaPrint size={12} /></button>
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><FaEdit size={13} /></button>
                      <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FaTrash size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500">{filtered.length} students</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-7 h-7 text-xs rounded-lg transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Student' : 'Add Student'} size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div onClick={() => photoRef.current?.click()} className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden transition-colors">
              {form.photoBase64 ? <img src={form.photoBase64} alt="" className="w-full h-full object-cover" /> : <FaUserGraduate size={24} className="text-slate-300" />}
            </div>
            <div><p className="text-sm font-medium text-slate-900 dark:text-white">Student Photo</p><p className="text-xs text-slate-400">Click to upload</p></div>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name *</label>
              <input value={form.fullName} onChange={e => F('fullName', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
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
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Class</label>
              <select value={form.class} onChange={e => F('class', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Stream</label>
              <select value={form.stream} onChange={e => F('stream', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
                {STREAMS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Parent Name</label>
              <input value={form.parentName} onChange={e => F('parentName', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Parent Phone</label>
              <input value={form.parentPhone} onChange={e => F('parentPhone', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Address</label>
              <input value={form.address} onChange={e => F('address', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="Permanently delete this student record?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} danger />
    </motion.div>
  );
}
