import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import Input from '~/components/Input';
import { client, LOGIN } from '~/lib/graphql';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await client.request(LOGIN, { username, password });
      const userId = res?.login?.id;
      if (!userId) throw new Error('Invalid login response');

      localStorage.setItem('userId', userId);
      navigate('/todo');
    } catch (err: any) {
      const message =
        err?.response?.errors?.[0]?.message ||
        'Login failed. Please try again.';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-black">Welcome back!</h1>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold mt-4"
        >
          Login
        </button>
        <p className="mt-4 text-center text-black">
          Don’t have an account?{' '}
          <a href="/register" className="text-black font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
