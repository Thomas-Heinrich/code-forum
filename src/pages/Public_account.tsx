import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { mysqlip } from '../components/ip';
import { useNavigate, useParams } from 'react-router-dom';

type UserType = {
  id: number;
  username: string;
  email: string;
  password: string;
  img_path: string;
  followed: number;
  follower: number;
  usertag: string;
};

function Public_account() {
  const { urlTitle } = useParams();
  const navigate = useNavigate();
  const [user, setuser] = useState<UserType | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          `http://${mysqlip}:4000/api/user/${urlTitle}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        setuser(data);
      } catch (err) {
        console.error(err);
      }
    }

        loadUser();
  }, [urlTitle]);
  console.log(urlTitle)

  return (
    <div>
      <h2>{user?.id}</h2>
      <h2>{user?.username}</h2>
      <h2>{user?.email}</h2>
      <h2>{user?.password}</h2>
      <h2>{user?.img_path}</h2>
      <h2>{user?.followed}</h2>
      <h2>{user?.follower}</h2>
      <h2>{user?.usertag}</h2>
      </div>
  )
}

export default Public_account