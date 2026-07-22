import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaSchool, FaHome, FaShareAlt, FaClipboardList,
  FaEnvelope, FaCog, FaCheck, FaSave,
} from 'react-icons/fa';
import { notify } from './Notification';
import { useSettings } from './useStore';
import type { SchoolSettings } from './db';

type Tab = 'school' | 'homepage' | 'social' | 'admissions' | 'email' | 'system';

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'school', label: 'School Info', icon: FaSchool },
  { key: 'homepage', label: 'Homepage', icon: FaHome },
  { key: 'social', label: 'Social Media', icon: FaShareAlt },
  { key: 'admissions', label: 'Admissions', icon: FaClipboardList },
  { key: 'email', label: 'Email / SMTP', icon: FaEnvelope },
  { key: 'system', label: 'System', icon: FaCog },
];

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

export default function Settings() {
  const { settings, save } = useSettings();
  const [tab, setTab] = useState<Tab>('school');
  const [form, setForm] = useState<SchoolSettings>({ ...settings });
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  const F = (field: keyof SchoolSettings, val: unknown) => setForm(f => ({ ...f, [field]: val }));

  function handleSave() {
    save(form);
    notify.success('Settings saved');
  }

  function handleReset() {
    setForm({ ...settings });
    notify.info('Changes discarded');
  }

  async function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const base64 = await readFileAsDataURL(file);
    setForm(f => ({ ...f, logo: base64 }));
  }

  async function handleHero(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const base64 = await readFileAsDataURL(file);
    setForm(f => ({ ...f, heroImage: base64 }));
  }

  function handleBackup() {
    const data = {
      settings: form,
      backup_date: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nvhs_settings_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify.success('Settings backup downloaded');
  }

  const inputCls = "w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500";
  const labelCls = "block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-44 flex-shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm space-y-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${tab === t.key ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <t.icon size={13} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
            {/* Save/Reset bar */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold font-poppins text-slate-900 dark:text-white text-lg">
                {tabs.find(t => t.key === tab)?.label}
              </h3>
              <div className="flex gap-2">
                <button onClick={handleReset} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors">
                  Discard
                </button>
                <button onClick={handleSave} className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors">
                  <FaSave size={12} /> Save Changes
                </button>
              </div>
            </div>

            {/* ── School Info ─────────────────────────────────────────── */}
            {tab === 'school' && (
              <div className="space-y-4">
                {/* Logo */}
                <div>
                  <label className={labelCls}>School Logo</label>
                  <div className="flex items-center gap-4">
                    <div onClick={() => logoRef.current?.click()} className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden transition-colors">
                      {form.logo ? (
                        <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <FaSchool size={24} className="text-slate-300" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">Click to upload school logo</p>
                    <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>School Name</label>
                    <input value={form.schoolName} onChange={e => F('schoolName', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Motto</label>
                    <input value={form.motto} onChange={e => F('motto', e.target.value)} className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Address</label>
                    <input value={form.address} onChange={e => F('address', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input value={form.phone} onChange={e => F('phone', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={form.email} onChange={e => F('email', e.target.value)} className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Website</label>
                    <input value={form.website} onChange={e => F('website', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Homepage ────────────────────────────────────────────── */}
            {tab === 'homepage' && (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Hero / Banner Image</label>
                  <div onClick={() => heroRef.current?.click()} className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors">
                    {form.heroImage ? (
                      <img src={form.heroImage} alt="Hero" className="h-20 rounded-xl object-cover" />
                    ) : (
                      <p className="text-sm text-slate-400">Click to upload hero image</p>
                    )}
                  </div>
                  <input ref={heroRef} type="file" accept="image/*" onChange={handleHero} className="hidden" />
                </div>
                <div>
                  <label className={labelCls}>Welcome Message</label>
                  <textarea rows={2} value={form.welcomeMessage} onChange={e => F('welcomeMessage', e.target.value)} className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Vision</label>
                  <textarea rows={3} value={form.vision} onChange={e => F('vision', e.target.value)} className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Mission</label>
                  <textarea rows={3} value={form.mission} onChange={e => F('mission', e.target.value)} className={`${inputCls} resize-none`} />
                </div>
              </div>
            )}

            {/* ── Social Media ─────────────────────────────────────────── */}
            {tab === 'social' && (
              <div className="space-y-4">
                {([
                  ['Facebook URL', 'facebook'],
                  ['Instagram URL', 'instagram'],
                  ['X (Twitter) URL', 'twitter'],
                  ['YouTube URL', 'youtube'],
                ] as const).map(([label, field]) => (
                  <div key={field}>
                    <label className={labelCls}>{label}</label>
                    <input type="url" value={form[field]} onChange={e => F(field, e.target.value)} placeholder="https://" className={inputCls} />
                  </div>
                ))}
              </div>
            )}

            {/* ── Admissions ───────────────────────────────────────────── */}
            {tab === 'admissions' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <input
                    type="checkbox"
                    id="admissionsOpen"
                    checked={form.admissionsOpen}
                    onChange={e => F('admissionsOpen', e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <label htmlFor="admissionsOpen" className="text-sm font-medium text-slate-900 dark:text-white">Admissions are currently open</label>
                </div>
                <div>
                  <label className={labelCls}>Fees Notice (shown on Admissions page)</label>
                  <textarea rows={3} value={form.feesNotice} onChange={e => F('feesNotice', e.target.value)} placeholder="e.g. Please contact the office for the 2025 fees structure." className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Admission Instructions</label>
                  <textarea rows={5} value={form.admissionInstructions} onChange={e => F('admissionInstructions', e.target.value)} placeholder="Step-by-step instructions for applying…" className={`${inputCls} resize-none`} />
                </div>
              </div>
            )}

            {/* ── Email / SMTP ─────────────────────────────────────────── */}
            {tab === 'email' && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-xs text-yellow-700 dark:text-yellow-300">
                  ⚠️ SMTP settings are stored locally and are not sent to any server in this demo. Connect a real backend to use email notifications.
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>SMTP Host</label>
                    <input value={form.smtpHost} onChange={e => F('smtpHost', e.target.value)} placeholder="smtp.gmail.com" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Port</label>
                    <input value={form.smtpPort} onChange={e => F('smtpPort', e.target.value)} placeholder="587" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Username</label>
                    <input value={form.smtpUser} onChange={e => F('smtpUser', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <input type="password" value={form.smtpPass} onChange={e => F('smtpPass', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* ── System ───────────────────────────────────────────────── */}
            {tab === 'system' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Theme</label>
                    <select value={form.theme} onChange={e => F('theme', e.target.value)} className={inputCls}>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Timezone</label>
                    <select value={form.timezone} onChange={e => F('timezone', e.target.value)} className={inputCls}>
                      <option value="Africa/Kampala">Africa/Kampala (EAT)</option>
                      <option value="UTC">UTC</option>
                      <option value="Africa/Nairobi">Africa/Nairobi</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Language</label>
                    <select value={form.language} onChange={e => F('language', e.target.value)} className={inputCls}>
                      <option>English</option>
                      <option>Luganda</option>
                      <option>Swahili</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Data Management</h4>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleBackup} className="px-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-2 transition-colors">
                      <FaSave size={12} /> Download Backup
                    </button>
                    <label className="px-4 py-2 text-sm rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 flex items-center gap-2 cursor-pointer transition-colors">
                      <FaCheck size={12} /> Restore from Backup
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const text = await file.text();
                            const data = JSON.parse(text);
                            if (data.settings) {
                              save(data.settings as SchoolSettings);
                              setForm(data.settings as SchoolSettings);
                              notify.success('Settings restored from backup');
                            } else {
                              notify.error('Invalid backup file');
                            }
                          } catch {
                            notify.error('Failed to parse backup file');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
