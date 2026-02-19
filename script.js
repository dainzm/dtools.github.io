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
const maxTilt = 20; // Увеличенный угол наклона для более заметного эффекта
const maxMove = 15; // Увеличенное смещение

// Функция для обновления позиции градиента
function updateGradient(x, y) {
    const normalizedX = x / window.innerWidth;
    const normalizedY = y / window.innerHeight;
    
    const offsetX = normalizedX * 20 - 10;
    const offsetY = normalizedY * 20 - 10;
    
    const gradientContainer = document.querySelector('.gradient-container');
    gradientContainer.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
}

// Анимация шарика
function animateCursorBall() {
    currentX += (targetX - currentX) * ballSpeed;
    currentY += (targetY - currentY) * ballSpeed;
    
    const ball = document.querySelector('.cursor-ball');
    ball.style.left = `${currentX}px`;
    ball.style.top = `${currentY}px`;
    
    requestAnimationFrame(animateCursorBall);
}

// Анимация 3D-панели
function animatePanel() {
    // Плавное перемещение
    panelCurrentX += (panelTargetX - panelCurrentX) * tiltSpeed;
    panelCurrentY += (panelTargetY - panelCurrentY) * tiltSpeed;
    
    // Расчёт углов наклона — теперь панель поворачивается «к курсору»
    const tiltX = -(panelCurrentY / window.innerHeight) * maxTilt; // Инвертируем для нужного направления
    const tiltY = (panelCurrentX / window.innerWidth) * maxTilt;  // Инвертируем для нужного направления
    
    // Смещение
    const moveX = (panelCurrentX / window.innerWidth) * maxMove;
    const moveY = (panelCurrentY / window.innerHeight) * maxMove;
    
    const container = document.querySelector('.container');
    container.style.transform = `
        translate(${moveX}px, ${moveY}px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        scale3d(1, 1, 3) /* Вытягиваем по оси Z */
    `;
    
    requestAnimationFrame(animatePanel);
}

// Обработчик движения курсора
document.addEventListener('mousemove', (e) => {
    updateGradient(e.clientX, e.clientY);
    
    // Обновляем целевую позицию шарика
    targetX = e.clientX;
    targetY = e.clientY;
    
    // Обновляем целевую позицию панели для 3D-эффекта
    panelTargetX = e.clientX - window.innerWidth / 2;
    panelTargetY = e.clientY - window.innerHeight / 2;
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Запускаем анимации
    animateCursorBall();
    animatePanel();
});

// --- Логика калькулятора ---
const priceInput = document.getElementById('price');
const resultInput = document.getElementById('result');

// Функция для расчёта из «Цена» в «Получите»
function calculateFromPrice() {
    const price = parseFloat(priceInput.value);
    if (!isNaN(price)) {
        // Вычитаем 25 %
        const result = price * 0.80;
        resultInput.value = result.toFixed(2);
    } else {
        resultInput.value = '';
    }
}

// Функция для расчёта из «Получите» в «Цена»
function calculateFromResult() {
    const result = parseFloat(resultInput.value);
    if (!isNaN(result)) {
        // Прибавляем 25 %
        const price = result * 1.25;
        priceInput.value = price.toFixed(2);
    } else {
        priceInput.value = '';
    }
}

// Добавляем обработчики событий на изменение полей
priceInput.addEventListener('input', calculateFromPrice);
resultInput.addEventListener('input', calculateFromResult);



