from fastapi.testclient import TestClient
from main import app, fake_tasks_db, task_id_counter

client = TestClient(app)

def setup_function():
    """Clear the fake DB before each test."""
    global task_id_counter
    fake_tasks_db.clear()
    task_id_counter = 0

def test_create_task():
    response = client.post("/tasks", json={"project_id": 1, "title": "Test Task"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["project_id"] == 1
    assert data["id"] == 1
    assert data["status"] == "todo"
    assert len(fake_tasks_db) == 1

def test_get_tasks_by_project():
    client.post("/tasks", json={"project_id": 1, "title": "Task 1 for Project 1"})
    client.post("/tasks", json={"project_id": 1, "title": "Task 2 for Project 1"})
    client.post("/tasks", json={"project_id": 2, "title": "Task 1 for Project 2"})

    response = client.get("/tasks?project_id=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Task 1 for Project 1"
    assert data[1]["title"] == "Task 2 for Project 1"

def test_get_all_tasks():
    client.post("/tasks", json={"project_id": 1, "title": "Task 1"})
    client.post("/tasks", json={"project_id": 2, "title": "Task 2"})

    response = client.get("/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 2

def test_update_task_status():
    # First, create a task
    response = client.post("/tasks", json={"project_id": 1, "title": "Original Title"})
    task_id = response.json()["id"]

    # Now, update it
    update_response = client.patch(f"/tasks/{task_id}", json={"status": "doing"})
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["status"] == "doing"
    assert data["title"] == "Original Title" # Title should be unchanged

def test_update_task_title():
    response = client.post("/tasks", json={"project_id": 1, "title": "Original Title"})
    task_id = response.json()["id"]

    update_response = client.patch(f"/tasks/{task_id}", json={"title": "Updated Title"})
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["title"] == "Updated Title"
    assert data["status"] == "todo" # Status should be unchanged

def test_update_nonexistent_task():
    response = client.patch("/tasks/999", json={"title": "Doesn't Matter"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}
