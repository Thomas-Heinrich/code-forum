import { useState } from 'react';
import { mysqlip } from '../components/ip';

const inputStyle = 'p-2 border border-black rounded-3xl';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://' + mysqlip + ':4000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (response.ok) {
        alert('Logged in and Session created.');
        setUser({
          email: '',
          password: '',
        });
        window.location.href = '/';
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      alert('Could not connect to the server.');
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl mb-4">Log into your Account</h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit();
          }}
        >
          <input
            className={inputStyle}
            name="email"
            autoComplete="true"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <input
            className={inputStyle}
            name="password"
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full sm:w-fit bg-red-600 text-white border-black border-2 rounded-3xl! p-1.5 pr-3.5 pl-3.5 hover:bg-red-700 active:bg-red-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
