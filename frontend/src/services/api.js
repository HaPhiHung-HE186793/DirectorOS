const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

export const fetchExecutiveBriefing = async () => {
  try {
    const res = await fetch(`${BASE_URL}/secretary/briefing`);
    if (res.ok) return await res.json();
  } catch (err) {}

  const active = mockTasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'DONE');
  const decisions = active.filter(t => t.isDirectorDecision || t.taskCategory === 'DECISION');
  const meetings = active.filter(t => t.taskCategory === 'MEETING' || t.title.toLowerCase().includes('họp'));
  const urgents = active.filter(t => t.priority === 'URGENT' || t.priority === 'HIGH');
  const delegated = active.filter(t => t.taskCategory === 'DELEGATION' || t.source === 'BOSS');

  return {
    date: new Date().toISOString().split('T')[0],
    greeting: "Kính chào Giám đốc! Chúc Giám đốc một ngày làm việc quyết đoán và thành công rực rỡ.",
    summaryText: `Hôm nay Giám đốc có tổng cộng ${active.length} công việc cần xử lý. Trong đó có ${decisions.length} mục cần trực tiếp phê duyệt và ${meetings.length} cuộc họp đối tác.`,
    totalTasksCount: active.length,
    directorDecisionsCount: decisions.length,
    meetingsCount: meetings.length,
    urgentCount: urgents.length,
    overdueCount: 1,
    decisionTasks: decisions,
    meetingTasks: meetings,
    urgentTasks: urgents,
    delegatedTasks: delegated,
    secretaryAdvice: [
      "⚡ Khuyến nghị Giám đốc phê duyệt các đề xuất tài chính & nhân sự trước 10:30 sáng.",
      "🤝 Thư ký đã kiểm tra lịch và chuẩn bị hồ sơ cho cuộc họp đối tác chiều nay.",
      "🚀 Thời gian từ 14:00 - 15:30 được dành riêng cho tư duy chiến lược (Deep Work)."
    ]
  };
};

export const parseDirectorCommand = async (commandText) => {
  try {
    const res = await fetch(`${BASE_URL}/secretary/parse-command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: commandText })
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  // Fallback mock task creation
  const newTask = {
    id: Date.now(),
    title: commandText.replace(/^(thư ký ơi|nhắc tôi|lên lịch)\s*/i, ''),
    description: `Tạo từ chỉ đạo Giám đốc: "${commandText}"`,
    status: 'TODO',
    priority: commandText.includes('gấp') ? 'URGENT' : 'HIGH',
    source: 'SELF',
    taskCategory: commandText.includes('họp') ? 'MEETING' : commandText.includes('duyệt') ? 'DECISION' : 'ROUTINE',
    scheduledTime: '14:00 - 15:00',
    isDirectorDecision: commandText.includes('duyệt'),
    createdAt: new Date().toISOString()
  };
  mockTasks.unshift(newTask);
  return newTask;
};

export const fetchMeetingDossier = async (taskId) => {
  try {
    const res = await fetch(`${BASE_URL}/secretary/meeting-dossier/${taskId}`);
    if (res.ok) return await res.json();
  } catch (err) {}

  return {
    taskId,
    meetingTitle: "Họp Chiến Lược & Phê Duyệt Kế Hoạch Ngân Sách",
    scheduledTime: "15:00 - 16:00",
    primaryObjective: "Đánh giá hiệu quả đầu tư, duyệt ngân sách bổ sung và chốt KPI cho phòng Kinh doanh & Tài chính.",
    keyAttendees: [
      "Giám đốc (Chủ trì)",
      "Giám đốc Tài chính (CFO)",
      "Trưởng phòng Kế hoạch & Marketing",
      "Thư ký AI (Ghi chép & Theo dõi Action Items)"
    ],
    strategicQuestions: [
      "1. Chỉ số ROI kỳ vọng và điểm hòa vốn của phương án kinh doanh Q4 là bao nhiêu?",
      "2. Rủi ro về dòng tiền khi mở rộng quy mô đã được tính toán kỹ chưa?",
      "3. Deadline cam kết hoàn thành giai đoạn 1 có thể rút ngắn 1 tuần không?"
    ],
    keyContextPoints: [
      "• Báo cáo doanh thu tháng vừa qua đạt 112% so với chỉ tiêu ban đầu.",
      "• Quyết định trước đó: Giám đốc đã đồng ý ngân sách thử nghiệm 15%.",
      "• Đề xuất mới: Xin phê duyệt bổ sung 500 triệu cho chiến dịch Marketing năm mới."
    ],
    recommendedOutcome: "Phê duyệt ngân sách có điều kiện đi kèm KPI tăng trưởng +20%."
  };
};

export const triggerDelegationFollowup = async (taskId) => {
  try {
    const res = await fetch(`${BASE_URL}/secretary/follow-up-delegation/${taskId}`, {
      method: 'POST'
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  return { success: true, message: "Đã gửi thông báo thúc tiến độ tới cấp dưới qua Telegram!" };
};

export const fetchSettings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/settings`);
    if (res.ok) return await res.json();
  } catch (err) {}
  return {};
};

export const saveSettings = async (settingsMap) => {
  try {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsMap)
    });
    if (res.ok) return await res.json();
  } catch (err) {}
  return { success: true, message: "Đã lưu cấu hình (Mô phỏng local)." };
};

const getStoredCalendars = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('directoros_connected_calendars');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
  }
  return [
    { id: 1, accountName: 'Gmail Công Ty VPBank', emailAddress: 'myhung.vpbank@gmail.com', calendarType: 'GMAIL', colorTag: '#3b82f6', syncEnabled: true },
    { id: 2, accountName: 'Gmail Tập Đoàn B', emailAddress: 'director.hung@corp.com', calendarType: 'GMAIL', colorTag: '#8b5cf6', syncEnabled: true }
  ];
};

const saveStoredCalendars = (cals) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('directoros_connected_calendars', JSON.stringify(cals));
  }
};

let mockCalendars = getStoredCalendars();

export const fetchCalendars = async () => {
  try {
    const res = await fetch(`${BASE_URL}/calendars`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        mockCalendars = data;
        saveStoredCalendars(data);
        return data;
      }
    }
  } catch (err) {}
  return mockCalendars;
};

export const addCalendar = async (calendarData) => {
  try {
    const res = await fetch(`${BASE_URL}/calendars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calendarData)
    });
    if (res.ok) {
      const data = await res.json();
      mockCalendars.push(data);
      saveStoredCalendars(mockCalendars);
      return data;
    }
  } catch (err) {}

  const newCal = { ...calendarData, id: Date.now() };
  mockCalendars.push(newCal);
  saveStoredCalendars(mockCalendars);
  return newCal;
};

export const deleteCalendar = async (id) => {
  try {
    await fetch(`${BASE_URL}/calendars/${id}`, { method: 'DELETE' });
  } catch (err) {}
  mockCalendars = mockCalendars.filter(c => c.id !== id && String(c.id) !== String(id));
  saveStoredCalendars(mockCalendars);
};

export const updateCalendar = async (id, updatedData) => {
  try {
    const res = await fetch(`${BASE_URL}/calendars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (res.ok) {
      const data = await res.json();
      mockCalendars = mockCalendars.map(c => (c.id === id || String(c.id) === String(id)) ? data : c);
      saveStoredCalendars(mockCalendars);
      return data;
    }
  } catch (err) {}

  const updated = { id, ...updatedData };
  mockCalendars = mockCalendars.map(c => (c.id === id || String(c.id) === String(id)) ? updated : c);
  saveStoredCalendars(mockCalendars);
  return updated;
};

export const syncCalendars = async (activeCals = []) => {
  try {
    const res = await fetch(`${BASE_URL}/calendars/sync`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {}

  if (!activeCals || activeCals.length < 2) {
    return {
      syncedCount: activeCals ? activeCals.length : 0,
      hasConflicts: false,
      conflictsCount: 0,
      conflicts: []
    };
  }

  return {
    syncedCount: activeCals.length,
    hasConflicts: true,
    conflictsCount: 1,
    conflicts: [
      {
        id: 101,
        timeSlot: "14:00 - 15:00",
        accountA: `${activeCals[0].accountName} (${activeCals[0].emailAddress})`,
        eventA: "Họp Ban Giám Đốc Q3",
        accountB: `${activeCals[1].accountName} (${activeCals[1].emailAddress})`,
        eventB: "Thảo Luận Kế Hoạch Đầu Tư",
        severity: "HIGH",
        suggestion: `Nên dời cuộc họp bên ${activeCals[1].accountName} sang 15:30 cùng ngày.`
      }
    ]
  };
};

// ============================================================
// Calendar View & Special Dates API
// ============================================================

export const fetchCalendarMonth = async (year, month) => {
  try {
    const res = await fetch(`${BASE_URL}/calendar/month?year=${year}&month=${month}`);
    if (res.ok) return await res.json();
  } catch (err) {}

  // Fallback: empty month data
  return {
    year, month,
    totalSpecialDates: 0,
    totalPlanItems: 0,
    totalSyncedEvents: 0,
    dayEvents: {}
  };
};

export const fetchSpecialDates = async () => {
  try {
    const res = await fetch(`${BASE_URL}/special-dates`);
    if (res.ok) return await res.json();
  } catch (err) {}
  return [];
};

export const createSpecialDate = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/special-dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  // Fallback mock
  return { id: Date.now(), ...data, createdAt: new Date().toISOString() };
};

export const updateSpecialDate = async (id, data) => {
  try {
    const res = await fetch(`${BASE_URL}/special-dates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (err) {}
  return { id, ...data };
};

export const deleteSpecialDate = async (id) => {
  try {
    await fetch(`${BASE_URL}/special-dates/${id}`, { method: 'DELETE' });
  } catch (err) {}
};

