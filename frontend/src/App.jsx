import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Navigation from './components/Navigation';
import PomodoroModal from './components/PomodoroModal';
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
  logPomodoroSession
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [tasks, setTasks] = useState([]);
  const [todayPlan, setTodayPlan] = useState(null);
  const [candidateTasks, setCandidateTasks] = useState([]);
  const [notificationBanner, setNotificationBanner] = useState(null);
  const [pomodoroTask, setPomodoroTask] = useState(null);

  const loadData = async () => {
    const tList = await fetchTasks();
    setTasks(tList);

    const pToday = await fetchTodayPlan();
    setTodayPlan(pToday);

    const candidates = await fetchOverdueTasks();
    setCandidateTasks(candidates.length > 0 ? candidates : tList.filter(t => t.status !== 'COMPLETED'));
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
    setNotificationBanner(`Đã tạo nhiệm vụ mới: "${created.title}"`);
    setTimeout(() => setNotificationBanner(null), 4000);
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
    setNotificationBanner(`✨ Đã chốt Plan cho ngày ${planData.planDate}!`);
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
      setNotificationBanner(`🍅 Xuất sắc! Bạn đã hoàn thành 1 phiên Pomodoro (${minutesSpent}m) cho: "${updated.title}"`);
      setTimeout(() => setNotificationBanner(null), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar onTriggerReminder={handleManualReminderTrigger} activeTab={activeTab} />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-8">
        {/* Navigation Sidebar / Bottom Bar */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content View */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {notificationBanner && (
            <div className="mb-6 p-4 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center justify-between shadow-lg shadow-indigo-500/10 animate-fade-in">
              <span>{notificationBanner}</span>
              <button onClick={() => setNotificationBanner(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {activeTab === 'today' && (
            <TodayPlanView
              plan={todayPlan}
              tasks={tasks}
              onToggleItem={handleTogglePlanItem}
              onOpenNewTaskModal={() => setActiveTab('tasks')}
              onGoToNightPlanner={() => setActiveTab('night')}
              onOpenPomodoro={(task) => setPomodoroTask(task)}
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

      {/* Pomodoro Modal Global Overlay */}
      {pomodoroTask && (
        <PomodoroModal
          task={pomodoroTask}
          onClose={() => setPomodoroTask(null)}
          onSessionComplete={handlePomodoroSessionComplete}
        />
      )}
    </div>
  );
}
