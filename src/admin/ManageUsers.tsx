import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaKey, FaUserShield } from 'react-icons/fa';
import Modal, { ConfirmDialog } from './Modal';
import { notify } from './Notification';
import { useUsers } from './useStore';
import type { AdminUser, UserRole } from './db';
import { simpleHash, newId } from './db';

const ROLES: UserRole[] = ['Super Admin', 'Administrator', 'Teacher', 'Admissions Officer', 'Librarian', 'Accountant'];

const roleColors: Record<UserRole, string> = {
  'Super Admin': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  Administrator: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  Teacher: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Admissions Officer': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  Librarian: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  Accountant: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
};

const emptyForm = () => ({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Teacher' as UserRole,
  active: true,
});

export default function ManageUsers() {
  const { items, add, update, remove, resetPassword, toggleActive } = useUsers();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetId, setResetId] = useState<string | null>(null);
  const [newPw, setNewPw] = useState('');

  const filtered = items.filter(u => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
  });

  const F = (field: keyof typeof form, val: unknown) => setForm(f => ({ ...f, [field]: val }));

  function openAdd() { setEditing(null); setForm(emptyForm()); setModalOpen(true); }
  function openEdit(u: AdminUser) {
    setEditing(u);
    setForm({ name: u.name, username: u.username, email: u.email, password: '', confirmPassword: '', role: u.role, active: u.active });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) { notify.error('Name is required'); return; }
    if (!form.email.trim() || !form.email.includes('@')) { notify.error('Valid email is required'); return; }
    if (!form.username.trim()) { notify.error('Username is required'); return; }

    if (editing) {
      const updated: AdminUser = {
        ...editing,
        name: form.name,
        username: form.username,
        email: form.email,
        role: form.role,
        active: form.active,
      };
      if (form.password) {
        if (form.password !== form.confirmPassword) { notify.error('Passwords do not match'); return; }
        if (form.password.length < 6) { notify.error('Password must be at least 6 characters'); return; }
        updated.passwordHash = simpleHash(form.password);
      }
      update(updated);
      notify.success('User updated');
    } else {
      if (!form.password) { notify.error('Password is required'); return; }
      if (form.password !== form.confirmPassword) { notify.error('Passwords do not match'); return; }
      if (form.password.length < 6) { notify.error('Password must be at least 6 characters'); return; }
      if (items.some(u => u.email === form.email)) { notify.error('Email already in use'); return; }
      if (items.some(u => u.username === form.username)) { notify.error('Username already in use'); return; }
      add({
        name: form.name,
        username: form.username,
        email: form.email,
        passwordHash: simpleHash(form.password),
        role: form.role,
        active: form.active,
        createdAt: new Date().toISOString().slice(0, 10),
        lastLogin: '',
      });
      notify.success('User created');
    }
    setModalOpen(false);
  }

  function doDelete() {
    if (!deleteId) return;
    remove(deleteId);
    setDeleteId(null);
    notify.success('User deleted');
  }

  function doReset() {
    if (!resetId || !newPw.trim()) { notify.error('Enter a new password'); return; }
    if (newPw.length < 6) { notify.error('Password must be at least 6 characters'); return; }
    resetPassword(resetId, newPw);
    setResetId(null);
    setNewPw('');
    notify.success('Password reset successfully');
  }

  function handleToggle(u: AdminUser) {
    toggleActive(u.id);
    notify.info(`${u.name} ${u.active ? 'deactivated' : 'activated'}`);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <FaSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus size={12} /> Add User
        </button>
      </div>

      {/* User cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 bg-white dark:bg-slate-800 rounded-2xl p-10 text-center shadow-sm">
            <p className="text-slate-400">No users found</p>
          </div>
        ) : filtered.map(u => (
          <div key={u.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{u.name}</p>
                  <p className="text-xs text-slate-400">@{u.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${u.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className="text-xs text-slate-500">{u.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{u.email}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3 ${roleColors[u.role]}`}>{u.role}</span>
            {u.lastLogin && <p className="text-xs text-slate-400 mb-3">Last login: {new Date(u.lastLogin).toLocaleDateString()}</p>}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => openEdit(u)} className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-600 flex items-center justify-center gap-1 transition-colors">
                <FaEdit size={10} /> Edit
              </button>
              <button onClick={() => handleToggle(u)} className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors ${u.active ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'}`}>
                <FaUserShield size={10} /> {u.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => { setResetId(u.id); setNewPw(''); }} className="py-1.5 px-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-1 transition-colors">
                <FaKey size={10} />
              </button>
              <button onClick={() => setDeleteId(u.id)} className="py-1.5 px-2 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 flex items-center gap-1 transition-colors">
                <FaTrash size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'New User'} size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name *</label>
              <input value={form.name} onChange={e => F('name', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Username *</label>
              <input value={form.username} onChange={e => F('username', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={e => F('email', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Role</label>
            <select value={form.role} onChange={e => F('role', e.target.value as UserRole)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
              <input type="password" value={form.password} onChange={e => F('password', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => F('confirmPassword', e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={form.active} onChange={e => F('active', e.target.checked)} className="w-4 h-4 accent-blue-600" />
            <label htmlFor="active" className="text-sm text-slate-700 dark:text-slate-300">Account Active</label>
          </div>
        </div>
      </Modal>

      {/* Reset password modal */}
      <Modal open={!!resetId} onClose={() => setResetId(null)} title="Reset Password" size="sm"
        footer={
          <>
            <button onClick={() => setResetId(null)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={doReset} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">Reset</button>
          </>
        }
      >
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">New Password (min 6 characters)</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="Permanently delete this user account?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} danger />
    </motion.div>
  );
}
