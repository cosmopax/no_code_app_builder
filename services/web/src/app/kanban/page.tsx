"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Define the Task type to match the backend model
interface Task {
  id: number;
  project_id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

const statusCycle: Record<Task['status'], Task['status']> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
};

const KanbanBoard = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = () => {
    if (projectId) {
      fetch(`http://localhost:8001/tasks?project_id=${projectId}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch tasks');
          return response.json();
        })
        .then((data: Task[]) => setTasks(data))
        .catch(err => {
          setError(err.message);
          console.error(err);
        });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleTaskClick = (task: Task) => {
    const nextStatus = statusCycle[task.status];

    fetch(`http://localhost:8001/tasks/${task.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: nextStatus }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to update task');
      return response.json();
    })
    .then(updatedTask => {
      // Update the task in the local state
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
      );
    })
    .catch(err => {
        // For simplicity, just log the error and refetch to sync state
        console.error("Failed to update task, refetching...", err);
        fetchTasks();
    });
  };

  const renderTasks = (status: Task['status']) => {
    return tasks
      .filter(task => task.status === status)
      .map(task => (
        <div
          key={task.id}
          onClick={() => handleTaskClick(task)}
          className="bg-white p-3 mb-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all hover:shadow-md"
        >
          <p className="font-medium">{task.title}</p>
        </div>
      ));
  };

  if (!projectId) {
    return (
      <div className="text-center">
        <p>Please provide a `project_id` in the URL.</p>
        <p className="text-sm text-gray-500">Example: /kanban?project_id=1</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="flex w-full max-w-6xl gap-4">
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Todo</h2>
        <div>{renderTasks('todo')}</div>
      </div>
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Doing</h2>
        <div>{renderTasks('doing')}</div>
      </div>
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Done</h2>
        <div>{renderTasks('done')}</div>
      </div>
    </div>
  );
};

export default function KanbanPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50">
            <h1 className="text-4xl font-bold mb-8">Kanban Board</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <KanbanBoard />
            </Suspense>
        </main>
    );
}
