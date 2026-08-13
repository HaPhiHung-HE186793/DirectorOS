const BASE_URL = '/api';

// Initial mock data if backend server is not connected
let mockTasks = [
  {
    id: 1,
    title: "Review báo cáo doanh thu quý 3 với sếp",
    description: "Sếp giao ngày 8/8, cần tổng hợp dữ liệu chi tiết.",
    status: "IN_PROGRESS",
    priority: "URGENT",
    source: "BOSS",
    assignedBy: "Sếp Minh",
    createdAt: "2026-08-08T09:00:00",
    dueDate: "2026-08-11",
    estimatedMinutes: 60
  },
  {
    id: 2,
    title: "Cập nhật tài liệu API dự án mới",
    description: "Cần hoàn thiện Swagger docs trước khi giao cho team FE.",
    status: "PENDING",
    priority: "HIGH",
    source: "BOSS",
    assignedBy: "Sếp Minh",
    createdAt: "2026-08-07T14:30:00",
    dueDate: "2026-08-10",
    estimatedMinutes: 90
  },
  {
    id: 3,
    title: "Tối ưu hóa performance database PostgreSQL",
    description: "Tạo index cho bảng transactions.",
    status: "PENDING",
    priority: "MEDIUM",
    source: "SELF",
    assignedBy: null,
    createdAt: "2026-08-10T10:00:00",
    dueDate: "2026-08-12",
    estimatedMinutes: 45
  },
  {
    id: 4,
    title: "Đọc 30 trang sách 'Atomic Habits'",
    description: "Mục tiêu phát triển bản thân hàng ngày.",
    status: "COMPLETED",
    priority: "LOW",
    source: "SELF",
    assignedBy: null,
    createdAt: "2026-08-11T07:00:00",
    dueDate: "2026-08-11",
    estimatedMinutes: 30
  }
];

let mockPlans = [
  {
    id: 101,
    planDate: new Date().toISOString().split('T')[0],
    note: "Plan tập trung xử lý dứt điểm công việc sếp giao",
    items: [
      { id: 1, taskId: 1, taskTitle: "Review báo cáo doanh thu quý 3 với sếp", orderIndex: 1, plannedMinutes: 60, done: false },
      { id: 4, taskId: 4, taskTitle: "Đọc 30 trang sách 'Atomic Habits'", orderIndex: 2, plannedMinutes: 30, done: true }
    ]
  }
];

export const fetchTasks = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/tasks?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.content || data;
    }
  } catch (err) {
    console.warn("Backend API not reachable, using local fallback state.");
  }
  return mockTasks;
};

export const fetchStaleTasks = async (days = 3) => {
  try {
    const res = await fetch(`${BASE_URL}/tasks/stale?days=${days}`);
    if (res.ok) return await res.json();
  } catch (err) {}
  return mockTasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS');
};

export const fetchOverdueTasks = async () => {
  try {
    const res = await fetch(`${BASE_URL}/tasks/overdue`);
    if (res.ok) return await res.json();
  } catch (err) {}
  const today = new Date().toISOString().split('T')[0];
  return mockTasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'COMPLETED');
};

export const createTask = async (taskData) => {
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const newTask = {
    id: Date.now(),
    ...taskData,
    status: taskData.status || 'PENDING',
    createdAt: new Date().toISOString()
  };
  mockTasks.unshift(newTask);
  return newTask;
};

export const updateTask = async (id, taskData) => {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const idx = mockTasks.findIndex(t => t.id === id);
  if (idx !== -1) {
    mockTasks[idx] = { ...mockTasks[idx], ...taskData };
    return mockTasks[idx];
  }
  return null;
};

export const deleteTask = async (id) => {
  try {
    await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });
  } catch (err) {}
  mockTasks = mockTasks.filter(t => t.id !== id);
};

export const logPomodoroSession = async (taskId, minutesSpent = 25) => {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/pomodoro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutesSpent, autoUpdateStatus: true })
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const idx = mockTasks.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    const task = mockTasks[idx];
    const newActual = (task.actualMinutes || 0) + minutesSpent;
    const newPomodoros = (task.completedPomodoros || 0) + 1;
    const newStatus = task.status === 'TODO' || task.status === 'PENDING' ? 'IN_PROGRESS' : task.status;
    mockTasks[idx] = {
      ...task,
      actualMinutes: newActual,
      completedPomodoros: newPomodoros,
      status: newStatus
    };
    return mockTasks[idx];
  }
  return null;
};

export const fetchTodayPlan = async () => {
  try {
    const res = await fetch(`${BASE_URL}/plans/today`);
    if (res.ok) return await res.json();
  } catch (err) {}
  const todayStr = new Date().toISOString().split('T')[0];
  return mockPlans.find(p => p.planDate === todayStr) || null;
};

export const generateTomorrowPlan = async (dateStr) => {
  try {
    const res = await fetch(`${BASE_URL}/plans/generate?date=${dateStr}`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {}

  const candidateTasks = mockTasks.filter(t => t.status !== 'COMPLETED');
  return {
    date: dateStr,
    candidateTasks: candidateTasks
  };
};

export const createPlan = async (planData) => {
  try {
    const res = await fetch(`${BASE_URL}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData)
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const newPlan = {
    id: Date.now(),
    planDate: planData.planDate,
    note: planData.note,
    items: planData.items.map(item => {
      const t = mockTasks.find(x => x.id === item.taskId);
      return {
        id: Date.now() + Math.random(),
        taskId: item.taskId,
        taskTitle: t ? t.title : 'Task',
        orderIndex: item.orderIndex,
        plannedMinutes: item.plannedMinutes,
        done: false
      };
    })
  };
  mockPlans.push(newPlan);
  return newPlan;
};

export const triggerTelegramTest = async (msg) => {
  try {
    const res = await fetch(`${BASE_URL}/notifications/test-telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    if (res.ok) return await res.json();
  } catch (err) {}
  return { sent: false, message: "Mock: Telegram simulated send." };
};

export const triggerEmailTest = async (email, subject, message) => {
  try {
    const res = await fetch(`${BASE_URL}/notifications/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, message })
    });
    if (res.ok) return await res.json();
  } catch (err) {}
  return { sent: true, recipient: email || "mock@user.com", subject: subject || "Test Email" };
};

export const triggerNightReminderNow = async () => {
  try {
    const res = await fetch(`${BASE_URL}/notifications/trigger-night-reminder`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {}
  return {
    success: true,
    triggeredAt: new Date().toISOString(),
    messageContent: "🌙 [myTask Simulation] Đã chạy nhắc nhở 21:00 thành công!"
  };
};

export const fetchAnalyticsSummary = async () => {
  try {
    const res = await fetch(`${BASE_URL}/analytics/summary`);
    if (res.ok) return await res.json();
  } catch (err) {}

  const total = mockTasks.length;
  const completed = mockTasks.filter(t => t.status === 'COMPLETED').length;
  const boss = mockTasks.filter(t => t.source === 'BOSS').length;
  const bossDone = mockTasks.filter(t => t.source === 'BOSS' && t.status === 'COMPLETED').length;

  return {
    totalTasks: total,
    completedTasks: completed,
    pendingTasks: total - completed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    bossTasksTotal: boss,
    bossTasksCompleted: bossDone,
    bossCompletionRate: boss > 0 ? Math.round((bossDone / boss) * 100) : 0,
    totalEstimatedMinutes: 225,
    overdueTasksCount: 1,
    weeklyStats: [
      { date: "2026-08-05", createdCount: 2, completedCount: 2 },
      { date: "2026-08-06", createdCount: 3, completedCount: 1 },
      { date: "2026-08-07", createdCount: 1, completedCount: 3 },
      { date: "2026-08-08", createdCount: 4, completedCount: 2 },
      { date: "2026-08-09", createdCount: 2, completedCount: 2 },
      { date: "2026-08-10", createdCount: 3, completedCount: 4 },
      { date: "2026-08-11", createdCount: 2, completedCount: 1 }
    ]
  };
};

export const getGoogleCalendarUrl = async (taskId, taskTitle) => {
  try {
    const res = await fetch(`${BASE_URL}/calendar/google-link/task/${taskId}`);
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
  } catch (err) {}
  const title = encodeURIComponent("[myTask] " + (taskTitle || "Task"));
  const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${todayStr}/${todayStr}`;
};
