let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");

let clickCount = 0;

const noTexts = [
    "？你认真的吗…", 
    "要不再想想？", 
    "不许选这个！ ", 
    "我会很伤心…", 
    "不行:("
];

noButton.addEventListener("click", function() {
    clickCount++;
    updateNoButton();
});

noButton.addEventListener("mouseover", function() {
    if (clickCount >= 5) { 
        moveNoButton();
    }
});

function moveNoButton() {
    const buttonRect = noButton.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const distanceX = mouseX - (buttonRect.left + buttonRect.width/2);
    const distanceY = mouseY - (buttonRect.top + buttonRect.height/2);

    const safetyPadding = 20;
    const maxX = window.innerWidth - buttonRect.width - safetyPadding;
    const maxY = window.innerHeight - buttonRect.height - safetyPadding;
    const minX = safetyPadding;
    const minY = safetyPadding;

    let newX = buttonRect.left - distanceX;
    let newY = buttonRect.top - distanceY;

    newX = Math.min(Math.max(minX, newX), maxX);
    newY = Math.min(Math.max(minY, newY), maxY);
 
    noButton.style.position = 'fixed';
    noButton.style.transform = 'none';
    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;
    noButton.style.transition = 'all 0.2s ease-out';
}

document.addEventListener('wheel', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

function updateNoButton() {
    let yesSize = Math.min(1 + (clickCount * 1.2), 4);
    yesButton.style.transform = `scale(${yesSize})`;

    if (clickCount < 5) {
        const buttonsContainer = document.querySelector('.buttons');
        const containerRect = buttonsContainer.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const isMobile = windowWidth <= 768;
        
        // 计算移动方向，每次点击改变方向
        const directions = [
            { x: 1, y: 0 },    // 右
            { x: 1, y: 1 },    // 右下
            { x: 0, y: 1 },    // 下
            { x: -1, y: 1 },   // 左下
            { x: -1, y: 0 }    // 左
        ];
        const currentDirection = directions[clickCount - 1];
        
        // 基础移动距离
        const baseMove = isMobile ? 20 : 40;
        
        // 计算实际移动距离
        let rightOffset = baseMove * currentDirection.x * clickCount;
        let downOffset = baseMove * currentDirection.y * clickCount;
        
        // 缩放效果 - 调整缩放范围
        let scale = isMobile ? 
            Math.max(1 - (clickCount * 0.05), 0.85) : // 移动端最小缩放到0.85
            Math.max(1 - (clickCount * 0.05), 0.8);   // 桌面端最小缩放到0.8
        
        // 确保按钮不会移出容器
        const buttonWidth = noButton.offsetWidth * scale;
        const buttonHeight = noButton.offsetHeight * scale;
        const maxRight = windowWidth - containerRect.left - buttonWidth - 20;
        const maxDown = window.innerHeight - containerRect.top - buttonHeight - 20;
        
        rightOffset = Math.max(-containerRect.left + 20, Math.min(rightOffset, maxRight));
        downOffset = Math.min(downOffset, maxDown);
        
        noButton.style.position = 'relative';
        noButton.style.transform = `translate(${rightOffset}px, ${downOffset}px) scale(${scale})`;
        noButton.style.left = 'auto';
        noButton.style.top = 'auto';
        noButton.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        noButton.innerText = noTexts[clickCount - 1];
    } else {
        // 第5次后的处理
        noButton.innerText = "不行:(";
        const rect = noButton.getBoundingClientRect();
        const safetyPadding = window.innerWidth <= 768 ? 30 : 20;
        
        let newX = Math.min(Math.max(safetyPadding, rect.left), window.innerWidth - rect.width - safetyPadding);
        let newY = Math.min(Math.max(safetyPadding, rect.top), window.innerHeight - rect.height - safetyPadding);
        
        noButton.style.position = 'fixed';
        noButton.style.left = `${newX}px`;
        noButton.style.top = `${newY}px`;
        noButton.style.transform = 'scale(0.8)'; // 最终尺寸调整为0.8
        noButton.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    let maxMoveUp = 100;
    let moveUp = Math.min(clickCount * 25, maxMoveUp);
    mainImage.style.transform = `translateY(-${moveUp}px)`;
    questionText.style.transform = `translateY(-${moveUp}px)`;

    if (clickCount === 1) mainImage.src = "images/shocked.png";
    if (clickCount === 2) mainImage.src = "images/think.png";
    if (clickCount === 3) mainImage.src = "images/angry.png";
    if (clickCount === 4) mainImage.src = "images/crying.png";
    if (clickCount >= 5) mainImage.src = "images/crying.png";
}

const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

function initMusicControl() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle.querySelector('i');
    const musicTip = document.querySelector('.music-tip');

    bgMusic.play().then(() => {
        musicIcon.className = 'fas fa-volume-up'; 
        musicToggle.classList.add('playing');
    }).catch(() => {
        musicIcon.className = 'fas fa-volume-mute'; 
        musicToggle.classList.remove('playing');
        setTimeout(() => {
            musicTip.classList.add('show');
            setTimeout(() => {
                musicTip.classList.add('hide');
                setTimeout(() => {
                    musicTip.classList.remove('show');
                    musicTip.classList.remove('hide');
                }, 500);
            }, 5000);
        }, 1000);
    });
    
    musicToggle.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
            musicIcon.className = 'fas fa-volume-up'; 
            musicToggle.classList.add('playing');
        } else {
            bgMusic.pause();
            musicIcon.className = 'fas fa-volume-mute'; 
            musicToggle.classList.remove('playing');
        }
    });
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
    setInterval(() => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.width = Math.random() * 30 + 20 + 'px';
        bubble.style.height = bubble.style.width;
        bubbles.appendChild(bubble);
        
        setTimeout(() => bubble.remove(), 4000);
    }, 300);
}

function createFloatingHearts() {
    const heart = document.createElement('div');
    heart.className = 'heart-float';
    heart.innerHTML = '❤️';

    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 25 + 15) + 'px'; 

    const duration = Math.random() * 3 + 8;
    heart.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
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
    "从今以后，我们就是一对啦！💑",
    "永远爱你！❤️",
    "以后的日子请多多指教！😊",
    "我会一直陪在你身边！🌹",
    "你是我最特别的人！✨",
    "愿我们的爱情永远甜蜜！🍬",
    "我会努力让你成为最幸福的人！🌈"
];

yesButton.addEventListener("click", function() {
    createFireworks();
    
    document.body.innerHTML = `
        <div class="success-scene">
            <div class="sparkle-container"></div>
            <h1 class="yes-text heart-beat">我最最喜欢你啦！(｡♥‿♥｡)</h1>
            <img src="images/hug.png" alt="拥抱" class="yes-image">
            ${successMessages.map((msg, index) => 
                `<p class="love-message" style="animation-delay: ${index * 0.3}s">
                    ${msg}
                </p>`
            ).join('')}
            <div class="heart-rain"></div>
            <div class="copyright">
                Original by <a href="https://github.com/37tt" target="_blank">37tt</a> | 
                Modified by <a href="https://github.com/Thexiaoyuqaq" target="_blank">Thexiaoyu</a> with ❤️
            </div>
        </div>
    `;

    const sparkleContainer = document.querySelector('.sparkle-container');
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkleContainer.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
    }, 200);

    document.body.style.overflow = "hidden";
});

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

document.addEventListener('DOMContentLoaded', function() {
    createStars();
    createBubbles();
    initMusicControl();
    initialHearts();
});