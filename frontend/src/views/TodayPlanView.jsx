import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Briefcase, ChevronRight, Plus, Sparkles, Calendar, Download, Flame, Crown, Volume2, LayoutList, CalendarRange, Filter, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getGoogleCalendarUrl, fetchMeetingDossier } from '../services/api';
import ExecutiveCommandBar from '../components/ExecutiveCommandBar';
import ExecutiveTimeline from '../components/ExecutiveTimeline';
import ExecutiveDelegationCard from '../components/ExecutiveDelegationCard';
import ExecutiveMeetingDossierModal from '../components/ExecutiveMeetingDossierModal';
import MiniMonthCalendar from '../components/MiniMonthCalendar';

export default function TodayPlanView({
  plan,
  tasks,
  onToggleItem,
  onOpenNewTaskModal,
  onGoToNightPlanner,
  onOpenPomodoro,
  onExecuteDirectorCommand,
  onOpenBriefingModal,
  briefing
}) {
  const [viewMode, setViewMode] = useState('timeline'); // Default to 'timeline' (Google Calendar style)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'DECISION' | 'MEETING' | 'URGENT' | 'DELEGATION'
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [isLoadingDossier, setIsLoadingDossier] = useState(false);

  const handleOpenDossier = async (e, item) => {
    e.stopPropagation();
    setIsLoadingDossier(true);
    const dossierData = await fetchMeetingDossier(item.taskId);
    setSelectedDossier(dossierData);
    setIsLoadingDossier(false);
  };

  if (!plan || !plan.items || plan.items.length === 0) {
    return (
      <div className="space-y-6">
        <ExecutiveCommandBar onExecuteCommand={onExecuteDirectorCommand} />

        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-12 border border-slate-800/80">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Crown className="w-8 h-8 animate-pulse text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Chưa Có Lịch Trình Giám Đốc Cho Hôm Nay</h2>
            <p className="text-sm text-slate-400 mt-1">
              Thư ký AI đã chuẩn bị sẵn các gợi ý việc quan trọng và cuộc họp. Giám đốc có muốn tự động tạo lịch trình ngay?
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoToNightPlanner}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Thư Ký Tự Động Xếp Lịch Ngay
            </button>
            <button
              onClick={onOpenNewTaskModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700/50 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Thêm Việc Mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = plan.items.filter(i => i.done).length;
  const totalCount = plan.items.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const totalPlannedMinutes = plan.items.reduce((acc, item) => acc + (item.plannedMinutes || 30), 0);

  const handleOpenGoogleCalendar = async (e, item) => {
    e.stopPropagation();
    const url = await getGoogleCalendarUrl(item.taskId, item.taskTitle);
    window.open(url, '_blank');
  };

  const handleExportPlanIcs = (e) => {
    e.stopPropagation();
    if (plan.id) {
      window.open(`/api/calendar/export/plan/${plan.id}.ics`, '_blank');
    } else {
      alert("Xuất file .ics thành công.");
    }
  };

  const filteredItems = plan.items.filter(item => {
    const task = tasks.find(t => t.id === item.taskId);
    if (categoryFilter === 'DECISION') return task?.isDirectorDecision || task?.taskCategory === 'DECISION';
    if (categoryFilter === 'MEETING') return task?.taskCategory === 'MEETING' || task?.title?.toLowerCase().includes('họp');
    if (categoryFilter === 'URGENT') return task?.priority === 'URGENT' || task?.priority === 'HIGH';
    if (categoryFilter === 'DELEGATION') return task?.taskCategory === 'DELEGATION' || task?.source === 'BOSS';
    return true;
  });

  const delegatedTasks = briefing?.delegatedTasks || tasks.filter(t => t.taskCategory === 'DELEGATION' || t.source === 'BOSS');
  const decisionLoadIndex = briefing?.decisionLoadIndex || 40;

  return (
    <div className="space-y-6">
      {/* Fast Command Input Bar */}
      <ExecutiveCommandBar onExecuteCommand={onExecuteDirectorCommand} />

      {/* Decision Fatigue Shield Indicator Bar */}
      <div className="glass-panel p-4 rounded-xl border border-amber-500/20 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            decisionLoadIndex > 75
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : decisionLoadIndex > 50
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}>
            {decisionLoadIndex > 75 ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase text-amber-300">
                Chỉ số tải quyết định (Decision Load)
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                decisionLoadIndex > 75 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {decisionLoadIndex}%
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              {briefing?.decisionLoadWarning || "Tải quyết định ở mức an toàn. Não bộ sẵn sàng cho công việc trọng tâm."}
            </p>
          </div>
        </div>
      </div>

      {/* Secretary Executive Header Banner */}
      <div className="glass-panel p-5 lg:p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-950 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> Lịch Trình Giám Đốc ({plan.planDate})
              </span>

              <button
                onClick={onOpenBriefingModal}
                className="text-xs font-bold text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Báo Cáo Thư Ký AI
              </button>

              <button
                onClick={handleExportPlanIcs}
                className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" /> Xuất .ics
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-3">
              Tiến Độ Hoàn Thành {progressPercent}%
            </h2>
            {briefing?.summaryText && (
              <p className="text-xs text-slate-300 mt-1 italic max-w-xl line-clamp-2">
                "{briefing.summaryText}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400">Tổng quỹ thời gian điều hành</div>
              <div className="text-sm font-bold text-amber-300 flex items-center justify-end gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-amber-400" /> {totalPlannedMinutes} phút (~{(totalPlannedMinutes/60).toFixed(1)}h)
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Đã làm: {completedCount}/{totalCount} mục chỉ đạo</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strategic Delegation Tracker Panel */}
      <ExecutiveDelegationCard delegatedTasks={delegatedTasks} />

      {/* Controls Bar: View Switcher & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Lọc:
          </span>
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'DECISION', label: '👑 Duyệt' },
            { id: 'MEETING', label: '🤝 Họp' },
            { id: 'URGENT', label: '⚡ Gấp' },
            { id: 'DELEGATION', label: '📋 Giao việc' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                categoryFilter === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" /> Danh Sách
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'timeline' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" /> Timeline Gio
          </button>
        </div>
      </div>

      {/* Main View Content: Mini Month Picker + Timeline / List */}
      {viewMode === 'timeline' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Mini Month Calendar Picker (Ảnh 1) */}
          <div className="lg:col-span-4 space-y-4">
            <MiniMonthCalendar
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
              tasks={tasks}
            />
          </div>

          {/* Right Column: Day View Hourly Timeline (Ảnh 2) */}
          <div className="lg:col-span-8">
            <ExecutiveTimeline
              selectedDate={selectedDate}
              items={filteredItems}
              tasks={tasks}
              onToggleItem={onToggleItem}
              onOpenPomodoro={onOpenPomodoro}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Danh Sách Công Việc Giám Đốc
            </h3>
            <button
              onClick={onOpenNewTaskModal}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm Việc
            </button>
          </div>

          <div className="space-y-2.5">
            {filteredItems.map((item, index) => {
              const taskDetails = tasks.find(t => t.id === item.taskId) || { id: item.taskId, title: item.taskTitle };
              const isBossTask = taskDetails?.source === 'BOSS' || taskDetails?.taskCategory === 'DELEGATION';
              const isDecision = taskDetails?.isDirectorDecision || taskDetails?.taskCategory === 'DECISION';
              const isMeeting = taskDetails?.taskCategory === 'MEETING' || taskDetails?.title?.toLowerCase().includes('họp');

              return (
                <div
                  key={item.id || index}
                  onClick={() => onToggleItem(item.id)}
                  className={`glass-card p-4 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 ${
                    item.done ? 'opacity-60 bg-slate-900/40 border-slate-800/40' : 'hover:border-amber-500/40 bg-gradient-to-r from-slate-900 to-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button className="shrink-0 transition-transform active:scale-125">
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-amber-400" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold truncate ${item.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {item.taskTitle}
                        </span>

                        {isDecision && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-400" /> Duyệt
                          </span>
                        )}

                        {isMeeting && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-purple-400" /> Cuộc Họp
                          </span>
                        )}

                        {isBossTask && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> Giao Việc
                          </span>
                        )}

                        {taskDetails?.completedPomodoros > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-rose-500 fill-rose-500" /> 🍅 x{taskDetails.completedPomodoros} ({taskDetails.actualMinutes || 0}m)
                          </span>
                        )}

                        {taskDetails?.priority === 'URGENT' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                            VIỆC GẤP
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        {(item.scheduledTime || taskDetails?.scheduledTime) && (
                          <span className="font-bold text-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> {item.scheduledTime || taskDetails?.scheduledTime}
                          </span>
                        )}
                        {item.plannedMinutes && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" /> {item.plannedMinutes} phút
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isMeeting && (
                      <button
                        onClick={(e) => handleOpenDossier(e, item)}
                        disabled={isLoadingDossier}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                        title="Xem Hồ Sơ Chuẩn Bị Cuộc Họp 1-Trang"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" /> Hồ Sơ Họp
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenPomodoro) onOpenPomodoro(taskDetails);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                      title="Bật đếm ngược Pomodoro"
                    >
                      <Flame className="w-3.5 h-3.5 fill-rose-500" /> Focus
                    </button>

                    <button
                      onClick={(e) => handleOpenGoogleCalendar(e, item)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 transition"
                      title="Thêm vào Google Calendar"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pre-Meeting Dossier Modal */}
      {selectedDossier && (
        <ExecutiveMeetingDossierModal
          dossier={selectedDossier}
          onClose={() => setSelectedDossier(null)}
        />
      )}
    </div>
  );
}
