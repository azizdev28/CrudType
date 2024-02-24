import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";

type Task = {
  id: number;
  name: string;
  task: string;
  deadline: string;
};

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [inputName, setInputName] = useState<string>("");
  const [inputTask, setInputTask] = useState<string>("");
  const [inputDeadline, setInputDeadline] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const fetchData = async () => {
    try {
      const response = await axios.get<Task[]>("http://localhost:3000/crud");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    try {
      await axios.post("http://localhost:3000/crud", {
        name: inputName,
        task: inputTask,
        deadline: inputDeadline,
      });
      setInputName("");
      setInputTask("");
      setInputDeadline("");
      fetchData();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/crud/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = (task: Task) => {
    setInputName(task.name);
    setInputTask(task.task);
    setInputDeadline(task.deadline);
    setEditingTaskId(task.id);
  };

  const saveTask = async () => {
    if (editingTaskId !== null) {
      try {
        await axios.put(`http://localhost:3000/crud/${editingTaskId}`, {
          name: inputName,
          task: inputTask,
          deadline: inputDeadline,
        });
        setInputName("");
        setInputTask("");
        setInputDeadline("");
        setEditingTaskId(null);
        fetchData();
      } catch (error) {
        console.error("Error editing task:", error);
      }
    }
  };

  const handleSearch = (query: string) => {
    const filtered = tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(query.toLowerCase()) ||
        task.task.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  return (
    <div className="container CrudTodo">
      <div className="CrudTable">
        <div className="CrudeNavbar">
          <h1>Todo List</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="Input">
          <input
            className="input"
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter task name"
          />
          <input
            type="text"
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
            placeholder="Enter task description"
          />
          <input
            type="date"
            value={inputDeadline}
            onChange={(e) => setInputDeadline(e.target.value)}
            placeholder="Enter deadline"
          />
          {editingTaskId === null ? (
            <button onClick={addTask} className="AddTask">
              Add Task
            </button>
          ) : (
            <button onClick={saveTask} className="SaveTask">
              Save Task
            </button>
          )}
        </div>
        <ul className="ListItem">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <h2 className="elementh1">{task.name}</h2>
              <p className="elementp">{task.task}</p>
              <p className="elementtime">Deadline: {task.deadline}</p>
              <button
                onClick={() => editTask(task)}
                className="elementbtn edit"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="elementbtn "
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
