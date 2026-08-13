import React, { useState } from 'react';
import { Plus, Search, Filter, Briefcase, AlertOctagon, Clock, CheckCircle2, UserCheck, Tag, Trash2, CheckSquare, Square, ChevronDown, ChevronUp, Flame } from 'lucide-react';
import QuickAddTaskBar from '../components/QuickAddTaskBar';

export default function TasksPoolView({ tasks, onCreateTask, onUpdateTask, onDeleteTask, onOpenPomodoro }) {
  const [filterTab, setFilterTab] = useState('ALL'); // ALL, BOSS, STALE, OVERDUE, URGENT
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newSubtaskText, setNewSubtaskText] = useState({});

  // Form state for creating new task
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    source: 'BOSS',
    assignedBy: 'Sếp Minh',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // 3 days default buffer
    estimatedMinutes: 45,
    subItems: []
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const calculateDaysRemaining = (dueDateStr) => {
    if (!dueDateStr) return null;
    const diffTime = new Date(dueDateStr) - new Date(todayStr);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    if (filterTab === 'BOSS') return task.source === 'BOSS';
    if (filterTab === 'OVERDUE') return task.dueDate && task.dueDate < todayStr && task.status !== 'DONE';
    if (filterTab === 'STALE') return task.status === 'TODO' || task.status === 'IN_PROGRESS';
    if (filterTab === 'URGENT') return task.priority === 'URGENT' || task.priority === 'HIGH';
    return true;
  });

  const handleSubmitNewTask = (e) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;
    onCreateTask(newTaskForm);
    setIsModalOpen(false);
    setNewTaskForm({
      title: '',
      description: '',
      source: 'BOSS',
      assignedBy: 'Sếp Minh',
      priority: 'HIGH',
      status: 'TODO',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      estimatedMinutes: 45,
      subItems: []
    });
  };

  const handleToggleSubItem = (task, subItemId) => {
    const updatedSubItems = (task.subItems || []).map(item =>
      item.id === subItemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateTask(task.id, { ...task, subItems: updatedSubItems });
  };

  const handleAddSubItem = (task) => {
    const text = newSubtaskText[task.id];
    if (!text || !text.trim()) return;

    const existingSubItems = task.subItems || [];
    const newSub = {
      title: text.trim(),
      completed: false,
      orderIndex: existingSubItems.length
    };
    onUpdateTask(task.id, { ...task, subItems: [...existingSubItems, newSub] });
    setNewSubtaskText({ ...newSubtaskText, [task.id]: '' });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Kho Nhiệm vụ Master</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý toàn bộ công việc, theo dõi % tiến độ và đếm ngược hạn chót.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/80 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Form tạo đầy đủ
        </button>
      </div>

      {/* Smart Quick Add 1-Line Bar */}
      <QuickAddTaskBar onCreateTask={onCreateTask} />

      {/* Filter Tabs & Search */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'BOSS', label: 'Sếp giao', icon: Briefcase, color: 'amber' },
            { id: 'STALE', label: 'Tồn đọng', icon: Clock, color: 'blue' },
            { id: 'OVERDUE', label: 'Quá hạn', icon: AlertOctagon, color: 'red' },
            { id: 'URGENT', label: 'Gấp', icon: Tag, color: 'purple' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map(task => {
          const isBoss = task.source === 'BOSS';
          const daysLeft = calculateDaysRemaining(task.dueDate);
          const isOverdue = daysLeft !== null && daysLeft < 0 && task.status !== 'DONE';
          const isExpanded = expandedTaskId === task.id;
          const progress = task.progressPercentage || (task.status === 'DONE' ? 100 : 0);

          return (
            <div key={task.id} className="glass-card p-4.5 rounded-2xl space-y-3 flex flex-col justify-between border border-slate-800/90 hover:border-slate-700/80 transition-all">
              <div>
                {/* Badges & Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isBoss && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> Sếp giao
                      </span>
                    )}
                    {task.priority === 'URGENT' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        Gấp
                      </span>
                    )}
                    {/* Countdown Deadline Badge */}
                    {daysLeft !== null && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border flex items-center gap-1 ${
                        isOverdue
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : daysLeft === 0
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : daysLeft <= 2
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {isOverdue
                          ? `Trễ ${Math.abs(daysLeft)} ngày`
                          : daysLeft === 0
                          ? 'Hạn hôm nay'
                          : `Còn ${daysLeft} ngày`}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors p-1"
                    title="Xóa task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-white mt-2 leading-snug">{task.title}</h3>
                {task.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                )}

                {/* Progress Bar % */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Tiến độ công việc</span>
                    <span className={progress === 100 ? 'text-emerald-400' : 'text-indigo-400'}>{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress === 100
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : progress > 50
                          ? 'bg-gradient-to-r from-indigo-500 to-sky-400'
                          : 'bg-gradient-to-r from-amber-500 to-indigo-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Subtasks Expander Toggle */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <button
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <span>Checklist ({task.subItems ? task.subItems.filter(s => s.completed).length : 0}/{task.subItems ? task.subItems.length : 0})</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPomodoro && onOpenPomodoro(task)}
                      className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[11px] font-semibold flex items-center gap-1 transition"
                      title="Bắt đầu phiên Pomodoro"
                    >
                      <Flame className="w-3 h-3 fill-rose-500" />
                      <span>{task.completedPomodoros ? `🍅 x${task.completedPomodoros}` : 'Pomodoro'}</span>
                    </button>

                    <select
                      value={task.status}
                      onChange={(e) => onUpdateTask(task.id, { ...task, status: e.target.value })}
                      className="bg-slate-900 border border-slate-700 text-[11px] font-semibold text-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="TODO">Chờ làm</option>
                      <option value="IN_PROGRESS">Đang làm</option>
                      <option value="DONE">Đã xong</option>
                      <option value="CANCELLED">Hủy</option>
                    </select>
                  </div>
                </div>

                {/* Subtasks Drawer */}
                {isExpanded && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 animate-fade-in text-xs">
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {(task.subItems || []).map(sub => (
                        <div
                          key={sub.id || sub.title}
                          onClick={() => handleToggleSubItem(task, sub.id)}
                          className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
                        >
                          {sub.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span className={sub.completed ? 'line-through text-slate-500' : ''}>{sub.title}</span>
                        </div>
                      ))}
                      {(!task.subItems || task.subItems.length === 0) && (
                        <p className="text-[11px] text-slate-500 italic">Chưa có checklist con.</p>
                      )}
                    </div>

                    {/* Add subtask input */}
                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-800">
                      <input
                        type="text"
                        value={newSubtaskText[task.id] || ''}
                        onChange={(e) => setNewSubtaskText({ ...newSubtaskText, [task.id]: e.target.value })}
                        placeholder="Thêm bước thực hiện..."
                        className="flex-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddSubItem(task)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4 border border-slate-700">
            <h3 className="text-lg font-bold text-white">Thêm Task Mới Form Đầy Đủ</h3>

            <form onSubmit={handleSubmitNewTask} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Tên nhiệm vụ *</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  placeholder="Ví dụ: Đồ án ứng dụng myTask"
                  className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Nguồn việc</label>
                  <select
                    value={newTaskForm.source}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, source: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="BOSS">Sếp giao</option>
                    <option value="SELF">Tự tạo</option>
                    <option value="MEETING">Từ buổi họp</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Người giao việc</label>
                  <input
                    type="text"
                    value={newTaskForm.assignedBy}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedBy: e.target.value })}
                    placeholder="Sếp Minh..."
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Độ ưu tiên</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="URGENT">Rất gấp (Urgent)</option>
                    <option value="HIGH">Cao (High)</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="LOW">Thấp</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Hạn hoàn thành (Mặc định +3 ngày đệm)</label>
                  <input
                    type="date"
                    value={newTaskForm.dueDate}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Mô tả thêm</label>
                <textarea
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  rows={2}
                  className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Lưu task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
