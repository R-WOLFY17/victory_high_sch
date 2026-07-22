import { motion } from 'framer-motion';
import {
  FaUserGraduate, FaUsers, FaClipboard, FaCalendarAlt,
  FaDownload, FaNewspaper, FaImages, FaChartBar,
} from 'react-icons/fa';
import { studentsDB, staffDB, admissionsDB, eventsDB, downloadsDB, newsDB, galleryDB, usersDB } from './db';

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">{value}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: number | string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-2xl font-bold font-poppins text-slate-900 dark:text-white">{value}</div>
        <div className="text-slate-500 dark:text-slate-400 text-xs">{label}</div>
        {sub && <div className="text-slate-400 text-xs mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export default function Analytics() {
  // Live data
  const students = studentsDB.list();
  const staff = staffDB.list();
  const admissions = admissionsDB.list();
  const events = eventsDB.list();
  const downloads = downloadsDB.list();
  const news = newsDB.list();
  const gallery = galleryDB.list();
  const users = usersDB.list();

  const activeStudents = students.filter(s => s.status === 'Active').length;
  const activeStaff = staff.filter(s => s.status === 'Active').length;
  const pendingApps = admissions.filter(a => a.status === 'Pending').length;
  const acceptedApps = admissions.filter(a => a.status === 'Accepted').length;
  const rejectedApps = admissions.filter(a => a.status === 'Rejected').length;
  const reviewApps = admissions.filter(a => a.status === 'Under Review').length;
  const eventsThisMonth = eventsDB.countThisMonth();
  const publishedNews = news.filter(n => n.status === 'published').length;
  const totalDownloads = downloads.reduce((acc, d) => acc + d.downloads, 0);
  const activeUsers = users.filter(u => u.active).length;

  // Students by class
  const classCounts: Record<string, number> = {};
  students.forEach(s => { classCounts[s.class] = (classCounts[s.class] || 0) + 1; });
  const classMax = Math.max(...Object.values(classCounts), 1);

  // Staff by department
  const deptCounts: Record<string, number> = {};
  staff.forEach(s => { deptCounts[s.department] = (deptCounts[s.department] || 0) + 1; });
  const deptMax = Math.max(...Object.values(deptCounts), 1);

  // Admissions by status
  const appStatusData = [
    { label: 'Pending', value: pendingApps, color: 'bg-yellow-500' },
    { label: 'Under Review', value: reviewApps, color: 'bg-blue-500' },
    { label: 'Accepted', value: acceptedApps, color: 'bg-emerald-500' },
    { label: 'Rejected', value: rejectedApps, color: 'bg-red-500' },
  ];
  const appMax = Math.max(...appStatusData.map(a => a.value), 1);

  // Gender distribution
  const maleStudents = students.filter(s => s.gender === 'Male').length;
  const femaleStudents = students.filter(s => s.gender === 'Female').length;
  const genderMax = Math.max(maleStudents, femaleStudents, 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FaUserGraduate} label="Active Students" value={activeStudents} sub={`${students.length} total`} color="text-blue-600 bg-blue-100 dark:bg-blue-900/30" />
        <StatCard icon={FaUsers} label="Active Staff" value={activeStaff} sub={`${staff.length} total`} color="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" />
        <StatCard icon={FaClipboard} label="Applications" value={admissions.length} sub={`${pendingApps} pending`} color="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" />
        <StatCard icon={FaCalendarAlt} label="Events This Month" value={eventsThisMonth} sub={`${events.length} total`} color="text-purple-600 bg-purple-100 dark:bg-purple-900/30" />
        <StatCard icon={FaNewspaper} label="Published News" value={publishedNews} sub={`${news.length} total articles`} color="text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30" />
        <StatCard icon={FaDownload} label="Total Downloads" value={totalDownloads} sub={`${downloads.length} files`} color="text-teal-600 bg-teal-100 dark:bg-teal-900/30" />
        <StatCard icon={FaImages} label="Gallery Images" value={gallery.length} color="text-pink-600 bg-pink-100 dark:bg-pink-900/30" />
        <StatCard icon={FaChartBar} label="Active Users" value={activeUsers} sub={`${users.length} total`} color="text-orange-600 bg-orange-100 dark:bg-orange-900/30" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Students by class */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold font-poppins text-slate-900 dark:text-white mb-4">Students by Class</h3>
          {Object.keys(classCounts).length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No student data</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(classCounts).sort(([a], [b]) => a.localeCompare(b)).map(([cls, count]) => (
                <div key={cls}>
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    <span>{cls}</span>
                    <span>{Math.round((count / activeStudents) * 100)}%</span>
                  </div>
                  <Bar value={count} max={classMax} color="bg-blue-500" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admissions by status */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold font-poppins text-slate-900 dark:text-white mb-4">Admissions by Status</h3>
          {admissions.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No admissions data</p>
          ) : (
            <div className="space-y-3">
              {appStatusData.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    <span>{item.label}</span>
                    <span>{admissions.length > 0 ? Math.round((item.value / admissions.length) * 100) : 0}%</span>
                  </div>
                  <Bar value={item.value} max={appMax} color={item.color} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gender distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold font-poppins text-slate-900 dark:text-white mb-4">Gender Distribution (Students)</h3>
          {students.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No student data</p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  <span>Male</span><span>{students.length > 0 ? Math.round((maleStudents / students.length) * 100) : 0}%</span>
                </div>
                <Bar value={maleStudents} max={genderMax} color="bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  <span>Female</span><span>{students.length > 0 ? Math.round((femaleStudents / students.length) * 100) : 0}%</span>
                </div>
                <Bar value={femaleStudents} max={genderMax} color="bg-pink-500" />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Male: {maleStudents}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-pink-500 inline-block"></span> Female: {femaleStudents}</span>
              </div>
            </div>
          )}
        </div>

        {/* Staff by department */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold font-poppins text-slate-900 dark:text-white mb-4">Staff by Department</h3>
          {staff.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No staff data</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(deptCounts).map(([dept, count]) => (
                <div key={dept}>
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    <span className="truncate max-w-[160px]">{dept}</span>
                    <span>{count}</span>
                  </div>
                  <Bar value={count} max={deptMax} color="bg-emerald-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Downloads leaderboard */}
      {downloads.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold font-poppins text-slate-900 dark:text-white mb-4">Most Downloaded Files</h3>
          <div className="space-y-2">
            {[...downloads].sort((a, b) => b.downloads - a.downloads).slice(0, 5).map((d, i) => (
              <div key={d.id} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">{i + 1}</span>
                <span className="flex-1 text-slate-700 dark:text-slate-300 truncate">{d.title}</span>
                <span className="text-xs text-slate-400">{d.category}</span>
                <span className="font-semibold text-slate-900 dark:text-white w-8 text-right">{d.downloads}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
