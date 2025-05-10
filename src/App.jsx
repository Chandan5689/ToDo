import { useEffect, useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  
  //to load tasks from the local storage
  useEffect(() => {
    const storedTasks =localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks( JSON.parse(storedTasks)); 
    }
  },[]);

  //to store or save tasks in the local storage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, completed: false }]);
    setInput("");
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    localStorage.clear()
  };

  const clearAllTasks = () => {
    localStorage.clear();
    setTasks([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-[768px] mx-auto bg-white rounded-lg shadow-sm p-6 min-h-auto text-black">
        <div className="flex justify-center items-center my-3">
          <h1 className="text-2xl font-semibold text-black">Tasks</h1>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className=" flex-grow border-blue-400 border-1 rounded-lg p-2 outline-none focus:ring-1 ring-blue-400"
            placeholder="Enter a task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />

          <button
            className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm hover:bg-blue-600 transition-colors  cursor-pointer whitespace-nowrap"
            onClick={addTask}
          >
            <FaPlus />
          </button>
        </div>
        <ul className="mt-6 ">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-3 border-1 border-blue-700 text-[#1d1d1d] rounded-lg my-3 capitalize bg-gray-50 ${task.completed?"line-through border-green-500":""}`}
            >
              <button
                onClick={() => toggleTask(index)}
                className={`w-6 h-6 flex-shrink-0 rounded-full border-2 mr-3 flex items-center justify-center cursor-pointer ${
                  task.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-400"
                }`}
              >
                {task.completed && <span className="text-sm font-bold"><FaCheck/></span>}
              </button>
              <div
                className="flex-grow cursor-pointer"
                onClick={() => toggleTask(index)}
              >
                {task.text}
              </div>
              <button
                onClick={() => deleteTask(index)}
                className="text-red-500 hover:text-red-700 ml-4 cursor-pointer"
              >
                <MdDelete size={24} />
              </button>
            </li>
          ))}
        </ul>

        {tasks.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-red-600 hover:border-1 border-red-600 cursor-pointer transition-all ease-in-out"
              onClick={clearAllTasks}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
