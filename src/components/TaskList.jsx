import TaskItem from "./TaskItem";

function TaskList({ tasks, isDark, onToggleTask, onDeleteTask, onUpdateTaskText }) {
  if (!tasks.length) {
    return (
      <div
        className={`mt-6 text-center py-10 border border-dashed rounded-xl ${
          isDark
            ? "border-slate-600 bg-slate-800/60 text-slate-300"
            : "border-slate-300 bg-slate-50 text-slate-600"
        }`}
      >
        No tasks to show for this filter.
      </div>
    );
  }

  return (
    <ul className="mt-6">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isDark={isDark}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onUpdateTaskText={onUpdateTaskText}
        />
      ))}
    </ul>
  );
}

export default TaskList;
