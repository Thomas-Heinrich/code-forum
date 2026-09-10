import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { mysqlip } from './ip';

const link_style = 'hover:text-gray-700! transition-all duration-300';

type User = {
  id: number;
  username: string;
  email: string;
  img_path: string;
  followed: number;
  follower: number;
};

function navbar_new() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${mysqlip}:4000/api/user/logedin`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((userId) => {
        if (userId) {
          return fetch(`http://${mysqlip}:4000/api/user/me`, {
            credentials: 'include',
          })
            .then(async (res) => {
              if (!res.ok) throw new Error(await res.text());
              return res.json();
            })
            .then((data) => {
              if (data) {
                setUser(data);
                setIsLoggedIn(true);
              }
            });
        }
        return null;
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full absolute top-0 left-0 flex justify-center my-2 z-50">
      <div className="w-[95%] bg-neutral-300 p-6 rounded-md lg:rounded-full shadow">
        <nav className="animate-all duration-150">
          {/* Desktop Navbar */}
          <ul className="w-full m-auto justify-between items-center [&_a]:text-black! [&_a]:no-underline! hidden lg:flex">
            <li>
              <a className="text-2xl" href="/">
                Basteln, Programmieren, Erfinden
              </a>
            </li>
            <div className="flex gap-4">
              <li>
                <a className={link_style} href="/Projects">
                  Projekte
                </a>
              </li>
              <li>
                <a className={link_style} href="/Forum">
                  Forum
                </a>
              </li>
            </div>
            {!loading &&
              (isLoggedIn ? (
                <div>
                  <a
                    className="flex items-center gap-3 text-xl"
                    href="/Manage_account"
                  >
                    {user?.username}
                    <img
                      src={`/user_img/${user?.img_path}`}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </a>
                </div>
              ) : (
                <div>
                  <a
                    className="bg-red-600 mr-4 px-4 py-1.5 rounded-2xl outline-2 outline-black hover:text-white! hover:outline-red-600 hover:bg-red-700 transition-all duration-500"
                    href="/Login"
                  >
                    Login
                  </a>
                  <a
                    className="bg-red-600 mr-4 px-4 py-1.5 rounded-2xl outline-2 outline-black hover:text-white! hover:outline-red-600 hover:bg-red-700 active:bg-red-500 transition-all duration-500"
                    href="/Signin"
                  >
                    Signin
                  </a>
                </div>
              ))}
          </ul>

          {/* Mobile Navbar */}
          <div>
            {open ? (
              <button
                className="lg:hidden blcok"
                onClick={() => setOpen(false)}
              >
                <X size={28}></X>
              </button>
            ) : (
              <button className="lg:hidden blcok" onClick={() => setOpen(true)}>
                <Menu size={28}></Menu>
              </button>
            )}
            <a
              className="text-xl no-underline! text-black! p-4 lg:hidden hidden 400px:inline"
              href="/"
            >
              Basteln, Programmieren, Erfinden
            </a>
            <ul
              className={`w-full m-auto justify-center [&_a]:text-black! [&_a]:no-underline! flex flex-col lg:hidden overflow-hidden transition-all duration-500 ${open ? 'max-h-96 opacity-100 mt-4 pb-4' : 'max-h-0 opacity-0'}`}
            >
              {' '}
              {open && (
                <>
                  <li>
                    <a href="/Projects">Projekte</a>
                  </li>
                  <li>
                    <a href="/Forum">Forum</a>
                  </li>

                  {!loading &&
                    (isLoggedIn ? (
                      <li className="pt-3">
                        <a
                          className="flex items-center gap-3 text-xl"
                          href="/Manage_account"
                        >
                          {user?.username}
                          <img
                            src={`/user_img/${user?.img_path}`}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </a>
                      </li>
                    ) : (
                      <li className="pt-3">
                        <a
                          className="bg-red-600 mr-4 px-4 py-1.5 rounded-2xl outline-2 outline-black rounded-bl-sm rounded-tr-sm hover:rounded-2xl hover:text-white! hover:outline-red-600 hover:bg-red-700 transition-all duration-500"
                          href="/Login"
                        >
                          Login
                        </a>
                        <a
                          className="bg-red-600 mr-4 px-4 py-1.5 rounded-2xl outline-2 outline-black rounded-bl-sm rounded-tr-sm hover:rounded-2xl hover:text-white! hover:outline-red-600 hover:bg-red-700 transition-all duration-500"
                          href="/Signin"
                        >
                          Signin
                        </a>
                      </li>
                    ))}
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default navbar_new;
