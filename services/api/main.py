from fastapi import FastAPI, HTTPException
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
app = FastAPI()
@app.get("/health")
def health(): return {"ok": True}


# --- In-Memory "Database" ---

fake_tasks_db = []
task_id_counter = 0

# --- Pydantic Models ---

class TaskStatus(str, Enum):
    todo = "todo"
    doing = "doing"
    done = "done"

class Task(BaseModel):
    id: int
    project_id: int
    title: str
    status: TaskStatus = TaskStatus.todo

class CreateTaskRequest(BaseModel):
    project_id: int
    title: str

class UpdateTaskRequest(BaseModel):
    title: Optional[str] = None
    status: Optional[TaskStatus] = None


# --- API Endpoints ---

@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task_request: CreateTaskRequest):
    global task_id_counter
    task_id_counter += 1
    new_task = Task(
        id=task_id_counter,
        project_id=task_request.project_id,
        title=task_request.title,
        status=TaskStatus.todo
    )
    fake_tasks_db.append(new_task)
    return new_task

@app.get("/tasks", response_model=List[Task])
def get_tasks(project_id: Optional[int] = None):
    if project_id is not None:
        return [task for task in fake_tasks_db if task.project_id == project_id]
    return fake_tasks_db

@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: UpdateTaskRequest):
    for task in fake_tasks_db:
        if task.id == task_id:
            if task_update.title is not None:
                task.title = task_update.title
            if task_update.status is not None:
                task.status = task_update.status
            return task
    raise HTTPException(status_code=404, detail="Task not found")
