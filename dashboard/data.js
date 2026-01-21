import {getTasks} from "../task_management_system/features.js"

export const displayData = () => {
    const tasks = getTasks();
    const completed = tasks.filter(t => t.status === 'completed');
    const ongoing = tasks.filter(t => t.status === 'ongoing');

    const totalTimeSpent = completed.reduce((sum, task) => sum + (task.timeSpent || 0), 0);

    const avgCompletionTime = completed.length > 0 
        ? (totalTimeSpent / completed.length).toFixed(2) 
        : 0;

    const percentage = tasks.length > 0 ? ((completed.length / tasks.length) * 100).toFixed(0) : 0;

    document.getElementById('dashboard-time-spent').innerHTML = `<p><b>Avg. Completion Time:</b> ${avgCompletionTime} seconds</p>`;
    document.getElementById('dashboard-total-tasks').innerHTML = `<b>Total Tasks: ${tasks.length} </b>`;
    document.getElementById('dashboard-completed-tasks').innerHTML = `<b>Completed Tasks: ${completed.length} </b>`
    document.getElementById('dashboard-ongoing-tasks').innerHTML = `<b> Ongoing Tasks: ${ongoing.length} </b>`
    document.getElementById('dashboard-completion-percentage').innerHTML = `<b>Total Tasks: ${(completed.length/tasks.length)*100}%</b>`
}