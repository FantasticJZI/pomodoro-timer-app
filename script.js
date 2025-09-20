// 番茄鐘Pro - 智能生產力管理系統
class PomodoroPro {
    constructor() {
        this.currentMode = 'work';
        this.isRunning = false;
        this.isPaused = false;
        this.timeLeft = 25 * 60;
        this.totalTime = 25 * 60;
        this.sessionCount = 1;
        this.longBreakInterval = 4;
        this.currentProject = null;
        this.ambientAudio = null;
        this.currentAmbientSound = null;
        
        // 時間設置
        this.settings = {
            workTime: 25,
            shortBreakTime: 5,
            longBreakTime: 15,
            longBreakInterval: 4,
            soundEnabled: true,
            ambientEnabled: true,
            aiPersonality: 'friendly'
        };
        
        // 數據存儲
        this.projects = [];
        this.timeLogs = [];
        this.dailyStats = {};
        
        this.timer = null;
        this.audioContext = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadData();
        this.updateDisplay();
        this.updateProjectsList();
        this.updateAnalytics();
    }
    
    initializeElements() {
        // 計時器元素
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.sessionNumberEl = document.getElementById('sessionNumber');
        this.nextSessionTextEl = document.getElementById('nextSessionText');
        
        // 按鈕元素
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        
        // 項目相關元素
        this.currentProjectSelect = document.getElementById('currentProject');
        this.addProjectBtn = document.getElementById('addProjectBtn');
        this.projectsListEl = document.getElementById('projectsList');
        this.addNewProjectBtn = document.getElementById('addNewProjectBtn');
        
        // 環境音元素
        this.ambientSelect = document.getElementById('ambientSelect');
        this.playAmbientBtn = document.getElementById('playAmbientBtn');
        this.stopAmbientBtn = document.getElementById('stopAmbientBtn');
        
        // 模式按鈕
        this.modeBtns = document.querySelectorAll('.mode-btn');
        
        // 頁面導航
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.pages = document.querySelectorAll('.page');
        
        // 模態框和通知
        this.settingsModal = document.getElementById('settingsModal');
        this.projectModal = document.getElementById('projectModal');
        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notificationText');
        
        // 進度環
        this.progressCircle = document.querySelector('.progress-ring-circle');
        
        // 設置輸入
        this.workTimeInput = document.getElementById('workTime');
        this.shortBreakTimeInput = document.getElementById('shortBreakTime');
        this.longBreakTimeInput = document.getElementById('longBreakTime');
        this.longBreakIntervalInput = document.getElementById('longBreakInterval');
        this.soundEnabledInput = document.getElementById('soundEnabled');
        this.ambientEnabledInput = document.getElementById('ambientEnabled');
        this.aiPersonalityInput = document.getElementById('aiPersonality');
        
        // 項目模態框元素
        this.projectNameInput = document.getElementById('projectName');
        this.projectDescriptionInput = document.getElementById('projectDescription');
        this.projectColorInput = document.getElementById('projectColor');
        this.projectGoalInput = document.getElementById('projectGoal');
        this.saveProjectBtn = document.getElementById('saveProject');
        this.deleteProjectBtn = document.getElementById('deleteProject');
        
        // 統計頁面元素
        this.analyticsDateInput = document.getElementById('analyticsDate');
        this.todayTotalTimeEl = document.getElementById('todayTotalTime');
        this.todayPomodorosEl = document.getElementById('todayPomodoros');
        this.focusScoreEl = document.getElementById('focusScore');
        this.projectChartEl = document.getElementById('projectChart');
        this.generateSummaryBtn = document.getElementById('generateSummaryBtn');
        this.aiSummaryContentEl = document.getElementById('aiSummaryContent');
        
        // AI助理元素
        this.chatMessagesEl = document.getElementById('chatMessages');
        this.chatInputEl = document.getElementById('chatInput');
        this.sendMessageBtn = document.getElementById('sendMessageBtn');
        this.featureBtns = document.querySelectorAll('.feature-btn');
    }
    
    bindEvents() {
        // 計時器控制事件
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // 模式切換事件
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        // 頁面導航事件
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchPage(btn.dataset.page));
        });
        
        // 項目相關事件
        this.addProjectBtn.addEventListener('click', () => this.openProjectModal());
        this.addNewProjectBtn.addEventListener('click', () => this.openProjectModal());
        this.currentProjectSelect.addEventListener('change', (e) => this.selectProject(e.target.value));
        this.saveProjectBtn.addEventListener('click', () => this.saveProject());
        this.deleteProjectBtn.addEventListener('click', () => this.deleteProject());
        
        // 環境音事件
        this.ambientSelect.addEventListener('change', (e) => this.selectAmbientSound(e.target.value));
        this.playAmbientBtn.addEventListener('click', () => this.playAmbientSound());
        this.stopAmbientBtn.addEventListener('click', () => this.stopAmbientSound());
        
        // 設置相關事件
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        
        // 項目模態框事件
        this.closeProjectModalBtn = document.getElementById('closeProjectModal');
        this.closeProjectModalBtn.addEventListener('click', () => this.closeProjectModal());
        
        // 統計頁面事件
        this.analyticsDateInput.addEventListener('change', () => this.updateAnalytics());
        this.generateSummaryBtn.addEventListener('click', () => this.generateAISummary());
        
        // AI助理事件
        this.sendMessageBtn.addEventListener('click', () => this.sendMessage());
        this.chatInputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.featureBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleAIFeature(btn.dataset.feature));
        });
        
        // 模態框點擊外部關閉
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettings();
        });
        this.projectModal.addEventListener('click', (e) => {
            if (e.target === this.projectModal) this.closeProjectModal();
        });
        
        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.isRunning) {
                    this.pauseTimer();
                } else {
                    this.startTimer();
                }
            } else if (e.code === 'Escape') {
                this.closeSettings();
                this.closeProjectModal();
            }
        });
    }
    
    // 頁面導航
    switchPage(pageId) {
        // 更新導航按鈕狀態
        this.navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === pageId) {
                btn.classList.add('active');
            }
        });
        
        // 更新頁面顯示
        this.pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId + '-page') {
                page.classList.add('active');
            }
        });
        
        // 如果切換到統計頁面，更新數據
        if (pageId === 'analytics') {
            this.updateAnalytics();
        }
    }
    
    // 項目管理
    openProjectModal(projectId = null) {
        this.editingProjectId = projectId;
        const modal = document.getElementById('projectModal');
        const title = document.getElementById('projectModalTitle');
        
        if (projectId) {
            const project = this.projects.find(p => p.id === projectId);
            title.textContent = '編輯項目';
            this.projectNameInput.value = project.name;
            this.projectDescriptionInput.value = project.description;
            this.projectColorInput.value = project.color;
            this.projectGoalInput.value = project.goal;
            this.deleteProjectBtn.style.display = 'inline-block';
        } else {
            title.textContent = '新增項目';
            this.projectNameInput.value = '';
            this.projectDescriptionInput.value = '';
            this.projectColorInput.value = '#667eea';
            this.projectGoalInput.value = 10;
            this.deleteProjectBtn.style.display = 'none';
        }
        
        modal.style.display = 'block';
    }
    
    closeProjectModal() {
        this.projectModal.style.display = 'none';
    }
    
    saveProject() {
        const name = this.projectNameInput.value.trim();
        const description = this.projectDescriptionInput.value.trim();
        const color = this.projectColorInput.value;
        const goal = parseInt(this.projectGoalInput.value);
        
        if (!name) {
            this.showNotification('請輸入項目名稱', 'error');
            return;
        }
        
        const project = {
            id: this.editingProjectId || Date.now().toString(),
            name,
            description,
            color,
            goal,
            createdAt: this.editingProjectId ? this.projects.find(p => p.id === this.editingProjectId).createdAt : new Date().toISOString(),
            totalTime: this.editingProjectId ? this.projects.find(p => p.id === this.editingProjectId).totalTime || 0 : 0,
            completedPomodoros: this.editingProjectId ? this.projects.find(p => p.id === this.editingProjectId).completedPomodoros || 0 : 0
        };
        
        if (this.editingProjectId) {
            const index = this.projects.findIndex(p => p.id === this.editingProjectId);
            this.projects[index] = project;
        } else {
            this.projects.push(project);
        }
        
        this.saveData();
        this.updateProjectsList();
        this.updateProjectSelect();
        this.closeProjectModal();
        this.showNotification('項目保存成功！', 'success');
    }
    
    deleteProject() {
        if (confirm('確定要刪除這個項目嗎？')) {
            this.projects = this.projects.filter(p => p.id !== this.editingProjectId);
            this.saveData();
            this.updateProjectsList();
            this.updateProjectSelect();
            this.closeProjectModal();
            this.showNotification('項目已刪除', 'info');
        }
    }
    
    updateProjectsList() {
        this.projectsListEl.innerHTML = '';
        
        this.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.style.setProperty('--project-color', project.color);
            
            const progress = project.goal > 0 ? (project.completedPomodoros / project.goal) * 100 : 0;
            
            projectCard.innerHTML = `
                <div class="project-header">
                    <div class="project-name">${project.name}</div>
                    <div class="project-actions">
                        <button class="btn-secondary" onclick="pomodoroPro.openProjectModal('${project.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
                <div class="project-description">${project.description}</div>
                <div class="project-stats">
                    <span>已完成: ${project.completedPomodoros}/${project.goal} 番茄</span>
                    <span>總時間: ${Math.floor(project.totalTime / 60)}h ${project.totalTime % 60}m</span>
                </div>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
            
            this.projectsListEl.appendChild(projectCard);
        });
    }
    
    updateProjectSelect() {
        this.currentProjectSelect.innerHTML = '<option value="">選擇項目...</option>';
        
        this.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            this.currentProjectSelect.appendChild(option);
        });
    }
    
    selectProject(projectId) {
        this.currentProject = projectId ? this.projects.find(p => p.id === projectId) : null;
    }
    
    // 環境音功能
    selectAmbientSound(soundType) {
        this.currentAmbientSound = soundType;
        this.playAmbientBtn.disabled = !soundType;
    }
    
    playAmbientSound() {
        if (!this.currentAmbientSound) return;
        
        this.stopAmbientSound();
        
        // 創建環境音
        this.ambientAudio = this.createAmbientSound(this.currentAmbientSound);
        
        // 播放音頻
        this.ambientAudio.play();
        
        this.playAmbientBtn.disabled = true;
        this.stopAmbientBtn.disabled = false;
    }
    
    stopAmbientSound() {
        if (this.ambientAudio) {
            this.ambientAudio.stop();
            this.ambientAudio = null;
        }
        this.playAmbientBtn.disabled = false;
        this.stopAmbientBtn.disabled = true;
    }
    
    createAmbientSound(type) {
        // 使用本地音頻文件
        const soundUrls = {
            'rain': './sounds/rain.mp3',
            'forest': './sounds/forest.mp3', 
            'ocean': './sounds/ocean.mp3',
            'cafe': './sounds/cafe.mp3',
            'white-noise': './sounds/white-noise.mp3'
        };
        
        // 創建音頻元素
        const audio = new Audio();
        audio.loop = true;
        audio.volume = 0.3;
        audio.preload = 'auto';
        
        // 如果在線資源不可用，使用本地生成的音效
        if (!soundUrls[type]) {
            return this.createFallbackAmbientSound(type);
        }
        
        audio.src = soundUrls[type];
        
        return {
            audio: audio,
            play: function() {
                audio.play().catch(e => {
                    console.log('本地音頻播放失敗，使用備用音效:', e);
                    // 如果本地音頻失敗，使用備用音效
                    return this.createFallbackAmbientSound(type);
                });
            },
            stop: function() {
                audio.pause();
                audio.currentTime = 0;
            },
            setVolume: function(volume) {
                audio.volume = Math.max(0, Math.min(1, volume));
            }
        };
    }
    
    createFallbackAmbientSound(type) {
        // 備用方案：使用Web Audio API創建更自然的音效
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const masterGain = this.audioContext.createGain();
        masterGain.connect(this.audioContext.destination);
        masterGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        const oscillators = [];
        
        switch (type) {
            case 'rain':
                // 雨聲：使用噪聲生成器
                for (let i = 0; i < 3; i++) {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    const filter = this.audioContext.createBiquadFilter();
                    
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(masterGain);
                    
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
                    filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);
                    
                    osc.frequency.setValueAtTime(50 + i * 30, this.audioContext.currentTime);
                    osc.type = 'sawtooth';
                    gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                    
                    osc.start();
                    oscillators.push(osc);
                }
                break;
                
            case 'forest':
                // 森林：鳥叫聲
                for (let i = 0; i < 2; i++) {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    const filter = this.audioContext.createBiquadFilter();
                    
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(masterGain);
                    
                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(1000 + i * 500, this.audioContext.currentTime);
                    filter.Q.setValueAtTime(0.3, this.audioContext.currentTime);
                    
                    osc.frequency.setValueAtTime(800 + i * 400, this.audioContext.currentTime);
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.03, this.audioContext.currentTime);
                    
                    osc.start();
                    oscillators.push(osc);
                }
                break;
                
            case 'ocean':
                // 海洋：波浪聲
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(masterGain);
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(300, this.audioContext.currentTime);
                filter.Q.setValueAtTime(0.2, this.audioContext.currentTime);
                
                osc.frequency.setValueAtTime(60, this.audioContext.currentTime);
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.06, this.audioContext.currentTime);
                
                osc.start();
                oscillators.push(osc);
                break;
                
            case 'cafe':
                // 咖啡廳：環境音
                const osc2 = this.audioContext.createOscillator();
                const gain2 = this.audioContext.createGain();
                const filter2 = this.audioContext.createBiquadFilter();
                
                osc2.connect(filter2);
                filter2.connect(gain2);
                gain2.connect(masterGain);
                
                filter2.type = 'bandpass';
                filter2.frequency.setValueAtTime(400, this.audioContext.currentTime);
                filter2.Q.setValueAtTime(0.1, this.audioContext.currentTime);
                
                osc2.frequency.setValueAtTime(200, this.audioContext.currentTime);
                osc2.type = 'sawtooth';
                gain2.gain.setValueAtTime(0.02, this.audioContext.currentTime);
                
                osc2.start();
                oscillators.push(osc2);
                break;
                
            case 'white-noise':
                // 白噪音
                for (let i = 0; i < 3; i++) {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    const filter = this.audioContext.createBiquadFilter();
                    
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(masterGain);
                    
                    filter.type = 'highpass';
                    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                    filter.Q.setValueAtTime(0.1, this.audioContext.currentTime);
                    
                    osc.frequency.setValueAtTime(1000 + i * 500, this.audioContext.currentTime);
                    osc.type = 'sawtooth';
                    gain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
                    
                    osc.start();
                    oscillators.push(osc);
                }
                break;
        }
        
        return {
            oscillators: oscillators,
            play: function() {
                // 振盪器已經在創建時開始
            },
            stop: function() {
                oscillators.forEach(osc => osc.stop());
            },
            setVolume: function(volume) {
                masterGain.gain.setValueAtTime(volume * 0.1, this.audioContext.currentTime);
            }
        };
    }
    
    // 計時器核心功能
    switchMode(mode) {
        if (this.isRunning) return;
        
        this.currentMode = mode;
        
        // 更新按鈕狀態
        this.modeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        // 設置對應的時間
        switch (mode) {
            case 'work':
                this.totalTime = this.settings.workTime * 60;
                break;
            case 'short-break':
                this.totalTime = this.settings.shortBreakTime * 60;
                break;
            case 'long-break':
                this.totalTime = this.settings.longBreakTime * 60;
                break;
        }
        
        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.updateProgress();
    }
    
    startTimer() {
        if (this.isPaused) {
            this.resumeTimer();
        } else {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            
            // 記錄開始時間
            this.sessionStartTime = new Date();
            
            this.timer = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                this.updateProgress();
                
                if (this.timeLeft <= 0) {
                    this.completeSession();
                }
            }, 1000);
        }
    }
    
    pauseTimer() {
        this.isRunning = false;
        this.isPaused = true;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.timer);
    }
    
    resumeTimer() {
        this.isRunning = true;
        this.isPaused = false;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            this.updateProgress();
            
            if (this.timeLeft <= 0) {
                this.completeSession();
            }
        }, 1000);
    }
    
    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.timer);
        
        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.updateProgress();
    }
    
    completeSession() {
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.timer);
        
        // 記錄時間日誌
        this.logTimeSession();
        
        // 播放提示音
        if (this.settings.soundEnabled) {
            this.playNotificationSound();
        }
        
        // 顯示通知
        this.showNotification();
        
        // 自動切換到下一個模式
        this.autoSwitchMode();
    }
    
    logTimeSession() {
        const sessionDuration = this.totalTime - this.timeLeft;
        const endTime = new Date();
        
        const timeLog = {
            id: Date.now().toString(),
            projectId: this.currentProject ? this.currentProject.id : null,
            projectName: this.currentProject ? this.currentProject.name : '未分類',
            mode: this.currentMode,
            duration: sessionDuration,
            startTime: this.sessionStartTime.toISOString(),
            endTime: endTime.toISOString(),
            date: endTime.toISOString().split('T')[0]
        };
        
        this.timeLogs.push(timeLog);
        
        // 更新項目統計
        if (this.currentProject) {
            const project = this.projects.find(p => p.id === this.currentProject.id);
            if (project) {
                project.totalTime += sessionDuration;
                if (this.currentMode === 'work') {
                    project.completedPomodoros += 1;
                }
            }
        }
        
        this.saveData();
        this.updateAnalytics();
    }
    
    autoSwitchMode() {
        if (this.currentMode === 'work') {
            this.sessionCount++;
            this.sessionNumberEl.textContent = this.sessionCount;
            
            // 判斷是短休息還是長休息
            if (this.sessionCount % this.settings.longBreakInterval === 0) {
                this.switchMode('long-break');
                this.nextSessionTextEl.textContent = '下一個：工作';
            } else {
                this.switchMode('short-break');
                this.nextSessionTextEl.textContent = '下一個：工作';
            }
        } else {
            this.switchMode('work');
            this.nextSessionTextEl.textContent = this.sessionCount % this.settings.longBreakInterval === 0 ? 
                '下一個：長休息' : '下一個：短休息';
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        this.minutesEl.textContent = minutes.toString().padStart(2, '0');
        this.secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateProgress() {
        const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        const circumference = 2 * Math.PI * 140;
        const offset = circumference - (progress / 100) * circumference;
        
        this.progressCircle.style.strokeDasharray = circumference;
        this.progressCircle.style.strokeDashoffset = offset;
        
        // 根據模式改變進度條顏色
        this.progressCircle.classList.remove('progress');
        if (this.timeLeft < this.totalTime) {
            this.progressCircle.classList.add('progress');
            
            switch (this.currentMode) {
                case 'work':
                    this.progressCircle.style.stroke = '#ff6b6b';
                    break;
                case 'short-break':
                    this.progressCircle.style.stroke = '#4ecdc4';
                    break;
                case 'long-break':
                    this.progressCircle.style.stroke = '#45b7d1';
                    break;
            }
        }
    }
    
    showNotification() {
        let message = '';
        switch (this.currentMode) {
            case 'work':
                message = '工作時間結束！該休息了 🎉';
                break;
            case 'short-break':
                message = '短休息結束！準備開始工作 💪';
                break;
            case 'long-break':
                message = '長休息結束！準備開始工作 🚀';
                break;
        }
        
        this.notificationText.textContent = message;
        this.notification.classList.add('show');
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
    
    playNotificationSound() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // 創建更柔和的提示音
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 設置濾波器讓聲音更柔和
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
            filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);
            
            // 創建更自然的音調序列
            const currentTime = this.audioContext.currentTime;
            
            // 第一個音調
            oscillator.frequency.setValueAtTime(523.25, currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, currentTime + 0.2); // E5
            oscillator.frequency.setValueAtTime(783.99, currentTime + 0.4); // G5
            
            // 音量包絡
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.3);
            gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.6);
            
            oscillator.type = 'sine';
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.6);
            
        } catch (error) {
            console.log('音頻播放失敗:', error);
        }
    }
    
    // 統計分析功能
    updateAnalytics() {
        const selectedDate = this.analyticsDateInput.value || new Date().toISOString().split('T')[0];
        const dayLogs = this.timeLogs.filter(log => log.date === selectedDate);
        
        // 計算今日統計
        const totalMinutes = dayLogs.reduce((sum, log) => sum + log.duration, 0);
        const workLogs = dayLogs.filter(log => log.mode === 'work');
        const completedPomodoros = workLogs.length;
        
        this.todayTotalTimeEl.textContent = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
        this.todayPomodorosEl.textContent = completedPomodoros;
        
        // 計算專注度（基於工作時間比例）
        const focusScore = dayLogs.length > 0 ? Math.round((workLogs.length / dayLogs.length) * 100) : 0;
        this.focusScoreEl.textContent = `${focusScore}%`;
        
        // 更新項目時間分布圖表
        this.updateProjectChart(dayLogs);
    }
    
    updateProjectChart(dayLogs) {
        const ctx = this.projectChartEl.getContext('2d');
        const projectStats = {};
        
        dayLogs.forEach(log => {
            if (log.mode === 'work') {
                if (!projectStats[log.projectName]) {
                    projectStats[log.projectName] = 0;
                }
                projectStats[log.projectName] += log.duration;
            }
        });
        
        const labels = Object.keys(projectStats);
        const data = Object.values(projectStats);
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        
        // 簡單的圖表繪製
        ctx.clearRect(0, 0, this.projectChartEl.width, this.projectChartEl.height);
        
        if (labels.length === 0) {
            ctx.fillStyle = '#6c757d';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('今日無工作記錄', this.projectChartEl.width / 2, this.projectChartEl.height / 2);
            return;
        }
        
        const maxValue = Math.max(...data);
        const barWidth = this.projectChartEl.width / labels.length * 0.8;
        const barSpacing = this.projectChartEl.width / labels.length * 0.2;
        
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * (this.projectChartEl.height - 40);
            const x = index * (barWidth + barSpacing) + barSpacing / 2;
            const y = this.projectChartEl.height - barHeight - 20;
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // 標籤
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x + barWidth / 2, this.projectChartEl.height - 5);
            
            // 數值
            ctx.fillText(`${Math.floor(value / 60)}m`, x + barWidth / 2, y - 5);
        });
    }
    
    // AI功能
    generateAISummary() {
        const selectedDate = this.analyticsDateInput.value || new Date().toISOString().split('T')[0];
        const dayLogs = this.timeLogs.filter(log => log.date === selectedDate);
        
        if (dayLogs.length === 0) {
            this.aiSummaryContentEl.innerHTML = '<p>今日無工作記錄，無法生成摘要。</p>';
            return;
        }
        
        this.aiSummaryContentEl.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> 正在生成AI摘要...</p>';
        
        // 模擬AI分析（實際應用中會調用AI API）
        setTimeout(() => {
            const summary = this.generateMockAISummary(dayLogs);
            this.aiSummaryContentEl.innerHTML = summary;
        }, 2000);
    }
    
    generateMockAISummary(dayLogs) {
        const workLogs = dayLogs.filter(log => log.mode === 'work');
        const totalWorkTime = workLogs.reduce((sum, log) => sum + log.duration, 0);
        const projectStats = {};
        const projectDetails = {};
        
        // 收集項目統計和詳細信息
        workLogs.forEach(log => {
            if (!projectStats[log.projectName]) {
                projectStats[log.projectName] = 0;
                // 查找項目詳細信息
                const project = this.projects.find(p => p.name === log.projectName);
                if (project) {
                    projectDetails[log.projectName] = {
                        description: project.description,
                        goal: project.goal,
                        completedPomodoros: project.completedPomodoros,
                        totalTime: project.totalTime
                    };
                }
            }
            projectStats[log.projectName] += log.duration;
        });
        
        const topProject = Object.entries(projectStats).reduce((a, b) => 
            projectStats[a[0]] > projectStats[b[0]] ? a : b
        );
        
        const focusScore = Math.round((workLogs.length / dayLogs.length) * 100);
        
        // 生成項目分析
        const projectAnalysis = this.generateProjectAnalysis(projectStats, projectDetails);
        
        return `
            <div class="ai-summary-content">
                <h4>📊 今日工作分析</h4>
                <p><strong>總工作時間：</strong>${Math.floor(totalWorkTime / 60)}小時${totalWorkTime % 60}分鐘</p>
                <p><strong>完成番茄：</strong>${workLogs.length}個</p>
                <p><strong>專注度評分：</strong>${focusScore}%</p>
                <p><strong>主要項目：</strong>${topProject[0]} (${Math.floor(topProject[1] / 60)}小時)</p>
                
                <h4>🎯 項目進度分析</h4>
                ${projectAnalysis}
                
                <h4>💡 AI建議</h4>
                <p>${this.getAIAdvice(focusScore, workLogs.length, totalWorkTime, projectDetails)}</p>
                
                <h4>🚀 明日目標</h4>
                <p>${this.getTomorrowGoal(projectStats, workLogs.length, projectDetails)}</p>
            </div>
        `;
    }
    
    generateProjectAnalysis(projectStats, projectDetails) {
        let analysis = '';
        
        Object.entries(projectStats).forEach(([projectName, timeSpent]) => {
            const details = projectDetails[projectName];
            const hours = Math.floor(timeSpent / 60);
            const minutes = timeSpent % 60;
            
            analysis += `<div class="project-analysis-item">`;
            analysis += `<h5>📋 ${projectName}</h5>`;
            
            if (details) {
                analysis += `<p><strong>項目描述：</strong>${details.description || '無描述'}</p>`;
                analysis += `<p><strong>今日投入：</strong>${hours}小時${minutes}分鐘</p>`;
                analysis += `<p><strong>總進度：</strong>${details.completedPomodoros}/${details.goal} 番茄 (${Math.round((details.completedPomodoros / details.goal) * 100)}%)</p>`;
                
                // 基於項目描述給出建議
                if (details.description) {
                    const suggestion = this.getProjectSpecificAdvice(projectName, details.description, timeSpent, details.completedPomodoros, details.goal);
                    analysis += `<p><strong>AI建議：</strong>${suggestion}</p>`;
                }
            } else {
                analysis += `<p><strong>今日投入：</strong>${hours}小時${minutes}分鐘</p>`;
                analysis += `<p><em>建議為此項目添加描述，以便AI提供更精準的分析</em></p>`;
            }
            
            analysis += `</div>`;
        });
        
        return analysis || '<p>今日沒有項目工作記錄</p>';
    }
    
    getProjectSpecificAdvice(projectName, description, timeSpent, completedPomodoros, goal) {
        const progress = (completedPomodoros / goal) * 100;
        const hours = Math.floor(timeSpent / 60);
        
        // 基於項目描述和進度給出建議
        if (description.includes('學習') || description.includes('study')) {
            if (progress < 30) {
                return `學習項目剛開始，建議每天至少投入2小時，保持連續性學習。`;
            } else if (progress < 70) {
                return `學習進度良好，建議增加實踐時間，將理論與實際結合。`;
            } else {
                return `學習項目接近完成，建議總結知識點，準備應用測試。`;
            }
        } else if (description.includes('工作') || description.includes('work')) {
            if (hours < 2) {
                return `工作時間較短，建議增加專注時間，提高工作效率。`;
            } else if (hours > 6) {
                return `工作時間較長，注意休息，避免過度疲勞。`;
            } else {
                return `工作時間合理，保持這個節奏，注意勞逸結合。`;
            }
        } else if (description.includes('創作') || description.includes('creative')) {
            if (progress < 50) {
                return `創作項目需要靈感，建議在創意高峰期工作，保持創作熱情。`;
            } else {
                return `創作進度不錯，建議定期回顧作品，保持創作質量。`;
            }
        } else if (description.includes('運動') || description.includes('exercise')) {
            return `運動項目很棒！建議保持規律性，注意運動後的恢復時間。`;
        } else {
            // 通用建議
            if (progress < 25) {
                return `項目剛開始，建議制定詳細計劃，分解大目標為小任務。`;
            } else if (progress < 75) {
                return `項目進展順利，建議保持當前節奏，注意質量控制。`;
            } else {
                return `項目接近完成，建議檢查細節，確保質量達標。`;
            }
        }
    }
    
    getAIAdvice(focusScore, pomodoros, totalTime, projectDetails = {}) {
        let advice = '';
        
        if (focusScore >= 80) {
            advice = "太棒了！你的專注度很高，保持這個節奏！";
        } else if (focusScore >= 60) {
            advice = "專注度不錯，建議減少休息時間的干擾，提高工作效率。";
        } else {
            advice = "專注度有待提高，建議關閉通知，選擇安靜的環境工作。";
        }
        
        // 基於項目情況給出額外建議
        const projectCount = Object.keys(projectDetails).length;
        if (projectCount > 3) {
            advice += " 注意：你同時進行多個項目，建議專注於1-2個主要項目，避免分散注意力。";
        } else if (projectCount === 1) {
            advice += " 很好！專注於單一項目有助於深度工作，保持這個策略。";
        }
        
        return advice;
    }
    
    getTomorrowGoal(projectStats, pomodoros, projectDetails = {}) {
        const projects = Object.keys(projectStats);
        
        if (projects.length === 0) {
            return `明天開始新的工作，建議先創建項目並設定目標。`;
        }
        
        // 找到進度最低的項目
        let lowestProgressProject = null;
        let lowestProgress = 100;
        
        Object.entries(projectStats).forEach(([projectName, timeSpent]) => {
            const details = projectDetails[projectName];
            if (details) {
                const progress = (details.completedPomodoros / details.goal) * 100;
                if (progress < lowestProgress) {
                    lowestProgress = progress;
                    lowestProgressProject = projectName;
                }
            }
        });
        
        if (lowestProgressProject) {
            const details = projectDetails[lowestProgressProject];
            const remainingPomodoros = details.goal - details.completedPomodoros;
            const suggestedPomodoros = Math.min(remainingPomodoros, pomodoros + 2);
            
            return `建議明天專注於「${lowestProgressProject}」項目，目標完成${suggestedPomodoros}個番茄。${details.description ? `基於項目描述「${details.description}」，建議${this.getProjectSpecificGoal(details.description, remainingPomodoros)}` : ''}`;
        } else {
            return `建議明天專注於${projects[0]}項目，目標完成${pomodoros + 2}個番茄。`;
        }
    }
    
    getProjectSpecificGoal(description, remainingPomodoros) {
        if (description.includes('學習') || description.includes('study')) {
            return `採用25分鐘學習+5分鐘複習的模式，確保知識鞏固。`;
        } else if (description.includes('工作') || description.includes('work')) {
            return `保持專注工作，每小時休息一次，避免過度疲勞。`;
        } else if (description.includes('創作') || description.includes('creative')) {
            return `在創意高峰期工作，保持靈感流暢。`;
        } else if (description.includes('運動') || description.includes('exercise')) {
            return `保持運動強度適中，注意身體恢復。`;
        } else {
            return `保持穩定的工作節奏，確保質量優先。`;
        }
    }
    
    // AI助理聊天功能
    sendMessage() {
        const message = this.chatInputEl.value.trim();
        if (!message) return;
        
        // 添加用戶消息
        this.addChatMessage(message, 'user');
        this.chatInputEl.value = '';
        
        // 模擬AI回應
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addChatMessage(response, 'ai');
        }, 1000);
    }
    
    addChatMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (sender === 'ai') {
            contentDiv.innerHTML = `<i class="fas fa-robot"></i><p>${message}</p>`;
        } else {
            contentDiv.innerHTML = `<p>${message}</p>`;
        }
        
        messageDiv.appendChild(contentDiv);
        this.chatMessagesEl.appendChild(messageDiv);
        
        // 滾動到底部
        this.chatMessagesEl.scrollTop = this.chatMessagesEl.scrollHeight;
    }
    
    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // 問候語
        if (lowerMessage.includes('你好') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            return '你好！我是你的AI生產力助理，我可以幫你分析工作數據、提供效率建議、制定目標計劃。有什麼可以幫助你的嗎？';
        }
        
        // 工作分析
        if (lowerMessage.includes('今天工作') || lowerMessage.includes('工作怎麼樣') || lowerMessage.includes('工作分析')) {
            return this.generateWorkAnalysis();
        }
        
        // 效率建議
        if (lowerMessage.includes('如何提高效率') || lowerMessage.includes('效率') || lowerMessage.includes('專注')) {
            return this.generateEfficiencyAdvice();
        }
        
        // 目標設定
        if (lowerMessage.includes('設定目標') || lowerMessage.includes('目標') || lowerMessage.includes('計劃')) {
            return this.generateGoalSettingAdvice();
        }
        
        // 項目相關
        if (lowerMessage.includes('項目') || lowerMessage.includes('project')) {
            return this.generateProjectAdvice();
        }
        
        // 週報
        if (lowerMessage.includes('週報') || lowerMessage.includes('週') || lowerMessage.includes('week')) {
            return this.generateWeeklyReport();
        }
        
        // 休息建議
        if (lowerMessage.includes('休息') || lowerMessage.includes('累') || lowerMessage.includes('疲勞')) {
            return '建議你適當休息，可以嘗試短暫的散步、深呼吸或聽音樂。記住，休息是為了更好的工作！';
        }
        
        // 默認回應
        return '我理解你的問題，讓我為你提供一些建議。你可以問我關於工作效率、項目管理、目標設定等問題。';
    }
    
    generateWorkAnalysis() {
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = this.timeLogs.filter(log => log.date === today);
        const workLogs = todayLogs.filter(log => log.mode === 'work');
        const totalTime = workLogs.reduce((sum, log) => sum + log.duration, 0);
        
        if (workLogs.length === 0) {
            return '今天還沒有工作記錄，建議開始一個番茄鐘來提高生產力！';
        }
        
        const hours = Math.floor(totalTime / 60);
        const minutes = totalTime % 60;
        const projects = [...new Set(workLogs.map(log => log.projectName))];
        
        return `今天你完成了${workLogs.length}個番茄鐘，總工作時間${hours}小時${minutes}分鐘。參與的項目有：${projects.join('、')}。${this.getWorkAnalysisAdvice(workLogs.length, totalTime)}`;
    }
    
    generateEfficiencyAdvice() {
        const advice = [
            '使用番茄工作法：25分鐘專注工作，5分鐘休息',
            '選擇適合的環境音效幫助專注',
            '為每個項目設定明確的目標和描述',
            '定期回顧和調整工作計劃',
            '保持規律的作息時間'
        ];
        
        return `以下是一些提高效率的建議：\n${advice.map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
    }
    
    generateGoalSettingAdvice() {
        const activeProjects = this.projects.filter(p => p.completedPomodoros < p.goal);
        
        if (activeProjects.length === 0) {
            return '目前沒有進行中的項目，建議創建新項目並設定目標。記住要設定具體、可測量、可達成的目標！';
        }
        
        let advice = '基於你當前的項目，建議：\n';
        activeProjects.forEach(project => {
            const progress = Math.round((project.completedPomodoros / project.goal) * 100);
            advice += `• ${project.name}：已完成${progress}%，${project.description ? `建議${this.getProjectSpecificAdvice(project.name, project.description, 0, project.completedPomodoros, project.goal)}` : '繼續保持當前進度'}\n`;
        });
        
        return advice;
    }
    
    generateProjectAdvice() {
        if (this.projects.length === 0) {
            return '你還沒有創建任何項目，建議先創建項目並添加詳細描述，這樣我就能提供更精準的建議了！';
        }
        
        const activeProjects = this.projects.filter(p => p.completedPomodoros < p.goal);
        const completedProjects = this.projects.filter(p => p.completedPomodoros >= p.goal);
        
        let advice = `你目前有${this.projects.length}個項目：\n`;
        
        if (activeProjects.length > 0) {
            advice += `\n進行中的項目：\n`;
            activeProjects.forEach(project => {
                const progress = Math.round((project.completedPomodoros / project.goal) * 100);
                advice += `• ${project.name} (${progress}%)：${project.description || '無描述'}\n`;
            });
        }
        
        if (completedProjects.length > 0) {
            advice += `\n已完成的項目：\n`;
            completedProjects.forEach(project => {
                advice += `• ${project.name} ✅\n`;
            });
        }
        
        return advice;
    }
    
    generateWeeklyReport() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekLogs = this.timeLogs.filter(log => new Date(log.date) >= weekAgo);
        const workLogs = weekLogs.filter(log => log.mode === 'work');
        
        if (workLogs.length === 0) {
            return '本週還沒有工作記錄，建議開始使用番茄鐘來追蹤你的工作時間！';
        }
        
        const totalTime = workLogs.reduce((sum, log) => sum + log.duration, 0);
        const hours = Math.floor(totalTime / 60);
        const projects = [...new Set(workLogs.map(log => log.projectName))];
        
        return `本週工作報告：\n• 完成番茄鐘：${workLogs.length}個\n• 總工作時間：${hours}小時\n• 參與項目：${projects.join('、')}\n• 平均每天：${Math.round(workLogs.length / 7)}個番茄鐘\n\n建議下週保持這個節奏，繼續努力！`;
    }
    
    getWorkAnalysisAdvice(pomodoros, totalTime) {
        if (pomodoros < 4) {
            return '建議增加工作時間，每天至少完成4個番茄鐘。';
        } else if (pomodoros > 12) {
            return '工作時間很長，注意適當休息，避免過度疲勞。';
        } else {
            return '工作節奏很好，保持這個狀態！';
        }
    }
    
    handleAIFeature(feature) {
        let response = '';
        
        switch (feature) {
            case 'weekly-report':
                response = this.generateWeeklyReport();
                break;
            case 'goal-setting':
                response = this.generateGoalSettingAdvice();
                break;
            case 'productivity-tips':
                response = this.generateEfficiencyAdvice();
                break;
            case 'time-optimization':
                response = this.generateTimeOptimizationAdvice();
                break;
            case 'project-analysis':
                response = this.generateProjectAdvice();
                break;
            case 'work-analysis':
                response = this.generateWorkAnalysis();
                break;
            default:
                response = '功能開發中...';
        }
        
        this.addChatMessage(response, 'ai');
    }
    
    generateTimeOptimizationAdvice() {
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = this.timeLogs.filter(log => log.date === today);
        const workLogs = todayLogs.filter(log => log.mode === 'work');
        
        if (workLogs.length === 0) {
            return '今天還沒有工作記錄，建議開始使用番茄鐘來追蹤時間使用情況。';
        }
        
        const totalWorkTime = workLogs.reduce((sum, log) => sum + log.duration, 0);
        const breakTime = todayLogs.filter(log => log.mode !== 'work').reduce((sum, log) => sum + log.duration, 0);
        const workEfficiency = totalWorkTime / (totalWorkTime + breakTime) * 100;
        
        let advice = `時間使用分析：\n`;
        advice += `• 工作時間：${Math.floor(totalWorkTime / 60)}小時${totalWorkTime % 60}分鐘\n`;
        advice += `• 休息時間：${Math.floor(breakTime / 60)}小時${breakTime % 60}分鐘\n`;
        advice += `• 工作效率：${Math.round(workEfficiency)}%\n\n`;
        
        if (workEfficiency < 60) {
            advice += `建議：休息時間過多，建議增加工作專注度，減少不必要的休息。`;
        } else if (workEfficiency > 90) {
            advice += `建議：工作時間很長，注意適當休息，避免過度疲勞。`;
        } else {
            advice += `建議：時間分配合理，保持當前節奏。`;
        }
        
        return advice;
    }
    
    // 設置功能
    openSettings() {
        this.settingsModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 填充當前設置
        this.workTimeInput.value = this.settings.workTime;
        this.shortBreakTimeInput.value = this.settings.shortBreakTime;
        this.longBreakTimeInput.value = this.settings.longBreakTime;
        this.longBreakIntervalInput.value = this.settings.longBreakInterval;
        this.soundEnabledInput.checked = this.settings.soundEnabled;
        this.ambientEnabledInput.checked = this.settings.ambientEnabled;
        this.aiPersonalityInput.value = this.settings.aiPersonality;
    }
    
    closeSettings() {
        this.settingsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    saveSettings() {
        this.settings.workTime = parseInt(this.workTimeInput.value);
        this.settings.shortBreakTime = parseInt(this.shortBreakTimeInput.value);
        this.settings.longBreakTime = parseInt(this.longBreakTimeInput.value);
        this.settings.longBreakInterval = parseInt(this.longBreakIntervalInput.value);
        this.settings.soundEnabled = this.soundEnabledInput.checked;
        this.settings.ambientEnabled = this.ambientEnabledInput.checked;
        this.settings.aiPersonality = this.aiPersonalityInput.value;
        
        this.saveData();
        this.closeSettings();
        this.showNotification('設置已保存！', 'success');
    }
    
    showNotification(message, type = 'info') {
        this.notificationText.textContent = message;
        this.notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
    
    // 數據存儲
    saveData() {
        const data = {
            settings: this.settings,
            projects: this.projects,
            timeLogs: this.timeLogs,
            sessionCount: this.sessionCount
        };
        localStorage.setItem('pomodoroProData', JSON.stringify(data));
    }
    
    loadData() {
        const savedData = localStorage.getItem('pomodoroProData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.settings = { ...this.settings, ...data.settings };
            this.projects = data.projects || [];
            this.timeLogs = data.timeLogs || [];
            this.sessionCount = data.sessionCount || 1;
        }
        
        this.updateProjectSelect();
    }
}

// 頁面加載完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroPro = new PomodoroPro();
    
    // 註冊Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    }
});

// 頁面可見性變化時暫停/恢復計時器
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.pomodoroPro && window.pomodoroPro.isRunning) {
        window.pomodoroPro.pauseTimer();
    }
});