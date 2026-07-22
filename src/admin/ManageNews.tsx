import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaStar, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';
import Modal, { ConfirmDialog } from './Modal';
import { notify } from './Notification';
import { useNews } from './useStore';
import type { NewsItem } from './db';
import { newId } from './db';

const CATEGORIES = ['Achievements', 'News', 'Events', 'Sports', 'Arts', 'Community', 'Academic', 'General'];
const PAGE_SIZE = 8;

const emptyForm = (): Omit<NewsItem, 'id'> => ({
  title: '',
  content: '',
  excerpt: '',
  category: 'News',
  author: 'Admin',
  date: new Date().toISOString().slice(0, 10),
  status: 'draft',
  featured: false,
  imageBase64: '',
  slug: '',
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = e => res(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}

export default function ManageNews({ openCreate }: { openCreate?: boolean }) {
  const { items, add, update, remove } = useNews();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(openCreate ?? false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || n.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(n: NewsItem) {
    setEditing(n);
    setForm({ title: n.title, content: n.content, excerpt: n.excerpt, category: n.category, author: n.author, date: n.date, status: n.status, featured: n.featured, imageBase64: n.imageBase64, slug: n.slug });
    setModalOpen(true);
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { notify.error('Please select an image file'); return; }
    const base64 = await readFileAsDataURL(file);
    setForm(f => ({ ...f, imageBase64: base64 }));
  }

  function handleSave() {
    if (!form.title.trim()) { notify.error('Title is required'); return; }
    if (!form.content.trim()) { notify.error('Content is required'); return; }
    const slug = form.slug || slugify(form.title);
    if (editing) {
      update({ ...editing, ...form, slug });
      notify.success('News article updated');
    } else {
      add({ ...form, slug });
      notify.success('News article created');
    }
    setModalOpen(false);
  }

  function toggleStatus(n: NewsItem) {
    update({ ...n, status: n.status === 'published' ? 'draft' : 'published' });
    notify.info(`"${n.title}" ${n.status === 'published' ? 'unpublished' : 'published'}`);
  }

  function toggleFeatured(n: NewsItem) {
    update({ ...n, featured: !n.featured });
    notify.info(`${n.featured ? 'Removed from' : 'Marked as'} featured`);
  }

  function confirmDelete(id: string) { setDeleteId(id); }

  function doDelete() {
    if (!deleteId) return;
    remove(deleteId);
    setDeleteId(null);
    notify.success('Article deleted');
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <FaSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search articles…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => { setFilterCat(e.target.value); setPage(1); }}
          className="py-2.5 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none"
        >
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus size={12} /> Add Article
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Title</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Author</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Featured</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">No articles found</td></tr>
              ) : paged.map(n => (
                <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {n.imageBase64 ? (
                        <img src={n.imageBase64} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <FaImage size={12} className="text-slate-400" />
                        </div>
                      )}
                      <span className="font-medium text-slate-900 dark:text-white line-clamp-1">{n.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">{n.category}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{n.author}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{n.date}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleStatus(n)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        n.status === 'published'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {n.status === 'published' ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                      {n.status}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleFeatured(n)}
                      className={`p-1.5 rounded-lg transition-colors ${n.featured ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-slate-300 hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                      <FaStar size={14} />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(n)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><FaEdit size={13} /></button>
                      <button onClick={() => confirmDelete(n.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FaTrash size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500">{filtered.length} articles</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 text-xs rounded-lg transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Article' : 'New Article'}
        size="xl"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              {editing ? 'Update' : 'Publish'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
              placeholder="Article title"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Author</label>
              <input
                value={form.author}
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as NewsItem['status'] }))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short summary shown in listings…"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Content *</label>
            <textarea
              rows={8}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Full article content…"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none font-mono"
            />
          </div>
          {/* Featured image */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Featured Image</label>
            <div
              onClick={() => imgRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              {form.imageBase64 ? (
                <img src={form.imageBase64} alt="Preview" className="max-h-40 rounded-xl object-cover" />
              ) : (
                <div className="text-center text-slate-400">
                  <FaImage size={24} className="mx-auto mb-2" />
                  <p className="text-xs">Click to upload image</p>
                </div>
              )}
            </div>
            <input ref={imgRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="featured" className="text-sm text-slate-700 dark:text-slate-300">Mark as featured article</label>
          </div>
        </div>
      </Modal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteId}
        message="Are you sure you want to permanently delete this article?"
        onConfirm={doDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </motion.div>
  );
}
