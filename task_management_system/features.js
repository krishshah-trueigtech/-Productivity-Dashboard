import Task from "./model.js";
import {toggleTimer, formatTime, resetTimer} from "../countdown/countdown.js";
import {displayData} from "../dashboard/data.js"
import {validateForm} from "../validation/formValidation.js"

export const getTasks = () => {
    const data = localStorage.getItem("taskList");

    if(!data || data === "undefined"){
        return [];
    }
    try{
        const parsedData = JSON.parse(data);
        return Array.isArray(parsedData) ? parsedData : [];
    }
    catch(error){
        console.error("Failed to parse tasks:", error);
        return [];
    }
}

export const saveTasks = (tasks) => {
    try{
    localStorage.setItem("taskList", JSON.stringify(tasks));
    } catch (error) {
        throw error;
    }
}
export const addTask = (event) => {
    try{
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    if(!validateForm(data)) return;
    const newTask = new Task(data);
    let taskList = [...getTasks(),newTask];
    saveTasks(taskList);
    updateOrAddCard(newTask);
    event.target.reset();
    }catch(error){
        alert("Couldn't add Task")
        throw error;
    }
};

export const deleteTask = (id) => {
    try{
    saveTasks(getTasks().filter(task =>task.id !== id));
    removeCard(id);
    }
    catch(error){
        throw error;
    }

};

export const editTask = (id) => {
    try {
        let currentTask = document.getElementById(id);
        let taskList = getTasks();
        const task = taskList.find(t => t.id === id);
        if (!task) return;

        currentTask.innerHTML = `
        <form id="editForm-${id}" class="flex flex-col gap-2 border border-black rounded max-w-sm p-2" autocomplete="on">
            <div>
                <label for="title${id}">Enter title: </label>
                <input type="text" id="title${id}" class="max-w-fit" name="title" value="${task.title}">
            </div>
            <div>
                <label for="description${id}">Enter description: </label>
                <textarea id="description${id}" class="max-w-fit" name="description">${task.description}</textarea>
            </div>
            <div>
                <p>Choose your task priority:</p>
                <input type="radio" id="highPriority${id}" name="priority" value="high" ${task.priority === "high" ? "checked" : ""}>
                <label for="highPriority${id}">High</label>
                <input type="radio" id="mediumPriority${id}" name="priority" value="medium" ${task.priority === "medium" ? "checked" : ""}>
                <label for="mediumPriority${id}">Medium</label>
                <input type="radio" id="lowPriority${id}" name="priority" value="low" ${task.priority === "low" ? "checked" : ""}>
                <label for="lowPriority${id}">Low</label>
            </div>
            <button type="submit" class="bg-green-400 p-1 m-2 border border-black rounded">Update Task</button>
        </form>`;

        const form = currentTask.querySelector("form");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const title = document.getElementById(`title${id}`).value;
            const description = document.getElementById(`description${id}`).value;
            const priority = form.querySelector('input[name="priority"]:checked')?.value;
            
            let updatedTask; 
            const updatedList = getTasks().map(t => {
                if (t.id === id) {
                    updatedTask = { ...t, title, description, priority };
                    return updatedTask;
                }
                return t;
            });

            saveTasks(updatedList);
            if (updatedTask) {
                updateOrAddCard(updatedTask);
            }
        });
    } catch (error) {
        console.error("Edit failed:", error);
    }
};

export function toggleStatus(id){
    try{
    let updatedTask;
    const taskList = getTasks().map((task)=>{
        if(task.id != id) return task;

        let newStatus;
        let completedAt = task.completedAt;
        if(task.status === "pending"){
            newStatus = "ongoing";
        }else if (task.status === "ongoing"){
            newStatus = "completed";
            completedAt = new Date().toISOString();
        } else{
            newStatus = "pending";
            completedAt = null;
        }

        updatedTask = { ...task, status: newStatus };
        return updatedTask;
    })
    saveTasks(taskList);
    if (updatedTask) {
        updateOrAddCard(updatedTask);
    }
    } catch (error) {
        throw error;
    }
};

export const createTaskCard = ({id,title,description,priority, status, remainingSeconds, isRunning}) => {
    return `
    <div class="p-3 max-w-md flex flex-col">
        <h1 class="font-bold text-xl "> ${title}</h1>
        <p><b>Description: </b> ${description}</p>
        <p><b>Priority: </b>${priority}</p>
        <p><b>Status: </b>${status}</p>
    </div>
    <div class="timer-section flex items-center justify-center gap-4 py-2 bg-gray-50">
        <button class="adjust-time-btn bg-gray-200 hover:bg-gray-300 px-2 rounded font-bold" data-id="${id}" data-delta="-300">-5m</button>
        <div id="timer-display-${id}" class="text-2xl font-bold">
                      ${formatTime(remainingSeconds || 1500)}
        </div>
        <button class="adjust-time-btn bg-gray-200 hover:bg-gray-300 px-2 rounded font-bold" data-id="${id}" data-delta="300">+5m</button>
    </div>
    <div class="flex flex-col gap-2 p-2">
        <div class ="flex flex-row gap-2 justify-center">
            <button class="timer-btn bg-blue-500 text-white p-1 rounded ">${isRunning ? "Pause" : "Start"}</button>
            <button class="reset-btn bg-gray-500 text-white p-1 rounded">Reset</button>
        </div>
    </div>
    <div class = "flex flex-row gap-2 justify-center">
        <button class="edit-btn p-1 border border-black rounded">Edit</button>
        <button class="status-btn bg-gray-400 p-1 border border-black rounded">${status}</button>
        <button class="delete-btn bg-red-400 p-1 border border-black rounded">Delete</button>
        </div>
    </div>
    `;
};

export const renderTasks = () => {
    try{
    const container = document.getElementById("list");
    if (!container) return;

    container.innerHTML = "";
    const tasks = processedTasks();
    
    tasks.forEach(task => {
        const card = document.createElement('div');
        card.id = task.id;
        card.className = "max-w-sm rounded overflow-hidden shadow-lg border";
        card.innerHTML = createTaskCard(task);
        container.appendChild(card);
    });
    displayData();
    }
    catch (error) {
        throw error
    }
}

export const initTasks = () =>{
    try{
    const form = document.getElementById("taskForm");
    const container = document.getElementById("list");

    form.addEventListener('submit', addTask);
    container.addEventListener('click', (e) =>{
        const card = e.target.closest('[id]');
        if(!card) return
        const id = Number(card.id);

        if (e.target.classList.contains('delete-btn')) deleteTask(id);
        if (e.target.classList.contains('reset-btn')) resetTimer(id);
        if (e.target.classList.contains('status-btn')) toggleStatus(id);
        if (e.target.classList.contains('edit-btn')) editTask(id);
        if (e.target.classList.contains('timer-btn')) toggleTimer(id);
        if (e.target.classList.contains('adjust-time-btn')) {
            const delta = parseInt(e.target.dataset.delta);
            adjustTaskTime(id, delta);
        }
        });
        const filterControls = ['searchInput', 'statusFilter', 'priorityFilter', 'sortCriteria'];
        filterControls.forEach(id => {
            document.getElementById(id).addEventListener('input', renderTasks);

    });
    renderTasks();
    } catch(error) {
        throw error
    }
}

export const updateOrAddCard = (task) => {
    const container = document.getElementById('list');
    let card = document.getElementById(task.id);
    if(card) {
        card.innerHTML = createTaskCard(task);
    }
    else{
        card = document.createElement('div');
        card.id = task.id;
        card.className = "max-w-fit rounded overflow-hidden shadow-lg border p-2";
        card.innerHTML = createTaskCard(task);
        container.appendChild(card);
    }
    displayData();
}
const removeCard = (id) => {
    const card = document.getElementById(id);
    if(card) card.remove();
    displayData()
}

export const adjustTaskTime = (id, delta) => {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.remainingSeconds = Math.max(0, (task.remainingSeconds || 1500) + delta);
        saveTasks(tasks);
        updateOrAddCard(task);
    }
};

const processedTasks = () => {
    try{
        
    let tasks = getTasks();

    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const sortCriteria = document.getElementById('sortCriteria').value;
    
    if(searchValue){
        tasks = tasks.filter(t => t.title.toLowerCase().includes(searchValue) || t.description.toLowerCase().includes(searchValue));
    }

    tasks = tasks.filter(t => {
        const matchedStatus = statusFilter === "all" || t.status === statusFilter;
        const matchedPriority = priorityFilter === "all" || t.status === priorityFilter;
        return matchedStatus && matchedPriority;
    })

    tasks.sort((a,b) => {
        if(sortCriteria === "priority"){
            const weights = { high: 3, medium: 2, low: 1 };
            return weights[b.priority] - weights[a.priority];
        }

        if(sortCriteria === "title"){
            return a.title.localeCompare(b.title);
        }

        return new Date(b.createdAt) - new Date(a.createdAt);  
    })
    return tasks;

    }catch (error) {
        throw error;
    }
};
