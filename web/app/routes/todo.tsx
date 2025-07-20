import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { LuTrash } from 'react-icons/lu';
import { TbPencil } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import Input from '~/components/Input';
import {
  client,
  GET_TODOS,
  ADD_TODO,
  DELETE_TODO,
  UPDATE_TODO,
} from '~/lib/graphql';

type Todo = {
  id: string;
  text: string;
  done?: boolean;
};

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchTodos = async (uid: string) => {
    try {
      const res = await client.request(GET_TODOS, { userId: uid });
      const withDone = res.todos.map((t: any) => ({ ...t, done: false }));
      setTodos(withDone);
    } catch (err: any) {
      alert(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!text.trim() || !userId) return;
    try {
      const res = await client.request(ADD_TODO, { userId, text });
      setTodos((prev) => [...prev, { ...res.addTodo, done: false }]);
      setText('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await client.request(DELETE_TODO, { id });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (todo: Todo) => {
    setText(todo.text);
    setEditingId(todo.id);
  };

  const handleUpdate = async () => {
    if (!text.trim() || !editingId) return;
    try {
      const res = await client.request(UPDATE_TODO, {
        id: editingId,
        text,
      });
      setTodos((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...res.updateTodo, done: t.done } : t,
        ),
      );
      setText('');
      setEditingId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleDone = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        fetchTodos(storedUserId);
      } else {
        alert('Not logged in.');
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10 relative">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 text-sm text-gray-500 hover:text-black"
      >
        Logout
      </button>

      <h1 className="text-2xl font-bold mb-6 text-black">Tasks</h1>
      <div className="flex w-full max-w-md gap-2">
        <Input
          placeholder="What do you want to do?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="rounded-full"
        />
        <button
          onClick={editingId ? handleUpdate : handleAdd}
          className="bg-black text-white rounded-full w-14 h-12 flex items-center justify-center hover:bg-gray-900"
        >
          <FiPlus size={20} />
        </button>
      </div>

      <div className="mt-6 w-full max-w-md text-black">
        {loading ? (
          <p>Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-500">No tasks.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center border rounded-lg p-4 shadow-sm ${
                  editingId === todo.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <label className="flex items-center gap-2 flex-1">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-gray-500"
                    checked={todo.done}
                    onChange={() => toggleDone(todo.id)}
                  />
                  <span
                    className={`text-base ${
                      todo.done ? 'line-through text-gray-400' : 'text-black'
                    }`}
                  >
                    {todo.text}
                  </span>
                </label>
                <div className="space-x-2 text-sm flex-shrink-0">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <TbPencil size={18} color="black" />
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <LuTrash size={18} color="black" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
