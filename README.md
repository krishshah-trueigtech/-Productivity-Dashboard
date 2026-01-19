JavaScript Capstone Task – Productivity Dashboard
Objective:
Build a fully functional productivity dashboard using pure JavaScript (ES6+) to revise and
demonstrate mastery of core and advanced JavaScript concepts. HTML should be minimal and
CSS should only be used for basic layout.
1. Task Management System
Create a task manager with Add, Edit, Delete, Filter, and Sort functionality. Each task must include
id, title, description, priority, status, and createdAt fields.
2. Local Storage Persistence
Persist all tasks and timer data in localStorage. On page reload, the application should restore the
previous state.
3. Pomodoro / Countdown Timer
Each task should have an independent timer with start, pause, and reset options. Timer state
should persist across page reloads.
4. Analytics & Statistics Module
Display total tasks, completed tasks, completion percentage, time spent per task, and most
productive day using derived data.
5. Custom Event System
Implement a custom event bus (Pub/Sub pattern) to decouple modules. Example events:
taskAdded, taskCompleted, timerFinished.
6. Asynchronous Fake API
Simulate backend operations using Promises and async/await. Handle loading and error states
gracefully.
7. Error Handling & Validation
Validate inputs, prevent duplicate tasks, handle corrupted localStorage data, and implement
defensive programming techniques.
8. Performance Optimization
Use event delegation, cache DOM selectors, and avoid unnecessary re-renders.
Technical Constraints
• Use only Vanilla JavaScript (ES6+)
• No frameworks or libraries
• Minimal HTML and CSS
• Modular folder structure required
Evaluation Criteria
• JavaScript fundamentals and ES6+ usage
• Code structure and modularity
• Async handling and error management
• State management and persistence
• Performance and code readability