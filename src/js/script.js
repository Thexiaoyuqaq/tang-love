
let clickCount = 0;
let isPlaying = false;
let currentTheme = 'pink';
let particles = [];
let audioContext = null;
let analyser = null;
let dataArray = null;
let animationId = null;
let audioSource = null;

const elements = {
    mainContainer: document.getElementById('mainContainer'),
    character: document.getElementById('character'),
    characterImage: document.getElementById('characterImage'),
    mainQuestion: document.getElementById('mainQuestion'),
    btnYes: document.getElementById('btnYes'),
    btnNo: document.getElementById('btnNo'),
    hintText: document.getElementById('hintText'),
    successScene: document.getElementById('successScene'),
    loveMessages: document.getElementById('loveMessages'),
    bgMusic: document.getElementById('bgMusic'),
    musicToggle: document.getElementById('musicToggle'),
    settingsToggle: document.getElementById('settingsToggle'),
    settingsPanel: document.getElementById('settingsPanel'),
    settingsClose: document.getElementById('settingsClose'),
    recipientName: document.getElementById('recipientName'),
    musicId: document.getElementById('musicId'),
    btnGenerate: document.getElementById('btnGenerate'),
    linkResult: document.getElementById('linkResult'),
    generatedLink: document.getElementById('generatedLink'),
    btnCopy: document.getElementById('btnCopy'),
    btnCelebrate: document.getElementById('btnCelebrate')
};

const config = {
    messages: {
        refuse: [
            "真的不再考虑一下吗?😢",
            "给我一次机会好不好?🥺",
            "我会对你很好很好的!💝",
            "别拒绝我嘛~ 🌹",
            "你再想想呢?✨",
            "我真的真的很喜欢你!💕"
        ],
        hints: [
            "💭 仔细想想哦...",
            "💭 其实我人很好的...",
            "💭 我们会很幸福的...",
            "💭 试试看嘛...",
            "💭 给爱一个机会...",
            "💭 跟着心走..."
        ],
        success: [
            "从今以后,你就是我最珍贵的宝贝!",
            "我会用一生来爱你,守护你!",
            "谢谢你愿意走进我的生命!",
            "让我们一起创造美好的回忆吧!",
            "你的笑容是我最大的幸福!",
            "我爱你,现在是,以后也是!",
            "余生请多指教,我的爱人!"
        ]
    },
    characterImages: {
        happy: './src/images/heart.png',
        shocked: './src/images/shocked.png',
        think: './src/images/think.png',
        crying: './src/images/crying.png',
        angry: './src/images/angry.png',
        love: './src/images/heart.png'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    checkUrlParams();
    
    initCanvas();
    
    initEventListeners();
    
    initAnimations();
    
    initTheme();

    initCopyright()
    
    setTimeout(() => {
        showMusicTip();
    }, 2000);
    
    createRandomDecorations();
}

function initCopyright() {
    const copyrightElement = document.querySelector('.copyright');
    
    if (!copyrightElement) {
        console.log('版权元素未找到');
        return;
    }
    
    const expandBtn = copyrightElement.querySelector('.expand-btn');
    
    if (!expandBtn) {
        console.log('展开按钮未找到');
        return;
    }
    
    let isExpanded = false;
    let timeout;

    expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isExpanded = !isExpanded;
        copyrightElement.classList.toggle('expanded', isExpanded);
        expandBtn.textContent = isExpanded ? '收起' : '查看更多';
        
        clearTimeout(timeout);
        if (isExpanded) {
            timeout = setTimeout(() => {
                copyrightElement.classList.remove('expanded');
                expandBtn.textContent = '查看更多';
                isExpanded = false;
            }, 5000);
        }
    });

    copyrightElement.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
    });

    copyrightElement.addEventListener('mouseleave', () => {
        if (isExpanded) {
            timeout = setTimeout(() => {
                copyrightElement.classList.remove('expanded');
                expandBtn.textContent = '查看更多';
                isExpanded = false;
            }, 2000);
        }
    });
}

function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    const recipient = params.get('to');
    if (recipient) {
        const name = decodeURIComponent(recipient);
        elements.recipientName.value = name;
        updateQuestionText(name);
    }
    
    const musicId = params.get('music');
    if (musicId) {
        elements.musicId.value = musicId;
        updateMusicSource(musicId);
    }
    
    const theme = params.get('theme');
    if (theme && ['pink', 'blue', 'green', 'sunset'].includes(theme)) {
        changeTheme(theme);
    }
}

function updateQuestionText(name) {
    const questionText = elements.mainQuestion.querySelector('.question-text');
    questionText.innerHTML = `${name},<br>你愿意成为我的恋人吗?`;
}

function updateMusicSource(musicId) {
    elements.bgMusic.src = `https://api.injahow.cn/meting/?type=url&id=${musicId}`;
}

function initEventListeners() {
    elements.btnYes.addEventListener('click', handleYesClick);
    
    elements.btnNo.addEventListener('click', handleNoClick);
    elements.btnNo.addEventListener('mouseenter', handleNoHover);
    
    elements.musicToggle.addEventListener('click', toggleMusic);
    
    elements.settingsToggle.addEventListener('click', toggleSettings);
    elements.settingsClose.addEventListener('click', closeSettings);
    
    elements.settingsPanel.addEventListener('click', (e) => {
        if (e.target === elements.settingsPanel) {
            closeSettings();
        }
    });
    
    elements.btnGenerate.addEventListener('click', generateLink);
    elements.btnCopy.addEventListener('click', copyLink);
    
    elements.btnCelebrate.addEventListener('click', celebrate);
    
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            changeTheme(theme);
            
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

function handleYesClick() {
    elements.btnYes.style.transform = 'scale(1.3)';
    
    updateCharacterExpression('love');
    
    createHeartBurst();
    
    createMultipleFireworks();
    
    setTimeout(() => {
        showSuccessScene();
    }, 800);
}

function handleNoClick() {
    clickCount++;
    
    updateNoButton();
    
    updateCharacterExpression(getExpressionByClickCount());
    
    updateHintText();
    
    createRefuseEffect();
    
    growYesButton();
    
    shakeScreen();
}

function handleNoHover(e) {
    if (clickCount > 5) {
        makeButtonEscape(elements.btnNo, e);
    }
}

function updateNoButton() {
    const message = config.messages.refuse[Math.min(clickCount - 1, config.messages.refuse.length - 1)];
    elements.btnNo.innerHTML = `<span class="btn-content">${message}</span>`;
    
    if (clickCount <= 3) {
        moveButtonRandomly(elements.btnNo);
    } else if (clickCount <= 5) {
        const currentTransform = elements.btnNo.style.transform || '';
        const translateMatch = currentTransform.match(/translate\(([^)]+)\)/);
        const translatePart = translateMatch ? `translate(${translateMatch[1]})` : '';
        
        const scale = Math.max(0.6, 1 - clickCount * 0.08);
        elements.btnNo.style.transform = `${translatePart} scale(${scale})`;
    }
}

function moveButtonRandomly(button) {
    const isMobile = window.innerWidth <= 768;
    const maxMove = isMobile ? 60 : 120;
    
    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let x, y;
    let attempts = 0;
    do {
        x = (Math.random() - 0.5) * maxMove * 2;
        y = (Math.random() - 0.5) * maxMove * 2;
        attempts++;
    } while (
        attempts < 10 && (
            rect.left + x < 20 || 
            rect.right + x > viewportWidth - 20 ||
            rect.top + y < 100 ||
            rect.bottom + y > viewportHeight - 100
        )
    );
    
    const currentTransform = button.style.transform || '';
    const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
    const currentScale = scaleMatch ? scaleMatch[1] : '1';
    
    button.style.transform = `translate(${x}px, ${y}px) scale(${currentScale})`;
    button.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

function makeButtonEscape(button, e) {
    const isMobile = window.innerWidth <= 768;
    const distance = isMobile ? 120 : 200;
    
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    
    let escapeX = Math.cos(angle + Math.PI) * distance;
    let escapeY = Math.sin(angle + Math.PI) * distance;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const newLeft = rect.left + escapeX;
    const newTop = rect.top + escapeY;
    
    if (newLeft < 20) escapeX = 20 - rect.left;
    if (newLeft + rect.width > viewportWidth - 20) escapeX = viewportWidth - 20 - rect.left - rect.width;
    if (newTop < 100) escapeY = 100 - rect.top;
    if (newTop + rect.height > viewportHeight - 100) escapeY = viewportHeight - 100 - rect.top - rect.height;
    
    button.style.transform = `translate(${escapeX}px, ${escapeY}px) scale(0.7)`;
    button.style.transition = 'transform 0.2s ease-out';
}

function growYesButton() {
    const scale = Math.min(1 + clickCount * 0.12, 2);
    elements.btnYes.style.transform = `scale(${scale})`;
    elements.btnYes.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    if (clickCount > 2) {
        elements.btnYes.style.animation = 'pulse 1s ease-in-out infinite';
    }
}

function shakeScreen() {
    document.body.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
}

function updateCharacterExpression(expression) {
    const character = elements.character;
    const characterImage = elements.characterImage;
    
    const imagePath = config.characterImages[expression];
    
    if (imagePath && characterImage) {
        characterImage.src = imagePath;
        
        character.style.animation = 'none';
        setTimeout(() => {
            character.style.animation = 'bounce 0.6s ease-out';
        }, 10);
    }
}

function getExpressionByClickCount() {
    if (clickCount === 1) return 'shocked';
    if (clickCount === 2) return 'think';
    if (clickCount === 3) return 'crying';
    if (clickCount >= 4) return 'angry';
    return 'happy';
}

function updateHintText() {
    const hint = config.messages.hints[Math.min(clickCount - 1, config.messages.hints.length - 1)];
    elements.hintText.innerHTML = `<p>${hint}</p>`;
    
    elements.hintText.style.animation = 'none';
    setTimeout(() => {
        elements.hintText.style.animation = 'bounceIn 0.6s ease-out';
    }, 10);
}

function showSuccessScene() {
    elements.mainContainer.style.opacity = '0';
    elements.mainContainer.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        elements.mainContainer.style.display = 'none';
        
        elements.successScene.classList.add('show');
        
        generateLoveMessages();
        
        createCelebrationEffects();
    }, 300);
}

function generateLoveMessages() {
    elements.loveMessages.innerHTML = '';
    
    config.messages.success.forEach((msg, index) => {
        setTimeout(() => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'love-message';
            messageDiv.textContent = msg;
            messageDiv.style.animationDelay = `${index * 0.15}s`;
            elements.loveMessages.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    messageDiv.style.transform = 'scale(1)';
                }, 200);
            }, 50);
        }, index * 200);
    });
}

function createHeartBurst() {
    const colors = ['#ff6b8b', '#ff8da1', '#ffb6c1', '#ff69b4', '#ff1493'];
    const count = 40;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤';
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.transform = 'translate(-50%, -50%)';
            heart.style.fontSize = Math.random() * 25 + 15 + 'px';
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.zIndex = '9999';
            heart.style.pointerEvents = 'none';
            
            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
            const velocity = Math.random() * 350 + 250;
            const duration = Math.random() * 1.2 + 1;
            const rotation = Math.random() * 720 - 360;
            
            document.body.appendChild(heart);
            
            heart.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), calc(-50% + ${Math.sin(angle) * velocity}px)) scale(1.2) rotate(${rotation}deg)`,
                    opacity: 0.8,
                    offset: 0.7
                },
                {
                    transform: `translate(calc(-50% + ${Math.cos(angle) * velocity * 1.3}px), calc(-50% + ${Math.sin(angle) * velocity * 1.3}px)) scale(0.5) rotate(${rotation * 1.5}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0, 0.5, 1, 1)'
            }).onfinish = () => heart.remove();
        }, i * 20);
    }
}

function createRefuseEffect() {
    const emojis = ['💔', '😢', '😭', '🥺'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const effect = document.createElement('div');
    effect.innerHTML = emoji;
    effect.style.position = 'fixed';
    effect.style.left = elements.btnNo.getBoundingClientRect().left + elements.btnNo.offsetWidth / 2 + 'px';
    effect.style.top = elements.btnNo.getBoundingClientRect().top + 'px';
    effect.style.fontSize = '2.5rem';
    effect.style.zIndex = '9999';
    effect.style.pointerEvents = 'none';
    effect.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(effect);
    
    effect.animate([
        { 
            transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', 
            opacity: 1 
        },
        { 
            transform: 'translate(-50%, -80px) scale(1.5) rotate(15deg)', 
            opacity: 0.5,
            offset: 0.5
        },
        { 
            transform: 'translate(-50%, -120px) scale(0.5) rotate(-15deg)', 
            opacity: 0 
        }
    ], {
        duration: 1200,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }).onfinish = () => effect.remove();
}

function createCelebrationEffects() {
    setTimeout(() => createConfetti(), 100);
    setTimeout(() => createConfetti(), 400);
    setTimeout(() => createConfetti(), 700);
    
    setTimeout(() => createMultipleFireworks(), 200);
    
    createBubbles();
    
    createTwinkleStars();
}

function createConfetti() {
    const colors = ['#ff6b8b', '#ffa5a5', '#ff69b4', '#ff1493', '#ffb6c1', '#ffd700', '#ff8c00'];
    const count = 60;
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 12 + 6 + 'px';
        confetti.style.height = Math.random() * 12 + 6 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3000 + 2500;
        const rotation = Math.random() * 1080 - 540;
        const sway = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            { 
                transform: 'translateY(0) translateX(0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translateY(50vh) translateX(${sway / 2}px) rotate(${rotation / 2}deg)`, 
                opacity: 1,
                offset: 0.5
            },
            { 
                transform: `translateY(100vh) translateX(${sway}px) rotate(${rotation}deg)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            delay: Math.random() * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

function createMultipleFireworks() {
    const positions = [
        { x: '20%', y: '30%' },
        { x: '50%', y: '25%' },
        { x: '80%', y: '35%' },
        { x: '35%', y: '45%' },
        { x: '65%', y: '40%' }
    ];
    
    positions.forEach((pos, index) => {
        setTimeout(() => {
            createFirework(pos.x, pos.y);
        }, index * 300);
    });
}

function createFirework(xPos, yPos) {
    const colors = ['#ff6b8b', '#ff8da1', '#ffb6c1', '#ffd700', '#ff69b4'];
    const particles = 40;
    const centerX = window.innerWidth * parseFloat(xPos) / 100;
    const centerY = window.innerHeight * parseFloat(yPos) / 100;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.borderRadius = '50%';
        particle.style.zIndex = '9999';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = '0 0 10px currentColor';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 / particles) * i;
        const velocity = Math.random() * 120 + 80;
        const duration = Math.random() * 800 + 800;
        
        particle.animate([
            { 
                transform: 'translate(-50%, -50%) scale(0)', 
                opacity: 1 
            },
            { 
                transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), calc(-50% + ${Math.sin(angle) * velocity}px)) scale(1)`, 
                opacity: 1,
                offset: 0.3
            },
            { 
                transform: `translate(calc(-50% + ${Math.cos(angle) * velocity * 1.5}px), calc(-50% + ${Math.sin(angle) * velocity * 1.5 + 50}px)) scale(0.5)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0, 0.5, 1, 1)'
        }).onfinish = () => particle.remove();
    }
}

function createBubbles() {
    const interval = setInterval(() => {
        if (!elements.successScene.classList.contains('show')) {
            clearInterval(interval);
            return;
        }
        
        const bubble = document.createElement('div');
        bubble.style.position = 'fixed';
        const size = Math.random() * 40 + 20;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        bubble.style.border = '2px solid rgba(255, 255, 255, 0.4)';
        bubble.style.borderRadius = '50%';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = '-60px';
        bubble.style.zIndex = '9998';
        bubble.style.pointerEvents = 'none';
        
        document.body.appendChild(bubble);
        
        const duration = Math.random() * 4000 + 4000;
        const sway = (Math.random() - 0.5) * 100;
        
        bubble.animate([
            { 
                transform: 'translateY(0) translateX(0) scale(0)', 
                opacity: 0 
            },
            { 
                transform: 'translateY(-20vh) translateX(0) scale(1)', 
                opacity: 0.6,
                offset: 0.1
            },
            { 
                transform: `translateY(-60vh) translateX(${sway / 2}px) scale(1)`, 
                opacity: 0.6,
                offset: 0.6
            },
            { 
                transform: `translateY(-110vh) translateX(${sway}px) scale(0.8)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => bubble.remove();
    }, 600);
}

function createTwinkleStars() {
    const stars = 30;
    
    for (let i = 0; i < stars; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.innerHTML = '✨';
            star.style.position = 'fixed';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.fontSize = Math.random() * 20 + 15 + 'px';
            star.style.zIndex = '9999';
            star.style.pointerEvents = 'none';
            
            document.body.appendChild(star);
            
            star.animate([
                { 
                    transform: 'scale(0) rotate(0deg)', 
                    opacity: 0 
                },
                { 
                    transform: 'scale(1.2) rotate(180deg)', 
                    opacity: 1,
                    offset: 0.5
                },
                { 
                    transform: 'scale(0) rotate(360deg)', 
                    opacity: 0 
                }
            ], {
                duration: 2000,
                delay: Math.random() * 1000,
                easing: 'ease-in-out'
            }).onfinish = () => star.remove();
        }, i * 100);
    }
}

function createRandomDecorations() {
    setInterval(() => {
        const decorations = ['✨', '⭐', '💫', '🌟'];
        const decoration = document.createElement('div');
        decoration.innerHTML = decorations[Math.floor(Math.random() * decorations.length)];
        decoration.style.position = 'fixed';
        decoration.style.left = Math.random() * 100 + '%';
        decoration.style.top = '-50px';
        decoration.style.fontSize = Math.random() * 20 + 15 + 'px';
        decoration.style.zIndex = '5';
        decoration.style.pointerEvents = 'none';
        decoration.style.opacity = '0.4';
        
        document.body.appendChild(decoration);
        
        const duration = Math.random() * 10000 + 8000;
        const sway = (Math.random() - 0.5) * 200;
        
        decoration.animate([
            { 
                transform: `translateY(0) translateX(0) rotate(0deg)`, 
                opacity: 0 
            },
            { 
                transform: `translateY(30vh) translateX(${sway / 3}px) rotate(120deg)`, 
                opacity: 0.4,
                offset: 0.2
            },
            { 
                transform: `translateY(70vh) translateX(${sway * 2 / 3}px) rotate(240deg)`, 
                opacity: 0.4,
                offset: 0.7
            },
            { 
                transform: `translateY(110vh) translateX(${sway}px) rotate(360deg)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => decoration.remove();
    }, 3000);
}

function toggleMusic() {
    if (isPlaying) {
        elements.bgMusic.pause();
        elements.musicToggle.classList.remove('playing');
        elements.character.classList.remove('music-playing');
        stopAudioVisualization();
        isPlaying = false;
        console.log('音乐已暂停');
    } else {
        if (!audioContext) {
            setupAudioVisualization();
        }
        
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log('音频上下文已恢复');
            });
        }
        
        elements.bgMusic.play().then(() => {
            elements.musicToggle.classList.add('playing');
            elements.character.classList.add('music-playing');
            isPlaying = true;
            startAudioVisualization();
            console.log('音乐开始播放，可视化已启动');
        }).catch(err => {
            console.error('播放失败:', err);
            showMusicTip();
            isPlaying = false;
        });
    }
}



function startAudioVisualization() {
    if (!analyser || !dataArray) {
        console.error('分析器未初始化');
        return;
    }
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    visualizeAudio();
}


function setupAudioVisualization() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('音频上下文创建成功');
        
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.7;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        if (!audioSource) {
            audioSource = audioContext.createMediaElementSource(elements.bgMusic);
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
            console.log('音频源连接成功');
        }
        
    } catch (error) {
        console.error('音频可视化初始化失败:', error);
    }
}

function visualizeAudio() {
    if (!analyser || !isPlaying) {
        return;
    }
    
    analyser.getByteFrequencyData(dataArray);
    const bars = document.querySelectorAll('.visualizer-bar');
    
    if (bars.length === 0) {
        animationId = requestAnimationFrame(visualizeAudio);
        return;
    }
    
    const barCount = bars.length;
    const dataStep = Math.floor(dataArray.length / barCount);
    
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    let minHeight, maxHeight;
    if (isSmallMobile) {
        minHeight = 8;
        maxHeight = 60;
    } else if (isMobile) {
        minHeight = 10;
        maxHeight = 80;
    } else {
        minHeight = 12;
        maxHeight = 100;
    }
    
    bars.forEach((bar, index) => {
        const startIdx = index * dataStep;
        const endIdx = Math.min(startIdx + dataStep, dataArray.length);
        
        let sum = 0;
        let count = 0;
        
        for (let i = startIdx; i < endIdx; i++) {
            sum += dataArray[i];
            count++;
        }
        
        const average = count > 0 ? sum / count : 0;
        
        let finalValue = average;
        if (index < 4) {
            finalValue = Math.min(average * 1.5, 255);
        }
        
        const normalized = finalValue / 255;
        
        const enhanced = Math.pow(normalized, 0.6);
        
        const height = minHeight + enhanced * (maxHeight - minHeight);
        const finalHeight = Math.max(minHeight, Math.min(maxHeight, height));
        
        bar.style.height = finalHeight + 'px';
        bar.style.opacity = 0.5 + enhanced * 0.5;
        bar.style.filter = `drop-shadow(0 0 ${4 + enhanced * 15}px currentColor)`;
    });
    
    animationId = requestAnimationFrame(visualizeAudio);
}


function stopAudioVisualization() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    const bars = document.querySelectorAll('.visualizer-bar');
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    const defaultHeight = isSmallMobile ? 15 : (isMobile ? 20 : 25);
    
    bars.forEach(bar => {
        bar.style.height = defaultHeight + 'px';
        bar.style.opacity = '0.6';
        bar.style.filter = 'drop-shadow(0 0 4px currentColor)';
    });
}

function showMusicTip() {
    const tip = document.querySelector('.music-tip');
    if (!tip) return;
    
    tip.classList.add('show');
    
    setTimeout(() => {
        tip.classList.remove('show');
    }, 3000);
}

function toggleSettings() {
    elements.settingsPanel.classList.toggle('show');
    elements.settingsToggle.classList.toggle('active');
}

function closeSettings() {
    elements.settingsPanel.classList.remove('show');
    elements.settingsToggle.classList.remove('active');
}

function generateLink() {
    const name = elements.recipientName.value.trim();
    const musicId = elements.musicId.value.trim();
    
    if (!name) {
        alert('请输入表白对象的名字!');
        return;
    }
    
    const url = new URL(window.location.href);
    url.searchParams.set('to', encodeURIComponent(name));
    
    if (musicId) {
        url.searchParams.set('music', musicId);
    }
    
    url.searchParams.set('theme', currentTheme);
    
    elements.generatedLink.value = url.toString();
    elements.linkResult.classList.add('show');
}

function copyLink() {
    elements.generatedLink.select();
    document.execCommand('copy');
    
    const originalHTML = elements.btnCopy.innerHTML;
    elements.btnCopy.innerHTML = '<i class="fas fa-check"></i>';
    elements.btnCopy.style.background = '#10b981';
    elements.btnCopy.style.color = '#fff';
    
    setTimeout(() => {
        elements.btnCopy.innerHTML = originalHTML;
        elements.btnCopy.style.background = '';
        elements.btnCopy.style.color = '';
    }, 2000);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'pink';
    changeTheme(savedTheme);
}

function changeTheme(theme) {
    currentTheme = theme;
    
    document.body.classList.remove('theme-pink', 'theme-blue', 'theme-green', 'theme-sunset');
    
    document.body.classList.add(`theme-${theme}`);
    
    localStorage.setItem('theme', theme);
    
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    document.body.style.transition = 'all 0.5s ease';
    
    console.log('主题已切换到:', theme);
}

function celebrate() {
    createHeartBurst();
    createConfetti();
    createMultipleFireworks();
    createTwinkleStars();
}

function initCanvas() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    for (let i = 0; i < 25; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 25 + 12,
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6,
            opacity: Math.random() * 0.3 + 0.1
        });
    }
    
    animateCanvas();
}

function animateCanvas() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = '#ff6b8b';
        ctx.font = particle.size + 'px sans-serif';
        ctx.fillText('❤', 0, 0);
        ctx.restore();
    });
    
    requestAnimationFrame(animateCanvas);
}

function initAnimations() {
    const elementsToAnimate = [
        { element: elements.character, animation: 'bounceIn', delay: 0 },
        { element: elements.mainQuestion, animation: 'slideInDown', delay: 200 },
        { element: '.buttons-group', animation: 'slideInUp', delay: 400 },
        { element: elements.hintText, animation: 'fadeIn', delay: 600 }
    ];
    
    elementsToAnimate.forEach(item => {
        setTimeout(() => {
            const el = typeof item.element === 'string' 
                ? document.querySelector(item.element) 
                : item.element;
            if (el) {
                el.style.animation = `${item.animation} 0.8s ease-out`;
            }
        }, item.delay);
    });
}