import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { mysqlip } from '../components/ip';

type Project = {
  id: number;
  Title: string;
  Img_path: string;
  Descr: string;
  Content: string;
  Author: string;
  created_at: number;
};

function Projects() {
  // --- States ---
  const [data, setData] = useState<Project[]>([]);
  const navigate = useNavigate();

  // --- useEffect ---
  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch(
          'http://' + mysqlip + ':4000/api/allProjects',
        );
        const projects: Project[] = await response.json();

        setData(projects);
      } catch (err) {
        console.error(err);
      }
    }

    loadProjects();
  }, []);
  return (
    <div className="w-[80%] min-h-screen m-auto pt-25 pb-4">
      <h1 className="text-center pt-8 sm:pt-10 text-4xl font-bold ">
        Our Projects
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-300  pt-[5vh]">
        {data.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/project/${project.Title}`)}
            className="flex flex-col justify-between cursor-pointer p-4 bg-gray-300 border border-gray-900 rounded shadow-sm h-full prose max-w-none group/1"
          >
            {project.Img_path && (
              <img
                src={'/user_img/' + project.Img_path}
                alt=""
                className="w-full h-40 object-cover rounded mb-2"
                onError={(e) => {
                  e.currentTarget.src = '/user_img/defult.png';
                }}
              />
            )}
            <div className='flex flex-1 flex-col'></div>
            <h2>{project.Title}</h2>
            <ReactMarkdown>{project.Descr}</ReactMarkdown>
              <div className="p-px  w-full bg-gray-400 transition duration-500 group-hover/1:bg-red-400"></div>
            <div className="flex flex-row justify-between">
              <p>{project.Author}</p>
              <p>
                {project?.created_at &&
                  new Date(project.created_at).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
