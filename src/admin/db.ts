// ─── Admin Database Layer ───────────────────────────────────────────────────
// All data is persisted to localStorage so everything survives page refreshes.
// This is a fully client-side implementation — swap the read/write calls for
// real REST fetch() calls when you connect a backend.

export type NewsStatus = 'published' | 'draft';
export interface NewsItem {
  id: string;
  title: string;
  content: string;       // rich text (HTML string)
  excerpt: string;
  category: string;
  author: string;
  date: string;          // ISO
  status: NewsStatus;
  featured: boolean;
  imageBase64: string;   // data URL
  slug: string;
}

export interface GalleryImage {
  id: string;
  src: string;           // data URL
  caption: string;
  album: string;
  category: string;
  uploadedAt: string;
}

export type DownloadCategory = 'Admissions' | 'Academic' | 'General' | 'Past Papers' | 'Circulars' | 'Other';
export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: DownloadCategory;
  fileBase64: string;    // data URL
  fileName: string;
  fileSize: string;
  fileType: string;
  downloads: number;
  uploadedAt: string;
}

export type ApplicationStatus = 'Pending' | 'Under Review' | 'Accepted' | 'Rejected';
export interface Admission {
  id: string;
  studentName: string;
  gender: 'Male' | 'Female';
  dob: string;
  desiredClass: string;
  previousSchool: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentRelationship: string;
  address: string;
  applicationDate: string;
  status: ApplicationStatus;
  rejectionReason: string;
  admissionNumber: string;  // set when Accepted
  notes: string;
}

export type StaffStatus = 'Active' | 'On Leave' | 'Inactive';
export interface StaffMember {
  id: string;
  employeeId: string;
  photoBase64: string;
  fullName: string;
  department: string;
  position: string;
  subjects: string;
  phone: string;
  email: string;
  qualifications: string;
  employmentDate: string;
  status: StaffStatus;
}

export type StudentStatus = 'Active' | 'Suspended' | 'Transferred' | 'Graduated';
export interface Student {
  id: string;
  studentId: string;
  admissionNumber: string;
  photoBase64: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dob: string;
  class: string;
  stream: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  status: StudentStatus;
  enrolledDate: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  posterBase64: string;
  category: string;
}

export type UserRole = 'Super Admin' | 'Administrator' | 'Teacher' | 'Admissions Officer' | 'Librarian' | 'Accountant';
export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface SchoolSettings {
  schoolName: string;
  logo: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  heroImage: string;
  welcomeMessage: string;
  vision: string;
  mission: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  admissionsOpen: boolean;
  feesNotice: string;
  admissionInstructions: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  theme: string;
  timezone: string;
  language: string;
}

// ─── Simple hash (not cryptographic — for demo; replace with bcrypt on backend)
export function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16);
}

// ─── ID generator
export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Generic localStorage CRUD
function key(k: string) { return `nvhs_admin_${k}`; }

function load<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(k));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function save<T>(k: string, val: T): void {
  localStorage.setItem(key(k), JSON.stringify(val));
}

// ─── News
export const newsDB = {
  list: (): NewsItem[] => load<NewsItem[]>('news', []),
  save: (items: NewsItem[]) => save('news', items),
  add: (item: Omit<NewsItem, 'id'>): NewsItem => {
    const n: NewsItem = { ...item, id: newId() };
    const list = newsDB.list();
    list.unshift(n);
    newsDB.save(list);
    return n;
  },
  update: (item: NewsItem) => {
    const list = newsDB.list().map(x => x.id === item.id ? item : x);
    newsDB.save(list);
  },
  delete: (id: string) => newsDB.save(newsDB.list().filter(x => x.id !== id)),
};

// ─── Public folder images (always shown in gallery, cannot be deleted via admin)
export const PUBLIC_GALLERY: GalleryImage[] = [
  { id: 'pub-1',  src: '/1.jpeg',  caption: 'School Campus',          album: 'Campus',   category: 'Campus',   uploadedAt: '2025-01-01' },
  { id: 'pub-2',  src: '/2.jpeg',  caption: 'School Life',            album: 'Students', category: 'Students', uploadedAt: '2025-01-01' },
  { id: 'pub-3',  src: '/3.jpeg',  caption: 'Classroom Activities',   album: 'Classrooms', category: 'Classrooms', uploadedAt: '2025-01-01' },
  { id: 'pub-4',  src: '/4.jpeg',  caption: 'Students at Work',       album: 'Students', category: 'Students', uploadedAt: '2025-01-01' },
  { id: 'pub-5',  src: '/5.jpeg',  caption: 'School Environment',     album: 'Campus',   category: 'Campus',   uploadedAt: '2025-01-01' },
  { id: 'pub-6',  src: '/6.jpeg',  caption: 'Learning Together',      album: 'Students', category: 'Students', uploadedAt: '2025-01-01' },
  { id: 'pub-7',  src: '/7.jpeg',  caption: 'School Activities',      album: 'Events',   category: 'Events',   uploadedAt: '2025-01-01' },
  { id: 'pub-8',  src: '/8.jpeg',  caption: 'Campus Grounds',         album: 'Campus',   category: 'Campus',   uploadedAt: '2025-01-01' },
  { id: 'pub-9',  src: '/9.jpeg',  caption: 'Student Life',           album: 'Students', category: 'Students', uploadedAt: '2025-01-01' },
  { id: 'pub-10', src: '/10.jpeg', caption: 'School Moments',         album: 'General',  category: 'General',  uploadedAt: '2025-01-01' },
  { id: 'pub-11', src: '/11.jpeg', caption: 'Academic Excellence',    album: 'Classrooms', category: 'Classrooms', uploadedAt: '2025-01-01' },
  { id: 'pub-12', src: '/12.jpeg', caption: 'School Community',       album: 'General',  category: 'General',  uploadedAt: '2025-01-01' },
  { id: 'pub-13', src: '/13.jpeg', caption: 'School Events',          album: 'Events',   category: 'Events',   uploadedAt: '2025-01-01' },
  { id: 'pub-14', src: '/14.png',  caption: 'Achievements',           album: 'Achievements', category: 'Achievements', uploadedAt: '2025-01-01' },
  { id: 'pub-15', src: '/15.png',  caption: 'School Pride',           album: 'Achievements', category: 'Achievements', uploadedAt: '2025-01-01' },
];

// ─── Gallery
export const galleryDB = {
  // Returns public images first, then any admin-uploaded images
  list: (): GalleryImage[] => {
    const adminUploaded = load<GalleryImage[]>('gallery', []);
    // Merge: public images at the front, admin uploads appended (deduped by id)
    const adminIds = new Set(adminUploaded.map(i => i.id));
    const pubImages = PUBLIC_GALLERY.filter(i => !adminIds.has(i.id));
    return [...pubImages, ...adminUploaded];
  },
  // save only persists admin-uploaded items (not the public statics)
  save: (items: GalleryImage[]) => {
    const adminOnly = items.filter(i => !i.id.startsWith('pub-'));
    save('gallery', adminOnly);
  },
  add: (item: Omit<GalleryImage, 'id'>): GalleryImage => {
    const n: GalleryImage = { ...item, id: newId() };
    const list = galleryDB.list();
    list.unshift(n);
    galleryDB.save(list);
    return n;
  },
  update: (item: GalleryImage) => {
    const list = galleryDB.list().map(x => x.id === item.id ? item : x);
    galleryDB.save(list);
  },
  delete: (id: string) => galleryDB.save(galleryDB.list().filter(x => x.id !== id)),
};

// ─── Downloads
export const downloadsDB = {
  list: (): DownloadItem[] => load<DownloadItem[]>('downloads', []),
  save: (items: DownloadItem[]) => save('downloads', items),
  add: (item: Omit<DownloadItem, 'id'>): DownloadItem => {
    const n: DownloadItem = { ...item, id: newId() };
    const list = downloadsDB.list();
    list.unshift(n);
    downloadsDB.save(list);
    return n;
  },
  update: (item: DownloadItem) => {
    const list = downloadsDB.list().map(x => x.id === item.id ? item : x);
    downloadsDB.save(list);
  },
  delete: (id: string) => downloadsDB.save(downloadsDB.list().filter(x => x.id !== id)),
  incrementDownload: (id: string) => {
    const list = downloadsDB.list().map(x => x.id === id ? { ...x, downloads: x.downloads + 1 } : x);
    downloadsDB.save(list);
  },
};

// ─── Admissions
export const admissionsDB = {
  list: (): Admission[] => load<Admission[]>('admissions', seedAdmissions()),
  save: (items: Admission[]) => save('admissions', items),
  add: (item: Omit<Admission, 'id'>): Admission => {
    const n: Admission = { ...item, id: newId() };
    const list = admissionsDB.list();
    list.unshift(n);
    admissionsDB.save(list);
    return n;
  },
  update: (item: Admission) => {
    const list = admissionsDB.list().map(x => x.id === item.id ? item : x);
    admissionsDB.save(list);
  },
  delete: (id: string) => admissionsDB.save(admissionsDB.list().filter(x => x.id !== id)),
};

// ─── Staff
export const staffDB = {
  list: (): StaffMember[] => load<StaffMember[]>('staff', seedStaff()),
  save: (items: StaffMember[]) => save('staff', items),
  add: (item: Omit<StaffMember, 'id'>): StaffMember => {
    const n: StaffMember = { ...item, id: newId() };
    const list = staffDB.list();
    list.unshift(n);
    staffDB.save(list);
    return n;
  },
  update: (item: StaffMember) => {
    const list = staffDB.list().map(x => x.id === item.id ? item : x);
    staffDB.save(list);
  },
  delete: (id: string) => staffDB.save(staffDB.list().filter(x => x.id !== id)),
};

// ─── Students
export const studentsDB = {
  list: (): Student[] => load<Student[]>('students', seedStudents()),
  save: (items: Student[]) => save('students', items),
  add: (item: Omit<Student, 'id'>): Student => {
    const n: Student = { ...item, id: newId() };
    const list = studentsDB.list();
    list.unshift(n);
    studentsDB.save(list);
    return n;
  },
  update: (item: Student) => {
    const list = studentsDB.list().map(x => x.id === item.id ? item : x);
    studentsDB.save(list);
  },
  delete: (id: string) => studentsDB.save(studentsDB.list().filter(x => x.id !== id)),
  nextAdmissionNumber: (): string => {
    const students = studentsDB.list();
    const year = new Date().getFullYear();
    const count = students.filter(s => s.admissionNumber.startsWith(`NVHS/${year}/`)).length;
    return `NVHS/${year}/${String(count + 1).padStart(4, '0')}`;
  },
};

// ─── Events
export const eventsDB = {
  list: (): SchoolEvent[] => load<SchoolEvent[]>('events', seedEvents()),
  save: (items: SchoolEvent[]) => save('events', items),
  add: (item: Omit<SchoolEvent, 'id'>): SchoolEvent => {
    const n: SchoolEvent = { ...item, id: newId() };
    const list = eventsDB.list();
    list.unshift(n);
    eventsDB.save(list);
    return n;
  },
  update: (item: SchoolEvent) => {
    const list = eventsDB.list().map(x => x.id === item.id ? item : x);
    eventsDB.save(list);
  },
  delete: (id: string) => eventsDB.save(eventsDB.list().filter(x => x.id !== id)),
  countThisMonth: (): number => {
    const now = new Date();
    return eventsDB.list().filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  },
};

// ─── Admin Users
const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-1',
  name: 'Administrator',
  username: 'admin',
  email: 'admin@nvhs.ac.ug',
  passwordHash: simpleHash('admin123'),
  role: 'Super Admin',
  active: true,
  createdAt: '2025-01-01',
  lastLogin: '',
};

export const usersDB = {
  list: (): AdminUser[] => load<AdminUser[]>('users', [DEFAULT_ADMIN]),
  save: (items: AdminUser[]) => save('users', items),
  add: (item: Omit<AdminUser, 'id'>): AdminUser => {
    const n: AdminUser = { ...item, id: newId() };
    const list = usersDB.list();
    list.push(n);
    usersDB.save(list);
    return n;
  },
  update: (item: AdminUser) => {
    const list = usersDB.list().map(x => x.id === item.id ? item : x);
    usersDB.save(list);
  },
  delete: (id: string) => usersDB.save(usersDB.list().filter(x => x.id !== id)),
  authenticate: (email: string, password: string): AdminUser | null => {
    const users = usersDB.list();
    const hash = simpleHash(password);
    const user = users.find(u => (u.email === email || u.username === email) && u.passwordHash === hash && u.active);
    if (user) {
      const updated = { ...user, lastLogin: new Date().toISOString() };
      usersDB.update(updated);
      return updated;
    }
    return null;
  },
};

// ─── Settings
const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'Nyenga Victory High School',
  logo: '',
  motto: 'Now or Never',
  address: 'Ssunga, Nyenga, Buikwe District, Uganda',
  phone: '+256 701 781 310',
  email: 'nyengavictoryhighschool24@gmail.com',
  website: 'www.nyengavictoryhs.ac.ug',
  heroImage: '',
  welcomeMessage: 'Welcome to Nyenga Victory High School',
  vision: 'Building generations that diligently value new initiatives and innovations.',
  mission: 'To produce responsible, disciplined, self-motivated and cultured members of the wide community.',
  facebook: 'https://facebook.com/nyengavictoryhs',
  instagram: 'https://instagram.com/nyengavictoryhs',
  twitter: 'https://twitter.com/nyengavictoryhs',
  youtube: 'https://youtube.com/nyengavictoryhs',
  admissionsOpen: true,
  feesNotice: '',
  admissionInstructions: '',
  smtpHost: '',
  smtpPort: '587',
  smtpUser: '',
  smtpPass: '',
  theme: 'light',
  timezone: 'Africa/Kampala',
  language: 'English',
};

export const settingsDB = {
  get: (): SchoolSettings => load<SchoolSettings>('settings', DEFAULT_SETTINGS),
  save: (s: SchoolSettings) => save('settings', s),
};

// ─── Seed data ───────────────────────────────────────────────────────────────
function seedAdmissions(): Admission[] {
  return [
    { id: 'a1', studentName: 'Mugisha David', gender: 'Male', dob: '2012-03-15', desiredClass: 'S1', previousSchool: 'Nyenga Primary School', parentName: 'Mugisha Robert', parentPhone: '+256 771 234 567', parentEmail: 'mugisha@gmail.com', parentRelationship: 'Father', address: 'Nyenga, Buikwe', applicationDate: new Date().toISOString().slice(0, 10), status: 'Pending', rejectionReason: '', admissionNumber: '', notes: '' },
    { id: 'a2', studentName: 'Namuli Grace', gender: 'Female', dob: '2011-07-20', desiredClass: 'S1', previousSchool: 'Ssunga Primary School', parentName: 'Namuli Sarah', parentPhone: '+256 782 345 678', parentEmail: '', parentRelationship: 'Mother', address: 'Ssunga, Nyenga', applicationDate: new Date().toISOString().slice(0, 10), status: 'Pending', rejectionReason: '', admissionNumber: '', notes: '' },
    { id: 'a3', studentName: 'Ochieng John', gender: 'Male', dob: '2007-11-02', desiredClass: 'S5', previousSchool: 'Lugazi Secondary School', parentName: 'Ochieng Peter', parentPhone: '+256 753 456 789', parentEmail: '', parentRelationship: 'Father', address: 'Lugazi, Buikwe', applicationDate: new Date().toISOString().slice(0, 10), status: 'Under Review', rejectionReason: '', admissionNumber: '', notes: '' },
    { id: 'a4', studentName: 'Nakato Rita', gender: 'Female', dob: '2012-05-18', desiredClass: 'S1', previousSchool: 'Buikwe Parents Primary', parentName: 'Ssekandi James', parentPhone: '+256 700 567 890', parentEmail: '', parentRelationship: 'Father', address: 'Buikwe Town', applicationDate: new Date().toISOString().slice(0, 10), status: 'Pending', rejectionReason: '', admissionNumber: '', notes: '' },
  ];
}

function seedStaff(): StaffMember[] {
  return [
    { id: 's1', employeeId: 'EMP001', photoBase64: '', fullName: 'Mr. John Ssemakula', department: 'Sciences', position: 'Head of Sciences', subjects: 'Mathematics, Physics', phone: '+256 701 111 001', email: 'ssemakula@nvhs.ac.ug', qualifications: 'B.Ed (Science)', employmentDate: '2024-01-15', status: 'Active' },
    { id: 's2', employeeId: 'EMP002', photoBase64: '', fullName: 'Ms. Agnes Namutebi', department: 'Humanities', position: 'English Teacher', subjects: 'English Language, Literature', phone: '+256 701 111 002', email: 'namutebi@nvhs.ac.ug', qualifications: 'B.A. Education', employmentDate: '2024-01-15', status: 'Active' },
    { id: 's3', employeeId: 'EMP003', photoBase64: '', fullName: 'Mr. Patrick Kiggundu', department: 'Sciences', position: 'Biology Teacher', subjects: 'Biology, Chemistry', phone: '+256 701 111 003', email: 'kiggundu@nvhs.ac.ug', qualifications: 'B.Sc. Education', employmentDate: '2024-02-01', status: 'Active' },
  ];
}

function seedStudents(): Student[] {
  return [
    { id: 'st1', studentId: 'STD001', admissionNumber: 'NVHS/2024/0001', photoBase64: '', fullName: 'Ssekandi Brian', gender: 'Male', dob: '2011-04-12', class: 'S1', stream: 'West', parentName: 'Ssekandi James', parentPhone: '+256 700 100 001', parentEmail: '', address: 'Nyenga, Buikwe', status: 'Active', enrolledDate: '2024-02-03' },
    { id: 'st2', studentId: 'STD002', admissionNumber: 'NVHS/2024/0002', photoBase64: '', fullName: 'Nakayiza Phiona', gender: 'Female', dob: '2011-08-23', class: 'S1', stream: 'East', parentName: 'Nakayiza Mary', parentPhone: '+256 700 100 002', parentEmail: '', address: 'Ssunga, Nyenga', status: 'Active', enrolledDate: '2024-02-03' },
    { id: 'st3', studentId: 'STD003', admissionNumber: 'NVHS/2024/0003', photoBase64: '', fullName: 'Tumwesige Ronald', gender: 'Male', dob: '2009-01-30', class: 'S3', stream: 'North', parentName: 'Tumwesige Paul', parentPhone: '+256 700 100 003', parentEmail: '', address: 'Lugazi, Buikwe', status: 'Active', enrolledDate: '2024-02-03' },
  ];
}

function seedEvents(): SchoolEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return [
    { id: 'e1', title: 'Term 2 Opening', description: 'Students report for the second term.', date: `${y}-${m}-02`, time: '07:00', location: 'School Grounds', organizer: 'Administration', posterBase64: '', category: 'Academic' },
    { id: 'e2', title: "Parents' Day", description: 'Parents meet class teachers for progress review.', date: `${y}-${m}-28`, time: '09:00', location: 'Assembly Hall', organizer: 'Administration', posterBase64: '', category: 'Parents' },
    { id: 'e3', title: 'Inter-School Debate', description: 'Regional debate championship hosted at NVHS.', date: `${y}-${m}-12`, time: '10:00', location: 'Assembly Hall', organizer: 'Debate Club', posterBase64: '', category: 'Academic' },
  ];
}
