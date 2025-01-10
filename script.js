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

let currentFocus = '';

function setProgress(percent) {
    const offset = CIRCUMFERENCE - (percent / 100 * CIRCUMFERENCE);
    circle.style.strokeDashoffset = offset;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update display and page title
    document.getElementById('time').textContent = timeString;
    document.title = `${timeString} - ${isBreakMode ? 'Break' : 'Focus'} Time`;
    
    // Update progress ring
    const totalTime = isBreakMode ? BREAK_TIME : FOCUS_TIME;
    const progress = (timeLeft / totalTime) * 100;
    setProgress(progress);
}

function startTimer() {
    if (timerId === null) {
        if (!isBreakMode) {
            // Show modal for focus time
            const modal = document.getElementById('focusModal');
            const input = document.getElementById('focusInput');
            const confirmBtn = document.getElementById('confirmFocus');
            const cancelBtn = document.getElementById('cancelFocus');
            
            function handleFocusStart() {
                const focusTask = input.value.trim();
                if (focusTask) {
                    currentFocus = focusTask;
                    const focusDisplay = document.getElementById('focusDisplay');
                    focusDisplay.textContent = currentFocus;
                    focusDisplay.style.display = 'block';
                    
                    modal.classList.remove('show');
                    input.value = '';
                    startTimerInterval();
                }
            }

            function handleCancel() {
                modal.classList.remove('show');
                input.value = '';
            }

            function handleKeydown(e) {
                if (e.key === 'Enter') {
                    handleFocusStart();
                } else if (e.key === 'Escape') {
                    handleCancel();
                }
            }

            // Set up event listeners
            confirmBtn.onclick = handleFocusStart;
            cancelBtn.onclick = handleCancel;
            input.onkeydown = handleKeydown;
            
            // Show modal and focus input
            modal.classList.add('show');
            input.focus();
        } else {
            // Start break timer immediately
            startTimerInterval();
        }
    } else {
        pauseTimer();
    }
}

// Helper function to start the timer interval
function startTimerInterval() {
    const startBtn = document.getElementById('startBtn');
    startBtn.textContent = 'Pause';
    startBtn.style.background = 'var(--secondary)';
    
    timerId = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerId);
            timerId = null;
            startBtn.textContent = 'Start';
            startBtn.style.background = 'var(--primary)';
        }
    }, 1000);
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
    const focusDisplay = document.getElementById('focusDisplay');
    
    toggleBtn.textContent = isBreakMode ? '☕' : '💻';
    modeLabel.textContent = isBreakMode ? 'Break Time' : 'Focus Time';
    
    focusDisplay.style.display = isBreakMode ? 'none' : (currentFocus ? 'block' : 'none');
    
    toggleBtn.classList.toggle('break');
    document.querySelector('.progress-ring').classList.toggle('break');
    resetTimer();
}

// Move initialization code inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Add focus display element
    const container = document.querySelector('.container');
    const focusDisplay = document.createElement('div');
    focusDisplay.id = 'focusDisplay';
    focusDisplay.style.display = 'none';
    container.insertBefore(focusDisplay, container.querySelector('.mode-label'));
    
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