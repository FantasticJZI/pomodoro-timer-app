// 環境音效資源配置
const AMBIENT_SOUNDS = {
    rain: {
        name: '雨聲',
        urls: [
            'https://www.soundjay.com/misc/sounds/rain-01.mp3',
            'https://www.bensound.com/bensound-music/bensound-rain.mp3',
            'https://freesound.org/data/previews/316/316847_4939433-lq.mp3'
        ],
        description: '舒緩的雨滴聲，幫助專注'
    },
    forest: {
        name: '森林',
        urls: [
            'https://www.soundjay.com/nature/sounds/forest-01.mp3',
            'https://www.bensound.com/bensound-music/bensound-forest.mp3',
            'https://freesound.org/data/previews/316/316847_4939433-lq.mp3'
        ],
        description: '自然的鳥叫聲和風聲'
    },
    ocean: {
        name: '海洋',
        urls: [
            'https://www.soundjay.com/nature/sounds/ocean-01.mp3',
            'https://www.bensound.com/bensound-music/bensound-ocean.mp3',
            'https://freesound.org/data/previews/316/316847_4939433-lq.mp3'
        ],
        description: '海浪拍岸聲，平靜放鬆'
    },
    cafe: {
        name: '咖啡廳',
        urls: [
            'https://www.soundjay.com/misc/sounds/cafe-01.mp3',
            'https://www.bensound.com/bensound-music/bensound-cafe.mp3',
            'https://freesound.org/data/previews/316/316847_4939433-lq.mp3'
        ],
        description: '咖啡廳環境音，模擬工作環境'
    },
    'white-noise': {
        name: '白噪音',
        urls: [
            'https://www.soundjay.com/misc/sounds/white-noise-01.mp3',
            'https://www.bensound.com/bensound-music/bensound-whitenoise.mp3',
            'https://freesound.org/data/previews/316/316847_4939433-lq.mp3'
        ],
        description: '均勻的噪音，深度專注'
    }
};

// 音效管理器
class AmbientSoundManager {
    constructor() {
        this.currentAudio = null;
        this.currentType = null;
        this.isPlaying = false;
        this.volume = 0.3;
    }
    
    async playSound(type) {
        if (this.isPlaying && this.currentType === type) {
            return; // 已經在播放相同音效
        }
        
        this.stopSound(); // 停止當前音效
        
        const soundConfig = AMBIENT_SOUNDS[type];
        if (!soundConfig) {
            console.error('未知的音效類型:', type);
            return;
        }
        
        this.currentType = type;
        
        // 嘗試播放音效
        for (let i = 0; i < soundConfig.urls.length; i++) {
            try {
                await this.tryPlayUrl(soundConfig.urls[i]);
                this.isPlaying = true;
                console.log(`成功播放音效: ${soundConfig.name}`);
                return;
            } catch (error) {
                console.log(`音效 ${soundConfig.urls[i]} 播放失敗，嘗試下一個:`, error);
                if (i === soundConfig.urls.length - 1) {
                    console.log('所有網路音效都失敗，使用備用音效');
                    this.playFallbackSound(type);
                }
            }
        }
    }
    
    async tryPlayUrl(url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.loop = true;
            audio.volume = this.volume;
            audio.crossOrigin = 'anonymous';
            audio.preload = 'auto';
            
            audio.oncanplaythrough = () => {
                audio.play().then(() => {
                    this.currentAudio = audio;
                    resolve();
                }).catch(reject);
            };
            
            audio.onerror = () => {
                reject(new Error('音頻加載失敗'));
            };
            
            audio.src = url;
        });
    }
    
    playFallbackSound(type) {
        // 使用Web Audio API創建備用音效
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const masterGain = this.audioContext.createGain();
        masterGain.connect(this.audioContext.destination);
        masterGain.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
        
        const oscillators = [];
        
        switch (type) {
            case 'rain':
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
        
        this.currentAudio = {
            oscillators: oscillators,
            stop: function() {
                oscillators.forEach(osc => osc.stop());
            }
        };
        
        this.isPlaying = true;
        console.log(`使用備用音效: ${AMBIENT_SOUNDS[type].name}`);
    }
    
    stopSound() {
        if (this.currentAudio) {
            if (this.currentAudio.stop) {
                this.currentAudio.stop();
            } else {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            }
            this.currentAudio = null;
        }
        this.isPlaying = false;
        this.currentType = null;
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.currentAudio && this.currentAudio.volume !== undefined) {
            this.currentAudio.volume = this.volume;
        }
    }
    
    getAvailableSounds() {
        return Object.keys(AMBIENT_SOUNDS).map(key => ({
            key: key,
            name: AMBIENT_SOUNDS[key].name,
            description: AMBIENT_SOUNDS[key].description
        }));
    }
}

// 導出音效管理器
window.AmbientSoundManager = AmbientSoundManager;
