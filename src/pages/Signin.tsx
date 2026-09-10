import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { mysqlip } from '../components/ip';

const inputStyle = 'p-2 border border-black rounded-3xl';

function Signin() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://' + mysqlip + ':4000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created!');
        console.log(data);

        setUser({
          username: '',
          email: '',
          password: '',
        });
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      alert('Could not connect to the server.');
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl mb-4">Create Account</h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit();
          }}
        >
          <input
            className={inputStyle}
            type="text"
            autoComplete="true"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />

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
            type="password"
            name="password"
            autoComplete="true"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <Button
            type="submit"
            className="w-full sm:w-fit bg-red-600! text-white border-black! border-2 rounded-3xl! hover:bg-red-700! active:bg-red-500!"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
