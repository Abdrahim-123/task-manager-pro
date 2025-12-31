import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(''); 
  const [isLoading, setIsLoading] = useState(true); // Loading state
  
  // Edit mode state
  const [editingTaskId, setEditingTaskId] = useState(null); // ID of task in edit mode
  const [editTitle, setEditTitle] = useState(''); // Current edit title

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/');
    else fetchTasks();
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: token }
      });
      setTasks(res.data);
      setIsLoading(false); // Stop loading
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if(!newTask.trim()) return; // Avoid empty tasks
    try {
      await axios.post('http://localhost:5000/api/tasks', 
        { title: newTask },
        { headers: { Authorization: token } }
      );
      setNewTask(''); 
      fetchTasks(); 
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return; // Confirm delete
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: token }
      });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleToggle = async (task) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, 
        { status: task.status === 'completed' ? 'pending' : 'completed' },
        { headers: { Authorization: token } }
      );
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  // Begin edit mode
  const startEditing = (task) => {
    setEditingTaskId(task._id); // Enter edit mode for this task
    setEditTitle(task.title);   // Prefill input with current title
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, 
        { title: editTitle },
        { headers: { Authorization: token } }
      );
      setEditingTaskId(null); // Exit edit mode
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>🚀 My Tasks</h1>
          <button onClick={handleLogout} className="btn-danger" style={{width: 'auto'}}>Logout</button>
        </div>

        {/* Add task */}
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ width: '100px' }}>Add</button>
        </form>

        {/* Loading / empty state */}
        {isLoading && <p style={{textAlign: 'center'}}>Loading tasks...</p>}
        {!isLoading && tasks.length === 0 && <p style={{textAlign: 'center', color: '#94a3b8'}}>No tasks yet. Add one above!</p>}

        {/* Task list */}
        <div style={{ marginTop: '20px' }}>
          {tasks.map(task => (
            <div key={task._id} className="task-item">
              
              {/* Editing this task? */}
              {editingTaskId === task._id ? (
                // Edit mode
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <input 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    autoFocus 
                  />
                  <button onClick={() => saveEdit(task._id)} className="btn-success">Save</button>
                  <button onClick={() => setEditingTaskId(null)} className="btn-outline">Cancel</button>
                </div>
              ) : (
                // View mode
                <>
                  <span 
                    onClick={() => handleToggle(task)}
                    style={{ 
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      color: task.status === 'completed' ? '#94a3b8' : 'white',
                      cursor: 'pointer',
                      flexGrow: 1
                    }}
                  >
                    {task.title}
                  </span>
                  
                  <div className="task-actions">
                    <button onClick={() => startEditing(task)} className="btn-outline">✏️</button>
                    <button onClick={() => handleDelete(task._id)} className="btn-danger">🗑️</button>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;