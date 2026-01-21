export default class Task {
    constructor({title, description, priority}){
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = "pending";
        this.createdAt = Date(); 

        this.duration = 1500;
        this.remainingSeconds = 1500;
        this.isRunning = false;
 
        this.timeSpent = 0;
        this.completedAt = null;
    }
};

