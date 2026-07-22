import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaTimes, FaImages, FaExpand } from 'react-icons/fa';
import Modal, { ConfirmDialog } from './Modal';
import { notify } from './Notification';
import { useGallery } from './useStore';
import type { GalleryImage } from './db';

const ALBUMS = ['General', 'Campus', 'Classrooms', 'Laboratories', 'Sports', 'Events', 'Students', 'Achievements', 'Drama & Arts'];
const CATEGORIES = ['All', ...ALBUMS];

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

export default function ManageGallery({ openUpload }: { openUpload?: boolean }) {
  const { items, add, update, remove } = useGallery();
  const [filter, setFilter] = useState('All');
  const [uploadOpen, setUploadOpen] = useState(openUpload ?? false);
  const [editImg, setEditImg] = useState<GalleryImage | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<{ src: string; name: string }[]>([]);
  const [bulkAlbum, setBulkAlbum] = useState('General');
  const [bulkCategory, setBulkCategory] = useState('General');
  const dropRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit form
  const [editCaption, setEditCaption] = useState('');
  const [editAlbum, setEditAlbum] = useState('General');
  const [editCategory, setEditCategory] = useState('General');

  const filtered = filter === 'All' ? items : items.filter(i => i.album === filter);

  async function handleFiles(files: FileList) {
    const results: { src: string; name: string }[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const src = await readFileAsDataURL(file);
      results.push({ src, name: file.name });
    }
    setPendingFiles(prev => [...prev, ...results]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function handleUpload() {
    if (pendingFiles.length === 0) { notify.error('No images selected'); return; }
    pendingFiles.forEach(f => {
      add({
        src: f.src,
        caption: f.name.replace(/\.[^.]+$/, ''),
        album: bulkAlbum,
        category: bulkCategory,
        uploadedAt: new Date().toISOString(),
      });
    });
    notify.success(`${pendingFiles.length} image(s) uploaded`);
    setPendingFiles([]);
    setUploadOpen(false);
  }

  function openEditModal(img: GalleryImage) {
    setEditImg(img);
    setEditCaption(img.caption);
    setEditAlbum(img.album);
    setEditCategory(img.category);
  }

  function saveEdit() {
    if (!editImg) return;
    update({ ...editImg, caption: editCaption, album: editAlbum, category: editCategory });
    notify.success('Image updated');
    setEditImg(null);
  }

  function doDelete() {
    if (!deleteId) return;
    remove(deleteId);
    setDeleteId(null);
    notify.success('Image deleted');
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2 flex-wrap flex-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === c ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-600'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <FaPlus size={12} /> Upload Images
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center shadow-sm">
          <FaImages size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500">No images yet. Upload some images to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(img => (
            <motion.div
              key={img.id}
              className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="relative aspect-square">
                <img src={img.src} alt={img.caption} className="w-full h-full object-cover" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewSrc(img.src)}
                    className="w-8 h-8 bg-white/20 hover:bg-white/40 rounded-lg flex items-center justify-center text-white transition-colors"
                  >
                    <FaExpand size={12} />
                  </button>
                  <button
                    onClick={() => openEditModal(img)}
                    className="w-8 h-8 bg-white/20 hover:bg-white/40 rounded-lg flex items-center justify-center text-white transition-colors"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => setDeleteId(img.id)}
                    className="w-8 h-8 bg-red-500/70 hover:bg-red-600 rounded-lg flex items-center justify-center text-white transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{img.caption || '—'}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{img.album}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        open={uploadOpen}
        onClose={() => { setUploadOpen(false); setPendingFiles([]); }}
        title="Upload Images"
        size="lg"
        footer={
          <>
            <button onClick={() => { setUploadOpen(false); setPendingFiles([]); }} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={handleUpload} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              Upload {pendingFiles.length > 0 ? `(${pendingFiles.length})` : ''}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Drop zone */}
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
          >
            <FaImages size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Drop images here or click to browse</p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP — multiple files supported</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => e.target.files && handleFiles(e.target.files)} className="hidden" />

          {/* Previews */}
          {pendingFiles.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {pendingFiles.map((f, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={f.src} alt={f.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTimes size={8} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Album</label>
              <select
                value={bulkAlbum}
                onChange={e => setBulkAlbum(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                {ALBUMS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
              <select
                value={bulkCategory}
                onChange={e => setBulkCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                {ALBUMS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editImg}
        onClose={() => setEditImg(null)}
        title="Edit Image"
        size="sm"
        footer={
          <>
            <button onClick={() => setEditImg(null)} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={saveEdit} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save</button>
          </>
        }
      >
        {editImg && (
          <div className="space-y-4">
            <img src={editImg.src} alt="" className="w-full h-40 object-cover rounded-xl" />
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Caption</label>
              <input
                value={editCaption}
                onChange={e => setEditCaption(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Album</label>
                <select
                  value={editAlbum}
                  onChange={e => setEditAlbum(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  {ALBUMS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  {ALBUMS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Lightbox */}
      {previewSrc && (
        <div
          className="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewSrc(null)}
        >
          <button className="absolute top-4 right-4 text-white/80 hover:text-white"><FaTimes size={24} /></button>
          <img src={previewSrc} alt="" className="max-w-full max-h-[90vh] object-contain rounded-xl" />
        </div>
      )}

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteId}
        message="Permanently delete this image?"
        onConfirm={doDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </motion.div>
  );
}
