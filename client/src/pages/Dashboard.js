import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // 👈 import the CSS file

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const navigate = useNavigate();

  // Fetch tasks on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setTasks(res.data))
    .catch(err => {
      console.error(err);
      localStorage.removeItem('token');
      navigate('/');
    });
  }, [navigate]);

  // Add new task
  const addTask = async () => {
    if (!newTask) return;
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/tasks',
      { title: newTask, dueDate },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTasks([...tasks, res.data]);
    setNewTask('');
    setDueDate('');
  };

  // Toggle completion
  const toggleTask = async (id, completed) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`http://localhost:5000/api/tasks/${id}`,
      { completed: !completed },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTasks(tasks.map(t => (t._id === id ? res.data : t)));
  };

  // Delete task
  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(tasks.filter(t => t._id !== id));
  };

  // Start editing
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
  };

  // Save edit
  const saveEdit = async (id) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`http://localhost:5000/api/tasks/${id}`,
      { title: editedTitle },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTasks(tasks.map(t => (t._id === id ? res.data : t)));
    setEditingTaskId(null);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <button onClick={logout} className="task-button">Logout</button>

      {/* Add Task */}
      <div className="add-task">
        <input
          type="text"
          placeholder="New task"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <button onClick={addTask} className="task-button">Add</button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task._id, task.completed)}
            />

            {editingTaskId === task._id ? (
              <>
                <input
                  value={editedTitle}
                  onChange={e => setEditedTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(task._id)} className="task-button">Save</button>
                <button onClick={() => setEditingTaskId(null)} className="task-button">Cancel</button>
              </>
            ) : (
              <>
                {task.title}
                {task.dueDate && (
                  <span className="due-date">
                    (Due: {new Date(task.dueDate).toLocaleDateString()})
                  </span>
                )}
                <button onClick={() => startEditing(task)} className="task-button">✏️ Edit</button>
              </>
            )}

            <button onClick={() => deleteTask(task._id)} className="task-button">❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;