import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mysqlip } from '../components/ip';
import Button from 'react-bootstrap/Button';

type User = {
  username: string;
};

function CreatePost() {
  const [title, settitle] = useState<string>("");
  const [content, setcontent] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const date = new Date();

  useEffect(() => {
    fetch(`http://${mysqlip}:4000/api/user/logedin`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((userId) => {
        if (userId) {
          return fetch(`http://${mysqlip}:4000/api/user/me`, {
            credentials: 'include',
          });
        }
      })
      .then((res) => {
        if (res) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          setUser(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Titel und Content dürfen nicht leer sein");
      return;
    }
    if (!user) {
      setError("Du musst angemeldet sein");
      navigate("/Login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://${mysqlip}:4000/api/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setError("Nicht eingeloggt");
        navigate("/Login");
        return;
      }
      if (!res.ok) {
        console.log(res)
        setError(data.error || "Fehler beim Erstellen des Posts");
        return;
      }
      navigate("/Forum");
    } catch (err) {
      console.error(err);
      setError("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  };
  console.log(user?.username)
  return (
    <div>
      <div className="mt-28"></div>
      <div className="hidden md:block">
        <div className="grid grid-cols-16 gap-4">
          <div className="col-start-2 col-end-8 border border-black w-full text-center">
            Post
          </div>
          <h3 className="col-start-1 col-end-3 ml-7">Titel:</h3>
          <input
            className="col-start-3 col-end-8 border-3 border-red-600 rounded-md w-full h-10 hover:border-red-700 focus:outline-none focus:border-red-500"
            type="text"
            value={title}
            onChange={(event) => settitle(event.target.value)}
            placeholder="tippe hier deinen Titel ein"
          />
          <h3 className="col-start-1 col-end-3 ml-7">Content:</h3>
          <textarea
            className="col-start-3 col-end-8 border-3 border-red-600 rounded-md w-full h-40 resize-y text-2xl hover:border-red-700 focus:outline-none focus:border-red-500"
            placeholder="Tippe hir den inhalt des gesprächstehma"
            value={content}
            onChange={(event) => setcontent(event.target.value)}
            name="content"
            id="0"
          />
          <Button
            className="col-start-3 col-end-5"
            type="button"
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? "Wird veröffentlicht..." : "Veröffentlichen"}
          </Button>
          {error && <p className="col-start-3 col-end-8 text-red-600">{error}</p>}
          {!user && <p className="col-start-3 col-end-8 text-amber-600">Du musst angemeldet sein um zu posten</p>}
          <div className="col-start-8 border-l border-black" />
          <div className="col-start-9 col-end-16 border border-black w-full text-center">
            Vorschau
          </div>
          <div className="p-4 col-start-9 col-end-16 border-2 rounded-lg">
            {title ? (
              <h1>{title}</h1>
            ) : (
              <div className="h-14"></div>
            )}
            <div className="flex justify-between m-auto">
              <p>{user ? user.username : "nicht angemeldet"}</p>
              <p>{date.toLocaleDateString('de-DE')}</p>
            </div>
            <hr />
            <p>{content}</p>
          </div>
        </div>
      </div>
      <div className="block md:hidden">
        {/* handy */}
      </div>
    </div>
  );
}

export default CreatePost;
