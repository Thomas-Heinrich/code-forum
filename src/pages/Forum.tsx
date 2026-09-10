import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { mysqlip } from '../components/ip';

type Posts = {
  id: number;
  title: string;
  descr: string;
  content: string;
  author: string;
  created_at: number;
};

type Follower = {
  followed: number;
};

function Forum() {
  const [data, setData] = useState<Posts[]>([]);
  const [follower, setFollower] = useState<Follower | null>(null);

  const navigate = useNavigate();

  // ---------------- POSTS ----------------
  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`http://${mysqlip}:4000/api/Posts`);
        const posts: Posts[] = await response.json();

        setData(posts);
      } catch (err) {
        console.error(err);
      }
    }

    loadPost();
  }, []);

  // ---------------- FOLLOWER ----------------
  useEffect(() => {
    async function getFollower() {
      try {
        const response = await fetch(`http://${mysqlip}:4000/api/user/1`);
        const data: Follower = await response.json();

        setFollower(data);
      } catch (err) {
        console.error(err);
      }
    }

    getFollower();
  }, []);

  // ---------------- SCROLL ----------------
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="pt-25">
      {/* NAV */}
      <nav className="sticky top-0 p-2 bg-white/75 backdrop-blur-sm">
        <Form className="grid grid-cols-10 gap-3 items-center px-8 mt-3 justify-center">
          <Button
            className="text-black bg-white rounded-4 border-2 border-red-700! col-start-1 hidden! md:block!"
            onClick={scrollToTop}
          >
            Up ^
          </Button>
          <Form.Control
            type="search"
            placeholder="Suche nach einem Thema"
            className="border-2 text-center col-span-6 col-start-1 md:col-start-3 focus:shadow-none! active:border-red-700! focus:border-red-700!"
          />
          <Button className="col-start-7 md:col-start-10 bg-red-600! border-black border-2 w-fit hover:bg-red-700! active:bg-red-500! focus:shadow-none! px-4 whitespace-nowrap">
            Search
          </Button>
        </Form>
      </nav>

      {/* GRID */}
      <div className="grid grid-cols-8 gap-5 mt-4">
        {/* FOLLOWER */}
        <div className="text-center col-span-2 col-start-1 border-5 ml-4 h-screen rounded-b-3xl rounded-t-md hidden md:block">
          <h1 className="inline-block border-b-3 pb-1 border-gray-300">
            Gefolgt
          </h1>

          <h2>{follower?.followed}</h2>
        </div>

        {/* POSTS */}
        <div className="col-span-8 md:col-span-4 col-start-1 md:col-start-3">
          {data.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/Forum/${post.title}`)}
              className="flex flex-col cursor-pointer! justify-center p-4 bg-gray-300 border border-gray-900 rounded-2xl shadow-sm h-auto mb-4 prose max-w-none"
            >
              <h2>{post.title}</h2>
              <ReactMarkdown>{post.descr}</ReactMarkdown>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-2 col-start-7 border-5 mr-4 hidden md:block">
          <h1>wq</h1>
          <h2>w</h2>
          <h3>uk</h3>
        </div>
      </div>
    </div>
  );
}

export default Forum;
