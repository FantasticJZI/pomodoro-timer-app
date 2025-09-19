class PomodoroTimer {
    constructor() {
        this.currentMode = 'work';
        this.isRunning = false;
        this.isPaused = false;
        this.timeLeft = 25 * 60; // 25分鐘，以秒為單位
        this.totalTime = 25 * 60;
        this.sessionCount = 1;
        this.longBreakInterval = 4;
        
        // 時間設置
        this.settings = {
            workTime: 25,
            shortBreakTime: 5,
            longBreakTime: 15,
            longBreakInterval: 4,
            soundEnabled: true
        };
        
        this.timer = null;
        this.audioContext = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.updateDisplay();
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
        
        // 模式按鈕
        this.modeBtns = document.querySelectorAll('.mode-btn');
        
        // 模態框和通知
        this.settingsModal = document.getElementById('settingsModal');
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
    }
    
    bindEvents() {
        // 控制按鈕事件
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // 模式切換事件
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        // 設置相關事件
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        
        // 模態框點擊外部關閉
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
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
            }
        });
    }
    
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
        
        // 播放提示音
        if (this.settings.soundEnabled) {
            this.playNotificationSound();
        }
        
        // 顯示通知
        this.showNotification();
        
        // 自動切換到下一個模式
        this.autoSwitchMode();
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
        const circumference = 2 * Math.PI * 140; // 圓的半徑是140
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
        
        // 3秒後自動隱藏
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
    
    playNotificationSound() {
        try {
            // 創建音頻上下文
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // 創建提示音
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('音頻播放失敗:', error);
        }
    }
    
    openSettings() {
        this.settingsModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 填充當前設置
        this.workTimeInput.value = this.settings.workTime;
        this.shortBreakTimeInput.value = this.settings.shortBreakTime;
        this.longBreakTimeInput.value = this.settings.longBreakTime;
        this.longBreakIntervalInput.value = this.settings.longBreakInterval;
        this.soundEnabledInput.checked = this.settings.soundEnabled;
    }
    
    closeSettings() {
        this.settingsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    saveSettings() {
        // 獲取設置值
        this.settings.workTime = parseInt(this.workTimeInput.value);
        this.settings.shortBreakTime = parseInt(this.shortBreakTimeInput.value);
        this.settings.longBreakTime = parseInt(this.longBreakTimeInput.value);
        this.settings.longBreakInterval = parseInt(this.longBreakIntervalInput.value);
        this.settings.soundEnabled = this.soundEnabledInput.checked;
        
        // 保存到本地存儲
        localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
        
        // 更新當前模式時間
        this.switchMode(this.currentMode);
        
        this.closeSettings();
        
        // 顯示保存成功提示
        this.notificationText.textContent = '設置已保存！';
        this.notification.classList.add('show');
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 2000);
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }
}

// 頁面加載完成後初始化番茄鐘
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
    
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
    if (document.hidden) {
        // 頁面隱藏時暫停計時器
        const timer = window.pomodoroTimer;
        if (timer && timer.isRunning) {
            timer.pauseTimer();
        }
    }
});
