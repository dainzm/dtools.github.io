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

// Функция для обновления позиции градиента
function updateGradient(x, y) {
    // Нормализуем координаты курсора относительно размеров окна
    const normalizedX = x / window.innerWidth;
    const normalizedY = y / window.innerHeight;

    // Рассчитываем смещение для градиента
    const offsetX = normalizedX * 20 - 10; // Смещение от -10 % до +10 %
    const offsetY = normalizedY * 20 - 10;

    const gradientContainer = document.querySelector('.gradient-container');
    gradientContainer.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
}

// Анимация шарика
function animateCursorBall() {
    // Плавно перемещаем шарик к целевой позиции
    currentX += (targetX - currentX) * ballSpeed;
    currentY += (targetY - currentY) * ballSpeed;

    const ball = document.querySelector('.cursor-ball');
    ball.style.left = `${currentX}px`;
    ball.style.top = `${currentY}px`;

    requestAnimationFrame(animateCursorBall);
}

// Анимация 3D-панели (для интерактивного эффекта при движении курсора)
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

    const container = document.querySelector('.container');
    container.style.transform = `
        translate(${moveX}px, ${moveY}px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        scale3d(1, 1, 1.3) /* Вытягиваем по оси Z */
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
    // Добавляем задержку перед анимацией появления панели (только прозрачность)
    setTimeout(() => {
        const container = document.querySelector('.container');
        container.classList.add('animated');
    }, 100); // Небольшая задержка перед началом анимации

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

// Храним предыдущие значения полей
let previousPriceValue = '';
let previousResultValue = '';

// Функция для запрета ввода знака минуса с восстановлением предыдущего значения
function preventNegativeSignWithRollback(inputElement, previousValueRef) {
    // Сохраняем предыдущее значение при фокусе
    inputElement.addEventListener('focus', () => {
        previousValueRef.current = inputElement.value;
    });

    // Проверяем при каждом вводе
    inputElement.addEventListener('input', () => {
        // Если в значении есть минус — восстанавливаем предыдущее значение
        if (inputElement.value.includes('-')) {
            inputElement.value = previousValueRef.current;
            // Дополнительно сбрасываем выделение, чтобы пользователь видел результат
            inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
        } else {
            // Если минуса нет — обновляем предыдущее значение
            previousValueRef.current = inputElement.value;
        }
    });

    // Проверяем при потере фокуса
    inputElement.addEventListener('blur', () => {
        if (inputElement.value.includes('-')) {
            inputElement.value = previousValueRef.current;
        }
    });
}

// Создаём объекты для хранения предыдущих значений
const priceState = { current: '' };
const resultState = { current: '' };

// Применяем запрет минуса к обоим полям с восстановлением
preventNegativeSignWithRollback(priceInput, priceState);
preventNegativeSignWithRollback(resultInput, resultState);

// Функция для расчёта из «Цена» в «Получите»
function calculateFromPrice() {
    const price = parseFloat(priceInput.value);
    if (!isNaN(price)) {
        // Вычитаем 20 % (price * 0.80)
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
        // Прибавляем 25 % для обратного расчёта
        const price = result * 1.25;
        priceInput.value = price.toFixed(2);
    } else {
        priceInput.value = '';
    }
}

// Добавляем обработчики событий на изменение полей
priceInput.addEventListener('input', calculateFromPrice);
resultInput.addEventListener('input', calculateFromResult);
