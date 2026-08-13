import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Navigation from './components/Navigation';
import PomodoroModal from './components/PomodoroModal';
import ExecutiveBriefingModal from './components/ExecutiveBriefingModal';
import TodayPlanView from './views/TodayPlanView';
import NightPlannerView from './views/NightPlannerView';
import TasksPoolView from './views/TasksPoolView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import {
  fetchTasks,
  fetchTodayPlan,
  fetchOverdueTasks,
  createTask,
  updateTask,
  deleteTask,
  createPlan,
  triggerNightReminderNow,
  logPomodoroSession,
  fetchExecutiveBriefing,
  parseDirectorCommand
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [tasks, setTasks] = useState([]);
  const [todayPlan, setTodayPlan] = useState(null);
  const [candidateTasks, setCandidateTasks] = useState([]);
  const [briefing, setBriefing] = useState(null);
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState(null);
  const [pomodoroTask, setPomodoroTask] = useState(null);

  const loadData = async () => {
    const tList = await fetchTasks();
    setTasks(tList);

    const pToday = await fetchTodayPlan();
    setTodayPlan(pToday);

    const candidates = await fetchOverdueTasks();
    setCandidateTasks(candidates.length > 0 ? candidates : tList.filter(t => t.status !== 'COMPLETED' && t.status !== 'DONE'));

    const brief = await fetchExecutiveBriefing();
    setBriefing(brief);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePlanItem = (itemId) => {
    if (!todayPlan) return;
    const updatedItems = todayPlan.items.map(item =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    setTodayPlan({ ...todayPlan, items: updatedItems });
  };

  const handleCreateTask = async (taskData) => {
    const created = await createTask(taskData);
    setTasks([created, ...tasks]);
    setNotificationBanner(`✨ Đã tạo công việc mới: "${created.title}"`);
    setTimeout(() => setNotificationBanner(null), 4000);
    loadData();
  };

  const handleExecuteDirectorCommand = async (commandText) => {
    const createdTask = await parseDirectorCommand(commandText);
    if (createdTask) {
      setTasks(prev => [createdTask, ...prev]);

      // If today plan exists, automatically add it to today's items
      if (todayPlan) {
        const newItem = {
          id: Date.now(),
          taskId: createdTask.id,
          taskTitle: createdTask.title,
          orderIndex: todayPlan.items.length + 1,
          plannedMinutes: createdTask.estimatedMinutes || 45,
          scheduledTime: createdTask.scheduledTime || '14:00 - 15:00',
          done: false
        };
        setTodayPlan({
          ...todayPlan,
          items: [...todayPlan.items, newItem]
        });
      }

      setNotificationBanner(`👑 Thư ký AI đã tiếp nhận chỉ đạo: "${createdTask.title}" và xếp lịch thành công!`);
      setTimeout(() => setNotificationBanner(null), 5000);
      loadData();
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    const updated = await updateTask(id, taskData);
    setTasks(tasks.map(t => (t.id === id ? updated : t)));
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleCreatePlan = async (planData) => {
    const created = await createPlan(planData);
    setTodayPlan(created);
    setActiveTab('today');
    setNotificationBanner(`👑 Thư ký AI đã chốt Lịch Giám Đốc cho ngày ${planData.planDate}!`);
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  const handleManualReminderTrigger = async () => {
    const result = await triggerNightReminderNow();
    setNotificationBanner(`🌙 [Kích hoạt nạp Plan 21:00]: ${result.messageContent ? 'Đã chạy tiến trình nhắc nhở!' : 'Thành công!'}`);
    loadData();
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const handlePomodoroSessionComplete = async (taskId, minutesSpent) => {
    const updated = await logPomodoroSession(taskId, minutesSpent);
    if (updated) {
      setTasks(tasks.map(t => (t.id === taskId ? updated : t)));
      setNotificationBanner(`🍅 Xuất sắc! Giám đốc đã hoàn thành phiên tập trung (${minutesSpent}m) cho: "${updated.title}"`);
      setTimeout(() => setNotificationBanner(null), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onTriggerReminder={handleManualReminderTrigger}
        onOpenBriefing={() => setShowBriefingModal(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-8">
        {/* Navigation Sidebar / Bottom Bar */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content View */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {notificationBanner && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-between shadow-lg shadow-amber-500/10 animate-fade-in">
              <span>{notificationBanner}</span>
              <button onClick={() => setNotificationBanner(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {activeTab === 'today' && (
            <TodayPlanView
              plan={todayPlan}
              tasks={tasks}
              briefing={briefing}
              onToggleItem={handleTogglePlanItem}
              onOpenNewTaskModal={() => setActiveTab('tasks')}
              onGoToNightPlanner={() => setActiveTab('night')}
              onOpenPomodoro={(task) => setPomodoroTask(task)}
              onExecuteDirectorCommand={handleExecuteDirectorCommand}
              onOpenBriefingModal={() => setShowBriefingModal(true)}
            />
          )}

          {activeTab === 'night' && (
            <NightPlannerView
              candidateTasks={candidateTasks}
              onCreatePlan={handleCreatePlan}
              onGoToToday={() => setActiveTab('today')}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksPoolView
              tasks={tasks}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onOpenPomodoro={(task) => setPomodoroTask(task)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Pomodoro Focus Modal */}
      {pomodoroTask && (
        <PomodoroModal
          task={pomodoroTask}
          onClose={() => setPomodoroTask(null)}
          onSessionComplete={handlePomodoroSessionComplete}
        />
      )}

      {/* Executive Secretary Morning Briefing Modal */}
      {showBriefingModal && (
        <ExecutiveBriefingModal
          briefing={briefing}
          onClose={() => setShowBriefingModal(false)}
        />
      )}
    </div>
  );
}
