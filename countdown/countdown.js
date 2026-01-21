import {getTasks, saveTasks, updateOrAddCard} from '../task_management_system/features.js'

const activeIntervals = {};

export const resetTimer = (id) => {
    if(activeIntervals[id]){
        clearInterval(activeIntervals[id]);
        delete activeIntervals[id];
    }
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);

    if (task) {
        task.isRunning = false;
        task.remainingSeconds = task.duration || 1500; 
        saveTasks(tasks);
        updateOrAddCard(task);
    }
};

export const toggleTimer = (id) => {
    try{
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) return;
        const task = tasks[taskIndex];

        if(activeIntervals[id]){
            clearInterval(activeIntervals[id]);
            delete activeIntervals[id];
            task.isRunning = false;
            saveTasks(tasks);
            updateOrAddCard(task);
            return
        }
        task.isRunning = true;
        saveTasks(tasks);
        updateOrAddCard(task);

        activeIntervals[id] = setInterval(()=>{
            const currentTasks = getTasks();
            const currentTask = currentTasks.find(t => t.id === id);

            if (!currentTask || currentTask.remainingSeconds <= 0) {
                resetTimer(id);
                if (currentTask?.remainingSeconds <= 0) {
                    alert(`Time is up for: ${currentTask.title}`);
                }
                return;
            }
            currentTask.remainingSeconds -= 1;
            currentTask.timeSpent = (currentTask.timeSpent || 0) + 1;
            saveTasks(currentTasks);
            const timerDisplay = document.getElementById(`timer-display-${id}`);
            if (timerDisplay) {
                timerDisplay.innerText = formatTime(currentTask.remainingSeconds);
            }
        },1000)
    }
    catch(error){
        throw error;
    }
}

export const updateRunningState = (id, isRunning) => {
    let tasks = getTasks();
    let task = tasks.find(t => t.id === id);
    if(task){
        task.isRunning = isRunning;
        saveTasks(tasks);
    }
}
export const stopTimer = (id) => {
    clearInterval(activeIntervals[id]);
    delete activeIntervals[id];
    
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.isRunning = false;
        saveTasks(tasks);
        updateOrAddCard(task);  
    }
};

export const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}