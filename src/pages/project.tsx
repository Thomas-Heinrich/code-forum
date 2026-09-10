import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mysqlip } from '../components/ip';
import ReactMarkdown from 'react-markdown';

type Project = {
  id: number;
  Title: string;
  Img_path: string;
  Descr: string;
  Content: string;
  Author: string;
  created_at: number;
};

function project() {
  const { urlTitle } = useParams();

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const getProject = async () => {
      try {
        const response = await fetch(
          `http://${mysqlip}:4000/api/projects/${urlTitle}`,
        );
        const data = await response.json();

        setProject(data);
      } catch (err) {
        console.log(err);
      }
    };
    getProject();
  }, [urlTitle]);
  return (
    <div className="pt-25 h-screen">
      <div className="flex justify-center border w-full sm:w-[80%] m-auto mt-4 sm:rounded-0 sm:rounded-lg">
        <div className="w-full h-fit">
          {project?.Img_path && (
            <img
              src={'/user_img/' + project.Img_path}
              alt={project?.Title}
              className="w-full max-h-80 object-cover rounded-t mb-4"
              onError={(e) => {
                e.currentTarget.src = '/user_img/defult.png';
              }}
            />
          )}
          <div className='p-4'>
            <h1>{project?.Title}</h1>
            <div className="flex flex-row justify-between">
              <p>{project?.Author}</p>
              {project?.created_at &&
                new Date(project.created_at).toLocaleDateString('de-DE')}
            </div>
            <hr />
            <div className="mt-8 prose max-w-none">
              <ReactMarkdown>{project?.Content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default project;
