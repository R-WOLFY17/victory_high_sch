// ─── Reactive store — thin wrapper around db.ts that triggers React re-renders
// Each hook loads from localStorage on mount and exposes mutators that both
// persist to localStorage AND update local state, so the UI refreshes instantly.

import { useState, useCallback, useEffect } from 'react';
import {
  newsDB, galleryDB, downloadsDB, admissionsDB, staffDB,
  studentsDB, eventsDB, usersDB, settingsDB,
  type NewsItem, type GalleryImage, type DownloadItem,
  type Admission, type StaffMember, type Student,
  type SchoolEvent, type AdminUser, type SchoolSettings,
  studentsDB as sDB, newId, simpleHash,
} from './db';

// ── News ─────────────────────────────────────────────────────────────────────
export function useNews() {
  const [items, setItems] = useState<NewsItem[]>(() => newsDB.list());
  const refresh = useCallback(() => setItems(newsDB.list()), []);

  const add = useCallback((item: Omit<NewsItem, 'id'>) => {
    const n = newsDB.add(item); setItems(newsDB.list()); return n;
  }, []);
  const update = useCallback((item: NewsItem) => {
    newsDB.update(item); setItems(newsDB.list());
  }, []);
  const remove = useCallback((id: string) => {
    newsDB.delete(id); setItems(newsDB.list());
  }, []);

  return { items, refresh, add, update, remove };
}

// ── Gallery ───────────────────────────────────────────────────────────────────
export function useGallery() {
  const [items, setItems] = useState<GalleryImage[]>(() => galleryDB.list());

  const add = useCallback((item: Omit<GalleryImage, 'id'>) => {
    const n = galleryDB.add(item); setItems(galleryDB.list()); return n;
  }, []);
  const update = useCallback((item: GalleryImage) => {
    galleryDB.update(item); setItems(galleryDB.list());
  }, []);
  const remove = useCallback((id: string) => {
    galleryDB.delete(id); setItems(galleryDB.list());
  }, []);

  return { items, add, update, remove };
}

// ── Downloads ─────────────────────────────────────────────────────────────────
export function useDownloads() {
  const [items, setItems] = useState<DownloadItem[]>(() => downloadsDB.list());

  const add = useCallback((item: Omit<DownloadItem, 'id'>) => {
    const n = downloadsDB.add(item); setItems(downloadsDB.list()); return n;
  }, []);
  const update = useCallback((item: DownloadItem) => {
    downloadsDB.update(item); setItems(downloadsDB.list());
  }, []);
  const remove = useCallback((id: string) => {
    downloadsDB.delete(id); setItems(downloadsDB.list());
  }, []);
  const incrementDownload = useCallback((id: string) => {
    downloadsDB.incrementDownload(id); setItems(downloadsDB.list());
  }, []);

  return { items, add, update, remove, incrementDownload };
}

// ── Admissions ────────────────────────────────────────────────────────────────
export function useAdmissions() {
  const [items, setItems] = useState<Admission[]>(() => admissionsDB.list());

  const add = useCallback((item: Omit<Admission, 'id'>) => {
    const n = admissionsDB.add(item); setItems(admissionsDB.list()); return n;
  }, []);
  const update = useCallback((item: Admission) => {
    admissionsDB.update(item); setItems(admissionsDB.list());
  }, []);
  const remove = useCallback((id: string) => {
    admissionsDB.delete(id); setItems(admissionsDB.list());
  }, []);

  // Accept: update status, generate admission number, add to students
  const accept = useCallback((id: string): string => {
    const app = admissionsDB.list().find(a => a.id === id);
    if (!app) return '';
    const admNum = studentsDB.nextAdmissionNumber();
    const updated: Admission = { ...app, status: 'Accepted', admissionNumber: admNum };
    admissionsDB.update(updated);

    // Create student record
    const studentId = `STD${String(studentsDB.list().length + 1).padStart(3, '0')}`;
    studentsDB.add({
      studentId,
      admissionNumber: admNum,
      photoBase64: '',
      fullName: app.studentName,
      gender: app.gender,
      dob: app.dob,
      class: app.desiredClass,
      stream: '',
      parentName: app.parentName,
      parentPhone: app.parentPhone,
      parentEmail: app.parentEmail,
      address: app.address,
      status: 'Active',
      enrolledDate: new Date().toISOString().slice(0, 10),
    });

    setItems(admissionsDB.list());
    return admNum;
  }, []);

  const reject = useCallback((id: string, reason: string) => {
    const app = admissionsDB.list().find(a => a.id === id);
    if (!app) return;
    admissionsDB.update({ ...app, status: 'Rejected', rejectionReason: reason });
    setItems(admissionsDB.list());
  }, []);

  const setUnderReview = useCallback((id: string) => {
    const app = admissionsDB.list().find(a => a.id === id);
    if (!app) return;
    admissionsDB.update({ ...app, status: 'Under Review' });
    setItems(admissionsDB.list());
  }, []);

  return { items, add, update, remove, accept, reject, setUnderReview };
}

// ── Staff ─────────────────────────────────────────────────────────────────────
export function useStaff() {
  const [items, setItems] = useState<StaffMember[]>(() => staffDB.list());

  const add = useCallback((item: Omit<StaffMember, 'id'>) => {
    const n = staffDB.add(item); setItems(staffDB.list()); return n;
  }, []);
  const update = useCallback((item: StaffMember) => {
    staffDB.update(item); setItems(staffDB.list());
  }, []);
  const remove = useCallback((id: string) => {
    staffDB.delete(id); setItems(staffDB.list());
  }, []);

  return { items, add, update, remove };
}

// ── Students ──────────────────────────────────────────────────────────────────
export function useStudents() {
  const [items, setItems] = useState<Student[]>(() => sDB.list());

  const add = useCallback((item: Omit<Student, 'id'>) => {
    const n = sDB.add(item); setItems(sDB.list()); return n;
  }, []);
  const update = useCallback((item: Student) => {
    sDB.update(item); setItems(sDB.list());
  }, []);
  const remove = useCallback((id: string) => {
    sDB.delete(id); setItems(sDB.list());
  }, []);

  const promote = useCallback((id: string) => {
    const student = sDB.list().find(s => s.id === id);
    if (!student) return;
    const classMap: Record<string, string> = {
      S1: 'S2', S2: 'S3', S3: 'S4', S4: 'S5', S5: 'S6',
    };
    const next = classMap[student.class] ?? student.class;
    sDB.update({ ...student, class: next });
    setItems(sDB.list());
  }, []);

  const setStatus = useCallback((id: string, status: Student['status']) => {
    const student = sDB.list().find(s => s.id === id);
    if (!student) return;
    sDB.update({ ...student, status });
    setItems(sDB.list());
  }, []);

  return { items, add, update, remove, promote, setStatus };
}

// ── Events ────────────────────────────────────────────────────────────────────
export function useEvents() {
  const [items, setItems] = useState<SchoolEvent[]>(() => eventsDB.list());
  const thisMonthCount = items.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const add = useCallback((item: Omit<SchoolEvent, 'id'>) => {
    const n = eventsDB.add(item); setItems(eventsDB.list()); return n;
  }, []);
  const update = useCallback((item: SchoolEvent) => {
    eventsDB.update(item); setItems(eventsDB.list());
  }, []);
  const remove = useCallback((id: string) => {
    eventsDB.delete(id); setItems(eventsDB.list());
  }, []);

  return { items, thisMonthCount, add, update, remove };
}

// ── Users ─────────────────────────────────────────────────────────────────────
export function useUsers() {
  const [items, setItems] = useState<AdminUser[]>(() => usersDB.list());

  const add = useCallback((item: Omit<AdminUser, 'id'>) => {
    const n = usersDB.add(item); setItems(usersDB.list()); return n;
  }, []);
  const update = useCallback((item: AdminUser) => {
    usersDB.update(item); setItems(usersDB.list());
  }, []);
  const remove = useCallback((id: string) => {
    usersDB.delete(id); setItems(usersDB.list());
  }, []);
  const resetPassword = useCallback((id: string, newPw: string) => {
    const user = usersDB.list().find(u => u.id === id);
    if (!user) return;
    usersDB.update({ ...user, passwordHash: simpleHash(newPw) });
    setItems(usersDB.list());
  }, []);
  const toggleActive = useCallback((id: string) => {
    const user = usersDB.list().find(u => u.id === id);
    if (!user) return;
    usersDB.update({ ...user, active: !user.active });
    setItems(usersDB.list());
  }, []);

  return { items, add, update, remove, resetPassword, toggleActive };
}

// ── Settings ──────────────────────────────────────────────────────────────────
export function useSettings() {
  const [settings, setSettings] = useState<SchoolSettings>(() => settingsDB.get());

  const save = useCallback((s: SchoolSettings) => {
    settingsDB.save(s);
    setSettings(s);
  }, []);

  return { settings, save };
}

// ── Dashboard stats (aggregates all modules) ──────────────────────────────────
export function useDashboardStats() {
  const [stats, setStats] = useState(() => computeStats());

  function computeStats() {
    const students = sDB.list().filter(s => s.status === 'Active').length;
    const staff = staffDB.list().filter(s => s.status === 'Active').length;
    const pending = admissionsDB.list().filter(a => a.status === 'Pending' || a.status === 'Under Review').length;
    const eventsThisMonth = eventsDB.countThisMonth();
    return { students, staff, pending, eventsThisMonth };
  }

  // Refresh whenever called (e.g. after accept/reject)
  const refresh = useCallback(() => setStats(computeStats()), []);

  // Auto-refresh every 5 seconds to catch cross-tab changes
  useEffect(() => {
    const t = setInterval(() => setStats(computeStats()), 5000);
    return () => clearInterval(t);
  }, []);

  return { ...stats, refresh };
}
