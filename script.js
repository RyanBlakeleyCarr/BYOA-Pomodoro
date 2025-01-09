let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isBreakMode = false;
const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const RADIUS = 180;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const circle = document.querySelector('.progress-ring__circle');
circle.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
circle.style.strokeDashoffset = 0;

function setProgress(percent) {
    const offset = CIRCUMFERENCE - (percent / 100 * CIRCUMFERENCE);
    circle.style.strokeDashoffset = offset;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress ring
    const totalTime = isBreakMode ? BREAK_TIME : FOCUS_TIME;
    const progress = (timeLeft / totalTime) * 100;
    setProgress(progress);
}

function startTimer() {
    const startBtn = document.getElementById('startBtn');
    
    if (timerId === null) {
        startBtn.textContent = 'Pause';
        startBtn.style.background = 'var(--secondary)';  // Use blue color when paused
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                resetTimer();
            }
        }, 1000);
    } else {
        pauseTimer();
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    const startBtn = document.getElementById('startBtn');
    startBtn.textContent = 'Start';
    startBtn.style.background = 'var(--primary)';  // Reset to primary color
}

function resetTimer() {
    pauseTimer();
    timeLeft = isBreakMode ? BREAK_TIME : FOCUS_TIME;
    updateDisplay();
}

function toggleMode() {
    isBreakMode = !isBreakMode;
    const toggleBtn = document.getElementById('modeToggle');
    const modeLabel = document.getElementById('modeLabel');
    
    toggleBtn.textContent = isBreakMode ? '☕' : '💻';
    modeLabel.textContent = isBreakMode ? 'Break Time' : 'Focus Time';
    
    toggleBtn.classList.toggle('break');
    document.querySelector('.progress-ring').classList.toggle('break');
    resetTimer();
}

// Move initialization code inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial emoji and label
    const toggleBtn = document.getElementById('modeToggle');
    const modeLabel = document.getElementById('modeLabel');
    toggleBtn.textContent = '💻';
    modeLabel.textContent = 'Focus Time';
    
    // Initialize display
    updateDisplay();
    
    // Add event listeners
    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    document.getElementById('modeToggle').addEventListener('click', toggleMode);
}); 