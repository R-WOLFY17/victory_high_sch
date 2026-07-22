import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserTie } from 'react-icons/fa';
import Modal, { ConfirmDialog } from './Modal';
import { notify } from './Notification';
import { useStaff } from './useStore';
import type { StaffMember, StaffStatus } from './db';
import { newId } from './db';

const DEPARTMENTS = ['Sciences', 'Humanities', 'Languages', 'Business & Commerce', 'Technical & Creative Arts', 'Physical Education', 'Administration', 'Support'];
const STATUSES: StaffStatus[] = ['Active', 'On Leave', 'Inactive'];
const PAGE_SIZE = 10;

const statusColors: Record<StaffStatus, string> = {
  Active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  'On Leave': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  Inactive: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
};

const emptyForm = (): Omit<StaffMember, 'id'> => ({
  employeeId: `EMP${String(Date.now()).slice(-4)}`,
  photoBase64: '',
  fullName: '',
  department: 'Sciences',
  position: '',
  subjects: '',
  phone: '',
  email: '',
  qualifications: '',
  employmentDate: new Date().toISOString().slice(0, 10),
  status: 'Active',
});

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

export default function ManageStaff() {
  const { items, add, update, remove } = useStaff();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'All' | StaffStatus>('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.fullName.toLowerCase().includes(q) || s.employeeId.toLowerCase().includes(q) || s.position.toLowerCase().includes(q);
    const matchDept = filterDept === 'All' || s.department === filterDept;
    const matchStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const F = (field: keyof typeof form, val: unknown) => setForm(f => ({ ...f, [field]: val }));

  function openAdd() { setEditing(null); setForm(emptyForm()); setModalOpen(true); }
  function openEdit(s: StaffMember) { setEditing(s); setForm({ ...s }); setModalOpen(true); }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const base64 = await readFileAsDataURL(file);
    setForm(f => ({ ...f, photoBase64: base64 }));
  }

  function handleSave() {
    if (!form.fullName.trim()) { notify.error('Full name is required'); return; }
    if (!form.position.trim()) { notify.error('Position is required'); return; }
    if (editing) {
      update({ ...editing, ...form });
      notify.success('Staff member updated');
    } else {
      add(form);
      notify.success('Staff member added');
    }
    setModalOpen(false);
  }

  function doDelete() {
    if (!deleteId) return;
    remove(deleteId);
    setDeleteId(null);
    notify.success('Staff member removed');
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <FaSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search staff…" className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
        </div>
        <select value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(1); }} className="py-2.5 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none">
          <option>All</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as typeof filterStatus); setPage(1); }} className="py-2.5 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none">
          <option>All</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus size={12} /> Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Staff Member</th>
                <th className="px-5 py-3 text-left">Department</th>
                <th className="px-5 py-3 text-left">Position</th>
                <th className="px-5 py-3 text-left">Contact</th>
                <th className="px-5 py-3 text-left">Employed</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">No staff found</td></tr>
              ) : paged.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {s.photoBase64 ? (
                        <img src={s.photoBase64} alt={s.fullName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                          <FaUserTie size={14} className="text-slate-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{s.fullName}</p>
                        <p className="text-xs text-slate-400">{s.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{s.department}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{s.position}</td>
                  <td className="px-5 py-3">
                    <p className="text-slate-600 dark:text-slate-300 text-xs">{s.phone}</p>
                    <p className="text-slate-400 text-xs">{s.email}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{s.employmentDate}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><FaEdit size={13} /></button>
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
            <span className="text-xs text-slate-500">{filtered.length} staff members</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-7 h-7 text-xs rounded-lg transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Staff Member' : 'Add Staff Member'} size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save</button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Photo */}
          <div className="flex items-center gap-4">
            <div onClick={() => photoRef.current?.click()} className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden transition-colors">
              {form.photoBase64 ? (
                <img src={form.photoBase64} alt="" className="w-full h-full object-cover" />
              ) : (
                <FaUserTie size={24} className="text-slate-300" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Staff Photo</p>
              <p className="text-xs text-slate-400">Click to upload photo</p>
            </div>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {([
              ['Full Name *', 'fullName', 'text'],
              ['Employee ID', 'employeeId', 'text'],
              ['Position *', 'position', 'text'],
              ['Qualifications', 'qualifications', 'text'],
              ['Phone', 'phone', 'tel'],
              ['Email', 'email', 'email'],
              ['Employment Date', 'employmentDate', 'date'],
            ] as const).map(([label, field, type]) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[field as keyof typeof form] as string}
                  onChange={e => F(field as keyof typeof form, e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Department</label>
              <select value={form.department} onChange={e => F('department', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
              <select value={form.status} onChange={e => F('status', e.target.value as StaffStatus)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Subjects Taught</label>
            <input value={form.subjects} onChange={e => F('subjects', e.target.value)} placeholder="e.g. Mathematics, Physics" className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="Remove this staff member permanently?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} danger />
    </motion.div>
  );
}
