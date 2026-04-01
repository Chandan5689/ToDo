import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { useLocalStorageTasks } from "../hooks/useLocalStorageTasks";

const THEME_KEY = "todo-theme";
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return "dark";
};

function TaskDashboard() {
  const { tasks, setTasks, clearAllTasks, createTaskId } = useLocalStorageTasks();
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";

  const addTask = () => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;

    const duplicateTask = tasks.some(
      (task) => task.text.trim().toLowerCase() === trimmedInput.toLowerCase()
    );

    if (duplicateTask) {
      setInputError("This task already exists.");
      return;
    }

    setTasks([
      ...tasks,
      { id: createTaskId(), text: trimmedInput, completed: false, createdAt: Date.now() },
    ]);
    setInputError("");
    setInput("");
  };

  const toggleTask = (taskId) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const deleteTask = (taskId) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
  };

  const updateTaskText = (taskId, newText) => {
    const trimmedText = newText.trim();
    if (trimmedText === "") return { ok: false, message: "Task cannot be empty." };

    const duplicateTask = tasks.some(
      (task) =>
        task.id !== taskId && task.text.trim().toLowerCase() === trimmedText.toLowerCase()
    );

    if (duplicateTask) {
      return { ok: false, message: "Another task already has this text." };
    }

    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, text: trimmedText } : task
    );
    setTasks(newTasks);
    return { ok: true, message: "" };
  };

  const handleClearAll = () => {
    if (!tasks.length) return;
    const isConfirmed = window.confirm("Clear all tasks? This action cannot be undone.");
    if (!isConfirmed) return;
    clearAllTasks();
  };

  const markAllDone = () => {
    const hasActiveTask = tasks.some((task) => !task.completed);
    if (!hasActiveTask) return;

    const updatedTasks = tasks.map((task) => ({ ...task, completed: true }));
    setTasks(updatedTasks);
  };

  const clearCompleted = () => {
    const updatedTasks = tasks.filter((task) => !task.completed);
    setTasks(updatedTasks);
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const searchedTasks = filteredTasks.filter((task) =>
    task.text.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  const sortedTasks = [...searchedTasks].sort((a, b) => {
    if (sortBy === "oldest") return a.createdAt - b.createdAt;
    if (sortBy === "a-z") return a.text.localeCompare(b.text);
    if (sortBy === "z-a") return b.text.localeCompare(a.text);
    return b.createdAt - a.createdAt;
  });

  const completedTaskCount = tasks.filter((task) => task.completed).length;

  return (
    <div
      className={`min-h-screen py-10 px-4 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950"
          : "bg-gradient-to-br from-slate-100 via-sky-100 to-cyan-50"
      }`}
    >
      <div
        className={`max-w-[840px] mx-auto backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 border transition-colors duration-300 ${
          isDark
            ? "bg-slate-900/85 text-slate-100 border-slate-700"
            : "bg-white/90 text-slate-900 border-white"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"} mt-1`}>
              Keep your day clear, focused, and moving.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`relative p-1 rounded-xl border overflow-hidden ${
                isDark ? "border-slate-600 bg-slate-800" : "border-slate-300 bg-white"
              }`}
              role="group"
              aria-label="Theme switch"
            >
              <span
                className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-lg transition-transform duration-300 ease-out ${
                  isDark
                    ? "translate-x-[calc(100%+0.25rem)] bg-cyan-500/90"
                    : "translate-x-0 bg-slate-900"
                }`}
                aria-hidden="true"
              />
              <div className="relative grid grid-cols-2 gap-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-2 rounded-lg text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                    !isDark
                      ? "text-white"
                      : "text-slate-200 hover:text-white"
                  }`}
                  aria-pressed={!isDark}
                  aria-label="Switch to light theme"
                >
                  <MdLightMode
                    size={18}
                    className={`transition-transform duration-300 ${!isDark ? "scale-110" : "scale-95"}`}
                  />
                  <span
                    className={`transition-all duration-300 ${!isDark ? "opacity-100 translate-x-0" : "opacity-80 translate-x-0.5"}`}
                  >
                    Light
                  </span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-2 rounded-lg text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                    isDark
                      ? "text-slate-950"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                  aria-pressed={isDark}
                  aria-label="Switch to dark theme"
                >
                  <MdDarkMode
                    size={18}
                    className={`transition-transform duration-300 ${isDark ? "scale-110" : "scale-95"}`}
                  />
                  <span
                    className={`transition-all duration-300 ${isDark ? "opacity-100 translate-x-0" : "opacity-80 -translate-x-0.5"}`}
                  >
                    Dark
                  </span>
                </button>
              </div>
            </div>
            <div
              className={`text-sm px-4 py-2 rounded-xl border ${
                isDark
                  ? "text-slate-200 bg-slate-800 border-slate-700"
                  : "text-slate-700 bg-slate-50 border-slate-200"
              }`}
            >
              <span className="font-semibold">{remainingCount}</span> remaining, <span className="font-semibold">{completedCount}</span> completed
            </div>
          </div>
        </div>

        <TaskInput
          input={input}
          inputError={inputError}
          isDark={isDark}
          onInputChange={(value) => {
            setInput(value);
            if (inputError) setInputError("");
          }}
          onAddTask={addTask}
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { id: "all", label: `All (${tasks.length})` },
            { id: "active", label: `Active (${remainingCount})` },
            { id: "completed", label: `Completed (${completedCount})` },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors cursor-pointer ${
                filter === option.id
                  ? isDark
                    ? "bg-cyan-500 text-slate-950 border-cyan-400"
                    : "bg-slate-900 text-white border-slate-900"
                  : isDark
                    ? "bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search tasks"
            className={`w-full border rounded-xl p-2.5 outline-none focus:ring-2 transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:ring-cyan-300 focus:border-cyan-300"
                : "bg-white border-slate-300 text-slate-900 focus:ring-sky-300 focus:border-sky-500"
            }`}
            aria-label="Search tasks"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`w-full border rounded-xl p-2.5 outline-none focus:ring-2 transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-600 text-slate-100 focus:ring-cyan-300 focus:border-cyan-300"
                : "bg-white border-slate-300 text-slate-900 focus:ring-sky-300 focus:border-sky-500"
            }`}
            aria-label="Sort tasks"
          >
            <option value="newest">Sort: Newest first</option>
            <option value="oldest">Sort: Oldest first</option>
            <option value="a-z">Sort: A to Z</option>
            <option value="z-a">Sort: Z to A</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={markAllDone}
            className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer transition-colors ${
              isDark
                ? "border-emerald-400/40 text-emerald-200 bg-emerald-900/40 hover:bg-emerald-900/60"
                : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
            }`}
          >
            Mark all done
          </button>
          <button
            onClick={clearCompleted}
            disabled={!completedTaskCount}
            className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? "border-amber-400/40 text-amber-200 bg-amber-900/30 hover:bg-amber-900/50"
                : "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
            }`}
          >
            Clear completed ({completedTaskCount})
          </button>
        </div>

        <TaskList
          tasks={sortedTasks}
          isDark={isDark}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onUpdateTaskText={updateTaskText}
        />

        {tasks.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              className={`px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                isDark
                  ? "bg-rose-700 text-white border-rose-500 hover:bg-rose-600"
                  : "bg-rose-600 text-white border-rose-700 hover:bg-rose-700"
              }`}
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDashboard;
