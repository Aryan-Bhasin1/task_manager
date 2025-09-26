import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get('https://taskflow-backend-h3uu.onrender.com/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        console.error("Unexpected response:", res.data);
        setTasks([]);
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      localStorage.removeItem('token');
      navigate('/');
    });
  }, [navigate]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const token = localStorage.getItem('token');
    const res = await axios.post('https://taskflow-backend-h3uu.onrender.com/api/tasks',
      { title: newTask, dueDate, priority },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data && res.data._id) {
      setTasks([...tasks, res.data]);
      setNewTask('');
      setDueDate('');
      setPriority('');
    }
  };

  const toggleTask = async (id, completed) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`https://taskflow-backend-h3uu.onrender.com/api/tasks/${id}`,
      { completed: !completed },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data && res.data._id) {
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');
    const res = await axios.delete(`https://taskflow-backend-h3uu.onrender.com/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data?.success) {
      setTasks(tasks.filter(t => t._id !== id));
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem('token');
    const original = tasks.find(t => t._id === id);
    if (!editedTitle.trim()) return alert("Title can't be empty");

    const res = await axios.put(`https://taskflow-backend-h3uu.onrender.com/api/tasks/${id}`,
      { ...original, title: editedTitle },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data && res.data._id) {
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
      setEditingTaskId(null);
    } else {
      console.error("Failed to update task:", res.data);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <button onClick={logout} className="task-button">Logout</button>

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
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="">Priority</option>
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">🧊 Low</option>
        </select>
        <button onClick={addTask} className="task-button">Add</button>
      </div>

      <ul className="task-list">
        {tasks.map(task => task && (
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
                    (Due: {task.dueDate.split('T')[0]})
                  </span>
                )}
                {task.priority && (
                  <span className={`priority-label ${task.priority.toLowerCase()}`}>
                    {task.priority === 'High' && '🔥 High'}
                    {task.priority === 'Medium' && '⚡ Medium'}
                    {task.priority === 'Low' && '🧊 Low'}
                  </span>
                )}
                {(() => {
                  const todayISO = new Date().toISOString().split('T')[0];
                  const taskDueISO = task.dueDate?.split('T')[0];
                  const isOverdue = taskDueISO && taskDueISO < todayISO;

                  return (
                    <>
                      {isOverdue && (
                        <span className="overdue-alert">⚠️ Overdue</span>
                      )}
                      {task.priority === 'High' && isOverdue && (
                        <span className="urgent-alert">🚨 Urgent!</span>
                      )}
                    </>
                  );
                })()}
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