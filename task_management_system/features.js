import Task from "./model.js";
import {toggleTimer, formatTime} from "../countdown/countdown.js";
import {displayData} from "../dashboard/data.js"

export const getTasks = () => {
    const data = localStorage.getItem("taskList");

    if(!data || data === "undefined"){
        return [];
    }
    try{
        return JSON.parse(data);  
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
    let taskList = [...getTasks(),new Task(data)];
    saveTasks(taskList);
    renderTasks();
    }catch(error){
        alert("Couldn't add Task")
        throw error;
    }
    
};

export const deleteTask = (id) => {
    try{
    saveTasks(getTasks().filter(task =>task.id !== id));
    renderTasks();
    }
    catch(error){
        throw error;
    }

};

export const editTask = (id) => {
    try{
    let currentTask = document.getElementById(id);
    let taskList = getTasks();
    const task = taskList.find(t => t.id === id);
    if(!task) return
    currentTask.innerHTML = `
    <form  id = "taskForm"  class="flex flex-col gap-2 border border-black rounded max-w-sm p-2" 
            autocomplete = "on" method="post">
                <div>
                    <label for = "title">Enter title: </label>
                    <input type = "text" id="title${id}" class="max-w-fit" name = "title" placeholder="Enter title" value="${task.title}">
                </div>
                <div>
                    <label for = "description">Enter description: </label>
                    <textarea type = "text" id="description${id}" class="max-w-fit" name = "description" placeholder="Enter description">${task.description}</textarea>
                </div>
                <div>
                    <p>Choose your task priority:</p>
                    <input type = "radio" id="highPriority${id}" name = "priority" value="high" ${task.priority === "high" ? "checked" : ""}>
                    <label for = "highPriority${id}">High</label>
                
                    <input type = "radio" id="mediumPriority${id}" name = "priority" value="medium" ${task.priority === "medium" ? "checked" : ""}>
                    <label for = "mediumPriority${id}">medium</label>
                
                    <input type = "radio" id="lowPriority${id}" name = "priority" value="low" ${task.priority === "low" ? "checked" : ""}>
                    <label for = "lowPriority${id}">low</label>
                </div>
                <button type="submit" value="Submit" class="bg-green-400 p-1 m-2 border border-black rounded">Update Task</button>
            </form>`
            const form = currentTask.querySelector("form");

            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const title = document.getElementById(`title${id}`).value;
                const description = document.getElementById(`description${id}`).value;
                const priority = form.querySelector('input[name="priority"]:checked')?.value;
                
                taskList = taskList.map(task =>
                    task.id === id
                        ? { ...task, title, description, priority }
                        : task
                );

                localStorage.setItem("taskList", JSON.stringify(taskList));
                renderTasks();
            });
        }
        catch (error) {
            throw error;
        }
};

export function toggleStatus(id){
    try{
    const taskList = getTasks().map((task)=>{
        if(task.id != id) return task;

        const newStatus = 
        task.status === "pending" ? "ongoing":
        task.status === "ongoing" ? "completed":
        "pending";

        return {...task,status: newStatus};
    })
    saveTasks(taskList);
    renderTasks();
    } catch (error) {
        throw error;
    }
};

export const createTaskCard = ({id,title,description,priority, status, remainingSeconds, isRunning}) => {
    try{
    const card = document.createElement("div");
    card.id = id;
    card.className = "max-w-sm max-h-sm rounded overflow-hidden shadow-lg";
    card.innerHTML = `
    <div class="">
    <h1 class="font-bold text-xl "> ${title}</h1>
    <p><b>Description: </b> ${description}</p>
    <p><b>Priority: </b>${priority}</p>
    <p><b>Status: </b>${status}</p>
    </div>
    <div class="timer-section">
    <div id="timer-display-${id}" class="text-2xl font-bold">
        ${formatTime(remainingSeconds || 1500)}
    </div>
</div>

    `
    ;
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.onclick = ()=> editTask(id);
        editBtn.className ="p-1 m-2 border border-black rounded"

        const statBtn = document.createElement("button");
        statBtn.innerText = `${status}`;
        statBtn.onclick = ()=> toggleStatus(id);
        statBtn.className ="bg-gray-400 p-1 m-2 border border-black rounded"

        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.onclick = () => deleteTask(id);
        delBtn.className = "bg-red-400 p-1 m-2 border border-black rounded"

        const timerBtn = document.createElement("button");
        timerBtn.innerText = isRunning ? "Pause" : "Start";
        timerBtn.className = "bg-blue-500 text-white p-1 rounded";

        timerBtn.addEventListener("click", () => toggleTimer(id)); 

        card.appendChild(timerBtn);
        card.appendChild(editBtn);
        card.appendChild(statBtn);
        card.appendChild(delBtn);
        
    return card
    }
    catch(error){
        throw error;
    }
};

export const renderTasks = () => {
    try{
    const container = document.getElementById("list");
    
    if (!container) return;

    container.innerHTML = "";
    container.className = "m-3 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full ";

    const fragement = document.createDocumentFragment();
    getTasks().forEach((task)=> fragement.append(createTaskCard(task)));
    container.appendChild(fragement);
    displayData();
    }
    catch (error) {
        throw error
    }
}

export const initTasks = () =>{
    try{
    document.getElementById("taskForm").addEventListener('submit', addTask);
    renderTasks();
    } catch(error) {
        throw error
    }
}

