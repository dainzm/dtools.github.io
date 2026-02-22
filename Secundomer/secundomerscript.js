function updateGradient(x, y) {
    const normalizedX = x / window.innerWidth;
    const normalizedY = y / window.innerHeight;
    const offsetX = normalizedX * 20 - 10;
    const offsetY = normalizedY * 20 - 10;
    const gradientContainer = document.querySelector('.gradient-container');
    gradientContainer.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const container = document.querySelector('.container');
        container.classList.add('animated');
    }, 100);

    updateGradient(window.innerWidth / 2, window.innerHeight / 2);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    let panelTargetX = 0;
    let panelTargetY = 0;
    let panelCurrentX = 0;
    let panelCurrentY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function animate() {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        updateGradient(currentX, currentY);
        requestAnimationFrame(animate);
    }
    animate();
});

// Секундомер
const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const lapsList = document.getElementById('laps');

let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCounter = 1;

function formatTime(ms) {
    let totalMs = Math.floor(ms % 1000);
    let totalSeconds = Math.floor(ms / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(totalMs).padStart(3, '0')}`;
}

function updateDisplay() {
    const currentTime = isRunning ? Date.now() - startTime + elapsedTime : elapsedTime;
    display.textContent = formatTime(currentTime);
}

startStopBtn.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timerInterval);
        elapsedTime += Date.now() - startTime;
        startStopBtn.textContent = 'Старт';
    } else {
        startTime = Date.now();
        timerInterval = setInterval(updateDisplay, 10);
        startStopBtn.textContent = 'Пауза';
    }
    isRunning = !isRunning;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    elapsedTime = 0;
    isRunning = false;
    startStopBtn.textContent = 'Старт';
    display.textContent = '00:00.000';
    lapsList.innerHTML = '';
    lapCounter = 1;
});

// Кнопка для добавления кругов
startStopBtn.addEventListener('dblclick', () => {
    if (isRunning) {
        const lapTime = Date.now() - startTime + elapsedTime;
        const lapItem = document.createElement('li');
        lapItem.innerHTML = `<span>Круг ${lapCounter}</span><span>${formatTime(lapTime)}</span>`;
        lapsList.prepend(lapItem);
        lapCounter++;
    }
});