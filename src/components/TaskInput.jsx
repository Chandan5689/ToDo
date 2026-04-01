import { FaPlus } from "react-icons/fa";

function TaskInput({ input, inputError, isDark, onInputChange, onAddTask }) {
  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          className={`flex-grow border rounded-xl p-3 outline-none focus:ring-2 transition-colors ${
            isDark
              ? "bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:ring-cyan-300 focus:border-cyan-300"
              : "bg-white border-slate-300 text-slate-900 focus:ring-sky-300 focus:border-sky-500"
          }`}
          placeholder="Enter a task"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAddTask()}
        />

        <button
          className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-sm transition-colors cursor-pointer whitespace-nowrap ${
            isDark ? "bg-cyan-600 hover:bg-cyan-500" : "bg-sky-600 hover:bg-sky-700"
          }`}
          onClick={onAddTask}
          aria-label="Add task"
        >
          <FaPlus />
        </button>
      </div>
      {inputError && <p className="text-rose-600 text-sm mt-2">{inputError}</p>}
    </div>
  );
}

export default TaskInput;
