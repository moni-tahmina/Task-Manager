import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Check, Edit, Trash2, X, Save, Plus } from 'lucide-react' 

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const res = await axios.get(`${API}/api/tasks`)
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  async function addTask(e) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      const res = await axios.post(`${API}/api/tasks`, { title })
      setTasks(prev => [res.data, ...prev])
      setTitle('')
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteTask(id) {
    try {
      await axios.delete(`${API}/api/tasks/${id}`)
      setTasks(prev => prev.filter(t => t._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleCompleted(id, currently) {
    try {
      const res = await axios.put(`${API}/api/tasks/${id}`, { completed: !currently })
      setTasks(prev => prev.map(t => t._id === id ? res.data : t))
    } catch (err) {
      console.error(err)
    }
  }

  function startEdit(task) {
    setEditingId(task._id)
    setEditingTitle(task.title)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingTitle('')
  }

  async function saveEdit(id) {
    const newTitle = editingTitle.trim()
    if (!newTitle) return
    try {
      const res = await axios.put(`${API}/api/tasks/${id}`, { title: newTitle })
      setTasks(prev => prev.map(t => t._id === id ? res.data : t))
      setEditingId(null)
      setEditingTitle('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Task Flow Manager</h1>

        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Add a new task..."
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 rounded-xl flex items-center gap-2">
            <Plus size={18} /> Add
          </button>
        </form>

        <ul className="space-y-3">
          {tasks.map(task => (
            <li
              key={task._id}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 shadow-sm transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task._id, task.completed)}
                  className="w-5 h-5 accent-indigo-600"
                />
                {editingId === task._id ? (
                  <input
                    className="border rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-400 transition"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit(task._id)}
                  />
                ) : (
                  <span className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingId === task._id ? (
                  <>
                    <button onClick={() => saveEdit(task._id)} className="text-green-600 hover:text-green-800 transition">
                      <Save size={20} />
                    </button>
                    <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 transition">
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(task)} className="text-blue-600 hover:text-blue-800 transition">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => deleteTask(task._id)} className="text-red-600 hover:text-red-800 transition">
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
