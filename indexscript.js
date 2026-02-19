// Параметры для плавного движения шарика
const ballSpeed = 0.05;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// Параметры для 3D-эффекта панели
const tiltSpeed = 0.025;
let panelTargetX = 0;
let panelTargetY = 0;
let panelCurrentX = 0;
let panelCurrentY = 0;
const maxTilt = 25; // Максимальный угол наклона в градусах
const maxMove = 15; // Максимальное смещение в пикселях

// Флаги для управления анимациями
let isInitialAnimationComplete = false;

// Функция для обновления позиции градиента
function updateGradient(x, y) {
    const normalizedX = x / window.innerWidth;
    const normalizedY = y / window.innerHeight;

    const offsetX = normalizedX * 20 - 10; // Смещение от -10 % до +10 %
    const offsetY = normalizedY * 20 - 10;

    const gradientContainer = document.querySelector('.gradient-container');
    if (gradientContainer) {
        gradientContainer.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
    }
}

// Анимация шарика
function animateCursorBall() {
    // Плавно перемещаем шарик к целевой позиции
    currentX += (targetX - currentX) * ballSpeed;
    currentY += (targetY - currentY) * ballSpeed;

    const ball = document.querySelector('.cursor-ball');
    if (ball) {
        ball.style.left = `${currentX}px`;
        ball.style.top = `${currentY}px`;
    }

    requestAnimationFrame(animateCursorBall);
}

// Анимация 3D-панели
function animatePanel() {
    // Плавное перемещение
    panelCurrentX += (panelTargetX - panelCurrentX) * tiltSpeed;
    panelCurrentY += (panelTargetY - panelCurrentY) * tiltSpeed;

    // Расчёт углов наклона — панель поворачивается «к курсору»
    const tiltX = -(panelCurrentY / window.innerHeight) * maxTilt; // Инвертируем для нужного направления
    const tiltY = (panelCurrentX / window.innerWidth) * maxTilt;  // Инвертируем для нужного направления

    // Смещение
    const moveX = (panelCurrentX / window.innerWidth) * maxMove;
    const moveY = (panelCurrentY / window.innerHeight) * maxMove;

    const panel = document.querySelector('.main-panel');
    if (panel) {
        panel.style.transform = `
            translate(${moveX}px, ${moveY}px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale3d(1, 1, 1.3) /* Вытягиваем по оси Z */
        `;
    }

    requestAnimationFrame(animatePanel);
}

// Функция начальной анимации появления
function runInitialAnimation() {
    const panel = document.querySelector('.main-panel');
    if (!panel) {
        console.error('Элемент .main-panel не найден!');
        return;
    }

    // Добавляем класс для анимации появления через небольшой таймаут
    setTimeout(() => {
        panel.classList.add('animate-in');

        // После завершения анимации убираем transition и устанавливаем флаг
        setTimeout(() => {
            panel.style.transition = '';
            isInitialAnimationComplete = true;
        }, 1000);
    }, 300);
}

// Функция для определения мобильного устройства
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Функция для перенаправления
function redirectToAppropriateVersion() {
    if (isMobileDevice()) {
        window.location.href = 'gcalcmobile.html';
    } else {
        window.location.href = 'Gcalc.html';
    }
}

// Обработчик движения курсора
document.addEventListener('mousemove', (e) => {
    updateGradient(e.clientX, e.clientY);

    // Обновляем целевую позицию шарика
    targetX = e.clientX;
    targetY = e.clientY;

    // Обновляем целевую позицию панели для 3D-эффекта (только после начальной анимации)
    if (isInitialAnimationComplete) {
        panelTargetX = e.clientX - window.innerWidth / 2;
        panelTargetY = e.clientY - window.innerHeight / 2;
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, начинаем инициализацию...');

    // Устанавливаем начальное положение градиента в центре
    updateGradient(window.innerWidth / 2, window.innerHeight / 2);

    // Инициализируем начальную и целевую позиции шарика в центре экрана
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    currentX = window.innerWidth / 2;
    currentY = window.innerHeight / 2;

    // Инициализируем позиции панели
    panelTargetX = 0;
    panelTargetY = 0;
    panelCurrentX = 0;
    panelCurrentY = 0;

    // Запускаем начальную анимацию появления
    runInitialAnimation();

    // Запускаем анимации шарика и панели
    animateCursorBall();
    animatePanel();

    // Добавляем обработчик клика на кнопку
    const button = document.getElementById('redirectButton');
    if (button) {
        button.addEventListener('click', redirectToAppropriateVersion);
    } else {
        console.error('Кнопка с ID "redirectButton" не найдена!');
    }
});
