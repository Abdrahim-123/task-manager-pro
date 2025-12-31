import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';


function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // FORM STATES
  const [newTask, setNewTask] = useState(''); 
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDueDate, setNewDueDate] = useState('');

  // EDIT MODE STATES
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/');
    else fetchTasks();
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: token }
      });
      setTasks(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if(!newTask.trim()) return;
    try {
      await axios.post(`${API_URL}/api/tasks`, 
        { 
          title: newTask,
          category: newCategory,
          dueDate: newDueDate
        },
        { headers: { Authorization: token } }
      );
      setNewTask(''); 
      setNewCategory('Personal');
      setNewDueDate('');
      fetchTasks(); 
    } catch (err) { 
      console.error('Detailed Error:', err.response ? err.response.data : err.message);
      alert(`An error occurred: ${err.response ? err.response.data.message : err.message}`); 
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: token }
      });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleToggle = async (task) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${task._id}`, 
        { status: task.status === 'completed' ? 'pending' : 'completed' },
        { headers: { Authorization: token } }
      );
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id); 
    setEditTitle(task.title);   
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${id}`, 
        { title: editTitle },
        { headers: { Authorization: token } }
      );
      setEditingTaskId(null); 
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'Work': return '#38bdf8'; // Blue
      case 'School': return '#fbbf24'; // Yellow
      case 'Personal': return '#a78bfa'; // Purple
      default: return '#94a3b8'; // Grey
    }
  };

  return (
    <div className="container">
      <div className="card">
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🚀 Tasks</h1>
          <button onClick={handleLogout} className="btn-danger" style={{ fontSize: '1rem' }}>Logout</button>
        </div>

        {/* BIG ADD FORM */}
        <form onSubmit={handleAddTask} style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          {/* Row 1: Title */}
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ marginBottom: '15px' }}
          />

          {/* Row 2: Options */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ flex: 1, minWidth: '150px' }}
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="School">School</option>
              <option value="Other">Other</option>
            </select>

            <input 
              type="date" 
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              style={{ flex: 1, minWidth: '150px', colorScheme: 'dark' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Add New Task</button>
        </form>

        {isLoading && <p style={{textAlign: 'center', marginTop: '30px', fontSize: '1.2rem'}}>Loading tasks...</p>}
        {!isLoading && tasks.length === 0 && <p style={{textAlign: 'center', color: '#94a3b8', marginTop: '30px', fontSize: '1.2rem'}}>No tasks yet. Add one above!</p>}

        {/* TASK LIST */}
        <div style={{ marginTop: '30px' }}>
          {tasks.map(task => (
            <div key={task._id} className="task-item">
              
              {editingTaskId === task._id ? (
                // EDIT MODE
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  <input 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    autoFocus 
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => saveEdit(task._id)} className="btn-success">Save Changes</button>
                    <button onClick={() => setEditingTaskId(null)} className="btn-outline">Cancel</button>
                  </div>
                </div>
              ) : (
                // NORMAL MODE
                <>
                  <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px'}}>
                    
                    {/* TITLE */}
                    <span 
                      onClick={() => handleToggle(task)}
                      style={{ 
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        color: task.status === 'completed' ? '#94a3b8' : 'white',
                        cursor: 'pointer',
                        fontSize: '1.3rem', // Bigger Task Title
                        fontWeight: '500'
                      }}
                    >
                      {task.title}
                    </span>

                    {/* TAGS */}
                    <div style={{fontSize: '0.9rem', color: '#94a3b8', display: 'flex', gap: '15px', alignItems: 'center'}}>
                      <span style={{
                        color: getCategoryColor(task.category), 
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span>📅 {formatDate(task.dueDate)}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* BUTTONS */}
                  <div className="task-actions">
                    <button onClick={() => startEditing(task)} className="btn-outline" title="Edit">✏️</button>
                    <button onClick={() => handleDelete(task._id)} className="btn-danger" title="Delete">🗑️</button>
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