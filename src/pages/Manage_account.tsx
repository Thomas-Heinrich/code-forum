import React, { useEffect, useState } from 'react';
import { mysqlip } from '../components/ip';
// TODO: Display Posts and Answers
type Account = {
  username: string;
  email: string;
  img_path: string;
};

function Manage_account() {
  // --- States ---
  const [user, setUser] = useState<Account | null>(null);
  const [toggle, setToggle] = useState(true);
  const [status, setStatus] = useState('');

  // --- Variables ---
  const tabStyling =
    'bg-neutral-300 p-2 no-underline! text-black rounded rounded-top-0 transition-all duration-300 ease-in-out';

  // --- useEffect ---
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetch(
          'http://' + mysqlip + ':4000/api/user/me',
          { credentials: 'include' },
        );
        const result = await data.json();
        setUser(result);
        setStatus('Loaded');
      } catch (e) {
        console.error(e);
        setStatus('Error');
      }
    }
    loadUser();
  }, []);
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center pt-25">
      <div className="flex md:flex-row flex-col items-start w-[80%] bg-neutral-200 rounded-2xl p-4">
        
        <div className="mr-8">
          {user?.img_path && (
            <img
              src={'public/user_img/' + user?.img_path}
              alt=""
              className="rounded-full w-20 md:w-40 aspect-square outline-red-500 outline-2"
            />
          )}
        </div>

        {status === 'Loaded' ? (
          <div className="h-full flex flex-col">
            <h1>{user?.username}</h1>
            <p className="flex-1">{user?.email}</p>
            <a href="#" className="text-red-500! no-underline! hover:underline! w-fit">
              Edit account
            </a>
          </div>
        ) : (
          <h1>Nicht eingeloggt </h1>
        )}

        {status === 'Error' && (
          <div className="h-full flex flex-col">
            <h1>Ein Fehler ist aufgetreten...</h1>
            <p className="flex-1">{user?.email}</p>
            <a href="#" className="text-red-500! no-underline!">
              Edit account
            </a>
          </div>
        )} 
      </div>

      <div className="w-[80%] min-h-[50%] bg-neutral-200 p-4 pt-0 mt-4 rounded-2xl transition-all duration-500">
        <div className="flex flex-row gap-4 text-xl">
          <div>
            <button
              onClick={() => setToggle(true)}
              className={`${tabStyling} ${toggle && 'bg-neutral-400 shadow text-black'}`}
            >
              Questions
            </button>
          </div>
          <div>
            <button
              onClick={() => setToggle(false)}
              className={`${tabStyling} ${!toggle && 'bg-neutral-400 shadow text-black'}`}
            >
              Answers
            </button>
          </div>
        </div>
        <div className="mt-4">
          {toggle ? <div>Questions</div> : <div> Answers </div>}
        </div>
      </div>
    </div>
  );
}

export default Manage_account;
