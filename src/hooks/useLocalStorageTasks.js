import { useEffect, useState } from "react";

const STORAGE_KEY = "tasks";

const createTaskId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const normalizeTask = (task) => ({
  id: task?.id ?? createTaskId(),
  text: typeof task?.text === "string" ? task.text : "",
  completed: Boolean(task?.completed),
  createdAt: typeof task?.createdAt === "number" ? task.createdAt : Date.now(),
});

export const useLocalStorageTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (!storedTasks) return;

    try {
      const parsedTasks = JSON.parse(storedTasks);
      if (!Array.isArray(parsedTasks)) {
        setTasks([]);
        return;
      }

      const normalizedTasks = parsedTasks.map(normalizeTask);
      setTasks(normalizedTasks);
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const clearAllTasks = () => {
    setTasks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { tasks, setTasks, clearAllTasks, createTaskId };
};
