import Task from "./task_management_system/model.js";
import {initTasks} from  "./task_management_system/features.js";
import {toggleTimer, updateRunningState, stopTimer, formatTime} from "./countdown/countdown.js";


try{
    document.addEventListener('DOMContentLoaded', () => {
        initTasks();
    })
}catch(error){
    console.error(error);
}