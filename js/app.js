// Application State
let state = {
  subjects: [],
  schedule: [] // Array of { id, subjectId, day, time }
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
function appendMessage(text, isSent, customHTML = null) {
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
  
  if (customHTML) {
    bubble.innerHTML = customHTML;
  } else {
    bubble.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
  }
  
  const time = document.createElement('span');
  time.className = 'time-stamp';
  time.innerText = getCurrentTimeString();
  bubble.appendChild(time);
  
  chatMessages.appendChild(bubble);
  scrollToBottom();
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
function appendOptionButtons(options) {
  const container = document.createElement('div');
  container.className = 'chat-action-buttons';
  
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = `chat-btn-option ${opt.class || ''}`;
    btn.innerText = opt.text;
    btn.onclick = () => {
      container.remove();
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
        <div class="report-item-title">
          <span>${sub.name}</span>
        </div>
        <div>Faltas atuais: <strong>${absences}/${maxAbsences}</strong> (${currentFrequency.toFixed(1)}%)</div>
        <div style="font-size: 12px; margin-top: 3px; color: var(--text-muted);">
          Se faltar nesse dia: <strong>${newAbsences}/${maxAbsences}</strong> (${projectedFrequency.toFixed(1)}%)
        </div>
      </li>
    `;
  });
  
  const verdictClass = canSkipAll ? 'verdict-yes' : 'verdict-no';
  const verdictText = canSkipAll 
    ? `✅ SIM, você pode faltar!` 
    : `❌ NÃO, melhor ir para a aula!`;
  
  const verdictHTML = `
    <div class="report-title">Relatório de Faltas</div>
    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">${getDateStringForDay(targetDay)}</div>
    <div class="report-verdict ${verdictClass}">
      ${verdictText}
    </div>
    <ul class="report-details">
      ${reportDetailsHTML}
    </ul>
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

// Bot response processor
function processUserMessage(messageText) {
  showTypingIndicator();
  
  setTimeout(() => {
    hideTypingIndicator();
    
    const targetDay = detectTargetDayFromMessage(messageText);
    
    if (targetDay === null) {
      appendMessage('Desculpe, não entendi muito bem. 😅\n\nPor favor, digite sua pergunta informando o dia que deseja consultar.', false);
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
    
    appendMessage(`Falta registrada com sucesso!\n- ${updatedNames.join('\n- ')}\n\nSua frequência foi atualizada no painel!`, false);
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
    
    // Choose a random informal greeting
    const randomIndex = Math.floor(Math.random() * INFORMAL_GREETINGS.length);
    const greeting = INFORMAL_GREETINGS[randomIndex];
    appendMessage(greeting, false);
  }, 1000);
}

// Drawer tabs logic
tabSubjects.onclick = () => {
  tabSubjects.classList.add('active');
  tabSchedule.classList.remove('active');
  panelSubjects.classList.add('active');
  panelSchedule.classList.remove('active');
};

tabSchedule.onclick = () => {
  tabSchedule.classList.add('active');
  tabSubjects.classList.remove('active');
  panelSchedule.classList.add('active');
  panelSubjects.classList.remove('active');
  renderScheduleConfig();
};

// Settings Drawers Open/Close
function openSettings() {
  settingsDrawer.classList.add('active');
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



// Init application
window.onload = () => {
  loadData();
  triggerGreeting();
};
