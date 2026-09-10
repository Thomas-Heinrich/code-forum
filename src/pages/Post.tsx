import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { mysqlip } from '../components/ip';
import { useNavigate, useParams } from 'react-router-dom';

type PostType = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: number;
};

function Post() {
  const { urlTitle } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(
          `http://${mysqlip}:4000/api/Posts/${urlTitle}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadPost();
  }, [urlTitle]);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          `http://${mysqlip}:4000/api/user/${post?.author}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, [urlTitle]);
  console.log(urlTitle);
  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full h-screen pt-25">
      <div className="flex justify-center w-full h-full sm:w-[80%] m-auto pb-4 sm:rounded-0 sm:rounded-lg">
        <div className="w-[80%] border-2 p-4 rounded-lg">
          <h2>{post.title}</h2>

          <div className="flex justify-between m-auto">
            <a
              href={`/public_account/${post.author}`}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              {post.author}
            </a>

            <p>
              {post.created_at &&
                new Date(post.created_at).toLocaleDateString('de-DE')}
            </p>
          </div>

          <hr />

          <div className="pt-2 prose max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
