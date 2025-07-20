import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import Input from '~/components/Input';
import { client, REGISTER } from '~/lib/graphql';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await client.request(REGISTER, { username, password });
      console.log('Registered:', res.register);
      alert('Account created! You can now log in.');
      navigate('/login');
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Welcome</h1>
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
          onClick={handleRegister}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold mt-4"
        >
          Register
        </button>
        <p className="mt-4 text-center text-black">
          Already have an account?{' '}
          <a href="/login" className="font-semibold underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
