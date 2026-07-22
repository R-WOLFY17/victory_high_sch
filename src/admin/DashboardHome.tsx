import { motion } from 'framer-motion';
import { FaUserGraduate, FaUsers, FaClipboard, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { useDashboardStats, useAdmissions } from './useStore';
import { notify } from './Notification';

interface Props {
  onNavigate: (section: string) => void;
  onQuickAction: (action: string) => void;
}

export default function DashboardHome({ onNavigate, onQuickAction }: Props) {
  const stats = useDashboardStats();
  const { items: applications, accept, setUnderReview } = useAdmissions();

  const recentApps = applications
    .filter(a => a.status === 'Pending' || a.status === 'Under Review')
    .slice(0, 5);

  const handleAccept = (id: string, name: string) => {
    const admNum = accept(id);
    stats.refresh();
    notify.success(`${name} accepted! Admission Number: ${admNum}`);
  };

  const handleReview = (id: string, name: string) => {
    setUnderReview(id);
    notify.info(`${name} moved to Under Review`);
  };

  const cards = [
    {
      label: 'Total Students',
      value: stats.students.toString(),
      icon: FaUserGraduate,
      change: '',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Teaching Staff',
      value: stats.staff.toString(),
      icon: FaUsers,
      change: '',
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      label: 'New Applications',
      value: stats.pending.toString(),
      icon: FaClipboard,
      change: stats.pending > 0 ? `${stats.pending} pending` : '',
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      label: 'Events This Month',
      value: stats.eventsThisMonth.toString(),
      icon: FaCalendarAlt,
      change: '',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  const quickActions = [
    { label: 'Add News', action: 'News' },
    { label: 'Upload Gallery', action: 'Gallery' },
    { label: 'Add Event', action: 'Events' },
    { label: 'New Download', action: 'Downloads' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {cards.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div className="text-2xl font-bold font-poppins text-slate-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
            {stat.change && (
              <div className="text-yellow-600 dark:text-yellow-400 text-xs font-semibold mt-1">
                {stat.change}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold font-poppins text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={() => onQuickAction(action.action)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors text-left flex items-center gap-2"
              >
                <FaPlus size={12} />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-poppins text-slate-900 dark:text-white">
              Recent Applications
            </h3>
            <button
              onClick={() => onNavigate('Admissions')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentApps.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No pending applications</p>
            ) : (
              recentApps.map(app => (
                <div key={app.id} className="flex items-center justify-between text-sm border-b border-slate-100 dark:border-slate-700 pb-2">
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {app.studentName}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs ml-2">
                      — {app.desiredClass}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(app.id, app.studentName)}
                      className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReview(app.id, app.studentName)}
                      className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
