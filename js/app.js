// Application State
let state = {
  subjects: [],
  schedule: [], // Array of { id, subjectId, day, time }
  userSettings: {
    userName: '',
    botName: '',
    botAvatar: '',
    botAvatarType: 'image', // 'text' or 'image'
    botAvatarImage: 'resources/profile.png',
    theme: 'classic',
    customColors: {
      primary: '#00a884',
      bg: '#0b141a',
      header: '#1f2c34',
      bubbleSent: '#005c4b',
      bubbleReceived: '#202c33'
    },
    bgImage: 'default',
    onboardingStep: 0
  },
  messages: [] // { text, isSent, customHTML, time }
};

// Day names mapping
const WEEKDAYS = {
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
  0: 'Domingo'
};

// Predefined course data
const COURSE_DATA = {
  'licenciatura_computacao': {
    name: 'Licenciatura em Computação',
    subjects: [
      { name: 'Algoritmos e Lógica de Programação', totalClasses: 120, absences: 0 },
      { name: 'Ambientes Virtuais de Aprendizagem', totalClasses: 100, absences: 0 },
      { name: 'História da Educação', totalClasses: 60, absences: 0 },
      { name: 'Inglês Aplicado à Informática II', totalClasses: 40, absences: 0 },
      { name: 'Práticas Curriculares em Sociedade II', totalClasses: 40, absences: 0 },
      { name: 'Psicologia da Educação', totalClasses: 60, absences: 0 },
      { name: 'Sociologia da Educação', totalClasses: 60, absences: 0 }
    ],
    schedule: [
      // Segunda-feira
      { day: 1, time: '19:00', room: '461A' },
      { day: 1, time: '19:45', room: '461A' },
      { day: 1, time: '20:30', room: '461A' },
      { day: 1, time: '21:30', room: '461A' },
      // Terça-feira
      { day: 2, time: '19:00', room: '433C' },
      { day: 2, time: '19:45', room: '433C' },
      { day: 2, time: '20:30', room: '433C' },
      { day: 2, time: '21:30', room: '631B' },
      { day: 2, time: '22:15', room: '613B' },
      // Quarta-feira
      { day: 3, time: '19:00', room: '413A' },
      { day: 3, time: '19:45', room: '413A' },
      { day: 3, time: '20:30', room: '413A' },
      { day: 3, time: '21:30', room: '416A' },
      { day: 3, time: '22:15', room: '416A' },
      // Quinta-feira
      { day: 4, time: '19:00', room: '433C' },
      { day: 4, time: '19:45', room: '433C' },
      { day: 4, time: '20:30', room: '433C' },
      { day: 4, time: '21:30', room: '437C' },
      { day: 4, time: '22:15', room: '437C' },
      // Sexta-feira
      { day: 5, time: '19:00', room: '632B' },
      { day: 5, time: '19:45', room: '632B' },
      { day: 5, time: '20:30', room: '632B' },
      { day: 5, time: '21:30', room: '632B' },
      { day: 5, time: '22:15', room: '632B' }
    ]
  },
  'design': {
    name: 'Bacharelado em Design',
    subjects: [
      { name: 'Computação Gráfica I', totalClasses: 60, absences: 0 },
      { name: 'Desenho de Observação e Expressão I', totalClasses: 60, absences: 0 },
      { name: 'Desenho Geométrico', totalClasses: 60, absences: 0 },
      { name: 'Desenho Técnico', totalClasses: 40, absences: 0 },
      { name: 'Fundamentos do Design', totalClasses: 40, absences: 0 },
      { name: 'Geometria Descritiva', totalClasses: 60, absences: 0 },
      { name: 'História da Arte I', totalClasses: 40, absences: 0 },
      { name: 'Inglês I', totalClasses: 40, absences: 0 },
      { name: 'Introdução ao Design', totalClasses: 40, absences: 0 },
      { name: 'Perspectiva', totalClasses: 40, absences: 0 }
    ],
    schedule: [
      // Segunda-feira
      { day: 1, time: '19:00', room: '229' },
      { day: 1, time: '19:45', room: '229' },
      { day: 1, time: '20:30', room: '227' },
      { day: 1, time: '21:30', room: '227' },
      { day: 1, time: '22:15', room: '227' },
      // Terça-feira
      { day: 2, time: '19:00', room: '227' },
      { day: 2, time: '19:45', room: '227' },
      { day: 2, time: '20:30', room: '229' },
      { day: 2, time: '21:30', room: '229' },
      // Quarta-feira
      { day: 3, time: '19:00', room: '229' },
      { day: 3, time: '19:45', room: '229' },
      { day: 3, time: '20:30', room: '229' },
      { day: 3, time: '21:30', room: '229' },
      { day: 3, time: '22:15', room: '229' },
      // Quinta-feira
      { day: 4, time: '19:00', room: '227' },
      { day: 4, time: '19:45', room: '227' },
      { day: 4, time: '20:30', room: '151B' },
      { day: 4, time: '21:30', room: '233' },
      { day: 4, time: '22:15', room: '233' },
      // Sexta-feira
      { day: 5, time: '19:00', room: '227' },
      { day: 5, time: '19:45', room: '227' },
      { day: 5, time: '20:30', room: '227' },
      { day: 5, time: '21:30', room: '227' },
      { day: 5, time: '22:15', room: '227' }
    ]
  }
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const chatStatus = document.getElementById('chat-status');
const messageInput = document.getElementById('message-input');
const btnSend = document.getElementById('btn-send');
const btnSettingsHeader = document.getElementById('btn-settings-header');
const btnCloseSettings = document.getElementById('btn-close-settings');
const settingsDrawer = document.getElementById('settings-drawer');
const btnAddSubject = document.getElementById('btn-add-subject');
const subjectsList = document.getElementById('subjects-list');
const scheduleDaysContainer = document.getElementById('schedule-days-container');
const tabSubjects = document.getElementById('tab-subjects');
const tabSchedule = document.getElementById('tab-schedule');
const panelSubjects = document.getElementById('panel-subjects');
const panelSchedule = document.getElementById('panel-schedule');
const subjectModal = document.getElementById('subject-modal');
const btnCancelSubject = document.getElementById('btn-cancel-subject');
const subjectForm = document.getElementById('subject-form');

// Schedule Modal Elements
const scheduleModal = document.getElementById('schedule-modal');
const btnAddScheduleSlot = document.getElementById('btn-add-schedule-slot');
const btnCancelSchedule = document.getElementById('btn-cancel-schedule');
const scheduleForm = document.getElementById('schedule-form-element');
const scheduleSubjectSelect = document.getElementById('schedule-subject');
const scheduleDaySelect = document.getElementById('schedule-day');
const scheduleTimeInput = document.getElementById('schedule-time');
const scheduleRoomInput = document.getElementById('schedule-room');

// Appearance Elements
const tabAppearance = document.getElementById('tab-appearance');
const panelAppearance = document.getElementById('panel-appearance');
const cfgUserName = document.getElementById('cfg-user-name');
const cfgBotName = document.getElementById('cfg-bot-name');
const cfgBotAvatar = document.getElementById('cfg-bot-avatar');
const cfgThemePreset = document.getElementById('cfg-theme-preset');
const customColorControls = document.getElementById('custom-color-controls');
const cfgColorPrimary = document.getElementById('cfg-color-primary');
const cfgColorBg = document.getElementById('cfg-color-bg');
const cfgColorHeader = document.getElementById('cfg-color-header');
const cfgColorSent = document.getElementById('cfg-color-sent');
const cfgColorReceived = document.getElementById('cfg-color-received');

const cfgBotAvatarFile = document.getElementById('cfg-bot-avatar-file');
const btnSaveAppearance = document.getElementById('btn-save-appearance');

// Temporary variables for uploaded images
let tempAvatarBase64 = '';


// Helper to compress and resize images
function compressAndResizeImage(file, maxWidth, maxHeight, callback) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      callback(dataUrl);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// Load Data from LocalStorage
function loadData() {
  const savedState = localStorage.getItem('posso_faltar_hoje_state');
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      if (!Array.isArray(state.schedule)) {
        // Convert old schedule format if it exists
        state.schedule = [];
      }
    } catch (e) {
      console.error('Error parsing saved state', e);
    }
  }
  
  // Ensure userSettings exists
  if (!state.userSettings) {
    state.userSettings = {
      userName: '',
      botName: '',
      botAvatar: '',
      botAvatarType: 'image',
      botAvatarImage: 'resources/profile.png',
      theme: 'classic',
      customColors: {
        primary: '#00a884',
        bg: '#0b141a',
        header: '#1f2c34',
        bubbleSent: '#005c4b',
        bubbleReceived: '#202c33'
      },
      bgImage: 'default',
      onboardingStep: 0
    };
  } else if (state.userSettings.onboardingStep < 4) {
    // Reset cached defaults if onboarding was not completed
    state.userSettings.botName = '';
    state.userSettings.botAvatar = '';
    state.userSettings.botAvatarType = 'image';
    state.userSettings.botAvatarImage = 'resources/profile.png';
  }


  if (!state.userSettings.botAvatarImage) {
    state.userSettings.botAvatarType = 'image';
    state.userSettings.botAvatarImage = 'resources/profile.png';
  }
}

// Save Data to LocalStorage
function saveData() {
  localStorage.setItem('posso_faltar_hoje_state', JSON.stringify(state));
}

// Helper: Get Current Time string
function getCurrentTimeString() {
  const now = new Date();
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Helper: Format date for a specific day offset
function getDateStringForDay(dayIndex) {
  const now = new Date();
  const currentDay = now.getDay();
  let targetDate = new Date();
  
  if (dayIndex !== currentDay) {
    let diff = dayIndex - currentDay;
    if (diff < 0) diff += 7; // Target is next week
    targetDate.setDate(now.getDate() + diff);
  }
  
  const day = String(targetDate.getDate()).padStart(2, '0');
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const year = targetDate.getFullYear();
  return `${WEEKDAYS[dayIndex]}, ${day}/${month}/${year}`;
}

// Append Chat Message
function appendMessage(text, isSent, customHTML = null, skipSave = false) {
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
  
  if (customHTML) {
    bubble.innerHTML = customHTML;
  } else {
    bubble.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
  }
  
  const timeStr = getCurrentTimeString();
  const time = document.createElement('span');
  time.className = 'time-stamp';
  time.innerText = timeStr;
  bubble.appendChild(time);
  
  chatMessages.appendChild(bubble);
  scrollToBottom();

  if (!skipSave) {
    if (!state.messages) state.messages = [];
    state.messages.push({ text, isSent, customHTML: customHTML || null, time: timeStr });
    saveData();
  }

  return bubble;
}

// Scroll chat to bottom
function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 50);
}

// Show Typing Indicator
let typingIndicatorElem = null;
function showTypingIndicator() {
  if (typingIndicatorElem) return;
  
  chatStatus.innerText = 'digitando...';
  chatStatus.style.color = 'var(--whatsapp-green)';
  
  const bubble = document.createElement('div');
  bubble.className = 'typing-bubble';
  bubble.id = 'typing-indicator';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'typing-dot';
    bubble.appendChild(dot);
  }
  
  chatMessages.appendChild(bubble);
  typingIndicatorElem = bubble;
  scrollToBottom();
}

// Hide Typing Indicator
function hideTypingIndicator() {
  if (typingIndicatorElem) {
    typingIndicatorElem.remove();
    typingIndicatorElem = null;
  }
  chatStatus.innerText = 'online';
  chatStatus.style.color = '';
}

// Append Option Buttons to the Chat
function appendOptionButtons(options, horizontal = false) {
  const container = document.createElement('div');
  container.className = 'chat-action-buttons';
  if (horizontal) {
    container.classList.add('horizontal');
  }
  
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = `chat-btn-option ${opt.class || ''}`;
    btn.innerText = opt.text;
    btn.onclick = () => {
      container.remove();
      // Render user's choice as a message
      appendMessage(opt.text, true);
      opt.action();
    };
    container.appendChild(btn);
  });
  
  chatMessages.appendChild(container);
  scrollToBottom();
}

// Check Attendance and generate Report for a specific day
function generateVerdictReport(targetDay) {
  if (state.subjects.length === 0) {
    return {
      success: false,
      message: 'Epa, calma aí! Você ainda não cadastrou nenhuma matéria. Configura lá nas opções no topo direito ⚙️ antes de me perguntar!'
    };
  }

  // Filter schedule slots for target day
  const targetSlots = state.schedule.filter(slot => parseInt(slot.day) === targetDay);
  
  if (targetDay === 6 || targetDay === 0) {
    return {
      success: true,
      canSkip: true,
      noClasses: true,
      message: `Final de semana! (${WEEKDAYS[targetDay]}) Não há aulas agendadas. Aproveite para descansar!`
    };
  }
  
  if (targetSlots.length === 0) {
    return {
      success: true,
      canSkip: true,
      noClasses: true,
      message: `Não há aulas cadastradas para ${WEEKDAYS[targetDay]} na sua grade horária. Aproveite seu dia de folga!`
    };
  }
  
  // Sort slots by time
  targetSlots.sort((a, b) => a.time.localeCompare(b.time));
  
  // Generate schedule HTML for the day
  let scheduleHTML = '';
  targetSlots.forEach(slot => {
    const sub = state.subjects.find(s => s.id === slot.subjectId);
    if (!sub) return;
    
    scheduleHTML += `
      <div class="schedule-item">
        <div class="schedule-time">${slot.time}</div>
        <div class="schedule-subject">${sub.name}</div>
        <div class="schedule-room">Sala ${slot.room}</div>
      </div>
    `;
  });
  
  // Calculate frequencies and impacts
  let canSkipAll = true;
  let reportDetailsHTML = '';
  let subjectsToUpdate = []; // Unique subjects that occur on this day
  
  targetSlots.forEach(slot => {
    const sub = state.subjects.find(s => s.id === slot.subjectId);
    if (!sub) return;
    
    if (!subjectsToUpdate.includes(sub.id)) {
      subjectsToUpdate.push(sub.id);
    }
  });

  subjectsToUpdate.forEach(subId => {
    const sub = state.subjects.find(s => s.id === subId);
    if (!sub) return;
    
    // Count how many classes this subject has on this day
    const occurrencesCount = targetSlots.filter(slot => slot.subjectId === subId).length;
    
    const totalClasses = parseInt(sub.totalClasses);
    const absences = parseInt(sub.absences);
    const maxAbsences = Math.floor(totalClasses * 0.25);
    const currentFrequency = ((totalClasses - absences) / totalClasses) * 100;
    
    // Impact: user misses all classes of this subject scheduled for this day
    const newAbsences = absences + occurrencesCount;
    const projectedFrequency = ((totalClasses - newAbsences) / totalClasses) * 100;
    const meetsCriteria = projectedFrequency >= 75.0;
    
    if (!meetsCriteria) {
      canSkipAll = false;
    }
    
    const freqClass = currentFrequency < 75.0 ? 'status-danger' : (projectedFrequency < 75.0 ? 'status-danger' : 'status-success');
    
    reportDetailsHTML += `
      <li class="report-item ${freqClass}">
        <span class="report-item-name">${sub.name}</span>
        <div class="report-item-stats">
          <span>Atual: <strong>${absences}/${maxAbsences}</strong> faltas &middot; ${currentFrequency.toFixed(1)}%</span>
          <span class="report-item-projected">Se faltar: <strong>${newAbsences}/${maxAbsences}</strong> &middot; ${projectedFrequency.toFixed(1)}%</span>
        </div>
      </li>
    `;
  });
  
  const verdictHTML = `
    <div class="schedule-container">
      <div class="schedule-title">Grade Horária</div>
      <div class="schedule-list">
        ${scheduleHTML}
      </div>
    </div>
    <div class="report-section">
      <div class="report-title">Análise de Faltas</div>
      <ul class="report-details">
        ${reportDetailsHTML}
      </ul>
    </div>
  `;
  
  return {
    success: true,
    canSkip: canSkipAll,
    noClasses: false,
    html: verdictHTML,
    subjectIdsToAbsence: targetSlots.map(slot => slot.subjectId)
  };
}

// Analyze user message to detect requested day
function detectTargetDayFromMessage(message) {
  // Normalize string: convert to lower case, separate accents, and remove diacritics
  const msg = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  
  if (msg.includes('segunda')) return 1;
  if (msg.includes('terca')) return 2;
  if (msg.includes('quarta')) return 3;
  if (msg.includes('quinta')) return 4;
  if (msg.includes('sexta')) return 5;
  if (msg.includes('sabado')) return 6;
  if (msg.includes('domingo')) return 0;
  if (msg.includes('amanha')) {
    return (new Date().getDay() + 1) % 7;
  }
  
  // Default to today if they mention "hoje" or it contains "posso faltar" generally
  if (msg.includes('hoje') || msg.includes('posso faltar')) {
    return new Date().getDay();
  }
  
  return null;
}

// Theme presets configurations
const THEME_PRESETS = {
  classic: {
    primary: '#00a884',
    bg: '#0b141a',
    header: '#1f2c34',
    bubbleSent: '#005c4b',
    bubbleReceived: '#202c33',
    textMain: '#e9edef'
  },
  ocean: {
    primary: '#3b82f6',
    bg: '#0f172a',
    header: '#1e293b',
    bubbleSent: '#1d4ed8',
    bubbleReceived: '#334155',
    textMain: '#f8fafc'
  },
  grape: {
    primary: '#a855f7',
    bg: '#180f2a',
    header: '#251642',
    bubbleSent: '#7e22ce',
    bubbleReceived: '#3b2269',
    textMain: '#fae8ff'
  },
  rose: {
    primary: '#ec4899',
    bg: '#1c0a13',
    header: '#2e1222',
    bubbleSent: '#be185d',
    bubbleReceived: '#4c1d3b',
    textMain: '#fdf2f8'
  },
  sunset: {
    primary: '#f97316',
    bg: '#1a0d05',
    header: '#2c160b',
    bubbleSent: '#c2410c',
    bubbleReceived: '#47230f',
    textMain: '#fff7ed'
  }
};

function applyThemeSettings() {
  if (!state.userSettings) return;
  const settings = state.userSettings;
  
  const nameDisplay = document.getElementById('bot-name-display');
  const avatarText = document.getElementById('bot-avatar-text');
  const botAvatar = document.getElementById('bot-avatar');
  
  if (nameDisplay) nameDisplay.innerText = settings.botName || 'Posso faltar hoje?';
  
  if (botAvatar) {
    if (settings.botAvatarType === 'image' && settings.botAvatarImage) {
      botAvatar.style.backgroundImage = `url("${settings.botAvatarImage}")`;
      botAvatar.style.backgroundSize = 'cover';
      botAvatar.style.backgroundPosition = 'center';
      if (avatarText) avatarText.innerText = '';
    } else {
      botAvatar.style.backgroundImage = 'none';
      if (avatarText) avatarText.innerText = settings.botAvatar || '🤖';
    }
  }
  
  let colors = THEME_PRESETS[settings.theme];
  if (settings.theme === 'custom' && settings.customColors) {
    colors = settings.customColors;
  }
  
  if (colors) {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', colors.bg);
    root.style.setProperty('--header-bg', colors.header);
    root.style.setProperty('--input-bg', lightenDarkenColor(colors.header, 10));
    root.style.setProperty('--bubble-sent', colors.primary);
    root.style.setProperty('--bubble-received', colors.bubbleReceived);
    root.style.setProperty('--whatsapp-green', colors.primary);
    root.style.setProperty('--whatsapp-green-hover', lightenDarkenColor(colors.primary, -15));
    root.style.setProperty('--text-main', colors.textMain || '#e9edef');
  }

}

function lightenDarkenColor(col, amt) {
  let usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  let num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

// Bot response processor
function processUserMessage(messageText) {
  showTypingIndicator();
  
  setTimeout(() => {
    hideTypingIndicator();
    
    // Onboarding flow
    if (state.userSettings.onboardingStep === 1) {
      state.userSettings.userName = messageText.trim();
      state.userSettings.onboardingStep = 2;
      saveData();
      appendMessage(`Prazer em te conhecer, ${state.userSettings.userName}! 😊`, false);
      appendMessage('Qual é o seu curso?', false);
      
      // Show course selection buttons
      appendOptionButtons([
        { text: 'Licenciatura em Computação', class: 'primary', action: () => selectCourse('licenciatura_computacao') },
        { text: 'Bacharelado em Design', class: 'primary', action: () => selectCourse('design') },
        { text: 'Outro', class: 'primary', action: () => selectCourse('other') }
      ]);
      return;
    }
    
    if (state.userSettings.onboardingStep === 2) {
      // This step is handled by button clicks, not text input
      appendMessage('Por favor, selecione um curso usando os botões acima.', false);
      return;
    }
    
    if (state.userSettings.onboardingStep === 3) {
      state.userSettings.botName = messageText.trim();
      // Generate initials for avatar
      let initials = 'IF';
      const cleanName = state.userSettings.botName.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      const words = cleanName.split(/\s+/);
      if (words.length >= 2) {
        initials = (words[0][0] + words[1][0]).toUpperCase();
      } else if (cleanName.length > 0) {
        initials = cleanName.substring(0, 2).toUpperCase();
      }
      state.userSettings.botAvatar = initials;
      state.userSettings.onboardingStep = 4;
      saveData();
      
      applyThemeSettings();
      
      appendMessage(`Pronto! Tudo configurado! 🎉`, false);
      appendMessage('Quando quiser saber seus horários ou faltas é só me informar o dia da semana desejado!', false);
      appendMessage('⚠️ Não esqueça de configurar suas faltas atuais no SUAP através das configurações (⚙️) para que eu possa calcular corretamente sua frequência!', false);
      return;
    }
    
    const targetDay = detectTargetDayFromMessage(messageText);
    
    if (targetDay === null) {
      appendMessage('Desculpe, não entendi muito bem. 😅', false);
      appendMessage('Por favor, digite sua pergunta informando o dia que deseja consultar.', false);
      return;
    }
    
    const report = generateVerdictReport(targetDay);
    
    if (!report.success) {
      appendMessage(report.message, false);
      return;
    }
    
    if (report.noClasses) {
      appendMessage(report.message, false);
      return;
    }
    
    // Show report
    appendMessage('', false, report.html);
    
    // Ask if user will skip classes (dynamic question based on day)
    const dayName = WEEKDAYS[targetDay];
    const isToday = targetDay === new Date().getDay();
    const dayReference = isToday ? 'hoje' : dayName.toLowerCase();
    
    appendMessage(`Você vai faltar às aulas ${dayReference}?`, false);
    appendOptionButtons([
      { text: 'Sim', class: 'danger', action: () => logAbsenceForSubjectIds(report.subjectIdsToAbsence) },
      { text: 'Não', class: 'primary', action: () => logPresence() }
    ], true);
    
  }, 1200);
}

// Action: Log Absences
function logAbsenceForSubjectIds(subjectIds) {
  showTypingIndicator();
  
  setTimeout(() => {
    hideTypingIndicator();
    
    let updatedNames = [];
    
    // We group by subject so if a subject appears twice in a day, we count absences accordingly
    const countMap = {};
    subjectIds.forEach(id => {
      countMap[id] = (countMap[id] || 0) + 1;
    });

    for (let id in countMap) {
      const sub = state.subjects.find(s => s.id === id);
      if (sub) {
        sub.absences = parseInt(sub.absences) + countMap[id];
        updatedNames.push(`${sub.name} (+${countMap[id]} faltas)`);
      }
    }
    
    saveData();
    renderSubjects();
    
    appendMessage(`Falta registrada com sucesso!`, false);
    appendMessage(`- ${updatedNames.join('\n- ')}`, false);
    appendMessage('Sua frequência foi atualizada no painel!', false);
  }, 800);
}

// Action: Log Presence
function logPresence() {
  showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    appendMessage(`Perfeito! Bons estudos e boa aula! 📚✨`, false);
  }, 800);
}

// Select Course and load predefined data
function selectCourse(courseId) {
  // Clear existing data
  state.subjects = [];
  state.schedule = [];

  if (courseId === 'other') {
    // For "Outro", leave subjects and schedule empty
    saveData();
    
    // Move to next onboarding step
    state.userSettings.onboardingStep = 3;
    saveData();
    
    appendMessage(`Entendido! Você configurará suas disciplinas e grade horária manualmente.`, false);
    appendMessage('E como você gostaria de me chamar?', false);
    return;
  }

  const courseData = COURSE_DATA[courseId];
  if (!courseData) {
    appendMessage('Erro ao carregar dados do curso. Por favor, tente novamente.', false);
    return;
  }

  // Load subjects
  courseData.subjects.forEach(sub => {
    const newId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    state.subjects.push({
      id: newId,
      name: sub.name,
      totalClasses: sub.totalClasses,
      absences: sub.absences
    });
  });

  // Load schedule (map subject names to IDs)
  const subjectMap = {};
  state.subjects.forEach(sub => {
    subjectMap[sub.name] = sub.id;
  });

  // For Licenciatura em Computação, map schedule slots to specific subjects
  if (courseId === 'licenciatura_computacao') {
    const subjectOrder = [
      'Algoritmos e Lógica de Programação', // 4x Segunda
      'Sociologia da Educação',             // 3x Terça
      'Práticas Curriculares em Sociedade II', // 2x Terça
      'Psicologia da Educação',             // 3x Quarta
      'Algoritmos e Lógica de Programação', // 2x Quarta
      'História da Educação',               // 3x Quinta
      'Inglês Aplicado à Informática II',   // 2x Quinta
      'Ambientes Virtuais de Aprendizagem'  // 5x Sexta
    ];

    let subjectIndex = 0;
    courseData.schedule.forEach((slot) => {
      const subjectName = subjectOrder[subjectIndex];
      const subjectId = subjectMap[subjectName];

      if (subjectId) {
        state.schedule.push({
          id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          subjectId: subjectId,
          day: slot.day,
          time: slot.time,
          room: slot.room
        });
      }

      // Move to next subject when day changes or based on slot count
      if (slot.day === 1 && slot.time === '21:30') subjectIndex = 1; // After 4th slot Monday (end of Monday)
      if (slot.day === 2 && slot.time === '20:30') subjectIndex = 2; // After 3rd slot Tuesday (Sociologia ends)
      if (slot.day === 2 && slot.time === '22:15') subjectIndex = 3; // After 5th slot Tuesday (end of Tuesday)
      if (slot.day === 3 && slot.time === '20:30') subjectIndex = 4; // After 3rd slot Wednesday (Psicologia ends)
      if (slot.day === 3 && slot.time === '22:15') subjectIndex = 5; // After 5th slot Wednesday (end of Wednesday)
      if (slot.day === 4 && slot.time === '20:30') subjectIndex = 6; // After 3rd slot Thursday (História ends)
      if (slot.day === 4 && slot.time === '22:15') subjectIndex = 7; // After 5th slot Thursday (end of Thursday)
      // Friday ends with Ambientes Virtuais de Aprendizagem (subjectIndex 7)
    });
  } else if (courseId === 'design') {
    // For Bacharelado em Design, map schedule slots to specific subjects
    const subjectOrder = [
      'Introdução ao Design',              // 2x Segunda 19:00, 19:45
      'Geometria Descritiva',              // 3x Segunda 20:30, 21:30, 22:15
      'Inglês I',                          // 2x Terça 19:00, 19:45
      'Fundamentos do Design',             // 2x Terça 20:30, 21:30
      'História da Arte I',                // 2x Quarta 19:00, 19:45
      'Desenho de Observação e Expressão I', // 3x Quarta 20:30, 21:30, 22:15
      'Desenho Técnico',                   // 2x Quinta 19:00, 19:45
      'Computação Gráfica I',              // 3x Quinta 20:30, 21:30, 22:15
      'Perspectiva',                       // 2x Sexta 19:00, 19:45
      'Desenho Geométrico'                 // 3x Sexta 20:30, 21:30, 22:15
    ];

    let subjectIndex = 0;
    courseData.schedule.forEach((slot) => {
      const subjectName = subjectOrder[subjectIndex];
      const subjectId = subjectMap[subjectName];

      if (subjectId) {
        state.schedule.push({
          id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          subjectId: subjectId,
          day: slot.day,
          time: slot.time,
          room: slot.room
        });
      }

      // Move to next subject based on slot count per day
      if (slot.day === 1 && slot.time === '19:45') subjectIndex = 1; // After 2nd slot Monday (Introdução ends)
      if (slot.day === 1 && slot.time === '22:15') subjectIndex = 2; // After 5th slot Monday (end of Monday)
      if (slot.day === 2 && slot.time === '19:45') subjectIndex = 3; // After 2nd slot Tuesday (Inglês ends)
      if (slot.day === 2 && slot.time === '21:30') subjectIndex = 4; // After 4th slot Tuesday (end of Tuesday)
      if (slot.day === 3 && slot.time === '19:45') subjectIndex = 5; // After 2nd slot Wednesday (História ends)
      if (slot.day === 3 && slot.time === '22:15') subjectIndex = 6; // After 5th slot Wednesday (end of Wednesday)
      if (slot.day === 4 && slot.time === '19:45') subjectIndex = 7; // After 2nd slot Thursday (Desenho Técnico ends)
      if (slot.day === 4 && slot.time === '22:15') subjectIndex = 8; // After 5th slot Thursday (end of Thursday)
      if (slot.day === 5 && slot.time === '19:45') subjectIndex = 9; // After 2nd slot Friday (Perspectiva ends)
      
    });
  } else {
    // For other courses, use simple cycling
    courseData.schedule.forEach((slot, index) => {
      const subjectIndex = index % courseData.subjects.length;
      const subjectName = courseData.subjects[subjectIndex].name;
      const subjectId = subjectMap[subjectName];

      if (subjectId) {
        state.schedule.push({
          id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          subjectId: subjectId,
          day: slot.day,
          time: slot.time,
          room: slot.room
        });
      }
    });
  }

  saveData();
  
  // Move to next onboarding step
  state.userSettings.onboardingStep = 3;
  saveData();
  
  appendMessage(`Ótimo! Configurei as disciplinas e a grade horária para ${courseData.name}. 📚`, false);
  appendMessage('E como você gostaria de me chamar?', false);
}

// Informal greeting variations
const INFORMAL_GREETINGS = [
  "Eaí, ta afim de faltar hoje? 😏",
  "E aí, vai encarar a faculdade hoje ou prefere ficar na cama? 🛌",
  "Salve! Pensando em meter o louco e faltar hoje? 💥",
  "Eaí, a cama tá te puxando mais forte que a aula hoje? 😴",
  "Fala aí! Quer saber se dá pra tirar uma folguinha hoje? 🤫",
  "E aí, vai dar as caras na aula ou o edredom venceu? 🥶",
  "Epa! Pensando em dar aquele migué hoje? 🙈",
  "Salve! Pronto pra simular o estrago se você não for hoje? 📊",
  "Eaí, de boa? Quer saber se dá pra faltar hoje sem dar ruim? 😬",
  "Fala parceiro! Vai encarar o professor ou hoje é dia de descanso? ☕"
];

// Handle Bot Greeting when open
function triggerGreeting() {
  showTypingIndicator();
  
  setTimeout(() => {
    hideTypingIndicator();
    
    if (state.userSettings && state.userSettings.onboardingStep < 4) {
      state.userSettings.onboardingStep = 1;
      saveData();
      appendMessage("Antes de começarmos, como você gostaria de ser chamado(a)?", false);
    } else {
      const userNameStr = (state.userSettings && state.userSettings.userName) ? `, ${state.userSettings.userName}` : '';
      const customGreetings = INFORMAL_GREETINGS.map(g => {
        return g.replace("parceiro", (state.userSettings && state.userSettings.userName) || "parceiro")
                .replace("Eaí, de boa?", `Eaí ${(state.userSettings && state.userSettings.userName) || 'de boa'}, tudo bem?`)
                .replace("Eaí, ta afim", `Eaí${userNameStr}, tá a fim`)
                .replace("E aí, vai encarar", `E aí${userNameStr}, vai encarar`)
                .replace("Salve!", `Salve${userNameStr}!`)
                .replace("Fala aí!", `Fala aí${userNameStr}!`)
                .replace("Epa!", `Epa${userNameStr}!`);
      });
      const randomIndex = Math.floor(Math.random() * customGreetings.length);
      const greeting = customGreetings[randomIndex];
      appendMessage(greeting, false);
    }
  }, 1000);
}

// Drawer tabs logic
tabSubjects.onclick = () => {
  tabSubjects.classList.add('active');
  tabSchedule.classList.remove('active');
  tabAppearance.classList.remove('active');
  panelSubjects.classList.add('active');
  panelSchedule.classList.remove('active');
  panelAppearance.classList.remove('active');
};

tabSchedule.onclick = () => {
  tabSchedule.classList.add('active');
  tabSubjects.classList.remove('active');
  tabAppearance.classList.remove('active');
  panelSchedule.classList.add('active');
  panelSubjects.classList.remove('active');
  panelAppearance.classList.remove('active');
  renderScheduleConfig();
};

tabAppearance.onclick = () => {
  tabAppearance.classList.add('active');
  tabSubjects.classList.remove('active');
  tabSchedule.classList.remove('active');
  panelAppearance.classList.add('active');
  panelSubjects.classList.remove('active');
  panelSchedule.classList.remove('active');
  renderAppearanceConfig();
};

// Render Appearance config
function renderAppearanceConfig() {
  if (!state.userSettings) return;
  const settings = state.userSettings;
  
  cfgUserName.value = settings.userName || '';
  cfgBotName.value = settings.botName || '';
  cfgThemePreset.value = settings.theme || 'classic';
  
  cfgBotAvatarFile.value = '';
  tempAvatarBase64 = '';
  
  if (settings.theme === 'custom') {
    customColorControls.style.display = 'flex';
    if (settings.customColors) {
      cfgColorPrimary.value = settings.customColors.primary || '#00a884';
      cfgColorBg.value = settings.customColors.bg || '#0b141a';
      cfgColorHeader.value = settings.customColors.header || '#1f2c34';
      cfgColorSent.value = settings.customColors.sent || '#005c4b';
      cfgColorReceived.value = settings.customColors.received || '#202c33';
    }
  } else {
    customColorControls.style.display = 'none';
  }
}

// Appearance Event Bindings
cfgThemePreset.onchange = () => {
  if (cfgThemePreset.value === 'custom') {
    customColorControls.style.display = 'flex';
  } else {
    customColorControls.style.display = 'none';
  }
};

cfgBotAvatarFile.onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    compressAndResizeImage(file, 160, 160, (base64) => {
      tempAvatarBase64 = base64;
    });
  }
};



btnSaveAppearance.onclick = () => {
  if (!state.userSettings) return;
  
  state.userSettings.userName = cfgUserName.value.trim();
  state.userSettings.botName = cfgBotName.value.trim();
  state.userSettings.theme = cfgThemePreset.value;
  
  if (tempAvatarBase64) {
    state.userSettings.botAvatarType = 'image';
    state.userSettings.botAvatarImage = tempAvatarBase64;
  }
  
  
  if (cfgThemePreset.value === 'custom') {
    state.userSettings.customColors = {
      primary: cfgColorPrimary.value,
      bg: cfgColorBg.value,
      header: cfgColorHeader.value,
      bubbleSent: cfgColorSent.value,
      bubbleReceived: cfgColorReceived.value,
      textMain: '#e9edef'
    };
  }
  
  saveData();
  applyThemeSettings();
  closeSettings();
};

// Settings Drawers Open/Close
function openSettings() {
  settingsDrawer.classList.add('active');
  // Default to Subjects tab on open
  tabSubjects.click();
  renderSubjects();
}

function closeSettings() {
  settingsDrawer.classList.remove('active');
}

btnSettingsHeader.onclick = openSettings;
btnCloseSettings.onclick = closeSettings;

// Subject Modal Open/Close
function openSubjectModal(subject = null) {
  if (subject) {
    document.getElementById('modal-title').innerText = 'Editar Disciplina';
    document.getElementById('subject-id').value = subject.id;
    document.getElementById('subject-name').value = subject.name;
    document.getElementById('subject-total-classes').value = subject.totalClasses;
    document.getElementById('subject-absences').value = subject.absences;
  } else {
    document.getElementById('modal-title').innerText = 'Nova Disciplina';
    document.getElementById('subject-form').reset();
    document.getElementById('subject-id').value = '';
  }
  subjectModal.classList.add('active');
}

function closeSubjectModal() {
  subjectModal.classList.remove('active');
}

btnAddSubject.onclick = () => openSubjectModal();
btnCancelSubject.onclick = closeSubjectModal;

// Save Subject from form
subjectForm.onsubmit = (e) => {
  e.preventDefault();
  const id = document.getElementById('subject-id').value;
  const name = document.getElementById('subject-name').value.trim();
  const totalClasses = parseInt(document.getElementById('subject-total-classes').value);
  const absences = parseInt(document.getElementById('subject-absences').value);

  if (id) {
    const index = state.subjects.findIndex(s => s.id === id);
    if (index !== -1) {
      state.subjects[index] = { id, name, totalClasses, absences };
    }
  } else {
    const newId = 'sub_' + Date.now();
    state.subjects.push({ id: newId, name, totalClasses, absences });
  }

  saveData();
  renderSubjects();
  closeSubjectModal();
};

// Render Subjects List in Drawer
function renderSubjects() {
  subjectsList.innerHTML = '';
  
  if (state.subjects.length === 0) {
    subjectsList.innerHTML = '<p class="tab-desc" style="text-align: center; margin-top: 20px;">Nenhuma disciplina cadastrada ainda.</p>';
    return;
  }

  state.subjects.forEach(sub => {
    const card = document.createElement('div');
    card.className = 'subject-card';

    const maxAbsences = Math.floor(sub.totalClasses * 0.25);
    const frequency = ((sub.totalClasses - sub.absences) / sub.totalClasses) * 100;

    card.innerHTML = `
      <div class="subject-info">
        <h4>${sub.name}</h4>
        <p>Aulas: ${sub.totalClasses} | Faltas: ${sub.absences}/${maxAbsences} (${frequency.toFixed(1)}%)</p>
      </div>
      <div class="subject-actions">
        <button class="action-btn edit" aria-label="Editar">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </button>
        <button class="action-btn delete" aria-label="Excluir">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    `;

    card.querySelector('.edit').onclick = () => openSubjectModal(sub);
    card.querySelector('.delete').onclick = () => deleteSubject(sub.id);

    subjectsList.appendChild(card);
  });
}

// Delete subject
function deleteSubject(id) {
  if (confirm('Tem certeza de que deseja remover esta disciplina?')) {
    state.subjects = state.subjects.filter(s => s.id !== id);
    state.schedule = state.schedule.filter(slot => slot.subjectId !== id);
    saveData();
    renderSubjects();
  }
}

// Open Schedule Modal
function openScheduleModal() {
  // Populate select options
  scheduleSubjectSelect.innerHTML = '';
  if (state.subjects.length === 0) {
    alert('Cadastre disciplinas primeiro na aba Disciplinas!');
    return;
  }
  
  state.subjects.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub.id;
    opt.innerText = sub.name;
    scheduleSubjectSelect.appendChild(opt);
  });

  scheduleTimeInput.value = '08:00';
  scheduleRoomInput.value = '';
  scheduleModal.classList.add('active');
}

function closeScheduleModal() {
  scheduleModal.classList.remove('active');
}

// Render Schedule Config Tab list
function renderScheduleConfig() {
  scheduleDaysContainer.innerHTML = '';
  
  // Show weekdays: Monday (1) to Friday (5)
  const weekdaysToShow = [1, 2, 3, 4, 5];
  
  weekdaysToShow.forEach(dayIndex => {
    const row = document.createElement('div');
    row.className = 'day-config-row';
    row.style.marginBottom = '12px';
    
    const title = document.createElement('h4');
    title.innerText = WEEKDAYS[dayIndex];
    title.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    title.style.paddingBottom = '4px';
    title.style.marginBottom = '8px';
    row.appendChild(title);
    
    // Filter and sort schedule items for this day
    const daySlots = state.schedule.filter(slot => parseInt(slot.day) === dayIndex);
    daySlots.sort((a, b) => a.time.localeCompare(b.time));
    
    const slotsList = document.createElement('div');
    slotsList.style.display = 'flex';
    slotsList.style.flexDirection = 'column';
    slotsList.style.gap = '6px';
    
    if (daySlots.length === 0) {
      const empty = document.createElement('p');
      empty.innerText = 'Sem aulas cadastradas para este dia.';
      empty.style.fontSize = '12px';
      empty.style.color = 'var(--text-muted)';
      slotsList.appendChild(empty);
    } else {
      daySlots.forEach(slot => {
        const sub = state.subjects.find(s => s.id === slot.subjectId);
        if (!sub) return;
        
        const slotEl = document.createElement('div');
        slotEl.style.display = 'flex';
        slotEl.style.justifyContent = 'space-between';
        slotEl.style.alignItems = 'center';
        slotEl.style.backgroundColor = 'rgba(255,255,255,0.02)';
        slotEl.style.padding = '6px 10px';
        slotEl.style.borderRadius = '6px';
        
        slotEl.innerHTML = `
          <span style="font-size: 13px;"><strong>${slot.time}</strong> - ${sub.name}${slot.room ? ` (Sala ${slot.room})` : ''}</span>
          <button class="action-btn delete" style="padding: 2px;" aria-label="Remover">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        `;
        
        slotEl.querySelector('.delete').onclick = () => deleteScheduleSlot(slot.id);
        slotsList.appendChild(slotEl);
      });
    }
    
    row.appendChild(slotsList);
    scheduleDaysContainer.appendChild(row);
  });
}

// Delete schedule slot
function deleteScheduleSlot(id) {
  state.schedule = state.schedule.filter(slot => slot.id !== id);
  saveData();
  renderScheduleConfig();
}

// Add new schedule slot from form submission
scheduleForm.onsubmit = (e) => {
  e.preventDefault();
  const subjectId = scheduleSubjectSelect.value;
  const day = parseInt(scheduleDaySelect.value);
  const time = scheduleTimeInput.value;
  const room = scheduleRoomInput.value.trim();

  const newSlot = {
    id: 'slot_' + Date.now(),
    subjectId,
    day,
    time,
    room
  };

  state.schedule.push(newSlot);
  saveData();
  renderScheduleConfig();
  closeScheduleModal();
};

// Event bindings for Schedule Slots
btnAddScheduleSlot.onclick = openScheduleModal;
btnCancelSchedule.onclick = closeScheduleModal;

// Send user query
function sendMessage() {
  const text = messageInput.value.trim();
  if (text === '') return;
  
  appendMessage(text, true);
  messageInput.value = '';
  
  processUserMessage(text);
}

btnSend.onclick = sendMessage;
messageInput.onkeypress = (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
};



// Restore saved chat messages
function restoreMessages() {
  if (!state.messages || state.messages.length === 0) return;
  // Keep the day divider, append messages after it
  state.messages.forEach(msg => {
    appendMessage(msg.text, msg.isSent, msg.customHTML || null, true);
    // Override the auto-generated time with the saved one
    const bubbles = chatMessages.querySelectorAll('.message-bubble');
    const last = bubbles[bubbles.length - 1];
    if (last) {
      const ts = last.querySelector('.time-stamp');
      if (ts && msg.time) ts.innerText = msg.time;
    }
  });
}

// Clear chat history
function clearHistory() {
  state.messages = [];
  saveData();
  // Remove all bubbles but keep the day divider
  const bubbles = chatMessages.querySelectorAll('.message-bubble, .typing-bubble');
  bubbles.forEach(b => b.remove());
}

const btnClearHistory = document.getElementById('btn-clear-history');
if (btnClearHistory) {
  btnClearHistory.onclick = () => clearHistory();
}

// Init application
window.onload = () => {
  loadData();
  applyThemeSettings();
  if (state.messages && state.messages.length > 0) {
    restoreMessages();
  } else {
    triggerGreeting();
  }
};
