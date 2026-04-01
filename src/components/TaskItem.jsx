import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";

function TaskItem({ task, isDark, onToggleTask, onDeleteTask, onUpdateTaskText }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(task.text);
  const [editError, setEditError] = useState("");

  const startEdit = () => {
    setDraftText(task.text);
    setEditError("");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraftText(task.text);
    setEditError("");
    setIsEditing(false);
  };

  const saveEdit = () => {
    const result = onUpdateTaskText(task.id, draftText);
    if (!result.ok) {
      setEditError(result.message);
      return;
    }
    setEditError("");
    setIsEditing(false);
  };

  const createdLabel = new Date(task.createdAt).toLocaleString();

  return (
    <li
      className={`p-3 border rounded-xl my-3 shadow-sm transition-colors ${
        isDark
          ? task.completed
            ? "bg-slate-800 border-emerald-500/60"
            : "bg-slate-800 border-slate-700"
          : task.completed
            ? "bg-white border-emerald-300"
            : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleTask(task.id)}
          aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
          className={`w-6 h-6 mt-1 flex-shrink-0 rounded-full border-2 mr-1 flex items-center justify-center cursor-pointer ${
            task.completed
              ? "bg-emerald-500 border-emerald-500 text-white"
              : isDark
                ? "border-slate-500"
                : "border-slate-400"
          }`}
        >
          {task.completed && (
            <span className="text-sm font-bold">
              <FaCheck />
            </span>
          )}
        </button>

        <div className="flex-grow">
          {isEditing ? (
            <>
              <input
                type="text"
                className={`w-full border rounded-lg p-2 outline-none focus:ring-2 transition-colors ${
                  isDark
                    ? "bg-slate-900 border-slate-600 text-slate-100 focus:ring-cyan-300 focus:border-cyan-300"
                    : "bg-white border-slate-300 text-slate-900 focus:ring-sky-300 focus:border-sky-500"
                }`}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                autoFocus
              />
              {editError && <p className="text-rose-600 text-sm mt-1">{editError}</p>}
            </>
          ) : (
            <div>
              <div
                className={`cursor-pointer pt-1 ${
                  task.completed
                    ? isDark
                      ? "line-through text-slate-400"
                      : "line-through text-slate-500"
                    : isDark
                      ? "text-slate-100"
                      : "text-slate-800"
                }`}
                onClick={() => onToggleTask(task.id)}
              >
                {task.text}
              </div>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Created: {createdLabel}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={saveEdit}
                className={`px-2 py-1 text-sm cursor-pointer ${
                  isDark ? "text-emerald-300 hover:text-emerald-200" : "text-emerald-600 hover:text-emerald-700"
                }`}
                aria-label="Save task text"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className={`px-2 py-1 text-sm cursor-pointer ${
                  isDark ? "text-slate-300 hover:text-slate-100" : "text-slate-500 hover:text-slate-700"
                }`}
                aria-label="Cancel task text edit"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={startEdit}
              aria-label="Edit task"
              className={`p-1 cursor-pointer ${
                isDark ? "text-cyan-300 hover:text-cyan-200" : "text-sky-600 hover:text-sky-700"
              }`}
            >
              <MdEdit size={22} />
            </button>
          )}

          <button
            onClick={() => onDeleteTask(task.id)}
            aria-label="Delete task"
            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
          >
            <MdDelete size={22} />
          </button>
        </div>
      </div>
    </li>
  );
}

export default TaskItem;
