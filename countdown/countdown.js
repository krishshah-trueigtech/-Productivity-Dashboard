import {getTasks, saveTasks, renderTasks} from '../task_management_system/features.js'

const activeIntervals = {};

export const toggleTimer = (id) => {
    try{
    if(activeIntervals[id]){
        clearInterval(activeIntervals[id]);
        delete activeIntervals[id];
        updateRunningState(id, false);
        renderTasks();
        return
    }
    updateRunningState(id, true);
    activeIntervals[id] = setInterval(()=>{
        const tasks = getTasks();
        const task = tasks.findIndex(t => t.id === id);

        if(task === -1 || tasks[task].remainingSeconds <= 0){
            stopTimer(id);

            if(tasks[task]?.remainingSeconds <= 0){
                alert(`Time is up : ${tasks[task].remainingSeconds}`)
            }
            return;
        }
        tasks[task].remainingSeconds -= 1;
        saveTasks(tasks);
        const timerDisplay = document.getElementById(`timer-display-${id}`);
        if(timerDisplay){
            timerDisplay.innerHTML = formatTime(tasks[task].remainingSeconds);
        }
        renderTasks();
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
    updateRunningState(id, false);
    renderTasks();
}
export const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}