import React, { useState, useEffect } from 'react';
import { fetchAnalyticsSummary } from '../services/api';
import { BarChart3, CheckCircle2, AlertTriangle, Briefcase, Clock, TrendingUp, ShieldAlert, Award } from 'lucide-react';

export default function AnalyticsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchAnalyticsSummary();
    setData(res);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const maxDailyCount = Math.max(
    ...data.weeklyStats.flatMap(s => [s.createdCount, s.completedCount]),
    1
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Phân tích Hiệu suất & Thói quen
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Theo dõi xu hướng hoàn thành công việc, tỷ lệ xử lý việc sếp giao và quản lý thời gian cá nhân.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition"
        >
          Cập nhật số liệu
        </button>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Completion Rate */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Tỷ lệ Hoàn thành</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{data.completionRate}%</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${data.completionRate}%` }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{data.completedTasks} / {data.totalTasks} công việc đã xong</p>
        </div>

        {/* Metric 2: Boss Tasks Completion Rate */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-purple-400 tracking-wider">Việc Sếp Giao (BOSS)</p>
              <h3 className="text-3xl font-extrabold text-purple-300 mt-2">{data.bossCompletionRate}%</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${data.bossCompletionRate}%` }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{data.bossTasksCompleted} / {data.bossTasksTotal} việc sếp hoàn thành</p>
        </div>

        {/* Metric 3: Overdue Tasks Alert */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-rose-400 tracking-wider">Công việc Quá hạn</p>
              <h3 className="text-3xl font-extrabold text-rose-400 mt-2">{data.overdueTasksCount}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6">
            {data.overdueTasksCount > 0 ? "Cần ưu tiên xử lý trong Plan 21:00 hôm nay!" : "Tốt lắm! Không có việc quá hạn."}
          </p>
        </div>

        {/* Metric 4: Total Estimated Time */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-amber-400 tracking-wider">Tổng Quỹ Thời Gian</p>
              <h3 className="text-3xl font-extrabold text-amber-300 mt-2">
                {Math.floor(data.totalEstimatedMinutes / 60)}h {data.totalEstimatedMinutes % 60}m
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6">Tổng thời gian dự kiến cho các nhiệm vụ</p>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Biểu đồ Năng suất 7 Ngày Qua
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 bg-indigo-500 rounded"></span> Tạo mới
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 bg-emerald-500 rounded"></span> Hoàn thành
            </span>
          </div>
        </div>

        <div className="h-56 flex items-end justify-between gap-2 pt-8 pb-2 border-b border-slate-800/80 px-2">
          {data.weeklyStats.map((stat, idx) => {
            const dateLabel = new Date(stat.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' });
            const createdHeight = (stat.createdCount / maxDailyCount) * 160;
            const completedHeight = (stat.completedCount / maxDailyCount) * 160;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="flex items-end gap-1.5 h-full w-full justify-center">
                  {/* Created Bar */}
                  <div
                    style={{ height: `${Math.max(createdHeight, 6)}px` }}
                    className="w-3 md:w-5 bg-indigo-500/80 group-hover:bg-indigo-400 rounded-t transition-all relative"
                    title={`Ngày ${stat.date}: Tạo ${stat.createdCount} việc`}
                  >
                    {stat.createdCount > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-medium">
                        {stat.createdCount}
                      </span>
                    )}
                  </div>

                  {/* Completed Bar */}
                  <div
                    style={{ height: `${Math.max(completedHeight, 6)}px` }}
                    className="w-3 md:w-5 bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t transition-all relative"
                    title={`Ngày ${stat.date}: Xong ${stat.completedCount} việc`}
                  >
                    {stat.completedCount > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-emerald-400 font-medium">
                        {stat.completedCount}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap mt-1">{dateLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Insights & Guidance */}
      <div className="glass-card p-6 rounded-2xl space-y-3 border border-indigo-500/20 bg-indigo-950/10">
        <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2">
          💡 Gợi ý Thói quen & Tối ưu Năng suất (Habit Insights)
        </h3>
        <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-purple-300">Việc sếp giao ({data.bossTasksTotal} việc):</strong> Tỷ lệ hoàn thành đạt <strong>{data.bossCompletionRate}%</strong>. {data.bossCompletionRate >= 80 ? "Rất tuyệt vời! Bạn đang duy trì uy tín cao với cấp trên." : "Hãy đặt ưu tiên số 1 cho các việc từ Sếp trong Night Planner 21:00."}
          </li>
          <li>
            <strong className="text-indigo-300">Quy trình 21:00 Night Planner:</strong> Duy trì ngồi chốt kế hoạch 5 phút mỗi tối giúp giảm 80% áp lực công việc mỗi sáng khi ngủ dậy.
          </li>
        </ul>
      </div>
    </div>
  );
}
