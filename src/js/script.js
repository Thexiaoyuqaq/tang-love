let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");

let clickCount = 0;

// 拒绝文本 
const noTexts = [
    "呜呜~泥是认真的嘛？🥺", 
    "哼哼，要不要再想想嘛？💭", 
    "不要点这个啦！求求你了~🥰", 
    "人家会伤心的啦...😢", 
    "不可以不可以！抱抱你~🤗"
];

noButton.addEventListener("click", function() {
    clickCount++;
    updateNoButton();
});


function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

document.addEventListener('wheel', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

function updateNoButton() {
    let yesSize = Math.min(1 + (clickCount * 0.15), 1.8);
    yesButton.style.transform = `scale(${yesSize})`;
    yesButton.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    if (clickCount > 0) {
        yesButton.style.animation = "shake 0.82s cubic-bezier(.36,.07,.19,.97) infinite";
    }

    if (clickCount < 5) {
        const buttonsContainer = document.querySelector('.buttons');
        const containerRect = buttonsContainer.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const isMobile = windowWidth <= 768;
        
        const movements = [
            { x: 1, y: -0.5 },
            { x: -1, y: -0.5 },
            { x: 1, y: 0.5 },
            { x: -1, y: 0.5 },
            { x: 0, y: -1 }
        ];
        
        const currentMovement = movements[clickCount - 1];
        const baseMove = isMobile ? 30 : 50;
        
        let moveX = baseMove * currentMovement.x * clickCount;
        let moveY = baseMove * currentMovement.y * clickCount;
        
        noButton.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        noButton.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 - clickCount * 0.05})`;
        
        noButton.innerHTML = `${noTexts[clickCount - 1]}`;
        
        createHeartBreak(noButton.getBoundingClientRect());
    } else {
        noButton.style.transition = 'all 0.2s ease-out';
        moveNoButtonAway();
    }

    updateMainImage();
}

function createHeartBreak(buttonRect) {
    const heart = document.createElement('div');
    heart.innerHTML = '💔';
    heart.style.position = 'fixed';
    heart.style.fontSize = '24px';
    heart.style.left = `${buttonRect.left + buttonRect.width/2}px`;
    heart.style.top = `${buttonRect.top + buttonRect.height/2}px`;
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.animation = 'heartBreak 1s forwards';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
}

function updateMainImage() {
    const images = {
        0: "./src/images/heart.png",
        1: "./src/images/shocked.png",
        2: "./src/images/think.png",
        3: "./src/images/angry.png",
        4: "./src/images/crying.png"
    };

    if (images[clickCount]) {
        mainImage.style.animation = "bounce 0.5s ease";
        setTimeout(() => {
            mainImage.src = images[clickCount];
            mainImage.style.animation = "";
        }, 250);
    }

    let moveUp = Math.min(clickCount * 20, 80);
    mainImage.style.transform = `translateY(-${moveUp}px)`;
    questionText.style.transform = `translateY(-${moveUp}px)`;
}

function moveNoButtonAway() {
    const maxDistance = 100;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * maxDistance + 50;
    
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;
    
    noButton.style.transform = `translate(${moveX}px, ${moveY}px) scale(0.8)`;
}

const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

function initMusicControl() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle.querySelector('i');
    const musicTip = document.querySelector('.music-tip');
    
    const playMusic = () => {
        return bgMusic.play().then(() => {
            musicIcon.className = 'fas fa-volume-up';
            musicToggle.classList.add('playing');
        }).catch(error => {
            console.log('Auto-play failed:', error);
            musicIcon.className = 'fas fa-volume-mute';
            musicToggle.classList.remove('playing');
            showMusicTip();
        });
    };

    const showMusicTip = () => {
        const musicTip = document.querySelector('.music-tip');
        
        // 添加小尾巴元素
        if (!musicTip.querySelector('.tip-tail')) {
            const tail = document.createElement('div');
            tail.className = 'tip-tail';
            musicTip.appendChild(tail);
        }
        
        requestAnimationFrame(() => {
            musicTip.classList.add('show');
            
            setTimeout(() => {
                requestAnimationFrame(() => {
                    musicTip.classList.add('hide');
                    setTimeout(() => {
                        musicTip.classList.remove('show', 'hide');
                    }, 400);
                });
            }, 3000);
        });
    };

    const toggleMusic = () => {
        if (bgMusic.paused) {
            playMusic();
        } else {
            bgMusic.pause();
            musicIcon.className = 'fas fa-volume-mute';
            musicToggle.classList.remove('playing');
        }
    };

    musicToggle.addEventListener('click', toggleMusic);

    const notesDiv = document.createElement('div');
    notesDiv.className = 'music-notes';
    musicToggle.appendChild(notesDiv);

    playMusic();
}

function createStars() {
    const stars = document.querySelector('.stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 1 + 's';
        stars.appendChild(star);
    }
}

function createBubbles() {
    const bubbles = document.querySelector('.bubbles');
    const fragment = document.createDocumentFragment();
    
    const createSingleBubble = () => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.width = Math.random() * 30 + 20 + 'px';
        bubble.style.height = bubble.style.width;
        fragment.appendChild(bubble);
        
        requestAnimationFrame(() => {
            bubbles.appendChild(fragment);
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.remove();
                }
            }, 4000);
        });
    };
    
    setInterval(createSingleBubble, 500);
}

function createFloatingHearts() {
    const fragment = document.createDocumentFragment();
    const heart = document.createElement('div');
    heart.className = 'heart-float';
    heart.innerHTML = '❤️';
    
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 25 + 15) + 'px';
    
    const duration = Math.random() * 3 + 8;
    heart.style.animationDuration = `${duration}s`;
    
    fragment.appendChild(heart);
    document.body.appendChild(fragment);
    
    requestAnimationFrame(() => {
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, duration * 1000);
    });
}

setInterval(createFloatingHearts, 500);

function initialHearts() {
    for(let i = 0; i < 15; i++) { 
        setTimeout(() => {
            createFloatingHearts();
        }, i * 200);
    }
}

const successMessages = [
    "小可爱，从今以后我们就是一对啦！🥰💑",
    "宝贝，我会永远永远爱你哦！🌸❤️",
    "亲爱的，以后的每一天都要和你一起度过呢！🎀😊",
    "么么哒，我会一直陪在你身边的！抱抱～🤗🌹",
    "我的小宝贝，你是我最最特别的人！✨💝",
    "亲亲，愿我们的爱情永远甜甜蜜蜜！🍭🍬",
    "宝宝，我会用尽全力让你成为世界上最幸福的人！🌈💖"
];


yesButton.addEventListener("click", function() {
    yesButton.style.animation = "none";
    yesButton.style.transform = 'scale(2.2)';
    yesButton.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    setTimeout(() => {
        createFireworks();
        showSuccessScene();
    }, 300);
});

function showSuccessScene() {
    const scene = document.querySelector('.success-scene');
    const container = scene.querySelector('.love-message-container');
    
    cleanupMainScene();
    container.innerHTML = '';
    scene.style.display = 'flex';
    
    requestAnimationFrame(() => {
        scene.classList.add('active');
        
        const heartEffectContainer = document.createElement('div');
        heartEffectContainer.className = 'heart-effect-container';
        scene.insertBefore(heartEffectContainer, scene.firstChild);
        
        createHeartEffect(heartEffectContainer);
        
        const fragment = document.createDocumentFragment();
        successMessages.forEach((msg, index) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'love-message';
            messageDiv.textContent = msg;
            messageDiv.style.animationDelay = `${index * 300}ms`;
            fragment.appendChild(messageDiv);
        });
        container.appendChild(fragment);
        
        requestAnimationFrame(() => {
            container.querySelectorAll('.love-message').forEach(msg => {
                msg.classList.add('animate');
            });
        });
        
        createSuccessSceneEffects();
    });
}

function createHeartEffect(container) {
    const colors = [
        '#ff6b8b', '#ff8da1', '#ffb6c1', '#ff69b4', '#ff1493'
    ];
    
    let activeHearts = 0;
    const maxHearts = window.innerWidth <= 768 ? 15 : 30;
    
    function createHeart() {
        if (!document.querySelector('.success-scene.active') || activeHearts >= maxHearts) return;
        
        const heart = document.createElement('div');
        heart.className = 'floating-effect-heart';

        const size = Math.random() * 15 + 8;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        
        const startX = Math.random() * 90 + 5;
        heart.style.left = `${startX}%`;
        heart.style.bottom = '0';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.backgroundColor = color;
        
        const duration = Math.random() * 2 + 3;
        const floatDistance = -40 - Math.random() * 40;
        const swayDistance = -20 + Math.random() * 40;
        
        heart.style.animation = `
            floatUp ${duration}s ease-out forwards,
            sway ${duration * 1.2}s ease-in-out infinite
        `;
        
        heart.style.setProperty('--float-distance', `${floatDistance}vh`);
        heart.style.setProperty('--sway-distance', `${swayDistance}px`);
        
        container.appendChild(heart);
        activeHearts++;
        
        setTimeout(() => {
            heart.remove();
            activeHearts--;
        }, duration * 1000);
    }
    
    let lastTime = 0;
    const interval = 300;
    
    function animate(currentTime) {
        if (!lastTime) lastTime = currentTime;
        
        if (currentTime - lastTime > interval) {
            createHeart();
            lastTime = currentTime;
        }
        
        if (document.querySelector('.success-scene.active')) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
    
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            lastTime = 0;
            requestAnimationFrame(animate);
        }
    });
    
    return () => {
        container.innerHTML = '';
        activeHearts = 0;
    };
}

function cleanupMainScene() {
    noButton.removeEventListener('click', updateNoButton);
    
    clearInterval(window.heartInterval);
    clearInterval(window.bubbleInterval);
    
    const elementsToRemove = [
        '.decorations',
        '.floating-hearts',
        '.sparkles',
        '.bubbles'
    ];
    
    elementsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });
    
    const mainElements = document.querySelectorAll('.container, #mainImage, .buttons');
    mainElements.forEach(el => {
        el.style.display = 'none';
    });

    window.noButton = null;
    window.yesButton = null;
    window.mainImage = null;
}

function createSuccessSceneEffects() {
    const scene = document.querySelector('.success-scene');
    const isMobile = window.innerWidth <= 768;
    
    const fragment = document.createDocumentFragment();
    
    const heartRain = document.createElement('div');
    heartRain.className = 'heart-rain';
    fragment.appendChild(heartRain);
    
    const loveBubbles = document.createElement('div');
    loveBubbles.className = 'love-bubbles';
    fragment.appendChild(loveBubbles);
    
    const successStars = document.createElement('div');
    successStars.className = 'success-stars';
    fragment.appendChild(successStars);
    
    scene.appendChild(fragment);

    const rainInterval = isMobile ? 800 : 300;
    const bubbleInterval = isMobile ? 1200 : 500;
    const starInterval = isMobile ? 600 : 200;
    
    let elementCount = 0;
    const maxElements = isMobile ? 30 : 60;

    function createRainHeart() {
        if (elementCount >= maxElements) return;
        
        const heart = document.createElement('div');
        heart.className = 'rain-heart';
        heart.innerHTML = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 8 + 6}px`;
        heart.style.setProperty('--duration', `${Math.random() * 1 + 2}s`);
        heartRain.appendChild(heart);
        
        elementCount++;
        setTimeout(() => {
            heart.remove();
            elementCount--;
        }, 3000);
    }

    function createBubble() {
        if (elementCount >= maxElements) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'love-bubble';
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;
        bubble.style.width = `${Math.random() * 15 + 10}px`;
        bubble.style.height = bubble.style.width;
        loveBubbles.appendChild(bubble);
        
        elementCount++;
        setTimeout(() => {
            bubble.remove();
            elementCount--;
        }, 4000);
    }

    function createStar() {
        if (elementCount >= maxElements) return;
        
        const star = document.createElement('div');
        star.className = 'success-star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        successStars.appendChild(star);
        
        elementCount++;
        setTimeout(() => {
            star.remove();
            elementCount--;
        }, 2000);
    }

    let lastRainTime = 0;
    let lastBubbleTime = 0;
    let lastStarTime = 0;

    function animate(timestamp) {
        if (timestamp - lastRainTime > rainInterval) {
            createRainHeart();
            lastRainTime = timestamp;
        }
        if (timestamp - lastBubbleTime > bubbleInterval) {
            createBubble();
            lastBubbleTime = timestamp;
        }
        if (timestamp - lastStarTime > starInterval) {
            createStar();
            lastStarTime = timestamp;
        }
        
        if (!document.hidden) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            requestAnimationFrame(animate);
        }
    });

    return () => {
        heartRain.remove();
        loveBubbles.remove();
        successStars.remove();
    };
}

function createFireworks() {
    const colors = ['#ff69b4', '#ff1493', '#ff69b4', '#ff8da1', '#ffa5a5'];
    
    for(let i = 0; i < 20; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + 'vw';
            firework.style.top = Math.random() * 100 + 'vh';
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(firework);
            
            setTimeout(() => {
                firework.remove();
            }, 1000);
        }, i * 100);
    }
}

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    initializeApp();
});

function initializeApp() {
    createStars();
    createBubbles();
    initMusicControl();
    initialHearts();
    initCopyright();
    initSettings();
    initRomanticBackground();
    
    const images = [
        './src/images/heart.png',
        './src/images/shocked.png',
        './src/images/think.png',
        './src/images/angry.png',
        './src/images/crying.png',
        './src/images/hug.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            requestAnimationFrame(() => {
                entry.target.classList.add('animate');
            });
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '20px'
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.love-message').forEach(msg => {
        animationObserver.observe(msg);
    });
});

function initCopyright() {
    const copyright = document.querySelector('.copyright');
    
    copyright.innerHTML = `
        <div class="copyright-content">
            <div class="main-text">
                Original by <a href="https://github.com/37tt" target="_blank">37tt</a> | 
                Modified by <a href="https://github.com/Thexiaoyuqaq" target="_blank">Thexiaoyu</a>
            </div>
            <div class="expand-btn">查看更多</div>
            <div class="star-text">
                本项目已在 GitHub 开源，欢迎 Star ⭐<br>
                <span class="extra-text">小雨在这里！祝贺每一对情侣长生九九！！！</span>
            </div>
        </div>
    `;

    const expandBtn = copyright.querySelector('.expand-btn');
    let isExpanded = false;
    let timeout;

    expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isExpanded = !isExpanded;
        copyright.classList.toggle('expanded', isExpanded);
        expandBtn.textContent = isExpanded ? '收起' : '查看更多';
        
        clearTimeout(timeout);
        if (isExpanded) {
            timeout = setTimeout(() => {
                copyright.classList.remove('expanded');
                expandBtn.textContent = '查看更多';
                isExpanded = false;
            }, 5000);
        }
    });

    copyright.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
    });

    copyright.addEventListener('mouseleave', () => {
        if (isExpanded) {
            timeout = setTimeout(() => {
                copyright.classList.remove('expanded');
                expandBtn.textContent = '查看更多';
                isExpanded = false;
            }, 2000);
        }
    });
}

const newStyles = `
@keyframes heartBreak {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    50% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.2) rotate(15deg);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -100%) scale(0.5) rotate(-15deg);
    }
}

@keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

@keyframes shake {
    0%, 100% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) rotate(0deg); 
    }
    10% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) translate(-1px, -1px) rotate(-2deg); 
    }
    20% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) translate(-2px, 1px) rotate(2deg); 
    }
    30% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) translate(2px, 1px) rotate(-2deg); 
    }
    40% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) translate(1px, -1px) rotate(2deg); 
    }
    50% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) translate(-1px, 1px) rotate(-1deg); 
    }
    60% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) translate(-2px, -1px) rotate(1deg); 
    }
    70% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) translate(2px, 1px) rotate(-1deg); 
    }
    80% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) translate(-1px, -1px) rotate(1deg); 
    }
    90% { 
        transform: scale(${Math.min(1 + (clickCount * 0.15), 1.8)}) translate(1px, 1px) rotate(0deg); 
    }
}

@keyframes finalYesScale {
    0% { transform: scale(1); }
    60% { transform: scale(2.4); }
    100% { transform: scale(2.2); }
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = newStyles;
document.head.appendChild(styleSheet);

function initSettings() {
    const settingsBtn = document.createElement('div');
    settingsBtn.className = 'settings-btn';
    settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
    document.body.appendChild(settingsBtn);

    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'settings-panel';
    settingsPanel.innerHTML = `
        <div class="settings-content">
            <h3>💝 定制你的表白</h3>
            <div class="settings-item">
                <label>赠与人：</label>
                <input type="text" id="recipientName" placeholder="输入对方的名字" maxlength="10">
            </div>
            <div class="settings-item">
                <label>背景音乐：</label>
                <div class="music-input-group">
                    <input type="text" id="musicId" placeholder="输入网易云音乐ID" maxlength="20">
                    <div class="music-tip-text">
                        仅支持网易云音乐，<a href="./setmusic.html" target="_blank">如何获取音乐ID？</a>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <button id="generateLink" class="generate-btn">生成专属链接</button>
            </div>
            <div class="settings-item link-result" style="display: none;">
                <p>你的专属链接：</p>
                <div class="link-box">
                    <input type="text" id="generatedLink" readonly>
                    <button id="copyLink" class="copy-btn">复制</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(settingsPanel);

    let isSettingsOpen = false;
    settingsBtn.addEventListener('click', () => {
        isSettingsOpen = !isSettingsOpen;
        settingsBtn.classList.toggle('active', isSettingsOpen);
        settingsPanel.classList.toggle('show', isSettingsOpen);
    });

    const generateBtn = document.getElementById('generateLink');
    const linkResult = document.querySelector('.link-result');
    const linkInput = document.getElementById('generatedLink');
    const copyBtn = document.getElementById('copyLink');
    const recipientInput = document.getElementById('recipientName');
    const musicInput = document.getElementById('musicId');

    generateBtn.addEventListener('click', () => {
        const recipient = recipientInput.value.trim();
        const musicId = musicInput.value.trim();
        
        if (!recipient) {
            alert('请输入赠与人名字');
            return;
        }

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('to', encodeURIComponent(recipient));
        if (musicId) {
            currentUrl.searchParams.set('music', musicId);
        }
        linkInput.value = currentUrl.href;
        linkResult.style.display = 'block';
    });

    copyBtn.addEventListener('click', () => {
        linkInput.select();
        document.execCommand('copy');
        copyBtn.textContent = '已复制!';
        setTimeout(() => {
            copyBtn.textContent = '复制';
        }, 2000);
    });

    function updateTitle() {
        const urlParams = new URLSearchParams(window.location.search);
        const recipient = urlParams.get('to');
        if (recipient) {
            const decodedName = decodeURIComponent(recipient);
            questionText.innerHTML = `${decodedName}，<br>可以成为我的恋人吗？`;
            recipientInput.value = decodedName;
        }
    }

    function updateMusicSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const musicId = urlParams.get('music');
        const musicInput = document.getElementById('musicId');
        
        if (musicId) {
            musicInput.value = musicId;
            bgMusic.src = `https://api.injahow.cn/meting/?type=url&id=${musicId}`;
        }
    }

    updateMusicSource();
    updateTitle();
}

function initRomanticBackground() {
    const bg = document.createElement('div');
    bg.className = 'romantic-bg';
    document.body.appendChild(bg);

    const hearts = document.createElement('div');
    hearts.className = 'floating-hearts';
    bg.appendChild(hearts);

    const spots = document.createElement('div');
    spots.className = 'light-spots';
    bg.appendChild(spots);

    const stars = document.createElement('div');
    stars.className = 'twinkling-stars';
    bg.appendChild(stars);

    function createDecorations() {
        const isMobile = window.innerWidth <= 768;
        const heartCount = isMobile ? 8 : 20;
        const spotCount = isMobile ? 4 : 8;
        const starCount = isMobile ? 20 : 50;
        
        for(let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '❤';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.setProperty('--duration', `${6 + Math.random() * 4}s`);
            heart.style.setProperty('--moveX', `${-50 + Math.random() * 100}px`);
            heart.style.setProperty('--rotate', `${Math.random() * 360}deg`);
            heart.style.animationDelay = `${Math.random() * 5}s`;
            hearts.appendChild(heart);
        }

        for(let i = 0; i < spotCount; i++) {
            const spot = document.createElement('div');
            spot.className = 'light-spot';
            spot.style.left = `${Math.random() * 100}%`;
            spot.style.top = `${Math.random() * 100}%`;
            spot.style.setProperty('--moveX', `${-30 + Math.random() * 60}px`);
            spot.style.setProperty('--moveY', `${-30 + Math.random() * 60}px`);
            spots.appendChild(spot);
        }

        for(let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            stars.appendChild(star);
        }
    }

    createDecorations();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            hearts.innerHTML = '';
            spots.innerHTML = '';
            stars.innerHTML = '';
            createDecorations();
        }, 250);
    });
}
