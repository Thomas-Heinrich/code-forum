import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { mysqlip } from './ip';

type User = {
  id: number;
  username: string;
  email: string;
  img_path: string;
  followed: number;
  follower: number;
};

function Nav__Bar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${mysqlip}:4000/api/user/logedIn`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((userId) => {
        if (userId) {
          return fetch(`http://${mysqlip}:4000/api/users/${userId}`, {
            credentials: 'include',
          })
            .then((res) => res.json())
            .then((data) => {
              setUser(data);
              setIsLoggedIn(true);
            });
        }
        return null;
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div>
        <h1>Hello</h1>
      </div>
    );

  return (
    <div className="absolute top-0 left-0 w-full z-50">
      <Navbar
        expand="lg"
        className="bg-neutral-300/95 backdrop-blur-md text-black rounded-2xl m-1"
      >
        <Container>
          <Navbar.Brand href="/">Basteln, Programmieren, Erfinden</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Nav className="me-auto">
            <Nav.Link href="/Projects">Projekte</Nav.Link>
            <Nav.Link href="/Forum">Forum</Nav.Link>
          </Nav>
          <Form className="d-flex">
            {isLoggedIn ? (
              <Nav.Link
                className="flex! text-2xl! items-center gap-3"
                href="/Manage_account"
              >
                {user?.username}
                <img
                  src={`/user_img/${user?.img_path}`}
                  alt=""
                  className="h-10 w-10"
                />
              </Nav.Link>
            ) : (
              <>
                <Button
                  href="/signin"
                  className="transition! duration-500! bg-red-600! text-white border-black border-2 rounded-xl! hover:bg-red-700! hover:text-white hover:-translate-y-px hover:shadow active:bg-red-500!"
                >
                  Account erstellen
                </Button>
                <Button
                  href="/login"
                  className="transition! duration-500! bg-red-600! text-white border-black border-2 rounded-xl! ml-4 hover:bg-red-700! hover:text-white hover:-translate-y-px hover:shadow active:bg-red-500!"
                >
                  Login
                </Button>
              </>
            )}
          </Form>
        </Container>
      </Navbar>
    </div>
  );
}

export default Nav__Bar;
